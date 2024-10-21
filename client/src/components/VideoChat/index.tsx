"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { io } from "socket.io-client";
import Peer from "peerjs";

const socket = io("http://localhost:4000");

interface VideoChatProps {
  roomId: string;
}

export default function VideoChat({ roomId }: VideoChatProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const [peerId, setPeerId] = useState<string | null>(null);
  const [remoteStreamAvailable, setRemoteStreamAvailable] = useState(false);

  useEffect(() => {
    const existingPeerId = searchParams.get("peerId");

    const peer = new Peer(existingPeerId || "", {
      host: "localhost",
      port: 4000,
      path: "/myapp",
    });

    peer.on("open", (id) => {
      setPeerId(id);
      socket.emit("join-room", roomId, id);

      if (!existingPeerId) {
        router.replace(`?peerId=${id}`);
      }
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
              setRemoteStreamAvailable(true); // 원격 스트림이 수신되었음을 표시
            }
          });
        });

        socket.on("user-connected", (userId) => {
          const call = peer.call(userId, stream);
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              setRemoteStreamAvailable(true); // 원격 스트림이 수신되었음을 표시
            }
          });
        });
      });

    peerRef.current = peer;

    return () => {
      peer.destroy();
      socket.disconnect();
    };
  }, [roomId, searchParams, router]);

  return (
    <div className="flex flex-row justify-center items-center space-x-4">
      <video ref={localVideoRef} autoPlay muted className="w-1/2 rounded-lg" />

      {/* 원격 비디오 또는 기본 이미지 */}
      {remoteStreamAvailable ? (
        <video ref={remoteVideoRef} autoPlay className="w-1/2 rounded-lg" />
      ) : (
        <Image
          src="https://via.placeholder.com/400x300?text=Waiting+for+remote+stream"
          alt="Waiting for remote stream..."
          width={300}
          height={300}
          className="w-1/2 rounded-lg object-cover"
        />
      )}
    </div>
  );
}
