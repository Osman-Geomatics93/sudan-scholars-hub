'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Trophy, Medal, MapPin, Search, Building2, Building, ExternalLink } from 'lucide-react';

interface University {
  rank: number;
  nameEn: string;
  nameTr: string;
  nameAr: string;
  city: string;
  type: 'public' | 'private';
}

const universities: University[] = [
  { rank: 1, nameEn: "Anadolu University", nameTr: "Anadolu Üniversitesi", nameAr: "جامعة الأناضول", city: "Eskisehir", type: "public" },
  { rank: 2, nameEn: "Boğaziçi University", nameTr: "Boğaziçi Üniversitesi", nameAr: "جامعة بوغازيتشي", city: "Istanbul", type: "public" },
  { rank: 3, nameEn: "Middle East Technical University", nameTr: "Orta Doğu Teknik Üniversitesi", nameAr: "جامعة الشرق الأوسط التقنية", city: "Ankara", type: "public" },
  { rank: 4, nameEn: "Istanbul Technical University", nameTr: "İstanbul Teknik Üniversitesi", nameAr: "جامعة اسطنبول التقنية", city: "Istanbul", type: "public" },
  { rank: 5, nameEn: "Istanbul University", nameTr: "İstanbul Üniversitesi", nameAr: "جامعة اسطنبول", city: "Istanbul", type: "public" },
  { rank: 6, nameEn: "Bilkent University", nameTr: "Bilkent Üniversitesi", nameAr: "جامعة بيلكنت", city: "Ankara", type: "private" },
  { rank: 7, nameEn: "Hacettepe University", nameTr: "Hacettepe Üniversitesi", nameAr: "جامعة حجي تبه", city: "Ankara", type: "public" },
  { rank: 8, nameEn: "Ankara University", nameTr: "Ankara Üniversitesi", nameAr: "جامعة أنقرة", city: "Ankara", type: "public" },
  { rank: 9, nameEn: "Ege University", nameTr: "Ege Üniversitesi", nameAr: "جامعة إيجة", city: "Izmir", type: "public" },
  { rank: 10, nameEn: "Dokuz Eylül University", nameTr: "Dokuz Eylül Üniversitesi", nameAr: "جامعة دوكوز أيلول", city: "Izmir", type: "public" },
  { rank: 11, nameEn: "Koç University", nameTr: "Koç Üniversitesi", nameAr: "جامعة كوتش", city: "Istanbul", type: "private" },
  { rank: 12, nameEn: "Sabancı University", nameTr: "Sabancı Üniversitesi", nameAr: "جامعة صبانجي", city: "Istanbul", type: "private" },
  { rank: 13, nameEn: "Atatürk University", nameTr: "Atatürk Üniversitesi", nameAr: "جامعة أتاتورك", city: "Erzurum", type: "public" },
  { rank: 14, nameEn: "Marmara University", nameTr: "Marmara Üniversitesi", nameAr: "جامعة مرمرة", city: "Istanbul", type: "public" },
  { rank: 15, nameEn: "Gazi University", nameTr: "Gazi Üniversitesi", nameAr: "جامعة غازي", city: "Ankara", type: "public" },
  { rank: 16, nameEn: "Yıldız Technical University", nameTr: "Yıldız Teknik Üniversitesi", nameAr: "جامعة يلدز التقنية", city: "Istanbul", type: "public" },
  { rank: 17, nameEn: "Akdeniz University", nameTr: "Akdeniz Üniversitesi", nameAr: "جامعة أكدنيز", city: "Antalya", type: "public" },
  { rank: 18, nameEn: "Çukurova University", nameTr: "Çukurova Üniversitesi", nameAr: "جامعة تشوكوروفا", city: "Adana", type: "public" },
  { rank: 19, nameEn: "Selçuk University", nameTr: "Selçuk Üniversitesi", nameAr: "جامعة سلجوق", city: "Konya", type: "public" },
  { rank: 20, nameEn: "Bursa Uludağ University", nameTr: "Bursa Uludağ Üniversitesi", nameAr: "جامعة بورصة أولوداغ", city: "Bursa", type: "public" },
  { rank: 21, nameEn: "Sakarya University", nameTr: "Sakarya Üniversitesi", nameAr: "جامعة سكاريا", city: "Sakarya", type: "public" },
  { rank: 22, nameEn: "Erciyes University", nameTr: "Erciyes Üniversitesi", nameAr: "جامعة إرجيس", city: "Kayseri", type: "public" },
  { rank: 23, nameEn: "Istanbul Bilgi University", nameTr: "İstanbul Bilgi Üniversitesi", nameAr: "جامعة اسطنبول بيلجي", city: "Istanbul", type: "private" },
  { rank: 24, nameEn: "Ondokuz Mayıs University", nameTr: "Ondokuz Mayıs Üniversitesi", nameAr: "جامعة أون دوكوز مايس", city: "Samsun", type: "public" },
  { rank: 25, nameEn: "Pamukkale University", nameTr: "Pamukkale Üniversitesi", nameAr: "جامعة باموكالي", city: "Denizli", type: "public" },
  { rank: 26, nameEn: "Karadeniz Technical University", nameTr: "Karadeniz Teknik Üniversitesi", nameAr: "جامعة كارادنيز التقنية", city: "Trabzon", type: "public" },
  { rank: 27, nameEn: "Gaziantep University", nameTr: "Gaziantep Üniversitesi", nameAr: "جامعة غازي عنتاب", city: "Gaziantep", type: "public" },
  { rank: 28, nameEn: "Eskişehir Osmangazi University", nameTr: "Eskişehir Osmangazi Üniversitesi", nameAr: "جامعة إسكي شهير عثمان غازي", city: "Eskisehir", type: "public" },
  { rank: 29, nameEn: "Süleyman Demirel University", nameTr: "Süleyman Demirel Üniversitesi", nameAr: "جامعة سليمان ديميريل", city: "Isparta", type: "public" },
  { rank: 30, nameEn: "Çanakkale Onsekiz Mart University", nameTr: "Çanakkale Onsekiz Mart Üniversitesi", nameAr: "جامعة جناق قلعة 18 مارت", city: "Canakkale", type: "public" },
  { rank: 31, nameEn: "Kadir Has University", nameTr: "Kadir Has Üniversitesi", nameAr: "جامعة قادر هاس", city: "Istanbul", type: "private" },
  { rank: 32, nameEn: "Başkent University", nameTr: "Başkent Üniversitesi", nameAr: "جامعة باشكنت", city: "Ankara", type: "private" },
  { rank: 33, nameEn: "Aydın Adnan Menderes University", nameTr: "Aydın Adnan Menderes Üniversitesi", nameAr: "جامعة آيدن عدنان مندريس", city: "Aydin", type: "public" },
  { rank: 34, nameEn: "Sivas Cumhuriyet University", nameTr: "Sivas Cumhuriyet Üniversitesi", nameAr: "جامعة سيواس جمهوريت", city: "Sivas", type: "public" },
  { rank: 35, nameEn: "İnönü University", nameTr: "İnönü Üniversitesi", nameAr: "جامعة إينونو", city: "Malatya", type: "public" },
  { rank: 36, nameEn: "Yeditepe University", nameTr: "Yeditepe Üniversitesi", nameAr: "جامعة يدي تبه", city: "Istanbul", type: "private" },
  { rank: 37, nameEn: "Trakya University", nameTr: "Trakya Üniversitesi", nameAr: "جامعة تراكيا", city: "Edirne", type: "public" },
  { rank: 38, nameEn: "Istanbul Aydın University", nameTr: "İstanbul Aydın Üniversitesi", nameAr: "جامعة اسطنبول آيدن", city: "Istanbul", type: "private" },
  { rank: 39, nameEn: "Bahçeşehir University", nameTr: "Bahçeşehir Üniversitesi", nameAr: "جامعة بهتشه شهير", city: "Istanbul", type: "private" },
  { rank: 40, nameEn: "Balıkesir University", nameTr: "Balıkesir Üniversitesi", nameAr: "جامعة باليكسير", city: "Balikesir", type: "public" },
  { rank: 41, nameEn: "Kocaeli University", nameTr: "Kocaeli Üniversitesi", nameAr: "جامعة كوجالي", city: "Kocaeli", type: "public" },
  { rank: 42, nameEn: "Istanbul Medipol University", nameTr: "İstanbul Medipol Üniversitesi", nameAr: "جامعة اسطنبول ميديبول", city: "Istanbul", type: "private" },
  { rank: 43, nameEn: "Bolu Abant İzzet Baysal University", nameTr: "Bolu Abant İzzet Baysal Üniversitesi", nameAr: "جامعة بولو أبانت عزت بايسال", city: "Bolu", type: "public" },
  { rank: 44, nameEn: "Izmir Institute of Technology", nameTr: "İzmir Yüksek Teknoloji Enstitüsü", nameAr: "معهد إزمير للتكنولوجيا العالية", city: "Izmir", type: "public" },
  { rank: 45, nameEn: "Istanbul Kültür University", nameTr: "İstanbul Kültür Üniversitesi", nameAr: "جامعة اسطنبول كولتور", city: "Istanbul", type: "private" },
  { rank: 46, nameEn: "Muğla Sıtkı Koçman University", nameTr: "Muğla Sıtkı Koçman Üniversitesi", nameAr: "جامعة موغلا صدقي كوتشمان", city: "Mugla", type: "public" },
  { rank: 47, nameEn: "Fırat University", nameTr: "Fırat Üniversitesi", nameAr: "جامعة فرات", city: "Elazig", type: "public" },
  { rank: 48, nameEn: "Mersin University", nameTr: "Mersin Üniversitesi", nameAr: "جامعة مرسين", city: "Mersin", type: "public" },
  { rank: 49, nameEn: "Afyon Kocatepe University", nameTr: "Afyon Kocatepe Üniversitesi", nameAr: "جامعة أفيون كوجاتبه", city: "Afyonkarahisar", type: "public" },
  { rank: 50, nameEn: "TOBB University of Economics and Technology", nameTr: "TOBB Ekonomi ve Teknoloji Üniversitesi", nameAr: "جامعة توب للاقتصاد والتكنولوجيا", city: "Ankara", type: "private" },
];

