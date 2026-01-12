import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import type { LOIWizardData } from './types';
import { assembleLetter } from './letter-assembler';

export async function generateLOIDocx(data: LOIWizardData): Promise<Blob> {
  const letter = assembleLetter(data);
  const paragraphs = letter.split('\n\n').filter(Boolean);

  const documentChildren: Paragraph[] = [];

  paragraphs.forEach((text, index) => {
    // First paragraph is salutation
    if (index === 0) {
      documentChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: text,
              size: 24, // 12pt
              font: 'Times New Roman',
            }),
          ],
          spacing: { after: 240 }, // 12pt after
        })
      );
      return;
    }

    // Last paragraph is signature (Sincerely + Name)
    if (index === paragraphs.length - 1) {
      const signatureLines = text.split('\n');
      signatureLines.forEach((line, lineIndex) => {
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                size: 24,
                font: 'Times New Roman',
              }),
            ],
            spacing: { before: lineIndex === 0 ? 240 : 0, after: 0 },
          })
        );
      });
      return;
    }

    // Body paragraphs
    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            size: 24, // 12pt
            font: 'Times New Roman',
          }),
        ],
        spacing: { after: 240 }, // 12pt after paragraph
        alignment: AlignmentType.JUSTIFIED,
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch in twips (1440 twips = 1 inch)
              bottom: 1440,
              left: 1440,
              right: 1440,
            },
          },
        },
        children: documentChildren,
      },
    ],
  });

  return await Packer.toBlob(doc);
}
