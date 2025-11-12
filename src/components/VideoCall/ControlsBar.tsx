"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorX,
  PhoneOff,
} from "lucide-react";

type Props = {
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  toggleMic: () => void;
  toggleCamera: () => Promise<void>;
  toggleScreenShare: () => Promise<void>;
  leaveRoom: () => Promise<void>;
};

export default function ControlsBar({
  isMuted,
  isCameraOff,
  isScreenSharing,
  toggleMic,
  toggleCamera,
  toggleScreenShare,
  leaveRoom,
}: Props) {
  const [visible, setVisible] = useState(true);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-hide after inactivity
  useEffect(() => {
    const handleActivity = () => {
      setVisible(true);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setVisible(false), 3500);
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);

    handleActivity(); // kickstart timer once

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []); // ✅ empty dependency array

  const buttonBase =
    "flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 text-white";

  return (
    <div
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-3 sm:gap-5 
      bg-white/10 backdrop-blur-xl border border-white/10 px-4 sm:px-6 py-3 rounded-full shadow-xl
      transition-all duration-500 ease-in-out
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      {/* Mic */}
      <button
        onClick={toggleMic}
        className={`${buttonBase} ${
          isMuted
            ? "bg-gray-600 hover:bg-gray-500"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      {/* Camera */}
      <button
        onClick={toggleCamera}
        className={`${buttonBase} ${
          isCameraOff
            ? "bg-gray-600 hover:bg-gray-500"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        title={isCameraOff ? "Turn On Camera" : "Turn Off Camera"}
      >
        {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
      </button>

      {/* Screen Share */}
      <button
        onClick={toggleScreenShare}
        className={`${buttonBase} ${
          isScreenSharing
            ? "bg-purple-500 hover:bg-purple-400"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
        title={isScreenSharing ? "Stop Sharing" : "Share Screen"}
      >
        {isScreenSharing ? <MonitorX size={20} /> : <MonitorUp size={20} />}
      </button>

      {/* End Call */}
      <button
        onClick={leaveRoom}
        className={`${buttonBase} bg-red-600 hover:bg-red-700`}
        title="End Call"
      >
        <PhoneOff size={20} />
      </button>
    </div>
  );
}
