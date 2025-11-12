// "use client";

// import { useRef, useState, useEffect } from "react";
// import { useSearchParams, useParams } from "next/navigation";
// import { createClient } from "@/lib/Client";
// import { v4 as uuidv4 } from "uuid";

// const supabase = createClient();

// export default function MultiVideoPage() {
//   const searchParams = useSearchParams();
//   const params = useParams();

//   const [roomId, setRoomId] = useState<string | null>(null);
//   const [joined, setJoined] = useState(false);
//   const [peers, setPeers] = useState<{ [id: string]: MediaStream }>({});
//   const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//   const [isMuted, setIsMuted] = useState(false);
//   const [isCameraOff, setIsCameraOff] = useState(false);
//   const [isScreenSharing, setIsScreenSharing] = useState(false);

//   const localVideoRef = useRef<HTMLVideoElement>(null);
//   const peerConnections = useRef<{ [peerId: string]: RTCPeerConnection }>({});
//   const peerId = useRef(uuidv4());
//   const channelRef = useRef<any>(null);

//   // negotiation helpers
//   const makingOffer = useRef(false);
//   const isPolite = (remoteId: string) => peerId.current > remoteId;
//   const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

//   useEffect(() => {
//     const fromQuery = searchParams.get("room");
//     const fromPath = params?.roomId as string | undefined;
//     const id = fromQuery || fromPath;
//     if (id) {
//       console.log("Detected Room ID:", id);
//       export { default } from "./VideoCall/VideoCall";
//     }
