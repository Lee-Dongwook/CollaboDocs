/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import socket from "@/lib/socket";
import dynamic from "next/dynamic";
import API from "@/lib/api";

import "react-quill/dist/quill.snow.css";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function DocumentPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [content, setContent] = useState<string>("");
  const [versions, setVersions] = useState<any[]>([]);

  const fetchDocument = async () => {
    try {
      const { data } = await API.get(`/api/document/${id}`);
      setContent(data.content);
    } catch (error) {
      console.error("Failed to fetch document:", error);
    }
  };

  const fetchVersionsOfDocument = async () => {
    try {
      const { data } = await API.get(`/api/documents/${id}/versions`);
      setVersions(data);
    } catch (error) {
      console.error("Failed to fetch versions:", error);
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

  const handleChangeContent = (value: string) => {
    setContent(value);
    socket.emit("edit-document", id, value);
    API.put(`/api/document/${id}`, { content: value }).catch((error) =>
      console.error("Failed to save document: ", error)
    );
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Document ID: {id}</h1>
      <div className="mt-4">
        <QuillNoSSRWrapper
          theme="snow"
          value={content}
          onChange={handleChangeContent}
          className="bg-white p-2"
        />
      </div>
      <div className="mt-4">
        <h2 className="text-lg font-bold">Version History</h2>
        {versions.map((version, index) => (
          <div key={index} className="mt-2">
            <button
              className="bg-gray-200 p-1 rounded hover:bg-gray-300 "
              onClick={() => restoreVersionOfDocument(index)}
            >
              Restore Version {index + 1}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
