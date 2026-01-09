'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import {
  CheckCircle,
  Building2,
  Building,
  MapPin,
  Search,
  AlertTriangle,
  Info,
  ExternalLink,
  FileCheck,
  Phone
} from 'lucide-react';

interface University {
  id: number;
  nameEn: string;
  nameTr: string;
  nameAr: string;
  city: string;
  type: 'public' | 'private';
}

// Universities commonly recognized by Sudan Ministry of Higher Education
const recognizedUniversities: University[] = [
  // Top Public Universities (Generally all public universities are recognized)
  { id: 1, nameEn: "Istanbul University", nameTr: "İstanbul Üniversitesi", nameAr: "جامعة اسطنبول", city: "Istanbul", type: "public" },
  { id: 2, nameEn: "Ankara University", nameTr: "Ankara Üniversitesi", nameAr: "جامعة أنقرة", city: "Ankara", type: "public" },
  { id: 3, nameEn: "Hacettepe University", nameTr: "Hacettepe Üniversitesi", nameAr: "جامعة حجي تبه", city: "Ankara", type: "public" },
  { id: 4, nameEn: "Middle East Technical University", nameTr: "Orta Doğu Teknik Üniversitesi", nameAr: "جامعة الشرق الأوسط التقنية", city: "Ankara", type: "public" },
  { id: 5, nameEn: "Boğaziçi University", nameTr: "Boğaziçi Üniversitesi", nameAr: "جامعة بوغازيتشي", city: "Istanbul", type: "public" },
  { id: 6, nameEn: "Istanbul Technical University", nameTr: "İstanbul Teknik Üniversitesi", nameAr: "جامعة اسطنبول التقنية", city: "Istanbul", type: "public" },
  { id: 7, nameEn: "Ege University", nameTr: "Ege Üniversitesi", nameAr: "جامعة إيجة", city: "Izmir", type: "public" },
  { id: 8, nameEn: "Gazi University", nameTr: "Gazi Üniversitesi", nameAr: "جامعة غازي", city: "Ankara", type: "public" },
  { id: 9, nameEn: "Marmara University", nameTr: "Marmara Üniversitesi", nameAr: "جامعة مرمرة", city: "Istanbul", type: "public" },
  { id: 10, nameEn: "Dokuz Eylül University", nameTr: "Dokuz Eylül Üniversitesi", nameAr: "جامعة دوكوز أيلول", city: "Izmir", type: "public" },
  { id: 11, nameEn: "Atatürk University", nameTr: "Atatürk Üniversitesi", nameAr: "جامعة أتاتورك", city: "Erzurum", type: "public" },
  { id: 12, nameEn: "Anadolu University", nameTr: "Anadolu Üniversitesi", nameAr: "جامعة الأناضول", city: "Eskisehir", type: "public" },
  { id: 13, nameEn: "Selçuk University", nameTr: "Selçuk Üniversitesi", nameAr: "جامعة سلجوق", city: "Konya", type: "public" },
  { id: 14, nameEn: "Erciyes University", nameTr: "Erciyes Üniversitesi", nameAr: "جامعة إرجيس", city: "Kayseri", type: "public" },
  { id: 15, nameEn: "Çukurova University", nameTr: "Çukurova Üniversitesi", nameAr: "جامعة تشوكوروفا", city: "Adana", type: "public" },
  { id: 16, nameEn: "Bursa Uludağ University", nameTr: "Bursa Uludağ Üniversitesi", nameAr: "جامعة بورصة أولوداغ", city: "Bursa", type: "public" },
  { id: 17, nameEn: "Ondokuz Mayıs University", nameTr: "Ondokuz Mayıs Üniversitesi", nameAr: "جامعة أون دوكوز مايس", city: "Samsun", type: "public" },
  { id: 18, nameEn: "Karadeniz Technical University", nameTr: "Karadeniz Teknik Üniversitesi", nameAr: "جامعة كارادنيز التقنية", city: "Trabzon", type: "public" },
  { id: 19, nameEn: "Akdeniz University", nameTr: "Akdeniz Üniversitesi", nameAr: "جامعة أكدنيز", city: "Antalya", type: "public" },
  { id: 20, nameEn: "Sakarya University", nameTr: "Sakarya Üniversitesi", nameAr: "جامعة سكاريا", city: "Sakarya", type: "public" },
  { id: 21, nameEn: "Kocaeli University", nameTr: "Kocaeli Üniversitesi", nameAr: "جامعة كوجالي", city: "Kocaeli", type: "public" },
  { id: 22, nameEn: "Gaziantep University", nameTr: "Gaziantep Üniversitesi", nameAr: "جامعة غازي عنتاب", city: "Gaziantep", type: "public" },
  { id: 23, nameEn: "Fırat University", nameTr: "Fırat Üniversitesi", nameAr: "جامعة فرات", city: "Elazig", type: "public" },
  { id: 24, nameEn: "İnönü University", nameTr: "İnönü Üniversitesi", nameAr: "جامعة إينونو", city: "Malatya", type: "public" },
  { id: 25, nameEn: "Süleyman Demirel University", nameTr: "Süleyman Demirel Üniversitesi", nameAr: "جامعة سليمان ديميريل", city: "Isparta", type: "public" },

  // Well-established Private Universities (commonly recognized)
  { id: 26, nameEn: "Bilkent University", nameTr: "Bilkent Üniversitesi", nameAr: "جامعة بيلكنت", city: "Ankara", type: "private" },
  { id: 27, nameEn: "Koç University", nameTr: "Koç Üniversitesi", nameAr: "جامعة كوتش", city: "Istanbul", type: "private" },
  { id: 28, nameEn: "Sabancı University", nameTr: "Sabancı Üniversitesi", nameAr: "جامعة صبانجي", city: "Istanbul", type: "private" },
  { id: 29, nameEn: "Bahçeşehir University", nameTr: "Bahçeşehir Üniversitesi", nameAr: "جامعة بهتشه شهير", city: "Istanbul", type: "private" },
  { id: 30, nameEn: "Başkent University", nameTr: "Başkent Üniversitesi", nameAr: "جامعة باشكنت", city: "Ankara", type: "private" },
  { id: 31, nameEn: "Yeditepe University", nameTr: "Yeditepe Üniversitesi", nameAr: "جامعة يدي تبه", city: "Istanbul", type: "private" },
  { id: 32, nameEn: "Istanbul Bilgi University", nameTr: "İstanbul Bilgi Üniversitesi", nameAr: "جامعة اسطنبول بيلجي", city: "Istanbul", type: "private" },
  { id: 33, nameEn: "Atılım University", nameTr: "Atılım Üniversitesi", nameAr: "جامعة أتيليم", city: "Ankara", type: "private" },
  { id: 34, nameEn: "TOBB University of Economics and Technology", nameTr: "TOBB Ekonomi ve Teknoloji Üniversitesi", nameAr: "جامعة توب للاقتصاد والتكنولوجيا", city: "Ankara", type: "private" },
  { id: 35, nameEn: "Özyeğin University", nameTr: "Özyeğin Üniversitesi", nameAr: "جامعة أوزيغين", city: "Istanbul", type: "private" },
  { id: 36, nameEn: "Istanbul Medipol University", nameTr: "İstanbul Medipol Üniversitesi", nameAr: "جامعة اسطنبول ميديبول", city: "Istanbul", type: "private" },
  { id: 37, nameEn: "Bezmiâlem Foundation University", nameTr: "Bezmiâlem Vakıf Üniversitesi", nameAr: "جامعة بزم عالم الوقفية", city: "Istanbul", type: "private" },
  { id: 38, nameEn: "Istanbul Aydın University", nameTr: "İstanbul Aydın Üniversitesi", nameAr: "جامعة اسطنبول آيدن", city: "Istanbul", type: "private" },
  { id: 39, nameEn: "Kadir Has University", nameTr: "Kadir Has Üniversitesi", nameAr: "جامعة قادر هاس", city: "Istanbul", type: "private" },
  { id: 40, nameEn: "Yaşar University", nameTr: "Yaşar Üniversitesi", nameAr: "جامعة يشار", city: "Izmir", type: "private" },
];

