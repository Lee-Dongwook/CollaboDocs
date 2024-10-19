"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import socket from "@/lib/socket";

interface ChatProps {
  id: string;
}

export default function Chat({ id }: ChatProps) {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
    socket.emit("send-message", message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive-message", (message: string) => {
      toast("New message received");
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [id]);

  return (
    <div>
      <h2 className="text-lg font-bold">Chat</h2>
      <div className="bg-gray-100 p-4 h-64 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index} className="text-gray-800">
            {msg}
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full mt-2"
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white p-2 mt-2">
        Send
      </button>
    </div>
  );
}
