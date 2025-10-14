"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/Client";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();

export default function MultiVideoPage() {
  const [roomId, setRoomId] = useState("");
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

  // --- Setup Local Media ---
 const setupLocalStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);

    // wait for React to render video
    setTimeout(() => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    }, 100);

    return stream;
  } catch (err) {
    console.error("Camera/mic permission denied:", err);
    alert("Please allow camera and microphone access.");
  }
};


  // --- Create Peer Connection ---
  const createPeerConnection = (targetId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:relay.metered.ca:80",
          username: "openai",
          credential: "openai123",
        },
      ],
    });

    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
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

    pc.oniceconnectionstatechange = () =>
      console.log(`ICE(${targetId}):`, pc.iceConnectionState);

    peerConnections.current[targetId] = pc;
    return pc;
  };

  // --- Send Message through Supabase ---
  const sendSignal = async (data: any) => {
    await channelRef.current.send({
      type: "broadcast",
      event: "signal",
      payload: JSON.stringify(data),
    });
  };

  // --- Join Room ---
  const joinRoom = async () => {
    if (!roomId) return alert("Enter Room ID");

    const stream : any = await setupLocalStream();
    const channel = supabase.channel(roomId, {
      config: { broadcast: { self: false } },
    });
    channelRef.current = channel;

    channel.on("broadcast", { event: "signal" }, async ({ payload }: any) => {
      const msg = JSON.parse(payload);
      if (!msg || msg.from === peerId.current) return;

      switch (msg.type) {
        case "join": {
          const pc = createPeerConnection(msg.from, stream);
          const offer = await pc.createOffer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true,
          });
          await pc.setLocalDescription(offer);
          sendSignal({
            type: "offer",
            from: peerId.current,
            to: msg.from,
            sdp: offer,
          });
          break;
        }

        case "offer": {
          if (msg.to !== peerId.current) return;
          const pc = createPeerConnection(msg.from, stream);
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal({
            type: "answer",
            from: peerId.current,
            to: msg.from,
            sdp: answer,
          });
          break;
        }

        case "answer": {
          if (msg.to !== peerId.current) return;
          const pc = peerConnections.current[msg.from];
          if (pc && !pc.currentRemoteDescription) {
            await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          }
          break;
        }

        case "ice-candidate": {
          if (msg.to !== peerId.current) return;
          const pc = peerConnections.current[msg.from];
          if (pc) await pc.addIceCandidate(new RTCIceCandidate(msg.candidate));
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
        sendSignal({ type: "join", from: peerId.current });
      }
    });
  };

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

  // --- Toggle Mic ---
  const toggleMic = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setIsMuted((prev) => !prev);
  };

  // --- Toggle Camera ---
  const toggleCamera = async () => {
    if (!localStream) return;
    const videoTrack = localStream.getVideoTracks()[0];
    if (!isCameraOff) {
      videoTrack.stop();
      setIsCameraOff(true);
    } else {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const newTrack = newStream.getVideoTracks()[0];
      const sender = Object.values(peerConnections.current)
        .map((pc) => pc.getSenders().find((s) => s.track?.kind === "video"))
        .find(Boolean);
      sender?.replaceTrack(newTrack);
      localStream.removeTrack(videoTrack);
      localStream.addTrack(newTrack);
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      setIsCameraOff(false);
    }
  };

  // --- Screen Share ---
  const toggleScreenShare = async () => {
    if (!peerConnections.current) return;

    if (!isScreenSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
      for (const pc of Object.values(peerConnections.current)) {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        sender?.replaceTrack(screenTrack);
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
      screenTrack.onended = () => toggleScreenShare();
      setIsScreenSharing(true);
    } else {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      const cameraTrack = cameraStream.getVideoTracks()[0];
      for (const pc of Object.values(peerConnections.current)) {
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        sender?.replaceTrack(cameraTrack);
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      setIsScreenSharing(false);
    }
  };

  // --- UI ---
  return (
    <div className="h-screen bg-[#202124] text-white flex flex-col items-center justify-center">
      {!joined ? (
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-semibold">🎥 Group Video Call</h1>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="px-3 py-2 rounded text-black"
            />
            <button
              onClick={joinRoom}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col">
          {/* ---------- Video Grid ---------- */}
          {(() => {
            const totalUsers = Object.keys(peers).length + 1;
            const gridCols =
              totalUsers === 1
                ? "grid-cols-1 place-items-center"
                : totalUsers === 2
                ? "grid-cols-2"
                : totalUsers === 3
                ? "grid-cols-2 sm:grid-cols-3"
                : totalUsers <= 4
                ? "grid-cols-2 sm:grid-cols-2"
                : totalUsers <= 6
                ? "grid-cols-3"
                : "grid-cols-3 sm:grid-cols-4";

            return (
              <div
                className={`flex-1 grid ${gridCols} gap-4 p-6 transition-all duration-300`}
              >
                {/* Local Video */}
                <div
                  className={`relative bg-black rounded-xl overflow-hidden border border-white/10 ${
                    totalUsers === 1 ? "h-[80vh] w-full" : "h-[35vh] sm:h-[45vh]"
                  }`}
                >
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
                    className={`relative bg-black rounded-xl overflow-hidden border border-white/10 ${
                      totalUsers <= 2 ? "h-[70vh]" : "h-[35vh] sm:h-[45vh]"
                    }`}
                  >
                    <video
                      autoPlay
                      playsInline
                      ref={(v) => {
                        if (v && !v.srcObject) v.srcObject = stream;
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