// Get unique cities for filter
const cities = [...new Set(recognizedUniversities.map(u => u.city))].sort();

export default function RecognizedSudanPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'' | 'public' | 'private'>('');

  const filteredUniversities = recognizedUniversities.filter(university => {
    const matchesSearch = searchTerm === '' ||
      university.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.nameTr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.nameAr.includes(searchTerm) ||
      university.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === '' || university.type === selectedType;

    return matchesSearch && matchesType;
  });

  const publicCount = recognizedUniversities.filter(u => u.type === 'public').length;
  const privateCount = recognizedUniversities.filter(u => u.type === 'private').length;

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16 md:py-24">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isRTL ? 'الجامعات التركية المعترف بها في السودان' : 'Turkish Universities Recognized in Sudan'}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
              {isRTL
                ? `${recognizedUniversities.length} جامعة تركية معترف بها من وزارة التعليم العالي السودانية`
                : `${recognizedUniversities.length} Turkish universities recognized by Sudan Ministry of Higher Education`}
            </p>
          </div>
        </Container>
      </section>

      {/* Important Notice */}
      <section className="py-6 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
        <Container>
          <div className="flex items-start gap-3 max-w-4xl mx-auto">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                {isRTL ? 'ملاحظة هامة' : 'Important Notice'}
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                {isRTL
                  ? 'هذه القائمة إرشادية وقد تتغير. يرجى التأكد من الاعتراف بالجامعة من خلال التواصل مع وزارة التعليم العالي السودانية قبل التسجيل.'
                  : 'This list is indicative and may change. Please verify university recognition by contacting the Sudan Ministry of Higher Education before enrollment.'}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{recognizedUniversities.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{isRTL ? 'إجمالي الجامعات' : 'Total Universities'}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{publicCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{isRTL ? 'جامعات حكومية' : 'Public Universities'}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{privateCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{isRTL ? 'جامعات خاصة' : 'Private Universities'}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{cities.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{isRTL ? 'مدن تركية' : 'Turkish Cities'}</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <Container>
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن جامعة...' : 'Search for a university...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
              />
            </div>

            {/* Type Filter */}
            <div className="md:w-48">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as '' | 'public' | 'private')}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">{isRTL ? 'جميع الأنواع' : 'All Types'}</option>
                <option value="public">{isRTL ? 'حكومية' : 'Public'}</option>
                <option value="private">{isRTL ? 'خاصة' : 'Private'}</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
            {isRTL
              ? `عرض ${filteredUniversities.length} من ${recognizedUniversities.length} جامعة`
              : `Showing ${filteredUniversities.length} of ${recognizedUniversities.length} universities`}
          </div>
        </Container>
      </section>

      {/* Universities Grid */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {filteredUniversities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredUniversities.map((university) => (
                  <div
                    key={university.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        university.type === 'public'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          : 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                      }`}>
                        {university.type === 'public'
                          ? (isRTL ? 'حكومية' : 'Public')
                          : (isRTL ? 'خاصة' : 'Private')
                        }
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-1">
                      {isRTL ? university.nameAr : university.nameEn}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {university.nameTr}
                    </p>
                    {!isRTL && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-2" dir="rtl">
                        {university.nameAr}
                      </p>
                    )}
                    {isRTL && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                        {university.nameEn}
                      </p>
                    )}

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 me-1" />
                      {university.city}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {isRTL ? 'لم يتم العثور على نتائج' : 'No results found'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'حاول تعديل معايير البحث'
                    : 'Try adjusting your search criteria'}
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* How to Verify Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'كيفية التحقق من الاعتراف' : 'How to Verify Recognition'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
                  <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">
                  {isRTL ? 'اتصل بالوزارة' : 'Contact the Ministry'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'تواصل مع وزارة التعليم العالي السودانية للتأكد من الاعتراف'
                    : 'Contact Sudan Ministry of Higher Education to confirm recognition'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
                  <FileCheck className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">
                  {isRTL ? 'احصل على خطاب رسمي' : 'Get Official Letter'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'اطلب خطاب اعتراف رسمي من الوزارة قبل التسجيل'
                    : 'Request an official recognition letter from the Ministry before enrollment'}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
                  <Info className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">
                  {isRTL ? 'تحقق من التخصص' : 'Verify the Program'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'تأكد من اعتراف التخصص المحدد وليس الجامعة فقط'
                    : 'Ensure the specific program is recognized, not just the university'}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tips for Sudanese Students */}
      <section className="py-12 md:py-16 bg-blue-50 dark:bg-blue-900/20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-8">
              {isRTL ? 'نصائح للطلاب السودانيين' : 'Tips for Sudanese Students'}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                    {isRTL ? 'الجامعات الحكومية' : 'Public Universities'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'جميع الجامعات الحكومية التركية معترف بها عموماً في السودان'
                    : 'All Turkish public universities are generally recognized in Sudan'}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                    {isRTL ? 'الجامعات الخاصة' : 'Private Universities'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'تحقق من الجامعات الخاصة قبل التسجيل - ليست جميعها معترف بها'
                    : 'Verify private universities before enrollment - not all are recognized'}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                    {isRTL ? 'التخصصات الطبية' : 'Medical Programs'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'التخصصات الطبية تتطلب اعتماداً إضافياً من المجلس الطبي السوداني'
                    : 'Medical programs require additional accreditation from Sudan Medical Council'}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                    {isRTL ? 'توثيق الشهادة' : 'Certificate Authentication'}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isRTL
                    ? 'احتفظ بجميع الوثائق الأصلية لتصديق الشهادة عند العودة'
                    : 'Keep all original documents for certificate authentication upon return'}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100 dark:bg-gray-800/50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isRTL
                ? 'المعلومات المقدمة هنا للإرشاد فقط. يرجى التحقق من وزارة التعليم العالي السودانية للحصول على القائمة الرسمية المحدثة.'
                : 'Information provided here is for guidance only. Please verify with Sudan Ministry of Higher Education for the official updated list.'}
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 dark:text-gray-400">
              <ExternalLink className="h-4 w-4" />
              <span>{isRTL ? 'آخر تحديث: 2025' : 'Last updated: 2025'}</span>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
