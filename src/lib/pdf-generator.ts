import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ScholarshipData {
  title: string;
  titleAr?: string;
  university: string;
  universityAr?: string;
  country: string;
  countryAr?: string;
  description: string;
  descriptionAr?: string;
  eligibility: string[];
  eligibilityAr?: string[];
  benefits: string[];
  benefitsAr?: string[];
  requirements: string[];
  requirementsAr?: string[];
  howToApply: string;
  howToApplyAr?: string;
  duration?: string;
  durationAr?: string;
  deadline?: Date | string;
  fundingType?: string;
  levels?: string[];
  field?: string;
  applicationUrl?: string;
}

interface PDFOptions {
  locale: 'en' | 'ar';
}

const translations = {
  en: {
    title: 'Sudan Scholars Hub',
    subtitle: 'Scholarship Information',
    keyInfo: 'Key Information',
    deadline: 'Deadline',
    funding: 'Funding',
    level: 'Study Level',
    duration: 'Duration',
    field: 'Field of Study',
    overview: 'Overview',
    eligibility: 'Eligibility Requirements',
    benefits: 'Benefits',
    requirements: 'Required Documents',
    howToApply: 'How to Apply',
    applyAt: 'Apply at',
    generated: 'Generated on',
    website: 'www.deltaroots.store',
    fullyFunded: 'Fully Funded',
    partiallyFunded: 'Partially Funded',
  },
  ar: {
    title: 'بوابة منح السودان',
    subtitle: 'معلومات المنحة',
    keyInfo: 'المعلومات الرئيسية',
    deadline: 'الموعد النهائي',
    funding: 'التمويل',
    level: 'مستوى الدراسة',
    duration: 'المدة',
    field: 'مجال الدراسة',
    overview: 'نظرة عامة',
    eligibility: 'شروط الأهلية',
    benefits: 'المزايا',
    requirements: 'المستندات المطلوبة',
    howToApply: 'كيفية التقديم',
    applyAt: 'قدم على',
    generated: 'تم الإنشاء في',
    website: 'www.deltaroots.store',
    fullyFunded: 'ممولة بالكامل',
    partiallyFunded: 'ممولة جزئياً',
  },
};

const levelLabels: Record<string, Record<string, string>> = {
  en: {
    BACHELOR: 'Bachelor',
    MASTER: 'Master',
    PHD: 'PhD',
  },
  ar: {
    BACHELOR: 'بكالوريوس',
    MASTER: 'ماجستير',
    PHD: 'دكتوراه',
  },
};

const fieldLabels: Record<string, Record<string, string>> = {
  en: {
    ENGINEERING: 'Engineering',
    MEDICINE: 'Medicine',
    BUSINESS: 'Business',
    ARTS: 'Arts & Humanities',
    SCIENCE: 'Science',
    LAW: 'Law',
    EDUCATION: 'Education',
    TECHNOLOGY: 'Technology',
    ALL: 'All Fields',
  },
  ar: {
    ENGINEERING: 'الهندسة',
    MEDICINE: 'الطب',
    BUSINESS: 'إدارة الأعمال',
    ARTS: 'الفنون والعلوم الإنسانية',
    SCIENCE: 'العلوم',
    LAW: 'القانون',
    EDUCATION: 'التعليم',
    TECHNOLOGY: 'التكنولوجيا',
    ALL: 'جميع التخصصات',
  },
};

