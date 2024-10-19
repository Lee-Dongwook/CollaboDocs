"use client";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const QuillNoSSRWrapper = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  return (
    <QuillNoSSRWrapper
      theme="snow"
      value={value}
      onChange={onChange}
      className="bg-white p-2"
    />
  );
}
