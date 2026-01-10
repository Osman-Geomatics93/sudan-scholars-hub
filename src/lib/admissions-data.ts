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
  applicationFee?: number;
  applicationFeeCurrency?: 'TRY' | 'USD' | 'EUR';
  isFreeApplication: boolean;
  // New fields for calendar types
  calendarType?: 'bachelor' | 'masters-phd' | 'summer';
  programDuration?: string;
  languageOfInstruction?: string[];
}

export const certificateTypes = [
  // Turkish YOS Exams
  { value: 'TR-YOS', labelEn: 'TR-YÖS', labelAr: 'يوس تركي (TR-YÖS)' },
  { value: 'AYOS', labelEn: 'AYÖS', labelAr: 'ايوس (AYÖS)' },
  { value: 'TYOS', labelEn: 'T-YÖS', labelAr: 'تي يوس (T-YÖS)' },
  { value: 'IUYOS', labelEn: 'IU-YÖS', labelAr: 'يوس جامعة اسطنبول' },
  { value: 'AUYOS', labelEn: 'AU-YÖS', labelAr: 'يوس جامعة أنقرة' },
  { value: 'UNIYOS', labelEn: 'University YÖS', labelAr: 'يوس الجامعة' },

  // High School Certificates (Arabic)
  { value: 'THANAWEYA', labelEn: 'Thanaweya', labelAr: 'ثانوية' },
  { value: 'THANAWEYA_TR', labelEn: 'Turkish Thanaweya', labelAr: 'ثانوية تركية' },
  { value: 'THANAWEYA_SY', labelEn: 'Syrian Thanaweya', labelAr: 'ثانوية سورية' },
  { value: 'THANAWEYA_EG', labelEn: 'Egyptian Thanaweya', labelAr: 'ثانوية مصرية' },
  { value: 'THANAWEYA_JO', labelEn: 'Jordanian Tawjihi', labelAr: 'توجيهي أردني' },
  { value: 'THANAWEYA_PS', labelEn: 'Palestinian Tawjihi', labelAr: 'توجيهي فلسطيني' },
  { value: 'THANAWEYA_IQ', labelEn: 'Iraqi Baccalaureate', labelAr: 'بكالوريا عراقية' },
  { value: 'THANAWEYA_LB', labelEn: 'Lebanese Baccalaureate', labelAr: 'بكالوريا لبنانية' },
  { value: 'THANAWEYA_SA', labelEn: 'Saudi Thanaweya', labelAr: 'ثانوية سعودية' },
  { value: 'THANAWEYA_KW', labelEn: 'Kuwaiti Thanaweya', labelAr: 'ثانوية كويتية' },
  { value: 'THANAWEYA_AE', labelEn: 'UAE Thanaweya', labelAr: 'ثانوية إماراتية' },
  { value: 'THANAWEYA_LY', labelEn: 'Libyan Thanaweya', labelAr: 'ثانوية ليبية' },
  { value: 'THANAWEYA_DZ', labelEn: 'Algerian Baccalaureate', labelAr: 'بكالوريا جزائرية' },
  { value: 'THANAWEYA_MA', labelEn: 'Moroccan Baccalaureate', labelAr: 'بكالوريا مغربية' },
  { value: 'THANAWEYA_TN', labelEn: 'Tunisian Baccalaureate', labelAr: 'بكالوريا تونسية' },
  { value: 'THANAWEYA_SD', labelEn: 'Sudanese Thanaweya', labelAr: 'ثانوية سودانية' },
  { value: 'THANAWEYA_YE', labelEn: 'Yemeni Thanaweya', labelAr: 'ثانوية يمنية' },

  // International Standardized Tests
  { value: 'SAT', labelEn: 'SAT', labelAr: 'سات (SAT)' },
  { value: 'ACT', labelEn: 'ACT', labelAr: 'اي سي تي (ACT)' },
  { value: 'IB', labelEn: 'IB Diploma', labelAr: 'البكالوريا الدولية (IB)' },
  { value: 'AP', labelEn: 'AP Exams', labelAr: 'اي بي (AP)' },

  // European Certificates
  { value: 'ABITUR', labelEn: 'German Abitur', labelAr: 'ابيتور ألماني' },
  { value: 'GCE', labelEn: 'GCE A-Level', labelAr: 'جي سي اي' },
  { value: 'BACCALAUREAT_FR', labelEn: 'French Baccalauréat', labelAr: 'بكالوريا فرنسية' },
  { value: 'MATURA', labelEn: 'Matura (Austria/Poland)', labelAr: 'ماتورا' },

  // Other Countries
  { value: 'BAGRUT', labelEn: 'Bagrut (Israel)', labelAr: 'بجروت' },
  { value: 'GAOKAO', labelEn: 'Gaokao (China)', labelAr: 'قاوكاو صيني' },
  { value: 'INDIAN_12', labelEn: 'Indian 12th Grade', labelAr: 'ثانوية هندية' },
  { value: 'IRANIAN', labelEn: 'Iranian Diploma', labelAr: 'دبلوم إيراني' },
  { value: 'AFGHAN', labelEn: 'Afghan Diploma', labelAr: 'ثانوية أفغانية' },
  { value: 'PAKISTAN', labelEn: 'Pakistani Matric/FSc', labelAr: 'ثانوية باكستانية' },

  // Turkish National Exams
  { value: 'TYT', labelEn: 'TYT (Turkish)', labelAr: 'تي واي تي (TYT)' },
  { value: 'AYT', labelEn: 'AYT (Turkish)', labelAr: 'اي واي تي (AYT)' },

  // ========== GRADUATE PROGRAM REQUIREMENTS (Masters/PhD) ==========

  // Language Proficiency Exams
  { value: 'YDS', labelEn: 'YDS', labelAr: 'يدس (YDS)' },
  { value: 'YOKDIL', labelEn: 'YÖKDİL', labelAr: 'يوكديل (YÖKDİL)' },
  { value: 'TOEFL', labelEn: 'TOEFL iBT', labelAr: 'توفل (TOEFL)' },
  { value: 'IELTS', labelEn: 'IELTS', labelAr: 'آيلتس (IELTS)' },
  { value: 'PTE', labelEn: 'PTE Academic', labelAr: 'بي تي إي أكاديمي' },
  { value: 'TOMER', labelEn: 'TÖMER', labelAr: 'تومر (TÖMER)' },
  { value: 'DUOLINGO', labelEn: 'Duolingo English Test', labelAr: 'دولينجو' },

  // Graduate Admission Exams
  { value: 'ALES', labelEn: 'ALES', labelAr: 'أليس (ALES)' },
  { value: 'GRE', labelEn: 'GRE General', labelAr: 'جي آر إي (GRE)' },
  { value: 'GRE_SUBJECT', labelEn: 'GRE Subject', labelAr: 'جي آر إي تخصصي' },
  { value: 'GMAT', labelEn: 'GMAT', labelAr: 'جيمات (GMAT)' },

  // Degree/Diploma Requirements
  { value: 'BACHELOR_DEGREE', labelEn: "Bachelor's Degree", labelAr: 'شهادة البكالوريوس' },
  { value: 'MASTER_DEGREE', labelEn: "Master's Degree", labelAr: 'شهادة الماجستير' },
  { value: 'TRANSCRIPT', labelEn: 'Official Transcript', labelAr: 'كشف الدرجات الرسمي' },
];

