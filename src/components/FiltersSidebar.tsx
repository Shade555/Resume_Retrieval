"use client";

import { useSearchStore } from "@/src/store/useSearchStore";
import clsx from "clsx";

// A predefined list of common skills for filtering (this could eventually be loaded dynamically from the API)
const COMMON_SKILLS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "SQL",
  "AWS",
  "Docker",
  "Machine Learning",
  "Electrical Engineering",
  "Cadence",
  "Linux"
];

export function FiltersSidebar() {
  const relevanceThreshold = useSearchStore((state) => state.relevanceThreshold);
  const setRelevanceThreshold = useSearchStore((state) => state.setRelevanceThreshold);
  const selectedSkills = useSearchStore((state) => state.selectedSkills);
  const toggleSkill = useSearchStore((state) => state.toggleSkill);
  const runSearch = useSearchStore((state) => state.runSearch);
  const isSearching = useSearchStore((state) => state.isSearching);
  
  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRelevanceThreshold(parseFloat(e.target.value));
  };

  const handleApplyFilters = () => {
    void runSearch();
  };

  return (
    <aside className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-black/20 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur h-fit sticky top-6">
      <div>
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <p className="text-xs text-zinc-400 mt-1">Refine your candidate search</p>
      </div>

      {/* Relevance Threshold Slider */}
      <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between">
          <label htmlFor="relevance-slider" className="text-sm font-medium text-zinc-200">
            Minimum Match
          </label>
          <span className="text-xs font-mono text-[#a78bfa]">
            {Math.round((relevanceThreshold + 1) / 2 * 100)}%
          </span>
        </div>
        
        <input
          id="relevance-slider"
          type="range"
          min="-1"
          max="1"
          step="0.05"
          value={relevanceThreshold}
          onChange={handleThresholdChange}
          className="w-full accent-[#7dd3fc] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-wider">
          <span>Broad</span>
          <span>Exact</span>
        </div>
      </div>

      {/* Skills Filter */}
      <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
        <h4 className="text-sm font-medium text-zinc-200 mb-1">Required Skills</h4>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {COMMON_SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <label 
                key={skill} 
                className={clsx(
                  "flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors",
                  isSelected 
                    ? "bg-[#7dd3fc]/10 border-[#7dd3fc]/30 text-white" 
                    : "bg-white/5 border-transparent text-zinc-300 hover:bg-white/10"
                )}
              >
                {/* Hidden real checkbox for accessibility */}
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={isSelected}
                  onChange={() => toggleSkill(skill)}
                />
                <div className={clsx(
                  "flex h-4 w-4 items-center justify-center rounded-[4px] border transition-colors",
                  isSelected ? "bg-[#7dd3fc] border-[#7dd3fc]" : "border-zinc-500 bg-transparent"
                )}>
                  {isSelected && (
                    <svg className="h-3 w-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{skill}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-2 border-t border-white/10">
        <button
          type="button"
          disabled={isSearching}
          onClick={handleApplyFilters}
          className="w-full rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSearching ? "Applying..." : "Apply Filters"}
        </button>
      </div>
    </aside>
  );
}
