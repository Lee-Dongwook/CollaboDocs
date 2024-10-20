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

interface DocumentEditorProps {
  id: string;
}

export default function DocumentEditor({ id }: DocumentEditorProps) {
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

  useEffect(() => {
    fetchDocument();

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
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

  return (
    <div className="mt-4">
      {isOffline && (
        <div className="bg-yellow-300 text-yellow-900 p-2 mb-2 rounded">
          You are offline. Changes will be synced when you are back online.
        </div>
      )}
      <QuillEditor value={content} onChange={handleChangeContent} />
    </div>
  );
}
