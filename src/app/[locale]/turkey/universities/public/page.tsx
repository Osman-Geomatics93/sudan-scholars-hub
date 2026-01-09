'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Building2, MapPin, Search, ExternalLink } from 'lucide-react';

interface University {
  id: number;
  nameEn: string;
  nameTr: string;
  nameAr: string;
  city: string;
}

const universities: University[] = [
  { id: 1, nameEn: "Marmara University", nameTr: "Marmara Üniversitesi", nameAr: "جامعة مرمرة", city: "Istanbul" },
  { id: 2, nameEn: "Tokat Gaziosmanpaşa University", nameTr: "Tokat Gaziosmanpaşa Üniversitesi", nameAr: "جامعة توكات غازي عثمان باشا", city: "Tokat" },
  { id: 3, nameEn: "Abdullah Gül University", nameTr: "Abdullah Gül Üniversitesi", nameAr: "جامعة عبد الله غول", city: "Kayseri" },
  { id: 4, nameEn: "Gebze Technical University", nameTr: "Gebze Teknik Üniversitesi", nameAr: "جامعة غبزة تكنيك", city: "Kocaeli" },
  { id: 5, nameEn: "Bartın University", nameTr: "Bartın Üniversitesi", nameAr: "جامعة بارتن", city: "Bartin" },
  { id: 6, nameEn: "Sakarya University", nameTr: "Sakarya Üniversitesi", nameAr: "جامعة سكاريا", city: "Sakarya" },
  { id: 7, nameEn: "Kütahya Dumlupınar University", nameTr: "Kütahya Dumlupınar Üniversitesi", nameAr: "جامعة كوتاهيا دوملوبينار", city: "Kutahya" },
  { id: 8, nameEn: "Niğde Ömer Halisdemir University", nameTr: "Niğde Ömer Halisdemir Üniversitesi", nameAr: "جامعة نيغدة عمر خالص ديمير", city: "Nigde" },
  { id: 9, nameEn: "Kastamonu University", nameTr: "Kastamonu Üniversitesi", nameAr: "جامعة كاستامونو", city: "Kastamonu" },
  { id: 10, nameEn: "Yalova University", nameTr: "Yalova Üniversitesi", nameAr: "جامعة يالوفا", city: "Yalova" },
  { id: 11, nameEn: "Hacettepe University", nameTr: "Hacettepe Üniversitesi", nameAr: "جامعة هجي تبة", city: "Ankara" },
  { id: 12, nameEn: "Istanbul University-Cerrahpaşa", nameTr: "İstanbul Üniversitesi-Cerrahpaşa", nameAr: "جامعة اسطنبول جراح باشا", city: "Istanbul" },
  { id: 13, nameEn: "Çankırı Karatekin University", nameTr: "Çankırı Karatekin Üniversitesi", nameAr: "جامعة تشانكري كاراتيكين", city: "Cankiri" },
  { id: 14, nameEn: "Boğaziçi University", nameTr: "Boğaziçi Üniversitesi", nameAr: "جامعة بوغازيتشي", city: "Istanbul" },
  { id: 15, nameEn: "Bursa Uludağ University", nameTr: "Bursa Uludağ Üniversitesi", nameAr: "جامعة اولوداغ", city: "Bursa" },
  { id: 16, nameEn: "Middle East Technical University", nameTr: "Orta Doğu Teknik Üniversitesi", nameAr: "جامعة الشرق الاوسط التقنية", city: "Ankara" },
  { id: 17, nameEn: "Yozgat Bozok University", nameTr: "Yozgat Bozok Üniversitesi", nameAr: "جامعة يوزغات بوزوك", city: "Yozgat" },
  { id: 18, nameEn: "Turkish-German University", nameTr: "Türk-Alman Üniversitesi", nameAr: "الجامعة التركية الالمانية", city: "Istanbul" },
  { id: 19, nameEn: "Atatürk University", nameTr: "Atatürk Üniversitesi", nameAr: "جامعة اتاتورك", city: "Erzurum" },
  { id: 20, nameEn: "Ege University", nameTr: "Ege Üniversitesi", nameAr: "جامعة ايجة", city: "Izmir" },
  { id: 21, nameEn: "Anadolu University", nameTr: "Anadolu Üniversitesi", nameAr: "جامعة اناضولو", city: "Eskisehir" },
  { id: 22, nameEn: "Ondokuz Mayıs University", nameTr: "Ondokuz Mayıs Üniversitesi", nameAr: "جامعة اون دوكوز مايس", city: "Samsun" },
  { id: 23, nameEn: "Muğla Sıtkı Koçman University", nameTr: "Muğla Sıtkı Koçman Üniversitesi", nameAr: "جامعة موغلا صدقي كوتشمان", city: "Mugla" },
  { id: 24, nameEn: "Kocaeli University", nameTr: "Kocaeli Üniversitesi", nameAr: "جامعة كوجالي", city: "Kocaeli" },
  { id: 25, nameEn: "Kırıkkale University", nameTr: "Kırıkkale Üniversitesi", nameAr: "جامعة كركالة", city: "Kirikkale" },
  { id: 26, nameEn: "Bursa Technical University", nameTr: "Bursa Teknik Üniversitesi", nameAr: "جامعة بورصة تكنيك", city: "Bursa" },
  { id: 27, nameEn: "Ankara Yıldırım Beyazıt University", nameTr: "Ankara Yıldırım Beyazıt Üniversitesi", nameAr: "جامعة انقرة يلدرم بيازيد", city: "Ankara" },
  { id: 28, nameEn: "Ankara Social Sciences University", nameTr: "Ankara Sosyal Bilimler Üniversitesi", nameAr: "جامعة انقرة للعلوم الاجتماعية", city: "Ankara" },
  { id: 29, nameEn: "Bolu Abant İzzet Baysal University", nameTr: "Bolu Abant İzzet Baysal Üniversitesi", nameAr: "جامعة بولو ابانت عزت بايسال", city: "Bolu" },
  { id: 30, nameEn: "Süleyman Demirel University", nameTr: "Süleyman Demirel Üniversitesi", nameAr: "جامعة سليمان ديميرال", city: "Isparta" },
  { id: 31, nameEn: "Uşak University", nameTr: "Uşak Üniversitesi", nameAr: "جامعة اوشاك", city: "Usak" },
  { id: 32, nameEn: "Aksaray University", nameTr: "Aksaray Üniversitesi", nameAr: "جامعة اكسراي", city: "Aksaray" },
  { id: 33, nameEn: "Recep Tayyip Erdoğan University", nameTr: "Recep Tayyip Erdoğan Üniversitesi", nameAr: "جامعة رجب طيب اردوغان", city: "Rize" },
  { id: 34, nameEn: "Çukurova University", nameTr: "Çukurova Üniversitesi", nameAr: "جامعة تشوكوروفا", city: "Adana" },
  { id: 35, nameEn: "Van Yüzüncü Yıl University", nameTr: "Van Yüzüncü Yıl Üniversitesi", nameAr: "جامعة فان يوزنجويل", city: "Van" },
  { id: 36, nameEn: "Sakarya University of Applied Sciences", nameTr: "Sakarya Uygulamalı Bilimler Üniversitesi", nameAr: "جامعة سكاريا للعلوم التطبيقية", city: "Sakarya" },
  { id: 37, nameEn: "Kırklareli University", nameTr: "Kırklareli Üniversitesi", nameAr: "جامعة كركلارلة", city: "Kirklareli" },
  { id: 38, nameEn: "Ankara University", nameTr: "Ankara Üniversitesi", nameAr: "جامعة انقرة", city: "Ankara" },
  { id: 39, nameEn: "Health Sciences University", nameTr: "Sağlık Bilimleri Üniversitesi", nameAr: "جامعة العلوم الصحية", city: "Istanbul" },
  { id: 40, nameEn: "İzmir Bakırçay University", nameTr: "İzmir Bakırçay Üniversitesi", nameAr: "جامعة ازمير باكرتشاي", city: "Izmir" },
  { id: 41, nameEn: "İzmir Katip Çelebi University", nameTr: "İzmir Katip Çelebi Üniversitesi", nameAr: "جامعة ازمير كاتب شلبي", city: "Izmir" },
  { id: 42, nameEn: "Burdur Mehmet Akif Ersoy University", nameTr: "Burdur Mehmet Akif Ersoy Üniversitesi", nameAr: "جامعة محمد عاكف ارسوي", city: "Burdur" },
  { id: 43, nameEn: "Batman University", nameTr: "Batman Üniversitesi", nameAr: "جامعة باتمان", city: "Batman" },
  { id: 44, nameEn: "Karadeniz Technical University", nameTr: "Karadeniz Teknik Üniversitesi", nameAr: "جامعة كارادينيز التقنية", city: "Trabzon" },
  { id: 45, nameEn: "Eskişehir Osmangazi University", nameTr: "Eskişehir Osmangazi Üniversitesi", nameAr: "جامعة اسكي شهير عثمان غازي", city: "Eskisehir" },
  { id: 46, nameEn: "Artvin Çoruh University", nameTr: "Artvin Çoruh Üniversitesi", nameAr: "جامعة ارتفين تشورو", city: "Artvin" },
  { id: 47, nameEn: "Gümüşhane University", nameTr: "Gümüşhane Üniversitesi", nameAr: "جامعة جوموش هانة", city: "Gumushane" },
  { id: 48, nameEn: "Hatay Mustafa Kemal University", nameTr: "Hatay Mustafa Kemal Üniversitesi", nameAr: "جامعة هاتاي مصطفى كمال", city: "Hatay" },
  { id: 49, nameEn: "Afyon Kocatepe University", nameTr: "Afyon Kocatepe Üniversitesi", nameAr: "جامعة افيون كوجاتبه", city: "Afyonkarahisar" },
  { id: 50, nameEn: "Istanbul Technical University", nameTr: "İstanbul Teknik Üniversitesi", nameAr: "جامعة اسطنبول تكنيك", city: "Istanbul" },
  { id: 51, nameEn: "Ağrı İbrahim Çeçen University", nameTr: "Ağrı İbrahim Çeçen Üniversitesi", nameAr: "جامعة اغري ابراهيم شيشان", city: "Agri" },
  { id: 52, nameEn: "Kayseri University", nameTr: "Kayseri Üniversitesi", nameAr: "جامعة قيصري", city: "Kayseri" },
  { id: 53, nameEn: "Düzce University", nameTr: "Düzce Üniversitesi", nameAr: "جامعة دوزجة", city: "Duzce" },
  { id: 54, nameEn: "Kırşehir Ahi Evran University", nameTr: "Kırşehir Ahi Evran Üniversitesi", nameAr: "جامعة كير شهير اهي افران", city: "Kirsehir" },
  { id: 55, nameEn: "Bayburt University", nameTr: "Bayburt Üniversitesi", nameAr: "جامعة بايبورت", city: "Bayburt" },
  { id: 56, nameEn: "Siirt University", nameTr: "Siirt Üniversitesi", nameAr: "جامعة سيرت", city: "Siirt" },
  { id: 57, nameEn: "Zonguldak Bülent Ecevit University", nameTr: "Zonguldak Bülent Ecevit Üniversitesi", nameAr: "جامعة بولنت اجاويد", city: "Zonguldak" },
  { id: 58, nameEn: "Gazi University", nameTr: "Gazi Üniversitesi", nameAr: "جامعة غازي", city: "Ankara" },
  { id: 59, nameEn: "Eskişehir Technical University", nameTr: "Eskişehir Teknik Üniversitesi", nameAr: "جامعة اسكي شهير تكنيك", city: "Eskisehir" },
  { id: 60, nameEn: "Mersin University", nameTr: "Mersin Üniversitesi", nameAr: "جامعة مرسين", city: "Mersin" },
  { id: 61, nameEn: "Çanakkale Onsekiz Mart University", nameTr: "Çanakkale Onsekiz Mart Üniversitesi", nameAr: "جامعة تشاناكالة 18 مارت", city: "Canakkale" },
  { id: 62, nameEn: "Malatya Turgut Özal University", nameTr: "Malatya Turgut Özal Üniversitesi", nameAr: "جامعة مالاطيا تورغوت اوزال", city: "Malatya" },
  { id: 63, nameEn: "Necmettin Erbakan University", nameTr: "Necmettin Erbakan Üniversitesi", nameAr: "جامعة نجم الدين اربكان", city: "Konya" },
  { id: 64, nameEn: "Nevşehir Hacı Bektaş Veli University", nameTr: "Nevşehir Hacı Bektaş Veli Üniversitesi", nameAr: "جامعة نيفشهير حجي بكتاش ولي", city: "Nevsehir" },
  { id: 65, nameEn: "Manisa Celâl Bayar University", nameTr: "Manisa Celâl Bayar Üniversitesi", nameAr: "جامعة مانيسا جلال بايار", city: "Manisa" },
  { id: 66, nameEn: "İskenderun Technical University", nameTr: "İskenderun Teknik Üniversitesi", nameAr: "جامعة اسكندرون تكنيك", city: "Hatay" },
  { id: 67, nameEn: "İzmir Institute of Technology", nameTr: "İzmir Yüksek Teknoloji Enstitüsü", nameAr: "معهد ازمير للتكنولوجيا", city: "Izmir" },
  { id: 68, nameEn: "Karabük University", nameTr: "Karabük Üniversitesi", nameAr: "جامعة كارابوك", city: "Karabuk" },
  { id: 69, nameEn: "Kafkas University", nameTr: "Kafkas Üniversitesi", nameAr: "جامعة كافكاس", city: "Kars" },
  { id: 70, nameEn: "Adıyaman University", nameTr: "Adıyaman Üniversitesi", nameAr: "جامعة اديامان", city: "Adiyaman" },
  { id: 71, nameEn: "Kilis 7 Aralık University", nameTr: "Kilis 7 Aralık Üniversitesi", nameAr: "جامعة كلس 7 ارالك", city: "Kilis" },
  { id: 72, nameEn: "Trakya University", nameTr: "Trakya Üniversitesi", nameAr: "جامعة تراكيا", city: "Edirne" },
  { id: 73, nameEn: "Karamanoğlu Mehmetbey University", nameTr: "Karamanoğlu Mehmetbey Üniversitesi", nameAr: "جامعة كارامان اوغلو محمد بيه", city: "Karaman" },
  { id: 74, nameEn: "Istanbul Medeniyet University", nameTr: "İstanbul Medeniyet Üniversitesi", nameAr: "جامعة اسطنبول مدنيات", city: "Istanbul" },
  { id: 75, nameEn: "Giresun University", nameTr: "Giresun Üniversitesi", nameAr: "جامعة غيرسون", city: "Giresun" },
  { id: 76, nameEn: "Ankara Hacı Bayram Veli University", nameTr: "Ankara Hacı Bayram Veli Üniversitesi", nameAr: "جامعة انقرة هجي بيرم ولي", city: "Ankara" },
  { id: 77, nameEn: "İnönü University", nameTr: "İnönü Üniversitesi", nameAr: "جامعة اينونو", city: "Malatya" },
  { id: 78, nameEn: "Samsun University", nameTr: "Samsun Üniversitesi", nameAr: "جامعة سامسون", city: "Samsun" },
  { id: 79, nameEn: "Aydın Adnan Menderes University", nameTr: "Aydın Adnan Menderes Üniversitesi", nameAr: "جامعة عدنان مندرس", city: "Aydin" },
  { id: 80, nameEn: "Gaziantep Islamic Science and Technology University", nameTr: "Gaziantep İslam Bilim Ve Teknoloji Üniversitesi", nameAr: "جامعة غازي عنتاب للعلوم الاسلامية والتكنولوجيا", city: "Gaziantep" },
  { id: 81, nameEn: "Erciyes University", nameTr: "Erciyes Üniversitesi", nameAr: "جامعة ارجيس", city: "Kayseri" },
  { id: 82, nameEn: "Kahramanmaraş Sütçü İmam University", nameTr: "Kahramanmaraş Sütçü İmam Üniversitesi", nameAr: "جامعة كهرمان مرعش سوتشو إمام", city: "Kahramanmaras" },
  { id: 83, nameEn: "Balıkesir University", nameTr: "Balıkesir Üniversitesi", nameAr: "جامعة بالك اسير", city: "Balikesir" },
  { id: 84, nameEn: "Kahramanmaraş İstiklal University", nameTr: "Kahramanmaraş İstiklal Üniversitesi", nameAr: "جامعة كهرمان مرعش استقلال", city: "Kahramanmaras" },
  { id: 85, nameEn: "Fırat University", nameTr: "Fırat Üniversitesi", nameAr: "جامعة الفرات", city: "Elazig" },
  { id: 86, nameEn: "Bingöl University", nameTr: "Bingöl Üniversitesi", nameAr: "جامعة بينغول", city: "Bingol" },
  { id: 87, nameEn: "Hakkari University", nameTr: "Hakkari Üniversitesi", nameAr: "جامعة هاكاري", city: "Hakkari" },
  { id: 88, nameEn: "Osmaniye Korkut Ata University", nameTr: "Osmaniye Korkut Ata Üniversitesi", nameAr: "جامعة العثمانية", city: "Osmaniye" },
  { id: 89, nameEn: "Bandırma Onyedi Eylül University", nameTr: "Bandırma Onyedi Eylül Üniversitesi", nameAr: "جامعة بندرما 17 ايلول", city: "Balikesir" },
  { id: 90, nameEn: "Bitlis Eren University", nameTr: "Bitlis Eren Üniversitesi", nameAr: "جامعة بيتلس إيرن", city: "Bitlis" },
  { id: 91, nameEn: "Bilecik Şeyh Edebali University", nameTr: "Bilecik Şeyh Edebali Üniversitesi", nameAr: "جامعة بيلجيك", city: "Bilecik" },
  { id: 92, nameEn: "Muş Alparslan University", nameTr: "Muş Alparslan Üniversitesi", nameAr: "جامعة موش البارسلان", city: "Mus" },
  { id: 93, nameEn: "Galatasaray University", nameTr: "Galatasaray Üniversitesi", nameAr: "جامعة غالطة سراي", city: "Istanbul" },
  { id: 94, nameEn: "Alanya Alaaddin Keykubat University", nameTr: "Alanya Alaaddin Keykubat Üniversitesi", nameAr: "جامعة الانيا علاء الدين كيكوبات", city: "Antalya" },
  { id: 95, nameEn: "Pamukkale University", nameTr: "Pamukkale Üniversitesi", nameAr: "جامعة باموكالة", city: "Denizli" },
  { id: 96, nameEn: "Amasya University", nameTr: "Amasya Üniversitesi", nameAr: "جامعة اماسيا", city: "Amasya" },
  { id: 97, nameEn: "Sivas Science and Technology University", nameTr: "Sivas Bilim Ve Teknoloji Üniversitesi", nameAr: "جامعة سيواس للعلوم والتكنولوجيا", city: "Sivas" },
];

