const LESSONS_DATA_A1A2 = [
  {
    id: "ozel-fiil-yapilari",
    icon: "ti-bolt",
    name:"Özel Fiil Yapıları",
    subcategories: [
      {
        id: "ozel-fiil-yapilari-genel",
        name:"Özel Fiil Yapıları",
        lessons: [
          { id: "ayrilabilir-fiiller", title: "Ayrılabilir Fiiller (Trennbare Verben)" },
          { id: "donuslu-fiiller", title: "Dönüşlü Fiiller (Reflexive Verben)" },
          { id: "edatli-fiiller", title: "Edatlı Fiiller (Verben mit Präpositionen)" },
          { id: "edatli-zarflar", title: "Edatlı Zarflar (Worauf, Dafür, vb.)" },
          { id: "edilgen-yapi", title: "Edilgen Yapı (Passiv Präsens)" },
        ]
      }
    ]
  },
  {
    id: "artikeller-ve-haller",
    icon: "ti-abc",
    name:"Artikeller ve Haller",
    subcategories: [
      {
        id: "artikeller-ve-haller-genel",
        name:"Artikeller ve Haller",
        lessons: [
          { id: "belirli-artikeller", title: "Belirli Artikeller (Der, Die, Das)" },
          { id: "belirsiz-artikeller", title: "Belirsiz Artikeller (Ein, Eine)" },
          { id: "olumsuz-artikeller", title: "Olumsuz Artikeller (Kein, Keine)" },
          { id: "akkusativ", title: "Akkusativ (İ-Hali)" },
          { id: "dativ", title: "Dativ (E-Hali)" },
        ]
      }
    ]
  },
  {
    id: "cumle-yapisi",
    icon: "ti-list",
    name:"Cümle Yapısı (Wortstellung)",
    subcategories: [
      {
        id: "temel-dizilim",
        name:"Temel Dizilim",
        lessons: [
          { id: "fiil-ikinci-sirada", title: "Fiil Her Zaman İkinci Sırada" },
          { id: "ozne-fiil-uyumu", title: "Özne ve Fiil Uyumu" },
          { id: "soru-cumleleri", title: "Soru Cümleleri (Ja/Nein & W-Fragen)" },
        ]
      },
      {
        id: "tekamolo-kurali",
        name:"TeKaMoLo Kuralı",
        lessons: [
          { id: "temporal", title: "Temporal (Ne Zaman)" },
          { id: "kausal", title: "Kausal (Neden)" },
          { id: "modal", title: "Modal (Nasıl)" },
          { id: "lokal", title: "Lokal (Nerede/Nereye)" },
        ]
      }
    ]
  },
  {
    id: "baglaçlar-ve-yan-cumleler",
    icon: "ti-sitemap",
    name:"Bağlaçlar ve Yan Cümleler",
    subcategories: [
      {
        id: "fiili-sona-atanlar",
        name:"Fiili Sona Atanlar",
        lessons: [
          { id: "weil", title: "Weil (Çünkü/İçin)" },
          { id: "dass", title: "Dass (-dığı/da)" },
          { id: "wenn", title: "Wenn (Eğer/Zaman)" },
          { id: "ob", title: "Ob (-ıp -madığı)" },
        ]
      },
      {
        id: "cumle-basi-ortasi-baglaçlar",
        name:"Cümle Başı/Ortası Bağlaçlar",
        lessons: [
          { id: "trotzdem", title: "Trotzdem (Buna Rağmen)" },
          { id: "deshalb-deswegen", title: "Deshalb / Deswegen (Bu Yüzden)" },
          { id: "denn", title: "Denn (Çünkü)" },
        ]
      },
      {
        id: "dolayli-sorular",
        name:"Dolaylı Sorular",
        lessons: [
          { id: "indirekte-fragen", title: "Dolaylı Sorular (Indirekte Fragen)" },
        ]
      }
    ]
  },
  {
    id: "fiil-turleri-ve-zamanlar",
    icon: "ti-clock",
    name:"Fiil Türleri ve Zamanlar",
    subcategories: [
      {
        id: "modal-fiiller",
        name:"Modal Fiiller",
        lessons: [
          { id: "mussen", title: "Müssen (Zorunluluk)" },
          { id: "konnen", title: "Können (Yetenek/İmkân)" },
          { id: "wollen", title: "Wollen (İstek/Niyet)" },
          { id: "mochten", title: "Möchten (Kibar İstek)" },
          { id: "durfen", title: "Dürfen (İzin/Yasak)" },
          { id: "sollen", title: "Sollen (Tavsiye/Görev)" },
        ]
      },
      {
        id: "zaman-formlari",
        name:"Zaman Formları",
        lessons: [
          { id: "prasens", title: "Präsens (Şimdiki ve Geniş Zaman)" },
          { id: "perfekt", title: "Perfekt (-di'li Geçmiş Zaman)" },
          { id: "prateritum", title: "Präteritum (Haben ve Sein)" },
          { id: "konjunktiv-ii", title: "Konjunktiv II (Hätte, Wäre, Würde)" },
        ]
      }
    ]
  },
  {
    id: "isim-ve-sifat-bilgisi",
    icon: "ti-vocabulary",
    name:"İsim ve Sıfat Bilgisi",
    subcategories: [
      {
        id: "zamirler",
        name:"Zamirler",
        lessons: [
          { id: "sahis-zamirleri", title: "Şahıs Zamirleri (Nominativ, Akkusativ, Dativ)" },
          { id: "iyelik-zamirleri", title: "İyelik Zamirleri (Possessivartikel)" },
        ]
      },
      {
        id: "sifatlar",
        name:"Sıfatlar",
        lessons: [
          { id: "sifat-cekimi", title: "Sıfat Çekimi (Adjektivdeklination)" },
          { id: "derecelendirme", title: "Derecelendirme (Komparativ & Superlativ)" },
        ]
      }
    ]
  },
  {
    id: "gunluk-konular-ve-kelimeler",
    icon: "ti-message-circle",
    name:"Günlük Konular ve Kelimeler",
    subcategories: [
      {
        id: "temel-iletisim",
        name:"Temel İletişim",
        lessons: [
          { id: "selamlasma-vedalasma", title: "Selamlaşma ve Vedalaşma" },
          { id: "kendini-tanitma", title: "Kendini Tanıtma" },
          { id: "nasilsin", title: "Nasılsın? (Wie geht's?)" },
          { id: "yol-tarifi", title: "Yol Tarifi (Wegbeschreibung)" },
        ]
      },
      {
        id: "zaman-ve-sayilar",
        name:"Zaman ve Sayılar",
        lessons: [
          { id: "sayilar-siralama", title: "Sayılar ve Sıralama Sayıları" },
          { id: "saat-sorma", title: "Saat Sorma ve Söyleme" },
          { id: "gunler-aylar-mevsimler", title: "Günler, Aylar ve Mevsimler" },
          { id: "zaman-zarflari", title: "Zaman Zarfları (Morgens, Abends, vb.)" },
        ]
      },
      {
        id: "yasam-ve-cevre",
        name:"Yaşam ve Çevre",
        lessons: [
          { id: "aile-uyeleri", title: "Aile Üyeleri (Die Familie)" },
          { id: "meslekler", title: "Meslekler (Die Berufe)" },
          { id: "vucut-saglik", title: "Vücut Bölümleri ve Sağlık" },
          { id: "renkler-meyveler-ulkeler", title: "Renkler, Meyveler ve Ülkeler" },
        ]
      }
    ]
  },
  {
    id: "edatlar",
    icon: "ti-map-pin",
    name:"Edatlar (Präpositionen)",
    subcategories: [
      {
        id: "edatlar-genel",
        name:"Edatlar",
        lessons: [
          { id: "yer-edatlari", title: "Yer Edatları (Lokale Präpositionen)" },
          { id: "yonelim-edatlari", title: "Yönelim Edatları (In, Zu, An, Nach)" },
          { id: "dativ-akkusativ-edatlar", title: "Dativ ve Akkusativ Alan Edatlar" },
        ]
      }
    ]
  },
];