export const applicationTypes = [
  // Bachelor Application Types
  { value: 'yos', labelEn: 'YOS Exam', labelAr: 'امتحان يوس' },
  { value: 'direct', labelEn: 'Direct Application', labelAr: 'تقديم مباشر' },
  { value: 'sat', labelEn: 'SAT Based', labelAr: 'بناءً على سات' },
  { value: 'turkiye-burslari', labelEn: 'Türkiye Burslari', labelAr: 'المنحة التركية' },

  // Graduate Application Types
  { value: 'graduate-institute', labelEn: 'Graduate Institute', labelAr: 'معهد الدراسات العليا' },
  { value: 'online-portal', labelEn: 'Online Portal', labelAr: 'بوابة إلكترونية' },
  { value: 'ales-based', labelEn: 'ALES Based', labelAr: 'بناءً على أليس' },
];

// All 81 Turkish provinces organized by region
export const turkishCities = [
  // Marmara Region (11 cities)
  { value: 'Istanbul', labelEn: 'Istanbul', labelAr: 'اسطنبول' },
  { value: 'Bursa', labelEn: 'Bursa', labelAr: 'بورصة' },
  { value: 'Kocaeli', labelEn: 'Kocaeli', labelAr: 'كوجالي' },
  { value: 'Sakarya', labelEn: 'Sakarya', labelAr: 'صقاريا' },
  { value: 'Tekirdag', labelEn: 'Tekirdağ', labelAr: 'تكيرداغ' },
  { value: 'Balikesir', labelEn: 'Balıkesir', labelAr: 'باليكسير' },
  { value: 'Canakkale', labelEn: 'Çanakkale', labelAr: 'جناق قلعة' },
  { value: 'Edirne', labelEn: 'Edirne', labelAr: 'أدرنة' },
  { value: 'Kirklareli', labelEn: 'Kırklareli', labelAr: 'كيركلاريلي' },
  { value: 'Bilecik', labelEn: 'Bilecik', labelAr: 'بيلجيك' },
  { value: 'Yalova', labelEn: 'Yalova', labelAr: 'يالوفا' },

  // Central Anatolia (13 cities)
  { value: 'Ankara', labelEn: 'Ankara', labelAr: 'أنقرة' },
  { value: 'Konya', labelEn: 'Konya', labelAr: 'قونيا' },
  { value: 'Kayseri', labelEn: 'Kayseri', labelAr: 'قيصري' },
  { value: 'Eskisehir', labelEn: 'Eskişehir', labelAr: 'اسكي شهير' },
  { value: 'Sivas', labelEn: 'Sivas', labelAr: 'سيواس' },
  { value: 'Aksaray', labelEn: 'Aksaray', labelAr: 'أقصراي' },
  { value: 'Nevsehir', labelEn: 'Nevşehir', labelAr: 'نوشهير' },
  { value: 'Nigde', labelEn: 'Niğde', labelAr: 'نيدة' },
  { value: 'Kirsehir', labelEn: 'Kırşehir', labelAr: 'كيرشهير' },
  { value: 'Karaman', labelEn: 'Karaman', labelAr: 'كارامان' },
  { value: 'Cankiri', labelEn: 'Çankırı', labelAr: 'تشانكيري' },
  { value: 'Yozgat', labelEn: 'Yozgat', labelAr: 'يوزغات' },
  { value: 'Kirikkale', labelEn: 'Kırıkkale', labelAr: 'كيريكالي' },

  // Aegean Region (8 cities)
  { value: 'Izmir', labelEn: 'İzmir', labelAr: 'إزمير' },
  { value: 'Aydin', labelEn: 'Aydın', labelAr: 'أيدين' },
  { value: 'Denizli', labelEn: 'Denizli', labelAr: 'دنيزلي' },
  { value: 'Manisa', labelEn: 'Manisa', labelAr: 'مانيسا' },
  { value: 'Mugla', labelEn: 'Muğla', labelAr: 'موغلا' },
  { value: 'Afyon', labelEn: 'Afyonkarahisar', labelAr: 'أفيون' },
  { value: 'Kutahya', labelEn: 'Kütahya', labelAr: 'كوتاهيا' },
  { value: 'Usak', labelEn: 'Uşak', labelAr: 'أوشاك' },

  // Mediterranean Region (8 cities)
  { value: 'Antalya', labelEn: 'Antalya', labelAr: 'أنطاليا' },
  { value: 'Adana', labelEn: 'Adana', labelAr: 'أضنة' },
  { value: 'Mersin', labelEn: 'Mersin', labelAr: 'مرسين' },
  { value: 'Hatay', labelEn: 'Hatay', labelAr: 'هاتاي' },
  { value: 'Kahramanmaras', labelEn: 'Kahramanmaraş', labelAr: 'كهرمان مرعش' },
  { value: 'Osmaniye', labelEn: 'Osmaniye', labelAr: 'عثمانية' },
  { value: 'Burdur', labelEn: 'Burdur', labelAr: 'بوردور' },
  { value: 'Isparta', labelEn: 'Isparta', labelAr: 'إسبارطة' },

  // Black Sea Region (18 cities)
  { value: 'Samsun', labelEn: 'Samsun', labelAr: 'سامسون' },
  { value: 'Trabzon', labelEn: 'Trabzon', labelAr: 'طرابزون' },
  { value: 'Ordu', labelEn: 'Ordu', labelAr: 'أوردو' },
  { value: 'Giresun', labelEn: 'Giresun', labelAr: 'غيرسون' },
  { value: 'Rize', labelEn: 'Rize', labelAr: 'ريزا' },
  { value: 'Artvin', labelEn: 'Artvin', labelAr: 'أرتفين' },
  { value: 'Zonguldak', labelEn: 'Zonguldak', labelAr: 'زونغولداك' },
  { value: 'Kastamonu', labelEn: 'Kastamonu', labelAr: 'كاستامونو' },
  { value: 'Sinop', labelEn: 'Sinop', labelAr: 'سينوب' },
  { value: 'Amasya', labelEn: 'Amasya', labelAr: 'أماسيا' },
  { value: 'Tokat', labelEn: 'Tokat', labelAr: 'توكات' },
  { value: 'Corum', labelEn: 'Çorum', labelAr: 'تشوروم' },
  { value: 'Bolu', labelEn: 'Bolu', labelAr: 'بولو' },
  { value: 'Duzce', labelEn: 'Düzce', labelAr: 'دوزجة' },
  { value: 'Karabuk', labelEn: 'Karabük', labelAr: 'كارابوك' },
  { value: 'Bartin', labelEn: 'Bartın', labelAr: 'بارتين' },
  { value: 'Gumushane', labelEn: 'Gümüşhane', labelAr: 'غوموشهانة' },
  { value: 'Bayburt', labelEn: 'Bayburt', labelAr: 'بايبورت' },

  // Eastern Anatolia (14 cities)
  { value: 'Erzurum', labelEn: 'Erzurum', labelAr: 'أرضروم' },
  { value: 'Malatya', labelEn: 'Malatya', labelAr: 'ملاطية' },
  { value: 'Elazig', labelEn: 'Elazığ', labelAr: 'ألازيغ' },
  { value: 'Van', labelEn: 'Van', labelAr: 'فان' },
  { value: 'Erzincan', labelEn: 'Erzincan', labelAr: 'أرزينجان' },
  { value: 'Agri', labelEn: 'Ağrı', labelAr: 'آغري' },
  { value: 'Kars', labelEn: 'Kars', labelAr: 'قارص' },
  { value: 'Igdir', labelEn: 'Iğdır', labelAr: 'إغدير' },
  { value: 'Ardahan', labelEn: 'Ardahan', labelAr: 'أردهان' },
  { value: 'Mus', labelEn: 'Muş', labelAr: 'موش' },
  { value: 'Bitlis', labelEn: 'Bitlis', labelAr: 'بيتليس' },
  { value: 'Bingol', labelEn: 'Bingöl', labelAr: 'بينغول' },
  { value: 'Tunceli', labelEn: 'Tunceli', labelAr: 'تونجلي' },
  { value: 'Hakkari', labelEn: 'Hakkari', labelAr: 'هكاري' },

  // Southeastern Anatolia (9 cities)
  { value: 'Gaziantep', labelEn: 'Gaziantep', labelAr: 'غازي عنتاب' },
  { value: 'Diyarbakir', labelEn: 'Diyarbakır', labelAr: 'ديار بكر' },
  { value: 'Sanliurfa', labelEn: 'Şanlıurfa', labelAr: 'شانلي أورفا' },
  { value: 'Mardin', labelEn: 'Mardin', labelAr: 'ماردين' },
  { value: 'Batman', labelEn: 'Batman', labelAr: 'باتمان' },
  { value: 'Siirt', labelEn: 'Siirt', labelAr: 'سعرت' },
  { value: 'Sirnak', labelEn: 'Şırnak', labelAr: 'شيرناك' },
  { value: 'Adiyaman', labelEn: 'Adıyaman', labelAr: 'أديامان' },
  { value: 'Kilis', labelEn: 'Kilis', labelAr: 'كليس' },
];

