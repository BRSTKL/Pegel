// Verben mit Präpositionen Database (A1-B2)
const VERBEN_PREP_DATA = [
  {
    "verb": "antworten",
    "prep": "auf",
    "kasus": "Akk",
    "level": "A1",
    "meaning": "(bir şeye) cevap vermek",
    "example": "Sie antwortet auf die Frage.",
    "translation": "Soruya cevap veriyor."
  },
  {
    "verb": "arbeiten",
    "prep": "bei",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "(bir şirkette) çalışmak",
    "example": "Sie arbeitet bei Siemens.",
    "translation": "Siemens'te çalışıyor."
  },
  {
    "verb": "denken",
    "prep": "an",
    "kasus": "Akk",
    "level": "A1",
    "meaning": "(birini) düşünmek",
    "example": "Ich denke oft an dich.",
    "translation": "Seni sık sık düşünüyorum."
  },
  {
    "verb": "erzählen",
    "prep": "von",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "(bir şey hakkında) anlatmak",
    "example": "Sie erzählt von ihrer Reise.",
    "translation": "Seyahatinden anlatıyor."
  },
  {
    "verb": "fahren",
    "prep": "mit",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "(bir araçla) gitmek",
    "example": "Wir fahren mit dem Bus.",
    "translation": "Otobüsle gidiyoruz."
  },
  {
    "verb": "fragen",
    "prep": "nach",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "(bir şeyi) sormak",
    "example": "Er fragt nach dem Weg.",
    "translation": "Yolu soruyor."
  },
  {
    "verb": "gehen",
    "prep": "zu",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "(bir yere) gitmek",
    "example": "Sie geht zum Arzt.",
    "translation": "Doktora gidiyor."
  },
  {
    "verb": "helfen",
    "prep": "bei",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "(bir işte) yardım etmek",
    "example": "Er hilft mir bei den Hausaufgaben.",
    "translation": "Ödevlerimde yardım ediyor."
  },
  {
    "verb": "kommen",
    "prep": "aus",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "(bir yerden) gelmek",
    "example": "Ich komme aus der Türkei.",
    "translation": "Türkiye'den geliyorum."
  },
  {
    "verb": "schreiben",
    "prep": "an",
    "kasus": "Akk",
    "level": "A1",
    "meaning": "(birine) yazmak",
    "example": "Ich schreibe an meine Freundin.",
    "translation": "Arkadaşıma yazıyorum."
  },
  {
    "verb": "sein",
    "prep": "aus",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "oralı olmak",
    "example": "Sie ist aus Berlin.",
    "translation": "O Berlin'li."
  },
  {
    "verb": "spielen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "(biriyle/şeyle) oynamak",
    "example": "Das Kind spielt mit dem Ball.",
    "translation": "Çocuk topla oynuyor."
  },
  {
    "verb": "sprechen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "(biriyle) konuşmak",
    "example": "Ich spreche mit meiner Mutter.",
    "translation": "Annemle konuşuyorum."
  },
  {
    "verb": "suchen",
    "prep": "nach",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "aramak",
    "example": "Ich suche nach meinem Schlüssel.",
    "translation": "Anahtarımı arıyorum."
  },
  {
    "verb": "träumen",
    "prep": "von",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "rüya görmek",
    "example": "Er träumt von einem Hund.",
    "translation": "Köpek hayal ediyor."
  },
  {
    "verb": "warten",
    "prep": "auf",
    "kasus": "Akk",
    "level": "A1",
    "meaning": "beklemek",
    "example": "Ich warte auf den Bus.",
    "translation": "Otobüsü bekliyorum."
  },
  {
    "verb": "wohnen",
    "prep": "in",
    "kasus": "Dat",
    "level": "A1",
    "meaning": "(bir yerde) oturmak",
    "example": "Er wohnt in Berlin.",
    "translation": "O Berlin'de oturuyor."
  },
  {
    "verb": "abhängen",
    "prep": "von",
    "kasus": "Dat",
    "level": "A2",
    "meaning": "(bir şeye) bağlı olmak",
    "example": "Das hängt von dir ab.",
    "translation": "Bu sana bağlı."
  },
  {
    "verb": "achten",
    "prep": "auf",
    "kasus": "Akk",
    "level": "A2",
    "meaning": "dikkat etmek",
    "example": "Achte auf deine Gesundheit.",
    "translation": "Sağlığına dikkat et."
  },
  {
    "verb": "anfangen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "A2",
    "meaning": "(bir şeye) başlamak",
    "example": "Wir fangen mit dem Essen an.",
    "translation": "Yemeğe başlıyoruz."
  },
  {
    "verb": "aufhören",
    "prep": "mit",
    "kasus": "Dat",
    "level": "A2",
    "meaning": "(bir şeyi) bırakmak",
    "example": "Er hat mit dem Rauchen aufgehört.",
    "translation": "Sigarayı bıraktı."
  },
  {
    "verb": "danken",
    "prep": "für",
    "kasus": "Akk",
    "level": "A2",
    "meaning": "(bir şey için) teşekkür etmek",
    "example": "Ich danke dir für deine Hilfe.",
    "translation": "Yardımın için teşekkür ediyorum."
  },
  {
    "verb": "einladen",
    "prep": "zu",
    "kasus": "Dat",
    "level": "A2",
    "meaning": "(bir etkinliğe) davet etmek",
    "example": "Wir laden dich zur Party ein.",
    "translation": "Seni partiye davet ediyoruz."
  },
  {
    "verb": "gehören",
    "prep": "zu",
    "kasus": "Dat",
    "level": "A2",
    "meaning": "(bir gruba) ait olmak",
    "example": "Dieses Buch gehört zu meiner Sammlung.",
    "translation": "Bu kitap koleksiyonuma ait."
  },
  {
    "verb": "gratulieren",
    "prep": "zu",
    "kasus": "Dat",
    "level": "A2",
    "meaning": "(bir şey için) tebrik etmek",
    "example": "Ich gratuliere dir zum Geburtstag.",
    "translation": "Doğum günün için tebrik ediyorum."
  },
  {
    "verb": "passen",
    "prep": "zu",
    "kasus": "Dat",
    "level": "A2",
    "meaning": "(bir şeye) yakışmak",
    "example": "Die Schuhe passen zum Kleid.",
    "translation": "Ayakkabılar elbiseye yakışıyor."
  },
  {
    "verb": "sich beschäftigen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "A2",
    "meaning": "(bir şeyle) meşgul olmak",
    "example": "Sie beschäftigt sich mit dem Thema.",
    "translation": "Konuyla meşgul oluyor."
  },
  {
    "verb": "sich freuen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "A2",
    "meaning": "(gelecek şeye) sevinmek",
    "example": "Ich freue mich auf die Ferien.",
    "translation": "Tatili dört gözle bekliyorum."
  },
  {
    "verb": "sich freuen",
    "prep": "über",
    "kasus": "Akk",
    "level": "A2",
    "meaning": "(mevcut şeye) sevinmek",
    "example": "Sie freut sich über das Geschenk.",
    "translation": "Hediyeye sevindi."
  },
  {
    "verb": "sich interessieren",
    "prep": "für",
    "kasus": "Akk",
    "level": "A2",
    "meaning": "(bir şeyle) ilgilenmek",
    "example": "Ich interessiere mich für Musik.",
    "translation": "Müzikle ilgileniyorum."
  },
  {
    "verb": "sorgen",
    "prep": "für",
    "kasus": "Akk",
    "level": "A2",
    "meaning": "(birini) bakmak",
    "example": "Sie sorgt für die Kinder.",
    "translation": "Çocuklara bakıyor."
  },
  {
    "verb": "sprechen",
    "prep": "über",
    "kasus": "Akk",
    "level": "A2",
    "meaning": "(bir şey) hakkında konuşmak",
    "example": "Wir sprechen über das Wetter.",
    "translation": "Hava hakkında konuşuyoruz."
  },
  {
    "verb": "teilnehmen",
    "prep": "an",
    "kasus": "Dat",
    "level": "A2",
    "meaning": "(bir etkinliğe) katılmak",
    "example": "Sie nimmt an dem Kurs teil.",
    "translation": "Kursa katılıyor."
  },
  {
    "verb": "telefonieren",
    "prep": "mit",
    "kasus": "Dat",
    "level": "A2",
    "meaning": "(biriyle) telefon etmek",
    "example": "Ich telefoniere mit meiner Schwester.",
    "translation": "Kız kardeşimle telefon ediyorum."
  },
  {
    "verb": "wissen",
    "prep": "von",
    "kasus": "Dat",
    "level": "A2",
    "meaning": "(bir şeyden) haberdar olmak",
    "example": "Weißt du von dem Treffen?",
    "translation": "Toplantıdan haberdar mısın?"
  },
  {
    "verb": "aufpassen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "dikkat etmek / göz kulak olmak",
    "example": "Pass auf meine Tasche auf!",
    "translation": "Çantama göz kulak ol!"
  },
  {
    "verb": "ausgeben",
    "prep": "für",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey için) para harcamak",
    "example": "Er gibt viel Geld für Autos aus.",
    "translation": "Arabalar için çok para harcıyor."
  },
  {
    "verb": "beginnen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeye) başlamak",
    "example": "Das Konzert beginnt mit einem Klaviersolo.",
    "translation": "Konser bir piyano solosuyla başlıyor."
  },
  {
    "verb": "berichten",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey) hakkında rapor vermek",
    "example": "Die Zeitung berichtet über den Unfall.",
    "translation": "Gazete kazayı anlatıyor."
  },
  {
    "verb": "bitten",
    "prep": "um",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey için) rica etmek",
    "example": "Er bittet um Hilfe.",
    "translation": "Yardım istiyor."
  },
  {
    "verb": "diskutieren",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey) üzerine tartışmak",
    "example": "Wir diskutieren über Politik.",
    "translation": "Politika üzerine tartışıyoruz."
  },
  {
    "verb": "diskutieren",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(biriyle) tartışmak",
    "example": "Ich diskutiere mit meinem Freund.",
    "translation": "Arkadaşımla tartışıyorum."
  },
  {
    "verb": "erfahren",
    "prep": "von",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeyden) haberdar olmak",
    "example": "Ich habe von dem Projekt erfahren.",
    "translation": "Projeden haberdar oldum."
  },
  {
    "verb": "erkennen",
    "prep": "an",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeyden) tanımak",
    "example": "Ich erkenne ihn an seiner Stimme.",
    "translation": "Onu sesinden tanıyorum."
  },
  {
    "verb": "erschrecken",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye) ürkmek",
    "example": "Ich erschrecke über das laute Geräusch.",
    "translation": "Yüksek sese ürktüm."
  },
  {
    "verb": "glauben",
    "prep": "an",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(birine/şeye) inanmak",
    "example": "Sie glaubt an den Erfolg.",
    "translation": "Başarıya inanıyor."
  },
  {
    "verb": "halten",
    "prep": "von",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şey hakkında) düşünmek",
    "example": "Was hältst du davon?",
    "translation": "Bu konuda ne düşünüyorsun?"
  },
  {
    "verb": "hoffen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "ummak",
    "example": "Wir hoffen auf besseres Wetter.",
    "translation": "Daha iyi hava umuyoruz."
  },
  {
    "verb": "kämpfen",
    "prep": "für",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey için) savaşmak",
    "example": "Sie kämpfen für die Umwelt.",
    "translation": "Çevre için savaşıyorlar."
  },
  {
    "verb": "kämpfen",
    "prep": "gegen",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye karşı) savaşmak",
    "example": "Wir kämpfen gegen die Armut.",
    "translation": "Yoksulluğa karşı savaşıyoruz."
  },
  {
    "verb": "lachen",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye) gülmek",
    "example": "Alle lachen über den Witz.",
    "translation": "Herkes şakaya güldü."
  },
  {
    "verb": "leiden",
    "prep": "unter",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeyden) acı çekmek",
    "example": "Sie leidet unter dem Stress.",
    "translation": "Stresten muzdarip."
  },
  {
    "verb": "leiden",
    "prep": "an",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir hastalıktan) muzdarip olmak",
    "example": "Er leidet an einer schweren Krankheit.",
    "translation": "Ağır bir hastalıktan muzdarip."
  },
  {
    "verb": "nachdenken",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey) üzerine düşünmek",
    "example": "Sie denkt über das Problem nach.",
    "translation": "Problem üzerine düşünüyor."
  },
  {
    "verb": "protestieren",
    "prep": "gegen",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeyi) protesto etmek",
    "example": "Die Studenten protestieren gegen die Gebühren.",
    "translation": "Öğrenciler ücretleri protesto ediyor."
  },
  {
    "verb": "reagieren",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye) tepki vermek",
    "example": "Er reagiert nicht auf meine Frage.",
    "translation": "Soruma tepki vermiyor."
  },
  {
    "verb": "reden",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey hakkında) konuşmak",
    "example": "Wir reden über die Zukunft.",
    "translation": "Gelecek hakkında konuşuyoruz."
  },
  {
    "verb": "reden",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(biriyle) konuşmak",
    "example": "Ich rede mit meinem Kollegen.",
    "translation": "İş arkadaşımla konuşuyorum."
  },
  {
    "verb": "riechen",
    "prep": "nach",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şey gibi) kokmak",
    "example": "Hier riecht es nach Kaffee.",
    "translation": "Burası kahve kokuyor."
  },
  {
    "verb": "schmecken",
    "prep": "nach",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şey gibi) tatmak",
    "example": "Das schmeckt nach Schokolade.",
    "translation": "Bu çikolataya benziyor."
  },
  {
    "verb": "schreiben",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey hakkında) yazmak",
    "example": "Er schreibt über seine Erfahrungen.",
    "translation": "Deneyimleri hakkında yazıyor."
  },
  {
    "verb": "sich anpassen",
    "prep": "an",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye) uyum sağlamak",
    "example": "Man muss sich an die neuen Regeln anpassen.",
    "translation": "Yeni kurallara uyum sağlamak gerekir."
  },
  {
    "verb": "sich aufregen",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye) sinirlenmek / heyecanlanmak",
    "example": "Reg dich nicht über Kleinigkeiten auf.",
    "translation": "Küçük şeylere sinirlenme."
  },
  {
    "verb": "sich bedanken",
    "prep": "bei",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(birine) teşekkür etmek",
    "example": "Ich bedanke mich bei dir.",
    "translation": "Sana teşekkür ediyorum."
  },
  {
    "verb": "sich bedanken",
    "prep": "für",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey için) teşekkür etmek",
    "example": "Ich bedanke mich für das Geschenk.",
    "translation": "Hediye için teşekkür ediyorum."
  },
  {
    "verb": "sich bemühen",
    "prep": "um",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey için) çabalamak",
    "example": "Er bemüht sich um einen Job.",
    "translation": "Bir iş için çabalıyor."
  },
  {
    "verb": "sich beschweren",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeyden) şikâyet etmek",
    "example": "Er beschwert sich über den Lärm.",
    "translation": "Gürültüden şikâyet ediyor."
  },
  {
    "verb": "sich beschweren",
    "prep": "bei",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(birine) şikâyet etmek",
    "example": "Er beschwert sich beim Chef.",
    "translation": "Patrona şikâyet ediyor."
  },
  {
    "verb": "sich bewerben",
    "prep": "um",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye) başvurmak",
    "example": "Sie bewirbt sich um die Stelle.",
    "translation": "Pozisyona başvuruyor."
  },
  {
    "verb": "sich einigen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey) üzerinde anlaşmak",
    "example": "Wir einigen uns auf einen Termin.",
    "translation": "Bir tarih üzerinde anlaşıyoruz."
  },
  {
    "verb": "sich entschuldigen",
    "prep": "bei",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(birinden) özür dilemek",
    "example": "Ich entschuldige mich bei dir.",
    "translation": "Senden özür diliyorum."
  },
  {
    "verb": "sich erholen",
    "prep": "von",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeyden) toparlanmak",
    "example": "Ich erhole mich von der Krankheit.",
    "translation": "Hastalıktan iyileşiyorum."
  },
  {
    "verb": "sich erinnern",
    "prep": "an",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeyi) hatırlamak",
    "example": "Ich erinnere mich an die Schulzeit.",
    "translation": "Okul yıllarını hatırlıyorum."
  },
  {
    "verb": "sich erkundigen",
    "prep": "nach",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeyi) bilgi almak amacıyla sormak",
    "example": "Ich erkundige mich nach den Preisen.",
    "translation": "Fiyatları soruyorum."
  },
  {
    "verb": "sich fürchten",
    "prep": "vor",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeyden) korkmak",
    "example": "Das Kind fürchtet sich vor Hunden.",
    "translation": "Çocuk köpeklerden korkuyor."
  },
  {
    "verb": "sich gewöhnen",
    "prep": "an",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye) alışmak",
    "example": "Ich gewöhne mich an das Klima.",
    "translation": "İklime alışıyorum."
  },
  {
    "verb": "sich informieren",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey hakkında) bilgi edinmek",
    "example": "Ich informiere mich über den Kurs.",
    "translation": "Kurs hakkında bilgi ediniyorum."
  },
  {
    "verb": "sich konzentrieren",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye) konsantre olmak",
    "example": "Ich konzentriere mich auf die Arbeit.",
    "translation": "İşe konsantre oluyorum."
  },
  {
    "verb": "sich kümmern",
    "prep": "um",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(biriyle) ilgilenmek",
    "example": "Er kümmert sich um seinen Vater.",
    "translation": "Babasıyla ilgileniyor."
  },
  {
    "verb": "sich schützen",
    "prep": "vor",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeyden) korunmak",
    "example": "Die Brille schützt vor der Sonne.",
    "translation": "Gözlük güneşten koruyor."
  },
  {
    "verb": "sich streiten",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(biriyle) kavga etmek",
    "example": "Ich streite mich oft mit meinem Bruder.",
    "translation": "Ağabeyimle sık sık kavga ediyorum."
  },
  {
    "verb": "sich streiten",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey hakkında) tartışmak",
    "example": "Wir streiten über das Geld.",
    "translation": "Para hakkında tartışıyoruz."
  },
  {
    "verb": "sich treffen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(biriyle) buluşmak",
    "example": "Ich treffe mich mit Freunden.",
    "translation": "Arkadaşlarla buluşuyorum."
  },
  {
    "verb": "sich trennen",
    "prep": "von",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(birinden) ayrılmak",
    "example": "Er hat sich von seiner Frau getrennt.",
    "translation": "Karısından ayrıldı."
  },
  {
    "verb": "sich unterhalten",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(biriyle) sohbet etmek",
    "example": "Ich unterhalte mich mit dem Nachbarn.",
    "translation": "Komşuyla sohbet ediyorum."
  },
  {
    "verb": "sich unterhalten",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şey hakkında) sohbet etmek",
    "example": "Wir unterhalten uns über Politik.",
    "translation": "Politika hakkında sohbet ediyoruz."
  },
  {
    "verb": "sich verabreden",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(biriyle) sözleşmek / randevulaşmak",
    "example": "Ich bin mit ihr verabredet.",
    "translation": "Onunla sözleştim."
  },
  {
    "verb": "sich verabschieden",
    "prep": "von",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(birinden) veda etmek",
    "example": "Sie verabschiedet sich von den Gästen.",
    "translation": "Misafirlerden vedalaşıyor."
  },
  {
    "verb": "sich verlassen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(birine) güvenmek",
    "example": "Ich kann mich auf dich verlassen.",
    "translation": "Sana güvenebilirim."
  },
  {
    "verb": "sich verlieben",
    "prep": "in",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(birine) aşık olmak",
    "example": "Er hat sich in sie verliebt.",
    "translation": "Ona aşık oldu."
  },
  {
    "verb": "sich verstehen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(biriyle) iyi anlaşmak",
    "example": "Ich verstehe mich gut mit ihm.",
    "translation": "Onunla iyi anlaşıyorum."
  },
  {
    "verb": "sich vorbereiten",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye) hazırlanmak",
    "example": "Er bereitet sich auf die Prüfung vor.",
    "translation": "Sınava hazırlanıyor."
  },
  {
    "verb": "sich wenden",
    "prep": "an",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(birine) başvurmak / danışmak",
    "example": "Bitte wenden Sie sich an die Rezeption.",
    "translation": "Lütfen resepsiyona başvurun."
  },
  {
    "verb": "sich wundern",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye) şaşırmak",
    "example": "Ich wundere mich über seine Aussage.",
    "translation": "Açıklamasına şaşırdım."
  },
  {
    "verb": "sich ärgern",
    "prep": "über",
    "kasus": "Akk",
    "level": "B1",
    "meaning": "(bir şeye) sinirlenmiş olmak",
    "example": "Er ärgert sich über den Stau.",
    "translation": "Trafikten siniri bozuldu."
  },
  {
    "verb": "sterben",
    "prep": "an",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeyden) ölmek",
    "example": "Er ist an Krebs gestorben.",
    "translation": "Kanserden öldü."
  },
  {
    "verb": "vergleichen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeyle) karşılaştırmak",
    "example": "Man kann Äpfel nicht mit Birnen vergleichen.",
    "translation": "Elma ile armut karşılaştırılamaz."
  },
  {
    "verb": "warnen",
    "prep": "vor",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeye karşı) uyarmak",
    "example": "Er warnt uns vor dem Sturm.",
    "translation": "Bizi fırtınaya karşı uyarıyor."
  },
  {
    "verb": "werden",
    "prep": "zu",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeye) dönüşmek",
    "example": "Raupe wird zu einem Schmetterling.",
    "translation": "Tırtıl kelebeğe dönüşüyor."
  },
  {
    "verb": "zuschauen",
    "prep": "bei",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeye) izleyici olarak katılmak",
    "example": "Ich schaue ihm beim Spielen zu.",
    "translation": "Oyun oynarken onu izliyorum."
  },
  {
    "verb": "zweifeln",
    "prep": "an",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeyden) şüphe etmek",
    "example": "Er zweifelt an seinen Fähigkeiten.",
    "translation": "Yeteneklerinden şüphe ediyor."
  },
  {
    "verb": "überreden",
    "prep": "zu",
    "kasus": "Dat",
    "level": "B1",
    "meaning": "(bir şeye) ikna etmek",
    "example": "Ich überrede ihn zum Mitkommen.",
    "translation": "Onu gelmeye ikna ediyorum."
  },
  {
    "verb": "abhalten",
    "prep": "von",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "birinden/bir şeyden alıkoymak",
    "example": "Der Regen hält uns vom Spaziergang ab.",
    "translation": "Yağmur bizi yürüyüşe çıkmaktan alıkoyuyor."
  },
  {
    "verb": "abraten",
    "prep": "von",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyden sakındırmak/tavsiye etmemek",
    "example": "Ich rate dir von diesem Kauf ab.",
    "translation": "Sana bu satın almayı yapmamanı tavsiye ederim."
  },
  {
    "verb": "absehen",
    "prep": "von",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeyi) göz ardı etmek",
    "example": "Abgesehen von dieser Frage war alles gut.",
    "translation": "Bu sorun dışında her şey iyiydi."
  },
  {
    "verb": "abstimmen",
    "prep": "über",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şey hakkında oylama yapmak",
    "example": "Wir stimmen über den neuen Plan ab.",
    "translation": "Yeni plan üzerinde oylama yapıyoruz."
  },
  {
    "verb": "appellieren",
    "prep": "an",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "birine/bir şeye çağrıda bulunmak",
    "example": "Der Präsident appelliert an die Vernunft.",
    "translation": "Başkan mantıklı davranmaya çağrıda bulunuyor."
  },
  {
    "verb": "auffordern",
    "prep": "zu",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeye davet/talep etmek",
    "example": "Er fordert sie zum Tanzen auf.",
    "translation": "Onu dansa davet ediyor."
  },
  {
    "verb": "ausgehen",
    "prep": "von",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyden yola çıkmak/varsaymak",
    "example": "Wir gehen von einer Verbesserung aus.",
    "translation": "Bir iyileşme olacağından yola çıkıyoruz."
  },
  {
    "verb": "basieren",
    "prep": "auf",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeye dayanmak",
    "example": "Der Film basiert auf einer wahren Geschichte.",
    "translation": "Film gerçek bir hikayeye dayanıyor."
  },
  {
    "verb": "beitragen",
    "prep": "zu",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeye katkıda bulunmak",
    "example": "Jeder muss zur Gesellschaft beitragen.",
    "translation": "Herkes topluma katkıda bulunmalı."
  },
  {
    "verb": "beruhen",
    "prep": "auf",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeye) dayanmak",
    "example": "Die Geschichte beruht auf Fakten.",
    "translation": "Hikâye gerçeklere dayanıyor."
  },
  {
    "verb": "bestehen",
    "prep": "auf",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeyde) ısrar etmek",
    "example": "Sie besteht auf einer Entschuldigung.",
    "translation": "Özür dilemesinde ısrar ediyor."
  },
  {
    "verb": "bestehen",
    "prep": "aus",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeyden) oluşmak",
    "example": "Das Team besteht aus fünf Personen.",
    "translation": "Takım beş kişiden oluşuyor."
  },
  {
    "verb": "bestehen",
    "prep": "in",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyden ibaret olmak",
    "example": "Das Problem besteht in der fehlenden Zeit.",
    "translation": "Sorun zaman eksikliğinden ibaret."
  },
  {
    "verb": "dienen",
    "prep": "zu",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeye hizmet etmek/yaramak",
    "example": "Dieses Gerät dient zur Reinigung.",
    "translation": "Bu cihaz temizlik için kullanılıyor."
  },
  {
    "verb": "eingehen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir konuya değinmek / ilgilenmek",
    "example": "Der Redner geht auf die Fragen ein.",
    "translation": "Konuşmacı soruları yanıtlıyor."
  },
  {
    "verb": "eintreten",
    "prep": "für",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şey için) savunmak",
    "example": "Sie tritt für Gleichberechtigung ein.",
    "translation": "Eşit haklar için savunuyor."
  },
  {
    "verb": "entstehen",
    "prep": "aus",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyden meydana gelmek",
    "example": "Aus dem Streit entstand eine tiefe Feindschaft.",
    "translation": "Kavgadan derin bir düşmanlık doğdu."
  },
  {
    "verb": "experimentieren",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyle deney yapmak",
    "example": "Der Chemiker experimentiert mit neuen Stoffen.",
    "translation": "Kimyager yeni maddelerle deneyler yapıyor."
  },
  {
    "verb": "folgern",
    "prep": "aus",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyden sonuç çıkarmak",
    "example": "Was folgern wir aus dieser Situation?",
    "translation": "Bu durumdan ne sonuç çıkarıyoruz?"
  },
  {
    "verb": "führen",
    "prep": "zu",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeye yol açmak/neden olmak",
    "example": "Stress kann zu Krankheiten führen.",
    "translation": "Stres hastalıklara yol açabilir."
  },
  {
    "verb": "greifen",
    "prep": "nach",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeye uzanmak/tutmaya çalışmak",
    "example": "Er greift nach dem Glas.",
    "translation": "Bardağa uzanıyor."
  },
  {
    "verb": "handeln",
    "prep": "von",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şey) hakkında olmak",
    "example": "Das Buch handelt von einem Detektiv.",
    "translation": "Kitap bir dedektif hakkında."
  },
  {
    "verb": "hinauslaufen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir anlama/sonuca varmak",
    "example": "Alles läuft auf dasselbe Ergebnis hinaus.",
    "translation": "Her şey aynı sonuca varıyor."
  },
  {
    "verb": "hinweisen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şeye) dikkat çekmek",
    "example": "Er weist auf das Problem hin.",
    "translation": "Probleme dikkat çekiyor."
  },
  {
    "verb": "investieren",
    "prep": "in",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şeye yatırım yapmak",
    "example": "Sie investiert viel Zeit in ihr Hobby.",
    "translation": "Hobisine çok zaman yatırıyor."
  },
  {
    "verb": "klagen",
    "prep": "über",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şeyden) şikâyet etmek",
    "example": "Er klagt über starke Kopfschmerzen.",
    "translation": "Şiddetli baş ağrısından şikâyet ediyor."
  },
  {
    "verb": "klarkommen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "biriyle/bir şeyle başa çıkmak",
    "example": "Ich komme gut mit meinem neuen Kollegen klar.",
    "translation": "Yeni iş arkadaşımla iyi anlaşıyorum."
  },
  {
    "verb": "neigen",
    "prep": "zu",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeye eğilimli/yatkın olmak",
    "example": "Er neigt zur Übertreibung.",
    "translation": "Abartmaya meyilli."
  },
  {
    "verb": "plädieren",
    "prep": "für",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şey) lehinde savunmak",
    "example": "Der Anwalt plädiert für Freispruch.",
    "translation": "Avukat beraat için savunuyor."
  },
  {
    "verb": "profitieren",
    "prep": "von",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeyden) faydalanmak",
    "example": "Alle profitieren von dieser Lösung.",
    "translation": "Herkes bu çözümden faydalanıyor."
  },
  {
    "verb": "rechnen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeyi) beklemek / hesaba katmak",
    "example": "Ich rechne mit Verzögerungen.",
    "translation": "Gecikmeleri hesaba katıyorum."
  },
  {
    "verb": "reflektieren",
    "prep": "über",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şey) üzerine düşünmek",
    "example": "Sie reflektiert über ihre Entscheidungen.",
    "translation": "Kararları üzerine düşünüyor."
  },
  {
    "verb": "resultieren",
    "prep": "aus",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeyden) kaynaklanmak",
    "example": "Das Problem resultiert aus Missverständnissen.",
    "translation": "Sorun yanlış anlamalardan kaynaklanıyor."
  },
  {
    "verb": "schließen",
    "prep": "aus",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyden sonuç çıkarmak",
    "example": "Ich schließe aus deinen Worten, dass du wütend bist.",
    "translation": "Sözlerinden kızgın olduğunu çıkarıyorum."
  },
  {
    "verb": "sich auseinandersetzen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeyle) derinlemesine ilgilenmek",
    "example": "Er setzt sich mit dem Thema auseinander.",
    "translation": "Konuyu derinlemesine inceliyor."
  },
  {
    "verb": "sich auswirken",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şeye etki etmek",
    "example": "Das Wetter wirkt sich auf meine Stimmung aus.",
    "translation": "Hava durumu ruh halimi etkiliyor."
  },
  {
    "verb": "sich befassen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyle meşgul olmak/ilgilenmek",
    "example": "Die Studie befasst sich mit dem Klimawandel.",
    "translation": "Çalışma iklim değişikliği ile ilgileniyor."
  },
  {
    "verb": "sich begeistern",
    "prep": "für",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şeye) coşmak",
    "example": "Sie begeistert sich für klassische Musik.",
    "translation": "Klasik müziğe coşuyor."
  },
  {
    "verb": "sich belaufen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir miktara/tutara ulaşmak",
    "example": "Die Kosten belaufen sich auf 500 Euro.",
    "translation": "Maliyetler 500 Euro tutuyor."
  },
  {
    "verb": "sich beschränken",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şeyle sınırlı kalmak",
    "example": "Wir beschränken uns auf das Wichtigste.",
    "translation": "Kendimizi en önemli şeylerle sınırlandırıyoruz."
  },
  {
    "verb": "sich beziehen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şeye) atıfta bulunmak",
    "example": "Das bezieht sich auf das letzte Kapitel.",
    "translation": "Bu son bölüme atıfta bulunuyor."
  },
  {
    "verb": "sich distanzieren",
    "prep": "von",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "birinden/bir şeyden uzak durmak",
    "example": "Er distanziert sich von diesen Aussagen.",
    "translation": "Bu açıklamalardan uzak duruyor."
  },
  {
    "verb": "sich eignen",
    "prep": "für",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şey için uygun olmak",
    "example": "Sie eignet sich für diese Position.",
    "translation": "Bu pozisyon için uygun."
  },
  {
    "verb": "sich eignen",
    "prep": "zu",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeye/bir amaca uygun olmak",
    "example": "Das Holz eignet sich zum Bauen.",
    "translation": "Ahşap inşaat yapmaya uygun."
  },
  {
    "verb": "sich einsetzen",
    "prep": "für",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şey için çaba göstermek/savunmak",
    "example": "Sie setzt sich für die Tierrechte ein.",
    "translation": "Hayvan haklarını savunuyor."
  },
  {
    "verb": "sich einstellen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şeye kendini hazırlamak/uymak",
    "example": "Wir müssen uns auf schlechtes Wetter einstellen.",
    "translation": "Kendimizi kötü havaya hazırlamalıyız."
  },
  {
    "verb": "sich entscheiden",
    "prep": "für",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şeyi) tercih etmek",
    "example": "Ich entscheide mich für das rote Kleid.",
    "translation": "Kırmızı elbiseyi seçiyorum."
  },
  {
    "verb": "sich entschuldigen",
    "prep": "für",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şey için) özür dilemek",
    "example": "Er entschuldigt sich für seinen Fehler.",
    "translation": "Hatasından dolayı özür diliyor."
  },
  {
    "verb": "sich ergeben",
    "prep": "aus",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyden ortaya çıkmak/sonuçlanmak",
    "example": "Das Problem ergibt sich aus dem Missverständnis.",
    "translation": "Sorun yanlış anlamadan kaynaklanıyor."
  },
  {
    "verb": "sich richten",
    "prep": "nach",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeye uymak/göre hareket etmek",
    "example": "Wir richten uns nach den Regeln.",
    "translation": "Kurallara göre hareket ediyoruz."
  },
  {
    "verb": "sich rächen",
    "prep": "an",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "birinden intikam almak",
    "example": "Er will sich an seinem Feind rächen.",
    "translation": "Düşmanından intikam almak istiyor."
  },
  {
    "verb": "sich rächen",
    "prep": "für",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şeyin intikamını almak",
    "example": "Sie rächt sich für die Beleidigung.",
    "translation": "Hakaretin intikamını alıyor."
  },
  {
    "verb": "sich sehnen",
    "prep": "nach",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeye) özlem duymak",
    "example": "Sie sehnt sich nach ihrer Heimat.",
    "translation": "Memleketine özlem duyuyor."
  },
  {
    "verb": "sich spezialisieren",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir alanda) uzmanlaşmak",
    "example": "Er spezialisiert sich auf Steuerrecht.",
    "translation": "Vergi hukukunda uzmanlaşıyor."
  },
  {
    "verb": "sich unterscheiden",
    "prep": "von",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeyden) farklı olmak",
    "example": "Dieses Modell unterscheidet sich von den anderen.",
    "translation": "Bu model diğerlerinden farklı."
  },
  {
    "verb": "spekulieren",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şey üzerine spekülasyon yapmak",
    "example": "Er spekuliert auf steigende Aktienkurse.",
    "translation": "Yükselen hisse senedi fiyatları üzerine spekülasyon yapıyor."
  },
  {
    "verb": "stoßen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şeyle) karşılaşmak",
    "example": "Wir stoßen auf Widerstand.",
    "translation": "Dirençle karşılaşıyoruz."
  },
  {
    "verb": "streben",
    "prep": "nach",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeyin) peşinden koşmak",
    "example": "Er strebt nach Perfektion.",
    "translation": "Mükemmelliğin peşinden koşuyor."
  },
  {
    "verb": "umgehen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şeyle) başa çıkmak",
    "example": "Wie gehst du mit Stress um?",
    "translation": "Stresle nasıl başa çıkıyorsun?"
  },
  {
    "verb": "urteilen",
    "prep": "über",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şey) hakkında yargıda bulunmak",
    "example": "Man sollte nicht über andere urteilen.",
    "translation": "İnsanlar başkalarını yargılamamalı."
  },
  {
    "verb": "verfügen",
    "prep": "über",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şeye) sahip olmak",
    "example": "Er verfügt über viel Erfahrung.",
    "translation": "Çok deneyime sahip."
  },
  {
    "verb": "verlangen",
    "prep": "nach",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyi talep etmek/arzulamak",
    "example": "Die Situation verlangt nach einer schnellen Lösung.",
    "translation": "Durum hızlı bir çözüm gerektiriyor."
  },
  {
    "verb": "verstoßen",
    "prep": "gegen",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir kurala/yasaya karşı gelmek",
    "example": "Er hat gegen das Gesetz verstoßen.",
    "translation": "Yasayı ihlal etti."
  },
  {
    "verb": "vertrauen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şeye/birine güvenmek",
    "example": "Man muss auf seine Fähigkeiten vertrauen.",
    "translation": "İnsan kendi yeteneklerine güvenmeli."
  },
  {
    "verb": "verweisen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şeye havale etmek/işaret etmek",
    "example": "Der Autor verweist auf sein früheres Buch.",
    "translation": "Yazar önceki kitabına atıfta bulunuyor."
  },
  {
    "verb": "verzichten",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "(bir şeyden) vazgeçmek",
    "example": "Ich verzichte auf Alkohol.",
    "translation": "Alkolden vazgeçiyorum."
  },
  {
    "verb": "zurückführen",
    "prep": "auf",
    "kasus": "Akk",
    "level": "B2",
    "meaning": "bir şeyi bir nedene dayandırmak",
    "example": "Der Erfolg ist auf harte Arbeit zurückzuführen.",
    "translation": "Başarı sıkı çalışmaya dayanmaktadır."
  },
  {
    "verb": "zusammenarbeiten",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(biriyle) işbirliği yapmak",
    "example": "Wir arbeiten eng mit dem Team zusammen.",
    "translation": "Ekiple yakın işbirliği yapıyoruz."
  },
  {
    "verb": "zusammenhängen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyle bağlantılı olmak",
    "example": "Seine Müdigkeit hängt mit dem Stress zusammen.",
    "translation": "Yorgunluğu stresle bağlantılı."
  },
  {
    "verb": "zählen",
    "prep": "zu",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir gruba dahil olmak/sayılmak",
    "example": "Er zählt zu den besten Spielern.",
    "translation": "En iyi oyuncular arasında yer alıyor."
  },
  {
    "verb": "zögern",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir konuda tereddüt etmek",
    "example": "Er zögert mit der Antwort.",
    "translation": "Cevap vermekte tereddüt ediyor."
  },
  {
    "verb": "übereinstimmen",
    "prep": "mit",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeyle aynı fikirde olmak",
    "example": "Meine Meinung stimmt mit deiner überein.",
    "translation": "Benim görüşüm seninkiyle uyuşuyor."
  },
  {
    "verb": "übergehen",
    "prep": "zu",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "bir şeye/konuya geçmek",
    "example": "Wir gehen nun zum nächsten Punkt über.",
    "translation": "Şimdi bir sonraki noktaya geçiyoruz."
  },
  {
    "verb": "überzeugen",
    "prep": "von",
    "kasus": "Dat",
    "level": "B2",
    "meaning": "(bir şey) konusunda ikna etmek",
    "example": "Er überzeugte mich von seiner Idee.",
    "translation": "Beni fikrine ikna etti."
  }
];
