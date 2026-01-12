import { jsPDF } from 'jspdf';
import type { LOIWizardData } from './types';
import { assembleLetter } from './letter-assembler';

export async function generateLOIPdf(data: LOIWizardData): Promise<Blob> {
  const letter = assembleLetter(data);

  // Create PDF with A4 dimensions
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 25;
  const marginRight = 25;
  const marginTop = 25;
  const marginBottom = 25;
  const maxWidth = pageWidth - marginLeft - marginRight;

  // Font settings
  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  // Split letter into paragraphs
  const paragraphs = letter.split('\n\n').filter(Boolean);

  let yPosition = marginTop;
  const lineHeight = 6; // mm

  paragraphs.forEach((paragraph, index) => {
    // Handle signature section differently (smaller spacing)
    const isSignature = index === paragraphs.length - 1;

    if (isSignature) {
      const signatureLines = paragraph.split('\n');
      signatureLines.forEach((line) => {
        // Check if we need a new page
        if (yPosition + lineHeight > pageHeight - marginBottom) {
          doc.addPage();
          yPosition = marginTop;
        }

        doc.text(line, marginLeft, yPosition);
        yPosition += lineHeight;
      });
    } else {
      // Wrap text for body paragraphs
      const lines = doc.splitTextToSize(paragraph, maxWidth);

      lines.forEach((line: string) => {
        // Check if we need a new page
        if (yPosition + lineHeight > pageHeight - marginBottom) {
          doc.addPage();
          yPosition = marginTop;
        }

        doc.text(line, marginLeft, yPosition);
        yPosition += lineHeight;
      });

      // Add paragraph spacing
      yPosition += lineHeight * 0.5;
    }
  });

  // Return as blob
  return doc.output('blob');
}