// Calendar types
export const calendarTypes = [
  { value: 'bachelor', labelEn: 'Bachelor', labelAr: 'بكالوريوس' },
  { value: 'masters-phd', labelEn: 'Masters & PhD', labelAr: 'ماجستير ودكتوراه' },
  { value: 'summer', labelEn: 'Summer Programs', labelAr: 'البرامج الصيفية' },
];

// Program durations (for summer programs)
export const programDurations = [
  { value: '2-weeks', labelEn: '2 Weeks', labelAr: 'أسبوعين' },
  { value: '4-weeks', labelEn: '4 Weeks', labelAr: '4 أسابيع' },
  { value: '6-weeks', labelEn: '6 Weeks', labelAr: '6 أسابيع' },
  { value: '8-weeks', labelEn: '8 Weeks', labelAr: '8 أسابيع' },
  { value: '12-weeks', labelEn: '12 Weeks', labelAr: '12 أسبوع' },
  { value: 'semester', labelEn: 'Full Semester', labelAr: 'فصل دراسي كامل' },
];

// Languages of instruction
export const instructionLanguages = [
  { value: 'Turkish', labelEn: 'Turkish', labelAr: 'التركية' },
  { value: 'English', labelEn: 'English', labelAr: 'الإنجليزية' },
  { value: 'Arabic', labelEn: 'Arabic', labelAr: 'العربية' },
  { value: 'German', labelEn: 'German', labelAr: 'الألمانية' },
  { value: 'French', labelEn: 'French', labelAr: 'الفرنسية' },
];

