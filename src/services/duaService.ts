import type { DuaItem } from '../types/quran';

export const DUA_CATEGORIES = [
  'Semua Doa',
  'Tidur & Bangun',
  'Makan & Minum',
  'Rumah & Keluarga',
  'Masjid & Ibadah',
  'Bepergian & Kendaraan',
  'Orang Tua',
  'Belajar & Ilmu',
  'Ampunan & Taubat',
  'Pagi & Petang',
  'Setelah Salat',
  'Pilihan Al-Qur’an',
];

export const DUAS_DATA: DuaItem[] = [
  // 1. Tidur & Bangun
  {
    id: 'doa-sebelum-tidur',
    title: 'Doa Sebelum Tidur',
    category: 'Tidur & Bangun',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    latin: 'Bismikallāhumma amūtu wa aḥyā.',
    translation: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
    source: 'HR. Bukhari no. 6312 & Muslim no. 2711',
    notes: 'Dibaca saat hendak berbaring tidur di tempat tidur, dianjurkan berwudu dan menghadap kiblat.',
  },
  {
    id: 'doa-bangun-tidur',
    title: 'Doa Bangun Tidur',
    category: 'Tidur & Bangun',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    latin: 'Alḥamdulillāhil-lażī aḥyānā ba‘da mā amātanā wa ilaihin-nusyūr.',
    translation: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami dan kepada-Nya kami kembali.',
    source: 'HR. Bukhari no. 6314 & Muslim no. 2711',
    notes: 'Dibaca langsung saat membuka mata setelah terjaga dari tidur.',
  },

  // 2. Makan & Minum
  {
    id: 'doa-sebelum-makan',
    title: 'Doa Sebelum Makan',
    category: 'Makan & Minum',
    arabic: 'بِسْمِ اللَّهِ, اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا وَقِنَا عَذَابَ النَّارِ',
    latin: 'Bismillāh, Allāhumma bārik lanā fīmā razaqtanā wa qinā ‘ażāban-nār.',
    translation: 'Dengan nama Allah. Ya Allah, berkahilah rezeki yang telah Engkau anugerahkan kepada kami dan peliharalah kami dari siksa neraka.',
    source: 'HR. Abu Daud no. 3767 & At-Tirmidzi',
    notes: 'Sunnah diawali dengan mengucap Bismillah dan menggunakan tangan kanan.',
  },
  {
    id: 'doa-sesudah-makan',
    title: 'Doa Sesudah Makan',
    category: 'Makan & Minum',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    latin: 'Alḥamdulillāhil-lażī aṭ‘amanā wa saqānā wa ja‘alanā muslimīn.',
    translation: 'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami orang-orang Muslim.',
    source: 'HR. Abu Daud no. 3850 & Tirmidzi no. 3457',
    notes: 'Dibaca sebagai wujud syukur atas nikmat kenyang dan hidangan yang halal.',
  },

  // 3. Rumah & Keluarga
  {
    id: 'doa-masuk-rumah',
    title: 'Doa Masuk Rumah',
    category: 'Rumah & Keluarga',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    latin: 'Bismillāhi walajnā, wa bismillāhi kharajnā, wa ‘alallāhi rabbinā tawakkalnā.',
    translation: 'Dengan nama Allah kami masuk, dengan nama Allah kami keluar, dan kepada Allah Tuhan kami, kami bertawakal.',
    source: 'HR. Abu Daud no. 5096',
    notes: 'Dianjurkan mengucapkan salam kepada penghuni rumah saat masuk.',
  },
  {
    id: 'doa-keluar-rumah',
    title: 'Doa Keluar Rumah',
    category: 'Rumah & Keluarga',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    latin: 'Bismillāhi tawakkaltu ‘alallāh, lā ḥawla wa lā quwwata illā billāh.',
    translation: 'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan tiada kekuatan melainkan dengan pertolongan Allah.',
    source: 'HR. Abu Daud no. 5095 & Tirmidzi no. 3426',
    notes: 'Malaikat akan menjaga dan menjauhkan godaan setan bagi yang membacanya saat keluar rumah.',
  },

  // 4. Masjid & Ibadah
  {
    id: 'doa-masuk-masjid',
    title: 'Doa Masuk Masjid',
    category: 'Masjid & Ibadah',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin: 'Allāhummaftaḥ lī abwāba raḥmatik.',
    translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
    source: 'HR. Muslim no. 713',
    notes: 'Dianjurkan mendahulukan kaki kanan saat melangkah masuk masjid.',
  },
  {
    id: 'doa-keluar-masjid',
    title: 'Doa Keluar Masjid',
    category: 'Masjid & Ibadah',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    latin: 'Allāhumma innī as’aluka min faḍlik.',
    translation: 'Ya Allah, sesungguhnya aku memohon karunia kemurahan-Mu.',
    source: 'HR. Muslim no. 713',
    notes: 'Dianjurkan mendahulukan kaki kiri saat melangkah keluar masjid.',
  },

  // 5. Bepergian & Kendaraan
  {
    id: 'doa-naik-kendaraan',
    title: 'Doa Naik Kendaraan',
    category: 'Bepergian & Kendaraan',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    latin: 'Subḥānal-lażī sakh-khara lanā hāżā wa mā kunnā lahū muqrinīn, wa innā ilā rabbinā lamunqalibūn.',
    translation: 'Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal sebelumnya kami tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
    source: 'QS. Az-Zukhruf: 13-14 & HR. Muslim no. 1342',
    notes: 'Dibaca ketika sudah duduk di atas kendaraan sebelum memulai perjalanan.',
  },

  // 6. Orang Tua
  {
    id: 'doa-kedua-orang-tua',
    title: 'Doa untuk Kedua Orang Tua',
    category: 'Orang Tua',
    arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    latin: 'Rabbigfir lī wa liwālidayya warḥamhumā kamā rabbayānī ṣagīrā.',
    translation: 'Wahai Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah keduanya sebagaimana mereka telah menyayangi dan mendidikku di waktu kecil.',
    source: 'QS. Al-Isra’: 24 & QS. Ibrahim: 41',
    notes: 'Dibaca setiap selesai salat dan setiap saat mendoakan kebaikan orang tua.',
  },

  // 7. Belajar & Ilmu
  {
    id: 'doa-sebelum-belajar',
    title: 'Doa Sebelum Belajar & Menuntut Ilmu',
    category: 'Belajar & Ilmu',
    arabic: 'رَبِّ زِدْنِي عِلْمًا وَارْزُقْنِي فَهْمًا',
    latin: 'Rabbi zidnī ‘ilmā, warzuqnī fahmā.',
    translation: 'Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan dan anugerahkanlah kepadaku pemahaman yang baik.',
    source: 'QS. Thaha: 114 & Doa Ulama Salaf',
    notes: 'Dibaca dengan niat ikhlas mencari ilmu yang bermanfaat untuk agama dan sesama.',
  },

  // 8. Ampunan & Taubat
  {
    id: 'sayyidul-istighfar',
    title: 'Sayyidul Istighfar (Penghulu Istighfar)',
    category: 'Ampunan & Taubat',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    latin: 'Allāhumma anta rabbī lā ilāha illā anta, khalaqtanī wa anā ‘abduka, wa anā ‘alā ‘ahdika wa wa‘dika mastata‘tu, a‘ūżu bika min syarri mā ṣana‘tu, abū’u laka bini‘matika ‘alayya, wa abū’u laka biżanbī, fagfir lī fa-innahū lā yagfiruż-żunūba illā anta.',
    translation: 'Ya Allah, Engkau adalah Tuhanku, tidak ada Tuhan selain Engkau. Engkau yang menciptakanku dan aku adalah hamba-Mu. Aku berada di atas janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan perbuatanku. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku kepada-Mu, maka ampunilah aku, karena sesungguhnya tidak ada yang dapat mengampuni dosa selain Engkau.',
    source: 'HR. Bukhari no. 6306',
    notes: 'Barangsiapa membacanya di petang hari lalu meninggal di malam hari, ia termasuk penghuni surga; demikian pula bila membacanya di pagi hari.',
  },

  // 9. Pagi & Petang
  {
    id: 'doa-pagi-hari',
    title: 'Doa di Pagi Hari',
    category: 'Pagi & Petang',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    latin: 'Aṣbaḥnā wa aṣbaḥal-mulku lillāh, wal-ḥamdu lillāh, lā ilāha illallāhu waḥdahū lā syarīka lah.',
    translation: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada Tuhan selain Allah semata yang tiada sekutu bagi-Nya.',
    source: 'HR. Muslim no. 2723',
    notes: 'Dibaca saat fajar menjelang pagi sebagai bagian dari zikir pagi.',
  },

  // 10. Setelah Salat
  {
    id: 'doa-sesudah-salat',
    title: 'Doa Permohonan Pertolongan Beribadah',
    category: 'Setelah Salat',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    latin: 'Allāhumma a‘innī ‘alā żikrika wa syukrika wa ḥusni ‘ibādatik.',
    translation: 'Ya Allah, tolonglah aku untuk selalu mengingat-Mu, bersyukur kepada-Mu, dan memperbagus ibadah kepada-Mu.',
    source: 'HR. Abu Daud no. 1522 & An-Nasa’i no. 1303 (Sahih)',
    notes: 'Wasiat khusus Rasulullah SAW kepada Mu’adz bin Jabal untuk dibaca di setiap akhir salat.',
  },

  // 11. Pilihan Al-Qur'an
  {
    id: 'doa-kebaikan-dunia-akhirat',
    title: 'Doa Kebaikan Dunia & Akhirat (Sapu Jagat)',
    category: 'Pilihan Al-Qur’an',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Rabbanā ātinā fid-dunyā ḥasanatan wa fil-ākhirati ḥasanatan wa qinā ‘ażāban-nār.',
    translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
    source: 'QS. Al-Baqarah: 201',
    notes: 'Salah satu doa yang paling sering dipanjatkan oleh Rasulullah SAW dalam kesehariannya.',
  },
  {
    id: 'doa-ketetapan-hati',
    title: 'Doa Ketetapan Iman & Hati',
    category: 'Pilihan Al-Qur’an',
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ',
    latin: 'Rabbanā lā tuziġ qulūbanā ba‘da iż hadaitanā wa hab lanā mil ladunka raḥmah, innaka antal-wahhāb.',
    translation: 'Ya Tuhan kami, janganlah Engkau condongkan hati kami kepada kesesatan setelah Engkau berikan petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu; sesungguhnya Engkau-lah Maha Pemberi.',
    source: 'QS. Ali ‘Imran: 8',
    notes: 'Doa memohon keistiqamahan iman dan perlindungan dari keraguan hati.',
  },
];

export const duaService = {
  getAllDuas(): DuaItem[] {
    return DUAS_DATA;
  },

  getCategories(): string[] {
    return DUA_CATEGORIES;
  },

  getDuaById(id: string): DuaItem | undefined {
    return DUAS_DATA.find((d) => d.id === id);
  },

  getFeaturedDua(): DuaItem {
    // Pick based on day of month for delightful rotation
    const day = new Date().getDate();
    const index = day % DUAS_DATA.length;
    return DUAS_DATA[index];
  },

  searchDuas(query: string, category = 'Semua Doa'): DuaItem[] {
    const q = query.toLowerCase().trim();
    return DUAS_DATA.filter((item) => {
      const matchCat = category === 'Semua Doa' || item.category === category;
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.translation.toLowerCase().includes(q) ||
        item.latin.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q);

      return matchCat && matchQuery;
    });
  },
};
