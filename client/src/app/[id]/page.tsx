"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useDebounce from "@/hook/useDebounce";
import API from "@/lib/api";
import socket from "@/lib/socket";
import {
  saveDocumentLocally,
  getLocalDocument,
  deleteLocalDocument,
} from "@/lib/db";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [participants, setParticipants] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const debouncedContent = useDebounce(content, 500);

  const handleOnline = () => setIsOffline(false);
  const handleOffline = () => setIsOffline(true);

  const fetchDocument = async () => {
    try {
      const localData = await getLocalDocument(id);
      if (localData) {
        setContent(localData.content);
        setIsOffline(true);
      } else {
        const { data } = await API.get(`/api/document/${id}`);
        setContent(data.content);
      }
    } catch (error) {
      console.error("Failed to fetch document:", error);
    }
  };

  const handleChangeContent = (value: string) => {
    setContent(value);
    socket.emit("edit-document", id, value);
  };

  const sendMessage = () => {
    socket.emit("send-message", message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage("");
  };

  const syncData = async () => {
    if (!isOffline) {
      const localData = await getLocalDocument(id);
      if (localData) {
        try {
          await API.put(`/api/document/${id}`, { content: localData.content });
          await deleteLocalDocument(id);
          toast.success("Changes synced with server");
        } catch (error) {
          console.error("Failed to sync with server: ", error);
        }
      }
    }
  };

  useEffect(() => {
    fetchDocument();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (debouncedContent) {
      if (isOffline) {
        saveDocumentLocally(id, debouncedContent);
      } else {
        API.put(`/api/document/${id}`, { content: debouncedContent })
          .then(() => {
            deleteLocalDocument(id);
          })
          .catch((error) => {
            console.error("Failed to save document: ", error);
            saveDocumentLocally(id, debouncedContent);
          });
      }
    }
  }, [debouncedContent, isOffline, id]);

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

  useEffect(() => {
    window.addEventListener("online", syncData);

    return () => {
      window.removeEventListener("online", syncData);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isOffline]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Editing Document</h1>
      {isOffline && (
        <div className="bg-yellow-300 text-yellow-900 p-2 mb-2 rounded">
          You are offline. Changes will be synced when you are back online.
        </div>
      )}
      <textarea
        className="border p-2 w-full h-64"
        value={content}
        onChange={(e) => handleChangeContent(e.target.value)}
      />
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
