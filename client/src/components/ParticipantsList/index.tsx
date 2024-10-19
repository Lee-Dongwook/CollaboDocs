"use client";

import { useState, useEffect } from "react";
import socket from "@/lib/socket";

interface ParticipantsListProps {
  id: string;
}

export default function ParticipantsList({ id }: ParticipantsListProps) {
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    socket.emit("join-document", id);

    socket.on("update-participants", (participants: string[]) => {
      setParticipants(participants);
    });

    return () => {
      socket.off("update-participants");
    };
  }, [id]);

  return (
    <div>
      <h2 className="text-lg font-bold">Participants</h2>
      <ul>
        {participants.map((participant, index) => (
          <li key={index} className="text-gray-700">
            {participant}
          </li>
        ))}
      </ul>
    </div>
  );
}
