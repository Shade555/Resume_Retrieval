"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSearchStore } from "@/src/store/useSearchStore";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

const bytesToMb = (value: number) => (value / (1024 * 1024)).toFixed(1);

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

function getValidationError(file: File | null): string | null {
  if (!file) {
    return "Select a PDF file first.";
  }

  if (!isPdfFile(file)) {
    return "Only PDF files are supported.";
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return `File is too large (${bytesToMb(file.size)}MB). Max allowed is 10MB.`;
  }

  return null;
}

export function UploadModal() {
  const isOpen = useSearchStore((state) => state.isUploadOpen);
  const setIsOpen = useSearchStore((state) => state.setIsUploadOpen);
  const runSearch = useSearchStore((state) => state.runSearch);
  const query = useSearchStore((state) => state.query);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  const onClose = () => setIsOpen(false);

  const onSelectFile = (file: File | null) => {
    setSelectedFile(file);
    const err = getValidationError(file);
    if (err) {
      toast.error(err);
    }
  };

  const handleUpload = async () => {
    const validationError = getValidationError(selectedFile);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("resume", selectedFile as Blob);

      const response = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Failed to upload resume text.");
      }

      setSelectedFile(null);
      toast.success("Resume uploaded successfully!");
      if (query.trim()) {
        void runSearch(undefined, 1);
      }
      onClose();
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : "Unknown upload error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#121219] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Upload Resume PDF</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 px-3 py-1 text-sm text-zinc-300 hover:bg-white/5"
          >
            Close
          </button>
        </div>

        <div
          role="button"
          tabIndex={0}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            const [file] = Array.from(event.dataTransfer.files);
            onSelectFile(file || null);
          }}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center transition ${
            isDragging
              ? "border-[#7dd3fc] bg-[#7dd3fc]/10"
              : "border-white/20 bg-[#1a1a24] hover:border-white/35"
          }`}
        >
          <p className="text-sm font-medium text-zinc-100">Drag and drop your PDF here</p>
          <p className="mt-2 text-xs text-zinc-400">or click to browse files (max 10MB)</p>
          {selectedFile ? (
            <p className="mt-4 rounded-lg border border-[#a78bfa]/35 bg-[#a78bfa]/10 px-3 py-2 text-xs text-[#d9ceff]">
              Selected: {selectedFile.name} ({bytesToMb(selectedFile.size)}MB)
            </p>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(event) => {
            const [file] = Array.from(event.target.files || []);
            onSelectFile(file || null);
          }}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-[#f472b6] via-[#a78bfa] to-[#7dd3fc] px-4 py-2 text-sm font-semibold text-[#121219] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
