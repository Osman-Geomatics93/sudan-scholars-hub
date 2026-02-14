export async function extractTextFromPdfUrl(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  // Dynamic import to prevent pdf-parse from crashing Next.js worker processes
  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data });
  const result = await parser.getText();
  await parser.destroy();

  const text = result.text?.trim() || '';
  if (text.length === 0) {
    throw new Error('No text content found in PDF');
  }

  // Limit to ~50k characters to stay within context limits
  const maxChars = 50000;
  return text.length > maxChars ? text.slice(0, maxChars) + '\n\n[Text truncated...]' : text;
}
