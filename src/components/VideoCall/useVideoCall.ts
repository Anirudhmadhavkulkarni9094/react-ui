"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { createClient } from "@/lib/Client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export type UseVideoCallReturn = {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  peers: { [id: string]: MediaStream };
  peerCameras: { [id: string]: boolean };
  joined: boolean;
  roomId: string | null;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  joinRoom: () => Promise<void>;
  leaveRoom: () => Promise<void>;
  toggleMic: () => void;
  toggleCamera: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
};

export type UseVideoCallOptions = {
  onUserJoin?: (id: string) => void;
  onUserLeave?: (id: string) => void;
};

export function useVideoCall(opts?: UseVideoCallOptions): UseVideoCallReturn {
  const searchParams = useSearchParams();
  const params = useParams();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [peers, setPeers] = useState<{ [id: string]: MediaStream }>({});
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [peerCameras, setPeerCameras] = useState<{ [id: string]: boolean }>({});

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<{ [peerId: string]: RTCPeerConnection }>({});
  const peerId = useRef(uuidv4());
  const channelRef = useRef<any>(null);

  // negotiation helpers
  const makingOffer = useRef(false);
  const isPolite = (remoteId: string) => peerId.current > remoteId;
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    const fromQuery = searchParams.get("room");
    const fromPath = (params as any)?.roomId as string | undefined;
    const id = fromQuery || fromPath;
    if (id) {
      setRoomId(id);
    }
  }, [searchParams, params]);

  // --- Setup Local Media ---
  const setupLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });

      stream.getTracks().forEach((t) => (t.enabled = true));

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(() => {});
      }

      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("Camera/mic error:", err);
      alert("Please allow camera and microphone access.");
      return null;
    }
  };

  // --- ICE Server Config ---
  const getIceServers = () => [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: "turn:relay.metered.ca:80",
      username: "openai",
      credential: "openai123",
    },
  ];

  // --- Create Peer Connection ---
  const createPeerConnection = (targetId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection({ iceServers: getIceServers() });

    stream.getTracks().forEach((t) => pc.addTrack(t, stream));

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) setPeers((prev) => ({ ...prev, [targetId]: remoteStream }));
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal({
          type: "ice-candidate",
          from: peerId.current,
          to: targetId,
          candidate: event.candidate,
        });
      }
    };

    pc.onnegotiationneeded = async () => {
      if (makingOffer.current || pc.signalingState !== "stable") return;
      await negotiate(pc, targetId);
    };

    peerConnections.current[targetId] = pc;
    return pc;
  };

  // --- Negotiation Helper ---
  const negotiate = async (pc: RTCPeerConnection, remoteId: string) => {
    if (pc.signalingState !== "stable") return;
    try {
      makingOffer.current = true;
      const offer = await pc.createOffer();
      if (pc.signalingState !== "stable") return;
      await pc.setLocalDescription(offer);
      await sendSignal({
        type: "offer",
        from: peerId.current,
        to: remoteId,
        sdp: pc.localDescription,
      });
    } catch (err) {
      console.error("Negotiation error:", err);
    } finally {
      makingOffer.current = false;
    }
  };

  // --- Send Signal ---
  const sendSignal = async (data: any) => {
    if (!channelRef.current) return;
    await channelRef.current.send({
      type: "broadcast",
      event: "signal",
      payload: JSON.stringify(data),
    });
  };

  // --- Join Room ---
  const joinRoom = async () => {
    if (!roomId) return alert("No Room ID found in URL");
    if (joined) return;

    const stream = await setupLocalStream();
    if (!stream) return;

    await wait(200 + Math.random() * 200);

    const channel = supabase.channel(roomId, {
      config: { broadcast: { self: false } },
    });
    channelRef.current = channel;

    channel.on("broadcast", { event: "signal" }, async ({ payload }: any) => {
      const msg = JSON.parse(payload);
      if (!msg || msg.from === peerId.current) return;
      if (msg.to && msg.to !== peerId.current) return;

      switch (msg.type) {
        case "join": {
          const pc = createPeerConnection(msg.from, stream);
          await negotiate(pc, msg.from);
          try {
            opts?.onUserJoin?.(msg.from);
          } catch (e) {
            console.warn("onUserJoin handler error", e);
          }
          break;
        }

        case "offer": {
          const remoteId = msg.from;
          const polite = isPolite(remoteId);
          const pc = peerConnections.current[remoteId] || createPeerConnection(remoteId, stream);

          const offerCollision = makingOffer.current || pc.signalingState !== "stable";

          if (offerCollision) {
            if (polite) {
              await Promise.all([
                pc.setLocalDescription({ type: "rollback" }),
                pc.setRemoteDescription(new RTCSessionDescription(msg.sdp)),
              ]);
            } else return;
          } else {
            await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          }

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await sendSignal({
            type: "answer",
            from: peerId.current,
            to: remoteId,
            sdp: pc.localDescription,
          });
          break;
        }

        case "answer": {
          const pc = peerConnections.current[msg.from];
          if (!pc) return;
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          break;
        }

        case "ice-candidate": {
          const pc = peerConnections.current[msg.from];
          if (pc && msg.candidate) await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
          break;
        }

        case "leave": {
          const pc = peerConnections.current[msg.from];
          if (pc) pc.close();
          delete peerConnections.current[msg.from];
          setPeers((prev) => {
            const updated = { ...prev };
            delete updated[msg.from];
            return updated;
          });
          try {
            opts?.onUserLeave?.(msg.from);
          } catch (e) {
            console.warn("onUserLeave handler error", e);
          }
          break;
        }

        case "camera-state": {
          setPeerCameras((prev) => ({ ...prev, [msg.from]: msg.cameraOn }));
          break;
        }
      }
    });

    await channel.subscribe(async (status: string) => {
      if (status === "SUBSCRIBED") {
        setJoined(true);
        await wait(100);
        await sendSignal({ type: "join", from: peerId.current });
      }
    });
  };

  // Auto-join when roomId detected
  useEffect(() => {
    if (roomId && !joined) {
      joinRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  // --- Leave Room ---
  const leaveRoom = async () => {
    localStream?.getTracks().forEach((t) => t.stop());
    Object.values(peerConnections.current).forEach((pc) => pc.close());
    peerConnections.current = {};
    await sendSignal({ type: "leave", from: peerId.current });
    await channelRef.current?.unsubscribe();
    setJoined(false);
    setPeers({});
    setLocalStream(null);
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
  };

  // --- Toggle Mic / Camera / Screen ---
  const toggleMic = () => {
    if (!localStream) return;
    const track = localStream.getAudioTracks()[0];
    if (track) {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    }
  };

  const toggleCamera = async () => {
    if (!localStream) return;

    if (!isCameraOff) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.stop();
        localStream.removeTrack(videoTrack);

        for (const [id, pc] of Object.entries(peerConnections.current)) {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) await sender.replaceTrack(null as any);
        }

        if (localVideoRef.current) localVideoRef.current.srcObject = null;

        await sendSignal({ type: "camera-state", from: peerId.current, cameraOn: false });

        setIsCameraOff(true);
      }
    } else {
      try {
        await new Promise((r) => setTimeout(r, 300));

        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const newTrack = newStream.getVideoTracks()[0];

        const combined = new MediaStream([...(localStream.getAudioTracks() || []), newTrack]);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = combined;
          await localVideoRef.current.play().catch(() => {});
        }

        setLocalStream(combined);

        for (const [id, pc] of Object.entries(peerConnections.current)) {
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) {
            await sender.replaceTrack(newTrack);
          } else {
            pc.addTrack(newTrack, combined);
          }

          await negotiate(pc, id);
        }

        await sendSignal({ type: "camera-state", from: peerId.current, cameraOn: true });

        setIsCameraOff(false);
      } catch (err) {
        console.error("Error re-enabling camera:", err);
        alert("Could not access camera again. Please allow permissions.");
      }
    }
  };

  const toggleScreenShare = async () => {
    if (!peerConnections.current) return;
    if (!isScreenSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      screenTrack.onended = () => toggleScreenShare();

      for (const pc of Object.values(peerConnections.current)) {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        sender?.replaceTrack(screenTrack);
      }

      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
      setIsScreenSharing(true);
    } else {
      if (!localStream) return;
      const cameraTrack = localStream.getVideoTracks()[0];
      for (const pc of Object.values(peerConnections.current)) {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        sender?.replaceTrack(cameraTrack);
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      setIsScreenSharing(false);
    }
  };

  // Ensure local video attached
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [localStream]);

  // Retry attachment
  useEffect(() => {
    let tries = 0;
    const interval = setInterval(() => {
      if (!localStream || !localVideoRef.current) return;
      if (localVideoRef.current.srcObject !== localStream) {
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.play().catch(() => {});
      }
      tries++;
      if (tries > 10) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, [localStream]);

  // Cleanup
  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      channelRef.current?.unsubscribe?.();
    };
  }, []);

  // Notify peers on tab close / unload / hide so they can remove this user quickly
  useEffect(() => {
    const sendLeaveNow = () => {
      try {
        // best-effort synchronous send via the channel object if available
        if (channelRef.current?.send) {
          channelRef.current.send({
            type: "broadcast",
            event: "signal",
            payload: JSON.stringify({ type: "leave", from: peerId.current }),
          });
        }
      } catch (e) {
        // ignore — we're in unload path
      }
    };

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      sendLeaveNow();
      // allow default behavior; not preventing unload
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendLeaveNow();
      }
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pagehide", sendLeaveNow as any);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pagehide", sendLeaveNow as any);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return {
    localVideoRef,
    peers,
    peerCameras,
    joined,
    roomId,
    isMuted,
    isCameraOff,
    isScreenSharing,
    joinRoom,
    leaveRoom,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
  };
}
