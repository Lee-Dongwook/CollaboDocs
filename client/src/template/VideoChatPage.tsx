"use client";

import React from "react";
import VideoChat from "@/components/VideoChat";
import Chat from "@/components/Chat";

interface VideoChatPageProps {
  roomId: string;
}

export default function VideoChatPage({ roomId }: VideoChatPageProps) {
  return (
    <div className="flex flex-row lg:flex-row p-4 lg:p-8 space-y-4 lg:space-y-0 lg:space-x-6">
      <div className="w-full lg:w-2/3 flex justify-center">
        <VideoChat roomId={roomId} />
      </div>

      <div className="w-full lg:w-1/3 flex flex-col space-y-4">
        <Chat roomId={roomId} />
      </div>
    </div>
  );
}
