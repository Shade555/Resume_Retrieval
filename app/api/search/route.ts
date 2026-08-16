import { NextResponse } from "next/server";

import { generateEmbedding } from "@/src/lib/transformers";
import { supabase } from "@/src/lib/supabaseClient";
import { searchRateLimiter, getClientIp } from "@/src/lib/rateLimit";
import { redis } from "@/src/lib/redis";
import { logger } from "@/src/lib/logger";

export const runtime = "nodejs";

type SearchRequestBody = {
  query?: string;
  threshold?: number;
  page?: number;
  limit?: number;
  skills?: string[];
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
  const startTime = Date.now();
  try {
    const ip = getClientIp(request);
    
    // 1. Rate Limiting
    const { success, limit: rateLimit, remaining, reset } = await searchRateLimiter.limit(ip);
    if (!success) {
      logger.warn({ ip }, "Rate limit exceeded for search API");
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          }
        }
      );
    }

    const body = (await request.json()) as SearchRequestBody;
    const query = body.query?.trim() || "";
    const threshold = typeof body.threshold === "number" ? body.threshold : 0.0;
    const page = typeof body.page === "number" ? body.page : 1;
    const limit = typeof body.limit === "number" ? body.limit : 12;
    const selectedSkills = Array.isArray(body.skills) ? body.skills : [];

    if (!query) {
      return NextResponse.json(
        { error: "Query is required." },
        { status: 400 },
      );
    }

    if (threshold < -1 || threshold > 1) {
      return NextResponse.json(
        { error: "Threshold must be between -1 and 1." },
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

    // 2. Embedding Caching
    const cacheKey = `embed:${query.toLowerCase()}`;
    let queryEmbedding = await redis.get<number[]>(cacheKey);

    if (queryEmbedding) {
      logger.info({ query }, "Embedding cache hit");
    } else {
      logger.info({ query }, "Embedding cache miss, generating...");
      queryEmbedding = Array.from(await generateEmbedding(query));
      // Cache for 24 hours (86400 seconds)
      await redis.set(cacheKey, queryEmbedding, { ex: 86400 });
    }

    // Request more matches to allow for filtering and pagination
    const matchCount = page * limit + 50;

    // Use the RPC function now that it is fixed in the database
    const { data, error } = await supabase.rpc("match_resumes", {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: matchCount,
    });

    if (error) {
      return NextResponse.json(
        { error: `Search failed: ${error.message}` },
        { status: 500 },
      );
    }

    let results = ((data || []) as SearchResultRow[]);
    
    // Apply additional skills filtering in JavaScript
    if (selectedSkills.length > 0) {
      results = results.filter((resume) => {
        if (!resume.skills) return false;
        // Check if resume has ALL selected skills
        return selectedSkills.every((skill) => 
          resume.skills!.some(s => s.toLowerCase() === skill.toLowerCase())
        );
      });
    }

    const hasNextPage = results.length > page * limit;
    
    if (hasNextPage) {
      results = results.slice(0, page * limit);
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

    const duration = Date.now() - startTime;
    logger.info({ query, durationMs: duration, resultsCount: pagedResults.length }, "Search completed successfully");

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
    logger.error({ error: message, durationMs: Date.now() - startTime }, "Search API failed");

    return NextResponse.json(
      { error: `Failed to run semantic search: ${message}` },
      { status: 500 },
    );
  }
}
