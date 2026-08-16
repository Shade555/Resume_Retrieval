import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabaseClient";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch resumes without raw_text and embedding to keep payload small
    let query = supabase
      .from("resumes")
      .select("id, candidate_name, email, skills, created_at", { count: "exact" })
      .order("created_at", { ascending: false });

    // Apply date range filters if provided
    if (startDate) {
      query = query.gte("created_at", startDate);
    }
    if (endDate) {
      query = query.lte("created_at", endDate);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      throw new Error(`Failed to fetch resumes: ${error.message}`);
    }

    return NextResponse.json(
      {
        data,
        meta: {
          page,
          limit,
          total: count || 0,
          totalPages: count ? Math.ceil(count / limit) : 0,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// Add DELETE to the root /api/resumes route as requested by the plan
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Resume ID is required." }, { status: 400 });
    }

    const { error } = await supabase.from("resumes").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      { message: "Resume deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
