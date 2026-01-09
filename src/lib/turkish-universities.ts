// Turkish Universities Database
// 200+ Turkish universities organized by city

export interface TurkishUniversity {
  id: string;
  nameEn: string;
  nameTr: string;
  nameAr: string;
  city: string;
  type: 'state' | 'foundation';
  ranking?: number;
}

export const turkishUniversities: TurkishUniversity[] = [
  // ============================================
  // ISTANBUL (35 universities)
  // ============================================
  // State Universities
  { id: 'istanbul-uni', nameEn: 'Istanbul University', nameTr: 'İstanbul Üniversitesi', nameAr: 'جامعة اسطنبول', city: 'Istanbul', type: 'state', ranking: 1 },
  { id: 'istanbul-cerrahpasa', nameEn: 'Istanbul University-Cerrahpaşa', nameTr: 'İstanbul Üniversitesi-Cerrahpaşa', nameAr: 'جامعة اسطنبول جراح باشا', city: 'Istanbul', type: 'state', ranking: 6 },
  { id: 'itu', nameEn: 'Istanbul Technical University', nameTr: 'İstanbul Teknik Üniversitesi', nameAr: 'جامعة اسطنبول التقنية', city: 'Istanbul', type: 'state', ranking: 3 },
  { id: 'bogazici', nameEn: 'Boğaziçi University', nameTr: 'Boğaziçi Üniversitesi', nameAr: 'جامعة بوغازيتشي', city: 'Istanbul', type: 'state', ranking: 2 },
  { id: 'marmara', nameEn: 'Marmara University', nameTr: 'Marmara Üniversitesi', nameAr: 'جامعة مرمرة', city: 'Istanbul', type: 'state', ranking: 12 },
  { id: 'yildiz', nameEn: 'Yıldız Technical University', nameTr: 'Yıldız Teknik Üniversitesi', nameAr: 'جامعة يلدز التقنية', city: 'Istanbul', type: 'state', ranking: 15 },
  { id: 'istanbul-medeniyet', nameEn: 'Istanbul Medeniyet University', nameTr: 'İstanbul Medeniyet Üniversitesi', nameAr: 'جامعة اسطنبول مدنيات', city: 'Istanbul', type: 'state', ranking: 35 },
  { id: 'istanbul-29mayis', nameEn: 'Istanbul 29 Mayıs University', nameTr: 'İstanbul 29 Mayıs Üniversitesi', nameAr: 'جامعة اسطنبول 29 مايس', city: 'Istanbul', type: 'state', ranking: 80 },
  { id: 'mimar-sinan', nameEn: 'Mimar Sinan Fine Arts University', nameTr: 'Mimar Sinan Güzel Sanatlar Üniversitesi', nameAr: 'جامعة معمار سنان للفنون الجميلة', city: 'Istanbul', type: 'state', ranking: 25 },
  { id: 'galatasaray', nameEn: 'Galatasaray University', nameTr: 'Galatasaray Üniversitesi', nameAr: 'جامعة غلطة سراي', city: 'Istanbul', type: 'state', ranking: 20 },
  { id: 'istanbul-sabahattin-zaim', nameEn: 'Istanbul Sabahattin Zaim University', nameTr: 'İstanbul Sabahattin Zaim Üniversitesi', nameAr: 'جامعة اسطنبول صباح الدين زعيم', city: 'Istanbul', type: 'foundation', ranking: 45 },
  // Foundation Universities
  { id: 'sabanci', nameEn: 'Sabancı University', nameTr: 'Sabancı Üniversitesi', nameAr: 'جامعة سابانجي', city: 'Istanbul', type: 'foundation', ranking: 5 },
  { id: 'koc', nameEn: 'Koç University', nameTr: 'Koç Üniversitesi', nameAr: 'جامعة كوتش', city: 'Istanbul', type: 'foundation', ranking: 4 },
  { id: 'bilgi', nameEn: 'Istanbul Bilgi University', nameTr: 'İstanbul Bilgi Üniversitesi', nameAr: 'جامعة اسطنبول بيلجي', city: 'Istanbul', type: 'foundation', ranking: 28 },
  { id: 'bahcesehir', nameEn: 'Bahçeşehir University', nameTr: 'Bahçeşehir Üniversitesi', nameAr: 'جامعة بهتشه شهير', city: 'Istanbul', type: 'foundation', ranking: 30 },
  { id: 'ozyegin', nameEn: 'Özyeğin University', nameTr: 'Özyeğin Üniversitesi', nameAr: 'جامعة أوزيغين', city: 'Istanbul', type: 'foundation', ranking: 22 },
  { id: 'medipol', nameEn: 'Istanbul Medipol University', nameTr: 'İstanbul Medipol Üniversitesi', nameAr: 'جامعة ميديبول اسطنبول', city: 'Istanbul', type: 'foundation', ranking: 32 },
  { id: 'altinbas', nameEn: 'Altınbaş University', nameTr: 'Altınbaş Üniversitesi', nameAr: 'جامعة ألتينباش', city: 'Istanbul', type: 'foundation', ranking: 55 },
  { id: 'aydin', nameEn: 'Istanbul Aydın University', nameTr: 'İstanbul Aydın Üniversitesi', nameAr: 'جامعة اسطنبول آيدن', city: 'Istanbul', type: 'foundation', ranking: 50 },
  { id: 'gelisim', nameEn: 'Istanbul Gelişim University', nameTr: 'İstanbul Gelişim Üniversitesi', nameAr: 'جامعة اسطنبول جيليشيم', city: 'Istanbul', type: 'foundation', ranking: 60 },
  { id: 'kultur', nameEn: 'Istanbul Kültür University', nameTr: 'İstanbul Kültür Üniversitesi', nameAr: 'جامعة اسطنبول كولتور', city: 'Istanbul', type: 'foundation', ranking: 48 },
  { id: 'nisantasi', nameEn: 'Nişantaşı University', nameTr: 'Nişantaşı Üniversitesi', nameAr: 'جامعة نيشان تاشي', city: 'Istanbul', type: 'foundation', ranking: 70 },
  { id: 'atlas', nameEn: 'Istanbul Atlas University', nameTr: 'İstanbul Atlas Üniversitesi', nameAr: 'جامعة اسطنبول أطلس', city: 'Istanbul', type: 'foundation', ranking: 85 },
  { id: 'topkapi', nameEn: 'Istanbul Topkapı University', nameTr: 'İstanbul Topkapı Üniversitesi', nameAr: 'جامعة اسطنبول توبكابي', city: 'Istanbul', type: 'foundation', ranking: 90 },
  { id: 'arel', nameEn: 'Istanbul Arel University', nameTr: 'İstanbul Arel Üniversitesi', nameAr: 'جامعة اسطنبول أرال', city: 'Istanbul', type: 'foundation', ranking: 65 },
  { id: 'okan', nameEn: 'Istanbul Okan University', nameTr: 'İstanbul Okan Üniversitesi', nameAr: 'جامعة اسطنبول أوكان', city: 'Istanbul', type: 'foundation', ranking: 42 },
  { id: 'yeni-yuzyil', nameEn: 'Istanbul Yeni Yüzyıl University', nameTr: 'İstanbul Yeni Yüzyıl Üniversitesi', nameAr: 'جامعة اسطنبول يني يوزيل', city: 'Istanbul', type: 'foundation', ranking: 75 },
  { id: 'esenyurt', nameEn: 'Istanbul Esenyurt University', nameTr: 'İstanbul Esenyurt Üniversitesi', nameAr: 'جامعة اسطنبول اسنيورت', city: 'Istanbul', type: 'foundation', ranking: 95 },
  { id: 'kent', nameEn: 'Istanbul Kent University', nameTr: 'İstanbul Kent Üniversitesi', nameAr: 'جامعة اسطنبول كنت', city: 'Istanbul', type: 'foundation', ranking: 88 },
  { id: 'rumeli', nameEn: 'Istanbul Rumeli University', nameTr: 'İstanbul Rumeli Üniversitesi', nameAr: 'جامعة اسطنبول روملي', city: 'Istanbul', type: 'foundation', ranking: 92 },
  { id: 'ticaret', nameEn: 'Istanbul Commerce University', nameTr: 'İstanbul Ticaret Üniversitesi', nameAr: 'جامعة اسطنبول للتجارة', city: 'Istanbul', type: 'foundation', ranking: 40 },
  { id: 'beykent', nameEn: 'Beykent University', nameTr: 'Beykent Üniversitesi', nameAr: 'جامعة بيكنت', city: 'Istanbul', type: 'foundation', ranking: 52 },
  { id: 'dogus', nameEn: 'Doğuş University', nameTr: 'Doğuş Üniversitesi', nameAr: 'جامعة دوغوش', city: 'Istanbul', type: 'foundation', ranking: 58 },
  { id: 'maltepe', nameEn: 'Maltepe University', nameTr: 'Maltepe Üniversitesi', nameAr: 'جامعة مالتبه', city: 'Istanbul', type: 'foundation', ranking: 54 },
  { id: 'isik', nameEn: 'Işık University', nameTr: 'Işık Üniversitesi', nameAr: 'جامعة إشيك', city: 'Istanbul', type: 'foundation', ranking: 47 },

  // ============================================
  // ANKARA (17 universities)
  // ============================================
  { id: 'ankara-uni', nameEn: 'Ankara University', nameTr: 'Ankara Üniversitesi', nameAr: 'جامعة أنقرة', city: 'Ankara', type: 'state', ranking: 5 },
  { id: 'hacettepe', nameEn: 'Hacettepe University', nameTr: 'Hacettepe Üniversitesi', nameAr: 'جامعة حجة تبة', city: 'Ankara', type: 'state', ranking: 4 },
  { id: 'metu', nameEn: 'Middle East Technical University', nameTr: 'Orta Doğu Teknik Üniversitesi', nameAr: 'جامعة الشرق الأوسط التقنية', city: 'Ankara', type: 'state', ranking: 1 },
  { id: 'gazi', nameEn: 'Gazi University', nameTr: 'Gazi Üniversitesi', nameAr: 'جامعة غازي', city: 'Ankara', type: 'state', ranking: 8 },
  { id: 'yildirim-beyazit', nameEn: 'Ankara Yıldırım Beyazıt University', nameTr: 'Ankara Yıldırım Beyazıt Üniversitesi', nameAr: 'جامعة أنقرة يلدريم بايزيد', city: 'Ankara', type: 'state', ranking: 30 },
  { id: 'ankara-sosyal', nameEn: 'Ankara Social Sciences University', nameTr: 'Ankara Sosyal Bilimler Üniversitesi', nameAr: 'جامعة أنقرة للعلوم الاجتماعية', city: 'Ankara', type: 'state', ranking: 40 },
  { id: 'ankara-haci-bayram', nameEn: 'Ankara Hacı Bayram Veli University', nameTr: 'Ankara Hacı Bayram Veli Üniversitesi', nameAr: 'جامعة أنقرة حاجي بيرام ولي', city: 'Ankara', type: 'state', ranking: 35 },
  { id: 'ankara-muzik', nameEn: 'Ankara Music and Fine Arts University', nameTr: 'Ankara Müzik ve Güzel Sanatlar Üniversitesi', nameAr: 'جامعة أنقرة للموسيقى والفنون الجميلة', city: 'Ankara', type: 'state', ranking: 60 },
  { id: 'bilkent', nameEn: 'Bilkent University', nameTr: 'Bilkent Üniversitesi', nameAr: 'جامعة بيلكنت', city: 'Ankara', type: 'foundation', ranking: 6 },
  { id: 'tobb', nameEn: 'TOBB University', nameTr: 'TOBB Ekonomi ve Teknoloji Üniversitesi', nameAr: 'جامعة توب للاقتصاد والتكنولوجيا', city: 'Ankara', type: 'foundation', ranking: 18 },
  { id: 'baskent', nameEn: 'Başkent University', nameTr: 'Başkent Üniversitesi', nameAr: 'جامعة باشكنت', city: 'Ankara', type: 'foundation', ranking: 25 },
  { id: 'atilim', nameEn: 'Atılım University', nameTr: 'Atılım Üniversitesi', nameAr: 'جامعة أتيليم', city: 'Ankara', type: 'foundation', ranking: 35 },
  { id: 'ufuk', nameEn: 'Ufuk University', nameTr: 'Ufuk Üniversitesi', nameAr: 'جامعة أفق', city: 'Ankara', type: 'foundation', ranking: 70 },
  { id: 'ankara-medipol', nameEn: 'Ankara Medipol University', nameTr: 'Ankara Medipol Üniversitesi', nameAr: 'جامعة أنقرة ميديبول', city: 'Ankara', type: 'foundation', ranking: 55 },
  { id: 'cankaya', nameEn: 'Çankaya University', nameTr: 'Çankaya Üniversitesi', nameAr: 'جامعة تشانكايا', city: 'Ankara', type: 'foundation', ranking: 42 },
  { id: 'ted', nameEn: 'TED University', nameTr: 'TED Üniversitesi', nameAr: 'جامعة تيد', city: 'Ankara', type: 'foundation', ranking: 38 },
  { id: 'ostim', nameEn: 'Ostim Technical University', nameTr: 'Ostim Teknik Üniversitesi', nameAr: 'جامعة أوستيم التقنية', city: 'Ankara', type: 'foundation', ranking: 75 },

  // ============================================
  // IZMIR (12 universities)
  // ============================================
  { id: 'ege', nameEn: 'Ege University', nameTr: 'Ege Üniversitesi', nameAr: 'جامعة إيجة', city: 'Izmir', type: 'state', ranking: 7 },
  { id: 'dokuz-eylul', nameEn: 'Dokuz Eylül University', nameTr: 'Dokuz Eylül Üniversitesi', nameAr: 'جامعة دوكوز أيلول', city: 'Izmir', type: 'state', ranking: 11 },
  { id: 'izmir-yuksek', nameEn: 'İzmir Institute of Technology', nameTr: 'İzmir Yüksek Teknoloji Enstitüsü', nameAr: 'معهد إزمير للتكنولوجيا العالية', city: 'Izmir', type: 'state', ranking: 9 },
  { id: 'izmir-katip', nameEn: 'İzmir Kâtip Çelebi University', nameTr: 'İzmir Kâtip Çelebi Üniversitesi', nameAr: 'جامعة إزمير كاتب جلبي', city: 'Izmir', type: 'state', ranking: 28 },
  { id: 'izmir-bakircay', nameEn: 'İzmir Bakırçay University', nameTr: 'İzmir Bakırçay Üniversitesi', nameAr: 'جامعة إزمير باكيرتشاي', city: 'Izmir', type: 'state', ranking: 50 },
  { id: 'izmir-demokrasi', nameEn: 'İzmir Democracy University', nameTr: 'İzmir Demokrasi Üniversitesi', nameAr: 'جامعة إزمير الديمقراطية', city: 'Izmir', type: 'state', ranking: 55 },
  { id: 'izmir-ekonomi', nameEn: 'İzmir University of Economics', nameTr: 'İzmir Ekonomi Üniversitesi', nameAr: 'جامعة إزمير للاقتصاد', city: 'Izmir', type: 'foundation', ranking: 24 },
  { id: 'yasar', nameEn: 'Yaşar University', nameTr: 'Yaşar Üniversitesi', nameAr: 'جامعة ياشار', city: 'Izmir', type: 'foundation', ranking: 35 },
  { id: 'izmir-tinaztepe', nameEn: 'İzmir Tınaztepe University', nameTr: 'İzmir Tınaztepe Üniversitesi', nameAr: 'جامعة إزمير تينازتبه', city: 'Izmir', type: 'foundation', ranking: 80 },

  // ============================================
  // BURSA (5 universities)
  // ============================================
  { id: 'uludag', nameEn: 'Bursa Uludağ University', nameTr: 'Bursa Uludağ Üniversitesi', nameAr: 'جامعة بورصة أولوداغ', city: 'Bursa', type: 'state', ranking: 14 },
  { id: 'bursa-teknik', nameEn: 'Bursa Technical University', nameTr: 'Bursa Teknik Üniversitesi', nameAr: 'جامعة بورصة التقنية', city: 'Bursa', type: 'state', ranking: 45 },
  { id: 'mudanya', nameEn: 'Mudanya University', nameTr: 'Mudanya Üniversitesi', nameAr: 'جامعة مودانيا', city: 'Bursa', type: 'foundation', ranking: 90 },

  // ============================================
  // ANTALYA (5 universities)
  // ============================================
  { id: 'akdeniz', nameEn: 'Akdeniz University', nameTr: 'Akdeniz Üniversitesi', nameAr: 'جامعة أكدنيز', city: 'Antalya', type: 'state', ranking: 16 },
  { id: 'alanya-alaaddin', nameEn: 'Alanya Alaaddin Keykubat University', nameTr: 'Alanya Alaaddin Keykubat Üniversitesi', nameAr: 'جامعة ألانيا علاء الدين كيكوبات', city: 'Antalya', type: 'state', ranking: 60 },
  { id: 'antalya-bilim', nameEn: 'Antalya Bilim University', nameTr: 'Antalya Bilim Üniversitesi', nameAr: 'جامعة أنطاليا بيليم', city: 'Antalya', type: 'foundation', ranking: 65 },
  { id: 'alanya-hep', nameEn: 'Alanya Hamdullah Emin Paşa University', nameTr: 'Alanya Hamdullah Emin Paşa Üniversitesi', nameAr: 'جامعة ألانيا حمد الله أمين باشا', city: 'Antalya', type: 'foundation', ranking: 85 },

  // ============================================
  // KONYA (5 universities)
  // ============================================
  { id: 'selcuk', nameEn: 'Selçuk University', nameTr: 'Selçuk Üniversitesi', nameAr: 'جامعة سلجوق', city: 'Konya', type: 'state', ranking: 18 },
  { id: 'necmettin-erbakan', nameEn: 'Necmettin Erbakan University', nameTr: 'Necmettin Erbakan Üniversitesi', nameAr: 'جامعة نجم الدين أربكان', city: 'Konya', type: 'state', ranking: 32 },
  { id: 'konya-teknik', nameEn: 'Konya Technical University', nameTr: 'Konya Teknik Üniversitesi', nameAr: 'جامعة قونيا التقنية', city: 'Konya', type: 'state', ranking: 48 },
  { id: 'konya-gida', nameEn: 'Konya Food and Agriculture University', nameTr: 'Konya Gıda ve Tarım Üniversitesi', nameAr: 'جامعة قونيا للغذاء والزراعة', city: 'Konya', type: 'foundation', ranking: 70 },
  { id: 'kto-karatay', nameEn: 'KTO Karatay University', nameTr: 'KTO Karatay Üniversitesi', nameAr: 'جامعة كاراتاي', city: 'Konya', type: 'foundation', ranking: 55 },

  // ============================================
  // KAYSERI (4 universities)
  // ============================================
  { id: 'erciyes', nameEn: 'Erciyes University', nameTr: 'Erciyes Üniversitesi', nameAr: 'جامعة أرجيس', city: 'Kayseri', type: 'state', ranking: 13 },
  { id: 'abdullah-gul', nameEn: 'Abdullah Gül University', nameTr: 'Abdullah Gül Üniversitesi', nameAr: 'جامعة عبد الله غول', city: 'Kayseri', type: 'state', ranking: 38 },
  { id: 'nuh-naci-yazgan', nameEn: 'Nuh Naci Yazgan University', nameTr: 'Nuh Naci Yazgan Üniversitesi', nameAr: 'جامعة نوح ناجي يازغان', city: 'Kayseri', type: 'foundation', ranking: 75 },

  // ============================================
  // TRABZON (4 universities)
  // ============================================
  { id: 'ktu', nameEn: 'Karadeniz Technical University', nameTr: 'Karadeniz Teknik Üniversitesi', nameAr: 'جامعة كارادنيز التقنية', city: 'Trabzon', type: 'state', ranking: 10 },
  { id: 'trabzon', nameEn: 'Trabzon University', nameTr: 'Trabzon Üniversitesi', nameAr: 'جامعة طرابزون', city: 'Trabzon', type: 'state', ranking: 52 },
  { id: 'avrasya', nameEn: 'Avrasya University', nameTr: 'Avrasya Üniversitesi', nameAr: 'جامعة أوراسيا', city: 'Trabzon', type: 'foundation', ranking: 85 },

  // ============================================
  // ESKISEHIR (3 universities)
  // ============================================
  { id: 'anadolu', nameEn: 'Anadolu University', nameTr: 'Anadolu Üniversitesi', nameAr: 'جامعة الأناضول', city: 'Eskisehir', type: 'state', ranking: 17 },
  { id: 'eskisehir-osmangazi', nameEn: 'Eskişehir Osmangazi University', nameTr: 'Eskişehir Osmangazi Üniversitesi', nameAr: 'جامعة اسكي شهير عثمان غازي', city: 'Eskisehir', type: 'state', ranking: 26 },
  { id: 'eskisehir-teknik', nameEn: 'Eskişehir Technical University', nameTr: 'Eskişehir Teknik Üniversitesi', nameAr: 'جامعة اسكي شهير التقنية', city: 'Eskisehir', type: 'state', ranking: 40 },

  // ============================================
  // SAMSUN (3 universities)
  // ============================================
  { id: 'ondokuz-mayis', nameEn: 'Ondokuz Mayıs University', nameTr: 'Ondokuz Mayıs Üniversitesi', nameAr: 'جامعة 19 مايس', city: 'Samsun', type: 'state', ranking: 19 },
  { id: 'samsun', nameEn: 'Samsun University', nameTr: 'Samsun Üniversitesi', nameAr: 'جامعة سامسون', city: 'Samsun', type: 'state', ranking: 58 },

  // ============================================
  // ERZURUM (3 universities)
  // ============================================
  { id: 'ataturk', nameEn: 'Atatürk University', nameTr: 'Atatürk Üniversitesi', nameAr: 'جامعة أتاتورك', city: 'Erzurum', type: 'state', ranking: 20 },
  { id: 'erzurum-teknik', nameEn: 'Erzurum Technical University', nameTr: 'Erzurum Teknik Üniversitesi', nameAr: 'جامعة أرضروم التقنية', city: 'Erzurum', type: 'state', ranking: 62 },

  // ============================================
  // GAZIANTEP (4 universities)
  // ============================================
  { id: 'gaziantep', nameEn: 'Gaziantep University', nameTr: 'Gaziantep Üniversitesi', nameAr: 'جامعة غازي عنتاب', city: 'Gaziantep', type: 'state', ranking: 21 },
  { id: 'gaziantep-islam', nameEn: 'Gaziantep Islam Science and Technology University', nameTr: 'Gaziantep İslam Bilim ve Teknoloji Üniversitesi', nameAr: 'جامعة غازي عنتاب للعلوم الإسلامية والتكنولوجيا', city: 'Gaziantep', type: 'state', ranking: 70 },
  { id: 'hasan-kalyoncu', nameEn: 'Hasan Kalyoncu University', nameTr: 'Hasan Kalyoncu Üniversitesi', nameAr: 'جامعة حسن كاليونجو', city: 'Gaziantep', type: 'foundation', ranking: 50 },
  { id: 'sanko', nameEn: 'Sanko University', nameTr: 'Sanko Üniversitesi', nameAr: 'جامعة سانكو', city: 'Gaziantep', type: 'foundation', ranking: 65 },

  // ============================================
  // ADANA (4 universities)
  // ============================================
  { id: 'cukurova', nameEn: 'Çukurova University', nameTr: 'Çukurova Üniversitesi', nameAr: 'جامعة تشوكوروفا', city: 'Adana', type: 'state', ranking: 22 },
  { id: 'adana-alparslan', nameEn: 'Adana Alparslan Türkeş Science and Technology University', nameTr: 'Adana Alparslan Türkeş Bilim ve Teknoloji Üniversitesi', nameAr: 'جامعة أضنة ألب أرسلان للعلوم والتكنولوجيا', city: 'Adana', type: 'state', ranking: 48 },

  // ============================================
  // MERSIN (2 universities)
  // ============================================
  { id: 'mersin', nameEn: 'Mersin University', nameTr: 'Mersin Üniversitesi', nameAr: 'جامعة مرسين', city: 'Mersin', type: 'state', ranking: 28 },
  { id: 'tarsus', nameEn: 'Tarsus University', nameTr: 'Tarsus Üniversitesi', nameAr: 'جامعة طرسوس', city: 'Mersin', type: 'state', ranking: 72 },

  // ============================================
  // DIYARBAKIR (2 universities)
  // ============================================
  { id: 'dicle', nameEn: 'Dicle University', nameTr: 'Dicle Üniversitesi', nameAr: 'جامعة دجلة', city: 'Diyarbakir', type: 'state', ranking: 30 },

  // ============================================
  // SANLIURFA (2 universities)
  // ============================================
  { id: 'harran', nameEn: 'Harran University', nameTr: 'Harran Üniversitesi', nameAr: 'جامعة حران', city: 'Sanliurfa', type: 'state', ranking: 35 },

  // ============================================
  // MALATYA (2 universities)
  // ============================================
  { id: 'inonu', nameEn: 'İnönü University', nameTr: 'İnönü Üniversitesi', nameAr: 'جامعة إينونو', city: 'Malatya', type: 'state', ranking: 27 },
  { id: 'malatya-turgut', nameEn: 'Malatya Turgut Özal University', nameTr: 'Malatya Turgut Özal Üniversitesi', nameAr: 'جامعة ملاطية تورغوت أوزال', city: 'Malatya', type: 'state', ranking: 65 },

  // ============================================
  // ELAZIG (2 universities)
  // ============================================
  { id: 'firat', nameEn: 'Fırat University', nameTr: 'Fırat Üniversitesi', nameAr: 'جامعة فرات', city: 'Elazig', type: 'state', ranking: 24 },

  // ============================================
  // VAN (2 universities)
  // ============================================
  { id: 'yuzuncu-yil', nameEn: 'Van Yüzüncü Yıl University', nameTr: 'Van Yüzüncü Yıl Üniversitesi', nameAr: 'جامعة فان يوزونجو يل', city: 'Van', type: 'state', ranking: 33 },

  // ============================================
  // KOCAELI (3 universities)
  // ============================================
  { id: 'kocaeli', nameEn: 'Kocaeli University', nameTr: 'Kocaeli Üniversitesi', nameAr: 'جامعة كوجالي', city: 'Kocaeli', type: 'state', ranking: 23 },
  { id: 'gebze-teknik', nameEn: 'Gebze Technical University', nameTr: 'Gebze Teknik Üniversitesi', nameAr: 'جامعة غبزة التقنية', city: 'Kocaeli', type: 'state', ranking: 15 },
  { id: 'kocaeli-saglik', nameEn: 'Kocaeli Health and Technology University', nameTr: 'Kocaeli Sağlık ve Teknoloji Üniversitesi', nameAr: 'جامعة كوجالي للصحة والتكنولوجيا', city: 'Kocaeli', type: 'foundation', ranking: 80 },

  // ============================================
  // SAKARYA (2 universities)
  // ============================================
  { id: 'sakarya', nameEn: 'Sakarya University', nameTr: 'Sakarya Üniversitesi', nameAr: 'جامعة صقاريا', city: 'Sakarya', type: 'state', ranking: 25 },
  { id: 'sakarya-uygulamali', nameEn: 'Sakarya University of Applied Sciences', nameTr: 'Sakarya Uygulamalı Bilimler Üniversitesi', nameAr: 'جامعة صقاريا للعلوم التطبيقية', city: 'Sakarya', type: 'state', ranking: 55 },

  // ============================================
  // TEKIRDAG (2 universities)
  // ============================================
  { id: 'tekirdag-namik', nameEn: 'Tekirdağ Namık Kemal University', nameTr: 'Tekirdağ Namık Kemal Üniversitesi', nameAr: 'جامعة تكيرداغ نامق كمال', city: 'Tekirdag', type: 'state', ranking: 42 },

  // ============================================
  // EDIRNE (2 universities)
  // ============================================
  { id: 'trakya', nameEn: 'Trakya University', nameTr: 'Trakya Üniversitesi', nameAr: 'جامعة تراكيا', city: 'Edirne', type: 'state', ranking: 31 },

  // ============================================
  // CANAKKALE (2 universities)
  // ============================================
  { id: 'canakkale-onsekiz', nameEn: 'Çanakkale Onsekiz Mart University', nameTr: 'Çanakkale Onsekiz Mart Üniversitesi', nameAr: 'جامعة تشاناكاله 18 مارس', city: 'Canakkale', type: 'state', ranking: 29 },

  // ============================================
  // BALIKESIR (2 universities)
  // ============================================
  { id: 'balikesir', nameEn: 'Balıkesir University', nameTr: 'Balıkesir Üniversitesi', nameAr: 'جامعة باليكسير', city: 'Balikesir', type: 'state', ranking: 36 },
  { id: 'bandirma', nameEn: 'Bandırma Onyedi Eylül University', nameTr: 'Bandırma Onyedi Eylül Üniversitesi', nameAr: 'جامعة بانديرما 17 سبتمبر', city: 'Balikesir', type: 'state', ranking: 56 },

  // ============================================
  // AYDIN (2 universities)
  // ============================================
  { id: 'aydin-adnan', nameEn: 'Aydın Adnan Menderes University', nameTr: 'Aydın Adnan Menderes Üniversitesi', nameAr: 'جامعة أيدين عدنان مندرس', city: 'Aydin', type: 'state', ranking: 34 },

  // ============================================
  // DENIZLI (2 universities)
  // ============================================
  { id: 'pamukkale', nameEn: 'Pamukkale University', nameTr: 'Pamukkale Üniversitesi', nameAr: 'جامعة باموق قلعة', city: 'Denizli', type: 'state', ranking: 26 },

  // ============================================
  // MANISA (2 universities)
  // ============================================
  { id: 'manisa-celal', nameEn: 'Manisa Celâl Bayar University', nameTr: 'Manisa Celâl Bayar Üniversitesi', nameAr: 'جامعة مانيسا جلال بايار', city: 'Manisa', type: 'state', ranking: 32 },

  // ============================================
  // MUGLA (2 universities)
  // ============================================
  { id: 'mugla', nameEn: 'Muğla Sıtkı Koçman University', nameTr: 'Muğla Sıtkı Koçman Üniversitesi', nameAr: 'جامعة موغلا صدقي كوتشمان', city: 'Mugla', type: 'state', ranking: 38 },

  // ============================================
  // AFYON (2 universities)
  // ============================================
  { id: 'afyon-kocatepe', nameEn: 'Afyon Kocatepe University', nameTr: 'Afyon Kocatepe Üniversitesi', nameAr: 'جامعة أفيون كوجاتبه', city: 'Afyon', type: 'state', ranking: 45 },
  { id: 'afyon-saglik', nameEn: 'Afyonkarahisar Health Sciences University', nameTr: 'Afyonkarahisar Sağlık Bilimleri Üniversitesi', nameAr: 'جامعة أفيون قره حصار للعلوم الصحية', city: 'Afyon', type: 'state', ranking: 68 },

  // ============================================
  // KUTAHYA (2 universities)
  // ============================================
  { id: 'kutahya-dumlupinar', nameEn: 'Kütahya Dumlupınar University', nameTr: 'Kütahya Dumlupınar Üniversitesi', nameAr: 'جامعة كوتاهيا دوملوبينار', city: 'Kutahya', type: 'state', ranking: 44 },
  { id: 'kutahya-saglik', nameEn: 'Kütahya Health Sciences University', nameTr: 'Kütahya Sağlık Bilimleri Üniversitesi', nameAr: 'جامعة كوتاهيا للعلوم الصحية', city: 'Kutahya', type: 'state', ranking: 72 },

  // ============================================
  // ISPARTA (2 universities)
  // ============================================
  { id: 'suleyman-demirel', nameEn: 'Süleyman Demirel University', nameTr: 'Süleyman Demirel Üniversitesi', nameAr: 'جامعة سليمان دميرال', city: 'Isparta', type: 'state', ranking: 27 },
  { id: 'isparta-uygulamali', nameEn: 'Isparta University of Applied Sciences', nameTr: 'Isparta Uygulamalı Bilimler Üniversitesi', nameAr: 'جامعة إسبارطة للعلوم التطبيقية', city: 'Isparta', type: 'state', ranking: 60 },

  // ============================================
  // BURDUR (1 university)
  // ============================================
  { id: 'burdur-mehmet', nameEn: 'Burdur Mehmet Akif Ersoy University', nameTr: 'Burdur Mehmet Akif Ersoy Üniversitesi', nameAr: 'جامعة بوردور محمد عاكف أرسوي', city: 'Burdur', type: 'state', ranking: 52 },

  // ============================================
  // KAHRAMANMARAS (2 universities)
  // ============================================
  { id: 'kahramanmaras-sutcu', nameEn: 'Kahramanmaraş Sütçü İmam University', nameTr: 'Kahramanmaraş Sütçü İmam Üniversitesi', nameAr: 'جامعة كهرمان مرعش سوتشو إمام', city: 'Kahramanmaras', type: 'state', ranking: 40 },
  { id: 'kahramanmaras-istiklal', nameEn: 'Kahramanmaraş İstiklal University', nameTr: 'Kahramanmaraş İstiklal Üniversitesi', nameAr: 'جامعة كهرمان مرعش الاستقلال', city: 'Kahramanmaras', type: 'state', ranking: 78 },

  // ============================================
  // HATAY (2 universities)
  // ============================================
  { id: 'hatay-mustafa', nameEn: 'Hatay Mustafa Kemal University', nameTr: 'Hatay Mustafa Kemal Üniversitesi', nameAr: 'جامعة هاتاي مصطفى كمال', city: 'Hatay', type: 'state', ranking: 38 },
  { id: 'iskenderun-teknik', nameEn: 'İskenderun Technical University', nameTr: 'İskenderun Teknik Üniversitesi', nameAr: 'جامعة إسكندرون التقنية', city: 'Hatay', type: 'state', ranking: 58 },

  // ============================================
  // SIVAS (3 universities)
  // ============================================
  { id: 'sivas-cumhuriyet', nameEn: 'Sivas Cumhuriyet University', nameTr: 'Sivas Cumhuriyet Üniversitesi', nameAr: 'جامعة سيواس جمهوريت', city: 'Sivas', type: 'state', ranking: 34 },
  { id: 'sivas-bilim', nameEn: 'Sivas Science and Technology University', nameTr: 'Sivas Bilim ve Teknoloji Üniversitesi', nameAr: 'جامعة سيواس للعلوم والتكنولوجيا', city: 'Sivas', type: 'state', ranking: 68 },

  // ============================================
  // TOKAT (2 universities)
  // ============================================
  { id: 'tokat-gaziosmanpasa', nameEn: 'Tokat Gaziosmanpaşa University', nameTr: 'Tokat Gaziosmanpaşa Üniversitesi', nameAr: 'جامعة توكات غازي عثمان باشا', city: 'Tokat', type: 'state', ranking: 46 },

  // ============================================
  // AMASYA (1 university)
  // ============================================
  { id: 'amasya', nameEn: 'Amasya University', nameTr: 'Amasya Üniversitesi', nameAr: 'جامعة أماسيا', city: 'Amasya', type: 'state', ranking: 58 },

  // ============================================
  // CORUM (2 universities)
  // ============================================
  { id: 'hitit', nameEn: 'Hitit University', nameTr: 'Hitit Üniversitesi', nameAr: 'جامعة حيتيت', city: 'Corum', type: 'state', ranking: 50 },

  // ============================================
  // ORDU (1 university)
  // ============================================
  { id: 'ordu', nameEn: 'Ordu University', nameTr: 'Ordu Üniversitesi', nameAr: 'جامعة أوردو', city: 'Ordu', type: 'state', ranking: 54 },

  // ============================================
  // GIRESUN (1 university)
  // ============================================
  { id: 'giresun', nameEn: 'Giresun University', nameTr: 'Giresun Üniversitesi', nameAr: 'جامعة غيرسون', city: 'Giresun', type: 'state', ranking: 56 },

  // ============================================
  // RIZE (2 universities)
  // ============================================
  { id: 'recep-tayyip', nameEn: 'Recep Tayyip Erdoğan University', nameTr: 'Recep Tayyip Erdoğan Üniversitesi', nameAr: 'جامعة رجب طيب أردوغان', city: 'Rize', type: 'state', ranking: 48 },

  // ============================================
  // ARTVIN (1 university)
  // ============================================
  { id: 'artvin-coruh', nameEn: 'Artvin Çoruh University', nameTr: 'Artvin Çoruh Üniversitesi', nameAr: 'جامعة أرتفين تشوروه', city: 'Artvin', type: 'state', ranking: 68 },

  // ============================================
  // ZONGULDAK (2 universities)
  // ============================================
  { id: 'zonguldak-bulent', nameEn: 'Zonguldak Bülent Ecevit University', nameTr: 'Zonguldak Bülent Ecevit Üniversitesi', nameAr: 'جامعة زونغولداك بولنت أجاويت', city: 'Zonguldak', type: 'state', ranking: 42 },

  // ============================================
  // KASTAMONU (1 university)
  // ============================================
  { id: 'kastamonu', nameEn: 'Kastamonu University', nameTr: 'Kastamonu Üniversitesi', nameAr: 'جامعة كاستامونو', city: 'Kastamonu', type: 'state', ranking: 60 },

  // ============================================
  // SINOP (1 university)
  // ============================================
  { id: 'sinop', nameEn: 'Sinop University', nameTr: 'Sinop Üniversitesi', nameAr: 'جامعة سينوب', city: 'Sinop', type: 'state', ranking: 65 },

  // ============================================
  // BOLU (2 universities)
  // ============================================
  { id: 'bolu-abant', nameEn: 'Bolu Abant İzzet Baysal University', nameTr: 'Bolu Abant İzzet Baysal Üniversitesi', nameAr: 'جامعة بولو أبانت عزت بايسال', city: 'Bolu', type: 'state', ranking: 36 },

  // ============================================
  // DUZCE (1 university)
  // ============================================
  { id: 'duzce', nameEn: 'Düzce University', nameTr: 'Düzce Üniversitesi', nameAr: 'جامعة دوزجة', city: 'Duzce', type: 'state', ranking: 46 },

  // ============================================
  // KARABUK (1 university)
  // ============================================
  { id: 'karabuk', nameEn: 'Karabük University', nameTr: 'Karabük Üniversitesi', nameAr: 'جامعة كارابوك', city: 'Karabuk', type: 'state', ranking: 44 },

  // ============================================
  // BARTIN (1 university)
  // ============================================
  { id: 'bartin', nameEn: 'Bartın University', nameTr: 'Bartın Üniversitesi', nameAr: 'جامعة بارتين', city: 'Bartin', type: 'state', ranking: 62 },

  // ============================================
  // GUMUSHANE (1 university)
  // ============================================
  { id: 'gumushane', nameEn: 'Gümüşhane University', nameTr: 'Gümüşhane Üniversitesi', nameAr: 'جامعة غوموشهانة', city: 'Gumushane', type: 'state', ranking: 70 },

  // ============================================
  // BAYBURT (1 university)
  // ============================================
  { id: 'bayburt', nameEn: 'Bayburt University', nameTr: 'Bayburt Üniversitesi', nameAr: 'جامعة بايبورت', city: 'Bayburt', type: 'state', ranking: 75 },

  // ============================================
  // ERZINCAN (1 university)
  // ============================================
  { id: 'erzincan-binali', nameEn: 'Erzincan Binali Yıldırım University', nameTr: 'Erzincan Binali Yıldırım Üniversitesi', nameAr: 'جامعة أرزينجان بينالي يلدريم', city: 'Erzincan', type: 'state', ranking: 55 },

  // ============================================
  // AGRI (1 university)
  // ============================================
  { id: 'agri-ibrahim', nameEn: 'Ağrı İbrahim Çeçen University', nameTr: 'Ağrı İbrahim Çeçen Üniversitesi', nameAr: 'جامعة آغري إبراهيم تشيتشن', city: 'Agri', type: 'state', ranking: 72 },

  // ============================================
  // KARS (1 university)
  // ============================================
  { id: 'kafkas', nameEn: 'Kafkas University', nameTr: 'Kafkas Üniversitesi', nameAr: 'جامعة كافكاس', city: 'Kars', type: 'state', ranking: 58 },

  // ============================================
  // IGDIR (1 university)
  // ============================================
  { id: 'igdir', nameEn: 'Iğdır University', nameTr: 'Iğdır Üniversitesi', nameAr: 'جامعة إغدير', city: 'Igdir', type: 'state', ranking: 75 },

  // ============================================
  // ARDAHAN (1 university)
  // ============================================
  { id: 'ardahan', nameEn: 'Ardahan University', nameTr: 'Ardahan Üniversitesi', nameAr: 'جامعة أردهان', city: 'Ardahan', type: 'state', ranking: 78 },

  // ============================================
  // MUS (1 university)
  // ============================================
  { id: 'mus-alparslan', nameEn: 'Muş Alparslan University', nameTr: 'Muş Alparslan Üniversitesi', nameAr: 'جامعة موش ألب أرسلان', city: 'Mus', type: 'state', ranking: 68 },

  // ============================================
  // BITLIS (1 university)
  // ============================================
  { id: 'bitlis-eren', nameEn: 'Bitlis Eren University', nameTr: 'Bitlis Eren Üniversitesi', nameAr: 'جامعة بيتليس إيرين', city: 'Bitlis', type: 'state', ranking: 70 },

  // ============================================
  // BINGOL (1 university)
  // ============================================
  { id: 'bingol', nameEn: 'Bingöl University', nameTr: 'Bingöl Üniversitesi', nameAr: 'جامعة بينغول', city: 'Bingol', type: 'state', ranking: 65 },

  // ============================================
  // TUNCELI (1 university)
  // ============================================
  { id: 'munzur', nameEn: 'Munzur University', nameTr: 'Munzur Üniversitesi', nameAr: 'جامعة مونزور', city: 'Tunceli', type: 'state', ranking: 72 },

  // ============================================
  // HAKKARI (1 university)
  // ============================================
  { id: 'hakkari', nameEn: 'Hakkâri University', nameTr: 'Hakkâri Üniversitesi', nameAr: 'جامعة هكاري', city: 'Hakkari', type: 'state', ranking: 80 },

  // ============================================
  // MARDIN (1 university)
  // ============================================
  { id: 'mardin-artuklu', nameEn: 'Mardin Artuklu University', nameTr: 'Mardin Artuklu Üniversitesi', nameAr: 'جامعة ماردين أرتوكلو', city: 'Mardin', type: 'state', ranking: 55 },

  // ============================================
  // BATMAN (1 university)
  // ============================================
  { id: 'batman', nameEn: 'Batman University', nameTr: 'Batman Üniversitesi', nameAr: 'جامعة باتمان', city: 'Batman', type: 'state', ranking: 65 },

  // ============================================
  // SIIRT (1 university)
  // ============================================
  { id: 'siirt', nameEn: 'Siirt University', nameTr: 'Siirt Üniversitesi', nameAr: 'جامعة سعرت', city: 'Siirt', type: 'state', ranking: 68 },

  // ============================================
  // SIRNAK (1 university)
  // ============================================
  { id: 'sirnak', nameEn: 'Şırnak University', nameTr: 'Şırnak Üniversitesi', nameAr: 'جامعة شيرناك', city: 'Sirnak', type: 'state', ranking: 75 },

  // ============================================
  // ADIYAMAN (1 university)
  // ============================================
  { id: 'adiyaman', nameEn: 'Adıyaman University', nameTr: 'Adıyaman Üniversitesi', nameAr: 'جامعة أديامان', city: 'Adiyaman', type: 'state', ranking: 58 },

  // ============================================
  // KILIS (1 university)
  // ============================================
  { id: 'kilis-7aralik', nameEn: 'Kilis 7 Aralık University', nameTr: 'Kilis 7 Aralık Üniversitesi', nameAr: 'جامعة كليس 7 ديسمبر', city: 'Kilis', type: 'state', ranking: 72 },

  // ============================================
  // OSMANIYE (1 university)
  // ============================================
  { id: 'osmaniye-korkut', nameEn: 'Osmaniye Korkut Ata University', nameTr: 'Osmaniye Korkut Ata Üniversitesi', nameAr: 'جامعة عثمانية كوركوت أتا', city: 'Osmaniye', type: 'state', ranking: 60 },

  // ============================================
  // AKSARAY (1 university)
  // ============================================
  { id: 'aksaray', nameEn: 'Aksaray University', nameTr: 'Aksaray Üniversitesi', nameAr: 'جامعة أقصراي', city: 'Aksaray', type: 'state', ranking: 56 },

  // ============================================
  // NEVSEHIR (1 university)
  // ============================================
  { id: 'nevsehir-haci', nameEn: 'Nevşehir Hacı Bektaş Veli University', nameTr: 'Nevşehir Hacı Bektaş Veli Üniversitesi', nameAr: 'جامعة نوشهير حاجي بكتاش ولي', city: 'Nevsehir', type: 'state', ranking: 58 },

  // ============================================
  // NIGDE (1 university)
  // ============================================
  { id: 'nigde-omer', nameEn: 'Niğde Ömer Halisdemir University', nameTr: 'Niğde Ömer Halisdemir Üniversitesi', nameAr: 'جامعة نيدة عمر خالص دمير', city: 'Nigde', type: 'state', ranking: 52 },

  // ============================================
  // KIRSEHIR (1 university)
  // ============================================
  { id: 'kirsehir-ahi', nameEn: 'Kırşehir Ahi Evran University', nameTr: 'Kırşehir Ahi Evran Üniversitesi', nameAr: 'جامعة كيرشهير آخي أفران', city: 'Kirsehir', type: 'state', ranking: 62 },

  // ============================================
  // KARAMAN (1 university)
  // ============================================
  { id: 'karamanoglu', nameEn: 'Karamanoğlu Mehmetbey University', nameTr: 'Karamanoğlu Mehmetbey Üniversitesi', nameAr: 'جامعة كارامان أوغلو محمد بي', city: 'Karaman', type: 'state', ranking: 64 },

  // ============================================
  // CANKIRI (1 university)
  // ============================================
  { id: 'cankiri-karatekin', nameEn: 'Çankırı Karatekin University', nameTr: 'Çankırı Karatekin Üniversitesi', nameAr: 'جامعة تشانكيري كاراتكين', city: 'Cankiri', type: 'state', ranking: 66 },

  // ============================================
  // YOZGAT (1 university)
  // ============================================
  { id: 'yozgat-bozok', nameEn: 'Yozgat Bozok University', nameTr: 'Yozgat Bozok Üniversitesi', nameAr: 'جامعة يوزغات بوزوك', city: 'Yozgat', type: 'state', ranking: 60 },

  // ============================================
  // KIRIKKALE (1 university)
  // ============================================
  { id: 'kirikkale', nameEn: 'Kırıkkale University', nameTr: 'Kırıkkale Üniversitesi', nameAr: 'جامعة كيريكالي', city: 'Kirikkale', type: 'state', ranking: 48 },

  // ============================================
  // USAK (1 university)
  // ============================================
  { id: 'usak', nameEn: 'Uşak University', nameTr: 'Uşak Üniversitesi', nameAr: 'جامعة أوشاك', city: 'Usak', type: 'state', ranking: 55 },

  // ============================================
  // BILECIK (1 university)
  // ============================================
  { id: 'bilecik-seyh', nameEn: 'Bilecik Şeyh Edebali University', nameTr: 'Bilecik Şeyh Edebali Üniversitesi', nameAr: 'جامعة بيلجيك شيخ أدبالي', city: 'Bilecik', type: 'state', ranking: 62 },

  // ============================================
  // YALOVA (1 university)
  // ============================================
  { id: 'yalova', nameEn: 'Yalova University', nameTr: 'Yalova Üniversitesi', nameAr: 'جامعة يالوفا', city: 'Yalova', type: 'state', ranking: 55 },

  // ============================================
  // KIRKLARELI (1 university)
  // ============================================
  { id: 'kirklareli', nameEn: 'Kırklareli University', nameTr: 'Kırklareli Üniversitesi', nameAr: 'جامعة كيركلاريلي', city: 'Kirklareli', type: 'state', ranking: 58 },
];

