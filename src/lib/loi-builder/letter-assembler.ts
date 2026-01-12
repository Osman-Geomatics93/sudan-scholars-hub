import type { LOIWizardData, HookData, AcademicData, WhyScholarshipData, WhyTurkeyData, LeadershipData, FutureData, ClosingData } from './types';

// Transitions for different tones
const TRANSITIONS = {
  formal: {
    en: {
      academic: 'My academic background has thoroughly prepared me for this opportunity.',
      scholarship: 'I am drawn to the Turkiye Scholarships program because',
      turkey: 'I have chosen to pursue my studies in Turkey, specifically at',
      leadership: 'A significant experience that demonstrates my capabilities occurred',
      future: 'With a clear vision for my future, I have established concrete goals.',
      closing: 'I would be honored to be selected as a Turkiye Scholarships recipient.',
    },
    tr: {
      academic: 'Akademik gecmisim beni bu firsat icin kapsamli bir sekilde hazirladi.',
      scholarship: 'Turkiye Burslari programina ilgim sunlardan kaynaklanmaktadir:',
      turkey: 'Egitimimi Turkiye\'de, ozellikle',
      leadership: 'Yeteneklerimi gosteren onemli bir deneyim',
      future: 'Gelecegim icin net bir vizyonla, somut hedefler belirledim.',
      closing: 'Turkiye Burslari alicisi olarak secilmekten onur duyarim.',
    },
  },
  balanced: {
    en: {
      academic: 'My academic journey has prepared me well for this opportunity.',
      scholarship: 'The Turkiye Scholarships program stands out to me because',
      turkey: 'Turkey, and specifically',
      leadership: 'A defining experience that shaped who I am today occurred when',
      future: 'Looking ahead, I have clear goals for my future.',
      closing: 'I am excited about the opportunity to contribute to and learn from this program.',
    },
    tr: {
      academic: 'Akademik yolculugum beni bu firsat icin iyi hazirladi.',
      scholarship: 'Turkiye Burslari programi dikkatimi cekiyor cunku',
      turkey: 'Turkiye, ozellikle',
      leadership: 'Bugunku ben\'i sekillendiren tanimsal bir deneyim',
      future: 'Ileriye baktigimda, gelecegim icin net hedeflerim var.',
      closing: 'Bu programa katkida bulunmak ve ondan ogrenmek icin heyecanlaniyorum.',
    },
  },
  personal: {
    en: {
      academic: 'My educational journey has been transformative.',
      scholarship: 'What draws me to Turkiye Scholarships is',
      turkey: 'Turkey has captured my interest because',
      leadership: 'One experience that truly defined my character was',
      future: 'I have thought deeply about my future and what I want to achieve.',
      closing: 'I would be grateful for the opportunity to be part of this community.',
    },
    tr: {
      academic: 'Egitim yolculugum donusturucu oldu.',
      scholarship: 'Beni Turkiye Burslarina ceken sey',
      turkey: 'Turkiye ilgimi cekti cunku',
      leadership: 'Karakterimi gercekten tanimlayan bir deneyim',
      future: 'Gelecegim ve basarmak istediklerim hakkinda derinden dusundum.',
      closing: 'Bu toplulugun parcasi olma firsati icin minnettar olurum.',
    },
  },
};

// Build hook paragraph
function buildHookParagraph(hook: HookData): string {
  const parts: string[] = [];

  if (hook.openingStatement.trim()) {
    parts.push(hook.openingStatement.trim());
  }

  if (hook.fieldOfInterest.trim() && !hook.openingStatement.toLowerCase().includes(hook.fieldOfInterest.toLowerCase())) {
    parts.push(`My focus is on ${hook.fieldOfInterest.trim()}.`);
  }

  if (hook.careerGoal.trim() && !hook.openingStatement.toLowerCase().includes(hook.careerGoal.toLowerCase())) {
    // Only add if not already mentioned
    const goalText = hook.careerGoal.trim();
    if (!goalText.startsWith('My goal') && !goalText.startsWith('I aim')) {
      parts.push(`My goal is ${goalText.charAt(0).toLowerCase() + goalText.slice(1)}`);
    } else {
      parts.push(goalText);
    }
  }

  return parts.join(' ');
}

// Build academic paragraph
function buildAcademicParagraph(academic: AcademicData): string {
  const parts: string[] = [];

  if (academic.currentEducation.trim()) {
    parts.push(academic.currentEducation.trim());
  }

  if (academic.relevantCourses.trim()) {
    const courses = academic.relevantCourses.trim();
    if (!courses.toLowerCase().startsWith('i have') && !courses.toLowerCase().startsWith('my coursework')) {
      parts.push(`Key coursework includes ${courses.charAt(0).toLowerCase() + courses.slice(1)}`);
    } else {
      parts.push(courses);
    }
  }

  if (academic.academicAchievements.trim()) {
    parts.push(academic.academicAchievements.trim());
  }

  if (academic.skillsGained.trim()) {
    const skills = academic.skillsGained.trim();
    if (!skills.toLowerCase().startsWith('through') && !skills.toLowerCase().startsWith('i have developed')) {
      parts.push(`Through this journey, I have developed ${skills.charAt(0).toLowerCase() + skills.slice(1)}`);
    } else {
      parts.push(skills);
    }
  }

  return parts.join(' ');
}

