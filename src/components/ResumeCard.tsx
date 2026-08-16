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
};

export function ResumeCard({ resume }: ResumeCardProps) {
  const scorePercent = Math.round(resume.similarity * 100);

  return (
    <article className="rounded-2xl border border-white/10 bg-[#15151c] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.3)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">
            {resume.candidate_name || "Unnamed Candidate"}
          </h3>
          <p className="text-sm text-zinc-400">{resume.email || "No email provided"}</p>
        </div>
        <span className="rounded-full border border-[#6ee7b7]/30 bg-[#6ee7b7]/10 px-3 py-1 text-xs font-medium text-[#6ee7b7]">
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

      <p className="mt-4 line-clamp-4 text-sm leading-6 text-zinc-300">
        {resume.raw_text || "No preview available for this resume."}
      </p>
    </article>
  );
}

export type { ResumeResult };
