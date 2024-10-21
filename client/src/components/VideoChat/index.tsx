"use client";

import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Peer from "peerjs";

const socket = io("http://localhost:4000");

interface VideoChatProps {
  roomId: string;
}

export default function VideoChat({ roomId }: VideoChatProps) {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);

  useEffect(() => {
    const peer = new Peer("", {
      host: "localhost",
      port: 4000,
      path: "/myapp",
    });

    peer.on("open", (id) => {
      setPeerId(id);
      socket.emit("join-room", roomId, id);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        peer.on("call", (call) => {
          call.answer(stream);

          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });

        socket.on("user-connected", (userId) => {
          const call = peer.call(userId, stream);
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          });
        });
      });

    peerRef.current = peer;

    return () => {
      peer.destroy();
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <video ref={localVideoRef} autoPlay muted className="w-1/2 rounded-lg" />
      <video ref={remoteVideoRef} autoPlay className="w-1/2 rounded-lg" />
      {peerId && <p>Peer ID: {peerId}</p>}
    </div>
  );
}
