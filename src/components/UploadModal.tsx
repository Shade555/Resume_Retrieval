"use client";

import { useState } from "react";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: () => void;
};

export function UploadModal({ isOpen, onClose, onUploaded }: UploadModalProps) {
  const [rawText, setRawText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleUpload = async () => {
    const payload = rawText.trim();

    if (!payload) {
      setError("Paste resume text before uploading.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch("/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw_text: payload }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Failed to upload resume text.");
      }

      setRawText("");
      onUploaded();
      onClose();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unknown upload error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#121219] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">Add Resume Text</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/20 px-3 py-1 text-sm text-zinc-300 hover:bg-white/5"
          >
            Close
          </button>
        </div>

        <textarea
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
          rows={12}
          placeholder="Paste the parsed resume text here..."
          className="w-full rounded-xl border border-white/15 bg-[#1a1a24] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition focus:border-[#7dd3fc]"
        />

        {error ? <p className="mt-3 text-sm text-[#fca5a5]">{error}</p> : null}

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
