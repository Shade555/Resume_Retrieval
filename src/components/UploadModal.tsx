"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSearchStore } from "@/src/store/useSearchStore";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

const bytesToMb = (value: number) => {
  const mb = value / (1024 * 1024);
  return mb < 0.1 ? mb.toFixed(2) : mb.toFixed(1);
};

const isPdfFile = (file: File) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

function getValidationErrors(files: File[]): string[] {
  if (!files || files.length === 0) {
    return ["Select at least one PDF file."];
  }

  const errors: string[] = [];
  for (const file of files) {
    if (!isPdfFile(file)) {
      errors.push(`"${file.name}" is not a PDF.`);
    }
    if (file.size > MAX_PDF_SIZE_BYTES) {
      errors.push(`"${file.name}" is too large (${bytesToMb(file.size)}MB). Max allowed is 10MB.`);
    }
  }

  return errors;
}

export function UploadModal() {
  const isOpen = useSearchStore((state) => state.isUploadOpen);
  const setIsOpen = useSearchStore((state) => state.setIsUploadOpen);
  const runSearch = useSearchStore((state) => state.runSearch);
  const query = useSearchStore((state) => state.query);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // For multiple files
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  const onClose = () => {
    if (isSubmitting) return; // Prevent closing while uploading
    setIsOpen(false);
    setSelectedFiles([]);
  };

  const onSelectFiles = (files: File[]) => {
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleUpload = async () => {
    const validationErrors = getValidationErrors(selectedFiles);

    if (validationErrors.length > 0) {
      validationErrors.forEach((err) => toast.error(err));
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadProgress(0);

      let successCount = 0;
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formData = new FormData();
        formData.append("resume", file as Blob);

        const response = await fetch("/api/parse", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          toast.error(`Failed to upload ${file.name}: ${data.error || "Unknown error"}`);
        } else {
          successCount++;
        }
        
        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }

      if (successCount > 0) {
        toast.success(`Successfully uploaded ${successCount} resume${successCount > 1 ? 's' : ''}!`);
        setSelectedFiles([]);
        if (query.trim()) {
          void runSearch(undefined, 1);
        }
        onClose();
      }
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : "Unknown upload error.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const totalSize = selectedFiles.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#121219] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Upload Resume PDF</h2>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-lg border border-white/20 px-3 py-1 text-sm text-zinc-300 hover:bg-white/5 disabled:opacity-50"
          >
            Close
          </button>
        </div>

        <div
          role="button"
          tabIndex={isSubmitting ? -1 : 0}
          onDragEnter={(event) => {
            if (isSubmitting) return;
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            if (isSubmitting) return;
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            if (isSubmitting) return;
            event.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(event) => {
            if (isSubmitting) return;
            event.preventDefault();
            setIsDragging(false);
            const files = Array.from(event.dataTransfer.files);
            onSelectFiles(files);
          }}
          onClick={() => {
            if (!isSubmitting) fileInputRef.current?.click();
          }}
          onKeyDown={(event) => {
            if (isSubmitting) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center transition relative overflow-hidden ${
            isDragging
              ? "border-[#7dd3fc] bg-[#7dd3fc]/10"
              : isSubmitting 
              ? "border-white/10 bg-[#1a1a24] opacity-80 cursor-not-allowed"
              : "border-white/20 bg-[#1a1a24] hover:border-white/35 cursor-pointer"
          }`}
        >
          {isSubmitting && (
            <div 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#f472b6] via-[#a78bfa] to-[#7dd3fc] transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          )}
          
          <p className="text-sm font-medium text-zinc-100">
            {isSubmitting ? `Uploading... ${uploadProgress}%` : "Drag and drop your PDFs here"}
          </p>
          <p className="mt-2 text-xs text-zinc-400">or click to browse files (max 10MB per file)</p>
          
          {selectedFiles.length > 0 && !isSubmitting && (
            <div className="mt-4 flex flex-col gap-2 max-h-32 overflow-y-auto w-full custom-scrollbar">
              <p className="text-xs text-zinc-300 font-semibold mb-1">
                {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected ({bytesToMb(totalSize)}MB total)
              </p>
              {selectedFiles.map((f, i) => (
                <div key={i} className="flex justify-between items-center rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-zinc-300">
                  <span className="truncate max-w-[80%]">{f.name}</span>
                  <button 
                    type="button" 
                    className="text-zinc-500 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            onSelectFiles(files);
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-xl border border-white/20 px-4 py-2 text-sm text-zinc-300 hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={isSubmitting || selectedFiles.length === 0}
            className="rounded-xl bg-gradient-to-r from-[#f472b6] via-[#a78bfa] to-[#7dd3fc] px-4 py-2 text-sm font-semibold text-[#121219] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Uploading..." : `Upload ${selectedFiles.length > 0 ? selectedFiles.length : ''} File${selectedFiles.length > 1 ? 's' : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}
