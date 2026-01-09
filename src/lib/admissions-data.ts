// Turkish University Admissions Data

export interface UniversityAdmission {
  id: string;
  universityNameEn: string;
  universityNameTr: string;
  universityNameAr: string;
  city: string;
  cityAr: string;
  degree: 'bachelor' | 'master' | 'phd' | 'all';
  registrationStart: string;
  registrationEnd: string;
  resultsDate: string;
  acceptedCertificates: string[];
  detailsUrl: string;
  applicationType: 'yos' | 'direct' | 'sat' | 'turkiye-burslari';
  localRanking: number;
  specialization?: string;
}

export const certificateTypes = [
  { value: 'YOS', labelEn: 'YOS', labelAr: 'يوس' },
  { value: 'SAT', labelEn: 'SAT', labelAr: 'سات' },
  { value: 'ACT', labelEn: 'ACT', labelAr: 'اي سي تي' },
  { value: 'THANAWEYA', labelEn: 'Thanaweya', labelAr: 'الثانوية العامة' },
  { value: 'IB', labelEn: 'IB', labelAr: 'البكالوريا الدولية' },
  { value: 'ABITUR', labelEn: 'Abitur', labelAr: 'ابيتور' },
  { value: 'BAGRUT', labelEn: 'Bagrut', labelAr: 'بجروت' },
  { value: 'GCE', labelEn: 'GCE A-Level', labelAr: 'جي سي اي' },
];

export const applicationTypes = [
  { value: 'yos', labelEn: 'YOS Exam', labelAr: 'امتحان يوس' },
  { value: 'direct', labelEn: 'Direct Application', labelAr: 'تقديم مباشر' },
  { value: 'sat', labelEn: 'SAT Based', labelAr: 'بناءً على سات' },
  { value: 'turkiye-burslari', labelEn: 'Türkiye Burslari', labelAr: 'المنحة التركية' },
];

export const turkishCities = [
  { value: 'Istanbul', labelEn: 'Istanbul', labelAr: 'اسطنبول' },
  { value: 'Ankara', labelEn: 'Ankara', labelAr: 'أنقرة' },
  { value: 'Izmir', labelEn: 'Izmir', labelAr: 'إزمير' },
  { value: 'Bursa', labelEn: 'Bursa', labelAr: 'بورصة' },
  { value: 'Antalya', labelEn: 'Antalya', labelAr: 'أنطاليا' },
  { value: 'Trabzon', labelEn: 'Trabzon', labelAr: 'طرابزون' },
  { value: 'Konya', labelEn: 'Konya', labelAr: 'قونيا' },
  { value: 'Kayseri', labelEn: 'Kayseri', labelAr: 'قيصري' },
  { value: 'Eskisehir', labelEn: 'Eskisehir', labelAr: 'اسكي شهير' },
  { value: 'Samsun', labelEn: 'Samsun', labelAr: 'سامسون' },
  { value: 'Erzurum', labelEn: 'Erzurum', labelAr: 'أرضروم' },
  { value: 'Gaziantep', labelEn: 'Gaziantep', labelAr: 'غازي عنتاب' },
  { value: 'Adana', labelEn: 'Adana', labelAr: 'أضنة' },
  { value: 'Mersin', labelEn: 'Mersin', labelAr: 'مرسين' },
  { value: 'Diyarbakir', labelEn: 'Diyarbakir', labelAr: 'ديار بكر' },
];