// Build why scholarship paragraph
function buildScholarshipParagraph(scholarship: WhyScholarshipData): string {
  const parts: string[] = [];

  if (scholarship.whatAttracted.trim()) {
    parts.push(scholarship.whatAttracted.trim());
  }

  if (scholarship.alignmentWithGoals.trim()) {
    const alignment = scholarship.alignmentWithGoals.trim();
    if (!alignment.toLowerCase().startsWith('this aligns') && !alignment.toLowerCase().startsWith('the program')) {
      parts.push(`This aligns with my aspirations because ${alignment.charAt(0).toLowerCase() + alignment.slice(1)}`);
    } else {
      parts.push(alignment);
    }
  }

  if (scholarship.uniqueOffering.trim()) {
    parts.push(scholarship.uniqueOffering.trim());
  }

  return parts.join(' ');
}

// Build why Turkey paragraph
function buildTurkeyParagraph(turkey: WhyTurkeyData): string {
  const parts: string[] = [];

  // University and program
  if (turkey.universityName.trim() && turkey.programName.trim()) {
    parts.push(`${turkey.universityName.trim()}, offers an exceptional ${turkey.programName.trim()} program that aligns perfectly with my goals.`);
  }

  if (turkey.countryReasons.trim()) {
    parts.push(turkey.countryReasons.trim());
  }

  if (turkey.whyThisProgram.trim()) {
    parts.push(turkey.whyThisProgram.trim());
  }

  if (turkey.specificDetails.trim()) {
    const details = turkey.specificDetails.trim();
    if (!details.toLowerCase().startsWith('specifically') && !details.toLowerCase().startsWith('in particular')) {
      parts.push(`Specifically, ${details.charAt(0).toLowerCase() + details.slice(1)}`);
    } else {
      parts.push(details);
    }
  }

  return parts.join(' ');
}

// Build leadership paragraph (STAR format)
function buildLeadershipParagraph(leadership: LeadershipData): string {
  const parts: string[] = [];

  if (leadership.situation.trim()) {
    parts.push(leadership.situation.trim());
  }

  if (leadership.task.trim()) {
    const task = leadership.task.trim();
    if (!task.toLowerCase().startsWith('i was') && !task.toLowerCase().startsWith('my responsibility')) {
      parts.push(`I was tasked with ${task.charAt(0).toLowerCase() + task.slice(1)}`);
    } else {
      parts.push(task);
    }
  }

  if (leadership.action.trim()) {
    parts.push(leadership.action.trim());
  }

  if (leadership.result.trim()) {
    const result = leadership.result.trim();
    if (!result.toLowerCase().startsWith('as a result') && !result.toLowerCase().startsWith('this resulted')) {
      parts.push(`As a result, ${result.charAt(0).toLowerCase() + result.slice(1)}`);
    } else {
      parts.push(result);
    }
  }

  if (leadership.lessonsLearned.trim()) {
    const lessons = leadership.lessonsLearned.trim();
    if (!lessons.toLowerCase().startsWith('this experience') && !lessons.toLowerCase().startsWith('i learned')) {
      parts.push(`This experience taught me ${lessons.charAt(0).toLowerCase() + lessons.slice(1)}`);
    } else {
      parts.push(lessons);
    }
  }

  return parts.join(' ');
}

// Build future paragraph
function buildFutureParagraph(future: FutureData): string {
  const parts: string[] = [];

  if (future.shortTermGoals.trim()) {
    const shortTerm = future.shortTermGoals.trim();
    if (!shortTerm.toLowerCase().startsWith('in the short') && !shortTerm.toLowerCase().startsWith('upon graduation')) {
      parts.push(`Upon graduation, ${shortTerm.charAt(0).toLowerCase() + shortTerm.slice(1)}`);
    } else {
      parts.push(shortTerm);
    }
  }

  if (future.longTermGoals.trim()) {
    const longTerm = future.longTermGoals.trim();
    if (!longTerm.toLowerCase().startsWith('in the long') && !longTerm.toLowerCase().startsWith('my ultimate')) {
      parts.push(`My long-term vision is to ${longTerm.charAt(0).toLowerCase() + longTerm.slice(1)}`);
    } else {
      parts.push(longTerm);
    }
  }

  if (future.impactOnCommunity.trim()) {
    parts.push(future.impactOnCommunity.trim());
  }

  if (future.measurableOutcomes.trim()) {
    const outcomes = future.measurableOutcomes.trim();
    if (!outcomes.toLowerCase().startsWith('i aim') && !outcomes.toLowerCase().startsWith('specifically')) {
      parts.push(`I aim to ${outcomes.charAt(0).toLowerCase() + outcomes.slice(1)}`);
    } else {
      parts.push(outcomes);
    }
  }

  return parts.join(' ');
}

