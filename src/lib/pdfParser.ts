const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024;

function normalizeRawText(input: string): string {
  return input
    .replace(/\u0000/g, "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function extractTextFromPdfBuffer(buffer: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableFontFace: true,
    useWorkerFetch: false,
    isEvalSupported: false,
  });

  const document = await loadingTask.promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    const textChunks = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .filter((value): value is string => typeof value === "string" && value.length > 0);

    pages.push(textChunks.join(" "));
  }

  return normalizeRawText(pages.join("\n"));
}

export { MAX_PDF_SIZE_BYTES };