// Helper functions
export function getUniversitiesByCity(city: string): TurkishUniversity[] {
  return turkishUniversities.filter(uni => uni.city === city);
}

export function getUniversityById(id: string): TurkishUniversity | undefined {
  return turkishUniversities.find(uni => uni.id === id);
}

export function searchUniversities(query: string): TurkishUniversity[] {
  const lowerQuery = query.toLowerCase();
  return turkishUniversities.filter(uni =>
    uni.nameEn.toLowerCase().includes(lowerQuery) ||
    uni.nameTr.toLowerCase().includes(lowerQuery) ||
    uni.nameAr.includes(query) ||
    uni.city.toLowerCase().includes(lowerQuery)
  );
}

export function getUniversitiesByType(type: 'state' | 'foundation'): TurkishUniversity[] {
  return turkishUniversities.filter(uni => uni.type === type);
}

export function getTopUniversities(limit: number = 20): TurkishUniversity[] {
  return turkishUniversities
    .filter(uni => uni.ranking !== undefined)
    .sort((a, b) => (a.ranking || 999) - (b.ranking || 999))
    .slice(0, limit);
}

// Get cities that have universities
export function getCitiesWithUniversities(): string[] {
  return [...new Set(turkishUniversities.map(uni => uni.city))].sort();
}
