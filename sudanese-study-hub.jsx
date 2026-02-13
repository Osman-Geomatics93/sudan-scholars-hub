import { useState, useEffect, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { COUNTRIES } from "@/lib/constants/countries";


const TELEGRAM_LINK = "https://t.me/+uNRCkz0PUfQzOGZk";

const DEGREE_LEVELS = [
  { id: "bsc", name: "BSc — Bachelor", icon: "🎓", color: "#2E86C1", arabic: "بكالوريوس", desc: "Undergraduate programs" },
  { id: "msc", name: "MSc — Master", icon: "📜", color: "#27AE60", arabic: "ماجستير", desc: "Postgraduate programs" },
  { id: "phd", name: "PhD — Doctorate", icon: "🏅", color: "#8E44AD", arabic: "دكتوراه", desc: "Doctoral research programs" },
  { id: "other", name: "Other Programs", icon: "📋", color: "#E67E22", arabic: "أخرى", desc: "Diploma, Certificate & more" },
];

const SEMESTERS_MAP = {
  bsc: ["Semester 1","Semester 2","Semester 3","Semester 4","Semester 5","Semester 6","Semester 7","Semester 8","Semester 9","Semester 10"],
  msc: ["Semester 1","Semester 2","Semester 3","Semester 4"],
  phd: ["Year 1","Year 2","Year 3","Year 4","Year 5"],
  other: ["Term 1","Term 2","Term 3","Term 4"],
};

const FILE_TYPES = [
  { id: "pdf", label: "PDF", icon: "📄", color: "#E74C3C" },
  { id: "docx", label: "DOCX", icon: "📝", color: "#2E86C1" },
  { id: "pptx", label: "PPT", icon: "📊", color: "#E67E22" },
  { id: "video", label: "Video", icon: "🎬", color: "#8E44AD" },
];

const getTypeInfo = (type) => FILE_TYPES.find((f) => f.id === type) || FILE_TYPES[0];

const UPLOADER_ROLES = [
  { id: "student", label: "Student", icon: "🎓", color: "#2E86C1" },
  { id: "teacher", label: "Teacher / Professor", icon: "👨‍🏫", color: "#27AE60" },
  { id: "ta", label: "Teaching Assistant", icon: "🧑‍🏫", color: "#E67E22" },
  { id: "other", label: "Other", icon: "👤", color: "#95A5A6" },
];

const getRoleInfo = (role) => UPLOADER_ROLES.find((r) => r.id === role) || UPLOADER_ROLES[0];

const FACULTIES = [
  { id: "medicine", name: "Medicine", nameAr: "الطب", icon: "🩺" },
  { id: "engineering", name: "Engineering", nameAr: "الهندسة", icon: "⚙️" },
  { id: "pharmacy", name: "Pharmacy", nameAr: "الصيدلة", icon: "💊" },
  { id: "dentistry", name: "Dentistry", nameAr: "طب الأسنان", icon: "🦷" },
  { id: "science", name: "Science", nameAr: "العلوم", icon: "🔬" },
  { id: "cs_it", name: "Computer Science & IT", nameAr: "علوم الحاسوب وتقنية المعلومات", icon: "💻" },
  { id: "law", name: "Law", nameAr: "القانون", icon: "⚖️" },
  { id: "business", name: "Business & Commerce", nameAr: "إدارة الأعمال والتجارة", icon: "📈" },
  { id: "economics", name: "Economics & Political Science", nameAr: "الاقتصاد والعلوم السياسية", icon: "🏛️" },
  { id: "arts_humanities", name: "Arts & Humanities", nameAr: "الآداب والعلوم الإنسانية", icon: "📚" },
  { id: "education", name: "Education", nameAr: "التربية", icon: "🎓" },
  { id: "agriculture", name: "Agriculture", nameAr: "الزراعة", icon: "🌾" },
  { id: "nursing", name: "Nursing", nameAr: "التمريض", icon: "🏥" },
  { id: "veterinary", name: "Veterinary Medicine", nameAr: "الطب البيطري", icon: "🐾" },
  { id: "architecture", name: "Architecture & Planning", nameAr: "العمارة والتخطيط", icon: "🏗️" },
  { id: "media", name: "Media & Communication", nameAr: "الإعلام والاتصال", icon: "📡" },
  { id: "islamic_studies", name: "Islamic Studies & Sharia", nameAr: "الدراسات الإسلامية والشريعة", icon: "🕌" },
  { id: "languages", name: "Languages & Translation", nameAr: "اللغات والترجمة", icon: "🌐" },
  { id: "psychology", name: "Psychology", nameAr: "علم النفس", icon: "🧠" },
  { id: "public_health", name: "Public Health", nameAr: "الصحة العامة", icon: "🏥" },
  { id: "social_sciences", name: "Social Sciences", nameAr: "العلوم الاجتماعية", icon: "👥" },
  { id: "environmental", name: "Environmental Science", nameAr: "العلوم البيئية", icon: "🌍" },
  { id: "fine_arts", name: "Fine Arts & Design", nameAr: "الفنون الجميلة والتصميم", icon: "🎨" },
  { id: "music_performing", name: "Music & Performing Arts", nameAr: "الموسيقى والفنون المسرحية", icon: "🎭" },
];

const SPECIALTIES_MAP = {
  medicine: [
    { id: "general_medicine", name: "General Medicine", nameAr: "الطب العام" },
    { id: "surgery", name: "Surgery", nameAr: "الجراحة" },
    { id: "internal_medicine", name: "Internal Medicine", nameAr: "الباطنية" },
    { id: "pediatrics", name: "Pediatrics", nameAr: "طب الأطفال" },
    { id: "obstetrics_gynecology", name: "Obstetrics & Gynecology", nameAr: "النساء والتوليد" },
    { id: "orthopedics", name: "Orthopedics", nameAr: "جراحة العظام" },
    { id: "dermatology", name: "Dermatology", nameAr: "الأمراض الجلدية" },
    { id: "ophthalmology", name: "Ophthalmology", nameAr: "طب العيون" },
    { id: "ent", name: "ENT", nameAr: "الأنف والأذن والحنجرة" },
    { id: "psychiatry", name: "Psychiatry", nameAr: "الطب النفسي" },
    { id: "radiology", name: "Radiology", nameAr: "الأشعة" },
    { id: "anesthesia", name: "Anesthesia", nameAr: "التخدير" },
    { id: "pathology", name: "Pathology", nameAr: "علم الأمراض" },
    { id: "anatomy", name: "Anatomy", nameAr: "التشريح" },
    { id: "physiology", name: "Physiology", nameAr: "علم وظائف الأعضاء" },
  ],
  engineering: [
    { id: "civil", name: "Civil Engineering", nameAr: "الهندسة المدنية" },
    { id: "mechanical", name: "Mechanical Engineering", nameAr: "الهندسة الميكانيكية" },
    { id: "electrical", name: "Electrical Engineering", nameAr: "الهندسة الكهربائية" },
    { id: "electronic", name: "Electronic Engineering", nameAr: "الهندسة الإلكترونية" },
    { id: "chemical", name: "Chemical Engineering", nameAr: "الهندسة الكيميائية" },
    { id: "petroleum", name: "Petroleum Engineering", nameAr: "هندسة البترول" },
    { id: "industrial", name: "Industrial Engineering", nameAr: "الهندسة الصناعية" },
    { id: "biomedical", name: "Biomedical Engineering", nameAr: "الهندسة الطبية الحيوية" },
    { id: "environmental_eng", name: "Environmental Engineering", nameAr: "الهندسة البيئية" },
    { id: "mining", name: "Mining Engineering", nameAr: "هندسة التعدين" },
    { id: "telecom", name: "Telecommunications Engineering", nameAr: "هندسة الاتصالات" },
    { id: "surveying", name: "Surveying Engineering", nameAr: "هندسة المساحة" },
  ],
  pharmacy: [
    { id: "clinical_pharmacy", name: "Clinical Pharmacy", nameAr: "الصيدلة السريرية" },
    { id: "pharmaceutics", name: "Pharmaceutics", nameAr: "الصيدلانيات" },
    { id: "pharmacology", name: "Pharmacology", nameAr: "علم الأدوية" },
    { id: "pharmaceutical_chemistry", name: "Pharmaceutical Chemistry", nameAr: "الكيمياء الصيدلية" },
    { id: "pharmacognosy", name: "Pharmacognosy", nameAr: "العقاقير" },
    { id: "industrial_pharmacy", name: "Industrial Pharmacy", nameAr: "الصيدلة الصناعية" },
    { id: "pharmacy_practice", name: "Pharmacy Practice", nameAr: "ممارسة الصيدلة" },
    { id: "toxicology", name: "Toxicology", nameAr: "علم السموم" },
  ],
  dentistry: [
    { id: "oral_surgery", name: "Oral Surgery", nameAr: "جراحة الفم" },
    { id: "orthodontics", name: "Orthodontics", nameAr: "تقويم الأسنان" },
    { id: "periodontics", name: "Periodontics", nameAr: "أمراض اللثة" },
    { id: "prosthodontics", name: "Prosthodontics", nameAr: "الاستعاضة السنية" },
    { id: "endodontics", name: "Endodontics", nameAr: "علاج الجذور" },
    { id: "pediatric_dentistry", name: "Pediatric Dentistry", nameAr: "طب أسنان الأطفال" },
    { id: "oral_pathology", name: "Oral Pathology", nameAr: "أمراض الفم" },
    { id: "preventive_dentistry", name: "Preventive Dentistry", nameAr: "طب الأسنان الوقائي" },
  ],
  science: [
    { id: "mathematics", name: "Mathematics", nameAr: "الرياضيات" },
    { id: "physics", name: "Physics", nameAr: "الفيزياء" },
    { id: "chemistry", name: "Chemistry", nameAr: "الكيمياء" },
    { id: "biology", name: "Biology", nameAr: "الأحياء" },
    { id: "geology", name: "Geology", nameAr: "الجيولوجيا" },
    { id: "statistics", name: "Statistics", nameAr: "الإحصاء" },
    { id: "microbiology", name: "Microbiology", nameAr: "الأحياء الدقيقة" },
    { id: "biochemistry", name: "Biochemistry", nameAr: "الكيمياء الحيوية" },
    { id: "zoology", name: "Zoology", nameAr: "علم الحيوان" },
    { id: "botany", name: "Botany", nameAr: "علم النبات" },
  ],
  cs_it: [
    { id: "computer_science", name: "Computer Science", nameAr: "علوم الحاسوب" },
    { id: "software_engineering", name: "Software Engineering", nameAr: "هندسة البرمجيات" },
    { id: "information_systems", name: "Information Systems", nameAr: "نظم المعلومات" },
    { id: "information_technology", name: "Information Technology", nameAr: "تقنية المعلومات" },
    { id: "ai_ml", name: "AI & Machine Learning", nameAr: "الذكاء الاصطناعي وتعلم الآلة" },
    { id: "cybersecurity", name: "Cybersecurity", nameAr: "الأمن السيبراني" },
    { id: "data_science", name: "Data Science", nameAr: "علم البيانات" },
    { id: "networking", name: "Networking", nameAr: "الشبكات" },
    { id: "computer_engineering", name: "Computer Engineering", nameAr: "هندسة الحاسوب" },
  ],
  law: [
    { id: "constitutional_law", name: "Constitutional Law", nameAr: "القانون الدستوري" },
    { id: "criminal_law", name: "Criminal Law", nameAr: "القانون الجنائي" },
    { id: "civil_law", name: "Civil Law", nameAr: "القانون المدني" },
    { id: "commercial_law", name: "Commercial Law", nameAr: "القانون التجاري" },
    { id: "international_law", name: "International Law", nameAr: "القانون الدولي" },
    { id: "islamic_law", name: "Islamic Law", nameAr: "الفقه الإسلامي" },
    { id: "administrative_law", name: "Administrative Law", nameAr: "القانون الإداري" },
    { id: "labor_law", name: "Labor Law", nameAr: "قانون العمل" },
  ],
  business: [
    { id: "accounting", name: "Accounting", nameAr: "المحاسبة" },
    { id: "finance", name: "Finance", nameAr: "التمويل" },
    { id: "marketing", name: "Marketing", nameAr: "التسويق" },
    { id: "management", name: "Management", nameAr: "الإدارة" },
    { id: "human_resources", name: "Human Resources", nameAr: "الموارد البشرية" },
    { id: "business_admin", name: "Business Administration", nameAr: "إدارة الأعمال" },
    { id: "supply_chain", name: "Supply Chain Management", nameAr: "إدارة سلاسل الإمداد" },
    { id: "entrepreneurship", name: "Entrepreneurship", nameAr: "ريادة الأعمال" },
    { id: "banking", name: "Banking", nameAr: "الأعمال المصرفية" },
    { id: "international_business", name: "International Business", nameAr: "الأعمال الدولية" },
  ],
  economics: [
    { id: "economic_theory", name: "Economic Theory", nameAr: "النظرية الاقتصادية" },
    { id: "applied_economics", name: "Applied Economics", nameAr: "الاقتصاد التطبيقي" },
    { id: "development_economics", name: "Development Economics", nameAr: "اقتصاديات التنمية" },
    { id: "political_science", name: "Political Science", nameAr: "العلوم السياسية" },
    { id: "international_relations", name: "International Relations", nameAr: "العلاقات الدولية" },
    { id: "public_policy", name: "Public Policy", nameAr: "السياسات العامة" },
    { id: "econometrics", name: "Econometrics", nameAr: "الاقتصاد القياسي" },
    { id: "public_finance", name: "Public Finance", nameAr: "المالية العامة" },
  ],
  arts_humanities: [
    { id: "arabic_language", name: "Arabic Language", nameAr: "اللغة العربية" },
    { id: "english_language", name: "English Language", nameAr: "اللغة الإنجليزية" },
    { id: "history", name: "History", nameAr: "التاريخ" },
    { id: "geography", name: "Geography", nameAr: "الجغرافيا" },
    { id: "philosophy", name: "Philosophy", nameAr: "الفلسفة" },
    { id: "arabic_literature", name: "Arabic Literature", nameAr: "الأدب العربي" },
    { id: "english_literature", name: "English Literature", nameAr: "الأدب الإنجليزي" },
    { id: "linguistics", name: "Linguistics", nameAr: "اللسانيات" },
    { id: "archaeology", name: "Archaeology", nameAr: "الآثار" },
  ],
  education: [
    { id: "curriculum_instruction", name: "Curriculum & Instruction", nameAr: "المناهج وطرق التدريس" },
    { id: "educational_psychology", name: "Educational Psychology", nameAr: "علم النفس التربوي" },
    { id: "educational_admin", name: "Educational Administration", nameAr: "الإدارة التربوية" },
    { id: "special_education", name: "Special Education", nameAr: "التربية الخاصة" },
    { id: "early_childhood", name: "Early Childhood Education", nameAr: "تربية الطفولة المبكرة" },
    { id: "educational_technology", name: "Educational Technology", nameAr: "تكنولوجيا التعليم" },
    { id: "physical_education", name: "Physical Education", nameAr: "التربية البدنية" },
    { id: "science_education", name: "Science Education", nameAr: "تعليم العلوم" },
  ],
  agriculture: [
    { id: "crop_science", name: "Crop Science", nameAr: "علوم المحاصيل" },
    { id: "animal_production", name: "Animal Production", nameAr: "الإنتاج الحيواني" },
    { id: "soil_science", name: "Soil Science", nameAr: "علوم التربة" },
    { id: "horticulture", name: "Horticulture", nameAr: "البستنة" },
    { id: "agricultural_economics", name: "Agricultural Economics", nameAr: "الاقتصاد الزراعي" },
    { id: "food_science", name: "Food Science & Technology", nameAr: "علوم وتقنية الأغذية" },
    { id: "forestry", name: "Forestry", nameAr: "الغابات" },
    { id: "agricultural_engineering", name: "Agricultural Engineering", nameAr: "الهندسة الزراعية" },
    { id: "plant_protection", name: "Plant Protection", nameAr: "وقاية النبات" },
  ],
  nursing: [
    { id: "medical_surgical", name: "Medical-Surgical Nursing", nameAr: "تمريض باطني جراحي" },
    { id: "pediatric_nursing", name: "Pediatric Nursing", nameAr: "تمريض الأطفال" },
    { id: "obstetric_nursing", name: "Obstetric Nursing", nameAr: "تمريض النساء والتوليد" },
    { id: "community_nursing", name: "Community Health Nursing", nameAr: "تمريض صحة المجتمع" },
    { id: "psychiatric_nursing", name: "Psychiatric Nursing", nameAr: "التمريض النفسي" },
    { id: "nursing_admin", name: "Nursing Administration", nameAr: "إدارة التمريض" },
    { id: "critical_care_nursing", name: "Critical Care Nursing", nameAr: "تمريض العناية المركزة" },
  ],
  veterinary: [
    { id: "veterinary_surgery", name: "Veterinary Surgery", nameAr: "الجراحة البيطرية" },
    { id: "veterinary_medicine_int", name: "Veterinary Internal Medicine", nameAr: "الباطنية البيطرية" },
    { id: "animal_health", name: "Animal Health", nameAr: "صحة الحيوان" },
    { id: "veterinary_pathology", name: "Veterinary Pathology", nameAr: "الأمراض البيطرية" },
    { id: "veterinary_pharmacology", name: "Veterinary Pharmacology", nameAr: "الأدوية البيطرية" },
    { id: "poultry_science", name: "Poultry Science", nameAr: "علوم الدواجن" },
    { id: "food_hygiene", name: "Food Hygiene", nameAr: "صحة الأغذية" },
  ],
  architecture: [
    { id: "architectural_design", name: "Architectural Design", nameAr: "التصميم المعماري" },
    { id: "urban_planning", name: "Urban Planning", nameAr: "التخطيط العمراني" },
    { id: "interior_design", name: "Interior Design", nameAr: "التصميم الداخلي" },
    { id: "landscape_architecture", name: "Landscape Architecture", nameAr: "العمارة البيئية" },
    { id: "building_technology", name: "Building Technology", nameAr: "تكنولوجيا البناء" },
    { id: "sustainable_design", name: "Sustainable Design", nameAr: "التصميم المستدام" },
  ],
  media: [
    { id: "journalism", name: "Journalism", nameAr: "الصحافة" },
    { id: "public_relations", name: "Public Relations", nameAr: "العلاقات العامة" },
    { id: "broadcasting", name: "Broadcasting", nameAr: "الإذاعة والتلفزيون" },
    { id: "digital_media", name: "Digital Media", nameAr: "الإعلام الرقمي" },
    { id: "advertising", name: "Advertising", nameAr: "الإعلان" },
    { id: "mass_communication", name: "Mass Communication", nameAr: "الاتصال الجماهيري" },
    { id: "visual_communication", name: "Visual Communication", nameAr: "الاتصال البصري" },
  ],
  islamic_studies: [
    { id: "quran_sciences", name: "Quran Sciences", nameAr: "علوم القرآن" },
    { id: "hadith", name: "Hadith Studies", nameAr: "علوم الحديث" },
    { id: "fiqh", name: "Islamic Jurisprudence (Fiqh)", nameAr: "الفقه الإسلامي" },
    { id: "aqeedah", name: "Islamic Creed (Aqeedah)", nameAr: "العقيدة الإسلامية" },
    { id: "islamic_history", name: "Islamic History", nameAr: "التاريخ الإسلامي" },
    { id: "dawah", name: "Da'wah & Islamic Culture", nameAr: "الدعوة والثقافة الإسلامية" },
    { id: "usul_fiqh", name: "Principles of Jurisprudence", nameAr: "أصول الفقه" },
  ],
  languages: [
    { id: "english_translation", name: "English Translation", nameAr: "الترجمة الإنجليزية" },
    { id: "french", name: "French Language", nameAr: "اللغة الفرنسية" },
    { id: "chinese", name: "Chinese Language", nameAr: "اللغة الصينية" },
    { id: "arabic_studies", name: "Arabic Studies", nameAr: "الدراسات العربية" },
    { id: "translation_studies", name: "Translation Studies", nameAr: "دراسات الترجمة" },
    { id: "applied_linguistics", name: "Applied Linguistics", nameAr: "اللسانيات التطبيقية" },
  ],
  psychology: [
    { id: "clinical_psychology", name: "Clinical Psychology", nameAr: "علم النفس السريري" },
    { id: "counseling_psychology", name: "Counseling Psychology", nameAr: "علم النفس الإرشادي" },
    { id: "developmental_psychology", name: "Developmental Psychology", nameAr: "علم النفس النمائي" },
    { id: "social_psychology", name: "Social Psychology", nameAr: "علم النفس الاجتماعي" },
    { id: "cognitive_psychology", name: "Cognitive Psychology", nameAr: "علم النفس المعرفي" },
    { id: "organizational_psychology", name: "Organizational Psychology", nameAr: "علم النفس التنظيمي" },
  ],
  public_health: [
    { id: "epidemiology", name: "Epidemiology", nameAr: "علم الوبائيات" },
    { id: "health_promotion", name: "Health Promotion", nameAr: "تعزيز الصحة" },
    { id: "health_management", name: "Health Management", nameAr: "إدارة الصحة" },
    { id: "environmental_health", name: "Environmental Health", nameAr: "الصحة البيئية" },
    { id: "nutrition", name: "Nutrition", nameAr: "التغذية" },
    { id: "biostatistics", name: "Biostatistics", nameAr: "الإحصاء الحيوي" },
    { id: "occupational_health", name: "Occupational Health", nameAr: "الصحة المهنية" },
  ],
  social_sciences: [
    { id: "sociology", name: "Sociology", nameAr: "علم الاجتماع" },
    { id: "anthropology", name: "Anthropology", nameAr: "الأنثروبولوجيا" },
    { id: "social_work", name: "Social Work", nameAr: "الخدمة الاجتماعية" },
    { id: "demography", name: "Demography", nameAr: "الديموغرافيا" },
    { id: "gender_studies", name: "Gender Studies", nameAr: "دراسات النوع الاجتماعي" },
    { id: "criminology", name: "Criminology", nameAr: "علم الجريمة" },
    { id: "development_studies", name: "Development Studies", nameAr: "دراسات التنمية" },
  ],
  environmental: [
    { id: "ecology", name: "Ecology", nameAr: "علم البيئة" },
    { id: "conservation", name: "Conservation Biology", nameAr: "أحياء الحفظ" },
    { id: "climate_science", name: "Climate Science", nameAr: "علوم المناخ" },
    { id: "water_resources", name: "Water Resources", nameAr: "الموارد المائية" },
    { id: "waste_management", name: "Waste Management", nameAr: "إدارة النفايات" },
    { id: "environmental_policy", name: "Environmental Policy", nameAr: "السياسات البيئية" },
  ],
  fine_arts: [
    { id: "painting", name: "Painting", nameAr: "الرسم" },
    { id: "sculpture", name: "Sculpture", nameAr: "النحت" },
    { id: "graphic_design", name: "Graphic Design", nameAr: "التصميم الجرافيكي" },
    { id: "photography", name: "Photography", nameAr: "التصوير الفوتوغرافي" },
    { id: "ceramics", name: "Ceramics", nameAr: "الخزف" },
    { id: "textile_design", name: "Textile Design", nameAr: "تصميم المنسوجات" },
    { id: "art_history", name: "Art History", nameAr: "تاريخ الفن" },
  ],
  music_performing: [
    { id: "music_theory", name: "Music Theory", nameAr: "النظرية الموسيقية" },
    { id: "vocal_performance", name: "Vocal Performance", nameAr: "الأداء الصوتي" },
    { id: "instrumental", name: "Instrumental Performance", nameAr: "العزف الآلي" },
    { id: "theater", name: "Theater & Drama", nameAr: "المسرح والدراما" },
    { id: "dance", name: "Dance", nameAr: "الرقص" },
    { id: "music_education", name: "Music Education", nameAr: "التربية الموسيقية" },
  ],
};

// --- i18n: Arabic semester display labels (data keys stay English) ---
const SEMESTER_LABELS_AR = {
  "Semester 1": "الفصل ١", "Semester 2": "الفصل ٢", "Semester 3": "الفصل ٣",
  "Semester 4": "الفصل ٤", "Semester 5": "الفصل ٥", "Semester 6": "الفصل ٦",
  "Semester 7": "الفصل ٧", "Semester 8": "الفصل ٨", "Semester 9": "الفصل ٩",
  "Semester 10": "الفصل ١٠",
  "Year 1": "السنة ١", "Year 2": "السنة ٢", "Year 3": "السنة ٣",
  "Year 4": "السنة ٤", "Year 5": "السنة ٥",
  "Term 1": "الفترة ١", "Term 2": "الفترة ٢", "Term 3": "الفترة ٣", "Term 4": "الفترة ٤",
};

// --- i18n: File type labels ---
const FILE_TYPE_LABELS_AR = { pdf: "PDF", docx: "DOCX", pptx: "PPT", video: "فيديو" };

const ROLE_LABELS_AR = { student: "طالب", teacher: "أستاذ", ta: "معيد", other: "أخرى" };

// Map COUNTRIES to the shape expected by this component
const ALL_COUNTRIES = COUNTRIES.map((c) => ({
  id: c.code,
  name: c.name,
  nameAr: c.nameAr,
  flag: c.flag,
}));

// --- i18n: Translations ---
const T = {
  en: {
    siteTitle: "Sudanese Study Hub",
    siteSubtitle: "مركز الطالب السوداني",
    home: "Home",
    backToMain: "Back to Main Site",
    browseCountries: "Browse Countries",
    upload: "Upload",
    telegram: "Telegram",
    search: "Search countries, materials, faculties...",
    searchFull: "Search country...",
    searchPlaceholderShort: "Search...",
    searchCountries: "Countries",
    searchFaculties: "Faculties",
    searchMaterialsLabel: "Materials",
    searchNoResults: "No results found",
    searchHint: "Press Enter to search all materials",
    searchViewAll: "View all results for",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    signIn: "Sign In",
    heroBadge: "For Sudanese Students Worldwide",
    heroTitle: "Your Study Materials, One Platform",
    heroSub: "Upload and download PDFs, documents, presentations and video lectures — organized by country, university, degree level, and semester.",
    heroArabic: "منصة واحدة لكل طالب سوداني حول العالم",
    countries: "Countries",
    universities: "Universities",
    materials: "Materials",
    degreeLevels: "Degree Levels",
    browseByCountry: "Browse by Country",
    recentMaterials: "Recent Materials",
    recentMaterialsSub: "Latest uploads from students around the world",
    viewAllMaterials: "Browse All Materials",
    browseAllSub: "Search and filter all study materials",
    searchMaterials: "Search materials by title, subject...",
    loadMore: "Load More",
    showing: "Showing",
    of: "of",
    howItWorks: "How It Works",
    step1Title: "Select Country",
    step1Desc: "Choose the country where you study",
    step2Title: "Pick University",
    step2Desc: "Find your university from the list",
    step3Title: "Degree Level",
    step3Desc: "BSc, MSc, PhD, or Other programs",
    step4Title: "Browse & Upload",
    step4Desc: "Download or share study materials",
    videoTutorialTitle: "Watch How It Works",
    videoTutorialSub: "A quick walkthrough on how to use the Study Hub and upload your materials",
    videoTutorialBtn: "Watch Full Tutorial",
    nUniversities: "universities",
    nMaterials: "materials",
    noResultsFor: "No results for",
    universitiesIn: "Universities in",
    selectUniversity: "Select a university to continue",
    selectDegree: "Select degree level",
    selectCollege: "Select Your College",
    allFaculties: "All Faculties",
    allFacultiesDesc: "View all semesters without faculty filter",
    material: "material",
    materialPlural: "materials",
    years: "years",
    semesterTerms: "semesters/terms",
    uploadMaterial: "Upload Material",
    all: "All",
    noMaterials: "No materials yet",
    beFirst: "Be the first to upload study materials!",
    uploadFirst: "Upload First Material",
    watch: "Watch",
    download: "Download",
    selectSemesterFirst: "Select a semester first to upload materials",
    uploadStudyMaterial: "Upload Study Material",
    materialTitle: "Material Title",
    materialTitlePlaceholder: "e.g. Organic Chemistry Notes - Ch.5",
    subjectCourse: "Subject / Course",
    subjectPlaceholder: "e.g. Organic Chemistry, Calculus II",
    materialType: "Material Type",
    videoUrl: "Video URL",
    fileUrl: "File URL (Google Drive, Dropbox)",
    videoPlaceholder: "https://youtube.com/watch?v=...",
    filePlaceholder: "https://drive.google.com/file/...",
    description: "Description (optional)",
    descPlaceholder: "Brief description...",
    uploadMaterialBtn: "Upload Material",
    fillRequired: "Please fill all required fields!",
    uploadSuccess: "Material uploaded successfully! ✅",
    submittedForReview: "Material submitted for review! ✅",
    pendingReviewMsg: "Your upload will be reviewed and published within 24 hours.",
    materialUnderReview: "Under Review",
    deleteSuccess: "Material deleted 🗑️",
    footerText: "Sudanese Study Hub — Built with ❤️ for Sudanese students everywhere",
    footerAr: "منصة تعليمية للطلاب السودانيين حول العالم — بكالوريوس · ماجستير · دكتوراه",
    scholarships: "Scholarships",
    contact: "Contact",
    bscName: "BSc — Bachelor",
    mscName: "MSc — Master",
    phdName: "PhD — Doctorate",
    otherName: "Other Programs",
    bscDesc: "Undergraduate programs",
    mscDesc: "Postgraduate programs",
    phdDesc: "Doctoral research programs",
    otherDesc: "Diploma, Certificate & more",
    publicUniversities: "Public Universities",
    privateUniversities: "Private Universities",
    otherUniversities: "Other Universities",
    publicLabel: "Public",
    privateLabel: "Private",
    otherLabel: "Other",
    searchUniversities: "Search universities...",
    noUniversitiesFound: "No universities found",
    resultsCount: "results",
    loadingUniversities: "Loading universities...",
    fetchError: "Failed to load universities. Please try again.",
    editMaterial: "Edit Material",
    saveChanges: "Save Changes",
    editSuccess: "Material updated successfully!",
    confirmDelete: "Confirm Delete",
    confirmDeleteMsg: "Are you sure you want to delete",
    cancel: "Cancel",
    yesDelete: "Yes, Delete",
    myMaterials: "My Materials",
    allYourMaterials: "All your uploaded materials",
    noMyMaterials: "You haven't uploaded any materials yet",
    share: "Share",
    copyLink: "Copy Link",
    copied: "Copied!",
    shareVia: "Share via",
    edited: "edited",
    faculty: "Faculty",
    selectFaculty: "Select Faculty",
    specialty: "Specialty",
    selectSpecialty: "Select Specialty",
    selectFacultyFirst: "Select a faculty first",
    duplicateWarningTitle: "Similar Materials Found",
    duplicateWarningMsg: "The following materials with the same subject already exist in this location:",
    uploadAnyway: "Upload Anyway",
    duplicateSubject: "Subject",
    duplicateUploadedOn: "Uploaded on",
    groupBySubject: "Grouped by Subject",
    materialsInSubject: "materials",
    noSubject: "Uncategorized",
    collapseAll: "Collapse All",
    expandAll: "Expand All",
    uploaderRole: "Uploaded by",
    selectRole: "I am a...",
    roleBadgeStudent: "Student",
    roleBadgeTeacher: "Professor",
    degreeLevelsTitle: "Degree Levels",
    showAllCountries: "Show All",
    signOut: "Sign Out",
    profile: "Profile",
    loginToUpload: "Sign in to upload materials",
    myAccount: "My Account",
    statusPending: "Pending Review",
    statusRejected: "Rejected",
    statusApproved: "Approved",
    // Bookmarks
    bookmark: "Bookmark",
    bookmarked: "Bookmarked",
    savedMaterials: "Saved Materials",
    noSavedMaterials: "No saved materials yet",
    saveMaterialSuccess: "Material saved!",
    removeMaterialSuccess: "Material removed from saved",
    uploaded: "Uploaded",
    saved: "Saved",
    // Counters
    views: "views",
    downloads: "downloads",
    // Reviews
    rate: "Rate",
    reviewsLabel: "Reviews",
    writeReview: "Write a Review",
    yourRating: "Your Rating",
    addComment: "Add a comment (optional)",
    submitReview: "Submit Review",
    reviewSuccess: "Review submitted!",
    noReviews: "No reviews yet",
    beFirstReviewer: "Be the first to review this material!",
    stars: "stars",
    averageRating: "avg",
    // Preview
    preview: "Preview",
    closePreview: "Close Preview",
    cannotPreview: "Preview not available for this file type",
    // Notifications
    notifications: "Notifications",
    noNotifications: "No notifications",
    markAllRead: "Mark all read",
    clearAll: "Clear all",
    deleteNotification: "Delete",
    // Requests
    requestMaterial: "Request Material",
    requests: "Requests",
    requestTitle: "What do you need?",
    requestDesc: "Describe what you're looking for",
    submitRequest: "Submit Request",
    requestSuccess: "Request submitted!",
    openRequests: "Open Requests",
    fulfillRequest: "Fulfill",
    closeRequest: "Close",
    requestFulfilled: "Request fulfilled!",
    noRequests: "No requests yet",
    // Points
    points: "Points",
    leaderboard: "Leaderboard",
    yourPoints: "Your Points",
    rank: "Rank",
    topContributors: "Top Contributors",
    pointsEarned: "points earned",
    // Search
    sortBy: "Sort by",
    newest: "Newest",
    mostDownloaded: "Most Downloaded",
    highestRated: "Highest Rated",
    filterByRating: "Min Rating",
    filterByFaculty: "Faculty",
    filterByRole: "Uploader Role",
    clearFilters: "Clear Filters",
    advancedFilters: "Advanced Filters",
    // Recent Filter Bar
    filterByCountry: "Country",
    filterByUniversity: "University",
    filterByType: "File Type",
    filterBySemester: "Semester",
    filterByUploader: "Uploader",
    allCountries: "All Countries",
    allUniversities: "All Universities",
    allTypes: "All Types",
    allSemesters: "All Semesters",
    allUploaders: "All Uploaders",
    filterByFaculty: "College",
    filterByDegree: "Level",
    allFaculties: "All Colleges",
    allDegrees: "All Levels",
    filterBySpecialty: "Specialization",
    allSpecialties: "All Specializations",
    selectFacultyForSpecialty: "Select a college first",
    clearAllFilters: "Clear All",
    noFilterResults: "No materials match your filters",
    tryDifferentFilters: "Try adjusting or clearing filters",
    searchCountry: "Search country...",
    filteredResults: "Filtered Results",
    activeFilters: "active filters",
    // Groups
    studyGroups: "Study Groups",
    createGroup: "Create Group",
    groupName: "Group Name",
    groupDesc: "Description",
    chatPlatform: "Platform",
    chatLink: "Chat Link",
    joinGroup: "Join",
    createGroupSuccess: "Group created!",
    noGroups: "No study groups yet",
    members: "members",
    // Collections
    collections: "Collections",
    createCollection: "Create Collection",
    collectionName: "Collection Name",
    addToCollection: "Add to Collection",
    removeFromCollection: "Remove",
    publicCollection: "Public",
    privateCollection: "Private",
    noCollections: "No collections yet",
    createCollectionSuccess: "Collection created!",
    editCollection: "Edit Collection",
    editCollectionSuccess: "Collection updated!",
    deleteCollection: "Delete Collection",
    deleteCollectionSuccess: "Collection deleted!",
    deleteCollectionMsg: "Are you sure you want to delete this collection?",
    saveChanges: "Save Changes",
    viewCollection: "View Collection",
  },
  ar: {
    siteTitle: "مركز الطالب السوداني",
    siteSubtitle: "Sudanese Study Hub",
    home: "الرئيسية",
    backToMain: "العودة للموقع الرئيسي",
    browseCountries: "تصفح الدول",
    upload: "رفع",
    telegram: "تيليجرام",
    search: "ابحث عن دول، مواد، كليات...",
    searchFull: "ابحث عن دولة...",
    searchPlaceholderShort: "بحث...",
    searchCountries: "الدول",
    searchFaculties: "الكليات",
    searchMaterialsLabel: "المواد",
    searchNoResults: "لا توجد نتائج",
    searchHint: "اضغط Enter للبحث في جميع المواد",
    searchViewAll: "عرض جميع النتائج لـ",
    lightMode: "الوضع الفاتح",
    darkMode: "الوضع الداكن",
    signIn: "تسجيل الدخول",
    heroBadge: "للطلاب السودانيين حول العالم",
    heroTitle: "موادك الدراسية في منصة واحدة",
    heroSub: "ارفع وحمّل ملفات PDF والمستندات والعروض التقديمية والمحاضرات المرئية — مرتبة حسب الدولة والجامعة والمرحلة الدراسية والفصل الدراسي.",
    heroArabic: "One Platform for Every Sudanese Student Worldwide",
    countries: "دول",
    universities: "جامعات",
    materials: "مواد",
    degreeLevels: "مراحل دراسية",
    browseByCountry: "تصفح حسب الدولة",
    recentMaterials: "أحدث المواد",
    recentMaterialsSub: "آخر ما رفعه الطلاب من حول العالم",
    viewAllMaterials: "تصفح جميع المواد",
    browseAllSub: "ابحث وصنّف جميع المواد الدراسية",
    searchMaterials: "ابحث عن مادة بالعنوان أو الموضوع...",
    loadMore: "عرض المزيد",
    showing: "عرض",
    of: "من",
    howItWorks: "كيف تعمل المنصة",
    step1Title: "اختر الدولة",
    step1Desc: "اختر الدولة التي تدرس فيها",
    step2Title: "اختر الجامعة",
    step2Desc: "ابحث عن جامعتك من القائمة",
    step3Title: "المرحلة الدراسية",
    step3Desc: "بكالوريوس، ماجستير، دكتوراه، أو أخرى",
    step4Title: "تصفح وارفع",
    step4Desc: "حمّل أو شارك المواد الدراسية",
    videoTutorialTitle: "شاهد كيف تعمل المنصة",
    videoTutorialSub: "شرح سريع لكيفية استخدام مركز الدراسة ورفع موادك الدراسية",
    videoTutorialBtn: "شاهد الشرح الكامل",
    nUniversities: "جامعات",
    nMaterials: "مواد",
    noResultsFor: "لا توجد نتائج لـ",
    universitiesIn: "الجامعات في",
    selectUniversity: "اختر جامعة للمتابعة",
    selectDegree: "اختر المرحلة الدراسية",
    selectCollege: "اختر كليتك",
    allFaculties: "جميع الكليات",
    allFacultiesDesc: "عرض جميع الفصول بدون تصفية حسب الكلية",
    material: "مادة",
    materialPlural: "مواد",
    years: "سنوات",
    semesterTerms: "فصول دراسية",
    uploadMaterial: "رفع مادة",
    all: "الكل",
    noMaterials: "لا توجد مواد بعد",
    beFirst: "كن أول من يرفع مواد دراسية!",
    uploadFirst: "ارفع أول مادة",
    watch: "مشاهدة",
    download: "تحميل",
    selectSemesterFirst: "اختر فصلاً دراسياً أولاً لرفع المواد",
    uploadStudyMaterial: "رفع مادة دراسية",
    materialTitle: "عنوان المادة",
    materialTitlePlaceholder: "مثال: ملاحظات الكيمياء العضوية - الفصل ٥",
    subjectCourse: "المادة / المقرر",
    subjectPlaceholder: "مثال: الكيمياء العضوية، التفاضل والتكامل",
    materialType: "نوع المادة",
    videoUrl: "رابط الفيديو",
    fileUrl: "رابط الملف (Google Drive, Dropbox)",
    videoPlaceholder: "https://youtube.com/watch?v=...",
    filePlaceholder: "https://drive.google.com/file/...",
    description: "الوصف (اختياري)",
    descPlaceholder: "وصف مختصر...",
    uploadMaterialBtn: "📤 رفع المادة",
    fillRequired: "يرجى ملء جميع الحقول المطلوبة!",
    uploadSuccess: "تم رفع المادة بنجاح! ✅",
    submittedForReview: "تم إرسال المادة للمراجعة! ✅",
    pendingReviewMsg: "سيتم مراجعة المادة ونشرها خلال ٢٤ ساعة.",
    materialUnderReview: "قيد المراجعة",
    deleteSuccess: "تم حذف المادة 🗑️",
    footerText: "مركز الطالب السوداني — صُنع بـ ❤️ للطلاب السودانيين في كل مكان",
    footerAr: "An educational platform for Sudanese students worldwide — BSc · MSc · PhD",
    scholarships: "المنح الدراسية",
    contact: "اتصل بنا",
    bscName: "بكالوريوس",
    mscName: "ماجستير",
    phdName: "دكتوراه",
    otherName: "برامج أخرى",
    bscDesc: "البرامج الجامعية",
    mscDesc: "برامج الدراسات العليا",
    phdDesc: "برامج البحث الدكتوراه",
    otherDesc: "دبلوم، شهادة وأكثر",
    publicUniversities: "جامعات حكومية",
    privateUniversities: "جامعات خاصة",
    otherUniversities: "جامعات أخرى",
    publicLabel: "حكومية",
    privateLabel: "خاصة",
    otherLabel: "أخرى",
    searchUniversities: "ابحث عن جامعة...",
    noUniversitiesFound: "لا توجد جامعات",
    resultsCount: "نتيجة",
    loadingUniversities: "جاري تحميل الجامعات...",
    fetchError: "فشل تحميل الجامعات. يرجى المحاولة مرة أخرى.",
    editMaterial: "تعديل المادة",
    saveChanges: "حفظ التغييرات",
    editSuccess: "تم تحديث المادة بنجاح!",
    confirmDelete: "تأكيد الحذف",
    confirmDeleteMsg: "هل أنت متأكد من حذف",
    cancel: "إلغاء",
    yesDelete: "نعم، احذف",
    myMaterials: "موادي",
    allYourMaterials: "جميع المواد التي رفعتها",
    noMyMaterials: "لم ترفع أي مواد بعد",
    share: "مشاركة",
    copyLink: "نسخ الرابط",
    copied: "تم النسخ!",
    shareVia: "شارك عبر",
    edited: "تم التعديل",
    faculty: "الكلية",
    selectFaculty: "اختر الكلية",
    specialty: "التخصص",
    selectSpecialty: "اختر التخصص",
    selectFacultyFirst: "اختر الكلية أولاً",
    duplicateWarningTitle: "تم العثور على مواد مشابهة",
    duplicateWarningMsg: "المواد التالية بنفس المادة موجودة بالفعل في هذا الموقع:",
    uploadAnyway: "رفع على أي حال",
    duplicateSubject: "المادة",
    duplicateUploadedOn: "تم الرفع في",
    groupBySubject: "مجمعة حسب المادة",
    materialsInSubject: "مواد",
    noSubject: "بدون تصنيف",
    collapseAll: "طي الكل",
    expandAll: "توسيع الكل",
    uploaderRole: "تم الرفع بواسطة",
    selectRole: "...أنا",
    roleBadgeStudent: "طالب",
    roleBadgeTeacher: "أستاذ",
    degreeLevelsTitle: "المراحل الدراسية",
    showAllCountries: "عرض الكل",
    signOut: "تسجيل الخروج",
    profile: "الملف الشخصي",
    loginToUpload: "سجّل الدخول لرفع المواد",
    myAccount: "حسابي",
    statusPending: "قيد المراجعة",
    statusRejected: "مرفوض",
    statusApproved: "مقبول",
    // Bookmarks
    bookmark: "حفظ",
    bookmarked: "محفوظ",
    savedMaterials: "المواد المحفوظة",
    noSavedMaterials: "لا توجد مواد محفوظة بعد",
    saveMaterialSuccess: "تم حفظ المادة!",
    removeMaterialSuccess: "تم إزالة المادة من المحفوظات",
    uploaded: "المرفوعة",
    saved: "المحفوظة",
    // Counters
    views: "مشاهدات",
    downloads: "تحميلات",
    // Reviews
    rate: "تقييم",
    reviewsLabel: "التقييمات",
    writeReview: "اكتب تقييماً",
    yourRating: "تقييمك",
    addComment: "أضف تعليقاً (اختياري)",
    submitReview: "إرسال التقييم",
    reviewSuccess: "تم إرسال التقييم!",
    noReviews: "لا توجد تقييمات بعد",
    beFirstReviewer: "كن أول من يقيّم هذه المادة!",
    stars: "نجوم",
    averageRating: "متوسط",
    // Preview
    preview: "معاينة",
    closePreview: "إغلاق المعاينة",
    cannotPreview: "المعاينة غير متوفرة لهذا النوع من الملفات",
    // Notifications
    notifications: "الإشعارات",
    noNotifications: "لا توجد إشعارات",
    markAllRead: "تحديد الكل كمقروء",
    clearAll: "مسح الكل",
    deleteNotification: "حذف",
    // Requests
    requestMaterial: "طلب مادة",
    requests: "الطلبات",
    requestTitle: "ماذا تحتاج؟",
    requestDesc: "صف ما تبحث عنه",
    submitRequest: "إرسال الطلب",
    requestSuccess: "تم إرسال الطلب!",
    openRequests: "الطلبات المفتوحة",
    fulfillRequest: "تلبية",
    closeRequest: "إغلاق",
    requestFulfilled: "تم تلبية الطلب!",
    noRequests: "لا توجد طلبات بعد",
    // Points
    points: "نقاط",
    leaderboard: "لوحة المتصدرين",
    yourPoints: "نقاطك",
    rank: "الترتيب",
    topContributors: "أبرز المساهمين",
    pointsEarned: "نقاط مكتسبة",
    // Search
    sortBy: "ترتيب حسب",
    newest: "الأحدث",
    mostDownloaded: "الأكثر تحميلاً",
    highestRated: "الأعلى تقييماً",
    filterByRating: "أقل تقييم",
    filterByFaculty: "الكلية",
    filterByRole: "دور الرافع",
    clearFilters: "مسح الفلاتر",
    advancedFilters: "فلاتر متقدمة",
    // Recent Filter Bar
    filterByCountry: "الدولة",
    filterByUniversity: "الجامعة",
    filterByType: "نوع الملف",
    filterBySemester: "الفصل الدراسي",
    filterByUploader: "الرافع",
    allCountries: "كل الدول",
    allUniversities: "كل الجامعات",
    allTypes: "كل الأنواع",
    allSemesters: "كل الفصول",
    allUploaders: "كل الرافعين",
    filterByFaculty: "الكلية",
    filterByDegree: "المرحلة",
    allFaculties: "كل الكليات",
    allDegrees: "كل المراحل",
    filterBySpecialty: "التخصص",
    allSpecialties: "كل التخصصات",
    selectFacultyForSpecialty: "اختر الكلية أولاً",
    clearAllFilters: "مسح الكل",
    noFilterResults: "لا توجد مواد تطابق الفلاتر",
    tryDifferentFilters: "حاول تعديل أو مسح الفلاتر",
    searchCountry: "ابحث عن دولة...",
    filteredResults: "نتائج مفلترة",
    activeFilters: "فلاتر نشطة",
    // Groups
    studyGroups: "مجموعات الدراسة",
    createGroup: "إنشاء مجموعة",
    groupName: "اسم المجموعة",
    groupDesc: "الوصف",
    chatPlatform: "المنصة",
    chatLink: "رابط المحادثة",
    joinGroup: "انضمام",
    createGroupSuccess: "تم إنشاء المجموعة!",
    noGroups: "لا توجد مجموعات دراسية بعد",
    members: "أعضاء",
    // Collections
    collections: "المجموعات",
    createCollection: "إنشاء مجموعة",
    collectionName: "اسم المجموعة",
    addToCollection: "إضافة إلى مجموعة",
    removeFromCollection: "إزالة",
    publicCollection: "عامة",
    privateCollection: "خاصة",
    noCollections: "لا توجد مجموعات بعد",
    createCollectionSuccess: "تم إنشاء المجموعة!",
    editCollection: "تعديل المجموعة",
    editCollectionSuccess: "تم تحديث المجموعة!",
    deleteCollection: "حذف المجموعة",
    deleteCollectionSuccess: "تم حذف المجموعة!",
    deleteCollectionMsg: "هل أنت متأكد من حذف هذه المجموعة؟",
    saveChanges: "حفظ التغييرات",
    viewCollection: "عرض المجموعة",
  },
};

// Degree name/desc translation keys mapped by id
const DEGREE_T_KEYS = {
  bsc: { name: "bscName", desc: "bscDesc" },
  msc: { name: "mscName", desc: "mscDesc" },
  phd: { name: "phdName", desc: "phdDesc" },
  other: { name: "otherName", desc: "otherDesc" },
};

// --- Loading Spinner ---
function LoadingSpinner({ text }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "48px 20px" }}>
      <div style={{
        width: 44, height: 44, border: "4px solid #e8ddd0", borderTopColor: "#C8956C",
        borderRadius: "50%", animation: "studyhub-spin 0.8s linear infinite",
      }} />
      <span style={{ fontSize: 14, color: "#888", fontWeight: 600 }}>{text}</span>
      <style>{`@keyframes studyhub-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// --- Searchable University Select Dropdown ---
function SearchableUniversitySelect({ universities, onSelect, isRTL, t }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // click-outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // focus input on open
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const uniDisplay = (u) => isRTL ? (u.nameAr || u.name) : u.name;

  const publicUnis = universities.filter((u) => u.type === "public");
  const privateUnis = universities.filter((u) => u.type === "private");
  const otherUnis = universities.filter((u) => !u.type);

  const filterList = (list) => {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter(
      (u) => u.name.toLowerCase().includes(q) || (u.nameAr || "").includes(query)
    );
  };

  const filteredPublic = filterList(publicUnis);
  const filteredPrivate = filterList(privateUnis);
  const filteredOther = filterList(otherUnis);
  const flatFiltered = [...filteredPublic, ...filteredPrivate, ...filteredOther];
  const totalResults = flatFiltered.length;

  // scroll highlighted into view
  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-uni-item]");
      if (items[highlightIdx]) items[highlightIdx].scrollIntoView({ block: "nearest" });
    }
  }, [highlightIdx]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev < totalResults - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev > 0 ? prev - 1 : totalResults - 1));
    } else if (e.key === "Enter" && highlightIdx >= 0 && flatFiltered[highlightIdx]) {
      e.preventDefault();
      onSelect(flatFiltered[highlightIdx]);
      setOpen(false);
      setQuery("");
    }
  };

  const getBadgeInfo = (type) => {
    if (type === "public") return { label: t.publicLabel, bg: "#27ae6018", color: "#27ae60" };
    if (type === "private") return { label: t.privateLabel, bg: "#8e44ad18", color: "#8e44ad" };
    return { label: t.otherLabel, bg: "#95a5a618", color: "#95a5a6" };
  };

  const renderGroup = (label, color, list, startIdx) => {
    if (list.length === 0) return null;
    return (
      <div key={label}>
        <div style={DS.groupHeader}>
          <span style={{ ...DS.groupDot, background: color }} />
          <span style={DS.groupLabel}>{label}</span>
          <span style={DS.groupCount}>{list.length}</span>
        </div>
        {list.map((u, i) => {
          const globalIdx = startIdx + i;
          const badge = getBadgeInfo(u.type);
          return (
            <div
              key={u.id}
              data-uni-item="true"
              style={{
                ...DS.option,
                ...(highlightIdx === globalIdx ? DS.optionHighlight : {}),
                ...(isRTL ? { paddingRight: 36, paddingLeft: 12 } : { paddingLeft: 36 }),
              }}
              onClick={() => { onSelect(u); setOpen(false); setQuery(""); }}
              onMouseEnter={() => setHighlightIdx(globalIdx)}
            >
              <span style={DS.optionName}>{uniDisplay(u)}</span>
              <span style={{ ...DS.typeBadge, background: badge.bg, color: badge.color }}>
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div ref={containerRef} style={DS.container}>
      {/* Trigger button */}
      <button
        style={DS.trigger}
        onClick={() => { setOpen(!open); setHighlightIdx(-1); }}
      >
        <span style={DS.triggerIcon}>🏛️</span>
        <span style={DS.triggerText}>{t.selectUniversity}</span>
        <span style={{ ...DS.chevron, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={DS.dropdown}>
          {/* Search input */}
          <div style={DS.searchWrap}>
            <span style={{ ...DS.searchIcon, ...(isRTL ? { marginRight: 0, marginLeft: 8 } : {}) }}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder={t.searchUniversities}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setHighlightIdx(-1); }}
              onKeyDown={handleKeyDown}
              style={{ ...DS.searchInput, textAlign: isRTL ? "right" : "left" }}
            />
            {query && (
              <button onClick={() => { setQuery(""); setHighlightIdx(-1); }} style={DS.clearBtn}>✕</button>
            )}
          </div>

          {/* Scrollable list */}
          <div ref={listRef} style={DS.list}>
            {totalResults === 0 ? (
              <div style={DS.noResults}>
                <span style={{ fontSize: 28 }}>🔍</span>
                <span>{t.noUniversitiesFound}</span>
              </div>
            ) : (
              <>
                {renderGroup(t.publicUniversities, "#27ae60", filteredPublic, 0)}
                {renderGroup(t.privateUniversities, "#8e44ad", filteredPrivate, filteredPublic.length)}
                {renderGroup(t.otherUniversities, "#95a5a6", filteredOther, filteredPublic.length + filteredPrivate.length)}
              </>
            )}
          </div>

          {/* Footer */}
          <div style={DS.footer}>
            <span style={DS.footerText}>{totalResults} {t.resultsCount}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Dropdown Styles ---
const DS = {
  container: { position: "relative", width: "100%", maxWidth: 560, margin: "0 auto" },
  trigger: {
    width: "100%", display: "flex", alignItems: "center", gap: 10,
    padding: "14px 18px", borderRadius: 14, border: "2px solid #e8ddd0",
    background: "white", cursor: "pointer", fontFamily: "inherit",
    fontSize: 15, color: "#1B3A4B", fontWeight: 600,
    boxShadow: "0 2px 10px rgba(0,0,0,0.04)", transition: "all 0.2s",
  },
  triggerIcon: { fontSize: 22 },
  triggerText: { flex: 1, textAlign: "start" },
  chevron: { fontSize: 18, color: "#888", transition: "transform 0.2s" },
  dropdown: {
    position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
    background: "white", borderRadius: 14, border: "2px solid #e8ddd0",
    boxShadow: "0 12px 40px rgba(0,0,0,0.12)", zIndex: 50,
    overflow: "hidden",
  },
  searchWrap: {
    display: "flex", alignItems: "center", padding: "10px 14px",
    borderBottom: "1px solid #f0e8df",
  },
  searchIcon: { fontSize: 16, marginRight: 8, flexShrink: 0 },
  searchInput: {
    flex: 1, border: "none", outline: "none", fontSize: 14,
    padding: "6px 0", background: "transparent", color: "#1B3A4B",
    fontFamily: "inherit",
  },
  clearBtn: {
    background: "#e8ddd0", border: "none", borderRadius: "50%",
    width: 24, height: 24, cursor: "pointer", fontSize: 11, fontWeight: 700,
    color: "#1B3A4B", display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  list: { maxHeight: 320, overflowY: "auto", padding: "4px 0" },
  groupHeader: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 14px 6px", position: "sticky", top: 0,
    background: "white", zIndex: 1,
  },
  groupDot: { width: 8, height: 8, borderRadius: "50%", flexShrink: 0 },
  groupLabel: { fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "#888" },
  groupCount: { fontSize: 10, color: "#aaa", fontWeight: 600 },
  option: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "10px 14px 10px 36px", cursor: "pointer", transition: "background 0.15s",
    gap: 8,
  },
  optionHighlight: { background: "#f5efe8" },
  optionName: { fontSize: 14, fontWeight: 600, color: "#1B3A4B", flex: 1 },
  typeBadge: {
    fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
    flexShrink: 0, whiteSpace: "nowrap",
  },
  noResults: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 6, padding: "24px 14px", color: "#888", fontSize: 13,
  },
  footer: {
    borderTop: "1px solid #f0e8df", padding: "8px 14px",
    display: "flex", justifyContent: "flex-end",
  },
  footerText: { fontSize: 11, color: "#aaa", fontWeight: 600 },
};

export default function SudaneseStudyHub({ locale = "en" }) {
  const [view, setView] = useState("home");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", type: "pdf", url: "", description: "", subject: "", facultyId: "", specialtyId: "", uploaderRole: "student" });
  const [notification, setNotification] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sharePopup, setSharePopup] = useState(null);
  const [myMaterialsExpanded, setMyMaterialsExpanded] = useState({});
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [subjectGroupsExpanded, setSubjectGroupsExpanded] = useState({});
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [myMaterials, setMyMaterials] = useState([]);
  const [loadingMyMaterials, setLoadingMyMaterials] = useState(false);
  const [allMaterials, setAllMaterials] = useState([]);
  const [allMaterialsTotal, setAllMaterialsTotal] = useState(0);
  const [browseMatList, setBrowseMatList] = useState([]);
  const [browseMatTotal, setBrowseMatTotal] = useState(0);
  const [browseMatSearch, setBrowseMatSearch] = useState("");
  const [browseMatType, setBrowseMatType] = useState("all");
  const [browseMatLoading, setBrowseMatLoading] = useState(false);
  const [materialCountData, setMaterialCountData] = useState([]);
  const userMenuRef = useRef(null);

  // === NEW FEATURE STATE ===
  // Bookmarks
  const [savedMaterialIds, setSavedMaterialIds] = useState(new Set());
  const [savedMaterialsList, setSavedMaterialsList] = useState([]);
  const [myMaterialsTab, setMyMaterialsTab] = useState("uploaded");
  // Reviews
  const [showReviewModal, setShowReviewModal] = useState(null); // materialId or null
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: "" });
  const [materialReviews, setMaterialReviews] = useState({});
  // Preview
  const [previewMaterial, setPreviewMaterial] = useState(null);
  // Notifications
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);
  // Requests
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ title: "", description: "", subject: "" });
  const [requestsList, setRequestsList] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  // Leaderboard
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userBadge, setUserBadge] = useState(null);
  // Search
  const [sortOrder, setSortOrder] = useState("newest");
  const [advancedFilters, setAdvancedFilters] = useState({ minRating: "", facultyId: "", uploaderRole: "" });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  // Navbar Search Dropdown
  const [navSearchOpen, setNavSearchOpen] = useState(false);
  const [navSearchResults, setNavSearchResults] = useState([]);
  const [navSearchLoading, setNavSearchLoading] = useState(false);
  const [navSearchIdx, setNavSearchIdx] = useState(-1);
  const navSearchRef = useRef(null);
  const navSearchTimerRef = useRef(null);
  // Groups
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: "", description: "", platform: "whatsapp", chatLink: "" });
  const [groupsList, setGroupsList] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  // Collections
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [collectionForm, setCollectionForm] = useState({ name: "", description: "", isPublic: false });
  const [myCollections, setMyCollections] = useState([]);
  const [showAddToCollectionPopup, setShowAddToCollectionPopup] = useState(null); // materialId or null
  const [selectedCollectionView, setSelectedCollectionView] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null); // collection object when editing
  const [deleteCollectionConfirm, setDeleteCollectionConfirm] = useState(null); // { id, name }
  // Recent Materials Filter Bar
  const [recentFilters, setRecentFilters] = useState({ countryId: "", universityId: "", uploaderRole: "", type: "", semester: "", facultyId: "", specialtyId: "", degreeId: "" });
  const [recentFilteredMaterials, setRecentFilteredMaterials] = useState([]);
  const [recentFilteredTotal, setRecentFilteredTotal] = useState(0);
  const [recentFilterLoading, setRecentFilterLoading] = useState(false);
  const [recentFilterOpen, setRecentFilterOpen] = useState(null);
  const [recentFilterUniversities, setRecentFilterUniversities] = useState([]);
  const [recentCountrySearch, setRecentCountrySearch] = useState("");
  const recentFilterRef = useRef(null);

  // Auth session
  const { data: session, status: authStatus } = useSession();
  const isLoggedIn = authStatus === "authenticated" && !!session?.user;
  const currentUserId = session?.user?.id;

  // University API state
  const [universityCache, setUniversityCache] = useState({});
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [universityError, setUniversityError] = useState(null);

  // Sync with main app's theme system (next-themes)
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";
  const toggleDarkMode = () => setTheme(darkMode ? "light" : "dark");

  // i18n helpers
  const t = T[locale] || T.en;
  const isRTL = locale === "ar";
  const countryName = (c) => isRTL ? (c.nameAr || c.name) : c.name;
  const uniName = (u) => isRTL ? (u.nameAr || u.name) : u.name;
  const semLabel = (sem) => isRTL ? (SEMESTER_LABELS_AR[sem] || sem) : sem;
  const degreeName = (deg) => t[DEGREE_T_KEYS[deg.id]?.name] || deg.name;
  const degreeDesc = (deg) => t[DEGREE_T_KEYS[deg.id]?.desc] || deg.desc;
  const facultyName = (fac) => isRTL ? (fac.nameAr || fac.name) : fac.name;
  const specialtyName = (spec) => isRTL ? (spec.nameAr || spec.name) : spec.name;
  const fileTypeLabel = (ft) => isRTL ? (FILE_TYPE_LABELS_AR[ft.id] || ft.label) : ft.label;
  const roleLabel = (role) => isRTL ? (ROLE_LABELS_AR[role.id] || role.label) : role.label;
  const matCount = (n) => n === 1 ? t.material : t.materialPlural;

  // Fetch universities from API
  const fetchUniversities = useCallback(async (countryCode) => {
    if (universityCache[countryCode]) return;
    setLoadingUniversities(true);
    setUniversityError(null);
    try {
      const res = await fetch(`/api/study-hub/universities?country=${countryCode}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setUniversityCache((prev) => ({ ...prev, [countryCode]: data.universities }));
    } catch (err) {
      console.error("Failed to fetch universities:", err);
      setUniversityError(t.fetchError);
    } finally {
      setLoadingUniversities(false);
    }
  }, [universityCache, t.fetchError]);

  // Fetch approved materials from API when navigating to a semester
  const fetchMaterials = useCallback(async () => {
    if (!selectedCountry || !selectedUniversity || !selectedDegree || !selectedSemester) return;
    try {
      const params = new URLSearchParams({
        countryId: selectedCountry.id,
        universityId: selectedUniversity.id,
        degreeId: selectedDegree.id,
        semester: selectedSemester,
      });
      if (selectedFaculty && selectedFaculty.id !== "all") {
        params.set("facultyId", selectedFaculty.id);
      }
      const res = await fetch(`/api/study-hub/materials?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMaterials(data.materials || []);
      }
    } catch (err) {
      console.error("Failed to fetch materials:", err);
      setMaterials([]);
    }
  }, [selectedCountry, selectedUniversity, selectedDegree, selectedSemester, selectedFaculty]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // Fetch recent materials + total count for home page
  const fetchAllMaterials = useCallback(async () => {
    try {
      const [recentRes, countRes] = await Promise.all([
        fetch("/api/study-hub/materials?limit=8"),
        fetch("/api/study-hub/materials?fieldsOnly=true"),
      ]);
      if (recentRes.ok) {
        const data = await recentRes.json();
        setAllMaterials(data.materials || []);
        setAllMaterialsTotal(data.total || 0);
      }
      if (countRes.ok) {
        const data = await countRes.json();
        setMaterialCountData(data.materials || []);
      }
    } catch (err) {
      console.error("Failed to fetch all materials:", err);
    }
  }, []);

  // Fetch filtered recent materials
  const fetchRecentFiltered = useCallback(async (filters) => {
    const hasFilter = Object.values(filters).some(v => v !== "");
    if (!hasFilter) {
      setRecentFilteredMaterials([]);
      setRecentFilteredTotal(0);
      setRecentFilterLoading(false);
      return;
    }
    setRecentFilterLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "12");
      if (filters.countryId) params.set("countryId", filters.countryId);
      if (filters.universityId) params.set("universityId", filters.universityId);
      if (filters.uploaderRole) params.set("uploaderRole", filters.uploaderRole);
      if (filters.type) params.set("type", filters.type);
      if (filters.semester) params.set("semester", filters.semester);
      if (filters.facultyId) params.set("facultyId", filters.facultyId);
      if (filters.specialtyId) params.set("specialtyId", filters.specialtyId);
      if (filters.degreeId) params.set("degreeId", filters.degreeId);
      const res = await fetch(`/api/study-hub/materials?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRecentFilteredMaterials(data.materials || []);
        setRecentFilteredTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch filtered materials:", err);
    } finally {
      setRecentFilterLoading(false);
    }
  }, []);

  const updateRecentFilter = useCallback(async (key, value) => {
    const next = { ...recentFilters, [key]: value };
    if (key === "facultyId") {
      next.specialtyId = "";
    }
    if (key === "countryId") {
      next.universityId = "";
      next.semester = "";
      if (value) {
        try {
          const res = await fetch(`/api/study-hub/universities?country=${value}`);
          if (res.ok) {
            const data = await res.json();
            setRecentFilterUniversities(data.universities || []);
          }
        } catch { setRecentFilterUniversities([]); }
      } else {
        setRecentFilterUniversities([]);
      }
    }
    setRecentFilters(next);
    setRecentFilterOpen(null);
    setRecentCountrySearch("");
    fetchRecentFiltered(next);
  }, [recentFilters, fetchRecentFiltered]);

  const clearAllRecentFilters = useCallback(() => {
    setRecentFilters({ countryId: "", universityId: "", uploaderRole: "", type: "", semester: "", facultyId: "", specialtyId: "", degreeId: "" });
    setRecentFilteredMaterials([]);
    setRecentFilteredTotal(0);
    setRecentFilterOpen(null);
    setRecentCountrySearch("");
    setRecentFilterUniversities([]);
  }, []);

  useEffect(() => {
    fetchAllMaterials();
    // Also fetch requests for home page teaser
    fetch("/api/study-hub/requests?status=OPEN").then(r => r.ok ? r.json() : { requests: [] }).then(d => setRequestsList(d.requests || [])).catch(() => {});
  }, [fetchAllMaterials]);

  // Close recent filter dropdown on outside click
  useEffect(() => {
    if (!recentFilterOpen) return;
    const handler = (e) => {
      if (recentFilterRef.current && !recentFilterRef.current.contains(e.target)) {
        setRecentFilterOpen(null);
        setRecentCountrySearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [recentFilterOpen]);

  // Fetch materials for the "browse-all" view with search/filter/pagination
  const fetchBrowseMaterials = useCallback(async (searchOverride, typeOverride, existingList) => {
    setBrowseMatLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "12");
      const s = searchOverride !== undefined ? searchOverride : browseMatSearch;
      const tp = typeOverride !== undefined ? typeOverride : browseMatType;
      const list = existingList || [];
      if (list.length > 0) params.set("offset", String(list.length));
      if (s) params.set("search", s);
      if (tp !== "all") params.set("type", tp);
      if (sortOrder) params.set("orderBy", sortOrder);
      if (advancedFilters.minRating) params.set("minRating", advancedFilters.minRating);
      if (advancedFilters.facultyId) params.set("facultyId", advancedFilters.facultyId);
      if (advancedFilters.uploaderRole) params.set("uploaderRole", advancedFilters.uploaderRole);
      const res = await fetch(`/api/study-hub/materials?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBrowseMatList(list.length > 0 ? [...list, ...(data.materials || [])] : (data.materials || []));
        setBrowseMatTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch browse materials:", err);
    } finally {
      setBrowseMatLoading(false);
    }
  }, [browseMatSearch, browseMatType]);

  // Scroll listener for header transformation
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    if (!isUserDropdownOpen) return;
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setIsUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isUserDropdownOpen]);

  // Close share popup on outside click
  useEffect(() => {
    if (!sharePopup) return;
    const handler = (e) => {
      if (!e.target.closest("[data-share-popup]")) setSharePopup(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sharePopup]);

  // Close navbar search dropdown on outside click
  useEffect(() => {
    if (!navSearchOpen) return;
    const handler = (e) => {
      if (navSearchRef.current && !navSearchRef.current.contains(e.target)) {
        setNavSearchOpen(false);
        setNavSearchIdx(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [navSearchOpen]);

  // Navbar search — instant client-side + debounced API for materials
  useEffect(() => {
    if (navSearchTimerRef.current) clearTimeout(navSearchTimerRef.current);
    const q = searchQuery.trim();
    if (!q) {
      setNavSearchResults([]);
      setNavSearchLoading(false);
      return;
    }
    setNavSearchIdx(-1);

    // INSTANT: country + faculty matches (client-side, zero delay)
    const instantResults = [];
    const ql = q.toLowerCase();
    ALL_COUNTRIES.filter(
      (c) => c.name.toLowerCase().includes(ql) || (c.nameAr || "").includes(q) || c.id.toLowerCase().includes(ql)
    ).slice(0, 4).forEach((c) => instantResults.push({ type: "country", data: c }));
    FACULTIES.filter(
      (f) => f.name.toLowerCase().includes(ql) || (f.nameAr || "").toLowerCase().includes(ql)
    ).slice(0, 3).forEach((f) => instantResults.push({ type: "faculty", data: f }));

    // Show instant results right away, mark loading only for materials
    setNavSearchResults(instantResults);
    setNavSearchLoading(true);

    // DEBOUNCED: material matches from API (150ms — fast but avoids spam)
    navSearchTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/study-hub/materials?search=${encodeURIComponent(q)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          const matResults = (data.materials || []).map((m) => ({ type: "material", data: m }));
          // Merge: keep current instant results + append materials
          setNavSearchResults((prev) => {
            const nonMat = prev.filter((r) => r.type !== "material");
            return [...nonMat, ...matResults];
          });
        }
      } catch (err) { /* ignore */ }
      setNavSearchLoading(false);
    }, 150);
    return () => { if (navSearchTimerRef.current) clearTimeout(navSearchTimerRef.current); };
  }, [searchQuery]);

  // Handle navbar search result selection
  const handleNavSearchSelect = (item) => {
    setNavSearchOpen(false);
    setNavSearchIdx(-1);
    if (item.type === "country") {
      setSearchQuery("");
      navigate("universities", item.data);
    } else if (item.type === "faculty") {
      setSearchQuery("");
      // Navigate to browse-all with faculty filter
      navigate("browse-all");
      setTimeout(() => {
        setAdvancedFilters((prev) => ({ ...prev, facultyId: item.data.id }));
        setShowAdvancedFilters(true);
        setBrowseMatList([]);
        fetchBrowseMaterials("", "all");
      }, 100);
    } else if (item.type === "material") {
      setSearchQuery("");
      // Navigate to browse-all and search for this material title
      navigate("browse-all");
      setTimeout(() => {
        setBrowseMatSearch(item.data.title || "");
        setBrowseMatList([]);
        fetchBrowseMaterials(item.data.title || "", "all");
      }, 100);
    }
  };

  // Handle keyboard navigation in search dropdown
  const handleNavSearchKeyDown = (e) => {
    if (!navSearchOpen || navSearchResults.length === 0) {
      if (e.key === "Enter" && searchQuery.trim()) {
        setNavSearchOpen(false);
        navigate("browse-all");
        setTimeout(() => {
          setBrowseMatSearch(searchQuery);
          setBrowseMatList([]);
          fetchBrowseMaterials(searchQuery, "all");
          setSearchQuery("");
        }, 100);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setNavSearchIdx((prev) => (prev < navSearchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setNavSearchIdx((prev) => (prev > 0 ? prev - 1 : navSearchResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (navSearchIdx >= 0 && navSearchIdx < navSearchResults.length) {
        handleNavSearchSelect(navSearchResults[navSearchIdx]);
      } else if (searchQuery.trim()) {
        setNavSearchOpen(false);
        navigate("browse-all");
        setTimeout(() => {
          setBrowseMatSearch(searchQuery);
          setBrowseMatList([]);
          fetchBrowseMaterials(searchQuery, "all");
          setSearchQuery("");
        }, 100);
      }
    } else if (e.key === "Escape") {
      setNavSearchOpen(false);
      setNavSearchIdx(-1);
    }
  };

  // Fetch user's own materials
  const fetchMyMaterials = useCallback(async () => {
    if (!currentUserId) return;
    setLoadingMyMaterials(true);
    try {
      const res = await fetch(`/api/study-hub/materials?userId=${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        setMyMaterials(data.materials || []);
      }
    } catch (err) {
      console.error("Failed to fetch my materials:", err);
      setMyMaterials([]);
    } finally {
      setLoadingMyMaterials(false);
    }
  }, [currentUserId]);

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4500);
  };

  const requireLogin = () => {
    if (!isLoggedIn) {
      window.location.href = `/${locale}/login?callbackUrl=/${locale}/study-hub`;
      return true; // blocked
    }
    return false; // allowed
  };

  const submitMaterialToAPI = async (materialData) => {
    try {
      const res = await fetch("/api/study-hub/materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materialData),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to submit");
      }
      return await res.json();
    } catch (err) {
      console.error("Submit error:", err);
      throw err;
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.title || !uploadForm.url || !uploadForm.subject) {
      showNotif(t.fillRequired, "error");
      return;
    }
    if (editingMaterial) {
      // PATCH existing material via owner endpoint
      try {
        const res = await fetch(`/api/study-hub/materials/${editingMaterial.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(uploadForm),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to update");
        }
        setEditingMaterial(null);
        setUploadForm({ title: "", type: "pdf", url: "", description: "", subject: "", facultyId: "", specialtyId: "", uploaderRole: "student" });
        setShowUploadModal(false);
        showNotif(`${t.submittedForReview}\n${t.pendingReviewMsg}`);
        // Refresh materials
        fetchMaterials();
        fetchAllMaterials();
        if (currentUserId) fetchMyMaterials();
      } catch {
        showNotif(t.fillRequired, "error");
      }
    } else {
      const materialData = {
        ...uploadForm,
        countryId: selectedCountry.id,
        countryName: selectedCountry.name,
        universityId: selectedUniversity.id,
        universityName: selectedUniversity.name,
        degreeId: selectedDegree.id,
        degreeName: selectedDegree.name,
        semester: selectedSemester,
      };
      const duplicates = checkForDuplicates(materialData);
      if (duplicates.length > 0) {
        setDuplicateWarning({ duplicates, pendingMaterial: materialData });
        return;
      }
      try {
        await submitMaterialToAPI(materialData);
        setUploadForm({ title: "", type: "pdf", url: "", description: "", subject: "", facultyId: "", specialtyId: "", uploaderRole: "student" });
        setShowUploadModal(false);
        showNotif(`${t.submittedForReview}\n${t.pendingReviewMsg}`);
        fetchAllMaterials();
        if (currentUserId) fetchMyMaterials();
      } catch {
        showNotif(t.fillRequired, "error");
      }
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setUploadForm({
      title: material.title,
      type: material.type,
      url: material.url,
      description: material.description || "",
      subject: material.subject || "",
      facultyId: material.facultyId || "",
      specialtyId: material.specialtyId || "",
      uploaderRole: material.uploaderRole || "student",
    });
    setShowUploadModal(true);
  };

  const handleFacultyChange = (facultyId) => {
    setUploadForm((prev) => ({ ...prev, facultyId, specialtyId: "" }));
  };

  const handleDeleteRequest = (material) => {
    setDeleteConfirm({ id: material.id, title: material.title });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    try {
      const res = await fetch(`/api/study-hub/materials/${deleteConfirm.id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete");
      }
      setMaterials(materials.filter((m) => m.id !== deleteConfirm.id));
      setMyMaterials(myMaterials.filter((m) => m.id !== deleteConfirm.id));
      setAllMaterials(allMaterials.filter((m) => m.id !== deleteConfirm.id));
      setAllMaterialsTotal((prev) => Math.max(0, prev - 1));
      setBrowseMatList((prev) => prev.filter((m) => m.id !== deleteConfirm.id));
      setBrowseMatTotal((prev) => Math.max(0, prev - 1));
      setDeleteConfirm(null);
      showNotif(t.deleteSuccess);
    } catch (err) {
      console.error("Delete error:", err);
      setDeleteConfirm(null);
      showNotif(err.message || "Failed to delete", "error");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const checkForDuplicates = (newMaterial) => {
    return materials.filter((m) =>
      m.countryId === newMaterial.countryId &&
      m.universityId === newMaterial.universityId &&
      m.degreeId === newMaterial.degreeId &&
      m.semester === newMaterial.semester &&
      m.subject.trim().toLowerCase() === newMaterial.subject.trim().toLowerCase() &&
      (!editingMaterial || m.id !== editingMaterial.id)
    );
  };

  const handleDuplicateConfirm = async () => {
    if (!duplicateWarning) return;
    try {
      await submitMaterialToAPI(duplicateWarning.pendingMaterial);
      setDuplicateWarning(null);
      setUploadForm({ title: "", type: "pdf", url: "", description: "", subject: "", facultyId: "", specialtyId: "", uploaderRole: "student" });
      setShowUploadModal(false);
      showNotif(`${t.submittedForReview}\n${t.pendingReviewMsg}`);
    } catch {
      showNotif(t.fillRequired, "error");
    }
  };

  const handleDuplicateCancel = () => {
    setDuplicateWarning(null);
  };

  // === NEW FEATURE HANDLERS ===

  // Bookmarks
  const fetchSavedMaterialIds = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch("/api/study-hub/materials/save/list");
      if (res.ok) {
        const data = await res.json();
        setSavedMaterialIds(new Set(data.materialIds || []));
        setSavedMaterialsList(data.materials || []);
      }
    } catch (err) { console.error("Failed to fetch saved materials:", err); }
  }, [isLoggedIn]);

  useEffect(() => { fetchSavedMaterialIds(); }, [fetchSavedMaterialIds]);

  const handleToggleBookmark = async (materialId) => {
    if (requireLogin()) return;
    try {
      const res = await fetch("/api/study-hub/materials/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedMaterialIds((prev) => {
          const next = new Set(prev);
          if (data.saved) next.add(materialId); else next.delete(materialId);
          return next;
        });
        showNotif(data.saved ? t.saveMaterialSuccess : t.removeMaterialSuccess);
        fetchSavedMaterialIds();
      }
    } catch (err) { console.error("Bookmark error:", err); }
  };

  // Track view/download
  const handleTrackAction = async (materialId, action) => {
    try {
      await fetch(`/api/study-hub/materials/${materialId}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
    } catch (err) { console.error("Track error:", err); }
  };

  // Reviews
  const fetchReviews = async (materialId) => {
    try {
      const res = await fetch(`/api/study-hub/materials/${materialId}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setMaterialReviews((prev) => ({ ...prev, [materialId]: data }));
      }
    } catch (err) { console.error("Failed to fetch reviews:", err); }
  };

  const handleSubmitReview = async () => {
    if (!showReviewModal || reviewForm.rating === 0) return;
    try {
      const res = await fetch(`/api/study-hub/materials/${showReviewModal}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      if (res.ok) {
        showNotif(t.reviewSuccess);
        fetchReviews(showReviewModal);
        setShowReviewModal(null);
        setReviewForm({ rating: 0, comment: "" });
      }
    } catch (err) { console.error("Review error:", err); }
  };

  // Notifications
  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch("/api/user/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotificationsList(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) { console.error("Failed to fetch notifications:", err); }
  }, [isLoggedIn]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);
  useEffect(() => {
    if (!isLoggedIn) return;
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn, fetchNotifications]);

  // Close notification dropdown on outside click
  useEffect(() => {
    if (!showNotifications) return;
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      setUnreadCount(0);
      setNotificationsList((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) { console.error("Mark read error:", err); }
  };

  const handleClearAllNotifications = async () => {
    try {
      await fetch("/api/user/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteAll: true }),
      });
      setNotificationsList([]);
      setUnreadCount(0);
    } catch (err) { console.error("Clear all error:", err); }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await fetch("/api/user/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      setNotificationsList((prev) => {
        const removed = prev.find((n) => n.id === id);
        if (removed && !removed.read) setUnreadCount((c) => Math.max(0, c - 1));
        return prev.filter((n) => n.id !== id);
      });
    } catch (err) { console.error("Delete notification error:", err); }
  };

  // Requests
  const fetchRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const res = await fetch("/api/study-hub/requests?status=OPEN");
      if (res.ok) {
        const data = await res.json();
        setRequestsList(data.requests || []);
      }
    } catch (err) { console.error("Failed to fetch requests:", err); }
    finally { setRequestsLoading(false); }
  }, []);

  const handleSubmitRequest = async () => {
    if (!requestForm.title) { showNotif(t.fillRequired, "error"); return; }
    try {
      const res = await fetch("/api/study-hub/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestForm),
      });
      if (res.ok) {
        showNotif(t.requestSuccess);
        setShowRequestModal(false);
        setRequestForm({ title: "", description: "", subject: "" });
        fetchRequests();
      }
    } catch (err) { console.error("Request error:", err); }
  };

  // Leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch("/api/study-hub/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setLeaderboardData(data.users || []);
        if (isLoggedIn && currentUserId) {
          const me = data.users.find((u) => u.id === currentUserId);
          if (me) { setUserPoints(me.points); setUserBadge(me.badge); }
        }
      }
    } catch (err) { console.error("Failed to fetch leaderboard:", err); }
  }, [isLoggedIn, currentUserId]);

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  // Groups
  const fetchGroups = useCallback(async () => {
    setGroupsLoading(true);
    try {
      const res = await fetch("/api/study-hub/groups");
      if (res.ok) {
        const data = await res.json();
        setGroupsList(data.groups || []);
      }
    } catch (err) { console.error("Failed to fetch groups:", err); }
    finally { setGroupsLoading(false); }
  }, []);

  const handleSubmitGroup = async () => {
    if (!groupForm.name || !groupForm.chatLink) { showNotif(t.fillRequired, "error"); return; }
    try {
      const res = await fetch("/api/study-hub/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupForm),
      });
      if (res.ok) {
        showNotif(t.createGroupSuccess);
        setShowGroupModal(false);
        setGroupForm({ name: "", description: "", platform: "whatsapp", chatLink: "" });
        fetchGroups();
      }
    } catch (err) { console.error("Group error:", err); }
  };

  // Collections
  const fetchCollections = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const res = await fetch("/api/study-hub/collections");
      if (res.ok) {
        const data = await res.json();
        setMyCollections(data.collections || []);
      }
    } catch (err) { console.error("Failed to fetch collections:", err); }
  }, [isLoggedIn]);

  useEffect(() => { fetchCollections(); }, [fetchCollections]);

  const handleCreateCollection = async () => {
    if (!collectionForm.name) { showNotif(t.fillRequired, "error"); return; }
    try {
      const res = await fetch("/api/study-hub/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collectionForm),
      });
      if (res.ok) {
        showNotif(t.createCollectionSuccess);
        setShowCollectionModal(false);
        setCollectionForm({ name: "", description: "", isPublic: false });
        fetchCollections();
      }
    } catch (err) { console.error("Collection error:", err); }
  };

  const handleAddToCollection = async (collectionId, materialId) => {
    try {
      const res = await fetch(`/api/study-hub/collections/${collectionId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialId }),
      });
      if (res.ok) {
        showNotif(t.saveMaterialSuccess);
        setShowAddToCollectionPopup(null);
      }
    } catch (err) { console.error("Add to collection error:", err); }
  };

  const handleEditCollection = (col) => {
    setEditingCollection(col);
    setCollectionForm({ name: col.name, description: col.description || "", isPublic: col.isPublic });
    setShowCollectionModal(true);
  };

  const handleUpdateCollection = async () => {
    if (!collectionForm.name) { showNotif(t.fillRequired, "error"); return; }
    try {
      const res = await fetch(`/api/study-hub/collections/${editingCollection.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collectionForm),
      });
      if (res.ok) {
        showNotif(t.editCollectionSuccess);
        setShowCollectionModal(false);
        setEditingCollection(null);
        setCollectionForm({ name: "", description: "", isPublic: false });
        fetchCollections();
      }
    } catch (err) { console.error("Update collection error:", err); }
  };

  const handleDeleteCollection = async () => {
    if (!deleteCollectionConfirm) return;
    try {
      const res = await fetch(`/api/study-hub/collections/${deleteCollectionConfirm.id}`, { method: "DELETE" });
      if (res.ok) {
        showNotif(t.deleteCollectionSuccess);
        setMyCollections(myCollections.filter((c) => c.id !== deleteCollectionConfirm.id));
        if (selectedCollectionView?.collection?.id === deleteCollectionConfirm.id) {
          setSelectedCollectionView(null);
        }
      }
    } catch (err) { console.error("Delete collection error:", err); }
    setDeleteCollectionConfirm(null);
  };

  // Preview helpers
  const getPreviewUrl = (url) => {
    if (!url) return null;
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (ytMatch) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}` };
    // Google Drive
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (driveMatch) return { type: "drive", embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview` };
    return null;
  };

  const handleShareToggle = (matId) => {
    setSharePopup(sharePopup === matId ? null : matId);
  };

  const handleCopyLink = (material) => {
    const text = `${material.title} — ${material.url}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showNotif(t.copied));
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showNotif(t.copied);
    }
    setSharePopup(null);
  };

  const currentMaterials = materials.filter(
    (m) =>
      m.countryId === (selectedCountry && selectedCountry.id) &&
      m.universityId === (selectedUniversity && selectedUniversity.id) &&
      m.degreeId === (selectedDegree && selectedDegree.id) &&
      m.semester === selectedSemester &&
      (!selectedFaculty || selectedFaculty.id === "all" || m.facultyId === selectedFaculty.id) &&
      (filterType === "all" || m.type === filterType)
  );

  const groupedBySubject = (() => {
    const groups = {};
    currentMaterials.forEach((mat) => {
      const key = (mat.subject || "").trim() || t.noSubject;
      if (!groups[key]) groups[key] = [];
      groups[key].push(mat);
    });
    // Sort materials within each group by uploadedAt newest first
    Object.values(groups).forEach((arr) => arr.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)));
    // Sort groups alphabetically, "Uncategorized" / noSubject last
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (a === t.noSubject) return 1;
      if (b === t.noSubject) return -1;
      return a.localeCompare(b);
    });
    return sortedKeys.map((key) => ({ subject: key, materials: groups[key] }));
  })();

  const toggleSubjectGroup = (subjectName) => {
    setSubjectGroupsExpanded((prev) => ({ ...prev, [subjectName]: prev[subjectName] === false ? true : false }));
  };

  const toggleAllSubjectGroups = (expand) => {
    const next = {};
    groupedBySubject.forEach((g) => { next[g.subject] = expand; });
    setSubjectGroupsExpanded(next);
  };

  const filteredCountries = searchQuery
    ? ALL_COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.nameAr || "").includes(searchQuery) ||
          c.id.includes(searchQuery.toLowerCase())
      )
    : ALL_COUNTRIES;

  // Recent filter bar computed values
  const isRecentFiltered = Object.values(recentFilters).some(v => v !== "");
  const recentDisplayMaterials = isRecentFiltered ? recentFilteredMaterials : allMaterials.slice(0, 6);
  const recentDisplayTotal = isRecentFiltered ? recentFilteredTotal : allMaterialsTotal;
  const activeRecentFilterCount = Object.values(recentFilters).filter(v => v !== "").length;

  // Deduplicated flat semester list for filter dropdown
  const allSemesterOptions = (() => {
    const set = new Set();
    Object.values(SEMESTERS_MAP).forEach(arr => arr.forEach(s => set.add(s)));
    return [...set];
  })();

  const navigate = (newView, c, u, d, s, f) => {
    setView(newView);
    if (c !== undefined) setSelectedCountry(c);
    if (u !== undefined) setSelectedUniversity(u);
    if (d !== undefined) setSelectedDegree(d);
    if (f !== undefined) setSelectedFaculty(f);
    if (s !== undefined) setSelectedSemester(s);
    // Reset faculty when navigating above faculty level
    if (["home", "countries", "universities", "degrees"].includes(newView)) {
      setSelectedFaculty(null);
    }
    setFilterType("all");
    setSubjectGroupsExpanded({});
    // Fetch universities when navigating to university view
    if (newView === "universities" && c) {
      fetchUniversities(c.id);
    }
    // Fetch user's own materials when navigating to my-materials
    if (newView === "my-materials" && currentUserId) {
      fetchMyMaterials();
    }
    // Fetch browse materials when navigating to browse-all
    if (newView === "browse-all") {
      setBrowseMatList([]);
      setBrowseMatSearch("");
      setBrowseMatType("all");
      setBrowseMatTotal(0);
      setSortOrder("newest");
      setAdvancedFilters({ minRating: "", facultyId: "", uploaderRole: "" });
      setShowAdvancedFilters(false);
      fetchBrowseMaterials("", "all");
    }
    if (newView === "requests") fetchRequests();
    if (newView === "groups") fetchGroups();
    if (newView === "collections") fetchCollections();
  };

  const countMats = (cId, uId, dId, sem, facId) => {
    const source = materialCountData.length > 0 ? materialCountData : (allMaterials.length > 0 ? allMaterials : materials);
    return source.filter(
      (m) =>
        (!cId || m.countryId === cId) &&
        (!uId || m.universityId === uId) &&
        (!dId || m.degreeId === dId) &&
        (!sem || m.semester === sem) &&
        (!facId || m.facultyId === facId)
    ).length;
  };

  const renderMaterialCard = (mat, showLocation = false) => {
    const ti = getTypeInfo(mat.type);
    const ri = getRoleInfo(mat.uploaderRole);
    const matCountry = ALL_COUNTRIES.find((c) => c.id === mat.countryId);
    const deg = DEGREE_LEVELS.find((d) => d.id === mat.degreeId);
    const statusBorderColor = mat.status === "PENDING" ? "#f59e0b" : mat.status === "REJECTED" ? "#ef4444" : "#10b981";
    const borderSide = isRTL ? "borderRight" : "borderLeft";
    return (
      <div
        className="my-mat-card studyhub-mat-card"
        key={mat.id}
        style={{
          ...S.matCard,
          [borderSide]: `4px solid ${statusBorderColor}`,
          ...(isRTL ? { borderLeft: "none" } : { borderRight: "none" }),
        }}
        onMouseEnter={(e) => { e.currentTarget.style[borderSide === "borderLeft" ? "borderLeftColor" : "borderRightColor"] = ti.color; }}
        onMouseLeave={(e) => { e.currentTarget.style[borderSide === "borderLeft" ? "borderLeftColor" : "borderRightColor"] = statusBorderColor; }}
      >
        <div className="studyhub-mat-icon" style={{ ...S.matIcon, background: ti.color + "12", color: ti.color, boxShadow: `0 3px 12px ${ti.color}20` }}>{ti.icon}</div>
        <div className="studyhub-mat-info" style={S.matInfo}>
          <h4 style={S.matTitle}>{mat.title}</h4>
          <p style={S.matSubject}>📖 {mat.subject}</p>
          {mat.facultyId && (() => {
            const fac = FACULTIES.find((f) => f.id === mat.facultyId);
            const spec = mat.specialtyId && (SPECIALTIES_MAP[mat.facultyId] || []).find((s) => s.id === mat.specialtyId);
            return fac ? (
              <p style={S.matFaculty}>{fac.icon} {facultyName(fac)}{spec ? ` › ${specialtyName(spec)}` : ""}</p>
            ) : null;
          })()}
          {showLocation && deg && (
            <p style={S.matDesc}>
              {deg.icon} {isRTL ? (DEGREE_T_KEYS[deg.id] ? T.ar[DEGREE_T_KEYS[deg.id].name] : deg.name) : deg.name} › {semLabel(mat.semester)}
            </p>
          )}
          {mat.description && <p style={S.matDesc}>{mat.description}</p>}
          <div style={S.matMeta}>
            <span style={{ ...S.matBadge, background: ti.color }}>{fileTypeLabel(ti)}</span>
            <span style={{ ...S.matBadge, background: ri.color }}>{ri.icon} {roleLabel(ri)}</span>
            {mat.viewCount > 0 && <span style={S.counterBadge}>👁 {mat.viewCount}</span>}
            {mat.downloadCount > 0 && <span style={S.counterBadge}>📥 {mat.downloadCount}</span>}
            {mat.averageRating > 0 && <span style={S.counterBadge}>⭐ {mat.averageRating} ({mat.reviewCount})</span>}
            <span style={S.matDate}>🕐 {new Date(mat.uploadedAt).toLocaleDateString(isRTL ? "ar" : "en")}</span>
            {mat.editedAt && <span style={S.matDate}>✏️ {t.edited}</span>}
          </div>
        </div>
        <div className="studyhub-mat-actions" style={{ ...S.matActions, position: "relative" }}>
          {mat.status && (
            <span style={{
              display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.3px",
              background: mat.status === "APPROVED" ? "#d1fae5" : mat.status === "PENDING" ? "#fef3c7" : "#fee2e2",
              color: mat.status === "APPROVED" ? "#065f46" : mat.status === "PENDING" ? "#92400e" : "#991b1b",
              marginBottom: 6,
            }}>
              {mat.status === "APPROVED" ? `✅ ${t.statusApproved}` : mat.status === "PENDING" ? `⏳ ${t.statusPending}` : `❌ ${t.statusRejected}`}
            </span>
          )}
          <a href={mat.url} target="_blank" rel="noopener noreferrer" style={S.dlBtn}
            onClick={() => handleTrackAction(mat.id, mat.type === "video" ? "view" : "download")}
          >
            {mat.type === "video" ? `▶ ${t.watch}` : `⬇ ${t.download}`}
          </a>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
            {/* Bookmark */}
            <button
              onClick={() => handleToggleBookmark(mat.id)}
              style={{ ...S.bookmarkBtn, ...(savedMaterialIds.has(mat.id) ? S.bookmarkActive : {}) }}
              title={savedMaterialIds.has(mat.id) ? t.bookmarked : t.bookmark}
            >{savedMaterialIds.has(mat.id) ? "📑" : "🔖"}</button>
            {/* Rate */}
            <button
              onClick={() => { if (!requireLogin()) { setShowReviewModal(mat.id); fetchReviews(mat.id); } }}
              style={S.editBtn} title={t.rate}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f0e8df"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >⭐</button>
            {/* Preview */}
            {getPreviewUrl(mat.url) && (
              <button
                onClick={() => setPreviewMaterial(mat)}
                style={S.editBtn} title={t.preview}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f0e8df"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >👁</button>
            )}
            {/* Add to Collection */}
            {isLoggedIn && (
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => { fetchCollections(); setShowAddToCollectionPopup(showAddToCollectionPopup === mat.id ? null : mat.id); }}
                  style={S.editBtn} title={t.addToCollection}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#f0e8df"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >📂</button>
                {showAddToCollectionPopup === mat.id && (
                  <div style={{ ...S.sharePopup, ...(isRTL ? { left: 0, right: "auto" } : { right: 0, left: "auto" }), minWidth: 200 }}>
                    {myCollections.length === 0 ? (
                      <div style={{ padding: "12px 14px", fontSize: 12, color: "#888" }}>{t.noCollections}</div>
                    ) : myCollections.map((col) => (
                      <button key={col.id} onClick={() => handleAddToCollection(col.id, mat.id)} style={S.shareOption}>
                        📁 {col.name} ({col._count?.items || 0})
                      </button>
                    ))}
                    <button
                      onClick={() => { setShowAddToCollectionPopup(null); setShowCollectionModal(true); }}
                      style={{ ...S.shareOption, borderTop: "1px solid #ede5da", color: "#C8956C", fontWeight: 700 }}
                    >+ {t.createCollection}</button>
                  </div>
                )}
              </div>
            )}
            {isLoggedIn && currentUserId && mat.userId === currentUserId && (
              <button
                onClick={() => handleEdit(mat)} style={S.editBtn} title={t.editMaterial}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f0e8df"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >✏️</button>
            )}
            <div data-share-popup="true" style={{ position: "relative" }}>
              <button
                onClick={() => handleShareToggle(mat.id)} style={S.shareBtn} title={t.share}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f0e8df"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >🔗</button>
              {sharePopup === mat.id && (
                <div style={{ ...S.sharePopup, ...(isRTL ? { left: 0, right: "auto" } : { right: 0, left: "auto" }) }}>
                  <button onClick={() => handleCopyLink(mat)} style={S.shareOption}>📋 {t.copyLink}</button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(mat.title + " — " + mat.url)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={S.shareOption}
                    onClick={() => setSharePopup(null)}
                  >💬 {t.shareVia} WhatsApp</a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(mat.url)}&text=${encodeURIComponent(mat.title)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={S.shareOption}
                    onClick={() => setSharePopup(null)}
                  >📱 {t.shareVia} Telegram</a>
                </div>
              )}
            </div>
            {isLoggedIn && currentUserId && mat.userId === currentUserId && (
              <button
                onClick={() => handleDeleteRequest(mat)} style={S.delBtn} title={t.confirmDelete}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.borderColor = "#fca5a5"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#e0d5c8"; }}
              >🗑️</button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={S.app} dir={isRTL ? "rtl" : "ltr"}>
      <div style={S.bgPattern} />

      {/* Comprehensive responsive styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* === BASE RULES (all viewports) === */
        .studyhub-main {
          padding-left: max(env(safe-area-inset-left, 0px), clamp(12px, 3vw, 24px)) !important;
          padding-right: max(env(safe-area-inset-right, 0px), clamp(12px, 3vw, 24px)) !important;
        }
        .studyhub-breadcrumb {
          padding-left: max(env(safe-area-inset-left, 0px), clamp(12px, 3vw, 24px)) !important;
          padding-right: max(env(safe-area-inset-right, 0px), clamp(12px, 3vw, 24px)) !important;
        }
        .studyhub-footer {
          padding-left: max(env(safe-area-inset-left, 0px), 24px) !important;
          padding-right: max(env(safe-area-inset-right, 0px), 24px) !important;
          padding-bottom: max(env(safe-area-inset-bottom, 0px), 32px) !important;
        }
        @supports (max-height: 1dvh) {
          .studyhub-modal { max-height: 90dvh !important; }
        }

        /* How It Works connector lines (desktop only) */
        @media (min-width: 1024px) {
          .studyhub-how-connector { display: block !important; }
        }
        .studyhub-how-card {
          overflow: visible !important;
        }

        /* Hover animations (preserved) */
        .recent-mat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(0,0,0,0.1) !important;
          border-color: #C8956C !important;
        }
        .my-group-chevron {
          transition: transform 0.3s ease;
          display: inline-block;
        }
        .my-group-chevron.expanded { transform: rotate(90deg); }
        [dir=rtl] .my-group-chevron.expanded { transform: rotate(-90deg); }
        .my-mat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
        }
        .my-group-header:hover { background: #f0ebe4 !important; }

        /* Remove sticky hover on touch devices */
        @media (hover: none) {
          .recent-mat-card:hover,
          .my-mat-card:hover,
          .studyhub-country-card:hover {
            transform: none !important;
            box-shadow: 0 3px 16px rgba(0,0,0,0.05) !important;
          }
        }

        /* === 1199px — LAPTOP === */
        @media (max-width: 1199px) {
          .studyhub-hero {
            padding: clamp(28px, 5vw, 50px) clamp(16px, 3vw, 20px) clamp(24px, 4vw, 40px) !important;
          }
          .studyhub-stats-wrapper {
            padding: 22px 16px !important;
          }
          .studyhub-degree-cards {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
          }
          .studyhub-how-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
          .studyhub-how-connector { display: none !important; }
          .studyhub-hero-nav { gap: 8px !important; }
          .studyhub-section { margin-bottom: 40px !important; }
        }

        /* === 1023px — TABLET === */
        @media (max-width: 1023px) {
          .studyhub-hero {
            padding: clamp(24px, 4vw, 44px) clamp(14px, 2.5vw, 18px) clamp(20px, 3.5vw, 36px) !important;
            border-radius: 18px !important;
          }
          .studyhub-how-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .studyhub-degree-cards {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .studyhub-modal {
            max-width: 480px !important;
          }
          .studyhub-browse-search-bar {
            flex-direction: column !important;
          }
          .studyhub-browse-search-bar > div { min-width: 100% !important; }
          .studyhub-browse-search-bar > button { width: 100% !important; }
          .studyhub-hero-nav { gap: 8px !important; margin-top: 20px !important; }
          .studyhub-hero-stats { margin-top: 24px !important; }
          .studyhub-hero-stats > div { padding-left: clamp(10px, 2vw, 20px) !important; padding-right: clamp(10px, 2vw, 20px) !important; }
          .studyhub-section { margin-bottom: 36px !important; }
          .studyhub-country-search > div { max-width: 100% !important; }
        }

        /* === 767px — LARGE PHONE (major changes) === */
        @media (max-width: 767px) {
          /* Recent filter bar */
          .studyhub-recent-filter-bar {
            gap: 6px !important;
          }
          .studyhub-recent-filter-chip {
            padding: 5px 12px !important;
            font-size: 11px !important;
            min-height: 34px !important;
          }
          /* Hero */
          .studyhub-hero {
            padding: 28px 16px 24px !important;
            border-radius: 16px !important;
            margin-bottom: 28px !important;
          }
          .studyhub-hero-title { font-size: 24px !important; }
          .studyhub-hero-badge { font-size: 11px !important; padding: 6px 16px !important; margin-bottom: 14px !important; }
          .studyhub-hero-sub { font-size: 13px !important; margin-bottom: 8px !important; }
          .studyhub-hero-arabic { font-size: 15px !important; margin-bottom: 20px !important; }
          .studyhub-search-box {
            max-width: 100% !important;
            padding: 4px 6px 4px 14px !important;
          }

          /* Stats */
          .studyhub-stats-row {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
          .studyhub-stat-card {
            padding: 14px 16px !important;
            min-width: 0 !important;
          }
          .studyhub-stats-wrapper { padding: 18px 12px !important; margin-bottom: 28px !important; }

          /* Grids */
          .studyhub-how-grid { grid-template-columns: 1fr !important; }
          .studyhub-degree-grid { gap: 10px !important; }
          .studyhub-country-grid {
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)) !important;
          }
          .studyhub-recent-grid { grid-template-columns: 1fr !important; }
          .studyhub-notif-dropdown { width: calc(100vw - 32px) !important; right: -60px !important; }
          .studyhub-preview-frame { height: 280px !important; }
          .studyhub-advanced-filters { grid-template-columns: 1fr !important; }
          .studyhub-sort-row { flex-direction: column !important; align-items: stretch !important; }

          /* View Header */
          .studyhub-view-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
          .studyhub-upload-btn {
            width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            text-align: center !important;
            justify-content: center !important;
          }

          /* Material cards → vertical stack */
          .studyhub-mat-card {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 16px !important;
            gap: 12px !important;
          }
          .studyhub-mat-icon {
            width: 44px !important;
            height: 44px !important;
            font-size: 22px !important;
          }
          .studyhub-mat-info { min-width: 100% !important; }
          .studyhub-mat-actions {
            flex-direction: row !important;
            width: 100% !important;
            justify-content: flex-start !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
          .studyhub-mat-actions a {
            flex: 1 !important;
            text-align: center !important;
            min-height: 44px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          /* Filter row → horizontal scroll */
          .studyhub-filter-row {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            padding-bottom: 4px !important;
          }
          .studyhub-filter-row::-webkit-scrollbar { display: none; }
          .studyhub-filter-row button {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            min-height: 44px !important;
          }

          /* Modal → bottom-sheet pattern */
          .studyhub-overlay {
            align-items: flex-end !important;
            padding: 0 !important;
          }
          .studyhub-modal {
            max-width: 100% !important;
            border-radius: 20px 20px 0 0 !important;
            max-height: 92dvh !important;
            animation: studyhub-slide-up 0.3s ease-out;
          }
          .studyhub-modal-head {
            padding: 20px 20px 16px !important;
          }
          .studyhub-modal-body {
            padding: 18px 20px 24px !important;
          }
          .studyhub-modal-faculty-grid {
            grid-template-columns: 1fr !important;
          }
          .studyhub-type-selector {
            gap: 8px !important;
          }
          .studyhub-type-selector button {
            min-width: 60px !important;
            padding: 10px 12px !important;
          }

          /* Confirm modal → bottom-sheet too */
          .studyhub-confirm-modal {
            border-radius: 20px 20px 0 0 !important;
            max-width: 100% !important;
            padding: 28px 20px !important;
          }

          /* Breadcrumb */
          .studyhub-breadcrumb {
            font-size: 12px !important;
            gap: 6px !important;
            padding-top: 8px !important;
            padding-bottom: 8px !important;
          }
          .studyhub-breadcrumb span {
            font-size: 12px !important;
          }

          /* My Materials banner */
          .my-mat-banner {
            padding: 20px 18px !important;
            border-radius: 16px !important;
          }
          .my-mat-banner h2 { font-size: 20px !important; }
          .my-mat-stats-row {
            flex-wrap: wrap !important;
            gap: 6px !important;
          }

          /* Subject grouping */
          .studyhub-subj-controls {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .studyhub-subj-controls span { font-size: 13px !important; }
          .studyhub-subj-header {
            padding: 12px 14px !important;
            gap: 8px !important;
          }
          .studyhub-subj-header .studyhub-subj-title { font-size: 14px !important; }
          .studyhub-subj-header .studyhub-subj-count {
            font-size: 11px !important;
            padding: 2px 8px !important;
          }
          .studyhub-subj-body { padding: 8px 10px !important; }
          .studyhub-group-toggles button {
            min-height: 36px !important;
            padding: 6px 14px !important;
            font-size: 12px !important;
          }

          /* Duplicate modal */
          .studyhub-dup-modal {
            padding: 24px 16px !important;
            border-radius: 20px 20px 0 0 !important;
            max-height: 85dvh !important;
            max-width: 100% !important;
          }
          .studyhub-dup-modal h3 { font-size: 17px !important; }
          .studyhub-dup-modal p { font-size: 13px !important; }
          .studyhub-dup-actions {
            flex-direction: column !important;
            gap: 8px !important;
          }
          .studyhub-dup-actions button {
            width: 100% !important;
            min-height: 44px !important;
          }
          .studyhub-dup-list { max-height: 160px !important; }
          .studyhub-dup-item { padding: 8px 10px !important; gap: 8px !important; }
          .studyhub-dup-item-icon { width: 30px !important; height: 30px !important; font-size: 15px !important; }
          .studyhub-dup-item-title { font-size: 12px !important; }
          .studyhub-dup-item-meta { font-size: 10px !important; }

          /* Footer */
          .studyhub-footer {
            padding-top: 24px !important;
            margin-top: 32px !important;
          }
          .studyhub-footer-links {
            gap: 10px !important;
            font-size: 12px !important;
          }

          /* Notification */
          .studyhub-notification {
            left: 12px !important;
            right: 12px !important;
            top: 12px !important;
            font-size: 13px !important;
            padding: 12px 18px !important;
            text-align: center !important;
          }

          /* Semester grid */
          .studyhub-sem-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
          }
          .studyhub-sem-card {
            padding: 18px 14px !important;
          }

          /* Recent header */
          .studyhub-recent-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          /* Hero quick nav → full-width stacked pills */
          .studyhub-hero-nav {
            flex-direction: column !important;
            gap: 8px !important;
            margin-top: 18px !important;
          }
          .studyhub-hero-nav button {
            width: 100% !important;
            justify-content: center !important;
            min-height: 44px !important;
            font-size: 13px !important;
          }

          /* Hero inline stats → 2×2 grid, remove border dividers */
          .studyhub-hero-stats {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 16px 8px !important;
            margin-top: 22px !important;
          }
          .studyhub-hero-stats > div {
            border-right: none !important;
            border-left: none !important;
            padding: 0 !important;
          }

          /* Sections */
          .studyhub-section {
            margin-bottom: 28px !important;
          }
          .studyhub-section > div > h3 {
            font-size: 20px !important;
          }
          .studyhub-section > div > p {
            font-size: 12px !important;
          }

          /* Card-style sections → tighter on mobile */
          .studyhub-card-section {
            padding: 28px 16px !important;
            border-radius: 18px !important;
          }

          /* Video tutorial section → tighter on mobile */
          .studyhub-video-section {
            padding: 28px 16px !important;
            border-radius: 18px !important;
            margin-bottom: 32px !important;
          }

          /* Country search → full width */
          .studyhub-country-search {
            margin-bottom: 16px !important;
          }
          .studyhub-country-search > div {
            max-width: 100% !important;
            padding: 4px 6px 4px 14px !important;
          }

          /* All buttons: touch targets */
          .studyhub-mat-card button,
          .studyhub-confirm-modal button,
          .studyhub-dup-modal button {
            min-height: 44px !important;
          }
        }

        /* Bottom-sheet slide-up animation */
        @keyframes studyhub-slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        /* === 479px — SMALL PHONE === */
        @media (max-width: 479px) {
          /* Recent filter bar: horizontal scroll */
          .studyhub-recent-filter-bar {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px !important;
          }
          .studyhub-recent-filter-bar::-webkit-scrollbar { display: none; }
          .studyhub-recent-filter-chip {
            flex-shrink: 0 !important;
          }
          .studyhub-hero-title { font-size: 21px !important; }
          .studyhub-hero-sub { font-size: 12px !important; }
          .studyhub-hero-arabic { font-size: 14px !important; }
          .studyhub-hero { padding: 22px 12px 20px !important; border-radius: 14px !important; }

          .studyhub-degree-grid,
          .studyhub-degree-cards {
            grid-template-columns: 1fr !important;
          }
          .studyhub-country-grid {
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)) !important;
            gap: 8px !important;
          }
          .studyhub-country-card { padding: 16px 10px !important; }

          .studyhub-modal { max-height: 95dvh !important; }
          .studyhub-modal-body { padding: 14px 16px 20px !important; }
          .studyhub-modal-head { padding: 16px 16px 12px !important; }

          .studyhub-breadcrumb {
            overflow-x: auto !important;
            flex-wrap: nowrap !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .studyhub-breadcrumb::-webkit-scrollbar { display: none; }
          .studyhub-breadcrumb span {
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            font-size: 11px !important;
          }

          .studyhub-sem-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
            gap: 10px !important;
          }
          .studyhub-sem-card { padding: 14px 10px !important; }

          .my-mat-banner {
            padding: 16px 14px !important;
          }
          .my-mat-banner h2 { font-size: 18px !important; }

          /* Hero nav smaller pills */
          .studyhub-hero-nav button {
            padding: 8px 14px !important;
            font-size: 12px !important;
          }

          /* Hero stats tighter */
          .studyhub-hero-stats { gap: 12px 6px !important; }
          .studyhub-hero-stats > div span:first-child { font-size: 14px !important; }

          /* Sections tighter */
          .studyhub-section { margin-bottom: 22px !important; }
          .studyhub-section > div > h3 { font-size: 18px !important; }

          /* Card sections ultra-compact */
          .studyhub-card-section {
            padding: 22px 12px !important;
            border-radius: 14px !important;
          }
        }

        /* === 380px — ULTRA-SMALL PHONE === */
        @media (max-width: 380px) {
          .studyhub-hero { padding: 18px 10px 16px !important; margin-bottom: 20px !important; }
          .studyhub-hero-title { font-size: 19px !important; letter-spacing: -0.5px !important; }
          .studyhub-hero-badge { font-size: 10px !important; padding: 5px 12px !important; }

          .studyhub-stats-row {
            grid-template-columns: 1fr !important;
          }
          .studyhub-stat-card { padding: 12px 14px !important; }

          .studyhub-sem-grid { grid-template-columns: 1fr !important; }

          .studyhub-country-grid {
            grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)) !important;
            gap: 6px !important;
          }
          .studyhub-country-card { padding: 12px 8px !important; border-radius: 12px !important; }

          .studyhub-main { padding: 12px 8px !important; }
          .studyhub-breadcrumb {
            padding-left: 8px !important;
            padding-right: 8px !important;
          }

          .studyhub-dup-modal { padding: 18px 12px !important; }
          .studyhub-subj-header .studyhub-subj-title { font-size: 13px !important; }

          .studyhub-footer { padding: 20px 12px !important; }
          .studyhub-footer-links { gap: 8px !important; }

          /* Hero stats ultra-compact */
          .studyhub-hero-stats { gap: 10px 4px !important; }
          .studyhub-hero-stats > div span:nth-child(2) { font-size: 18px !important; }
          .studyhub-hero-stats > div span:last-child { font-size: 9px !important; }

          /* Hero nav minimal */
          .studyhub-hero-nav button { padding: 7px 10px !important; font-size: 11px !important; }

          /* Sections ultra-compact */
          .studyhub-section { margin-bottom: 18px !important; }
          .studyhub-section > div > h3 { font-size: 17px !important; }
          .studyhub-section > div > p { font-size: 11px !important; }

          /* Card sections - minimal padding */
          .studyhub-card-section {
            padding: 18px 10px !important;
            border-radius: 12px !important;
          }
        }
      ` }} />

      {notification && (
        <div className="studyhub-notification" style={{
          ...S.notification,
          background: notification.type === "error"
            ? "linear-gradient(135deg, #e74c3c, #c0392b)"
            : "linear-gradient(135deg, #27ae60, #2ecc71)",
          ...(isRTL ? { right: "auto", left: 20 } : {}),
        }}>
          {notification.msg}
        </div>
      )}

      {/* HEADER — matches main app navbar style */}
      <header
        className={[
          "sticky top-0 w-full z-50 transition-all duration-500 ease-out",
          scrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20"
            : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md",
          "border-b border-gray-200/50 dark:border-gray-700/30",
        ].join(" ")}
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-500 ${scrolled ? "h-14" : "h-16"}`}>

          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group"
            onClick={() => { navigate("home"); setSearchQuery(""); setIsMobileMenuOpen(false); }}
          >
            <span className="text-2xl sm:text-3xl group-hover:scale-105 transition-transform duration-300">🎓</span>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white m-0 tracking-tight leading-tight">
                {t.siteTitle}
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 m-0 font-medium">
                {t.siteSubtitle}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-0 lg:gap-1 whitespace-nowrap">
            <button
              onClick={() => { navigate("home"); setSearchQuery(""); }}
              className="relative px-2 lg:px-4 py-2 text-xs lg:text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 group"
            >
              <span className="relative z-10">{t.home}</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              <span className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </button>
            <a
              href={`/${locale}`}
              className="relative px-2 lg:px-4 py-2 text-xs lg:text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 group no-underline"
            >
              <span className="relative z-10">{t.backToMain}</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              <span className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </a>
            <button
              onClick={() => { navigate("home"); setSearchQuery(""); }}
              className="relative px-2 lg:px-4 py-2 text-xs lg:text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 group"
            >
              <span className="relative z-10">{t.browseCountries}</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              <span className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </button>
            <button
              onClick={() => navigate("my-materials")}
              className="relative px-2 lg:px-4 py-2 text-xs lg:text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 group"
            >
              <span className="relative z-10">{t.myMaterials}</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              <span className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </button>
            <button
              onClick={() => {
                if (requireLogin()) return;
                if (selectedSemester) setShowUploadModal(true);
                else { navigate("home"); showNotif(t.selectSemesterFirst, "error"); }
              }}
              className="relative px-2 lg:px-4 py-2 text-xs lg:text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 group"
            >
              <span className="relative z-10">{t.upload}</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              <span className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </button>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="relative px-2 lg:px-4 py-2 text-xs lg:text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors duration-300 group no-underline"
            >
              <span className="relative z-10">{t.telegram}</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              <span className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-10" />
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-1 lg:gap-3 shrink-0">
            {/* Search — Modern Expandable with Dropdown */}
            <div ref={navSearchRef} className="relative">
              <div className={`flex items-center rounded-full transition-all duration-300 ${navSearchOpen ? "bg-white dark:bg-gray-800 shadow-lg ring-2 ring-blue-500/40 w-[340px]" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200/70 dark:hover:bg-gray-700 w-[200px]"} px-3.5 py-1.5`}>
                {navSearchLoading ? (
                  <svg className="w-4 h-4 text-blue-500 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className={`w-4 h-4 shrink-0 transition-colors duration-200 ${navSearchOpen ? "text-blue-500" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                <input
                  type="text"
                  placeholder={navSearchOpen ? t.search : t.searchPlaceholderShort}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setNavSearchOpen(true); }}
                  onFocus={() => { setNavSearchOpen(true); }}
                  onKeyDown={handleNavSearchKeyDown}
                  className={`bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 w-full ${isRTL ? "mr-2" : "ml-2"}`}
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setNavSearchResults([]); setNavSearchOpen(false); }}
                    className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-500 dark:text-gray-300 text-xs transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Search Dropdown */}
              {navSearchOpen && searchQuery.trim() && (
                <div className={`absolute top-[calc(100%+8px)] ${isRTL ? "left-0" : "right-0"} w-[380px] max-w-[calc(100vw-32px)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[100] overflow-hidden`}>
                  {/* Results */}
                  <div className="max-h-[400px] overflow-y-auto overscroll-contain">
                    {navSearchLoading && navSearchResults.length === 0 ? (
                      <div className="flex items-center justify-center gap-2 py-8">
                        <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span className="text-sm text-gray-400">{isRTL ? "جاري البحث..." : "Searching..."}</span>
                      </div>
                    ) : navSearchResults.length === 0 && !navSearchLoading ? (
                      <div className="py-8 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.searchNoResults}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t.searchHint}</p>
                      </div>
                    ) : (
                      <>
                        {/* Country Results */}
                        {navSearchResults.some((r) => r.type === "country") && (
                          <div>
                            <div className={`px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 ${isRTL ? "text-right" : "text-left"}`}>
                              {t.searchCountries}
                            </div>
                            {navSearchResults.filter((r) => r.type === "country").map((item, i) => {
                              const globalIdx = navSearchResults.indexOf(item);
                              return (
                                <button
                                  key={`c-${item.data.id}`}
                                  onClick={() => handleNavSearchSelect(item)}
                                  onMouseEnter={() => setNavSearchIdx(globalIdx)}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${globalIdx === navSearchIdx ? "bg-blue-50 dark:bg-blue-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
                                >
                                  <span className="text-xl shrink-0">{item.data.flag}</span>
                                  <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : "text-left"}`}>
                                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{isRTL ? item.data.nameAr || item.data.name : item.data.name}</div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 truncate">{isRTL ? item.data.name : item.data.nameAr || ""}</div>
                                  </div>
                                  <svg className={`w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0 ${isRTL ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Faculty Results */}
                        {navSearchResults.some((r) => r.type === "faculty") && (
                          <div>
                            <div className={`px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                              {t.searchFaculties}
                            </div>
                            {navSearchResults.filter((r) => r.type === "faculty").map((item) => {
                              const globalIdx = navSearchResults.indexOf(item);
                              return (
                                <button
                                  key={`f-${item.data.id}`}
                                  onClick={() => handleNavSearchSelect(item)}
                                  onMouseEnter={() => setNavSearchIdx(globalIdx)}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${globalIdx === navSearchIdx ? "bg-blue-50 dark:bg-blue-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
                                >
                                  <span className="text-lg shrink-0">{item.data.icon}</span>
                                  <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : "text-left"}`}>
                                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{isRTL ? item.data.nameAr : item.data.name}</div>
                                  </div>
                                  <svg className={`w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0 ${isRTL ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Material Results */}
                        {navSearchResults.some((r) => r.type === "material") && (
                          <div>
                            <div className={`px-4 pt-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800 ${isRTL ? "text-right" : "text-left"}`}>
                              {t.searchMaterialsLabel}
                            </div>
                            {navSearchResults.filter((r) => r.type === "material").map((item) => {
                              const globalIdx = navSearchResults.indexOf(item);
                              const typeInfo = getTypeInfo(item.data.type);
                              return (
                                <button
                                  key={`m-${item.data.id}`}
                                  onClick={() => handleNavSearchSelect(item)}
                                  onMouseEnter={() => setNavSearchIdx(globalIdx)}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${globalIdx === navSearchIdx ? "bg-blue-50 dark:bg-blue-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
                                >
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-sm" style={{ background: typeInfo.color + "18", color: typeInfo.color }}>
                                    {typeInfo.icon}
                                  </div>
                                  <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : "text-left"}`}>
                                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.data.title}</div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                      {item.data.subject || item.data.universityName || ""}
                                      {item.data.averageRating > 0 && <span className={`${isRTL ? "mr-2" : "ml-2"}`}>{"★".repeat(Math.round(item.data.averageRating))}</span>}
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0" style={{ background: typeInfo.color + "18", color: typeInfo.color }}>
                                    {typeInfo.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Footer — View All */}
                  {searchQuery.trim() && (
                    <div className="border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => {
                          setNavSearchOpen(false);
                          navigate("browse-all");
                          setTimeout(() => {
                            setBrowseMatSearch(searchQuery);
                            setBrowseMatList([]);
                            fetchBrowseMaterials(searchQuery, "all");
                            setSearchQuery("");
                          }, 100);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        {t.searchViewAll} &ldquo;{searchQuery.trim()}&rdquo;
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            {isLoggedIn && (
              <div ref={notifRef} style={{ position: "relative" }}>
                <button
                  onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) fetchNotifications(); }}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  style={{ position: "relative" }}
                  title={t.notifications}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {showNotifications && (
                  <div className="studyhub-notif-dropdown absolute top-[calc(100%+8px)] right-0 w-[340px] max-w-[calc(100vw-32px)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[100] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                        <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{t.notifications}</span>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">{unreadCount}</span>
                        )}
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Close"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Actions bar */}
                    {notificationsList.length > 0 && (
                      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                        {unreadCount > 0 ? (
                          <button onClick={handleMarkAllRead} className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                            {t.markAllRead}
                          </button>
                        ) : <span />}
                        <button onClick={handleClearAllNotifications} className="text-[11px] font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                          {t.clearAll}
                        </button>
                      </div>
                    )}

                    {/* Notification list */}
                    <div className="max-h-[320px] overflow-y-auto overscroll-contain">
                      {notificationsList.length === 0 ? (
                        <div className="py-10 px-4 text-center">
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-500">
                              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /><line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t.noNotifications}</p>
                        </div>
                      ) : notificationsList.map((n) => (
                        <div
                          key={n.id}
                          className={`group relative px-4 py-3 border-b border-gray-50 dark:border-gray-800 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${!n.read ? (isRTL ? "border-r-[3px] border-r-amber-500 bg-amber-50/50 dark:bg-amber-900/10" : "border-l-[3px] border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10") : ""}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className={`text-[13px] text-gray-900 dark:text-gray-100 ${!n.read ? "font-bold" : "font-medium"}`}>{n.title}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</div>
                              <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{new Date(n.createdAt).toLocaleDateString(isRTL ? "ar" : "en")}</div>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteNotification(n.id); }}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-all shrink-0"
                              title={t.deleteNotification}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => toggleDarkMode()}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              title={darkMode ? t.lightMode : t.darkMode}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Auth: Avatar Dropdown or Sign In */}
            {authStatus === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ) : isLoggedIn ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden lg:inline text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                    {(session.user.name || "").split(" ")[0]}
                  </span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isUserDropdownOpen && (
                  <div className={`absolute top-full mt-2 ${isRTL ? "left-0" : "right-0"} w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden`}>
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email}</p>
                    </div>
                    <a
                      href={`/${locale}/profile`}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 no-underline transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {t.profile}
                    </a>
                    <button
                      onClick={() => { navigate("my-materials"); setIsUserDropdownOpen(false); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 w-full transition-colors"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      {t.myMaterials}
                    </button>
                    <button
                      onClick={() => { navigate("collections"); setIsUserDropdownOpen(false); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 w-full transition-colors"
                    >
                      <span className="w-4 h-4 text-gray-400 text-center">📁</span>
                      {t.collections}
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-800" />
                    <button
                      onClick={() => { setIsUserDropdownOpen(false); signOut({ callbackUrl: `/${locale}/study-hub` }); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      {t.signOut}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href={`/${locale}/login?callbackUrl=/${locale}/study-hub`}
                className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 px-3 lg:px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 no-underline"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden lg:inline">{t.signIn}</span>
              </a>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
          >
            <span className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300 absolute ${isMobileMenuOpen ? "rotate-45 translate-y-0" : "-translate-y-2"}`} />
            <span className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 scale-0" : ""}`} />
            <span className={`w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300 absolute ${isMobileMenuOpen ? "-rotate-45 translate-y-0" : "translate-y-2"}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-y-auto transition-all duration-300 overscroll-contain ${isMobileMenuOpen ? "max-h-[calc(100vh-4rem)] pb-24" : "max-h-0 overflow-hidden"}`}
        >
          <div className="flex flex-col gap-1 pt-4 px-4 border-t border-gray-100 dark:border-gray-800">

            {/* Mobile Search */}
            <div className="relative mb-3">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-2">
                {navSearchLoading ? (
                  <svg className="w-4 h-4 text-blue-500 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                <input
                  type="text"
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setNavSearchOpen(true); }}
                  onFocus={() => setNavSearchOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      setNavSearchOpen(false);
                      setIsMobileMenuOpen(false);
                      navigate("browse-all");
                      setTimeout(() => {
                        setBrowseMatSearch(searchQuery);
                        setBrowseMatList([]);
                        fetchBrowseMaterials(searchQuery, "all");
                        setSearchQuery("");
                      }, 100);
                    }
                  }}
                  className={`bg-transparent border-none outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 w-full ${isRTL ? "mr-2" : "ml-2"}`}
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(""); setNavSearchResults([]); }}
                    className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 text-xs"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              {/* Mobile search results dropdown */}
              {navSearchOpen && searchQuery.trim() && navSearchResults.length > 0 && (
                <div className="mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[260px] overflow-y-auto">
                  {navSearchResults.slice(0, 8).map((item, idx) => (
                    <button
                      key={`mob-${item.type}-${item.data.id}`}
                      onClick={() => { handleNavSearchSelect(item); setIsMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${idx > 0 ? "border-t border-gray-50 dark:border-gray-800" : ""}`}
                    >
                      <span className="text-lg shrink-0">
                        {item.type === "country" ? item.data.flag : item.type === "faculty" ? item.data.icon : getTypeInfo(item.data.type).icon}
                      </span>
                      <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : "text-left"}`}>
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
                          {item.type === "country" ? (isRTL ? item.data.nameAr || item.data.name : item.data.name) : item.type === "faculty" ? (isRTL ? item.data.nameAr : item.data.name) : item.data.title}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase shrink-0">
                        {item.type === "country" ? t.searchCountries : item.type === "faculty" ? t.searchFaculties : t.searchMaterialsLabel}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => { navigate("home"); setSearchQuery(""); setIsMobileMenuOpen(false); }}
              className={`${isRTL ? "text-right" : "text-left"} text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2.5 px-2`}
            >
              {t.home}
            </button>
            <a
              href={`/${locale}`}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2.5 px-2 no-underline"
            >
              {t.backToMain}
            </a>
            <button
              onClick={() => { navigate("home"); setSearchQuery(""); setIsMobileMenuOpen(false); }}
              className={`${isRTL ? "text-right" : "text-left"} text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2.5 px-2`}
            >
              {t.browseCountries}
            </button>
            <button
              onClick={() => { navigate("my-materials"); setIsMobileMenuOpen(false); }}
              className={`${isRTL ? "text-right" : "text-left"} text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2.5 px-2`}
            >
              {t.myMaterials}
            </button>
            <button
              onClick={() => {
                if (requireLogin()) return;
                if (selectedSemester) { setShowUploadModal(true); setIsMobileMenuOpen(false); }
                else { navigate("home"); setIsMobileMenuOpen(false); showNotif(t.selectSemesterFirst, "error"); }
              }}
              className={`${isRTL ? "text-right" : "text-left"} text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2.5 px-2`}
            >
              {t.upload}
            </button>
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors py-2.5 px-2 no-underline"
            >
              {t.telegram}
            </a>

            {/* Mobile bottom actions */}
            <div className="flex items-center gap-3 pt-4 pb-8 border-t border-gray-100 dark:border-gray-800 mt-2">
              <button
                onClick={() => toggleDarkMode()}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              {isLoggedIn ? (
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-2">
                    {session.user.image ? (
                      <img src={session.user.image} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        {(session.user.name || session.user.email || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate m-0">{session.user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate m-0">{session.user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: `/${locale}/study-hub` }); }}
                    className="flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    {t.signOut}
                  </button>
                </div>
              ) : (
                <a
                  href={`/${locale}/login?callbackUrl=/${locale}/study-hub`}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {t.signIn}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* BREADCRUMB */}
      {view !== "home" && (
        <nav className="studyhub-breadcrumb" style={S.breadcrumb}>
          <span style={S.crumbItem} onClick={() => navigate("home")}>🏠 {t.home}</span>
          {view === "my-materials" && (
            <>
              <span style={S.crumbSep}>{isRTL ? "‹" : "›"}</span>
              <span style={S.crumbActive}>📋 {t.myMaterials}</span>
            </>
          )}
          {view === "requests" && (
            <>
              <span style={S.crumbSep}>{isRTL ? "‹" : "›"}</span>
              <span style={S.crumbActive}>📋 {t.requests}</span>
            </>
          )}
          {view === "groups" && (
            <>
              <span style={S.crumbSep}>{isRTL ? "‹" : "›"}</span>
              <span style={S.crumbActive}>👥 {t.studyGroups}</span>
            </>
          )}
          {view === "collections" && (
            <>
              <span style={S.crumbSep}>{isRTL ? "‹" : "›"}</span>
              <span style={S.crumbActive}>📁 {t.collections}</span>
            </>
          )}
          {selectedCountry && view !== "countries" && view !== "my-materials" && view !== "requests" && view !== "groups" && view !== "collections" && (
            <>
              <span style={S.crumbSep}>{isRTL ? "‹" : "›"}</span>
              <span style={S.crumbItem} onClick={() => navigate("universities", selectedCountry)}>
                {selectedCountry.flag} {countryName(selectedCountry)}
              </span>
            </>
          )}
          {selectedUniversity && !["universities","countries","my-materials"].includes(view) && (
            <>
              <span style={S.crumbSep}>{isRTL ? "‹" : "›"}</span>
              <span style={S.crumbItem} onClick={() => navigate("degrees", selectedCountry, selectedUniversity)}>
                🏛️ {uniName(selectedUniversity)}
              </span>
            </>
          )}
          {selectedDegree && !["degrees","universities","countries","my-materials"].includes(view) && (
            <>
              <span style={S.crumbSep}>{isRTL ? "‹" : "›"}</span>
              <span style={S.crumbItem} onClick={() => navigate("faculties", selectedCountry, selectedUniversity, selectedDegree)}>
                {selectedDegree.icon} {degreeName(selectedDegree)}
              </span>
            </>
          )}
          {selectedFaculty && !["faculties","degrees","universities","countries","my-materials"].includes(view) && (
            <>
              <span style={S.crumbSep}>{isRTL ? "‹" : "›"}</span>
              <span style={S.crumbItem} onClick={() => navigate("semesters", selectedCountry, selectedUniversity, selectedDegree, undefined, selectedFaculty)}>
                {selectedFaculty.id === "all" ? "📋" : selectedFaculty.icon} {selectedFaculty.id === "all" ? t.allFaculties : (isRTL ? selectedFaculty.nameAr : selectedFaculty.name)}
              </span>
            </>
          )}
          {selectedSemester && view === "materials" && (
            <>
              <span style={S.crumbSep}>{isRTL ? "‹" : "›"}</span>
              <span style={S.crumbActive}>📚 {semLabel(selectedSemester)}</span>
            </>
          )}
        </nav>
      )}

      {/* MAIN */}
      <main className="studyhub-main" style={S.main}>

        {/* === HOME === */}
        {view === "home" && (
          <div>
            {/* ══════ 1. HERO — with integrated stats & quick nav ══════ */}
            <div className="studyhub-hero" style={S.hero}>
              <div className="studyhub-hero-badge" style={S.heroBadge}>🇸🇩 {t.heroBadge}</div>
              <h2 className="studyhub-hero-title" style={S.heroTitle}>{t.heroTitle}</h2>
              <p className="studyhub-hero-sub" style={S.heroSub}>{t.heroSub}</p>
              <p className="studyhub-hero-arabic" style={{ ...S.heroArabic, direction: isRTL ? "ltr" : "rtl" }}>{t.heroArabic}</p>

              <div className="studyhub-search-box" style={S.searchBox}>
                <span style={{ ...S.searchIcon, ...(isRTL ? { marginRight: 0, marginLeft: 8 } : {}) }}>🔍</span>
                <input
                  type="text"
                  placeholder={t.searchFull}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={S.searchInput}
                />
                {searchQuery && <button onClick={() => setSearchQuery("")} style={S.clearBtn}>✕</button>}
              </div>

              {/* Quick Navigation Pills */}
              <div className="studyhub-hero-nav" style={S.heroQuickNav}>
                <button style={S.heroQuickPill} onClick={() => navigate("browse-all")}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >📚 {t.viewAllMaterials}</button>
                <button style={S.heroQuickPill} onClick={() => navigate("my-materials")}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >📂 {t.myMaterials}</button>
                <button style={S.heroQuickPill} onClick={() => {
                  if (!requireLogin()) { if (selectedSemester) setShowUploadModal(true); else showNotif(t.selectSemesterFirst, "error"); }
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >⬆️ {t.upload}</button>
                <button style={S.heroQuickPill} onClick={() => navigate("requests")}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >📋 {t.requests}</button>
                <button style={S.heroQuickPill} onClick={() => navigate("groups")}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.22)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >👥 {t.studyGroups}</button>
              </div>

              {/* Inline Platform Stats */}
              <div className="studyhub-hero-stats" style={S.heroInlineStats}>
                {[
                  { n: ALL_COUNTRIES.length, l: t.countries, icon: "🌍" },
                  { n: "10,000+", l: t.universities, icon: "🏛️" },
                  { n: allMaterialsTotal, l: t.materials, icon: "📚" },
                  { n: DEGREE_LEVELS.length, l: t.degreeLevels, icon: "🎓" },
                ].map((s, i, arr) => (
                  <div key={i} style={{
                    ...S.heroInlineStat,
                    ...(i < arr.length - 1 ? (isRTL
                      ? { borderLeft: "1px solid rgba(255,255,255,0.12)", paddingLeft: "clamp(14px, 3vw, 28px)" }
                      : { borderRight: "1px solid rgba(255,255,255,0.12)", paddingRight: "clamp(14px, 3vw, 28px)" }
                    ) : {}),
                  }}>
                    <span style={{ fontSize: 18, marginBottom: 4, opacity: 0.7 }}>{s.icon}</span>
                    <span style={S.heroInlineStatNum}>{s.n}</span>
                    <span style={S.heroInlineStatLabel}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════ 2. HOW IT WORKS — modern connected steps ══════ */}
            <div className="studyhub-section studyhub-card-section" style={S.howSectionRedesign}>
              <div style={S.sectionHead}>
                <h3 style={S.sectionHeadTitle}>📖 {t.howItWorks}</h3>
                <p style={S.sectionHeadSub}>
                  {isRTL ? "ابدأ في أربع خطوات بسيطة" : "Get started in four simple steps"}
                </p>
                <div style={S.sectionDivider} />
              </div>
              <div className="studyhub-how-grid" style={S.howGrid}>
                {[
                  { step: "1", icon: "🌍", title: t.step1Title, desc: t.step1Desc, color: "#3B82F6" },
                  { step: "2", icon: "🏛️", title: t.step2Title, desc: t.step2Desc, color: "#8B5CF6" },
                  { step: "3", icon: "🎓", title: t.step3Title, desc: t.step3Desc, color: "#F59E0B" },
                  { step: "4", icon: "📚", title: t.step4Title, desc: t.step4Desc, color: "#10B981" },
                ].map((h, idx) => (
                  <div key={h.step} className="studyhub-how-card" style={S.howCardRedesign}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.04)"; }}
                  >
                    {/* Connector line between cards */}
                    {idx < 3 && <div className="studyhub-how-connector" style={{ position: "absolute", top: 40, [isRTL ? "left" : "right"]: -24, width: 32, height: 2, background: "linear-gradient(90deg, #C8956C 40%, transparent)", zIndex: 1, display: "none" }} />}
                    {/* Step number badge */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 16, background: `linear-gradient(135deg, ${h.color}15, ${h.color}25)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                        <span style={{ fontSize: 28, lineHeight: 1 }}>{h.icon}</span>
                        <div style={{ position: "absolute", top: -6, [isRTL ? "left" : "right"]: -6, width: 22, height: 22, borderRadius: "50%", background: `linear-gradient(135deg, ${h.color}, ${h.color}CC)`, color: "white", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 8px ${h.color}40` }}>{h.step}</div>
                      </div>
                    </div>
                    <h4 style={{ margin: "0 0 8px", color: "#1B3A4B", fontWeight: 800, fontSize: 15, lineHeight: 1.4 }}>{h.title}</h4>
                    <p style={{ margin: 0, fontSize: 13, color: "#8896A6", lineHeight: 1.6, maxWidth: 200, marginInline: "auto" }}>{h.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════ 2.5. VIDEO TUTORIAL — How to use Study Hub ══════ */}
            <div className="studyhub-section studyhub-video-section" style={{
              background: "linear-gradient(135deg, #1B3A4B 0%, #0f2a38 50%, #1a4a5e 100%)",
              borderRadius: 24,
              padding: "clamp(32px, 5vw, 48px) clamp(20px, 4vw, 40px)",
              marginBottom: 48,
              position: "relative",
              overflow: "hidden",
              border: "1px solid rgba(200,149,108,0.15)",
            }}>
              {/* Decorative background elements */}
              <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,149,108,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Section header */}
                <div style={{ textAlign: "center", marginBottom: "clamp(24px, 4vw, 36px)" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(200,149,108,0.15)", padding: "6px 18px", borderRadius: 50, marginBottom: 16, border: "1px solid rgba(200,149,108,0.2)" }}>
                    <span style={{ fontSize: 16 }}>🎬</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#C8956C", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {isRTL ? "فيديو تعليمي" : "Video Tutorial"}
                    </span>
                  </div>
                  <h3 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.5px", lineHeight: 1.2 }}>
                    {t.videoTutorialTitle}
                  </h3>
                  <p style={{ fontSize: "clamp(13px, 2vw, 15px)", color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>
                    {t.videoTutorialSub}
                  </p>
                </div>

                {/* Clickable video thumbnail card */}
                <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
                  <a
                    href="https://drive.google.com/file/d/1TpORHo-UO2zeuRz4ixxhmrk6nLGfEvq3/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="studyhub-video-card"
                    style={{
                      display: "block",
                      position: "relative",
                      paddingBottom: "56.25%",
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
                      background: "linear-gradient(145deg, #0d1f2d 0%, #162d3e 30%, #1a3a50 60%, #0f2535 100%)",
                      cursor: "pointer",
                      textDecoration: "none",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 24px 70px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,149,108,0.2)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)"; }}
                  >
                    {/* Animated background pattern */}
                    <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 20% 50%, #C8956C 1px, transparent 1px), radial-gradient(circle at 80% 20%, #C8956C 1px, transparent 1px), radial-gradient(circle at 60% 80%, #C8956C 1px, transparent 1px)", backgroundSize: "60px 60px, 80px 80px, 50px 50px" }} />

                    {/* Center play button */}
                    <div style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 16,
                      zIndex: 2,
                    }}>
                      {/* Play circle */}
                      <div style={{
                        width: "clamp(64px, 12vw, 88px)",
                        height: "clamp(64px, 12vw, 88px)",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #C8956C, #B07D55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 32px rgba(200,149,108,0.4), 0 0 0 8px rgba(200,149,108,0.1), 0 0 0 16px rgba(200,149,108,0.05)",
                        transition: "transform 0.3s ease",
                      }}>
                        {/* Triangle play icon */}
                        <div style={{
                          width: 0,
                          height: 0,
                          borderStyle: "solid",
                          borderWidth: "clamp(12px, 2vw, 18px) 0 clamp(12px, 2vw, 18px) clamp(20px, 3.5vw, 30px)",
                          borderColor: "transparent transparent transparent white",
                          marginLeft: "clamp(4px, 0.8vw, 6px)",
                        }} />
                      </div>
                      {/* Label text */}
                      <div style={{
                        background: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(8px)",
                        padding: "8px 20px",
                        borderRadius: 50,
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}>
                        <span style={{ color: "#F5E6D3", fontSize: "clamp(12px, 2vw, 14px)", fontWeight: 700, letterSpacing: "0.5px" }}>
                          {t.videoTutorialBtn}
                        </span>
                      </div>
                    </div>

                    {/* Corner decorative icons */}
                    <div style={{ position: "absolute", top: 20, left: 20, fontSize: 28, opacity: 0.15 }}>📚</div>
                    <div style={{ position: "absolute", top: 20, right: 20, fontSize: 28, opacity: 0.15 }}>🎓</div>
                    <div style={{ position: "absolute", bottom: 20, left: 20, fontSize: 28, opacity: 0.15 }}>⬆️</div>
                    <div style={{ position: "absolute", bottom: 20, right: 20, fontSize: 28, opacity: 0.15 }}>🌍</div>

                    {/* Bottom bar */}
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "16px 24px",
                      background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C8956C", boxShadow: "0 0 8px rgba(200,149,108,0.5)" }} />
                        <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>
                          {isRTL ? "مركز الطالب السوداني" : "Sudanese Study Hub"}
                        </span>
                      </div>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600 }}>
                        {isRTL ? "اضغط للمشاهدة" : "Click to watch"}
                      </span>
                    </div>
                  </a>

                  {/* Decorative glow ring around video card */}
                  <div style={{
                    position: "absolute",
                    inset: -2,
                    borderRadius: 18,
                    background: "linear-gradient(135deg, rgba(200,149,108,0.3), transparent 40%, transparent 60%, rgba(59,130,246,0.2))",
                    zIndex: -1,
                    pointerEvents: "none",
                  }} />
                </div>

                {/* Features row below video */}
                <div style={{ display: "flex", justifyContent: "center", gap: "clamp(16px, 4vw, 32px)", marginTop: 28, flexWrap: "wrap" }}>
                  {[
                    { icon: "📤", label: isRTL ? "كيفية رفع المواد" : "How to upload" },
                    { icon: "🔍", label: isRTL ? "البحث والتصفح" : "Search & browse" },
                    { icon: "📂", label: isRTL ? "تنظيم موادك" : "Organize materials" },
                  ].map((feat, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.7 }}>
                      <span style={{ fontSize: 16 }}>{feat.icon}</span>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>{feat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ══════ 3. EXPLORE PROGRAMS — Degree Levels ══════ */}
            <div className="studyhub-section" style={S.sectionBlock}>
              <div style={S.sectionHead}>
                <h3 style={S.sectionHeadTitle}>🎓 {t.degreeLevelsTitle}</h3>
                <p style={S.sectionHeadSub}>
                  {isRTL ? "اختر المرحلة الدراسية المناسبة لك" : "Choose your academic level to get started"}
                </p>
                <div style={S.sectionDivider} />
              </div>
              <div className="studyhub-degree-grid" style={S.degreePreview}>
                {DEGREE_LEVELS.map((d) => (
                  <div
                    key={d.id}
                    style={{ ...S.degreePreviewCard, borderTopColor: d.color }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
                  >
                    <span style={{ fontSize: 32 }}>{d.icon}</span>
                    <span style={{ fontWeight: 800, fontSize: 15, color: "#1B3A4B" }}>{degreeName(d)}</span>
                    <span style={{ fontSize: 12, color: "#888" }}>{isRTL ? d.name : d.arabic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ══════ 4. BROWSE BY COUNTRY — Main navigation ══════ */}
            <div className="studyhub-section" style={S.countrySectionWrap}>
              <div style={S.sectionHead}>
                <h3 style={S.sectionHeadTitle}>🌍 {t.browseByCountry}</h3>
                <p style={S.sectionHeadSub}>
                  {isRTL ? "تصفح الجامعات والمواد الدراسية حسب الدولة" : "Explore universities and study materials by country"}
                </p>
                <div style={S.sectionDivider} />
              </div>
              {/* Country search */}
              <div className="studyhub-country-search" style={S.countrySearchRow}>
                <div style={S.countrySearchInner}>
                  <span style={{ fontSize: 16, opacity: 0.5, ...(isRTL ? { marginLeft: 8 } : { marginRight: 8 }) }}>🔍</span>
                  <input
                    type="text"
                    placeholder={t.searchFull}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={(e) => { const w = e.currentTarget.parentElement; w.style.borderColor = "#1B3A4B"; w.style.boxShadow = "0 0 0 3px rgba(27,58,75,0.08)"; }}
                    onBlur={(e) => { const w = e.currentTarget.parentElement; w.style.borderColor = "#e8ddd0"; w.style.boxShadow = "none"; }}
                    style={{ flex: 1, border: "none", outline: "none", fontSize: 14, padding: "10px 0", background: "transparent", color: "#1B3A4B", fontFamily: "inherit" }}
                  />
                  {searchQuery && <button onClick={() => setSearchQuery("")} style={S.clearBtn}>✕</button>}
                </div>
              </div>
              <div className="studyhub-country-grid" style={S.countryGrid}>
                {(showAllCountries ? filteredCountries : filteredCountries.slice(0, 24)).map((c) => (
                  <div
                    key={c.id}
                    className="studyhub-country-card" style={S.countryCard}
                    onClick={() => navigate("universities", c)}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.boxShadow = "0 3px 16px rgba(0,0,0,0.05)"; }}
                  >
                    <span style={S.countryFlag}>{c.flag}</span>
                    <h4 style={S.countryName}>{countryName(c)}</h4>
                    <span style={S.countryMats}>{countMats(c.id)} {t.nMaterials}</span>
                  </div>
                ))}
              </div>
              {!showAllCountries && filteredCountries.length > 24 && !searchQuery && (
                <button
                  style={S.showAllBtn}
                  onClick={() => setShowAllCountries(true)}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#C8956C"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C8956C"; }}
                >
                  {t.showAllCountries} ({filteredCountries.length})
                </button>
              )}
              {filteredCountries.length === 0 && (
                <div style={S.empty}><span style={{ fontSize: 48 }}>🔍</span><p>{t.noResultsFor} &quot;{searchQuery}&quot;</p></div>
              )}
            </div>

            {/* ══════ 5. RECENT MATERIALS — Social proof + Filter Bar ══════ */}
            {(allMaterials.length > 0 || isRecentFiltered) && (
              <div className="studyhub-recent-section studyhub-section studyhub-card-section" style={S.sectionBlockAlt}>
                <div style={S.sectionHead}>
                  <h3 style={S.sectionHeadTitle}>📚 {t.recentMaterials}</h3>
                  <p style={S.sectionHeadSub}>{isRecentFiltered ? t.filteredResults : t.recentMaterialsSub}</p>
                  <div style={S.sectionDivider} />
                </div>

                {/* Filter Bar */}
                <div className="studyhub-recent-filter-bar" ref={recentFilterRef} style={S.recentFilterBar}>

                  {/* Country chip */}
                  <div style={{ position: "relative" }}>
                    <button
                      className="studyhub-recent-filter-chip"
                      style={{ ...S.recentFilterChip, ...(recentFilters.countryId ? S.recentFilterChipActive : {}), ...(recentFilterOpen === "country" ? S.recentFilterChipOpen : {}) }}
                      onClick={() => { setRecentFilterOpen(recentFilterOpen === "country" ? null : "country"); setRecentCountrySearch(""); }}
                    >
                      {recentFilters.countryId ? (() => { const c = ALL_COUNTRIES.find(x => x.id === recentFilters.countryId); return c ? `${c.flag} ${countryName(c)}` : t.filterByCountry; })() : `🌍 ${t.filterByCountry}`}
                      <span style={{ fontSize: 10 }}>{recentFilterOpen === "country" ? "▲" : "▼"}</span>
                    </button>
                    {recentFilterOpen === "country" && (
                      <div style={{ ...S.recentFilterDropdown, ...(isRTL ? S.recentFilterDropdownRTL : {}) }}>
                        <input
                          type="text"
                          placeholder={t.searchCountry}
                          value={recentCountrySearch}
                          onChange={(e) => setRecentCountrySearch(e.target.value)}
                          style={S.recentFilterSearch}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          style={{ ...S.recentFilterOption, ...(recentFilters.countryId === "" ? S.recentFilterOptionActive : {}) }}
                          onClick={() => updateRecentFilter("countryId", "")}
                        >
                          {t.allCountries}
                        </button>
                        {ALL_COUNTRIES
                          .filter(c => !recentCountrySearch || c.name.toLowerCase().includes(recentCountrySearch.toLowerCase()) || (c.nameAr || "").includes(recentCountrySearch) || c.id.includes(recentCountrySearch.toLowerCase()))
                          .slice(0, 50)
                          .map(c => (
                            <button
                              key={c.id}
                              style={{ ...S.recentFilterOption, ...(recentFilters.countryId === c.id ? S.recentFilterOptionActive : {}) }}
                              onClick={() => updateRecentFilter("countryId", c.id)}
                            >
                              {c.flag} {countryName(c)}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* University chip (only when country selected) */}
                  {recentFilters.countryId && (
                    <div style={{ position: "relative" }}>
                      <button
                        className="studyhub-recent-filter-chip"
                        style={{ ...S.recentFilterChip, ...(recentFilters.universityId ? S.recentFilterChipActive : {}), ...(recentFilterOpen === "university" ? S.recentFilterChipOpen : {}) }}
                        onClick={() => setRecentFilterOpen(recentFilterOpen === "university" ? null : "university")}
                      >
                        {recentFilters.universityId ? (() => { const u = recentFilterUniversities.find(x => x.id === recentFilters.universityId); return u ? `🏫 ${uniName(u)}` : t.filterByUniversity; })() : `🏫 ${t.filterByUniversity}`}
                        <span style={{ fontSize: 10 }}>{recentFilterOpen === "university" ? "▲" : "▼"}</span>
                      </button>
                      {recentFilterOpen === "university" && (
                        <div style={{ ...S.recentFilterDropdown, ...(isRTL ? S.recentFilterDropdownRTL : {}) }}>
                          <button
                            style={{ ...S.recentFilterOption, ...(recentFilters.universityId === "" ? S.recentFilterOptionActive : {}) }}
                            onClick={() => updateRecentFilter("universityId", "")}
                          >
                            {t.allUniversities}
                          </button>
                          {recentFilterUniversities.map(u => (
                            <button
                              key={u.id}
                              style={{ ...S.recentFilterOption, ...(recentFilters.universityId === u.id ? S.recentFilterOptionActive : {}) }}
                              onClick={() => updateRecentFilter("universityId", u.id)}
                            >
                              🏫 {uniName(u)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* File Type chip */}
                  <div style={{ position: "relative" }}>
                    <button
                      className="studyhub-recent-filter-chip"
                      style={{ ...S.recentFilterChip, ...(recentFilters.type ? S.recentFilterChipActive : {}), ...(recentFilterOpen === "type" ? S.recentFilterChipOpen : {}) }}
                      onClick={() => setRecentFilterOpen(recentFilterOpen === "type" ? null : "type")}
                    >
                      {recentFilters.type ? (() => { const ft = getTypeInfo(recentFilters.type); return `${ft.icon} ${fileTypeLabel(ft)}`; })() : `📁 ${t.filterByType}`}
                      <span style={{ fontSize: 10 }}>{recentFilterOpen === "type" ? "▲" : "▼"}</span>
                    </button>
                    {recentFilterOpen === "type" && (
                      <div style={{ ...S.recentFilterDropdown, ...(isRTL ? S.recentFilterDropdownRTL : {}) }}>
                        <button
                          style={{ ...S.recentFilterOption, ...(recentFilters.type === "" ? S.recentFilterOptionActive : {}) }}
                          onClick={() => updateRecentFilter("type", "")}
                        >
                          {t.allTypes}
                        </button>
                        {FILE_TYPES.map(ft => (
                          <button
                            key={ft.id}
                            style={{ ...S.recentFilterOption, ...(recentFilters.type === ft.id ? S.recentFilterOptionActive : {}) }}
                            onClick={() => updateRecentFilter("type", ft.id)}
                          >
                            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: ft.color }} /> {ft.icon} {fileTypeLabel(ft)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Faculty/College chip */}
                  <div style={{ position: "relative" }}>
                    <button
                      className="studyhub-recent-filter-chip"
                      style={{ ...S.recentFilterChip, ...(recentFilters.facultyId ? S.recentFilterChipActive : {}), ...(recentFilterOpen === "faculty" ? S.recentFilterChipOpen : {}) }}
                      onClick={() => setRecentFilterOpen(recentFilterOpen === "faculty" ? null : "faculty")}
                    >
                      {recentFilters.facultyId ? (() => { const fac = FACULTIES.find(f => f.id === recentFilters.facultyId) || FACULTIES[0]; return `${fac.icon} ${facultyName(fac)}`; })() : `🏛️ ${t.filterByFaculty}`}
                      <span style={{ fontSize: 10 }}>{recentFilterOpen === "faculty" ? "▲" : "▼"}</span>
                    </button>
                    {recentFilterOpen === "faculty" && (
                      <div style={{ ...S.recentFilterDropdown, ...(isRTL ? S.recentFilterDropdownRTL : {}), maxHeight: 280, overflowY: "auto" }}>
                        <button
                          style={{ ...S.recentFilterOption, ...(recentFilters.facultyId === "" ? S.recentFilterOptionActive : {}) }}
                          onClick={() => updateRecentFilter("facultyId", "")}
                        >
                          {t.allFaculties}
                        </button>
                        {FACULTIES.map(fac => (
                          <button
                            key={fac.id}
                            style={{ ...S.recentFilterOption, ...(recentFilters.facultyId === fac.id ? S.recentFilterOptionActive : {}) }}
                            onClick={() => updateRecentFilter("facultyId", fac.id)}
                          >
                            {fac.icon} {facultyName(fac)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Specialty chip (only when faculty selected) */}
                  {recentFilters.facultyId && (
                    <div style={{ position: "relative" }}>
                      <button
                        className="studyhub-recent-filter-chip"
                        style={{ ...S.recentFilterChip, ...(recentFilters.specialtyId ? S.recentFilterChipActive : {}), ...(recentFilterOpen === "specialty" ? S.recentFilterChipOpen : {}) }}
                        onClick={() => setRecentFilterOpen(recentFilterOpen === "specialty" ? null : "specialty")}
                      >
                        {recentFilters.specialtyId ? (() => { const specs = SPECIALTIES_MAP[recentFilters.facultyId] || []; const spec = specs.find(s => s.id === recentFilters.specialtyId); return spec ? `📋 ${specialtyName(spec)}` : t.filterBySpecialty; })() : `📋 ${t.filterBySpecialty}`}
                        <span style={{ fontSize: 10 }}>{recentFilterOpen === "specialty" ? "▲" : "▼"}</span>
                      </button>
                      {recentFilterOpen === "specialty" && (
                        <div style={{ ...S.recentFilterDropdown, ...(isRTL ? S.recentFilterDropdownRTL : {}), maxHeight: 280, overflowY: "auto" }}>
                          <button
                            style={{ ...S.recentFilterOption, ...(recentFilters.specialtyId === "" ? S.recentFilterOptionActive : {}) }}
                            onClick={() => updateRecentFilter("specialtyId", "")}
                          >
                            {t.allSpecialties}
                          </button>
                          {(SPECIALTIES_MAP[recentFilters.facultyId] || []).map(spec => (
                            <button
                              key={spec.id}
                              style={{ ...S.recentFilterOption, ...(recentFilters.specialtyId === spec.id ? S.recentFilterOptionActive : {}) }}
                              onClick={() => updateRecentFilter("specialtyId", spec.id)}
                            >
                              📋 {specialtyName(spec)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Degree Level chip */}
                  <div style={{ position: "relative" }}>
                    <button
                      className="studyhub-recent-filter-chip"
                      style={{ ...S.recentFilterChip, ...(recentFilters.degreeId ? S.recentFilterChipActive : {}), ...(recentFilterOpen === "degree" ? S.recentFilterChipOpen : {}) }}
                      onClick={() => setRecentFilterOpen(recentFilterOpen === "degree" ? null : "degree")}
                    >
                      {recentFilters.degreeId ? (() => { const deg = DEGREE_LEVELS.find(d => d.id === recentFilters.degreeId) || DEGREE_LEVELS[0]; return `${deg.icon} ${degreeName(deg)}`; })() : `🎓 ${t.filterByDegree}`}
                      <span style={{ fontSize: 10 }}>{recentFilterOpen === "degree" ? "▲" : "▼"}</span>
                    </button>
                    {recentFilterOpen === "degree" && (
                      <div style={{ ...S.recentFilterDropdown, ...(isRTL ? S.recentFilterDropdownRTL : {}) }}>
                        <button
                          style={{ ...S.recentFilterOption, ...(recentFilters.degreeId === "" ? S.recentFilterOptionActive : {}) }}
                          onClick={() => updateRecentFilter("degreeId", "")}
                        >
                          {t.allDegrees}
                        </button>
                        {DEGREE_LEVELS.map(deg => (
                          <button
                            key={deg.id}
                            style={{ ...S.recentFilterOption, ...(recentFilters.degreeId === deg.id ? S.recentFilterOptionActive : {}) }}
                            onClick={() => updateRecentFilter("degreeId", deg.id)}
                          >
                            <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: deg.color }} /> {deg.icon} {degreeName(deg)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Uploader Role chip */}
                  <div style={{ position: "relative" }}>
                    <button
                      className="studyhub-recent-filter-chip"
                      style={{ ...S.recentFilterChip, ...(recentFilters.uploaderRole ? S.recentFilterChipActive : {}), ...(recentFilterOpen === "role" ? S.recentFilterChipOpen : {}) }}
                      onClick={() => setRecentFilterOpen(recentFilterOpen === "role" ? null : "role")}
                    >
                      {recentFilters.uploaderRole ? (() => { const r = getRoleInfo(recentFilters.uploaderRole); return `${r.icon} ${roleLabel(r)}`; })() : `👤 ${t.filterByUploader}`}
                      <span style={{ fontSize: 10 }}>{recentFilterOpen === "role" ? "▲" : "▼"}</span>
                    </button>
                    {recentFilterOpen === "role" && (
                      <div style={{ ...S.recentFilterDropdown, ...(isRTL ? S.recentFilterDropdownRTL : {}) }}>
                        <button
                          style={{ ...S.recentFilterOption, ...(recentFilters.uploaderRole === "" ? S.recentFilterOptionActive : {}) }}
                          onClick={() => updateRecentFilter("uploaderRole", "")}
                        >
                          {t.allUploaders}
                        </button>
                        {UPLOADER_ROLES.map(r => (
                          <button
                            key={r.id}
                            style={{ ...S.recentFilterOption, ...(recentFilters.uploaderRole === r.id ? S.recentFilterOptionActive : {}) }}
                            onClick={() => updateRecentFilter("uploaderRole", r.id)}
                          >
                            {r.icon} {roleLabel(r)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Semester chip */}
                  <div style={{ position: "relative" }}>
                    <button
                      className="studyhub-recent-filter-chip"
                      style={{ ...S.recentFilterChip, ...(recentFilters.semester ? S.recentFilterChipActive : {}), ...(recentFilterOpen === "semester" ? S.recentFilterChipOpen : {}) }}
                      onClick={() => setRecentFilterOpen(recentFilterOpen === "semester" ? null : "semester")}
                    >
                      {recentFilters.semester ? `📅 ${semLabel(recentFilters.semester)}` : `📅 ${t.filterBySemester}`}
                      <span style={{ fontSize: 10 }}>{recentFilterOpen === "semester" ? "▲" : "▼"}</span>
                    </button>
                    {recentFilterOpen === "semester" && (
                      <div style={{ ...S.recentFilterDropdown, ...(isRTL ? S.recentFilterDropdownRTL : {}) }}>
                        <button
                          style={{ ...S.recentFilterOption, ...(recentFilters.semester === "" ? S.recentFilterOptionActive : {}) }}
                          onClick={() => updateRecentFilter("semester", "")}
                        >
                          {t.allSemesters}
                        </button>
                        {allSemesterOptions.map(sem => (
                          <button
                            key={sem}
                            style={{ ...S.recentFilterOption, ...(recentFilters.semester === sem ? S.recentFilterOptionActive : {}) }}
                            onClick={() => updateRecentFilter("semester", sem)}
                          >
                            {semLabel(sem)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Clear All button */}
                  {activeRecentFilterCount > 0 && (
                    <button
                      style={S.recentFilterClearAll}
                      onClick={clearAllRecentFilters}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#e74c3c"; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#e74c3c"; }}
                    >
                      ✕ {t.clearAllFilters}
                      <span style={S.recentFilterBadge}>{activeRecentFilterCount}</span>
                    </button>
                  )}
                </div>

                {/* Materials grid with loading overlay */}
                <div style={{ position: "relative", minHeight: 100 }}>
                  {recentFilterLoading && (
                    <div style={S.recentFilterLoadingOverlay}>
                      <span style={{ fontSize: 28, animation: "spin 1s linear infinite" }}>⏳</span>
                    </div>
                  )}

                  {recentDisplayMaterials.length > 0 ? (
                    <div className="studyhub-recent-grid" style={S.recentGrid}>
                      {recentDisplayMaterials.map((mat) => {
                        const ti = getTypeInfo(mat.type);
                        const country = ALL_COUNTRIES.find((c) => c.id === mat.countryId);
                        const deg = DEGREE_LEVELS.find((d) => d.id === mat.degreeId);
                        return (
                          <div
                            key={mat.id}
                            className="recent-mat-card"
                            style={{ ...S.recentCard, borderTop: `3px solid ${ti.color}` }}
                          >
                            <div style={S.recentCardTop}>
                              <div style={{ ...S.recentCardIcon, background: ti.color + "15", color: ti.color }}>{ti.icon}</div>
                              <div style={S.recentCardInfo}>
                                <h4 style={S.recentCardTitle}>{mat.title}</h4>
                                <p style={S.recentCardSubject}>📖 {mat.subject}</p>
                              </div>
                            </div>
                            <div style={S.recentCardMeta}>
                              <span style={{ ...S.matBadge, background: ti.color, fontSize: 10 }}>{fileTypeLabel(ti)}</span>
                              {country && (
                                <span style={S.recentCardLocation}>
                                  {country.flag} {countryName(country)}
                                </span>
                              )}
                              {deg && (
                                <span style={S.recentCardLocation}>
                                  {deg.icon} {degreeName(deg)}
                                </span>
                              )}
                              <span style={{ fontSize: 11, color: "#bbb", marginLeft: "auto" }}>
                                {new Date(mat.uploadedAt).toLocaleDateString(isRTL ? "ar" : "en")}
                              </span>
                            </div>
                            <a
                              href={mat.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ ...S.dlBtn, textAlign: "center", display: "block", fontSize: 12, padding: "8px 16px" }}
                            >
                              {mat.type === "video" ? `▶ ${t.watch}` : `⬇ ${t.download}`}
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    !recentFilterLoading && isRecentFiltered && (
                      <div style={S.empty}>
                        <span style={{ fontSize: 48 }}>🔍</span>
                        <p style={{ fontWeight: 700, fontSize: 16, color: "#1B3A4B", margin: "12px 0 4px" }}>{t.noFilterResults}</p>
                        <p style={{ fontSize: 13, color: "#888", margin: "0 0 16px" }}>{t.tryDifferentFilters}</p>
                        <button
                          style={{ ...S.recentFilterClearAll, borderColor: "#1B3A4B", color: "#1B3A4B" }}
                          onClick={clearAllRecentFilters}
                        >
                          ✕ {t.clearAllFilters}
                        </button>
                      </div>
                    )
                  )}
                </div>

                {recentDisplayTotal > (isRecentFiltered ? 12 : 6) && (
                  <div style={{ textAlign: "center", marginTop: 24 }}>
                    <button
                      style={S.viewAllBtn}
                      onClick={() => navigate("browse-all")}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(27,58,75,0.3)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(27,58,75,0.2)"; }}
                    >
                      {t.viewAllMaterials} ({recentDisplayTotal}) →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ══════ 6. TOP CONTRIBUTORS — Leaderboard teaser ══════ */}
            {leaderboardData.length > 0 && (
              <div className="studyhub-section studyhub-card-section" style={S.sectionBlockAlt}>
                <div style={S.sectionHead}>
                  <h3 style={S.sectionHeadTitle}>🏆 {t.topContributors}</h3>
                  <div style={S.sectionDivider} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {leaderboardData.slice(0, 5).map((user, idx) => (
                    <div key={user.id} style={{ ...S.leaderRow, ...(idx === 0 ? S.leaderRowFirst : {}) }}>
                      <span style={S.leaderRank}>{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}</span>
                      {user.image ? (
                        <img src={user.image} alt="" style={S.leaderAvatar} referrerPolicy="no-referrer" />
                      ) : (
                        <div style={{ ...S.leaderAvatar, background: "#C8956C", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 }}>
                          {(user.name || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span style={{ flex: 1, fontWeight: 700, fontSize: 14, color: "#1B3A4B" }}>{user.name || "Anonymous"}</span>
                      <span style={S.leaderPoints}>{user.points} {t.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ══════ 7. OPEN REQUESTS — teaser ══════ */}
            {requestsList.length > 0 && (
              <div className="studyhub-section studyhub-card-section" style={S.sectionBlockAlt}>
                <div style={{ ...S.sectionHead, marginBottom: 16 }}>
                  <h3 style={S.sectionHeadTitle}>📋 {t.openRequests}</h3>
                  <div style={S.sectionDivider} />
                </div>
                {requestsList.slice(0, 3).map((req) => (
                  <div key={req.id} style={{ padding: "12px 16px", borderBottom: "1px solid #ede5da", display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>📌</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#1B3A4B" }}>{req.title}</div>
                      {req.subject && <div style={{ fontSize: 12, color: "#888" }}>📖 {req.subject}</div>}
                    </div>
                    <span style={{ fontSize: 11, color: "#aaa" }}>{new Date(req.createdAt).toLocaleDateString(isRTL ? "ar" : "en")}</span>
                  </div>
                ))}
                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <button style={S.viewAllBtn} onClick={() => navigate("requests")}>{t.requests} →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* === UNIVERSITIES (Searchable Dropdown) === */}
        {view === "universities" && selectedCountry && (
          <div>
            <div className="studyhub-view-header" style={S.viewHeader}>
              <span style={{ fontSize: 48 }}>{selectedCountry.flag}</span>
              <div>
                <h2 style={S.viewTitle}>{t.universitiesIn} {countryName(selectedCountry)}</h2>
                <p style={S.viewSub}>
                  {loadingUniversities
                    ? t.loadingUniversities
                    : universityCache[selectedCountry.id]
                      ? `${universityCache[selectedCountry.id].length} ${t.nUniversities}`
                      : ""}
                </p>
              </div>
            </div>
            {loadingUniversities ? (
              <LoadingSpinner text={t.loadingUniversities} />
            ) : universityError ? (
              <div style={S.empty}>
                <span style={{ fontSize: 48 }}>⚠️</span>
                <p style={{ color: "#e74c3c", fontWeight: 600 }}>{universityError}</p>
                <button
                  style={S.uploadBtn}
                  onClick={() => { setUniversityError(null); fetchUniversities(selectedCountry.id); }}
                >
                  🔄 {isRTL ? "إعادة المحاولة" : "Retry"}
                </button>
              </div>
            ) : universityCache[selectedCountry.id] ? (
              universityCache[selectedCountry.id].length === 0 ? (
                <div style={S.empty}>
                  <span style={{ fontSize: 48 }}>🏫</span>
                  <p>{t.noUniversitiesFound}</p>
                </div>
              ) : (
                <SearchableUniversitySelect
                  universities={universityCache[selectedCountry.id]}
                  onSelect={(uni) => navigate("degrees", selectedCountry, uni)}
                  isRTL={isRTL}
                  t={t}
                />
              )
            ) : null}
          </div>
        )}

        {/* === DEGREE LEVELS === */}
        {view === "degrees" && selectedUniversity && (
          <div>
            <div className="studyhub-view-header" style={S.viewHeader}>
              <span style={{ fontSize: 48 }}>🏛️</span>
              <div>
                <h2 style={S.viewTitle}>{uniName(selectedUniversity)}</h2>
                <p style={S.viewSub}>{selectedCountry.flag} {countryName(selectedCountry)} — {t.selectDegree}</p>
              </div>
            </div>
            <div className="studyhub-degree-cards" style={S.degreeGrid}>
              {DEGREE_LEVELS.map((deg) => {
                const count = countMats(selectedCountry.id, selectedUniversity.id, deg.id);
                return (
                  <div
                    key={deg.id} style={{ ...S.degreeCard, borderTopColor: deg.color }}
                    onClick={() => navigate("faculties", selectedCountry, selectedUniversity, deg)}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 35px " + deg.color + "25"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; }}
                  >
                    <span style={{ fontSize: 48 }}>{deg.icon}</span>
                    <h3 style={{ margin: "12px 0 4px", fontWeight: 900, color: "#1B3A4B", fontSize: 20 }}>{degreeName(deg)}</h3>
                    <p style={{ margin: 0, fontSize: 16, color: deg.color, fontWeight: 700 }}>{isRTL ? deg.name : deg.arabic}</p>
                    <p style={{ margin: "4px 0 12px", fontSize: 13, color: "#888" }}>{degreeDesc(deg)}</p>
                    <span style={{ ...S.degreeBadge, background: deg.color + "18", color: deg.color }}>
                      {count} {matCount(count)}
                    </span>
                    <div style={{ marginTop: 12, fontSize: 12, color: "#aaa" }}>
                      {SEMESTERS_MAP[deg.id].length} {deg.id === "phd" ? t.years : t.semesterTerms}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* === FACULTIES / COLLEGES === */}
        {view === "faculties" && selectedDegree && (
          <div>
            <div className="studyhub-view-header" style={S.viewHeader}>
              <span style={{ fontSize: 48 }}>{selectedDegree.icon}</span>
              <div>
                <h2 style={S.viewTitle}>{t.selectCollege}</h2>
                <p style={S.viewSub}>
                  {selectedCountry.flag} {countryName(selectedCountry)} › {uniName(selectedUniversity)} › {degreeName(selectedDegree)}
                </p>
              </div>
            </div>
            <div className="studyhub-faculty-grid" style={S.facultyGrid}>
              {/* All Faculties card */}
              <div
                className="studyhub-faculty-card"
                style={S.facultyCard}
                onClick={() => navigate("semesters", selectedCountry, selectedUniversity, selectedDegree, undefined, { id: "all", name: "All Faculties", nameAr: "جميع الكليات", icon: "📋" })}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 35px rgba(200,149,108,0.25)"; e.currentTarget.style.borderColor = "#C8956C"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = "transparent"; }}
              >
                <span style={S.facultyIcon}>📋</span>
                <h3 style={S.facultyName}>{t.allFaculties}</h3>
                <p style={S.facultyNameAr}>{isRTL ? "All Faculties" : "جميع الكليات"}</p>
                <p style={S.facultyDesc}>{t.allFacultiesDesc}</p>
                <span style={{ ...S.facultyBadge, background: "#C8956C18", color: "#C8956C" }}>
                  {countMats(selectedCountry.id, selectedUniversity.id, selectedDegree.id)} {matCount(countMats(selectedCountry.id, selectedUniversity.id, selectedDegree.id))}
                </span>
              </div>
              {FACULTIES.map((fac) => {
                const count = countMats(selectedCountry.id, selectedUniversity.id, selectedDegree.id, undefined, fac.id);
                return (
                  <div
                    key={fac.id}
                    className="studyhub-faculty-card"
                    style={S.facultyCard}
                    onClick={() => navigate("semesters", selectedCountry, selectedUniversity, selectedDegree, undefined, fac)}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 35px rgba(200,149,108,0.25)"; e.currentTarget.style.borderColor = "#C8956C"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)"; e.currentTarget.style.borderColor = "transparent"; }}
                  >
                    <span style={S.facultyIcon}>{fac.icon}</span>
                    <h3 style={S.facultyName}>{isRTL ? fac.nameAr : fac.name}</h3>
                    <p style={S.facultyNameAr}>{isRTL ? fac.name : fac.nameAr}</p>
                    <span style={{ ...S.facultyBadge, background: count > 0 ? "#C8956C18" : "#eee", color: count > 0 ? "#C8956C" : "#aaa" }}>
                      {count} {matCount(count)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* === SEMESTERS === */}
        {view === "semesters" && selectedDegree && (
          <div>
            <div className="studyhub-view-header" style={S.viewHeader}>
              <span style={{ fontSize: 48 }}>{selectedDegree.icon}</span>
              <div>
                <h2 style={S.viewTitle}>{degreeName(selectedDegree)}</h2>
                <p style={S.viewSub}>
                  {selectedCountry.flag} {countryName(selectedCountry)} › {uniName(selectedUniversity)}
                  {selectedFaculty && <> › {selectedFaculty.id === "all" ? t.allFaculties : (isRTL ? selectedFaculty.nameAr : selectedFaculty.name)}</>}
                </p>
              </div>
            </div>
            <div className="studyhub-sem-grid" style={S.semGrid}>
              {SEMESTERS_MAP[selectedDegree.id].map((sem) => {
                const facId = selectedFaculty && selectedFaculty.id !== "all" ? selectedFaculty.id : undefined;
                const count = countMats(selectedCountry.id, selectedUniversity.id, selectedDegree.id, sem, facId);
                return (
                  <div
                    key={sem} className="studyhub-sem-card" style={{ ...S.semCard, ...(isRTL ? { borderLeft: "none", borderRight: `4px solid ${selectedDegree.color}` } : { borderLeftColor: selectedDegree.color }) }}
                    onClick={() => navigate("materials", selectedCountry, selectedUniversity, selectedDegree, sem, selectedFaculty)}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.background = "#1B3A4B"; e.currentTarget.style.color = "white"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#1B3A4B"; }}
                  >
                    <div style={{ ...S.semNum, color: selectedDegree.color }}>{sem.replace(/[^\d]/g, "") || "•"}</div>
                    <h4 style={{ margin: "6px 0 4px", fontWeight: 800, fontSize: 16, color: "inherit" }}>{semLabel(sem)}</h4>
                    <span style={{ fontSize: 13, opacity: 0.7, color: "inherit" }}>{count} {matCount(count)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* === MATERIALS === */}
        {view === "materials" && selectedSemester && (
          <div>
            <div className="studyhub-view-header" style={S.viewHeader}>
              <span style={{ fontSize: 48 }}>📚</span>
              <div>
                <h2 style={S.viewTitle}>{semLabel(selectedSemester)}</h2>
                <p style={S.viewSub}>
                  {selectedCountry.flag} {countryName(selectedCountry)} › {uniName(selectedUniversity)} › {selectedDegree.icon} {degreeName(selectedDegree)}
                  {selectedFaculty && selectedFaculty.id !== "all" && <> › {isRTL ? selectedFaculty.nameAr : selectedFaculty.name}</>}
                </p>
              </div>
              <button className="studyhub-upload-btn" style={{ ...S.uploadBtn, ...(isRTL ? { marginLeft: 0, marginRight: "auto" } : {}) }} onClick={() => { if (!requireLogin()) setShowUploadModal(true); }}>⬆️ {t.uploadMaterial}</button>
            </div>

            {/* Filters */}
            <div className="studyhub-filter-row" style={S.filterRow}>
              <button
                onClick={() => setFilterType("all")}
                style={{ ...S.filterBtn, ...(filterType === "all" ? S.filterActive : {}) }}
              >{t.all}</button>
              {FILE_TYPES.map((ft) => {
                const c = materials.filter(
                  (m) => m.countryId === (selectedCountry && selectedCountry.id) && m.universityId === (selectedUniversity && selectedUniversity.id) &&
                    m.degreeId === (selectedDegree && selectedDegree.id) && m.semester === selectedSemester && m.type === ft.id
                ).length;
                return (
                  <button
                    key={ft.id}
                    onClick={() => setFilterType(ft.id)}
                    style={{
                      ...S.filterBtn,
                      ...(filterType === ft.id ? { ...S.filterActive, background: ft.color, borderColor: ft.color } : {}),
                    }}
                  >{ft.icon} {fileTypeLabel(ft)} ({c})</button>
                );
              })}
            </div>

            {currentMaterials.length === 0 ? (
              <div style={S.empty}>
                <span style={{ fontSize: 64 }}>📭</span>
                <h3 style={{ color: "#1B3A4B", margin: "16px 0 8px" }}>{t.noMaterials}</h3>
                <p style={{ color: "#666", marginBottom: 20 }}>{t.beFirst}</p>
                <button style={S.uploadBtn} onClick={() => { if (!requireLogin()) setShowUploadModal(true); }}>⬆️ {t.uploadFirst}</button>
              </div>
            ) : (
              <div>
                <div className="studyhub-subj-controls" style={S.subjectGroupControls}>
                  <span style={S.subjectGroupLabel}>📂 {t.groupBySubject} ({groupedBySubject.length})</span>
                  <div className="studyhub-group-toggles" style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => toggleAllSubjectGroups(true)} style={S.groupToggleBtn}>{t.expandAll}</button>
                    <button onClick={() => toggleAllSubjectGroups(false)} style={S.groupToggleBtn}>{t.collapseAll}</button>
                  </div>
                </div>
                {groupedBySubject.map((group) => {
                  const isExpanded = subjectGroupsExpanded[group.subject] !== false;
                  return (
                    <div key={group.subject} style={S.myGroupSection}>
                      <div
                        className="studyhub-subj-header"
                        style={S.myGroupHeader}
                        onClick={() => toggleSubjectGroup(group.subject)}
                      >
                        <span style={S.myGroupChevron}>{isExpanded ? "▾" : (isRTL ? "◂" : "▸")}</span>
                        <span className="studyhub-subj-title" style={S.myGroupTitle}>📖 {group.subject}</span>
                        <span className="studyhub-subj-count" style={S.myGroupCount}>{group.materials.length} {t.materialsInSubject}</span>
                      </div>
                      {isExpanded && (
                        <div className="studyhub-subj-body" style={S.myGroupBody}>
                          <div className="studyhub-mat-list" style={S.matList}>
                            {group.materials.map((mat) => renderMaterialCard(mat))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* === BROWSE ALL MATERIALS === */}
        {view === "browse-all" && (
          <div>
            <div className="my-mat-banner" style={{ ...S.myMatBanner, marginBottom: 24 }}>
              <div style={{ position: "absolute", top: -30, [isRTL ? "left" : "right"]: -20, fontSize: 120, opacity: 0.06 }}>📚</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 32 }}>📚</span>
                <div>
                  <h2 style={S.myMatBannerTitle}>{t.viewAllMaterials}</h2>
                  <p style={S.myMatBannerSub}>{t.browseAllSub}</p>
                </div>
              </div>
            </div>

            {/* Search + Filters */}
            <div className="studyhub-browse-search-bar" style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 220, position: "relative" }}>
                <span style={{ position: "absolute", [isRTL ? "right" : "left"]: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.5 }}>🔍</span>
                <input
                  type="text"
                  placeholder={t.searchMaterials}
                  value={browseMatSearch}
                  onChange={(e) => setBrowseMatSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { setBrowseMatList([]); fetchBrowseMaterials(browseMatSearch, browseMatType); } }}
                  style={{ ...S.input, [isRTL ? "paddingRight" : "paddingLeft"]: 40 }}
                  onFocus={(e) => { e.target.style.borderColor = "#1B3A4B"; e.target.style.boxShadow = "0 0 0 3px rgba(27,58,75,0.08)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e8ddd0"; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <button
                onClick={() => { setBrowseMatList([]); fetchBrowseMaterials(browseMatSearch, browseMatType); }}
                style={{ ...S.viewAllBtn, padding: "12px 24px" }}
              >🔍</button>
            </div>

            {/* Type filter tabs */}
            <div className="studyhub-filter-row" style={{ ...S.filterRow, marginBottom: 12 }}>
              <button
                onClick={() => { setBrowseMatType("all"); setBrowseMatList([]); fetchBrowseMaterials(browseMatSearch, "all"); }}
                style={{ ...S.filterBtn, ...(browseMatType === "all" ? S.filterActive : {}) }}
              >{t.all}</button>
              {FILE_TYPES.map((ft) => (
                <button
                  key={ft.id}
                  onClick={() => { setBrowseMatType(ft.id); setBrowseMatList([]); fetchBrowseMaterials(browseMatSearch, ft.id); }}
                  style={{ ...S.filterBtn, ...(browseMatType === ft.id ? { ...S.filterActive, background: ft.color, borderColor: ft.color } : {}) }}
                >{ft.icon} {fileTypeLabel(ft)}</button>
              ))}
            </div>

            {/* Sort row */}
            <div className="studyhub-sort-row" style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#888" }}>{t.sortBy}:</span>
              {[
                { id: "newest", label: t.newest },
                { id: "downloads", label: t.mostDownloaded },
                { id: "rating", label: t.highestRated },
              ].map((s) => (
                <button key={s.id}
                  onClick={() => { setSortOrder(s.id); setBrowseMatList([]); fetchBrowseMaterials(browseMatSearch, browseMatType); }}
                  style={{ ...S.filterBtn, fontSize: 11, padding: "5px 12px", ...(sortOrder === s.id ? S.filterActive : {}) }}
                >{s.label}</button>
              ))}
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                style={{ ...S.filterBtn, fontSize: 11, padding: "5px 12px", marginLeft: "auto" }}
              >🔧 {t.advancedFilters}</button>
            </div>

            {/* Advanced filters panel */}
            {showAdvancedFilters && (
              <div className="studyhub-advanced-filters" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16, padding: "14px 16px", background: "#FAF6F1", borderRadius: 14, border: "1px solid #ede5da" }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 4 }}>{t.filterByRating}</label>
                  <select value={advancedFilters.minRating} onChange={(e) => setAdvancedFilters({ ...advancedFilters, minRating: e.target.value })} style={{ ...S.input, padding: "8px 10px", fontSize: 12 }}>
                    <option value="">-</option>
                    <option value="3">3+ ⭐</option>
                    <option value="4">4+ ⭐</option>
                    <option value="4.5">4.5+ ⭐</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 4 }}>{t.filterByFaculty}</label>
                  <select value={advancedFilters.facultyId} onChange={(e) => setAdvancedFilters({ ...advancedFilters, facultyId: e.target.value })} style={{ ...S.input, padding: "8px 10px", fontSize: 12 }}>
                    <option value="">-</option>
                    {FACULTIES.map((fac) => <option key={fac.id} value={fac.id}>{fac.icon} {facultyName(fac)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 4 }}>{t.filterByRole}</label>
                  <select value={advancedFilters.uploaderRole} onChange={(e) => setAdvancedFilters({ ...advancedFilters, uploaderRole: e.target.value })} style={{ ...S.input, padding: "8px 10px", fontSize: 12 }}>
                    <option value="">-</option>
                    {UPLOADER_ROLES.map((r) => <option key={r.id} value={r.id}>{r.icon} {roleLabel(r)}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
                  <button onClick={() => { setBrowseMatList([]); fetchBrowseMaterials(browseMatSearch, browseMatType); }} style={{ ...S.viewAllBtn, padding: "8px 20px", fontSize: 12 }}>🔍 {t.search}</button>
                  <button onClick={() => { setAdvancedFilters({ minRating: "", facultyId: "", uploaderRole: "" }); setBrowseMatList([]); fetchBrowseMaterials(browseMatSearch, browseMatType); }} style={{ ...S.cancelBtn, fontSize: 12, padding: "8px 16px" }}>{t.clearFilters}</button>
                </div>
              </div>
            )}

            {/* Results count */}
            {browseMatTotal > 0 && (
              <p style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
                {t.showing} {browseMatList.length} {t.of} {browseMatTotal} {t.nMaterials}
              </p>
            )}

            {/* Material cards */}
            {browseMatList.length === 0 && !browseMatLoading ? (
              <div style={S.empty}>
                <span style={{ fontSize: 48 }}>📭</span>
                <h3 style={{ color: "#1B3A4B", margin: "16px 0 8px" }}>{t.noMaterials}</h3>
              </div>
            ) : (
              <div className="studyhub-mat-list" style={S.matList}>
                {browseMatList.map((mat) => renderMaterialCard(mat, true))}
              </div>
            )}

            {/* Load More button */}
            {browseMatList.length < browseMatTotal && (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <button
                  onClick={() => fetchBrowseMaterials(undefined, undefined, browseMatList)}
                  disabled={browseMatLoading}
                  style={{ ...S.viewAllBtn, padding: "12px 32px", opacity: browseMatLoading ? 0.6 : 1 }}
                >
                  {browseMatLoading ? "..." : `${t.loadMore} (${browseMatTotal - browseMatList.length})`}
                </button>
              </div>
            )}

            {browseMatLoading && browseMatList.length === 0 && <LoadingSpinner text={t.loadingUniversities} />}
          </div>
        )}

        {/* === MY MATERIALS === */}
        {view === "my-materials" && (
          <div>
            <div className="my-mat-banner" style={S.myMatBanner}>
              <div style={{ position: "absolute", top: -30, [isRTL ? "left" : "right"]: -20, fontSize: 120, opacity: 0.06 }}>📚</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
                <span style={{ fontSize: 32 }}>📂</span>
                <div>
                  <h2 style={S.myMatBannerTitle}>{t.myMaterials}</h2>
                  <p style={S.myMatBannerSub}>{t.allYourMaterials}</p>
                </div>
              </div>
              {myMaterials.length > 0 && (
                <div className="my-mat-stats-row" style={S.myMatStatsRow}>
                  <span style={{ ...S.myMatStatPill, background: "rgba(255,255,255,0.2)", color: "white" }}>
                    📊 {myMaterials.length} {matCount(myMaterials.length)}
                  </span>
                  {(() => {
                    const approved = myMaterials.filter(m => m.status === "APPROVED" || !m.status).length;
                    const pending = myMaterials.filter(m => m.status === "PENDING").length;
                    const rejected = myMaterials.filter(m => m.status === "REJECTED").length;
                    return (
                      <>
                        {approved > 0 && <span style={{ ...S.myMatStatPill, background: "#d1fae5", color: "#065f46" }}>✅ {approved} {t.statusApproved}</span>}
                        {pending > 0 && <span style={{ ...S.myMatStatPill, background: "#fef3c7", color: "#92400e" }}>⏳ {pending} {t.statusPending}</span>}
                        {rejected > 0 && <span style={{ ...S.myMatStatPill, background: "#fee2e2", color: "#991b1b" }}>❌ {rejected} {t.statusRejected}</span>}
                      </>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Uploaded / Saved tab switcher */}
            {isLoggedIn && (
              <div style={{ ...S.filterRow, marginBottom: 20 }}>
                <button
                  onClick={() => setMyMaterialsTab("uploaded")}
                  style={{ ...S.filterBtn, ...(myMaterialsTab === "uploaded" ? S.filterActive : {}) }}
                >📤 {t.uploaded} ({myMaterials.length})</button>
                <button
                  onClick={() => { setMyMaterialsTab("saved"); fetchSavedMaterialIds(); }}
                  style={{ ...S.filterBtn, ...(myMaterialsTab === "saved" ? S.filterActive : {}) }}
                >🔖 {t.saved} ({savedMaterialsList.length})</button>
              </div>
            )}

            {!isLoggedIn ? (
              <div style={S.empty}>
                <span style={{ fontSize: 64 }}>🔒</span>
                <h3 style={{ color: "#1B3A4B", margin: "16px 0 8px" }}>{t.loginToUpload}</h3>
                <a
                  href={`/${locale}/login?callbackUrl=/${locale}/study-hub`}
                  style={{ ...S.uploadBtn, textDecoration: "none", display: "inline-block", marginTop: 8 }}
                >
                  {t.signIn}
                </a>
              </div>
            ) : myMaterialsTab === "saved" ? (
              savedMaterialsList.length === 0 ? (
                <div style={S.myEmptyCard}>
                  <span style={{ fontSize: 52, display: "block", marginBottom: 12, opacity: 0.5 }}>🔖</span>
                  <h3 style={{ color: "#1B3A4B", margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>{t.noSavedMaterials}</h3>
                </div>
              ) : (
                <div className="studyhub-mat-list" style={S.matList}>
                  {savedMaterialsList.map((mat) => renderMaterialCard(mat, true))}
                </div>
              )
            ) : loadingMyMaterials ? (
              <LoadingSpinner text={t.loadingUniversities} />
            ) : myMaterials.length === 0 ? (
              <div style={S.myEmptyCard}>
                <span style={{ fontSize: 52, display: "block", marginBottom: 12, opacity: 0.5 }}>📁</span>
                <h3 style={{ color: "#1B3A4B", margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>{t.noMyMaterials}</h3>
                <p style={{ color: "#999", fontSize: 14, margin: "0 0 20px", lineHeight: 1.5 }}>{t.selectSemesterFirst}</p>
                <button
                  style={{ ...S.uploadBtn, marginLeft: 0 }}
                  onClick={() => navigate("home")}
                >🌍 {t.browseByCountry}</button>
              </div>
            ) : (
              <div>
                {(() => {
                  const grouped = {};
                  myMaterials.forEach((m) => {
                    if (!grouped[m.countryId]) grouped[m.countryId] = {};
                    if (!grouped[m.countryId][m.universityId]) grouped[m.countryId][m.universityId] = [];
                    grouped[m.countryId][m.universityId].push(m);
                  });
                  return Object.keys(grouped).map((cId) => {
                    const country = ALL_COUNTRIES.find((c) => c.id === cId);
                    const countryMats = Object.values(grouped[cId]).flat();
                    const isExpanded = myMaterialsExpanded[cId] !== false;
                    return (
                      <div key={cId} style={S.myGroupSection}>
                        <div
                          className="my-group-header"
                          style={S.myGroupHeader}
                          onClick={() => setMyMaterialsExpanded((prev) => ({ ...prev, [cId]: !isExpanded }))}
                        >
                          <span className={`my-group-chevron${isExpanded ? " expanded" : ""}`} style={S.myGroupChevron}>▸</span>
                          <span style={S.myGroupTitle}>
                            <span style={{ fontSize: 22 }}>{country ? country.flag : "🌍"}</span>
                            {country ? countryName(country) : cId}
                          </span>
                          <span style={S.myGroupCount}>{countryMats.length} {matCount(countryMats.length)}</span>
                        </div>
                        {isExpanded && (
                          <div style={S.myGroupBody}>
                            {Object.keys(grouped[cId]).map((uId) => {
                              const uniMats = grouped[cId][uId];
                              const uniNameDisplay = uniMats[0]?.universityName || uId;
                              return (
                                <div key={uId} style={S.mySubGroup}>
                                  <div style={{ ...S.mySubGroupHeader, ...(isRTL ? { borderLeft: "none", borderRight: "3px solid #C8956C", paddingLeft: 0, paddingRight: 12 } : {}) }}>
                                    <span style={S.mySubGroupTitle}>🏛️ {uniNameDisplay}</span>
                                    <span style={{ fontSize: 11, color: "#999", fontWeight: 600 }}>({uniMats.length})</span>
                                  </div>
                                  <div className="studyhub-mat-list" style={S.matList}>
                                    {uniMats.map((mat) => renderMaterialCard(mat, true))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        )}
        {/* === REQUESTS VIEW === */}
        {view === "requests" && (
          <div>
            <div className="my-mat-banner" style={{ ...S.myMatBanner, marginBottom: 24 }}>
              <div style={{ position: "absolute", top: -30, [isRTL ? "left" : "right"]: -20, fontSize: 120, opacity: 0.06 }}>📋</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 32 }}>📋</span>
                <div>
                  <h2 style={S.myMatBannerTitle}>{t.requests}</h2>
                  <p style={S.myMatBannerSub}>{t.requestDesc}</p>
                </div>
              </div>
            </div>
            {isLoggedIn && (
              <button onClick={() => setShowRequestModal(true)} style={{ ...S.uploadBtn, marginBottom: 20, marginLeft: 0 }}>
                + {t.requestMaterial}
              </button>
            )}
            {requestsLoading ? <LoadingSpinner text="..." /> : requestsList.length === 0 ? (
              <div style={S.empty}>
                <span style={{ fontSize: 48 }}>📭</span>
                <h3 style={{ color: "#1B3A4B", margin: "16px 0 8px" }}>{t.noRequests}</h3>
              </div>
            ) : (
              <div style={S.matList}>
                {requestsList.map((req) => (
                  <div key={req.id} style={{ ...S.matCard, borderLeft: "4px solid #f59e0b" }}>
                    <div style={{ ...S.matIcon, background: "#f59e0b15", color: "#f59e0b" }}>📌</div>
                    <div style={S.matInfo}>
                      <h4 style={S.matTitle}>{req.title}</h4>
                      {req.subject && <p style={S.matSubject}>📖 {req.subject}</p>}
                      {req.description && <p style={S.matDesc}>{req.description}</p>}
                      <div style={S.matMeta}>
                        <span style={{ ...S.matBadge, background: req.status === "OPEN" ? "#f59e0b" : "#10b981" }}>{req.status}</span>
                        {req.user && <span style={{ fontSize: 12, color: "#888" }}>👤 {req.user.name}</span>}
                        <span style={S.matDate}>{new Date(req.createdAt).toLocaleDateString(isRTL ? "ar" : "en")}</span>
                      </div>
                    </div>
                    {isLoggedIn && req.status === "OPEN" && req.userId !== currentUserId && (
                      <button
                        onClick={async () => {
                          await fetch(`/api/study-hub/requests/${req.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "FULFILLED" }) });
                          showNotif(t.requestFulfilled);
                          fetchRequests();
                        }}
                        style={{ ...S.viewAllBtn, padding: "8px 16px", fontSize: 12 }}
                      >{t.fulfillRequest}</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* === STUDY GROUPS VIEW === */}
        {view === "groups" && (
          <div>
            <div className="my-mat-banner" style={{ ...S.myMatBanner, marginBottom: 24 }}>
              <div style={{ position: "absolute", top: -30, [isRTL ? "left" : "right"]: -20, fontSize: 120, opacity: 0.06 }}>👥</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 32 }}>👥</span>
                <div>
                  <h2 style={S.myMatBannerTitle}>{t.studyGroups}</h2>
                  <p style={S.myMatBannerSub}>{isRTL ? "انضم إلى مجموعات الدراسة أو أنشئ مجموعتك" : "Join study groups or create your own"}</p>
                </div>
              </div>
            </div>
            {isLoggedIn && (
              <button onClick={() => setShowGroupModal(true)} style={{ ...S.uploadBtn, marginBottom: 20, marginLeft: 0 }}>
                + {t.createGroup}
              </button>
            )}
            {groupsLoading ? <LoadingSpinner text="..." /> : groupsList.length === 0 ? (
              <div style={S.empty}>
                <span style={{ fontSize: 48 }}>👥</span>
                <h3 style={{ color: "#1B3A4B", margin: "16px 0 8px" }}>{t.noGroups}</h3>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {groupsList.map((group) => {
                  const platformIcons = { whatsapp: "💬", telegram: "📱", discord: "🎮" };
                  return (
                    <div key={group.id} style={{ ...S.recentCard, borderTop: "3px solid #C8956C" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 28 }}>{platformIcons[group.platform] || "💬"}</span>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: 16, fontWeight: 800, color: "#1B3A4B", margin: 0 }}>{group.name}</h4>
                          {group.description && <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>{group.description}</p>}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#888" }}>
                        <span>{platformIcons[group.platform]} {group.platform}</span>
                        <span>👤 {group.memberCount} {t.members}</span>
                        {group.creator && <span>by {group.creator.name}</span>}
                      </div>
                      <a href={group.chatLink} target="_blank" rel="noopener noreferrer" style={{ ...S.dlBtn, textAlign: "center", display: "block", fontSize: 13 }}>
                        {t.joinGroup} →
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* === COLLECTIONS VIEW === */}
        {view === "collections" && (
          <div>
            <div className="my-mat-banner" style={{ ...S.myMatBanner, marginBottom: 24 }}>
              <div style={{ position: "absolute", top: -30, [isRTL ? "left" : "right"]: -20, fontSize: 120, opacity: 0.06 }}>📁</div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 32 }}>📁</span>
                <div>
                  <h2 style={S.myMatBannerTitle}>{t.collections}</h2>
                  <p style={S.myMatBannerSub}>{isRTL ? "نظّم موادك في مجموعات" : "Organize your materials into collections"}</p>
                </div>
              </div>
            </div>
            {isLoggedIn && (
              <button onClick={() => setShowCollectionModal(true)} style={{ ...S.uploadBtn, marginBottom: 20, marginLeft: 0 }}>
                + {t.createCollection}
              </button>
            )}
            {!isLoggedIn ? (
              <div style={S.empty}>
                <span style={{ fontSize: 64 }}>🔒</span>
                <h3 style={{ color: "#1B3A4B", margin: "16px 0 8px" }}>{t.loginToUpload}</h3>
              </div>
            ) : myCollections.length === 0 ? (
              <div style={S.myEmptyCard}>
                <span style={{ fontSize: 52, display: "block", marginBottom: 12, opacity: 0.5 }}>📁</span>
                <h3 style={{ color: "#1B3A4B", margin: "0 0 8px", fontSize: 18, fontWeight: 800 }}>{t.noCollections}</h3>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                {myCollections.map((col) => (
                  <div key={col.id} style={{ ...S.recentCard, borderTop: "3px solid #1B3A4B", cursor: "pointer", position: "relative" }}
                    onClick={async () => {
                      try {
                        const res = await fetch(`/api/study-hub/collections/${col.id}`);
                        if (res.ok) {
                          const data = await res.json();
                          setSelectedCollectionView(data);
                        }
                      } catch (err) { console.error(err); }
                    }}
                  >
                    {/* Edit / Delete actions */}
                    <div style={{ position: "absolute", top: 12, [isRTL ? "left" : "right"]: 12, display: "flex", gap: 4, zIndex: 2 }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEditCollection(col); }}
                        title={t.editCollection}
                        style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e8ddd0", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF9F3"; e.currentTarget.style.borderColor = "#C8956C"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e8ddd0"; }}
                      >✏️</button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteCollectionConfirm({ id: col.id, name: col.name }); }}
                        title={t.deleteCollection}
                        style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #e8ddd0", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "all 0.2s" }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.borderColor = "#ef4444"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#e8ddd0"; }}
                      >🗑️</button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: isRTL ? 0 : 76, paddingLeft: isRTL ? 76 : 0 }}>
                      <span style={{ fontSize: 28 }}>📁</span>
                      <div>
                        <h4 style={{ fontSize: 16, fontWeight: 800, color: "#1B3A4B", margin: 0 }}>{col.name}</h4>
                        {col.description && <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>{col.description}</p>}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#888" }}>
                      <span>{col._count?.items || 0} {t.materials}</span>
                      <span style={{ ...S.matBadge, background: col.isPublic ? "#10b981" : "#6b7280" }}>{col.isPublic ? t.publicCollection : t.privateCollection}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Collection detail view */}
            {selectedCollectionView && (
              <div style={{ marginTop: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <button onClick={() => setSelectedCollectionView(null)} style={S.cancelBtn}>← {isRTL ? "رجوع" : "Back"}</button>
                  <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#1B3A4B" }}>📁 {selectedCollectionView.collection?.name}</h3>
                </div>
                {selectedCollectionView.materials?.length > 0 ? (
                  <div style={S.matList}>
                    {selectedCollectionView.materials.map((mat) => renderMaterialCard(mat, true))}
                  </div>
                ) : (
                  <div style={S.empty}><span style={{ fontSize: 48 }}>📭</span><p>{t.noMaterials}</p></div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* UPLOAD / EDIT MODAL */}
      {showUploadModal && (
        <div className="studyhub-overlay" style={S.overlay} onClick={() => { setShowUploadModal(false); setEditingMaterial(null); setUploadForm({ title: "", type: "pdf", url: "", description: "", subject: "", facultyId: "", specialtyId: "", uploaderRole: "student" }); }}>
          <div className="studyhub-modal" style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div className="studyhub-modal-head" style={S.modalHead}>
              <div>
                <h3 style={S.modalTitle}>
                  <span style={{ fontSize: 24 }}>{editingMaterial ? "✏️" : "📤"}</span>
                  {editingMaterial ? t.editMaterial : t.uploadStudyMaterial}
                </h3>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 6, lineHeight: 1.4 }}>
                  {editingMaterial ? (
                    <>
                      {(() => { const ec = ALL_COUNTRIES.find((c) => c.id === editingMaterial.countryId); return ec ? `${ec.flag} ${countryName(ec)}` : editingMaterial.countryId; })()}
                      {" › "}{editingMaterial.universityName}
                      {" › "}{(() => { const ed = DEGREE_LEVELS.find((d) => d.id === editingMaterial.degreeId); return ed ? `${ed.icon} ${degreeName(ed)}` : editingMaterial.degreeId; })()}
                      {" › "}{semLabel(editingMaterial.semester)}
                    </>
                  ) : (
                    <>
                      {selectedCountry && selectedCountry.flag} {selectedCountry && countryName(selectedCountry)} › {selectedUniversity && uniName(selectedUniversity)} › {selectedDegree && selectedDegree.icon} {selectedDegree && degreeName(selectedDegree)} › {semLabel(selectedSemester)}
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => { setShowUploadModal(false); setEditingMaterial(null); setUploadForm({ title: "", type: "pdf", url: "", description: "", subject: "", facultyId: "", specialtyId: "", uploaderRole: "student" }); }}
                style={S.modalX}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; }}
              >✕</button>
            </div>
            <div className="studyhub-modal-body" style={S.modalBody}>
              {/* Material Title */}
              <label style={{ ...S.label, marginTop: 0 }}>{t.materialTitle} <span style={{ color: "#C8956C" }}>*</span></label>
              <input type="text" placeholder={t.materialTitlePlaceholder} value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                style={S.input}
                onFocus={(e) => { e.target.style.borderColor = "#1B3A4B"; e.target.style.boxShadow = "0 0 0 3px rgba(27,58,75,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e8ddd0"; e.target.style.boxShadow = "none"; }}
              />

              {/* Subject */}
              <label style={S.label}>{t.subjectCourse} <span style={{ color: "#C8956C" }}>*</span></label>
              <input type="text" placeholder={t.subjectPlaceholder} value={uploadForm.subject}
                onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                style={S.input}
                onFocus={(e) => { e.target.style.borderColor = "#1B3A4B"; e.target.style.boxShadow = "0 0 0 3px rgba(27,58,75,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e8ddd0"; e.target.style.boxShadow = "none"; }}
              />

              {/* Faculty & Specialty row */}
              <div className="studyhub-modal-faculty-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={S.label}>{t.faculty}</label>
                  <select value={uploadForm.facultyId} onChange={(e) => handleFacultyChange(e.target.value)} style={{ ...S.input, cursor: "pointer" }}>
                    <option value="">{t.selectFaculty}</option>
                    {FACULTIES.map((fac) => (
                      <option key={fac.id} value={fac.id}>{fac.icon} {facultyName(fac)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={S.label}>{t.specialty}</label>
                  <select
                    value={uploadForm.specialtyId}
                    onChange={(e) => setUploadForm({ ...uploadForm, specialtyId: e.target.value })}
                    style={{ ...S.input, cursor: "pointer", opacity: uploadForm.facultyId ? 1 : 0.5 }}
                    disabled={!uploadForm.facultyId}
                  >
                    <option value="">{uploadForm.facultyId ? t.selectSpecialty : t.selectFacultyFirst}</option>
                    {uploadForm.facultyId && (SPECIALTIES_MAP[uploadForm.facultyId] || []).map((spec) => (
                      <option key={spec.id} value={spec.id}>{specialtyName(spec)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Material Type */}
              <label style={S.label}>{t.materialType} <span style={{ color: "#C8956C" }}>*</span></label>
              <div className="studyhub-type-selector" style={S.typeSelector}>
                {FILE_TYPES.map((ft) => {
                  const isActive = uploadForm.type === ft.id;
                  return (
                    <button key={ft.id}
                      onClick={() => setUploadForm({ ...uploadForm, type: ft.id })}
                      style={{
                        ...S.typeOpt,
                        borderColor: isActive ? ft.color : "#e8ddd0",
                        background: isActive ? ft.color + "15" : "white",
                        boxShadow: isActive ? `0 2px 8px ${ft.color}25` : "none",
                        transform: isActive ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{ft.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? ft.color : "#666" }}>{fileTypeLabel(ft)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Role */}
              <label style={S.label}>{t.selectRole} <span style={{ color: "#C8956C" }}>*</span></label>
              <div className="studyhub-type-selector" style={S.typeSelector}>
                {UPLOADER_ROLES.map((role) => {
                  const isActive = uploadForm.uploaderRole === role.id;
                  return (
                    <button key={role.id}
                      onClick={() => setUploadForm({ ...uploadForm, uploaderRole: role.id })}
                      style={{
                        ...S.typeOpt,
                        borderColor: isActive ? role.color : "#e8ddd0",
                        background: isActive ? role.color + "15" : "white",
                        boxShadow: isActive ? `0 2px 8px ${role.color}25` : "none",
                        transform: isActive ? "scale(1.05)" : "scale(1)",
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{role.icon}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? role.color : "#666" }}>{roleLabel(role)}</span>
                    </button>
                  );
                })}
              </div>

              {/* File URL */}
              <label style={S.label}>{uploadForm.type === "video" ? t.videoUrl : t.fileUrl} <span style={{ color: "#C8956C" }}>*</span></label>
              <input type="url" placeholder={uploadForm.type === "video" ? t.videoPlaceholder : t.filePlaceholder}
                value={uploadForm.url} onChange={(e) => setUploadForm({ ...uploadForm, url: e.target.value })}
                style={S.input}
                onFocus={(e) => { e.target.style.borderColor = "#1B3A4B"; e.target.style.boxShadow = "0 0 0 3px rgba(27,58,75,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e8ddd0"; e.target.style.boxShadow = "none"; }}
              />

              {/* Description */}
              <label style={S.label}>{t.description}</label>
              <textarea placeholder={t.descPlaceholder} value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                style={{ ...S.input, height: 80, resize: "vertical" }}
                onFocus={(e) => { e.target.style.borderColor = "#1B3A4B"; e.target.style.boxShadow = "0 0 0 3px rgba(27,58,75,0.08)"; }}
                onBlur={(e) => { e.target.style.borderColor = "#e8ddd0"; e.target.style.boxShadow = "none"; }}
              />

              <button
                onClick={handleUpload}
                style={S.submitBtn}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 25px rgba(27,58,75,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(27,58,75,0.3)"; }}
              >
                {editingMaterial ? `✏️ ${t.saveChanges}` : `📤 ${t.uploadMaterialBtn}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="studyhub-overlay" style={S.overlay} onClick={handleDeleteCancel}>
          <div className="studyhub-confirm-modal" style={S.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div style={S.confirmIcon}>🗑️</div>
            <h3 style={S.confirmTitle}>{t.confirmDelete}</h3>
            <p style={S.confirmMsg}>{t.confirmDeleteMsg} &quot;{deleteConfirm.title}&quot;?</p>
            <div style={S.confirmActions}>
              <button onClick={handleDeleteCancel} style={S.cancelBtn}>{t.cancel}</button>
              <button onClick={handleDeleteConfirm} style={S.confirmDeleteBtn}>{t.yesDelete}</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE COLLECTION CONFIRMATION MODAL */}
      {deleteCollectionConfirm && (
        <div className="studyhub-overlay" style={S.overlay} onClick={() => setDeleteCollectionConfirm(null)}>
          <div className="studyhub-confirm-modal" style={S.confirmModal} onClick={(e) => e.stopPropagation()}>
            <div style={S.confirmIcon}>🗑️</div>
            <h3 style={S.confirmTitle}>{t.deleteCollection}</h3>
            <p style={S.confirmMsg}>{t.deleteCollectionMsg}</p>
            <p style={{ margin: "8px 0 0", fontSize: 15, fontWeight: 700, color: "#1B3A4B", textAlign: "center" }}>&quot;{deleteCollectionConfirm.name}&quot;</p>
            <div style={S.confirmActions}>
              <button onClick={() => setDeleteCollectionConfirm(null)} style={S.cancelBtn}>{t.cancel}</button>
              <button onClick={handleDeleteCollection} style={S.confirmDeleteBtn}>{t.yesDelete}</button>
            </div>
          </div>
        </div>
      )}

      {/* DUPLICATE WARNING MODAL */}
      {duplicateWarning && (
        <div style={S.overlay} onClick={handleDuplicateCancel}>
          <div className="studyhub-dup-modal" style={S.duplicateModal} onClick={(e) => e.stopPropagation()}>
            <div style={S.duplicateIcon}>⚠️</div>
            <h3 style={S.confirmTitle}>{t.duplicateWarningTitle}</h3>
            <p style={S.confirmMsg}>{t.duplicateWarningMsg}</p>
            <div className="studyhub-dup-list" style={S.duplicateList}>
              {duplicateWarning.duplicates.map((dup) => {
                const ti = getTypeInfo(dup.type);
                return (
                  <div key={dup.id} className="studyhub-dup-item" style={S.duplicateItem}>
                    <div className="studyhub-dup-item-icon" style={{ ...S.duplicateItemIcon, background: ti.color + "15", color: ti.color }}>{ti.icon}</div>
                    <div style={S.duplicateItemInfo}>
                      <span className="studyhub-dup-item-title" style={S.duplicateItemTitle}>{dup.title}</span>
                      <span className="studyhub-dup-item-meta" style={S.duplicateItemMeta}>{t.duplicateSubject}: {dup.subject} · {t.duplicateUploadedOn} {new Date(dup.uploadedAt).toLocaleDateString(isRTL ? "ar" : "en")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="studyhub-dup-actions" style={S.confirmActions}>
              <button onClick={handleDuplicateCancel} style={S.cancelBtn}>{t.cancel}</button>
              <button onClick={handleDuplicateConfirm} style={S.duplicateConfirmBtn}>{t.uploadAnyway}</button>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <div className="studyhub-overlay" style={S.overlay} onClick={() => { setShowReviewModal(null); setReviewForm({ rating: 0, comment: "" }); }}>
          <div className="studyhub-modal" style={{ ...S.modal, maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="studyhub-modal-head" style={S.modalHead}>
              <h3 style={S.modalTitle}>⭐ {t.writeReview}</h3>
              <button onClick={() => { setShowReviewModal(null); setReviewForm({ rating: 0, comment: "" }); }} style={S.modalX}>✕</button>
            </div>
            <div style={S.modalBody}>
              <label style={{ ...S.label, marginTop: 0 }}>{t.yourRating}</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    style={{ ...S.starBtn, ...(reviewForm.rating >= star ? S.starActive : S.starInactive) }}
                  >⭐</button>
                ))}
              </div>
              <label style={S.label}>{t.addComment}</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                style={{ ...S.input, height: 80, resize: "vertical" }}
                placeholder={t.addComment}
              />
              <button onClick={handleSubmitReview} style={S.submitBtn} disabled={reviewForm.rating === 0}>
                {t.submitReview}
              </button>
              {/* Existing reviews */}
              {materialReviews[showReviewModal] && (
                <div style={{ marginTop: 20 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10, color: "#1B3A4B" }}>{t.reviewsLabel} ({materialReviews[showReviewModal].reviewCount})</h4>
                  {materialReviews[showReviewModal].reviews?.length > 0 ? (
                    materialReviews[showReviewModal].reviews.map((rev) => (
                      <div key={rev.id} style={{ padding: "10px 0", borderBottom: "1px solid #ede5da" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          {rev.user?.image ? <img src={rev.user.image} alt="" style={{ width: 24, height: 24, borderRadius: "50%" }} referrerPolicy="no-referrer" /> : <span>👤</span>}
                          <span style={{ fontWeight: 700, fontSize: 13, color: "#1B3A4B" }}>{rev.user?.name || "Anonymous"}</span>
                          <span style={{ fontSize: 12, color: "#C8956C" }}>{"⭐".repeat(rev.rating)}</span>
                        </div>
                        {rev.comment && <p style={{ fontSize: 13, color: "#666", margin: "4px 0 0" }}>{rev.comment}</p>}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: 13, color: "#888" }}>{t.noReviews}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {previewMaterial && (
        <div className="studyhub-overlay" style={S.overlay} onClick={() => setPreviewMaterial(null)}>
          <div className="studyhub-modal" style={{ ...S.modal, maxWidth: 720 }} onClick={(e) => e.stopPropagation()}>
            <div className="studyhub-modal-head" style={S.modalHead}>
              <h3 style={S.modalTitle}>👁 {t.preview}: {previewMaterial.title}</h3>
              <button onClick={() => setPreviewMaterial(null)} style={S.modalX}>✕</button>
            </div>
            <div style={{ ...S.modalBody, padding: 0 }}>
              {(() => {
                const pv = getPreviewUrl(previewMaterial.url);
                if (!pv) return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>{t.cannotPreview}</div>;
                return <iframe className="studyhub-preview-frame" src={pv.embedUrl} style={S.previewFrame} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Preview" />;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* REQUEST MODAL */}
      {showRequestModal && (
        <div className="studyhub-overlay" style={S.overlay} onClick={() => setShowRequestModal(false)}>
          <div className="studyhub-modal" style={{ ...S.modal, maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="studyhub-modal-head" style={S.modalHead}>
              <h3 style={S.modalTitle}>📋 {t.requestMaterial}</h3>
              <button onClick={() => setShowRequestModal(false)} style={S.modalX}>✕</button>
            </div>
            <div style={S.modalBody}>
              <label style={{ ...S.label, marginTop: 0 }}>{t.requestTitle} <span style={{ color: "#C8956C" }}>*</span></label>
              <input type="text" value={requestForm.title} onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })} style={S.input} placeholder={t.requestTitle} />
              <label style={S.label}>{t.subjectCourse}</label>
              <input type="text" value={requestForm.subject} onChange={(e) => setRequestForm({ ...requestForm, subject: e.target.value })} style={S.input} placeholder={t.subjectPlaceholder} />
              <label style={S.label}>{t.description}</label>
              <textarea value={requestForm.description} onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })} style={{ ...S.input, height: 80, resize: "vertical" }} placeholder={t.requestDesc} />
              <button onClick={handleSubmitRequest} style={S.submitBtn}>{t.submitRequest}</button>
            </div>
          </div>
        </div>
      )}

      {/* GROUP CREATION MODAL */}
      {showGroupModal && (
        <div className="studyhub-overlay" style={S.overlay} onClick={() => setShowGroupModal(false)}>
          <div className="studyhub-modal" style={{ ...S.modal, maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <div className="studyhub-modal-head" style={S.modalHead}>
              <h3 style={S.modalTitle}>👥 {t.createGroup}</h3>
              <button onClick={() => setShowGroupModal(false)} style={S.modalX}>✕</button>
            </div>
            <div style={S.modalBody}>
              <label style={{ ...S.label, marginTop: 0 }}>{t.groupName} <span style={{ color: "#C8956C" }}>*</span></label>
              <input type="text" value={groupForm.name} onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })} style={S.input} placeholder={t.groupName} />
              <label style={S.label}>{t.groupDesc}</label>
              <textarea value={groupForm.description} onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })} style={{ ...S.input, height: 60, resize: "vertical" }} placeholder={t.groupDesc} />
              <label style={S.label}>{t.chatPlatform} <span style={{ color: "#C8956C" }}>*</span></label>
              <div style={S.typeSelector}>
                {[
                  { id: "whatsapp", icon: "💬", label: "WhatsApp" },
                  { id: "telegram", icon: "📱", label: "Telegram" },
                  { id: "discord", icon: "🎮", label: "Discord" },
                ].map((p) => (
                  <button key={p.id} onClick={() => setGroupForm({ ...groupForm, platform: p.id })}
                    style={{ ...S.typeOpt, borderColor: groupForm.platform === p.id ? "#C8956C" : "#e8ddd0", background: groupForm.platform === p.id ? "#C8956C15" : "white" }}
                  >
                    <span style={{ fontSize: 24 }}>{p.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: groupForm.platform === p.id ? "#C8956C" : "#666" }}>{p.label}</span>
                  </button>
                ))}
              </div>
              <label style={S.label}>{t.chatLink} <span style={{ color: "#C8956C" }}>*</span></label>
              <input type="url" value={groupForm.chatLink} onChange={(e) => setGroupForm({ ...groupForm, chatLink: e.target.value })} style={S.input} placeholder="https://..." />
              <button onClick={handleSubmitGroup} style={S.submitBtn}>{t.createGroup}</button>
            </div>
          </div>
        </div>
      )}

      {/* COLLECTION CREATION MODAL */}
      {showCollectionModal && (
        <div className="studyhub-overlay" style={S.overlay} onClick={() => { setShowCollectionModal(false); setEditingCollection(null); setCollectionForm({ name: "", description: "", isPublic: false }); }}>
          <div className="studyhub-modal" style={{ ...S.modal, maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="studyhub-modal-head" style={S.modalHead}>
              <h3 style={S.modalTitle}>📁 {editingCollection ? t.editCollection : t.createCollection}</h3>
              <button onClick={() => { setShowCollectionModal(false); setEditingCollection(null); setCollectionForm({ name: "", description: "", isPublic: false }); }} style={S.modalX}>✕</button>
            </div>
            <div style={S.modalBody}>
              <label style={{ ...S.label, marginTop: 0 }}>{t.collectionName} <span style={{ color: "#C8956C" }}>*</span></label>
              <input type="text" value={collectionForm.name} onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })} style={S.input} placeholder={t.collectionName} />
              <label style={S.label}>{t.description}</label>
              <textarea value={collectionForm.description} onChange={(e) => setCollectionForm({ ...collectionForm, description: e.target.value })} style={{ ...S.input, height: 60, resize: "vertical" }} placeholder={t.descPlaceholder} />
              <label style={{ ...S.label, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={collectionForm.isPublic} onChange={(e) => setCollectionForm({ ...collectionForm, isPublic: e.target.checked })} />
                {t.publicCollection}
              </label>
              <button onClick={editingCollection ? handleUpdateCollection : handleCreateCollection} style={S.submitBtn}>{editingCollection ? t.saveChanges : t.createCollection}</button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="studyhub-footer" style={S.footer}>
        <p style={S.footerText}>🎓 {t.footerText}</p>
        <p style={{ ...S.footerAr, direction: isRTL ? "ltr" : "rtl" }}>{t.footerAr}</p>
        <div className="studyhub-footer-links" style={S.footerLinks}>
          <a href={`/${locale}`} style={S.footerLink}>🏠 {t.home}</a>
          <span style={{ color: "#C8956C" }}>•</span>
          <a href={`/${locale}/scholarships`} style={S.footerLink}>🎯 {t.scholarships}</a>
          <span style={{ color: "#C8956C" }}>•</span>
          <a href={`/${locale}/contact`} style={S.footerLink}>📧 {t.contact}</a>
          <span style={{ color: "#C8956C" }}>•</span>
          <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" style={S.footerLink}>📱 {t.telegram}</a>
        </div>
      </footer>
    </div>
  );
}

const S = {
  app: { fontFamily: "var(--font-inter), var(--font-cairo), 'Inter', 'Cairo', system-ui, sans-serif", minHeight: "100vh", background: "#FAF6F1", color: "#1B3A4B", position: "relative" },
  bgPattern: { position: "fixed", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(200,149,108,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(27,58,75,0.04) 0%, transparent 50%)", pointerEvents: "none", zIndex: 0 },
  notification: { position: "fixed", top: 20, right: 20, padding: "14px 24px", borderRadius: 12, color: "white", fontWeight: 700, fontSize: 14, zIndex: 1000, boxShadow: "0 8px 30px rgba(0,0,0,0.2)" },
  breadcrumb: { maxWidth: 1200, margin: "0 auto", padding: "12px clamp(12px, 3vw, 24px)", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", position: "relative", zIndex: 1 },
  crumbItem: { cursor: "pointer", color: "#1B3A4B", fontWeight: 600, fontSize: 13, padding: "4px 10px", borderRadius: 6, background: "rgba(200,149,108,0.1)" },
  crumbActive: { color: "#C8956C", fontWeight: 700, fontSize: 13, padding: "4px 10px" },
  crumbSep: { color: "#C8956C", fontWeight: 700, fontSize: 18 },
  main: { maxWidth: 1200, margin: "0 auto", padding: "20px clamp(12px, 3vw, 24px)", position: "relative", zIndex: 1, minHeight: "60vh" },
  hero: { textAlign: "center", padding: "clamp(32px, 6vw, 60px) clamp(16px, 3vw, 24px) clamp(28px, 5vw, 48px)", background: "linear-gradient(135deg, #1B3A4B 0%, #274555 100%)", borderRadius: 24, marginBottom: 44 },
  heroBadge: { display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#F5E6D3", padding: "8px 22px", borderRadius: 50, fontSize: 13, fontWeight: 700, marginBottom: 20, border: "1px solid rgba(255,255,255,0.1)" },
  heroTitle: { fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 900, color: "#fff", margin: "0 0 14px", lineHeight: 1.15, letterSpacing: "-1px", textShadow: "0 2px 10px rgba(0,0,0,0.15)" },
  heroSub: { fontSize: "clamp(14px, 2.5vw, 16px)", color: "rgba(255,255,255,0.75)", maxWidth: 620, margin: "0 auto 10px", lineHeight: 1.6 },
  heroArabic: { fontSize: "clamp(16px, 3vw, 20px)", color: "#C8956C", fontWeight: 700, margin: "0 0 28px" },
  searchBox: { display: "flex", alignItems: "center", maxWidth: 520, margin: "0 auto", background: "white", borderRadius: 50, padding: "6px 8px 6px 20px", boxShadow: "0 8px 30px rgba(0,0,0,0.15)", border: "none" },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: 15, padding: "11px 0", background: "transparent", color: "#1B3A4B", fontFamily: "inherit" },
  clearBtn: { background: "#e8ddd0", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#1B3A4B" },
  degreePreview: { display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", margin: "32px 0 40px" },
  degreePreviewCard: { background: "white", borderRadius: 16, padding: "22px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, borderTop: "4px solid", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", minWidth: 135, cursor: "default", transition: "transform 0.2s ease, box-shadow 0.2s ease" },
  statsWrapper: { background: "linear-gradient(135deg, rgba(27,58,75,0.05), rgba(200,149,108,0.08))", borderRadius: 20, padding: "28px 20px", marginBottom: 44 },
  statsRow: { display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" },
  statCard: { background: "white", borderRadius: 14, padding: "18px 24px", textAlign: "left", boxShadow: "0 2px 10px rgba(0,0,0,0.04)", borderLeft: "3px solid #C8956C", minWidth: 110, flex: "1 1 0" },
  statIcon: { fontSize: 24, marginBottom: 4, display: "block" },
  statNum: { display: "block", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, color: "#C8956C" },
  statLabel: { fontSize: 12, color: "#777", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" },
  secTitle: { fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 800, color: "#1B3A4B", marginBottom: 20 },
  countryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 14, marginBottom: 36 },
  countryCard: { background: "white", borderRadius: 18, padding: "22px 14px", textAlign: "center", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 3px 16px rgba(0,0,0,0.05)", border: "1px solid #ede5da" },
  countryFlag: { fontSize: 42, display: "block", marginBottom: 8 },
  countryName: { fontSize: 13, fontWeight: 800, color: "#1B3A4B", margin: "0 0 4px" },
  countryInfo: { fontSize: 12, color: "#888", margin: 0 },
  countryMats: { fontSize: 11, color: "#C8956C", fontWeight: 700, marginTop: 6, display: "inline-block", background: "#C8956C15", padding: "2px 10px", borderRadius: 20 },
  howSection: { background: "white", borderRadius: 24, padding: "32px 24px", border: "1px solid #ede5da", marginBottom: 44, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" },
  howGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 },
  howCard: { background: "#FAF6F1", borderRadius: 16, padding: "24px 20px", textAlign: "center", position: "relative" },
  howStep: { position: "absolute", top: 12, left: 16, background: "linear-gradient(135deg, #C8956C, #B07D55)", color: "white", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, boxShadow: "0 3px 10px rgba(200,149,108,0.3)" },
  viewHeader: { display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" },
  viewTitle: { fontSize: "clamp(20px, 3.5vw, 26px)", fontWeight: 900, color: "#1B3A4B", margin: 0, letterSpacing: "-0.5px" },
  viewSub: { fontSize: 14, color: "#777", margin: "4px 0 0" },
  uniGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 },
  uniCard: { background: "white", borderRadius: 14, padding: "24px 22px", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", border: "2px solid transparent", display: "flex", flexDirection: "column", gap: 6, position: "relative" },
  uniIcon: { fontSize: 30 },
  uniName: { fontSize: 16, fontWeight: 800, color: "#1B3A4B", margin: 0 },
  uniDegrees: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 },
  uniDegreeDot: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 },
  uniArrow: { position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", fontSize: 22, color: "#C8956C", fontWeight: 700 },
  degreeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18 },
  degreeCard: { background: "white", borderRadius: 18, padding: "32px 24px", textAlign: "center", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", borderTop: "4px solid" },
  degreeBadge: { display: "inline-block", padding: "4px 14px", borderRadius: 20, fontSize: 13, fontWeight: 700 },
  semGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 14 },
  semCard: { background: "white", borderRadius: 14, padding: "24px 18px", textAlign: "center", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", borderLeft: "4px solid" },
  semNum: { fontSize: 32, fontWeight: 900, lineHeight: 1 },
  facultyGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 },
  facultyCard: { background: "white", borderRadius: 18, padding: "28px 20px", textAlign: "center", cursor: "pointer", transition: "all 0.3s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "2px solid transparent", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  facultyIcon: { fontSize: 42, display: "block", marginBottom: 6 },
  facultyName: { margin: "0 0 2px", fontWeight: 800, color: "#1B3A4B", fontSize: 15, lineHeight: 1.3 },
  facultyNameAr: { margin: 0, fontSize: 13, color: "#888", fontWeight: 600 },
  facultyDesc: { margin: "4px 0 8px", fontSize: 12, color: "#aaa", lineHeight: 1.4 },
  facultyBadge: { display: "inline-block", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, marginTop: 6 },
  uploadBtn: { background: "linear-gradient(135deg, #C8956C, #B07D55)", color: "white", border: "none", padding: "11px 24px", borderRadius: 50, fontWeight: 700, fontSize: 14, cursor: "pointer", marginLeft: "auto", transition: "all 0.2s", boxShadow: "0 4px 15px rgba(200,149,108,0.3)", fontFamily: "inherit" },
  filterRow: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  filterBtn: { padding: "7px 16px", borderRadius: 50, border: "2px solid #ddd", background: "white", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit", color: "#555", transition: "all 0.2s", minHeight: 44 },
  filterActive: { background: "#1B3A4B", color: "white", borderColor: "#1B3A4B" },
  matList: { display: "flex", flexDirection: "column", gap: 12 },
  matCard: { background: "white", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.05)", borderLeft: "4px solid #e0d5c8", transition: "all 0.3s cubic-bezier(.4,0,.2,1)", flexWrap: "wrap", cursor: "default" },
  matIcon: { width: 56, height: 56, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 },
  matInfo: { flex: 1, minWidth: 180 },
  matTitle: { fontSize: 16, fontWeight: 800, color: "#1B3A4B", margin: "0 0 4px", lineHeight: 1.3 },
  matSubject: { fontSize: 12, color: "#888", margin: "0 0 3px" },
  matFaculty: { fontSize: 11, color: "#C8956C", margin: "0 0 3px", fontWeight: 600 },
  matDesc: { fontSize: 12, color: "#999", margin: "0 0 6px" },
  matMeta: { display: "flex", alignItems: "center", gap: 10 },
  matBadge: { color: "white", padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 700 },
  matDate: { fontSize: 11, color: "#aaa" },
  matActions: { display: "flex", gap: 8, alignItems: "center", flexShrink: 0, flexDirection: "column" },
  dlBtn: { background: "linear-gradient(135deg, #1B3A4B, #274555)", color: "white", padding: "10px 22px", borderRadius: 50, textDecoration: "none", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(27,58,75,0.2)", transition: "all 0.2s", minHeight: 44 },
  delBtn: { background: "transparent", border: "1px solid #e0d5c8", borderRadius: "50%", width: 44, height: 44, minHeight: 44, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
  editBtn: { background: "transparent", border: "1px solid #e0d5c8", borderRadius: "50%", width: 44, height: 44, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
  shareBtn: { background: "transparent", border: "1px solid #e0d5c8", borderRadius: "50%", width: 44, height: 44, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
  sharePopup: { position: "absolute", top: "calc(100% + 6px)", minWidth: 180, background: "white", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", border: "1px solid #ede5da", zIndex: 100, overflow: "hidden" },
  shareOption: { display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#1B3A4B", textDecoration: "none", fontFamily: "inherit", transition: "background 0.15s" },
  confirmModal: { background: "white", borderRadius: 18, padding: "32px 28px", textAlign: "center", maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
  confirmIcon: { fontSize: 48, marginBottom: 12 },
  confirmTitle: { fontSize: 20, fontWeight: 900, color: "#1B3A4B", margin: "0 0 10px" },
  confirmMsg: { fontSize: 14, color: "#666", margin: "0 0 24px", lineHeight: 1.5 },
  confirmActions: { display: "flex", gap: 10, justifyContent: "center" },
  cancelBtn: { padding: "10px 24px", borderRadius: 10, border: "2px solid #e0d5c8", background: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#555", fontFamily: "inherit" },
  confirmDeleteBtn: { padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #e74c3c, #c0392b)", color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit", boxShadow: "0 4px 15px rgba(231,76,60,0.3)" },
  myGroupSection: { marginBottom: 20, background: "white", borderRadius: 18, border: "1px solid #e8e0d6", overflow: "hidden", boxShadow: "0 2px 14px rgba(0,0,0,0.05)" },
  myGroupHeader: { display: "flex", alignItems: "center", gap: 12, padding: "18px 22px", cursor: "pointer", background: "#FAF6F1", borderBottom: "1px solid #ede5da", transition: "background 0.2s", userSelect: "none" },
  myGroupTitle: { fontSize: 17, fontWeight: 800, color: "#1B3A4B", flex: 1, display: "flex", alignItems: "center", gap: 10 },
  myGroupCount: { fontSize: 12, fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #C8956C, #B07D55)", padding: "4px 14px", borderRadius: 20, boxShadow: "0 2px 6px rgba(200,149,108,0.25)" },
  myGroupChevron: { fontSize: 16, color: "#1B3A4B", fontWeight: 700, width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center" },
  myGroupBody: { padding: "16px 20px" },
  mySubGroup: { marginBottom: 20 },
  mySubGroupHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 8, paddingLeft: 12, borderBottom: "2px solid #f0e8df", borderLeft: "3px solid #C8956C" },
  mySubGroupTitle: { fontSize: 15, fontWeight: 700, color: "#444" },
  empty: { textAlign: "center", padding: "50px 20px", color: "#888" },
  myMatBanner: { background: "linear-gradient(135deg, #1B3A4B 0%, #1a6b6a 100%)", borderRadius: 20, padding: "28px 30px", marginBottom: 28, color: "white", position: "relative", overflow: "hidden" },
  myMatBannerTitle: { fontSize: 24, fontWeight: 900, margin: "0 0 4px", color: "white", letterSpacing: "-0.3px" },
  myMatBannerSub: { fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 },
  myMatStatsRow: { display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" },
  myMatStatPill: { padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 6 },
  myEmptyCard: { textAlign: "center", padding: "48px 24px", border: "2px dashed #d4cdc4", borderRadius: 20, background: "#FDFBF9", margin: "20px 0" },
  recentSection: { marginBottom: 44 },
  recentHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 10 },
  recentGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 },
  recentCard: { background: "white", borderRadius: 18, padding: "20px 22px", boxShadow: "0 2px 14px rgba(0,0,0,0.05)", border: "1px solid #ede5da", transition: "all 0.3s cubic-bezier(.4,0,.2,1)", cursor: "pointer", display: "flex", flexDirection: "column", gap: 12, position: "relative", overflow: "hidden" },
  recentCardTop: { display: "flex", alignItems: "center", gap: 14 },
  recentCardIcon: { width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 },
  recentCardInfo: { flex: 1, minWidth: 0 },
  recentCardTitle: { fontSize: 15, fontWeight: 800, color: "#1B3A4B", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  recentCardSubject: { fontSize: 12, color: "#888", margin: "2px 0 0" },
  recentCardMeta: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  recentCardLocation: { fontSize: 11, color: "#999", display: "flex", alignItems: "center", gap: 4 },
  viewAllBtn: { background: "linear-gradient(135deg, #1B3A4B, #274555)", color: "white", border: "none", padding: "9px 22px", borderRadius: 50, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(27,58,75,0.2)", transition: "all 0.2s", textDecoration: "none" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20, backdropFilter: "blur(4px)" },
  modal: { background: "white", borderRadius: 24, width: "100%", maxWidth: 520, maxHeight: "90dvh", overflow: "hidden", boxShadow: "0 25px 80px rgba(0,0,0,0.25)", display: "flex", flexDirection: "column" },
  modalHead: { background: "linear-gradient(135deg, #1B3A4B 0%, #1a6b6a 100%)", padding: "24px 28px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" },
  modalTitle: { fontSize: 20, fontWeight: 900, color: "white", margin: 0, display: "flex", alignItems: "center", gap: 10 },
  modalX: { background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 18, cursor: "pointer", fontWeight: 700, color: "white", transition: "background 0.2s", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" },
  modalBody: { padding: "22px 28px 28px", overflowY: "auto", flex: 1 },
  modalCtx: { fontSize: 12, color: "#666", background: "linear-gradient(135deg, #f8f4ef, #FAF6F1)", padding: "12px 16px", borderRadius: 12, marginBottom: 20, border: "1px solid #ede5da", display: "flex", alignItems: "center", gap: 8, lineHeight: 1.5 },
  label: { display: "block", fontSize: 13, fontWeight: 700, color: "#1B3A4B", marginBottom: 6, marginTop: 18, letterSpacing: "0.2px" },
  input: { width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid #e8ddd0", fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "#FDFBF9", transition: "border-color 0.2s, box-shadow 0.2s" },
  typeSelector: { display: "flex", gap: 10, flexWrap: "wrap" },
  typeOpt: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 18px", borderRadius: 14, border: "2px solid #e8ddd0", cursor: "pointer", background: "white", fontFamily: "inherit", transition: "all 0.2s", minWidth: 72 },
  submitBtn: { width: "100%", background: "linear-gradient(135deg, #1B3A4B, #1a6b6a)", color: "white", border: "none", padding: "15px", borderRadius: 14, fontWeight: 800, fontSize: 15, cursor: "pointer", marginTop: 24, fontFamily: "inherit", boxShadow: "0 4px 20px rgba(27,58,75,0.3)", transition: "all 0.2s", letterSpacing: "0.3px" },
  footer: { background: "linear-gradient(135deg, #1B3A4B, #0F2530)", padding: "32px 24px", marginTop: 50, position: "relative", zIndex: 1, textAlign: "center" },
  footerText: { color: "#F5E6D3", fontSize: 14, fontWeight: 600, margin: "0 0 6px" },
  footerAr: { color: "#C8956C", fontSize: 15, fontWeight: 700, margin: "0 0 14px" },
  footerLinks: { display: "flex", justifyContent: "center", gap: 14, alignItems: "center", flexWrap: "wrap" },
  footerLink: { color: "#8BB8CC", textDecoration: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  duplicateModal: { background: "white", borderRadius: 18, padding: "32px 28px", textAlign: "center", maxWidth: 480, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "80vh", overflow: "auto" },
  duplicateIcon: { fontSize: 48, marginBottom: 12 },
  duplicateList: { textAlign: "left", margin: "16px 0 24px", maxHeight: 200, overflowY: "auto", borderRadius: 10, border: "1px solid #ede5da", background: "#FAF6F1" },
  duplicateItem: { display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: "1px solid #ede5da" },
  duplicateItemIcon: { width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 },
  duplicateItemInfo: { display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: 0 },
  duplicateItemTitle: { fontSize: 13, fontWeight: 700, color: "#1B3A4B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  duplicateItemMeta: { fontSize: 11, color: "#888" },
  duplicateConfirmBtn: { padding: "10px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #E67E22, #D35400)", color: "white", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit", boxShadow: "0 4px 15px rgba(230,126,34,0.3)" },
  subjectGroupControls: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 },
  subjectGroupLabel: { fontSize: 14, fontWeight: 700, color: "#1B3A4B" },
  groupToggleBtn: { padding: "4px 12px", borderRadius: 20, border: "1px solid #e0d5c8", background: "white", cursor: "pointer", fontWeight: 600, fontSize: 11, fontFamily: "inherit", color: "#777" },
  showAllBtn: { display: "block", margin: "20px auto 0", padding: "10px 32px", borderRadius: 50, border: "2px solid #C8956C", background: "transparent", color: "#C8956C", cursor: "pointer", fontWeight: 700, fontSize: 14, fontFamily: "inherit", transition: "all 0.2s" },
  // --- Redesigned homepage styles ---
  sectionBlock: { marginBottom: 48 },
  sectionBlockAlt: { marginBottom: 48, background: "white", borderRadius: 24, padding: "40px clamp(16px, 3vw, 32px)", border: "1px solid #ede5da", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" },
  sectionHead: { textAlign: "center", marginBottom: 28 },
  sectionHeadTitle: { fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 900, color: "#1B3A4B", margin: "0 0 8px", letterSpacing: "-0.5px", lineHeight: 1.2 },
  sectionHeadSub: { fontSize: "clamp(13px, 2vw, 15px)", color: "#888", margin: "0 auto", maxWidth: 560, lineHeight: 1.6 },
  sectionDivider: { width: 60, height: 3, background: "linear-gradient(90deg, #C8956C, #1B3A4B)", borderRadius: 3, margin: "12px auto 0" },
  heroQuickNav: { display: "flex", justifyContent: "center", gap: 10, marginTop: 24, flexWrap: "wrap" },
  heroQuickPill: { display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 50, background: "rgba(255,255,255,0.1)", color: "#F5E6D3", border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "inherit", transition: "all 0.25s", backdropFilter: "blur(4px)" },
  heroInlineStats: { display: "flex", justifyContent: "center", gap: 0, marginTop: 32, flexWrap: "wrap" },
  heroInlineStat: { display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "0 clamp(14px, 3vw, 28px)" },
  heroInlineStatNum: { fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, color: "#F5E6D3", lineHeight: 1.1 },
  heroInlineStatLabel: { fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" },
  howSectionRedesign: { background: "linear-gradient(180deg, #FDFBF9 0%, #F9F5F0 100%)", borderRadius: 24, padding: "48px clamp(20px, 3vw, 40px)", border: "1px solid #ede5da", marginBottom: 48, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" },
  howCardRedesign: { background: "white", borderRadius: 20, padding: "32px 20px 28px", textAlign: "center", position: "relative", border: "1px solid #f0ebe4", transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", cursor: "default" },
  countrySectionWrap: { marginBottom: 48 },
  countrySearchRow: { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 },
  countrySearchInner: { display: "flex", alignItems: "center", maxWidth: 420, width: "100%", background: "white", borderRadius: 50, padding: "6px 8px 6px 20px", border: "2px solid #e8ddd0", transition: "border-color 0.2s, box-shadow 0.2s" },
  // === NEW FEATURE STYLES ===
  notifDropdown: { position: "absolute", top: "calc(100% + 8px)", right: 0, width: 340, background: "white", borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", border: "1px solid #ede5da", zIndex: 100, overflow: "hidden" },
  notifItem: { padding: "12px 16px", borderBottom: "1px solid #f5f0eb", transition: "background 0.15s", cursor: "default" },
  notifItemUnread: { background: "#FEF9F3", borderLeft: "3px solid #C8956C" },
  starBtn: { width: 40, height: 40, borderRadius: 10, border: "2px solid #e8ddd0", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", background: "white", fontFamily: "inherit" },
  starActive: { background: "#FEF3C7", borderColor: "#F59E0B", transform: "scale(1.1)" },
  starInactive: { opacity: 0.4 },
  bookmarkBtn: { background: "transparent", border: "1px solid #e0d5c8", borderRadius: "50%", width: 44, height: 44, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
  bookmarkActive: { background: "#FEF3C7", borderColor: "#F59E0B" },
  leaderRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, background: "#FAF6F1", transition: "background 0.15s" },
  leaderRowFirst: { background: "linear-gradient(135deg, #FEF3C7, #FDE68A)", border: "1px solid #F59E0B40" },
  leaderRank: { fontWeight: 900, fontSize: 18, width: 32, textAlign: "center", flexShrink: 0 },
  leaderAvatar: { width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 },
  leaderPoints: { fontSize: 13, fontWeight: 800, color: "#C8956C", whiteSpace: "nowrap" },
  counterBadge: { fontSize: 11, color: "#888", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 3 },
  previewFrame: { width: "100%", height: 420, border: "none", borderRadius: "0 0 24px 24px" },
  // Recent Filter Bar
  recentFilterBar: { display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center", position: "relative" },
  recentFilterChip: { position: "relative", padding: "7px 16px", borderRadius: 50, border: "2px solid #e0d5c8", background: "white", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit", color: "#555", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", minHeight: 38, userSelect: "none" },
  recentFilterChipActive: { background: "#1B3A4B", color: "white", borderColor: "#1B3A4B" },
  recentFilterChipOpen: { borderColor: "#C8956C", boxShadow: "0 0 0 3px rgba(200,149,108,0.15)" },
  recentFilterDropdown: { position: "absolute", top: "calc(100% + 6px)", left: 0, minWidth: 220, maxHeight: 280, overflowY: "auto", background: "white", borderRadius: 14, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", border: "1px solid #ede5da", zIndex: 120, padding: "6px 0" },
  recentFilterDropdownRTL: { left: "auto", right: 0 },
  recentFilterOption: { display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "9px 16px", border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#1B3A4B", fontFamily: "inherit", transition: "background 0.15s", textAlign: "start" },
  recentFilterOptionActive: { background: "#f0ebe4", fontWeight: 800 },
  recentFilterSearch: { width: "calc(100% - 20px)", margin: "6px 10px", padding: "8px 12px", borderRadius: 10, border: "2px solid #e8ddd0", fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: "#FDFBF9" },
  recentFilterClearAll: { padding: "7px 16px", borderRadius: 50, border: "2px solid #e74c3c", background: "white", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "inherit", color: "#e74c3c", transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", minHeight: 38 },
  recentFilterBadge: { background: "#C8956C", color: "white", fontSize: 10, fontWeight: 800, borderRadius: 10, padding: "1px 7px", lineHeight: "16px" },
  recentFilterLoadingOverlay: { position: "absolute", inset: 0, background: "rgba(250,246,241,0.7)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10, backdropFilter: "blur(1px)" },
};
