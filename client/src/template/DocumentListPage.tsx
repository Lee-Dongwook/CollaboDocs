"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Document {
  id?: string;
  title?: string;
  createdAt?: string;
  contentPreview?: string;
}

export default function DocumentListPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const { data } = await API.get(`/api/documents`);

        if (data.length === 0) {
          const dummyData = [
            {
              id: "1",
              title: "기본 데이터",
              createdAt: new Date().toISOString(),
              contentPreview: "새로운 Document를 추가해주세요.",
            },
          ];

          setDocuments(dummyData);
        } else {
          setDocuments(data);
        }
      } catch (error) {
        console.error("Failed to fetch documents: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center"></div>
  );
}
