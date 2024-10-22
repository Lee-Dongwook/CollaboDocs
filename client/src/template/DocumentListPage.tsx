"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/lib/api";
import { Button } from "@/components/ui/button";

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
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">문서 목록</h1>
      {isLoading ? (
        <p>Loading documents...</p>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {doc.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {new Date(doc.createdAt!).toLocaleDateString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {doc.contentPreview}
              </p>
              <Link href={`/document/${doc.id}`}>
                <Button className="bg-blue-500 text-white w-full">
                  자세히 보기
                </Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-200 dark:bg-gray-700 shadow-md rounded-lg p-4 text-center col-span-full">
          <p className="text-gray-800 dark:text-gray-300">No Data</p>
          <p className="text-gray-500 dark:text-gray-400">
            생성된 문서가 없습니다. 새 문서를 작성해보세요.
          </p>
        </div>
      )}
    </div>
  );
}