// Build closing paragraph
function buildClosingParagraph(closing: ClosingData): string {
  const parts: string[] = [];

  if (closing.commitment.trim()) {
    parts.push(closing.commitment.trim());
  }

  if (closing.gratitude.trim()) {
    parts.push(closing.gratitude.trim());
  }

  return parts.join(' ');
}

// Main function to assemble the complete letter
export function assembleLetter(data: LOIWizardData): string {
  const { settings } = data;
  const lang = settings.language;
  const tone = settings.tone;

  // Get transitions for the selected tone and language
  const transitions = TRANSITIONS[tone][lang];

  // Salutation
  const salutation = lang === 'en'
    ? 'Dear Turkiye Scholarships Selection Committee,'
    : 'Sayin Turkiye Burslari Secim Komitesi,';

  // Build paragraphs
  const paragraphs: string[] = [];

  // Paragraph 1: Hook (no transition)
  const hookParagraph = buildHookParagraph(data.hook);
  if (hookParagraph) {
    paragraphs.push(hookParagraph);
  }

  // Paragraph 2: Academic (with transition)
  const academicParagraph = buildAcademicParagraph(data.academic);
  if (academicParagraph) {
    paragraphs.push(`${transitions.academic} ${academicParagraph}`);
  }

  // Paragraph 3: Why Scholarship (with transition)
  const scholarshipParagraph = buildScholarshipParagraph(data.whyScholarship);
  if (scholarshipParagraph) {
    paragraphs.push(`${transitions.scholarship} ${scholarshipParagraph}`);
  }

  // Paragraph 4: Why Turkey (with transition)
  const turkeyParagraph = buildTurkeyParagraph(data.whyTurkey);
  if (turkeyParagraph) {
    paragraphs.push(`${transitions.turkey} ${turkeyParagraph}`);
  }

  // Paragraph 5: Leadership (with transition)
  const leadershipParagraph = buildLeadershipParagraph(data.leadership);
  if (leadershipParagraph) {
    paragraphs.push(`${transitions.leadership} ${leadershipParagraph}`);
  }

  // Paragraph 6: Future (with transition)
  const futureParagraph = buildFutureParagraph(data.future);
  if (futureParagraph) {
    paragraphs.push(`${transitions.future} ${futureParagraph}`);
  }

  // Paragraph 7: Closing (with transition)
  const closingParagraph = buildClosingParagraph(data.closing);
  if (closingParagraph) {
    paragraphs.push(`${transitions.closing} ${closingParagraph}`);
  }

  // Signature
  const signature = lang === 'en'
    ? `Sincerely,\n${settings.fullName || '[Your Name]'}`
    : `Saygilarimla,\n${settings.fullName || '[Adiniz]'}`;

  // Assemble the letter
  const letter = [
    salutation,
    '',
    ...paragraphs.map(p => p.trim()).filter(Boolean),
    '',
    signature,
  ].join('\n\n');

  return letter;
}

// Get letter with highlighted missing sections (for preview)
export function getLetterWithHighlights(data: LOIWizardData): {
  letter: string;
  missingSteps: string[];
} {
  const missingSteps: string[] = [];

  // Check each section
  if (!data.hook.openingStatement.trim()) missingSteps.push('Hook');
  if (!data.academic.currentEducation.trim()) missingSteps.push('Academic');
  if (!data.whyScholarship.whatAttracted.trim()) missingSteps.push('Why Scholarship');
  if (!data.whyTurkey.universityName.trim()) missingSteps.push('Why Turkey');
  if (!data.leadership.situation.trim()) missingSteps.push('Leadership');
  if (!data.future.shortTermGoals.trim()) missingSteps.push('Future Plan');
  if (!data.closing.commitment.trim()) missingSteps.push('Closing');

  return {
    letter: assembleLetter(data),
    missingSteps,
  };
}

// Get word count of assembled letter
export function getLetterWordCount(data: LOIWizardData): number {
  const letter = assembleLetter(data);
  return letter.trim().split(/\s+/).filter(Boolean).length;
}

// Estimate page count (assuming ~250 words per page)
export function estimatePageCount(data: LOIWizardData): number {
  const wordCount = getLetterWordCount(data);
  return Math.ceil(wordCount / 250);
}
