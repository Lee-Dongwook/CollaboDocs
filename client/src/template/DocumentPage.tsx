/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";

import DocumentEditor from "@/components/DocumentEditor";
import VersionHistory from "@/components/VersionHistory";
import ParticipantsList from "@/components/ParticipantsList";
import Chat from "@/components/Chat";
import useDebounce from "@/hook/useDebounce";
import socket from "@/lib/socket";
import API from "@/lib/api";

interface DocumentPageProps {
  params: {
    id: string;
  };
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const { id } = params;

  const [content, setContent] = useState<string>("");
  const [versions, setVersions] = useState<any[]>([]);
  const debouncedContent = useDebounce(content, 500);

  const fetchDocument = async () => {
    try {
      const { data } = await API.get(`/api/document/${id}`);
      setContent(data.content);
    } catch (error) {
      console.error("Failed to fetch document: ", error);
    }
  };

  const fetchVersionsOfDocument = async () => {
    try {
      const { data } = await API.get(`/api/documents/${id}/versions`);
      setVersions(data);
    } catch (error) {
      console.error("Failed to fetch versions: ", error);
    }
  };

  const restoreVersionOfDocument = async (index: number) => {
    try {
      await API.put(`/api/documents/${id}/restore`, { versionIndex: index });
      const { data } = await API.get(`/api/documents/${id}`);
      setContent(data.content);
    } catch (error) {
      console.error("Failed to restore version:", error);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchDocument();
    fetchVersionsOfDocument();

    socket.connect();
    socket.emit("join-document", id);

    socket.on("receive-edit", (updatedContent: string) => {
      setContent(updatedContent);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (debouncedContent) {
      API.put(`/api/document/${id}`, { content: debouncedContent }).catch(
        (error) => console.error("Failed to save document", error)
      );
    }
  }, [debouncedContent]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Editing Document</h1>
        <DocumentEditor id={id} />
        <VersionHistory
          versions={versions}
          onRestore={restoreVersionOfDocument}
        />
        <ParticipantsList id={id} />
        <Chat id={id} />
      </div>
    </div>
  );
}
