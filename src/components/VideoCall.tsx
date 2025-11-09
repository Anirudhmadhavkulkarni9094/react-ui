"use client";

import { useRef, useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { createClient } from "@/lib/Client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export default function MultiVideoPage() {
  const searchParams = useSearchParams();
  const params = useParams();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);
  const [peers, setPeers] = useState<{ [id: string]: MediaStream }>({});
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<{ [peerId: string]: RTCPeerConnection }>({});
  const peerId = useRef(uuidv4());
  const channelRef = useRef<any>(null);

  // negotiation helpers
  const makingOffer = useRef(false);
  const isPolite = (remoteId: string) => peerId.current > remoteId;
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

  // --- Detect roomId from URL (query ?room=xxx or dynamic /room/[id]) ---
  useEffect(() => {
    const fromQuery = searchParams.get("room");
    const fromPath = params?.roomId as string | undefined;
    const id = fromQuery || fromPath;
    if (id) {
      console.log("Detected Room ID:", id);
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
      if (remoteStream)
        setPeers((prev) => ({ ...prev, [targetId]: remoteStream }));
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
          break;
        }

        case "offer": {
          const remoteId = msg.from;
          const polite = isPolite(remoteId);
          const pc =
            peerConnections.current[remoteId] ||
            createPeerConnection(remoteId, stream);

          const offerCollision =
            makingOffer.current || pc.signalingState !== "stable";

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
          if (pc && msg.candidate)
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
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
          break;
        }
      }
    });

    await channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        console.log("✅ Joined room:", roomId);
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
    // 🔴 TURN CAMERA OFF COMPLETELY
    const videoTrack = localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.stop(); // LED off
      localStream.removeTrack(videoTrack);

      for (const pc of Object.values(peerConnections.current)) {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) await sender.replaceTrack(null);
      }

      // Clear local preview
      if (localVideoRef.current) localVideoRef.current.srcObject = null;

      setIsCameraOff(true);
    }
  } else {
    // 🟢 TURN CAMERA ON AGAIN
    try {
      // Small delay gives Chrome time to release webcam
      await new Promise((r) => setTimeout(r, 300));

      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const newTrack = newStream.getVideoTracks()[0];

      // Update local preview
      const updatedStream = new MediaStream([
        ...(localStream.getAudioTracks() || []),
        newTrack,
      ]);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = updatedStream;
        await localVideoRef.current.play().catch(() => {});
      }

      setLocalStream(updatedStream);

      // Replace the track in every peer connection
      for (const pc of Object.values(peerConnections.current)) {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");

        if (sender) {
          await sender.replaceTrack(newTrack);
        } else {
          // 🧠 In case peer connection lost sender reference
          pc.addTrack(newTrack, updatedStream);
        }

        // ⚡ Force renegotiation so remote can receive new video
        await negotiate(pc, /* remoteId */ Object.keys(peerConnections.current)[0]);
      }

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
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
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

  // --- Ensure local video attached (fix black screen) ---
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [localStream]);

  // Retry attachment (safety)
  useEffect(() => {
    let tries = 0;
    const interval = setInterval(() => {
      if (!localStream || !localVideoRef.current) return;
      if (localVideoRef.current.srcObject !== localStream) {
        console.log("Reattaching local video...");
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.play().catch(() => {});
      }
      tries++;
      if (tries > 10) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, [localStream]);

  // --- Cleanup ---
  useEffect(() => {
    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      channelRef.current?.unsubscribe?.();
    };
  }, []);

  // --- UI ---
  return (
    <div className="h-screen bg-[#202124] text-white flex flex-col items-center justify-center">
      {!joined ? (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-semibold">🎥 Group Video Call</h1>
          <p className="text-gray-400">Joining room: {roomId || "..."}</p>
          <button
            onClick={joinRoom}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col">
          {/* ---------- Video Grid ---------- */}
          {(() => {
            const totalUsers = Object.keys(peers).length + 1;
            const gridCols =
              totalUsers <= 2
                ? "grid-cols-2"
                : totalUsers <= 4
                ? "grid-cols-2 sm:grid-cols-2"
                : "grid-cols-3 sm:grid-cols-4";

            return (
              <div
                className={`flex-1 grid ${gridCols} gap-4 p-6 transition-all duration-300 bg-gray-600`}
              >
                {/* Local Video */}
                <div className="relative bg-black rounded-xl overflow-hidden border border-white/10 h-full">
                  {isCameraOff ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <span>📷 Camera Off</span>
                    </div>
                  ) : (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="object-cover w-full h-full"
                    />
                  )}
                  <span className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">
                    You
                  </span>
                </div>

                {/* Remote Videos */}
                {Object.entries(peers).map(([id, stream]) => (
                  <div
                    key={id}
                    className="relative bg-black rounded-xl overflow-hidden border border-white/10"
                  >
                    <video
                      autoPlay
                      playsInline
                      ref={(v) => {
                        if (v && stream && v.srcObject !== stream)
                          v.srcObject = stream;
                      }}
                      className="object-cover w-full h-full"
                    />
                    <span className="absolute bottom-2 left-2 text-xs bg-black/50 px-2 py-1 rounded">
                      {id.slice(0, 5)}
                    </span>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* ---------- Controls ---------- */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full">
            <button
              onClick={toggleMic}
              className={`px-4 py-2 rounded-full ${
                isMuted ? "bg-gray-600" : "bg-blue-600"
              }`}
            >
              {isMuted ? "🎙️ Unmute" : "🔇 Mute"}
            </button>

            <button
              onClick={toggleCamera}
              className={`px-4 py-2 rounded-full ${
                isCameraOff ? "bg-gray-600" : "bg-blue-600"
              }`}
            >
              {isCameraOff ? "📷 On" : "📷 Off"}
            </button>

            <button
              onClick={toggleScreenShare}
              className={`px-4 py-2 rounded-full ${
                isScreenSharing ? "bg-indigo-500" : "bg-indigo-600"
              }`}
            >
              {isScreenSharing ? "🛑 Stop Share" : "🖥️ Share"}
            </button>

            <button
              onClick={leaveRoom}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full"
            >
              ❌ End
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
