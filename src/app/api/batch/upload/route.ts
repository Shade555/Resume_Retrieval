import { NextResponse } from "next/server";
import { extractTextFromPdfBuffer, MAX_PDF_SIZE_BYTES } from "@/src/lib/pdfParser";
import { extractResumeMetadata } from "@/src/lib/resumeMetadata";
import { generateEmbedding } from "@/src/lib/transformers";
import { supabase } from "@/src/lib/supabaseClient";

export const runtime = "nodejs";

// 5 minutes max timeout for batch processing
export const maxDuration = 300; 

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data with 'resumes' field." },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("resumes");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided." }, { status: 400 });
    }

    const pdfFiles = files.filter(
      (file): file is File =>
        file instanceof File && 
        (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))
    );

    if (pdfFiles.length === 0) {
      return NextResponse.json({ error: "No valid PDF files found in payload." }, { status: 400 });
    }

    // Process all files in parallel. We use Promise.all to ensure that if ANY file fails
    // parsing or embedding, the entire batch is rejected before hitting the database (transaction-like rollback).
    const parsedRecords = await Promise.all(
      pdfFiles.map(async (file) => {
        if (file.size > MAX_PDF_SIZE_BYTES) {
          throw new Error(`File ${file.name} is too large (max 10MB)`);
        }
        
        const rawText = await extractTextFromPdfBuffer(await file.arrayBuffer());
        
        if (!rawText || rawText.trim().length === 0) {
          throw new Error(`No usable text found in ${file.name}`);
        }

        const { candidateName, email, skills } = extractResumeMetadata(rawText);
        const embedding = await generateEmbedding(rawText);

        return {
          candidate_name: candidateName,
          email,
          skills,
          raw_text: rawText,
          embedding,
          // Store filename for response reference
          filename: file.name
        };
      })
    );

    // Extract the filenames before inserting since we only insert DB columns
    // Use _ prefix to avoid unused variable warning
    const dbRecords = parsedRecords.map(({ filename: _filename, ...record }) => record);

    // Bulk insert into Supabase. PostgREST handles array inserts in a single transaction.
    // If any insert fails, the entire transaction is rolled back.
    const { data, error } = await supabase
      .from("resumes")
      .insert(dbRecords)
      .select("id, candidate_name");

    if (error) {
      throw new Error(`Database transaction failed: ${error.message}`);
    }

    const successful = data.map((row, i) => ({
      filename: parsedRecords[i].filename,
      id: row.id,
      candidateName: row.candidate_name,
    }));

    return NextResponse.json({
      message: `Batch processing complete. ${successful.length} files successfully uploaded in a single transaction.`,
      successful,
    }, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    return NextResponse.json({ error: `Batch upload failed: ${message}` }, { status: 500 });
  }
}
