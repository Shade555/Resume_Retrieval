import { NextResponse } from "next/server";

import { generateEmbedding } from "../../../lib/transformers";
import { supabase } from "../../../lib/supabaseClient";

export const runtime = "nodejs";

type SearchRequestBody = {
  query?: string;
  threshold?: number;
  page?: number;
  limit?: number;
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
    const page = typeof body.page === "number" ? body.page : 1;
    const limit = typeof body.limit === "number" ? body.limit : 12;

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

    if (page < 1) {
      return NextResponse.json(
        { error: "Page must be at least 1." },
        { status: 400 },
      );
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: "Limit must be between 1 and 100." },
        { status: 400 },
      );
    }

    const queryEmbedding = await generateEmbedding(query);

    const matchCount = page * limit;
    
    // We request up to matchCount + 1 to check if there is a next page.
    const { data, error } = await supabase.rpc("match_resumes", {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: matchCount + 1,
    });

    if (error) {
      return NextResponse.json(
        { error: `Search failed: ${error.message}` },
        { status: 500 },
      );
    }

    const results = ((data || []) as SearchResultRow[]);
    const hasNextPage = results.length > matchCount;
    
    if (hasNextPage) {
      results.pop(); // Remove the extra item
    }

    const startIndex = (page - 1) * limit;
    const pagedResults = results.slice(startIndex).map((row) => ({
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
        page,
        limit,
        results: pagedResults,
        hasNextPage,
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
