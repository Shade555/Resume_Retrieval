import { NextResponse } from "next/server";

import { generateEmbedding } from "../../../lib/transformers";
import { supabase } from "../../../lib/supabaseClient";

export const runtime = "nodejs";

type ParseRequestBody = {
  text?: string;
  rawText?: string;
  raw_text?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as string | ParseRequestBody;

    const rawText =
      typeof body === "string"
        ? body
        : body.text ?? body.rawText ?? body.raw_text;

    if (typeof rawText !== "string" || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: "A non-empty raw text string is required." },
        { status: 400 },
      );
    }

    const embedding = await generateEmbedding(rawText);

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        raw_text: rawText,
        embedding,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `Failed to insert resume: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Resume text stored successfully.",
        resumeId: data.id,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";

    return NextResponse.json(
      { error: `Failed to process resume text: ${message}` },
      { status: 500 },
    );
  }
}
