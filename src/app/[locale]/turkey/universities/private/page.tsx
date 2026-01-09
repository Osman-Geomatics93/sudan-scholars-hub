'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Building, MapPin, Search, ExternalLink } from 'lucide-react';

interface University {
  id: number;
  nameEn: string;
  nameTr: string;
  nameAr: string;
  city: string;
}

const universities: University[] = [
  // Istanbul Universities
  { id: 1, nameEn: "Koç University", nameTr: "Koç Üniversitesi", nameAr: "جامعة كوتش", city: "Istanbul" },
  { id: 2, nameEn: "Sabancı University", nameTr: "Sabancı Üniversitesi", nameAr: "جامعة صبانجي", city: "Istanbul" },
  { id: 3, nameEn: "Bahçeşehir University", nameTr: "Bahçeşehir Üniversitesi", nameAr: "جامعة بهتشه شهير", city: "Istanbul" },
  { id: 4, nameEn: "Yeditepe University", nameTr: "Yeditepe Üniversitesi", nameAr: "جامعة يدي تبه", city: "Istanbul" },
  { id: 5, nameEn: "Istanbul Bilgi University", nameTr: "İstanbul Bilgi Üniversitesi", nameAr: "جامعة اسطنبول بيلجي", city: "Istanbul" },
  { id: 6, nameEn: "Özyeğin University", nameTr: "Özyeğin Üniversitesi", nameAr: "جامعة أوزيغين", city: "Istanbul" },
  { id: 7, nameEn: "Kadir Has University", nameTr: "Kadir Has Üniversitesi", nameAr: "جامعة قادر هاس", city: "Istanbul" },
  { id: 8, nameEn: "Doğuş University", nameTr: "Doğuş Üniversitesi", nameAr: "جامعة دوغوش", city: "Istanbul" },
  { id: 9, nameEn: "Işık University", nameTr: "Işık Üniversitesi", nameAr: "جامعة إشيك", city: "Istanbul" },
  { id: 10, nameEn: "Maltepe University", nameTr: "Maltepe Üniversitesi", nameAr: "جامعة مالتبه", city: "Istanbul" },
  { id: 11, nameEn: "Beykent University", nameTr: "Beykent Üniversitesi", nameAr: "جامعة بيكنت", city: "Istanbul" },
  { id: 12, nameEn: "Haliç University", nameTr: "Haliç Üniversitesi", nameAr: "جامعة الخليج", city: "Istanbul" },
  { id: 13, nameEn: "Fatih Sultan Mehmet Foundation University", nameTr: "Fatih Sultan Mehmet Vakıf Üniversitesi", nameAr: "جامعة السلطان محمد الفاتح الوقفية", city: "Istanbul" },
  { id: 14, nameEn: "Istanbul Aydın University", nameTr: "İstanbul Aydın Üniversitesi", nameAr: "جامعة اسطنبول آيدن", city: "Istanbul" },
  { id: 15, nameEn: "Istanbul Gedik University", nameTr: "İstanbul Gedik Üniversitesi", nameAr: "جامعة اسطنبول غديك", city: "Istanbul" },
  { id: 16, nameEn: "Istanbul Gelişim University", nameTr: "İstanbul Gelişim Üniversitesi", nameAr: "جامعة اسطنبول غليشيم", city: "Istanbul" },
  { id: 17, nameEn: "Istanbul Arel University", nameTr: "İstanbul Arel Üniversitesi", nameAr: "جامعة اسطنبول آريل", city: "Istanbul" },
  { id: 18, nameEn: "Istanbul Kültür University", nameTr: "İstanbul Kültür Üniversitesi", nameAr: "جامعة اسطنبول كولتور", city: "Istanbul" },
  { id: 19, nameEn: "Istanbul Medipol University", nameTr: "İstanbul Medipol Üniversitesi", nameAr: "جامعة اسطنبول ميديبول", city: "Istanbul" },
  { id: 20, nameEn: "Istanbul Okan University", nameTr: "İstanbul Okan Üniversitesi", nameAr: "جامعة اسطنبول أوكان", city: "Istanbul" },
  { id: 21, nameEn: "Istanbul Sabahattin Zaim University", nameTr: "İstanbul Sabahattin Zaim Üniversitesi", nameAr: "جامعة صباح الدين زعيم", city: "Istanbul" },
  { id: 22, nameEn: "Istanbul Commerce University", nameTr: "İstanbul Ticaret Üniversitesi", nameAr: "جامعة اسطنبول التجارية", city: "Istanbul" },
  { id: 23, nameEn: "MEF University", nameTr: "MEF Üniversitesi", nameAr: "جامعة ميف", city: "Istanbul" },
  { id: 24, nameEn: "Nişantaşı University", nameTr: "Nişantaşı Üniversitesi", nameAr: "جامعة نيشانتاشي", city: "Istanbul" },
  { id: 25, nameEn: "Piri Reis University", nameTr: "Piri Reis Üniversitesi", nameAr: "جامعة بيري ريس", city: "Istanbul" },
  { id: 26, nameEn: "Üsküdar University", nameTr: "Üsküdar Üniversitesi", nameAr: "جامعة أسكودار", city: "Istanbul" },
  { id: 27, nameEn: "Istanbul Yeni Yüzyıl University", nameTr: "İstanbul Yeni Yüzyıl Üniversitesi", nameAr: "جامعة القرن الجديد", city: "Istanbul" },
  { id: 28, nameEn: "Bezmiâlem Foundation University", nameTr: "Bezmiâlem Vakıf Üniversitesi", nameAr: "جامعة بزم عالم الوقفية", city: "Istanbul" },
  { id: 29, nameEn: "Biruni University", nameTr: "Biruni Üniversitesi", nameAr: "جامعة البيروني", city: "Istanbul" },
  { id: 30, nameEn: "Istanbul 29 Mayıs University", nameTr: "İstanbul 29 Mayıs Üniversitesi", nameAr: "جامعة 29 مايس", city: "Istanbul" },
  { id: 31, nameEn: "Istanbul Esenyurt University", nameTr: "İstanbul Esenyurt Üniversitesi", nameAr: "جامعة اسطنبول اسنيورت", city: "Istanbul" },
  { id: 32, nameEn: "Istanbul Kent University", nameTr: "İstanbul Kent Üniversitesi", nameAr: "جامعة اسطنبول كينت", city: "Istanbul" },
  { id: 33, nameEn: "Altınbaş University", nameTr: "Altınbaş Üniversitesi", nameAr: "جامعة ألتين باش", city: "Istanbul" },
  { id: 34, nameEn: "Istanbul Atlas University", nameTr: "İstanbul Atlas Üniversitesi", nameAr: "جامعة اسطنبول أطلس", city: "Istanbul" },
  { id: 35, nameEn: "Istanbul Rumeli University", nameTr: "İstanbul Rumeli Üniversitesi", nameAr: "جامعة اسطنبول روميلي", city: "Istanbul" },
  { id: 36, nameEn: "Istanbul Topkapı University", nameTr: "İstanbul Topkapı Üniversitesi", nameAr: "جامعة اسطنبول توبكابي", city: "Istanbul" },
  { id: 37, nameEn: "Istanbul Galata University", nameTr: "İstanbul Galata Üniversitesi", nameAr: "جامعة اسطنبول غلطة", city: "Istanbul" },
  { id: 38, nameEn: "Fenerbahçe University", nameTr: "Fenerbahçe Üniversitesi", nameAr: "جامعة فنربهتشه", city: "Istanbul" },
  { id: 39, nameEn: "Demiroğlu Bilim University", nameTr: "Demiroğlu Bilim Üniversitesi", nameAr: "جامعة دميروغلو للعلوم", city: "Istanbul" },
  { id: 40, nameEn: "Acıbadem University", nameTr: "Acıbadem Üniversitesi", nameAr: "جامعة أجي بادم", city: "Istanbul" },
  { id: 41, nameEn: "Istanbul Ticaret University", nameTr: "İstanbul Ticaret Üniversitesi", nameAr: "جامعة اسطنبول للتجارة", city: "Istanbul" },
  { id: 42, nameEn: "Beykoz University", nameTr: "Beykoz Üniversitesi", nameAr: "جامعة بيكوز", city: "Istanbul" },
  { id: 43, nameEn: "Istanbul Nişantaşı University", nameTr: "Nişantaşı Üniversitesi", nameAr: "جامعة نيشان تاشي", city: "Istanbul" },
  { id: 44, nameEn: "Turkish-German University", nameTr: "Türk-Alman Üniversitesi", nameAr: "الجامعة التركية الألمانية", city: "Istanbul" },

  // Ankara Universities
  { id: 45, nameEn: "Bilkent University", nameTr: "Bilkent Üniversitesi", nameAr: "جامعة بيلكنت", city: "Ankara" },
  { id: 46, nameEn: "Başkent University", nameTr: "Başkent Üniversitesi", nameAr: "جامعة باشكنت", city: "Ankara" },
  { id: 47, nameEn: "TOBB University of Economics and Technology", nameTr: "TOBB Ekonomi ve Teknoloji Üniversitesi", nameAr: "جامعة توب للاقتصاد والتكنولوجيا", city: "Ankara" },
  { id: 48, nameEn: "Atılım University", nameTr: "Atılım Üniversitesi", nameAr: "جامعة أتيليم", city: "Ankara" },
  { id: 49, nameEn: "Çankaya University", nameTr: "Çankaya Üniversitesi", nameAr: "جامعة تشانكايا", city: "Ankara" },
  { id: 50, nameEn: "TED University", nameTr: "TED Üniversitesi", nameAr: "جامعة تيد", city: "Ankara" },
  { id: 51, nameEn: "Ufuk University", nameTr: "Ufuk Üniversitesi", nameAr: "جامعة أفق", city: "Ankara" },
  { id: 52, nameEn: "Ostim Technical University", nameTr: "Ostim Teknik Üniversitesi", nameAr: "جامعة أوستيم التقنية", city: "Ankara" },
  { id: 53, nameEn: "Ankara Medipol University", nameTr: "Ankara Medipol Üniversitesi", nameAr: "جامعة أنقرة ميديبول", city: "Ankara" },
  { id: 54, nameEn: "Lokman Hekim University", nameTr: "Lokman Hekim Üniversitesi", nameAr: "جامعة لقمان حكيم", city: "Ankara" },

  // Izmir Universities
  { id: 55, nameEn: "Yaşar University", nameTr: "Yaşar Üniversitesi", nameAr: "جامعة يشار", city: "Izmir" },
  { id: 56, nameEn: "Izmir University of Economics", nameTr: "İzmir Ekonomi Üniversitesi", nameAr: "جامعة إزمير للاقتصاد", city: "Izmir" },
  { id: 57, nameEn: "Izmir Tınaztepe University", nameTr: "İzmir Tınaztepe Üniversitesi", nameAr: "جامعة إزمير تينازتبه", city: "Izmir" },

  // Antalya Universities
  { id: 58, nameEn: "Antalya Bilim University", nameTr: "Antalya Bilim Üniversitesi", nameAr: "جامعة أنطاليا للعلوم", city: "Antalya" },

  // Bursa Universities
  { id: 59, nameEn: "Istanbul 29 Mayıs University", nameTr: "İstanbul 29 Mayıs Üniversitesi", nameAr: "جامعة 29 مايس", city: "Bursa" },

  // Gaziantep Universities
  { id: 60, nameEn: "Hasan Kalyoncu University", nameTr: "Hasan Kalyoncu Üniversitesi", nameAr: "جامعة حسن كاليونجو", city: "Gaziantep" },
  { id: 61, nameEn: "Sanko University", nameTr: "Sanko Üniversitesi", nameAr: "جامعة سانكو", city: "Gaziantep" },

  // Kayseri Universities
  { id: 62, nameEn: "Nuh Naci Yazgan University", nameTr: "Nuh Naci Yazgan Üniversitesi", nameAr: "جامعة نوح ناجي يازغان", city: "Kayseri" },

  // Konya Universities
  { id: 63, nameEn: "KTO Karatay University", nameTr: "KTO Karatay Üniversitesi", nameAr: "جامعة قاراتاي", city: "Konya" },

  // Kocaeli Universities
  { id: 64, nameEn: "Kocaeli Health and Technology University", nameTr: "Kocaeli Sağlık ve Teknoloji Üniversitesi", nameAr: "جامعة كوجالي للصحة والتكنولوجيا", city: "Kocaeli" },

  // Mersin Universities
  { id: 65, nameEn: "Tarsus University", nameTr: "Tarsus Üniversitesi", nameAr: "جامعة طرسوس", city: "Mersin" },

  // Sakarya Universities
  { id: 66, nameEn: "Sakarya Applied Sciences University", nameTr: "Sakarya Uygulamalı Bilimler Üniversitesi", nameAr: "جامعة سكاريا للعلوم التطبيقية", city: "Sakarya" },

  // Trabzon Universities
  { id: 67, nameEn: "Avrasya University", nameTr: "Avrasya Üniversitesi", nameAr: "جامعة أوراسيا", city: "Trabzon" },

  // Adana Universities
  { id: 68, nameEn: "Çağ University", nameTr: "Çağ Üniversitesi", nameAr: "جامعة تشاغ", city: "Adana" },

  // Eskişehir Universities
  { id: 69, nameEn: "Eskişehir Osmangazi University", nameTr: "Eskişehir Osmangazi Üniversitesi", nameAr: "جامعة إسكي شهير عثمان غازي", city: "Eskisehir" },

  // Cyprus Universities (Turkish Republic of Northern Cyprus)
  { id: 70, nameEn: "Eastern Mediterranean University", nameTr: "Doğu Akdeniz Üniversitesi", nameAr: "جامعة شرق البحر المتوسط", city: "Famagusta (TRNC)" },
  { id: 71, nameEn: "Near East University", nameTr: "Yakın Doğu Üniversitesi", nameAr: "جامعة الشرق الأدنى", city: "Nicosia (TRNC)" },
  { id: 72, nameEn: "Girne American University", nameTr: "Girne Amerikan Üniversitesi", nameAr: "جامعة غيرنه الأمريكية", city: "Kyrenia (TRNC)" },
  { id: 73, nameEn: "Cyprus International University", nameTr: "Uluslararası Kıbrıs Üniversitesi", nameAr: "جامعة قبرص الدولية", city: "Nicosia (TRNC)" },
  { id: 74, nameEn: "Final International University", nameTr: "Final Uluslararası Üniversitesi", nameAr: "جامعة فاينال الدولية", city: "Kyrenia (TRNC)" },
  { id: 75, nameEn: "European University of Lefke", nameTr: "Lefke Avrupa Üniversitesi", nameAr: "جامعة ليفكه الأوروبية", city: "Lefke (TRNC)" },
];

