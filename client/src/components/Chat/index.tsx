"use client";

import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";

const socket = io("http://localhost:4000"); // Signaling 서버 주소

interface ChatProps {
  roomId: string;
}

interface Message {
  sender: string;
  text: string;
}

export default function Chat({ roomId }: ChatProps) {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("receive-message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.emit("join-room", roomId);

    return () => {
      socket.off("receive-message");
      socket.emit("leave-room", roomId);
    };
  }, [roomId]);

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      sender: "You",
      text: message,
    };

    socket.emit("send-message", { ...newMessage, roomId });
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
    scrollToBottom();
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "You" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-3 py-2 rounded-lg ${
                msg.sender === "You"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
              }`}
            >
              <span className="font-semibold">{msg.sender}: </span>
              <span>{msg.text}</span>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className="p-2 border-t border-gray-300 dark:border-gray-700">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <Button
          onClick={sendMessage}
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
