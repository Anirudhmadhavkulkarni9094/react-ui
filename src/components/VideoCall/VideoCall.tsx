"use client";

import React, { useCallback, useState, useEffect } from "react";
import VideoGrid from "./VideoGrid";
import ControlsBar from "./ControlsBar";
import { useVideoCall } from "./useVideoCall";
import Toaster from "./Toaster";

export default function VideoCallContainer() {
  const [toasts, setToasts] = useState<{ id: string; message: string }[]>([]);

  const addToast = useCallback((message: string, ttl = 4000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts((s) => [...s, { id, message }]);
    setTimeout(() => setToasts((s) => s.filter((t) => t.id !== id)), ttl);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => setToasts((s) => s.filter((t) => t.id !== id)), []);

  const {
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
  } = useVideoCall({
    onUserJoin: (id) => {
      console.debug("onUserJoin callback", id);
      addToast(`User ${id.slice(0, 5)} joined`);
    },
    onUserLeave: (id) => {
      console.debug("onUserLeave callback", id);
      addToast(`User ${id.slice(0, 5)} left`);
    },
  });

  // sanity-check toast when local user joins
  useEffect(() => {
    if (joined) {
      console.debug("local joined -> showing toast");
      addToast("You joined the room");
    }
  }, [joined, addToast]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#1b1c1e] to-[#2a2d31] text-white flex flex-col items-center justify-center overflow-hidden">
      {!joined ? (
        <div className="flex flex-col items-center gap-6 p-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">🎥 Group Video Call</h1>
          <p className="text-gray-400 text-sm sm:text-base">Joining room: <span className="text-white font-medium">{roomId || "..."}</span></p>
          <button onClick={joinRoom} className="bg-green-600 hover:bg-green-700 active:scale-95 transition px-6 py-3 rounded-full text-lg font-semibold shadow-lg">Join Room</button>
        </div>
      ) : (
        <div className="relative flex flex-col h-full w-full overflow-hidden">
          <VideoGrid localVideoRef={localVideoRef} peers={peers} peerCameras={peerCameras} isCameraOff={isCameraOff} />
          <ControlsBar isMuted={isMuted} isCameraOff={isCameraOff} isScreenSharing={isScreenSharing} toggleMic={toggleMic} toggleCamera={toggleCamera} toggleScreenShare={toggleScreenShare} leaveRoom={leaveRoom} />
        </div>
      )}
      {/* Render toaster at root so it's always visible */}
      <Toaster toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