// Get unique cities for filter
const cities = [...new Set(universities.map(u => u.city))].sort();

export default function PrivateUniversitiesPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const filteredUniversities = universities.filter(university => {
    const matchesSearch = searchTerm === '' ||
      university.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.nameTr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.nameAr.includes(searchTerm) ||
      university.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === '' || university.city === selectedCity;

    return matchesSearch && matchesCity;
  });

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white pt-24 pb-16 md:pt-32 md:pb-24">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Building className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isRTL ? 'الجامعات الخاصة في تركيا' : 'Private Universities in Turkey'}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto">
              {isRTL
                ? `اكتشف ${universities.length} جامعة خاصة (وقفية) في تركيا وشمال قبرص`
                : `Discover ${universities.length} private (foundation) universities in Turkey and Northern Cyprus`}
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
            <div className="md:w-64">
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
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {isRTL
              ? `عرض ${filteredUniversities.length} من ${universities.length} جامعة`
              : `Showing ${filteredUniversities.length} of ${universities.length} universities`}
          </div>
        </Container>
      </section>

      {/* Universities Grid */}
      <section className="py-12 md:py-16">
        <Container>
          {filteredUniversities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUniversities.map((university) => (
                <div
                  key={university.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <Building className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                      {isRTL ? 'خاصة' : 'Private'}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-1">
                    {isRTL ? university.nameAr : university.nameEn}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {university.nameTr}
                  </p>
                  {!isRTL && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-3" dir="rtl">
                      {university.nameAr}
                    </p>
                  )}
                  {isRTL && (
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
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
              <Building className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
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
              {isRTL ? 'حول الجامعات الخاصة في تركيا' : 'About Private Universities in Turkey'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isRTL
                ? 'الجامعات الخاصة (الوقفية) في تركيا هي مؤسسات تعليمية غير ربحية تأسست من قبل مؤسسات خيرية. تقدم برامج متنوعة باللغة الإنجليزية والتركية، وتوفر منحًا دراسية للطلاب الدوليين المتميزين.'
                : 'Private (foundation) universities in Turkey are non-profit educational institutions established by charitable foundations. They offer diverse programs in English and Turkish, and provide scholarships to outstanding international students.'}
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
              <ExternalLink className="h-4 w-4 me-2" />
              {isRTL
                ? 'البيانات من مجلس التعليم العالي التركي (YÖK)'
                : 'Data from Turkish Higher Education Council (YÖK)'}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
