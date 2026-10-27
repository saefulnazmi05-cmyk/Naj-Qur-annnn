import type { PrayerStep } from '../types/quran';

export interface PrayerRakaatSummary {
  name: string;
  rakaat: number;
  time: string;
  notes: string;
}

export const PRAYER_RAKAAT_LIST: PrayerRakaatSummary[] = [
  { name: 'Salat Subuh', rakaat: 2, time: 'Fajar shadiq hingga terbit matahari', notes: 'Membaca doa qunut pada rakaat kedua menurut madzhab Syafi’i (sunnah muakkadah).' },
  { name: 'Salat Zuhur', rakaat: 4, time: 'Matahari tergelincir ke barat hingga bayangan sama panjang', notes: 'Tasyahud awal pada rakaat ke-2, tasyahud akhir pada rakaat ke-4. Bacaan sirr (pelan).' },
  { name: 'Salat Asar', rakaat: 4, time: 'Bayangan melebihi panjang benda hingga sebelum terbenam matahari', notes: 'Tasyahud awal pada rakaat ke-2, tasyahud akhir pada rakaat ke-4. Bacaan sirr (pelan).' },
  { name: 'Salat Magrib', rakaat: 3, time: 'Terbenam matahari hingga hilangnya mega merah', notes: 'Tasyahud awal pada rakaat ke-2, tasyahud akhir pada rakaat ke-3. Bacaan jahar (keras) pada rakaat 1 & 2.' },
  { name: 'Salat Isya', rakaat: 4, time: 'Hilangnya mega merah hingga pertengahan malam', notes: 'Tasyahud awal pada rakaat ke-2, tasyahud akhir pada rakaat ke-4. Bacaan jahar (keras) pada rakaat 1 & 2.' },
];

