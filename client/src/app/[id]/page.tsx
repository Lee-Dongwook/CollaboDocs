"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import socket from "@/lib/socket";

export default function Page() {
  const [participants, setParticipants] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = () => {
    socket.emit("send-message", message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("update-participants", (participants: string[]) => {
      setParticipants(participants);
    });

    return () => {
      socket.off("update-participants");
    };
  }, []);

  useEffect(() => {
    socket.on("receive-message", (message: string) => {
      toast("New message received");
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Participants</h2>
      <ul>
        {participants.map((participant, index) => (
          <li key={index} className="text-gray-700">
            {participant}
          </li>
        ))}
      </ul>
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
        {" "}
        Send
      </button>
    </div>
  );
}