export default function PublicUniversitiesPage() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const isRTL = locale === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Get unique cities
  const cities = [...new Set(universities.map(u => u.city))].sort();

  // Filter universities
  const filteredUniversities = universities.filter(uni => {
    const matchesSearch =
      uni.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.nameTr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.nameAr.includes(searchTerm) ||
      uni.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = !selectedCity || uni.city === selectedCity;

    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 text-white pt-24 pb-16 md:pt-32 md:pb-24">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Building2 className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {isRTL ? 'الجامعات الحكومية التركية' : 'Turkish Public Universities'}
            </h1>
            <p className="text-lg md:text-xl text-red-100 max-w-2xl mx-auto mb-2">
              {isRTL
                ? 'قائمة شاملة بجميع الجامعات الحكومية في تركيا'
                : 'A comprehensive list of all public universities in Turkey'}
            </p>
            <p className="text-red-200">
              {isRTL ? `${universities.length} جامعة حكومية` : `${universities.length} Public Universities`}
            </p>
          </div>
        </Container>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
        <Container>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={isRTL ? 'ابحث عن جامعة...' : 'Search for a university...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full ps-10 pe-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* City Filter */}
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent min-w-[200px]"
            >
              <option value="">{isRTL ? 'جميع المدن' : 'All Cities'}</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {isRTL
              ? `عرض ${filteredUniversities.length} من ${universities.length} جامعة`
              : `Showing ${filteredUniversities.length} of ${universities.length} universities`}
          </p>
        </Container>
      </section>

      {/* Universities Grid */}
      <section className="py-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUniversities.map((uni) => (
              <div
                key={uni.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Building2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    #{uni.id}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 dark:text-gray-50 mb-1">
                  {isRTL ? uni.nameAr : uni.nameEn}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {uni.nameTr}
                </p>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4 me-1" />
                  {uni.city}
                </div>
              </div>
            ))}
          </div>

          {filteredUniversities.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {isRTL ? 'لا توجد نتائج مطابقة' : 'No matching results'}
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Source Attribution */}
      <section className="py-8 bg-gray-100 dark:bg-gray-800">
        <Container>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isRTL ? 'المصدر: ' : 'Source: '}
              <a
                href="https://atharan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 dark:text-red-400 hover:underline inline-flex items-center gap-1"
              >
                atharan.com
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
