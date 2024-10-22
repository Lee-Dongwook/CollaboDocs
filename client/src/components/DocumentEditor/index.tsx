/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import QuillEditor from "@/components/QuillEditor";
import useDebounce from "@/hooks/useDebounce";
import API from "@/lib/api";
import socket from "@/lib/socket";
import {
  saveDocumentLocally,
  getLocalDocument,
  deleteLocalDocument,
} from "@/lib/db";
import { toast } from "react-hot-toast";

interface DocumentEditorProps {
  id: string;
}

export default function DocumentEditor({ id }: DocumentEditorProps) {
  const [content, setContent] = useState<string>("");
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
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

  useEffect(() => {
    fetchDocument();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    socket.connect();
    socket.emit("join-document", id);

    socket.on("receive-edit", (updatedContent: string) => {
      setContent(updatedContent);
    });

    socket.on("user-joined", (userId: string) => {
      setCollaborators((prev) => [...prev, userId]);
      toast(`${userId} joined the document`);
    });

    socket.on("user-left", (userId: string) => {
      setCollaborators((prev) => prev.filter((user) => user !== userId));
      toast(`${userId} left the document`);
    });

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (debouncedContent) {
      setIsSaving(true);
      if (isOffline) {
        saveDocumentLocally(id, debouncedContent);
        setIsSaving(true);
      } else {
        API.put(`/api/document/${id}`, { content: debouncedContent })
          .then(() => {
            deleteLocalDocument(id);
            setIsSaving(false);
            toast.success("Document saved");
          })
          .catch((error) => {
            console.error("Failed to save document: ", error);
            saveDocumentLocally(id, debouncedContent);
            setIsSaving(false);
          });
      }
    }
  }, [debouncedContent, isOffline, id]);

  return (
    <div className="mt-4">
      {isOffline && (
        <div className="bg-yellow-300 text-yellow-900 p-2 mb-2 rounded">
          You are offline. Changes will be synced when you are back online.
        </div>
      )}
      {isSaving && (
        <div className="bg-blue-300 text-blue-900 p-2 mb-2 rounded">
          Saving document ...
        </div>
      )}
      <QuillEditor value={content} onChange={handleChangeContent} />
      <div className="mt-4">
        <h2 className="text-lg font-bold">Collaborators</h2>
        <ul className="list-disc ml-4">
          {collaborators.map((userId) => (
            <li key={userId} className="text-gray-800">
              {userId}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
