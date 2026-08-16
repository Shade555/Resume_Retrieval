import { NextResponse } from "next/server";

import { extractTextFromPdfBuffer, MAX_PDF_SIZE_BYTES } from "@/src/lib/pdfParser";
import { extractResumeMetadata } from "@/src/lib/resumeMetadata";
import { generateEmbedding } from "@/src/lib/transformers";
import { supabase } from "@/src/lib/supabaseClient";
import { uploadRateLimiter, getClientIp } from "@/src/lib/rateLimit";
import { logger } from "@/src/lib/logger";

export const runtime = "nodejs";

type ParseRequestBody = {
  text?: string;
  rawText?: string;
  raw_text?: string;
};

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const ip = getClientIp(request);
    
    // Rate Limiting
    const { success, limit: rateLimit, remaining, reset } = await uploadRateLimiter.limit(ip);
    if (!success) {
      logger.warn({ ip }, "Rate limit exceeded for upload API");
      return NextResponse.json(
        { error: "Too many uploads. Please try again later." },
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

    const contentType = request.headers.get("content-type") || "";
    let rawText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("resume");

      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: "Expected a PDF file with form field name 'resume'." },
          { status: 400 },
        );
      }

      const isPdfMime = file.type === "application/pdf";
      const isPdfName = file.name.toLowerCase().endsWith(".pdf");

      if (!isPdfMime && !isPdfName) {
        return NextResponse.json(
          { error: "Only PDF files are supported." },
          { status: 400 },
        );
      }

      if (file.size > MAX_PDF_SIZE_BYTES) {
        return NextResponse.json(
          { error: "PDF size must be 10MB or less." },
          { status: 400 },
        );
      }

      rawText = await extractTextFromPdfBuffer(await file.arrayBuffer());
    } else {
      const body = (await request.json()) as string | ParseRequestBody;
      rawText =
        typeof body === "string"
          ? body
          : body.text ?? body.rawText ?? body.raw_text ?? "";
    }

    if (typeof rawText !== "string" || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: "No usable text found in the uploaded resume." },
        { status: 400 },
      );
    }

    const { candidateName, email, skills } = extractResumeMetadata(rawText);
    const embedding = await generateEmbedding(rawText);

    const { data, error } = await supabase
      .from("resumes")
      .insert({
        candidate_name: candidateName,
        email,
        skills,
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

    const duration = Date.now() - startTime;
    logger.info({ resumeId: data.id, durationMs: duration }, "Resume parsed and stored successfully");

    return NextResponse.json(
      {
        message: "Resume text stored successfully.",
        resumeId: data.id,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.stack || error.message : "Unknown error.";
    const duration = Date.now() - startTime;
    
    // Distinguish between unprocessable entities (e.g. image-based PDFs) and internal server errors
    if (message.includes("Could not extract any text") || message.includes("no readable text was found") || message.includes("No usable text found")) {
      logger.warn({ error: message, durationMs: duration }, "Unprocessable resume PDF");
      return NextResponse.json(
        { error: message },
        { status: 422 }, // Unprocessable Entity
      );
    }

    logger.error({ error: message, durationMs: duration }, "Parse API failed");
    return NextResponse.json(
      { error: `Failed to process resume text: ${message}` },
      { status: 500 },
    );
  }
}
