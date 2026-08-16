"use client";

import { useEffect, useMemo } from "react";

import { ResumeCard } from "@/src/components/ResumeCard";
import { SearchBar } from "@/src/components/SearchBar";
import { FiltersSidebar } from "@/src/components/FiltersSidebar";
import { ExportBar } from "@/src/components/ExportBar";
import { UploadModal } from "@/src/components/UploadModal";
import { useSearchStore } from "@/src/store/useSearchStore";
import { useInView } from "react-intersection-observer";

export default function Home() {
  const theme = useSearchStore((state) => state.theme);
  const toggleTheme = useSearchStore((state) => state.toggleTheme);
  const initializeTheme = useSearchStore((state) => state.initializeTheme);
  const query = useSearchStore((state) => state.query);
  const results = useSearchStore((state) => state.results);
  const isSearching = useSearchStore((state) => state.isSearching);
  const setIsUploadOpen = useSearchStore((state) => state.setIsUploadOpen);
  const page = useSearchStore((state) => state.page);
  const limit = useSearchStore((state) => state.limit);
  const hasNextPage = useSearchStore((state) => state.hasNextPage);
  const runSearch = useSearchStore((state) => state.runSearch);

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  useEffect(() => {
    if (inView && hasNextPage && !isSearching) {
      void runSearch(undefined, page + 1);
    }
  }, [inView, hasNextPage, isSearching, page, runSearch]);

  const summary = useMemo(() => {
    if (results.length === 0) {
      return "Upload resumes, then run a semantic search to rank candidates by relevance.";
    }

    return `Top result score: ${Math.round(results[0].similarity * 100)}%`;
  }, [results]);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 text-[var(--text-primary)] sm:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-12 h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(167,139,250,0.35)_0%,_rgba(167,139,250,0)_65%)]" />
        <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(125,211,252,0.26)_0%,_rgba(125,211,252,0)_70%)]" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(244,114,182,0.2)_0%,_rgba(244,114,182,0)_70%)]" />
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header 
          className="rounded-3xl border p-6 backdrop-blur-md"
          style={{ 
            background: 'var(--header-bg)',
            borderColor: 'var(--header-border)',
            boxShadow: 'var(--header-shadow)'
          }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[#bca7ff]">AI Resume Retrieval</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl flex flex-wrap gap-x-[0.25em]">
                {["Find", "the", "right", "candidate", "with", "semantic", "search"].map((word, i) => (
                  <span key={i} className="overflow-hidden inline-flex">
                    <span 
                      className="inline-block animate-slot-reveal opacity-0" 
                      style={{ animationDelay: `${i * 50 + 100}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h1>
              <div className="overflow-hidden">
                <p 
                  className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] opacity-0 animate-slot-reveal"
                  style={{ animationDelay: '500ms' }}
                >
                  Local embeddings, vector similarity, and a matte gradient interface built for high-signal hiring workflows.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 self-start sm:flex-row">
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                style={{ backgroundColor: 'var(--btn-bg)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--btn-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--btn-bg)')}
              >
                {theme === "dark" ? "Switch to light" : "Switch to dark"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const { logout } = await import("./login/actions");
                  await logout();
                }}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
                style={{ backgroundColor: 'var(--btn-bg)' }}
              >
                Log out
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsUploadOpen(true)}
              className="rounded-xl bg-gradient-to-r from-[#f472b6] via-[#a78bfa] to-[#7dd3fc] px-5 py-3 text-sm font-semibold text-[#131420] transition hover:brightness-110"
            >
              Add Resume Text
            </button>
            <span className="rounded-full border border-[#6ee7b7]/30 bg-[#6ee7b7]/10 px-3 py-1 text-xs text-[#6ee7b7]">
              {summary}
            </span>
          </div>
        </header>

        <SearchBar />

        <div className="flex flex-col lg:flex-row gap-6 mt-2">
          <div className="w-full lg:w-64 flex-shrink-0">
            <FiltersSidebar />
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col">
            {isSearching ? (
              <section className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-44 animate-pulse rounded-2xl border border-[var(--border)] bg-[var(--panel-alt)]"
                  />
                ))}
              </section>
            ) : results.length > 0 ? (
              <section className="grid gap-4 md:grid-cols-2">
                {results.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume} query={query} />
                ))}
              </section>
            ) : query ? (
              <div className="mt-2 flex flex-col items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] py-16 text-center shadow-sm">
                <svg className="mb-4 h-12 w-12 text-[var(--text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-medium text-[var(--text-primary)]">No candidates found</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Try adjusting your search terms or lowering your criteria.</p>
              </div>
            ) : null}

            {results.length > 0 && hasNextPage && (
              <div ref={ref} className="mt-8 flex items-center justify-center pt-6">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-[#a78bfa]"></div>
              </div>
            )}
            {results.length > 0 && !hasNextPage && !isSearching && (
              <div className="mt-8 flex items-center justify-center pt-6 text-sm text-[var(--text-secondary)]">
                No more candidates to load.
              </div>
            )}
          </div>
        </div>
      </main>

      <ExportBar />
      <UploadModal />
    </div>
  );
}