export function generateScholarshipPDF(
  scholarship: ScholarshipData,
  options: PDFOptions = { locale: 'en' }
): void {
  const { locale } = options;
  const t = translations[locale];
  const isRTL = locale === 'ar';

  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  // Helper function to get localized content
  const getContent = (en: string | string[] | undefined, ar: string | string[] | undefined) => {
    if (locale === 'ar' && ar) return ar;
    return en || '';
  };

  // Colors
  const primaryColor: [number, number, number] = [37, 99, 235]; // #2563eb
  const textColor: [number, number, number] = [31, 41, 55]; // gray-800
  const lightGray: [number, number, number] = [156, 163, 175]; // gray-400

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(t.title, pageWidth / 2, 15, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(t.subtitle, pageWidth / 2, 25, { align: 'center' });

  yPos = 45;

  // Scholarship Title
  doc.setTextColor(...textColor);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const title = String(getContent(scholarship.title, scholarship.titleAr));
  const titleLines = doc.splitTextToSize(title, contentWidth);
  doc.text(titleLines, margin, yPos);
  yPos += titleLines.length * 8 + 5;

  // University and Country
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...lightGray);
  const university = String(getContent(scholarship.university, scholarship.universityAr));
  const country = String(getContent(scholarship.country, scholarship.countryAr));
  doc.text(`${university} | ${country}`, margin, yPos);
  yPos += 15;

  // Key Information Box
  doc.setFillColor(249, 250, 251); // gray-50
  doc.roundedRect(margin, yPos, contentWidth, 45, 3, 3, 'F');

  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(t.keyInfo, margin + 5, yPos + 8);

  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const infoY = yPos + 18;
  const col1 = margin + 5;
  const col2 = margin + contentWidth / 2;

  // Deadline
  if (scholarship.deadline) {
    const deadlineDate = new Date(scholarship.deadline);
    const formattedDate = deadlineDate.toLocaleDateString(locale === 'ar' ? 'ar-SD' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    doc.text(`${t.deadline}: ${formattedDate}`, col1, infoY);
  }

  // Funding Type
  if (scholarship.fundingType) {
    const fundingLabel = scholarship.fundingType === 'FULLY_FUNDED' ? t.fullyFunded : t.partiallyFunded;
    doc.text(`${t.funding}: ${fundingLabel}`, col2, infoY);
  }

  // Study Level
  if (scholarship.levels && scholarship.levels.length > 0) {
    const levels = scholarship.levels.map((l) => levelLabels[locale][l] || l).join(', ');
    doc.text(`${t.level}: ${levels}`, col1, infoY + 10);
  }

  // Duration
  const duration = String(getContent(scholarship.duration, scholarship.durationAr));
  if (duration) {
    doc.text(`${t.duration}: ${duration}`, col2, infoY + 10);
  }

  // Field
  if (scholarship.field) {
    const fieldLabel = fieldLabels[locale][scholarship.field] || scholarship.field;
    doc.text(`${t.field}: ${fieldLabel}`, col1, infoY + 20);
  }

  yPos += 55;

  // Section helper function
  const addSection = (title: string, content: string | string[], isList: boolean = false) => {
    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }

    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, yPos);
    yPos += 8;

    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    if (isList && Array.isArray(content)) {
      content.forEach((item) => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = margin;
        }
        const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 5);
        doc.text(lines, margin + 3, yPos);
        yPos += lines.length * 5 + 2;
      });
    } else {
      const text = Array.isArray(content) ? content.join('\n') : String(content);
      const lines = doc.splitTextToSize(text, contentWidth);
      lines.forEach((line: string) => {
        if (yPos > pageHeight - 20) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, margin, yPos);
        yPos += 5;
      });
    }

    yPos += 10;
  };

  // Overview
  const description = getContent(scholarship.description, scholarship.descriptionAr);
  if (description) {
    addSection(t.overview, String(description));
  }

  // Eligibility
  const eligibility = getContent(scholarship.eligibility, scholarship.eligibilityAr);
  if (eligibility && (Array.isArray(eligibility) ? eligibility.length > 0 : eligibility)) {
    addSection(t.eligibility, eligibility as string[], true);
  }

  // Benefits
  const benefits = getContent(scholarship.benefits, scholarship.benefitsAr);
  if (benefits && (Array.isArray(benefits) ? benefits.length > 0 : benefits)) {
    addSection(t.benefits, benefits as string[], true);
  }

  // Requirements
  const requirements = getContent(scholarship.requirements, scholarship.requirementsAr);
  if (requirements && (Array.isArray(requirements) ? requirements.length > 0 : requirements)) {
    addSection(t.requirements, requirements as string[], true);
  }

  // How to Apply
  const howToApply = getContent(scholarship.howToApply, scholarship.howToApplyAr);
  if (howToApply) {
    addSection(t.howToApply, String(howToApply));
  }

  // Application URL
  if (scholarship.applicationUrl) {
    if (yPos > pageHeight - 30) {
      doc.addPage();
      yPos = margin;
    }
    doc.setTextColor(...primaryColor);
    doc.setFontSize(10);
    doc.text(`${t.applyAt}: ${scholarship.applicationUrl}`, margin, yPos);
    yPos += 15;
  }

  // Footer
  const footerY = pageHeight - 15;
  doc.setDrawColor(...lightGray);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setTextColor(...lightGray);
  doc.setFontSize(9);
  const today = new Date().toLocaleDateString(locale === 'ar' ? 'ar-SD' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`${t.generated} ${today}`, margin, footerY);
  doc.text(t.website, pageWidth - margin, footerY, { align: 'right' });

  // Generate filename and save
  const filename = `${scholarship.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-scholarship.pdf`;
  doc.save(filename);
}
