"use client";

import { useState } from "react";
import clsx from "clsx";
import { useSearchStore } from "@/src/store/useSearchStore";

type ResumeResult = {
  id: string;
  candidate_name: string | null;
  email: string | null;
  skills: string[] | null;
  raw_text: string | null;
  similarity: number;
};

type ResumeCardProps = {
  resume: ResumeResult;
  query?: string;
};

// Simple text highlighter that splits on query words
function HighlightedText({ text, query }: { text: string; query?: string }) {
  if (!query || !text) return <span>{text || "No preview available for this resume."}</span>;
  
  // Extract words greater than 2 chars to avoid highlighting "and", "or", "a" etc.
  const words = query.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2);
  if (words.length === 0) return <span>{text}</span>;

  // Create a regex to match any of the words
  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-[#f472b6]/30 text-white px-1 rounded-sm">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// Generate a snippet centered around the first match
function getSnippet(text: string, query?: string): string {
  if (!query || !text) return text;
  
  const words = query.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2);
  if (words.length === 0) return text;

  const regex = new RegExp(`(${words.join("|")})`, "i");
  const match = text.match(regex);
  
  if (match && match.index !== undefined) {
    const start = Math.max(0, match.index - 80);
    const end = Math.min(text.length, match.index + 160);
    let snippet = text.substring(start, end);
    if (start > 0) snippet = "..." + snippet;
    if (end < text.length) snippet = snippet + "...";
    return snippet;
  }
  
  return text.substring(0, 240) + (text.length > 240 ? "..." : "");
}

export function ResumeCard({ resume, query }: ResumeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scorePercent = Math.round(resume.similarity * 100);
  const snippet = getSnippet(resume.raw_text || "", query);
  
  const selectedResumeIds = useSearchStore((state) => state.selectedResumeIds);
  const toggleResumeSelection = useSearchStore((state) => state.toggleResumeSelection);
  const isSelected = selectedResumeIds.has(resume.id);

  const flaggedResumeIds = useSearchStore((state) => state.flaggedResumeIds);
  const toggleFlag = useSearchStore((state) => state.toggleFlag);
  const isFlagged = flaggedResumeIds.has(resume.id);

  return (
    <>
      <article 
        className={clsx(
          "rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-sm",
          "flex flex-col h-full relative transition-colors",
          isSelected && "border-[#7dd3fc]/50 bg-[#7dd3fc]/10"
        )}
      >
        <div className="absolute top-5 right-5 flex items-center gap-2">
          <button
            onClick={() => toggleFlag(resume.id)}
            className={clsx(
              "flex h-6 w-6 items-center justify-center rounded-full transition-colors",
              isFlagged ? "bg-amber-500/20 text-amber-500" : "bg-[var(--panel-alt)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
            title={isFlagged ? "Remove star" : "Star candidate"}
          >
            <svg className="h-4 w-4" fill={isFlagged ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isFlagged ? 0 : 2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>
          
          <button 
            onClick={() => toggleResumeSelection(resume.id)}
            className={clsx(
              "flex h-5 w-5 items-center justify-center rounded border transition-colors",
              isSelected ? "bg-[#7dd3fc] border-[#7dd3fc]" : "border-[var(--text-secondary)] bg-[var(--panel-alt)] hover:border-[var(--text-primary)]"
            )}
            title={isSelected ? "Deselect" : "Select for export"}
          >
            {isSelected && (
              <svg className="h-3.5 w-3.5 text-[var(--panel)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-start justify-between gap-3 pr-16">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              {resume.candidate_name || "Unnamed Candidate"}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {resume.email ? (
                <a href={`mailto:${resume.email}`} className="hover:text-[var(--text-primary)] transition-colors">
                  {resume.email}
                </a>
              ) : "No email provided"}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-[#6ee7b7]/30 bg-[#6ee7b7]/10 px-3 py-1 text-xs font-medium text-[#6ee7b7]">
            {scorePercent}% match
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(resume.skills || []).slice(0, 8).map((skill) => (
            <span
              key={`${resume.id}-${skill}`}
              className="rounded-full border border-[#a78bfa]/40 bg-[#a78bfa]/15 px-3 py-1 text-xs text-[#d6cbff]"
            >
              {skill}
            </span>
          ))}
        </div>

        <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)] flex-1">
          <HighlightedText text={snippet} query={query} />
        </p>
        
        <div className="mt-4 pt-4 border-t border-[var(--border)]">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-[#a78bfa] hover:text-[#c4b5fd] transition-colors font-medium"
          >
            View full resume
          </button>
        </div>
      </article>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--panel)] border border-[var(--border)] rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--panel-alt)]">
              <div>
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">{resume.candidate_name || "Unnamed Candidate"}</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {resume.email ? (
                    <a href={`mailto:${resume.email}`} className="hover:text-[var(--text-primary)] transition-colors">
                      {resume.email}
                    </a>
                  ) : "No email provided"}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--panel)] transition-colors"
              >
                Close
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6 flex flex-wrap gap-2">
                {(resume.skills || []).map((skill) => (
                  <span
                    key={`modal-${resume.id}-${skill}`}
                    className="rounded-full border border-[#a78bfa]/40 bg-[#a78bfa]/15 px-3 py-1 text-xs text-[#d6cbff]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-[var(--text-primary)] text-sm leading-relaxed">
                  <HighlightedText text={resume.raw_text || ""} query={query} />
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export type { ResumeResult };
