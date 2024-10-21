"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PeerConnect() {
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const callingVideoRef = useRef<HTMLVideoElement | null>(null);

  const [peerInstance, setPeerInstance] = useState<Peer | null>(null);
  const [uniqueId, setUniqueId] = useState<string>("");
  const [idToCall, setIdToCall] = useState<string>("");

  const generateRandomString = () => Math.random().toString(36).substring(2);

  const handleCall = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const call = peerInstance?.call(idToCall, stream);
        if (call) {
          call.on("stream", (userVideoStream) => {
            console.log("4");
            if (callingVideoRef.current) {
              console.log("5");
              callingVideoRef.current.srcObject = userVideoStream;
            }
          });
        }
      });
  };

  useEffect(() => {
    setUniqueId(generateRandomString());
  }, []);

  useEffect(() => {
    if (uniqueId && typeof window !== "undefined") {
      const peer: Peer = new Peer(uniqueId, {
        host: "localhost",
        port: 9000,
        path: "/myapp",
      });

      setPeerInstance(peer);

      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }

          peer.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (userVideoStream) => {
              if (callingVideoRef.current) {
                callingVideoRef.current.srcObject = userVideoStream;
              }
            });
          });
        });

      return () => {
        if (peer) {
          peer.destroy();
        }
      };
    }
  }, [uniqueId]);

  return (
    <div className="flex flex-col justify-center items-center p-12">
      <p>your id: {uniqueId}</p>
      <video className="w-72" playsInline ref={myVideoRef} autoPlay />
      <Input
        className="text-black"
        placeholder="Id to call"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
      />
      <Button onClick={handleCall}>Call</Button>
      <video className="w-72" playsInline ref={callingVideoRef} autoPlay />
    </div>
  );
}