// Sample admissions data - This would typically come from an API/database
export const admissionsData: UniversityAdmission[] = [
  {
    id: '1',
    universityNameEn: 'Istanbul University',
    universityNameTr: 'İstanbul Üniversitesi',
    universityNameAr: 'جامعة اسطنبول',
    city: 'Istanbul',
    cityAr: 'اسطنبول',
    degree: 'bachelor',
    registrationStart: '2026-01-15',
    registrationEnd: '2026-02-28',
    resultsDate: '2026-03-15',
    acceptedCertificates: ['YOS', 'SAT', 'THANAWEYA'],
    detailsUrl: 'https://www.istanbul.edu.tr',
    applicationType: 'yos',
    localRanking: 1,
  },
  {
    id: '2',
    universityNameEn: 'Middle East Technical University',
    universityNameTr: 'Orta Doğu Teknik Üniversitesi',
    universityNameAr: 'جامعة الشرق الأوسط التقنية',
    city: 'Ankara',
    cityAr: 'أنقرة',
    degree: 'bachelor',
    registrationStart: '2026-01-20',
    registrationEnd: '2026-03-10',
    resultsDate: '2026-03-25',
    acceptedCertificates: ['YOS', 'SAT', 'ACT', 'IB'],
    detailsUrl: 'https://www.metu.edu.tr',
    applicationType: 'yos',
    localRanking: 2,
  },
  {
    id: '3',
    universityNameEn: 'Karadeniz Technical University',
    universityNameTr: 'Karadeniz Teknik Üniversitesi',
    universityNameAr: 'جامعة كارادينيز التقنية',
    city: 'Trabzon',
    cityAr: 'طرابزون',
    degree: 'bachelor',
    registrationStart: '2026-01-10',
    registrationEnd: '2026-02-15',
    resultsDate: '2026-03-01',
    acceptedCertificates: ['YOS', 'THANAWEYA'],
    detailsUrl: 'https://www.ktu.edu.tr',
    applicationType: 'yos',
    localRanking: 15,
  },
  {
    id: '4',
    universityNameEn: 'Boğaziçi University',
    universityNameTr: 'Boğaziçi Üniversitesi',
    universityNameAr: 'جامعة البوسفور',
    city: 'Istanbul',
    cityAr: 'اسطنبول',
    degree: 'bachelor',
    registrationStart: '2026-02-01',
    registrationEnd: '2026-03-15',
    resultsDate: '2026-04-01',
    acceptedCertificates: ['SAT', 'ACT', 'IB', 'GCE'],
    detailsUrl: 'https://www.boun.edu.tr',
    applicationType: 'sat',
    localRanking: 3,
  },
  {
    id: '5',
    universityNameEn: 'Ankara University',
    universityNameTr: 'Ankara Üniversitesi',
    universityNameAr: 'جامعة أنقرة',
    city: 'Ankara',
    cityAr: 'أنقرة',
    degree: 'bachelor',
    registrationStart: '2026-01-25',
    registrationEnd: '2026-02-25',
    resultsDate: '2026-03-10',
    acceptedCertificates: ['YOS', 'THANAWEYA', 'ABITUR'],
    detailsUrl: 'https://www.ankara.edu.tr',
    applicationType: 'yos',
    localRanking: 5,
  },
  {
    id: '6',
    universityNameEn: 'Ege University',
    universityNameTr: 'Ege Üniversitesi',
    universityNameAr: 'جامعة إيجه',
    city: 'Izmir',
    cityAr: 'إزمير',
    degree: 'bachelor',
    registrationStart: '2026-01-18',
    registrationEnd: '2026-02-20',
    resultsDate: '2026-03-05',
    acceptedCertificates: ['YOS', 'SAT', 'THANAWEYA'],
    detailsUrl: 'https://www.ege.edu.tr',
    applicationType: 'yos',
    localRanking: 8,
  },
  {
    id: '7',
    universityNameEn: 'Hacettepe University',
    universityNameTr: 'Hacettepe Üniversitesi',
    universityNameAr: 'جامعة حجي تبه',
    city: 'Ankara',
    cityAr: 'أنقرة',
    degree: 'bachelor',
    registrationStart: '2026-02-05',
    registrationEnd: '2026-03-05',
    resultsDate: '2026-03-20',
    acceptedCertificates: ['YOS', 'SAT', 'IB', 'THANAWEYA'],
    detailsUrl: 'https://www.hacettepe.edu.tr',
    applicationType: 'yos',
    localRanking: 4,
  },
  {
    id: '8',
    universityNameEn: 'Yıldız Technical University',
    universityNameTr: 'Yıldız Teknik Üniversitesi',
    universityNameAr: 'جامعة يلدز التقنية',
    city: 'Istanbul',
    cityAr: 'اسطنبول',
    degree: 'bachelor',
    registrationStart: '2026-01-12',
    registrationEnd: '2026-02-12',
    resultsDate: '2026-02-28',
    acceptedCertificates: ['YOS', 'THANAWEYA'],
    detailsUrl: 'https://www.yildiz.edu.tr',
    applicationType: 'yos',
    localRanking: 10,
  },
  {
    id: '9',
    universityNameEn: 'Dokuz Eylül University',
    universityNameTr: 'Dokuz Eylül Üniversitesi',
    universityNameAr: 'جامعة دوكوز ايلول',
    city: 'Izmir',
    cityAr: 'إزمير',
    degree: 'bachelor',
    registrationStart: '2026-01-22',
    registrationEnd: '2026-02-22',
    resultsDate: '2026-03-08',
    acceptedCertificates: ['YOS', 'SAT', 'THANAWEYA'],
    detailsUrl: 'https://www.deu.edu.tr',
    applicationType: 'yos',
    localRanking: 12,
  },
  {
    id: '10',
    universityNameEn: 'Anadolu University',
    universityNameTr: 'Anadolu Üniversitesi',
    universityNameAr: 'جامعة الأناضول',
    city: 'Eskisehir',
    cityAr: 'اسكي شهير',
    degree: 'bachelor',
    registrationStart: '2026-01-28',
    registrationEnd: '2026-02-28',
    resultsDate: '2026-03-12',
    acceptedCertificates: ['YOS', 'THANAWEYA', 'ABITUR'],
    detailsUrl: 'https://www.anadolu.edu.tr',
    applicationType: 'yos',
    localRanking: 7,
  },
  {
    id: '11',
    universityNameEn: 'Uludağ University',
    universityNameTr: 'Uludağ Üniversitesi',
    universityNameAr: 'جامعة أولوداغ',
    city: 'Bursa',
    cityAr: 'بورصة',
    degree: 'bachelor',
    registrationStart: '2026-02-10',
    registrationEnd: '2026-03-10',
    resultsDate: '2026-03-25',
    acceptedCertificates: ['YOS', 'THANAWEYA'],
    detailsUrl: 'https://www.uludag.edu.tr',
    applicationType: 'yos',
    localRanking: 18,
  },
  {
    id: '12',
    universityNameEn: 'Atatürk University',
    universityNameTr: 'Atatürk Üniversitesi',
    universityNameAr: 'جامعة أتاتورك',
    city: 'Erzurum',
    cityAr: 'أرضروم',
    degree: 'bachelor',
    registrationStart: '2026-01-08',
    registrationEnd: '2026-02-08',
    resultsDate: '2026-02-25',
    acceptedCertificates: ['YOS', 'THANAWEYA'],
    detailsUrl: 'https://www.atauni.edu.tr',
    applicationType: 'yos',
    localRanking: 14,
  },
  {
    id: '13',
    universityNameEn: 'Akdeniz University',
    universityNameTr: 'Akdeniz Üniversitesi',
    universityNameAr: 'جامعة أكدنيز',
    city: 'Antalya',
    cityAr: 'أنطاليا',
    degree: 'bachelor',
    registrationStart: '2026-02-15',
    registrationEnd: '2026-03-15',
    resultsDate: '2026-03-30',
    acceptedCertificates: ['YOS', 'SAT', 'THANAWEYA'],
    detailsUrl: 'https://www.akdeniz.edu.tr',
    applicationType: 'yos',
    localRanking: 20,
  },
  {
    id: '14',
    universityNameEn: 'Selçuk University',
    universityNameTr: 'Selçuk Üniversitesi',
    universityNameAr: 'جامعة سلجوق',
    city: 'Konya',
    cityAr: 'قونيا',
    degree: 'bachelor',
    registrationStart: '2026-01-05',
    registrationEnd: '2026-02-05',
    resultsDate: '2026-02-20',
    acceptedCertificates: ['YOS', 'THANAWEYA'],
    detailsUrl: 'https://www.selcuk.edu.tr',
    applicationType: 'yos',
    localRanking: 25,
  },
  {
    id: '15',
    universityNameEn: 'Gaziantep University',
    universityNameTr: 'Gaziantep Üniversitesi',
    universityNameAr: 'جامعة غازي عنتاب',
    city: 'Gaziantep',
    cityAr: 'غازي عنتاب',
    degree: 'bachelor',
    registrationStart: '2026-02-20',
    registrationEnd: '2026-03-20',
    resultsDate: '2026-04-05',
    acceptedCertificates: ['YOS', 'THANAWEYA', 'SAT'],
    detailsUrl: 'https://www.gantep.edu.tr',
    applicationType: 'yos',
    localRanking: 22,
  },
];

// Helper function to get registration status
export function getRegistrationStatus(startDate: string, endDate: string): 'upcoming' | 'open' | 'ending-soon' | 'ended' {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return 'upcoming';
  } else if (now > end) {
    return 'ended';
  } else {
    const daysUntilEnd = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilEnd <= 7) {
      return 'ending-soon';
    }
    return 'open';
  }
}

// Helper to get unique cities from data
export function getUniqueCities(data: UniversityAdmission[]): string[] {
  return [...new Set(data.map(item => item.city))].sort();
}

// Helper to get unique certificates from data
export function getUniqueCertificates(data: UniversityAdmission[]): string[] {
  const allCerts = data.flatMap(item => item.acceptedCertificates);
  return [...new Set(allCerts)].sort();
}
