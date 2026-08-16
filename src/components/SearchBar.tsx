"use client";

type SearchBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
  resultCount: number;
};

export function SearchBar({
  query,
  onQueryChange,
  onSearch,
  isLoading,
  resultCount,
}: SearchBarProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="sr-only" htmlFor="resume-query">
          Search resumes
        </label>
        <input
          id="resume-query"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch();
            }
          }}
          placeholder="Frontend developer with React and TypeScript experience"
          className="w-full rounded-xl border border-white/15 bg-[#18181f] px-4 py-3 text-sm text-white placeholder:text-zinc-400 outline-none transition focus:border-[#a78bfa]"
        />
        <button
          type="button"
          onClick={onSearch}
          disabled={isLoading}
          className="rounded-xl bg-gradient-to-r from-[#a78bfa] via-[#7dd3fc] to-[#6ee7b7] px-5 py-3 text-sm font-semibold text-[#111217] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
      <p className="mt-3 text-xs text-zinc-300">
        {resultCount > 0 ? `${resultCount} matches found` : "No results yet."}
      </p>
    </section>
  );
}