// Get unique cities for filter
const cities = [...new Set(universities.map(u => u.city))].sort();

export default function UniversityRankingPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState<'' | 'public' | 'private'>('');

  const filteredUniversities = universities.filter(university => {
    const matchesSearch = searchTerm === '' ||
      university.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.nameTr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.nameAr.includes(searchTerm) ||
      university.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === '' || university.city === selectedCity;
    const matchesType = selectedType === '' || university.type === selectedType;

    return matchesSearch && matchesCity && matchesType;
  });

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-500';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-300 dark:text-gray-600';
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          rank === 1 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
          rank === 2 ? 'bg-gray-100 dark:bg-gray-700' :
          'bg-amber-100 dark:bg-amber-900/30'
        }`}>
          <Medal className={`h-6 w-6 ${getMedalColor(rank)}`} />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
        <span className="text-lg font-bold text-gray-600 dark:text-gray-300">{rank}</span>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white py-16 md:py-24">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Trophy className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isRTL ? 'ترتيب الجامعات التركية 2025' : 'Turkish University Rankings 2025'}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
              {isRTL
                ? `أفضل ${universities.length} جامعة في تركيا حسب التصنيف العالمي`
                : `Top ${universities.length} universities in Turkey based on global rankings`}
            </p>
          </div>
        </Container>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <Container>
          <div className="flex flex-col md:flex-row gap-4">
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

            {/* City Filter */}
            <div className="md:w-48">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">{isRTL ? 'جميع المدن' : 'All Cities'}</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
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
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {isRTL
              ? `عرض ${filteredUniversities.length} من ${universities.length} جامعة`
              : `Showing ${filteredUniversities.length} of ${universities.length} universities`}
          </div>
        </Container>
      </section>

      {/* Rankings List */}
      <section className="py-12 md:py-16">
        <Container>
          {filteredUniversities.length > 0 ? (
            <div className="space-y-4">
              {filteredUniversities.map((university) => (
                <div
                  key={university.rank}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-md transition-shadow ${
                    university.rank <= 3 ? 'ring-2 ring-yellow-400 dark:ring-yellow-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-4 md:gap-6">
                    {/* Rank */}
                    {getRankBadge(university.rank)}

                    {/* University Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 truncate">
                          {isRTL ? university.nameAr : university.nameEn}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {university.nameTr}
                      </p>
                      {!isRTL && (
                        <p className="text-sm text-gray-500 dark:text-gray-500" dir="rtl">
                          {university.nameAr}
                        </p>
                      )}
                      {isRTL && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {university.nameEn}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <MapPin className="h-4 w-4 me-1" />
                      {university.city}
                    </div>

                    {/* Type Icon */}
                    <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700">
                      {university.type === 'public' ? (
                        <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                  </div>

                  {/* Mobile: City */}
                  <div className="md:hidden flex items-center text-sm text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <MapPin className="h-4 w-4 me-1" />
                    {university.city}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
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
        </Container>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              {isRTL ? 'حول التصنيف' : 'About the Rankings'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isRTL
                ? 'يعتمد هذا التصنيف على مقاييس الويب المستقلة التي توفرها مصادر استخبارات الويب المستقلة، وليس على البيانات المقدمة من الجامعات نفسها. يأخذ التصنيف في الاعتبار عوامل مثل الأداء الأكاديمي والبحث العلمي والسمعة الدولية.'
                : 'This ranking is based on independent web metrics provided by web intelligence sources, rather than data submitted by the universities themselves. The ranking considers factors such as academic performance, research output, and international reputation.'}
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              <ExternalLink className="h-4 w-4 me-2" />
              {isRTL
                ? 'المصدر: uniRank 2025'
                : 'Source: uniRank 2025'}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
