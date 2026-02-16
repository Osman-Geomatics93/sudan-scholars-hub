import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding bot sample data...');

  // Create a seed user for flashcards and quiz questions
  const user = await prisma.user.upsert({
    where: { email: 'seed-bot@sudanscholars.com' },
    update: {},
    create: {
      email: 'seed-bot@sudanscholars.com',
      name: 'Sudan Scholars Bot',
      points: 500,
      badge: 'GOLD',
    },
  });

  // Also create a couple of leaderboard users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'ahmed@example.com' },
      update: { points: 1200, badge: 'DIAMOND' },
      create: { email: 'ahmed@example.com', name: 'Ahmed Hassan', points: 1200, badge: 'DIAMOND' },
    }),
    prisma.user.upsert({
      where: { email: 'fatima@example.com' },
      update: { points: 950, badge: 'PLATINUM' },
      create: { email: 'fatima@example.com', name: 'Fatima Ali', points: 950, badge: 'PLATINUM' },
    }),
    prisma.user.upsert({
      where: { email: 'omar@example.com' },
      update: { points: 720, badge: 'GOLD' },
      create: { email: 'omar@example.com', name: 'Omar Ibrahim', points: 720, badge: 'GOLD' },
    }),
    prisma.user.upsert({
      where: { email: 'maryam@example.com' },
      update: { points: 530, badge: 'GOLD' },
      create: { email: 'maryam@example.com', name: 'Maryam Khalid', points: 530, badge: 'GOLD' },
    }),
    prisma.user.upsert({
      where: { email: 'yousif@example.com' },
      update: { points: 310, badge: 'SILVER' },
      create: { email: 'yousif@example.com', name: 'Yousif Mohamed', points: 310, badge: 'SILVER' },
    }),
  ]);
  console.log(`Created/updated ${users.length + 1} users for leaderboard`);

  // ============ FLASHCARD DECKS ============
  const ieltsVocabDeck = await prisma.flashcardDeck.create({
    data: {
      userId: user.id,
      title: 'IELTS Academic Vocabulary',
      description: 'Essential vocabulary for IELTS Academic test preparation',
      subject: 'English - IELTS',
      isPublic: true,
      cards: {
        create: [
          { front: 'What does "ubiquitous" mean?', back: 'Present, appearing, or found everywhere. Example: "Smartphones have become ubiquitous in modern society."' },
          { front: 'What does "mitigate" mean?', back: 'To make less severe, serious, or painful. Example: "Governments must mitigate the effects of climate change."' },
          { front: 'What does "paradigm" mean?', back: 'A typical example or pattern of something; a model. Example: "The internet created a new paradigm for communication."' },
          { front: 'What does "pragmatic" mean?', back: 'Dealing with things sensibly and realistically. Example: "We need a pragmatic approach to solving this problem."' },
          { front: 'What does "unprecedented" mean?', back: 'Never done or known before. Example: "The pandemic caused unprecedented disruption to education."' },
          { front: 'What does "substantiate" mean?', back: 'To provide evidence to support or prove the truth of. Example: "The researcher substantiated her claims with data."' },
          { front: 'What does "proliferate" mean?', back: 'To increase rapidly in number; multiply. Example: "Online courses have proliferated in recent years."' },
          { front: 'What does "albeit" mean?', back: 'Although; even though. Example: "The results were positive, albeit modest."' },
        ],
      },
    },
  });
  console.log(`Created deck: ${ieltsVocabDeck.title} (${8} cards)`);

  const scholarshipPrepDeck = await prisma.flashcardDeck.create({
    data: {
      userId: user.id,
      title: 'Scholarship Application Tips',
      description: 'Key concepts and tips for scholarship applications',
      subject: 'Scholarship Prep',
      isPublic: true,
      cards: {
        create: [
          { front: 'What are the 3 key components of a strong personal statement?', back: '1) Clear motivation and goals\n2) Relevant experiences and achievements\n3) How the scholarship aligns with your future plans' },
          { front: 'What is the most common mistake in scholarship essays?', back: 'Being too generic. Tailor each essay to the specific scholarship, mentioning the organization\'s values and how you align with them.' },
          { front: 'What documents are typically required for scholarship applications?', back: 'Transcripts, recommendation letters, personal statement, CV/resume, language test scores (IELTS/TOEFL), and sometimes a research proposal.' },
          { front: 'How early should you start preparing for scholarship deadlines?', back: 'At least 3-6 months before the deadline. This allows time for test preparation, gathering documents, and writing strong essays.' },
          { front: 'What makes a recommendation letter strong?', back: 'Specific examples of your abilities, written by someone who knows your work well, addressing leadership, academic excellence, and character.' },
          { front: 'What is the Chevening scholarship looking for?', back: 'Leadership potential, networking ability, a clear career plan, and commitment to returning to your home country to create positive change.' },
        ],
      },
    },
  });
  console.log(`Created deck: ${scholarshipPrepDeck.title} (${6} cards)`);

  const mathDeck = await prisma.flashcardDeck.create({
    data: {
      userId: user.id,
      title: 'University Math Fundamentals',
      description: 'Core math concepts for university-level courses',
      subject: 'Mathematics',
      isPublic: true,
      cards: {
        create: [
          { front: 'What is the derivative of sin(x)?', back: 'cos(x)' },
          { front: 'What is the integral of 1/x dx?', back: 'ln|x| + C' },
          { front: 'State the Pythagorean theorem', back: 'In a right triangle, a² + b² = c², where c is the hypotenuse.' },
          { front: 'What is the quadratic formula?', back: 'x = (-b ± √(b² - 4ac)) / 2a, for ax² + bx + c = 0' },
          { front: 'What is L\'Hôpital\'s rule?', back: 'If lim f(x)/g(x) gives 0/0 or ∞/∞, then lim f(x)/g(x) = lim f\'(x)/g\'(x)' },
        ],
      },
    },
  });
  console.log(`Created deck: ${mathDeck.title} (${5} cards)`);

  // ============ QUIZ / BATTLE QUESTIONS ============
  const quizQuestions = await Promise.all([
    // General Knowledge
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'General Knowledge', question: 'Which organization administers the Fulbright Program?', optionA: 'UNESCO', optionB: 'U.S. Department of State', optionC: 'World Bank', optionD: 'British Council', correctOption: 'B', difficulty: 'easy' },
    }),
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'General Knowledge', question: 'What does IELTS stand for?', optionA: 'International English Language Testing System', optionB: 'International English Literacy Testing Standard', optionC: 'Integrated English Language Training System', optionD: 'International Education Language Test Score', correctOption: 'A', difficulty: 'easy' },
    }),
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'General Knowledge', question: 'Which country hosts the most international students worldwide?', optionA: 'United Kingdom', optionB: 'Australia', optionC: 'United States', optionD: 'Canada', correctOption: 'C', difficulty: 'medium' },
    }),
    // IELTS Prep
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'IELTS Prep', question: 'What is the highest band score in IELTS?', optionA: '8', optionB: '9', optionC: '10', optionD: '100', correctOption: 'B', difficulty: 'easy' },
    }),
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'IELTS Prep', question: 'How many sections does the IELTS test have?', optionA: '3', optionB: '4', optionC: '5', optionD: '6', correctOption: 'B', difficulty: 'easy' },
    }),
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'IELTS Prep', question: 'Which IELTS writing task requires you to describe a graph or chart?', optionA: 'Task 1', optionB: 'Task 2', optionC: 'Both tasks', optionD: 'Neither task', correctOption: 'A', difficulty: 'medium' },
    }),
    // Mathematics
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'Mathematics', question: 'What is the value of π (pi) to two decimal places?', optionA: '3.12', optionB: '3.14', optionC: '3.16', optionD: '3.18', correctOption: 'B', difficulty: 'easy' },
    }),
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'Mathematics', question: 'What is the derivative of x³?', optionA: 'x²', optionB: '2x²', optionC: '3x²', optionD: '3x³', correctOption: 'C', difficulty: 'medium' },
    }),
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'Mathematics', question: 'If log₂(x) = 5, what is x?', optionA: '10', optionB: '25', optionC: '32', optionD: '64', correctOption: 'C', difficulty: 'medium' },
    }),
    // Physics
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'Physics', question: 'What is the SI unit of force?', optionA: 'Watt', optionB: 'Joule', optionC: 'Newton', optionD: 'Pascal', correctOption: 'C', difficulty: 'easy' },
    }),
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'Physics', question: 'What is the speed of light in vacuum (approximately)?', optionA: '3 × 10⁶ m/s', optionB: '3 × 10⁸ m/s', optionC: '3 × 10¹⁰ m/s', optionD: '3 × 10⁴ m/s', correctOption: 'B', difficulty: 'easy' },
    }),
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'Physics', question: 'According to Einstein\'s equation E=mc², what does c represent?', optionA: 'Coulomb constant', optionB: 'Speed of sound', optionC: 'Speed of light', optionD: 'Gravitational constant', correctOption: 'C', difficulty: 'medium' },
    }),
    // Scholarship Knowledge
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'Scholarship Knowledge', question: 'The Türkiye Bursları scholarship covers which of the following?', optionA: 'Tuition only', optionB: 'Tuition and accommodation', optionC: 'Tuition, accommodation, and monthly stipend', optionD: 'Tuition, accommodation, stipend, health insurance, and Turkish language course', correctOption: 'D', difficulty: 'medium' },
    }),
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'Scholarship Knowledge', question: 'Which scholarship requires applicants to return to their home country for at least 2 years?', optionA: 'Erasmus Mundus', optionB: 'Chevening', optionC: 'DAAD', optionD: 'Fulbright', correctOption: 'B', difficulty: 'hard' },
    }),
    prisma.battleQuestion.create({
      data: { userId: user.id, subject: 'Scholarship Knowledge', question: 'What minimum IELTS score do most UK universities require for postgraduate studies?', optionA: '5.5', optionB: '6.0', optionC: '6.5', optionD: '7.0', correctOption: 'C', difficulty: 'medium' },
    }),
  ]);
  console.log(`Created ${quizQuestions.length} quiz questions`);

  // ============ STUDY MATERIALS ============
  const materials = await Promise.all([
    prisma.studyMaterial.create({
      data: {
        title: 'IELTS Writing Task 2 - Essay Templates',
        type: 'pdf',
        url: 'https://example.com/ielts-writing-templates.pdf',
        description: 'Comprehensive guide with 10 essay templates for IELTS Writing Task 2, covering opinion, discussion, problem-solution, and advantage-disadvantage essays.',
        subject: 'English - IELTS',
        countryId: 'seed-uk',
        countryName: 'United Kingdom',
        universityId: 'seed-general',
        universityName: 'General Resource',
        degreeId: 'seed-prep',
        degreeName: 'Test Preparation',
        semester: 'All',
        status: 'APPROVED',
        downloadCount: 245,
        averageRating: 4.7,
        reviewCount: 32,
        viewCount: 1200,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        title: 'Scholarship Personal Statement Guide',
        type: 'pdf',
        url: 'https://example.com/personal-statement-guide.pdf',
        description: 'Step-by-step guide to writing a compelling personal statement for scholarship applications, with real examples from successful applicants.',
        subject: 'Scholarship Prep',
        countryId: 'seed-general',
        countryName: 'International',
        universityId: 'seed-general',
        universityName: 'General Resource',
        degreeId: 'seed-prep',
        degreeName: 'Application Prep',
        semester: 'All',
        status: 'APPROVED',
        downloadCount: 189,
        averageRating: 4.9,
        reviewCount: 28,
        viewCount: 950,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        title: 'Calculus I - Complete Lecture Notes',
        type: 'pdf',
        url: 'https://example.com/calculus-notes.pdf',
        description: 'Full semester lecture notes covering limits, derivatives, integrals, and applications. Includes solved examples and practice problems.',
        subject: 'Mathematics',
        countryId: 'seed-turkey',
        countryName: 'Turkey',
        universityId: 'seed-istanbul',
        universityName: 'Istanbul University',
        degreeId: 'seed-bsc',
        degreeName: 'Bachelor of Science',
        semester: 'Semester 1',
        status: 'APPROVED',
        downloadCount: 312,
        averageRating: 4.5,
        reviewCount: 45,
        viewCount: 1800,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        title: 'Introduction to Physics - Problem Sets',
        type: 'pdf',
        url: 'https://example.com/physics-problems.pdf',
        description: 'Collection of 200+ physics problems covering mechanics, thermodynamics, and waves with detailed solutions.',
        subject: 'Physics',
        countryId: 'seed-turkey',
        countryName: 'Turkey',
        universityId: 'seed-bogazici',
        universityName: 'Bogazici University',
        degreeId: 'seed-bsc',
        degreeName: 'Bachelor of Science',
        semester: 'Semester 1',
        status: 'APPROVED',
        downloadCount: 178,
        averageRating: 4.3,
        reviewCount: 22,
        viewCount: 890,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        title: 'TOEFL Speaking Section Strategies',
        type: 'video',
        url: 'https://example.com/toefl-speaking.mp4',
        description: 'Video guide covering all 4 TOEFL speaking tasks with sample responses and timing strategies.',
        subject: 'English - TOEFL',
        countryId: 'seed-us',
        countryName: 'United States',
        universityId: 'seed-general',
        universityName: 'General Resource',
        degreeId: 'seed-prep',
        degreeName: 'Test Preparation',
        semester: 'All',
        status: 'APPROVED',
        downloadCount: 134,
        averageRating: 4.6,
        reviewCount: 19,
        viewCount: 720,
      },
    }),
    prisma.studyMaterial.create({
      data: {
        title: 'Academic Writing for Graduate Students',
        type: 'pdf',
        url: 'https://example.com/academic-writing.pdf',
        description: 'Guide to academic writing conventions including thesis structure, literature reviews, citations, and research methodology.',
        subject: 'Academic Writing',
        countryId: 'seed-general',
        countryName: 'International',
        universityId: 'seed-general',
        universityName: 'General Resource',
        degreeId: 'seed-msc',
        degreeName: 'Master of Science',
        semester: 'All',
        status: 'APPROVED',
        downloadCount: 267,
        averageRating: 4.8,
        reviewCount: 38,
        viewCount: 1450,
      },
    }),
  ]);
  console.log(`Created ${materials.length} study materials`);

  console.log('\nBot sample data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