export const PRAYER_STEPS_DATA: PrayerStep[] = [
  // 1. Syarat Sah & Persiapan
  {
    id: 'syarat-salat',
    stepNumber: 1,
    title: 'Syarat Sah & Rukun Salat',
    category: 'persiapan',
    arabic: 'يَا بَنِي آدَمَ خُذُوا زِينَتَكُمْ عِنْدَ كُلِّ مَسْجِدٍ',
    latin: 'Yā banī ādama khużū zīnatakum ‘inda kulli masjid.',
    translation: 'Wahai anak cucu Adam, pakailah pakaianmu yang bagus pada setiap (memasuki) masjid.',
    explanation: 'Syarat sah salat meliputi: Beragama Islam, baligh & berakal, suci dari hadas kecil dan besar, suci badan, pakaian dan tempat dari najis, menutup aurat secara sempurna, masuk waktu salat, dan menghadap kiblat.',
    fiqhNote: 'Rukun salat adalah perkara wajib yang tidak boleh ditinggalkan; jika ditinggalkan dengan sengaja maka salat batal.',
  },

  // 2. Wudu Ringkas
  {
    id: 'tata-cara-wudu',
    stepNumber: 2,
    title: 'Bersuci & Tata Cara Wudu',
    category: 'wudu',
    arabic: 'لَا يَقْبَلُ اللَّهُ صَلَاةَ أَحَدِكُمْ إِذَا أَحْدَثَ حَتَّى يَتَوَضَّأَ',
    latin: 'Lā yaqbalullāhu ṣalāta aḥadikum iżā aḥdaṡa ḥattā yatawaḍḍa’.',
    translation: 'Allah tidak menerima salat salah seorang di antara kalian jika ia berhadas hingga ia berwudu.',
    explanation: 'Urutan wudu: (1) Niat & basuh telapak tangan sembari mengucap bismillah, (2) Berkumur dan istinsyaq (memasukkan air ke hidung), (3) Membasuh seluruh wajah, (4) Membasuh kedua tangan sampai siku, (5) Mengusap sebagian/seluruh kepala & kedua telinga, (6) Membasuh kedua kaki sampai mata kaki secara tertib.',
    fiqhNote: 'Hal yang membatalkan wudu: Keluarnya sesuatu dari qubul/dubur, tidur lelap tanpa menempelkan pantat, hilang akal, dan bersentuhan kulit bukan mahram menurut madzhab Syafi’i.',
  },

  // 3. Niat
  {
    id: 'niat-salat',
    stepNumber: 3,
    title: 'Niat Salat (Dalam Hati)',
    category: 'gerakan',
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    latin: 'Innamal-a‘mālu bin-niyyāti wa innamā likullimri’in mā nawā.',
    translation: 'Sesungguhnya setiap amalan bergantung pada niatnya, dan setiap orang akan mendapatkan sesuai apa yang dia niatkan.',
    explanation: 'Tempat niat adalah di dalam hati bersamaan dengan takbiratul ihram. Menghadirkan kesadaran penuh bahwa kita sedang menunaikan salat wajib (misal: Subuh 2 rakaat) karena Allah Ta’ala.',
    fiqhNote: 'Melafalkan lafaz niat (ushalli...) hukumnya sunnah menurut mayoritas ulama Syafi’iyyah untuk membantu memantapkan konsentrasi hati.',
  },

  // 4. Takbiratul Ihram
  {
    id: 'takbiratul-ihram',
    stepNumber: 4,
    title: 'Takbiratul Ihram',
    category: 'gerakan',
    arabic: 'اللَّهُ أَكْبَرُ',
    latin: 'Allāhu Akbar.',
    translation: 'Allah Maha Besar.',
    explanation: 'Berdiri tegak menghadap kiblat, mengangkat kedua tangan sejajar daun telinga atau bahu dengan jari-jari terbuka menghadap kiblat, sembari mengucapkan "Allahu Akbar". Pandangan diarahkan ke tempat sujud.',
    fiqhNote: 'Takbiratul ihram adalah rukun qawli (ucapan yang wajib terdengar oleh telinga sendiri minimal).',
  },

  // 5. Bersedekap & Doa Iftitah
  {
    id: 'bersedekap-iftitah',
    stepNumber: 5,
    title: 'Bersedekap & Doa Iftitah',
    category: 'gerakan',
    arabic: 'اللَّهُ أَكْبَرُ كَبِيرًا، وَالْحَمْدُ لِلَّهِ كَثِيرًا، وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا. إِنِّي وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا مُسْلِمًا وَمَا أَنَا مِنَ الْمُشْرِكِينَ',
    latin: 'Allāhu akbaru kabīrā, wal-ḥamdu lillāhi kaṡīrā, wa subḥānallāhi bukrataw-wa aṣīlā. Innī wajjahtu wajhiya lillażī faṭaras-samāwāti wal-arḍa ḥanīfam-muslimaw-wa mā ana minal-musyrikīn.',
    translation: 'Allah Maha Besar dengan sebesar-besarnya, segala puji bagi Allah sebanyak-banyaknya, dan Maha Suci Allah pagi dan petang. Sesungguhnya aku hadapkan wajahku kepada Dzat yang menciptakan langit dan bumi dengan lurus dan berserah diri, dan aku bukanlah termasuk orang-orang musyrik.',
    explanation: 'Meletakkan tangan kanan di atas punggung tangan kiri di atas dada atau di bawah dada di atas pusar. Membaca doa iftitah secara sunnah dan khusyuk.',
    fiqhNote: 'Boleh juga membaca lafaz iftitah riwayat Bukhari-Muslim: "Allāhumma bā‘id bainī wa baina khaṭāyāya..."',
  },

  // 6. Al-Fatihah
  {
    id: 'baca-alfatihah',
    stepNumber: 6,
    title: 'Membaca Surat Al-Fatihah & Surat Pendek',
    category: 'gerakan',
    arabic: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ. الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ...',
    latin: 'Bismillāhir-raḥmānir-raḥīm. Al-ḥamdu lillāhi rabbil-‘ālamīn...',
    translation: 'Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan seluruh alam...',
    explanation: 'Membaca Al-Fatihah adalah rukun salat pada setiap rakaat. Harus dibaca dengan tartil, menjaga tajwid dan harakatnya tanpa tergesa-gesa. Diakhiri dengan mengucap "Aamiin", lalu dilanjutkan membaca surat atau ayat Al-Qur’an pada rakaat 1 dan 2.',
    fiqhNote: 'Nabi SAW bersabda: "Tidak ada salat bagi orang yang tidak membaca Fatihatul Kitab (Surat Al-Fatihah)." (HR. Bukhari no. 756).',
  },

  // 7. Rukuk
  {
    id: 'rukuk-thumaninah',
    stepNumber: 7,
    title: 'Rukuk dengan Thuma’ninah',
    category: 'gerakan',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ',
    latin: 'Subḥāna rabbiyal-‘aẓīmi wa biḥamdih (dibaca 3x).',
    translation: 'Maha Suci Tuhanku Yang Maha Agung dan dengan memuji-Nya.',
    explanation: 'Mengangkat tangan sambil bertakbir, lalu membungkukkan badan hingga punggung dan kepala lurus mendatar. Kedua telapak tangan memegang lutut dengan jari-jari renggang. Wajib thuma’ninah (diam sejenak dengan tenang minimal selama bacaan tasbih).',
    fiqhNote: 'Thuma’ninah adalah rukun salat yang krusial; salat yang dilakukan terburu-buru tanpa thuma’ninah tidak sah.',
  },

  // 8. I'tidal
  {
    id: 'itidal-thumaninah',
    stepNumber: 8,
    title: 'I’tidal (Bangkit dari Rukuk)',
    category: 'gerakan',
    arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ. رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ',
    latin: 'Sami‘allāhu liman ḥamidah. Rabbanā lakal-ḥamdu mil’as-samāwāti wa mil’al-arḍi wa mil’a mā syi’ta min syai’in ba‘d.',
    translation: 'Allah mendengar orang yang memuji-Nya. Ya Tuhan kami, bagi-Mu segala puji sepenuh langit dan sepenuh bumi dan sepenuh apa yang Engkau kehendaki setelah itu.',
    explanation: 'Bangkit dari rukuk tegak lurus sembari mengangkat kedua tangan dan mengucap "Sami’allahu liman hamidah", lalu menurunkan tangan dengan tenang (thuma’ninah) membaca doa tahmid.',
  },

  // 9. Sujud
  {
    id: 'sujud-thumaninah',
    stepNumber: 9,
    title: 'Sujud Pertama & Kedua',
    category: 'gerakan',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
    latin: 'Subḥāna rabbiyal-a‘lā wa biḥamdih (dibaca 3x).',
    translation: 'Maha Suci Tuhanku Yang Maha Tinggi dan dengan memuji-Nya.',
    explanation: 'Bertakbir turun bersujud dengan 7 anggota badan menempel ke lantai: dahi bersama hidung, kedua telapak tangan, kedua lutut, dan ujung jari-jari kedua kaki menghadap kiblat. Lengan direnggangkan dari lambung dan perut tidak menempel ke paha.',
    fiqhNote: 'Rasulullah SAW bersabda: "Keadaan yang paling dekat antara seorang hamba dengan Tuhannya adalah ketika ia bersujud, maka perbanyaklah doa." (HR. Muslim).',
  },

  // 10. Duduk di Antara Dua Sujud
  {
    id: 'duduk-antara-dua-sujud',
    stepNumber: 10,
    title: 'Duduk di Antara Dua Sujud (Iftirasy)',
    category: 'gerakan',
    arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي',
    latin: 'Rabbigfir lī warḥamnī wajburnī warfa‘nī warzuqnī wahdinī wa ‘āfinī wa‘fu ‘annī.',
    translation: 'Wahai Tuhanku, ampunilah aku, rahmatilah aku, cukupkanlah kekuranganku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, sehatkanlah aku, dan maafkanlah aku.',
    explanation: 'Bangkit dari sujud pertama bertakbir, duduk di atas telapak kaki kiri yang dibentangkan, sedangkan kaki kanan ditegakkan dengan jari-jari menghadap kiblat (duduk iftirasy). Kedua tangan diletakkan di atas paha dekat lutut secara thuma’ninah.',
  },

  // 11. Tasyahud Awal
  {
    id: 'tasyahud-awal',
    stepNumber: 11,
    title: 'Tasyahud Awal (Rakaat ke-2)',
    category: 'gerakan',
    arabic: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ. أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللَّهِ. اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ',
    latin: 'At-taḥiyyātul-mubārakātuṣ-ṣalawātut-ṭayyibātu lillāh. As-salāmu ‘alaika ayyuhan-nabiyyu wa raḥmatullāhi wa barakātuh. As-salāmu ‘alainā wa ‘alā ‘ibādillāhiṣ-ṣāliḥīn. Asyhadu allā ilāha illallāh, wa asyhadu anna Muḥammadar rasūlullāh. Allāhumma ṣalli ‘alā sayyidinā Muḥammad.',
    translation: 'Segala kehormatan, keberkahan, kebahagiaan, dan kebaikan adalah milik Allah. Salam sejahtera atasmu wahai Nabi, beserta rahmat Allah dan berkah-Nya. Salam sejahtera atas kami dan hamba-hamba Allah yang saleh. Aku bersaksi tiada Tuhan selain Allah dan aku bersaksi bahwa Muhammad adalah utusan Allah. Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad.',
    explanation: 'Duduk iftirasy pada akhir rakaat kedua (untuk salat Zuhur, Asar, Magrib, Isya). Tangan kanan menggenggam jari-jari kecuali jari telunjuk yang diacungkan saat mengucap syahadat "illallāh".',
  },

  // 12. Tasyahud Akhir & Shalawat Ibrahimiyah
  {
    id: 'tasyahud-akhir',
    stepNumber: 12,
    title: 'Tasyahud Akhir & Shalawat Ibrahimiyah (Tawarruk)',
    category: 'gerakan',
    arabic: 'التَّحِيَّاتُ الْمُبَارَكَاتُ... وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى سَيِّدِنَا إِبْرَاهِيمَ وَعَلَى آلِ سَيِّدِنَا إِبْرَاهِيمَ، وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى سَيِّدِنَا إِبْرَاهِيمَ وَعَلَى آلِ سَيِّدِنَا إِبْرَاهِيمَ فِي الْعَالَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
    latin: 'Allāhumma ṣalli ‘alā sayyidinā Muḥammadin wa ‘alā āli sayyidinā Muḥammad, kamā ṣallaita ‘alā sayyidinā Ibrāhīma wa ‘alā āli sayyidinā Ibrāhīm, wa bārik ‘alā sayyidinā Muḥammadin wa ‘alā āli sayyidinā Muḥammad, kamā bārakta ‘alā sayyidinā Ibrāhīma wa ‘alā āli sayyidinā Ibrāhīma fil-‘ālamīna innaka ḥamīdum majīd.',
    translation: 'Ya Allah, limpahkanlah shalawat kepada Nabi Muhammad dan keluarganya, sebagaimana Engkau telah melimpahkan shalawat kepada Nabi Ibrahim dan keluarganya. Dan berkahilah Nabi Muhammad dan keluarganya, sebagaimana Engkau telah memberkahi Nabi Ibrahim dan keluarganya di alam semesta. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia.',
    explanation: 'Duduk tawarruk pada rakaat terakhir: pantat menempel ke lantai, kaki kiri dimasukkan di bawah kaki kanan, dan telapak kaki kanan ditegakkan. Membaca tasyahud akhir dan shalawat Ibrahimiyah, dilanjutkan doa memohon perlindungan dari fitnah Dajjal dan siksa kubur.',
  },

  // 13. Salam
  {
    id: 'salam-penutup',
    stepNumber: 13,
    title: 'Salam ke Kanan dan ke Kiri',
    category: 'gerakan',
    arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
    latin: 'As-salāmu ‘alaikum wa raḥmatullāh.',
    translation: 'Semoga keselamatan dan rahmat Allah terlimpah kepada kalian.',
    explanation: 'Menolehkan wajah ke arah kanan hingga pipi kanan terlihat dari belakang sambil mengucap salam pertama, kemudian menoleh ke arah kiri sambil mengucap salam kedua. Salam pertama adalah rukun penyelesai salat.',
  },

  // 14. Zikir Setelah Salat
  {
    id: 'zikir-sesudah-salat',
    stepNumber: 14,
    title: 'Zikir & Wirid Sesudah Salat Fardhu',
    category: 'zikir',
    arabic: 'أَسْتَغْفِرُ اللَّهَ (3x). اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ. سُبْحَانَ اللَّهِ (33x)، الْحَمْدُ لِلَّهِ (33x)، اللَّهُ أَكْبَرُ (33x)',
    latin: 'Astaghfirullāh (3x). Allāhumma antas-salām wa minkas-salām tabārakta yā żal-jalāli wal-ikrām. Subḥānallāh (33x), Alḥamdulillāh (33x), Allāhu Akbar (33x).',
    translation: 'Aku memohon ampun kepada Allah (3x). Ya Allah, Engkau adalah Maha Penyelamat dan dari-Mu keselamatan, Maha Berkah Engkau wahai Dzat Pemilik Keagungan dan Kemuliaan. Maha Suci Allah (33x), Segala puji bagi Allah (33x), Allah Maha Besar (33x).',
    explanation: 'Dianjurkan tidak langsung beranjak setelah salam, melainkan duduk tenang membaca istighfar, doa keselamatan, ayat kursi, dan tasbih-tahmid-takbir masing-masing 33 kali.',
    fiqhNote: 'HR. Muslim no. 591, HR. Abu Daud no. 1505.',
  },
];

export const prayerGuideService = {
  getAllSteps(): PrayerStep[] {
    return PRAYER_STEPS_DATA;
  },

  getStepByNumber(num: number): PrayerStep | undefined {
    return PRAYER_STEPS_DATA.find((s) => s.stepNumber === num);
  },

  getRakaatSummaries(): PrayerRakaatSummary[] {
    return PRAYER_RAKAAT_LIST;
  },
};
