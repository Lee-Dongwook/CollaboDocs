"use client";

import React from "react";
import VideoChat from "@/components/VideoChat";
import Chat from "@/components/Chat";

interface VideoChatPageProps {
  roomId: string;
}

export default function VideoChatPage({ roomId }: VideoChatPageProps) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-6 p-4 lg:p-8">
        <div className="w-full lg:w-2/3 flex justify-center">
          <VideoChat roomId={roomId} />
        </div>
      </div>
      <div className="w-full lg:w-1/3 flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          채팅
        </h2>
        <Chat roomId={roomId} />
      </div>
    </div>
  );
}