// Certificate categories for grouped display in forms
export const certificateCategories = [
  {
    category: 'yos',
    labelEn: 'YÖS Exams',
    labelAr: 'امتحانات يوس',
    forCalendarTypes: ['bachelor'],
    certificates: ['TR-YOS', 'AYOS', 'TYOS', 'IUYOS', 'AUYOS', 'UNIYOS'],
  },
  {
    category: 'highschool',
    labelEn: 'High School Certificates',
    labelAr: 'شهادات الثانوية',
    forCalendarTypes: ['bachelor'],
    certificates: [
      'THANAWEYA', 'THANAWEYA_TR', 'THANAWEYA_SY', 'THANAWEYA_EG',
      'THANAWEYA_JO', 'THANAWEYA_PS', 'THANAWEYA_IQ', 'THANAWEYA_LB',
      'THANAWEYA_SA', 'THANAWEYA_KW', 'THANAWEYA_AE', 'THANAWEYA_LY',
      'THANAWEYA_DZ', 'THANAWEYA_MA', 'THANAWEYA_TN', 'THANAWEYA_SD', 'THANAWEYA_YE',
    ],
  },
  {
    category: 'international',
    labelEn: 'International Exams',
    labelAr: 'الامتحانات الدولية',
    forCalendarTypes: ['bachelor'],
    certificates: ['SAT', 'ACT', 'IB', 'AP', 'ABITUR', 'GCE', 'BACCALAUREAT_FR', 'MATURA'],
  },
  {
    category: 'other-countries',
    labelEn: 'Other Countries',
    labelAr: 'دول أخرى',
    forCalendarTypes: ['bachelor'],
    certificates: ['BAGRUT', 'GAOKAO', 'INDIAN_12', 'IRANIAN', 'AFGHAN', 'PAKISTAN'],
  },
  {
    category: 'turkish-national',
    labelEn: 'Turkish National Exams',
    labelAr: 'الامتحانات التركية الوطنية',
    forCalendarTypes: ['bachelor'],
    certificates: ['TYT', 'AYT'],
  },
  {
    category: 'language',
    labelEn: 'Language Proficiency',
    labelAr: 'إثبات اللغة',
    forCalendarTypes: ['masters-phd', 'summer'],
    certificates: ['YDS', 'YOKDIL', 'TOEFL', 'IELTS', 'PTE', 'TOMER', 'DUOLINGO'],
  },
  {
    category: 'graduate',
    labelEn: 'Graduate Exams',
    labelAr: 'امتحانات الدراسات العليا',
    forCalendarTypes: ['masters-phd'],
    certificates: ['ALES', 'GRE', 'GRE_SUBJECT', 'GMAT'],
  },
  {
    category: 'degree',
    labelEn: 'Degree Requirements',
    labelAr: 'متطلبات الشهادة',
    forCalendarTypes: ['masters-phd'],
    certificates: ['BACHELOR_DEGREE', 'MASTER_DEGREE', 'TRANSCRIPT'],
  },
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
    acceptedCertificates: ['TR-YOS', 'SAT', 'THANAWEYA'],
    detailsUrl: 'https://www.istanbul.edu.tr',
    applicationType: 'yos',
    localRanking: 1,
    isFreeApplication: true,
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
    acceptedCertificates: ['TR-YOS', 'SAT', 'ACT', 'IB'],
    detailsUrl: 'https://www.metu.edu.tr',
    applicationType: 'yos',
    localRanking: 2,
    applicationFee: 150,
    applicationFeeCurrency: 'TRY',
    isFreeApplication: false,
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
    acceptedCertificates: ['TR-YOS', 'THANAWEYA', 'THANAWEYA_TR'],
    detailsUrl: 'https://www.ktu.edu.tr',
    applicationType: 'yos',
    localRanking: 15,
    isFreeApplication: true,
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
    applicationFee: 50,
    applicationFeeCurrency: 'USD',
    isFreeApplication: false,
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
    acceptedCertificates: ['TR-YOS', 'THANAWEYA', 'ABITUR', 'THANAWEYA_TR'],
    detailsUrl: 'https://www.ankara.edu.tr',
    applicationType: 'yos',
    localRanking: 5,
    isFreeApplication: true,
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
    acceptedCertificates: ['TR-YOS', 'SAT', 'THANAWEYA'],
    detailsUrl: 'https://www.ege.edu.tr',
    applicationType: 'yos',
    localRanking: 8,
    isFreeApplication: true,
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
    acceptedCertificates: ['TR-YOS', 'SAT', 'IB', 'THANAWEYA'],
    detailsUrl: 'https://www.hacettepe.edu.tr',
    applicationType: 'yos',
    localRanking: 4,
    applicationFee: 200,
    applicationFeeCurrency: 'TRY',
    isFreeApplication: false,
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
    acceptedCertificates: ['TR-YOS', 'THANAWEYA', 'THANAWEYA_TR'],
    detailsUrl: 'https://www.yildiz.edu.tr',
    applicationType: 'yos',
    localRanking: 10,
    isFreeApplication: true,
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
    acceptedCertificates: ['TR-YOS', 'SAT', 'THANAWEYA'],
    detailsUrl: 'https://www.deu.edu.tr',
    applicationType: 'yos',
    localRanking: 12,
    isFreeApplication: true,
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
    acceptedCertificates: ['TR-YOS', 'THANAWEYA', 'ABITUR', 'THANAWEYA_TR'],
    detailsUrl: 'https://www.anadolu.edu.tr',
    applicationType: 'yos',
    localRanking: 7,
    isFreeApplication: true,
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
    acceptedCertificates: ['TR-YOS', 'THANAWEYA'],
    detailsUrl: 'https://www.uludag.edu.tr',
    applicationType: 'yos',
    localRanking: 18,
    isFreeApplication: true,
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
    acceptedCertificates: ['TR-YOS', 'THANAWEYA', 'THANAWEYA_TR'],
    detailsUrl: 'https://www.atauni.edu.tr',
    applicationType: 'yos',
    localRanking: 14,
    isFreeApplication: true,
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
    acceptedCertificates: ['TR-YOS', 'SAT', 'THANAWEYA'],
    detailsUrl: 'https://www.akdeniz.edu.tr',
    applicationType: 'yos',
    localRanking: 20,
    applicationFee: 100,
    applicationFeeCurrency: 'TRY',
    isFreeApplication: false,
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
    acceptedCertificates: ['TR-YOS', 'THANAWEYA', 'THANAWEYA_TR'],
    detailsUrl: 'https://www.selcuk.edu.tr',
    applicationType: 'yos',
    localRanking: 25,
    isFreeApplication: true,
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
    acceptedCertificates: ['TR-YOS', 'THANAWEYA', 'SAT', 'THANAWEYA_TR'],
    detailsUrl: 'https://www.gantep.edu.tr',
    applicationType: 'yos',
    localRanking: 22,
    isFreeApplication: true,
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
