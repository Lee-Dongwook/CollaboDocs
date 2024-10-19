"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

interface DocumentEditorProps {
  content: string;
  onChange: (value: string) => void;
}

export default function DocumentEditor({
  content,
  onChange,
}: DocumentEditorProps) {
  return (
    <div className="mt-4">
      <QuillNoSSRWrapper
        theme="snow"
        value={content}
        onChange={onChange}
        className="bg-white p-2"
      />
    </div>
  );
}
