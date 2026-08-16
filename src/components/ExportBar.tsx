"use client";

import { useSearchStore } from "@/src/store/useSearchStore";
import clsx from "clsx";
import toast from "react-hot-toast";

export function ExportBar() {
  const selectedResumeIds = useSearchStore((state) => state.selectedResumeIds);
  const clearSelection = useSearchStore((state) => state.clearSelection);
  const selectAllResults = useSearchStore((state) => state.selectAllResults);
  const results = useSearchStore((state) => state.results);

  if (selectedResumeIds.size === 0) return null;

  const handleExportCSV = () => {
    const selectedResumes = results.filter(r => selectedResumeIds.has(r.id));
    if (selectedResumes.length === 0) return;

    // Create CSV content
    const headers = ["Name", "Email", "Match Score", "Skills"];
    const rows = selectedResumes.map(r => [
      `"${(r.candidate_name || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      `${Math.round(r.similarity * 100)}%`,
      `"${(r.skills || []).join(", ")}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    // Download logic
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `candidates_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Exported ${selectedResumes.length} candidates as CSV`);
    clearSelection();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#121219]/90 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7dd3fc]/20 text-sm font-semibold text-[#7dd3fc]">
            {selectedResumeIds.size}
          </span>
          <span className="text-sm font-medium text-white">Candidates selected</span>
          
          <div className="h-4 w-px bg-white/10 mx-2" />
          
          <button 
            onClick={selectAllResults}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Select All
          </button>
          <button 
            onClick={clearSelection}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
