import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const universities = [
  // Top 20 QS World University Rankings 2025
  { name: 'Massachusetts Institute of Technology', nameAr: 'معهد ماساتشوستس للتكنولوجيا', country: 'USA', countryAr: 'الولايات المتحدة', qsRank: 1, timesRank: 3 },
  { name: 'Imperial College London', nameAr: 'إمبريال كوليدج لندن', country: 'UK', countryAr: 'المملكة المتحدة', qsRank: 2, timesRank: 8 },
  { name: 'University of Oxford', nameAr: 'جامعة أكسفورد', country: 'UK', countryAr: 'المملكة المتحدة', qsRank: 3, timesRank: 1 },
  { name: 'Harvard University', nameAr: 'جامعة هارفارد', country: 'USA', countryAr: 'الولايات المتحدة', qsRank: 4, timesRank: 4 },
  { name: 'University of Cambridge', nameAr: 'جامعة كامبريدج', country: 'UK', countryAr: 'المملكة المتحدة', qsRank: 5, timesRank: 5 },
  { name: 'Stanford University', nameAr: 'جامعة ستانفورد', country: 'USA', countryAr: 'الولايات المتحدة', qsRank: 6, timesRank: 2 },
  { name: 'ETH Zurich', nameAr: 'المعهد الفدرالي للتكنولوجيا في زيورخ', country: 'Switzerland', countryAr: 'سويسرا', qsRank: 7, timesRank: 11 },
  { name: 'National University of Singapore', nameAr: 'الجامعة الوطنية في سنغافورة', country: 'Singapore', countryAr: 'سنغافورة', qsRank: 8, timesRank: 17 },
  { name: 'UCL', nameAr: 'كلية لندن الجامعية', country: 'UK', countryAr: 'المملكة المتحدة', qsRank: 9, timesRank: 22 },
  { name: 'California Institute of Technology', nameAr: 'معهد كاليفورنيا للتكنولوجيا', country: 'USA', countryAr: 'الولايات المتحدة', qsRank: 10, timesRank: 7 },
  { name: 'University of Pennsylvania', nameAr: 'جامعة بنسلفانيا', country: 'USA', countryAr: 'الولايات المتحدة', qsRank: 11, timesRank: 12 },
  { name: 'University of California, Berkeley', nameAr: 'جامعة كاليفورنيا، بيركلي', country: 'USA', countryAr: 'الولايات المتحدة', qsRank: 12, timesRank: 9 },
  { name: 'University of Melbourne', nameAr: 'جامعة ملبورن', country: 'Australia', countryAr: 'أستراليا', qsRank: 13, timesRank: 37 },
  { name: 'Peking University', nameAr: 'جامعة بكين', country: 'China', countryAr: 'الصين', qsRank: 14, timesRank: 14 },
  { name: 'Nanyang Technological University', nameAr: 'جامعة نانيانغ التكنولوجية', country: 'Singapore', countryAr: 'سنغافورة', qsRank: 15, timesRank: 19 },
  { name: 'Cornell University', nameAr: 'جامعة كورنيل', country: 'USA', countryAr: 'الولايات المتحدة', qsRank: 16, timesRank: 20 },
  { name: 'University of Hong Kong', nameAr: 'جامعة هونغ كونغ', country: 'Hong Kong', countryAr: 'هونغ كونغ', qsRank: 17, timesRank: 35 },
  { name: 'University of Sydney', nameAr: 'جامعة سيدني', country: 'Australia', countryAr: 'أستراليا', qsRank: 18, timesRank: 56 },
  { name: 'Tsinghua University', nameAr: 'جامعة تسينغهوا', country: 'China', countryAr: 'الصين', qsRank: 19, timesRank: 12 },
  { name: 'Princeton University', nameAr: 'جامعة برينستون', country: 'USA', countryAr: 'الولايات المتحدة', qsRank: 20, timesRank: 6 },

  // Top scholarship destination universities (21-50)
  { name: 'Yale University', nameAr: 'جامعة ييل', country: 'USA', countryAr: 'الولايات المتحدة', qsRank: 23, timesRank: 10 },
  { name: 'University of Toronto', nameAr: 'جامعة تورنتو', country: 'Canada', countryAr: 'كندا', qsRank: 25, timesRank: 21 },
  { name: 'University of Edinburgh', nameAr: 'جامعة إدنبرة', country: 'UK', countryAr: 'المملكة المتحدة', qsRank: 27, timesRank: 27 },
  { name: 'Columbia University', nameAr: 'جامعة كولومبيا', country: 'USA', countryAr: 'الولايات المتحدة', qsRank: 29, timesRank: 15 },
  { name: 'University of Tokyo', nameAr: 'جامعة طوكيو', country: 'Japan', countryAr: 'اليابان', qsRank: 32, timesRank: 29 },
  { name: 'University of Manchester', nameAr: 'جامعة مانشستر', country: 'UK', countryAr: 'المملكة المتحدة', qsRank: 34, timesRank: 50 },
  { name: 'McGill University', nameAr: 'جامعة ماكجيل', country: 'Canada', countryAr: 'كندا', qsRank: 36, timesRank: 49 },
  { name: 'Australian National University', nameAr: 'الجامعة الوطنية الأسترالية', country: 'Australia', countryAr: 'أستراليا', qsRank: 37, timesRank: 67 },
  { name: 'Seoul National University', nameAr: 'جامعة سيول الوطنية', country: 'South Korea', countryAr: 'كوريا الجنوبية', qsRank: 41, timesRank: 56 },
  { name: 'Kyoto University', nameAr: 'جامعة كيوتو', country: 'Japan', countryAr: 'اليابان', qsRank: 50, timesRank: 55 },

  // Turkish Universities (important for Türkiye Burslari)
  { name: 'Koç University', nameAr: 'جامعة كوتش', country: 'Turkey', countryAr: 'تركيا', qsRank: 431, timesRank: 401 },
  { name: 'Sabanci University', nameAr: 'جامعة صابانجي', country: 'Turkey', countryAr: 'تركيا', qsRank: 454, timesRank: 351 },
  { name: 'Bilkent University', nameAr: 'جامعة بيلكنت', country: 'Turkey', countryAr: 'تركيا', qsRank: 465, timesRank: 501 },
  { name: 'Middle East Technical University', nameAr: 'جامعة الشرق الأوسط التقنية', country: 'Turkey', countryAr: 'تركيا', qsRank: 479, timesRank: 401 },
  { name: 'Bogazici University', nameAr: 'جامعة بوغازيتشي', country: 'Turkey', countryAr: 'تركيا', qsRank: 532, timesRank: 601 },
  { name: 'Istanbul Technical University', nameAr: 'جامعة إسطنبول التقنية', country: 'Turkey', countryAr: 'تركيا', qsRank: 555, timesRank: 501 },
  { name: 'Ankara University', nameAr: 'جامعة أنقرة', country: 'Turkey', countryAr: 'تركيا', qsRank: 751, timesRank: 801 },
  { name: 'Istanbul University', nameAr: 'جامعة إسطنبول', country: 'Turkey', countryAr: 'تركيا', qsRank: 801, timesRank: 601 },

  // German Universities (DAAD scholarships)
  { name: 'Technical University of Munich', nameAr: 'جامعة ميونخ التقنية', country: 'Germany', countryAr: 'ألمانيا', qsRank: 28, timesRank: 30 },
  { name: 'LMU Munich', nameAr: 'جامعة لودفيغ ماكسيميليان ميونخ', country: 'Germany', countryAr: 'ألمانيا', qsRank: 38, timesRank: 32 },
  { name: 'Heidelberg University', nameAr: 'جامعة هايدلبرغ', country: 'Germany', countryAr: 'ألمانيا', qsRank: 47, timesRank: 43 },
  { name: 'Humboldt University of Berlin', nameAr: 'جامعة هومبولت في برلين', country: 'Germany', countryAr: 'ألمانيا', qsRank: 87, timesRank: 87 },
  { name: 'RWTH Aachen University', nameAr: 'جامعة آخن التقنية', country: 'Germany', countryAr: 'ألمانيا', qsRank: 90, timesRank: 89 },

  // Other popular scholarship destinations
  { name: 'University of British Columbia', nameAr: 'جامعة بريتيش كولومبيا', country: 'Canada', countryAr: 'كندا', qsRank: 38, timesRank: 41 },
  { name: 'University of New South Wales', nameAr: 'جامعة نيو ساوث ويلز', country: 'Australia', countryAr: 'أستراليا', qsRank: 19, timesRank: 84 },
  { name: 'University of Queensland', nameAr: 'جامعة كوينزلاند', country: 'Australia', countryAr: 'أستراليا', qsRank: 40, timesRank: 60 },
  { name: 'King\'s College London', nameAr: 'كينغز كوليدج لندن', country: 'UK', countryAr: 'المملكة المتحدة', qsRank: 40, timesRank: 36 },
  { name: 'University of Warwick', nameAr: 'جامعة وارويك', country: 'UK', countryAr: 'المملكة المتحدة', qsRank: 69, timesRank: 94 },
  { name: 'Durham University', nameAr: 'جامعة درهام', country: 'UK', countryAr: 'المملكة المتحدة', qsRank: 82, timesRank: 169 },
];

async function main() {
  console.log('Seeding universities...');

  for (const uni of universities) {
    await prisma.university.upsert({
      where: { name: uni.name },
      update: uni,
      create: uni,
    });
    console.log(`Added/Updated: ${uni.name} (QS #${uni.qsRank})`);
  }

  console.log(`\nSeeded ${universities.length} universities successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
