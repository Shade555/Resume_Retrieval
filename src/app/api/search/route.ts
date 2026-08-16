import { NextResponse } from "next/server";

import { generateEmbedding } from "../../../lib/transformers";
import { supabase } from "../../../lib/supabaseClient";

export const runtime = "nodejs";

type SearchRequestBody = {
  query?: string;
  threshold?: number;
  count?: number;
};

type SearchResultRow = {
  id: string;
  candidate_name: string | null;
  email: string | null;
  skills: string[] | null;
  raw_text: string | null;
  similarity: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SearchRequestBody;
    const query = body.query?.trim() || "";
    const threshold = typeof body.threshold === "number" ? body.threshold : 0.35;
    const count = typeof body.count === "number" ? body.count : 12;

    if (!query) {
      return NextResponse.json(
        { error: "Query is required." },
        { status: 400 },
      );
    }

    if (threshold < 0 || threshold > 1) {
      return NextResponse.json(
        { error: "Threshold must be between 0 and 1." },
        { status: 400 },
      );
    }

    if (count < 1 || count > 50) {
      return NextResponse.json(
        { error: "Count must be between 1 and 50." },
        { status: 400 },
      );
    }

    const queryEmbedding = await generateEmbedding(query);

    const { data, error } = await supabase.rpc("match_resumes", {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: count,
    });

    if (error) {
      return NextResponse.json(
        { error: `Search failed: ${error.message}` },
        { status: 500 },
      );
    }

    const results = ((data || []) as SearchResultRow[]).map((row) => ({
      id: row.id,
      candidate_name: row.candidate_name,
      email: row.email,
      skills: row.skills || [],
      raw_text: row.raw_text,
      similarity: row.similarity,
    }));

    return NextResponse.json(
      {
        query,
        threshold,
        count,
        results,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";

    return NextResponse.json(
      { error: `Failed to run semantic search: ${message}` },
      { status: 500 },
    );
  }
}
