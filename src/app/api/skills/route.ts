import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabaseClient";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Note: If the DB gets huge, we'd want an RPC or materialized view. 
    // Fetching all skills here works well for early phases.
    const { data, error } = await supabase
      .from("resumes")
      .select("skills");

    if (error) {
      throw new Error(error.message);
    }

    const skillCounts: Record<string, number> = {};

    data?.forEach((row) => {
      if (Array.isArray(row.skills)) {
        row.skills.forEach((skill: unknown) => {
          if (typeof skill === "string") {
            const s = skill.trim();
            if (s) {
              skillCounts[s] = (skillCounts[s] || 0) + 1;
            }
          }
        });
      }
    });

    const sortedSkills = Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ data: sortedSkills }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
