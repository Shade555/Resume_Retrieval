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
  let successfulPages = 0;

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    try {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      
      let lastY = -1;
      let pageText = "";
      
      for (const item of content.items) {
        if ("str" in item && typeof item.str === "string") {
          const str = item.str.trim();
          if (str.length === 0 && !item.hasEOL) continue;
          
          const y = item.transform[5];
          
          // If Y coordinate changed by more than 5 points, treat as a new line
          if (lastY !== -1 && Math.abs(lastY - y) > 5) {
            pageText += "\n";
          } else if (pageText.length > 0 && !pageText.endsWith("\n") && !pageText.endsWith(" ")) {
             // Add space between chunks on the same line
             pageText += " ";
          }
          
          if (str.length > 0) {
            pageText += str;
          }
          
          lastY = y;
          
          if (item.hasEOL) {
             pageText += "\n";
             lastY = -1; // Reset Y tracking after explicit EOL
          }
        }
      }

      pages.push(pageText);
      successfulPages++;

      // Aggressive memory management: free up page resources immediately
      page.cleanup();
    } catch (pageError) {
      console.warn(`Failed to parse page ${pageNumber} of PDF:`, pageError);
      // Continue to next page instead of crashing the entire upload
    }
  }

  // Aggressive memory management: destroy the document instance
  await document.destroy();

  if (successfulPages === 0) {
    throw new Error("Could not extract any text from the PDF. The file may be corrupted, password-protected, or image-based.");
  }

  const combinedText = pages.join("\n\n");
  if (combinedText.trim().length === 0) {
     throw new Error("PDF was parsed successfully, but no readable text was found. It may be a scanned image.");
  }

  return normalizeRawText(combinedText);
}

export { MAX_PDF_SIZE_BYTES };
