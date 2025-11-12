"use client";

import React from "react";
import { User } from "lucide-react";

type Props = {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  peers: { [id: string]: MediaStream };
  peerCameras: { [id: string]: boolean };
  isCameraOff: boolean;
};

export default function VideoGrid({ localVideoRef, peers, peerCameras, isCameraOff }: Props) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-6 transition-all duration-300 flex-1 items-center justify-center place-items-center`}
      style={{ height: "100%", gridAutoRows: "1fr" }}
    >
      {/* ---------- LOCAL VIDEO ---------- */}
      <div className="relative bg-black rounded-2xl overflow-hidden border border-white/10 w-full h-full flex items-center justify-center aspect-video max-h-[50vh]">
        {isCameraOff ? (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-300">
            <div className="bg-gray-700/40 rounded-full p-4 sm:p-5 mb-2">
              <User size={36} className="opacity-80" />
            </div>
            <span className="text-sm sm:text-base text-gray-400">
              Camera Off
            </span>
          </div>
        ) : (
          <video
            ref={localVideoRef as any}
            autoPlay
            playsInline
            muted
            className="object-cover w-full h-full rounded-2xl"
          />
        )}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-xs sm:text-sm px-2 py-1 rounded-full">
          You
        </div>
      </div>

      {/* ---------- PEERS ---------- */}
      {Object.entries(peers).map(([id, stream]) => {
        const cameraOn = peerCameras[id] ?? true;
        return (
          <div
            key={id}
            className="relative bg-black rounded-2xl overflow-hidden border border-white/10 w-full h-full flex items-center justify-center aspect-video max-h-[50vh]"
          >
            {cameraOn ? (
              <video
                autoPlay
                playsInline
                ref={(v) => {
                  if (v && stream && v.srcObject !== stream)
                    v.srcObject = stream;
                }}
                className="object-cover w-full h-full rounded-2xl"
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-gray-300">
                <div className="bg-gray-700/40 rounded-full p-4 sm:p-5 mb-2">
                  <User size={36} className="opacity-80" />
                </div>
                <span className="text-sm sm:text-base text-gray-400">
                  Camera Off
                </span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-xs sm:text-sm px-2 py-1 rounded-full">
              {id.slice(0, 5)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
