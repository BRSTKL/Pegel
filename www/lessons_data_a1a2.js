const LESSONS_DATA_A1A2 = [
  {
    id: "ozel-fiil-yapilari",
    icon: "ti-bolt",
    name: "Özel Fiil Yapıları",
    subcategories: [
      {
        id: "ozel-fiil-yapilari-genel",
        name: "Özel Fiil Yapıları",
        lessons: [
          {
            id: "ayrilabilir-fiiller",
            title: "Ayrılabilir Fiiller (Trennbare Verben)",
            content: "Almancada \"Ayrılabilir Fiiller\" (Trennbare Verben), bir ön takı ve ana fiilden oluşan ve cümleye girdiklerinde ön takısı kopup cümlenin en sonuna atılan özel fiillerdir.\nBunu bir yumurtanın kırılıp ikiye ayrılmasına benzetebilirsin. Temel fiili özneye göre çekimleyip cümlenin sarsılmaz 2. sırasına yerleştirirsin, kopardığın ön takıyı ise hiçbir değişime uğratmadan cümlenin ta en sonuna atarsın.\n* \"aufmachen\" (açmak) → Ich mache das Fenster auf. (Pencereyi açıyorum.)\n* \"aufräumen\" (toplamak) → Ich räume das Zimmer auf. (Odayı topluyorum.)\nGeçmiş zamanda (Perfekt) ise kural yine çok pratik işler; geçmiş zamanı belirten \"-ge\" takısı, ön takı ile fiilin tam arasına girer.\n* \"einkaufen\" → eingekauft (alışveriş yaptım)\n* \"anrufen\" → angerufen (aradım)\nBu kopup cümlenin sonuna gitme mantığı kafana yattıysa, bu fiillerin Modal Fiillerle (müssen, können vb.) yan yana geldiğinde nasıl davrandığına da göz atabilirsin."
          },
          {
            id: "donuslu-fiiller",
            title: "Dönüşlü Fiiller (Reflexive Verben)",
            content: "Almancada \"Dönüşlü Fiiller\" (Reflexive Verben), eylemin doğrudan öznenin kendisine döndüğü, yani kişinin işi \"kendi kendine\" yaptığı özel fiil yapılarıdır. Bu fiilleri sözlükte her zaman başlarında bir \"sich\" zamiriyle görürsün (sich bewegen - hareket etmek, sich fühlen - hissetmek).\nCümle kurarken bu \"sich\" dönüşlülük zamiri özneye göre şekil değiştirir. Çoğunlukla ismin -i halinde (Akkusativ) çekimlenerek fiilin hemen yanına yerleşirler:\n* Ben (ich): mich → Ich muss mich bewegen. (Hareket etmeliyim.)\n* Sen (du): dich → Du sollst dich ins Bett legen. (Yatağa uzanmalısın.)\n* O (er/sie/es) ve Onlar/Siz (sie/Sie): sich → Wie fühlen Sie sich? (Kendinizi nasıl hissediyorsunuz?)\n* Biz (wir): uns → Wir fühlen uns nicht so gut. (Kendimizi iyi hissetmiyoruz.)\n* Siz (ihr): euch\nKısacası bu özel yapıların mantığı, cümlede fiili kullanırken her zaman özneye uygun bir \"kendini/kendimizi\" kelimesi eklemeyi zorunlu kılmasıdır."
          },
          {
            id: "edatli-fiiller",
            title: "Edatlı Fiiller (Verben mit Präpositionen)",
            content: "Almancada \"Edatlı Fiiller\" (Verben mit Präpositionen), kendilerine has belirli bir edatla (auf, an, mit vb.) birlikte kullanılan ve bu edatla ayrılmaz bir kalıp oluşturan özel fiillerdir. Bu fiillerin hangi edatla çalıştığını ve arkasından ismin i halini (Akkusativ) mi yoksa e/den halini (Dativ) mi istediğini kalıp olarak öğrenmen gerekir.\nEn temel üç örnek:\n* warten auf (Akkusativ): Birini veya bir şeyi beklemek. \"Seni bekliyorum\" → Ich warte auf dich.\n* denken an (Akkusativ): Birini düşünmek. \"Seni düşünüyorum\" → Ich denke an dich.\n* sprechen mit (Dativ): Biriyle konuşmak. \"Annemle konuşuyorum\" → Ich spreche mit meiner Mutter.\nKısacası, eylemi tek başına değil, her zaman ait olduğu o küçük edatla birlikte ezberlersin. \"Edatlı fiil\" mantığı kafana yattıysa, bu fiillere yönelik soru sormamızı sağlayan Edatlı Zarflar (Wo- ve Da- kelimeleri) konusuna geçebilirsin."
          },
          {
            id: "edatli-zarflar",
            title: "Edatlı Zarflar (Worauf, Dafür, vb.)",
            content: "Az önce konuştuğumuz \"edatlı fiillerle\" (Verben mit Präpositionen) soru sormak veya önceden bahsedilmiş bir duruma atıfta bulunmak istediğimizde \"Edatlı Zarflar\" (Präpositionaladverbien) devreye girer.\nSistem iki basit kelime üzerinden çalışır:\n* Soru Sorarken (Wo-): Bir eylemin neye, niçin veya ne hakkında yapıldığını sorarken edatın başına \"wo\" getirirsin.\n* Cevap Verirken (Da-): Daha önce bahsedilen bir şeye \"ona, bununla, bunun için\" diye kısaca karşılık verirken edatın başına \"da\" getirirsin.\nTek gramer kuralı: Eğer kullandığın edat sesli harfle başlıyorsa (auf, über gibi), araya kaynaştırma harfi \"r\" girer (wo-r-auf, da-r-auf). Sessiz harfle başlıyorsa (mit, von gibi) doğrudan birleşir (wo-mit, da-von).\nLust haben auf (canı bir şey çekmek) kalıbıyla görelim:\n* Canın ne istiyor? → Worauf hast du Lust?\n* Canım dondurma istiyor. → Ich habe Lust auf Eis.\n* Benim de canım onu istiyor. → Ich habe darauf auch Lust.\nGördüğün gibi \"darauf\", uzun uzun dondurmadan bahsetmek yerine \"ona/buna\" diyerek cümleyi pratik bir şekilde toparlamamızı sağlar."
          },
          {
            id: "edilgen-yapi",
            title: "Edilgen Yapı (Passiv Präsens)",
            content: "Almancada \"Passiv Präsens\" (Edilgen Çatı), eylemi kimin yaptığının önemli olmadığı, asıl vurgunun yapılan işin üzerinde olduğu özel bir fiil yapısıdır.\nBu yapıyı kurmak için werden yardımcı fiilini ve asıl fiilin geçmiş zaman (Perfekt) halini kullanırsın. Kural şaşmaz: \"Werden\" fiili cümlenin yeni öznesine göre çekimlenip 2. sıraya yerleşir, asıl yapılan eylem ise geçmiş zaman formunda cümlenin ta en sonuna fırlatılır.\n* Aktif Cümle: Ahmet arabasını tamir ediyor. → Ahmet repariert sein Auto.\n* Pasif Cümle: Araba tamir ediliyor. → Das Auto wird repariert.\nEğer eylemi kimin yaptığını ille de belirtmek istersen, araya von edatını (Dativ kuralıyla) ekleyebilirsin.\n* Pasif bize öğretmen tarafından anlatılıyor. → Das Passiv wird uns von der Lehrerin erklärt.\nAyrıca Almanlar genel emirler verirken de bu edilgen yapıyı çok sık kullanırlar:\n* Jetzt wird geschlafen! (Şimdi uyunacak!)"
          },
        ]
      }
    ]
  },
  {
    id: "artikeller-ve-haller",
    icon: "ti-abc",
    name: "Artikeller ve Haller",
    subcategories: [
      {
        id: "artikeller-ve-haller-genel",
        name: "Artikeller ve Haller",
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
    name: "Cümle Yapısı (Wortstellung)",
    subcategories: [
      {
        id: "temel-dizilim",
        name: "Temel Dizilim",
        lessons: [
          {
            id: "fiil-ikinci-sirada",
            title: "Fiil Her Zaman İkinci Sırada",
            content: "Almancada \"Temel Dizilim\" (cümle kurma mantığı) aslında tek bir demir kuralın etrafında döner: Cümlenin patronu fiildir ve her zaman 2. koltukta oturur.\nBu kuralın getirdiği harika bir kolaylık vardır: İstediğin gibi esneklik yapabilir, vurgulamak istediğin kelimeyi cümlenin en başına (1. sıraya) alabilirsin. Fiil asla yerinden kalkmaz.\nMektup örneğiyle görelim:\n* Ben yazıyorum yarın babama bir mektup. → Ich schreibe morgen meinem Vater einen Brief.\n* Yarın yazıyorum ben babama bir mektup. → Morgen schreibe ich meinem Vater einen Brief. (\"Yarın\" vurgulandı, fiil yine 2. sırada)\n* Babama yazıyorum ben yarın bir mektup. → Meinem Vater schreibe ich morgen einen Brief. (\"Kime\" vurgulandı)\nPeki iki fiil varsa? Diyelim ki \"Yüzmeye gitmek istiyorum\" diyeceksin. Sana göre çekimlenen fiil (istiyorum) 2. sıraya oturur. Asıl olayı anlatan diğer fiil (yüzmek) ise hiçbir ek almadan cümlenin en sonuna atılır.\n* Ich will schwimmen gehen."
          },
          {
            id: "ozne-fiil-uyumu",
            title: "Özne ve Fiil Uyumu",
            content: "Almancada \"Temel Dizilim\" içinde özne ve fiil sadece ayrılmaz bir ikili olmakla kalmaz, aynı zamanda birbirlerine kusursuz bir uyum sağlamak zorundadır.\nCümlenin 2. sırasında sabit duran patronumuz (fiil), her zaman özneye (işi yapan kişiye) göre ekler alarak şekil değiştirir, yani çekimlenir. Örneğin, \"gitmek\" anlamına gelen gehen fiilini düşünelim:\n* Özne \"Ben\" (Ich) ise, fiil \"-e\" takısı alır: Ich gehe (Ben gidiyorum)\n* Özne \"Sen\" (Du) ise, fiil \"-st\" takısı alır: Du gehst (Sen gidiyorsun)\n* Özne \"O\" (Er/Sie/Es) ise, fiil \"-t\" takısı alır: Er geht (O gidiyor)\nCümleye \"yarın\" veya \"bugün\" gibi bir zaman zarfıyla başlayıp özneyi 3. sıraya kaydırsan bile bu kural asla bozulmaz. Fiil 2. sırada kalır ve her zaman yanındaki özneye uygun ekini üzerinde taşır.\n* Morgen gehe ich in die Schule. (Yarın okula gidiyorum.) — fiil hâlâ 2. sırada, özne 3. sıraya kaydı."
          },
          {
            id: "soru-cumleleri",
            title: "Soru Cümleleri (Ja/Nein & W-Fragen)",
            content: "Almancada soru sormak, o meşhur \"patron (fiil) her zaman 2. sıradadır\" kuralını nerede koruyup nerede bozacağımızla ilgilidir.\n1. W-Fragen (Soru Kelimeli Sorular)\nKim (Wer), Ne (Was), Nerede (Wo) gibi soru kelimeleriyle sorulan sorulardır. Bu sorularda temel kural asla bozulmaz. Soru kelimesi 1. koltuğa oturur, çekimli fiil o sarsılmaz 2. sıradaki yerini korur.\n* Woher (1) kommst (2) du (3)? (Nereden geliyorsun?)\n* Was (1) machst (2) du (3) heute? (Bugün ne yapıyorsun?)\n2. Ja/Nein Fragen (Evet/Hayır Soruları)\nİşte kuralın bozulduğu yer burasıdır! Eğer cevabı sadece \"Evet\" veya \"Hayır\" olacak bir soru soruyorsan, fiili yerinden kaldırıp cümlenin en başına, yani 1. sıraya koyman gerekir. Özne ise hemen onun peşinden 2. sıraya yerleşir.\n* Ist (1) das (2) ein Bleistift? (Bu bir kurşun kalem mi?)\n* Kannst (1) du (2) schwimmen? (Yüzebiliyor musun?)\nÖzetle: Cümlenin başında bir \"W\" soru kelimesi varsa fiil her zamanki gibi 2. sıradadır. Soru kelimesi yoksa fiil cümlenin en başına geçer."
          },
        ]
      },
      {
        id: "tekamolo-kurali",
        name: "TeKaMoLo Kuralı",
        lessons: [
          {
            id: "temporal",
            title: "Temporal (Ne Zaman)",
            content: "Almancada \"TeKaMoLo\", fiilden sonraki kelime yığınını hangi sıraya koyacağını gösteren basit bir formüldür. Bu formülün başı olan T (Temporal), \"Zaman\" anlamına gelir ve eylemin \"Ne zaman?\" (Wann?) yapıldığını belirtir.\nKural çok nettir: Fiili 2. sıraya yerleştirdikten sonra geri kalan bilgileri dizerken, zaman bildiren kelimeler (bugün, yarın, saat 3'te vb.) her zaman önceliğe sahiptir ve kuyruğun en başında yer alır. Yani \"neden\", \"nasıl\" veya \"nereye\" detaylarına geçmeden önce mutlaka \"ne zaman\" sorusunu cevaplamalısın.\nÖrnek:\n* Ich gehe morgen (zaman) wegen der Arbeit (neden) schnell (nasıl) in die Stadt (nereye).\n* Ben yarın iş yüzünden hızlıca şehre gidiyorum.\nBunun sağladığı bir özgürlük de şudur: Eğer zamanı vurgulamak istersen, zaman kelimesini cümlenin en başına (1. sıraya) da alabilirsin; bu durumda fiil değişmez 2. sırasında kalır ve özne onun sağına geçer.\n* Morgen gehe ich in die Stadt. (Yarın şehre gidiyorum.)"
          },
          {
            id: "kausal",
            title: "Kausal (Neden)",
            content: "TeKaMoLo kuyruğundaki ikinci vagonumuz K (Kausal), yani \"Neden/Sebep\" bölümüdür. Zamanı (Temporal) belirttikten hemen sonra, eğer eylemi neden yaptığını açıklayacaksan bunu ikinci sıraya koyarsın.\nBu kısım Almancayı yeni öğrenenler için biraz zorlayıcı olabilir. Çünkü basit bir kelime yerine \"hastalığımdan dolayı\" (wegen meiner Krankheit) veya \"bir kaza sebebiyle\" (aufgrund eines Unfalls) gibi özel tamlamalar kurmanı gerektirir.\nBaşlangıç seviyesinde bu bilgiyi araya sıkıştırmak yerine, cümleyi normal bitirip sonuna \"weil\" (çünkü) bağlacıyla yeni bir açıklama cümlesi eklemek çok daha kolay ve yaygındır.\n* Ich kann heute nicht kommen, weil ich krank bin. (Bugün gelemiyorum, çünkü hastayım.)\nUnutma, her mükemmel cümlede bir neden belirtmek zorunda değilsin; eğer bir sebebin yoksa bu adımı rahatça atlayabilirsin."
          },
          {
            id: "modal",
            title: "Modal (Nasıl)",
            content: "TeKaMoLo trenindeki üçüncü vagonumuz M (Modal), yani eylemin \"Nasıl?\" (Wie?) yapıldığını anlatan kısımdır. Zamanı (Temporal) ve sebebi (Kausal) belirttikten sonra, işi ne şekilde yaptığını buraya eklersin.\nBu bölümde çoğunlukla eylemi tarif eden sıfatları ve zarfları kullanırız:\n* \"hızlıca\" (schnell)\n* \"çok yavaş\" (sehr langsam)\n* \"çok geç\" (zu spät)\nDiyelim ki \"hızlıca doktora gitmeliyim\" diyeceksin; \"hızlıca\" kelimesini cümlenin en sonundaki mekan bilgisinden hemen önceye yerleştirirsin:\n* Ich muss morgen (zaman) schnell (nasıl) zum Arzt (nereye). (Yarın hızlıca doktora gitmeliyim.)\nEylemin nasıl gerçekleştiğini betimleme işini de hallettiğimize göre, kuyruğun son vagonu olan \"Nereye/Nerede\" (Lokal) kısmına geçebiliriz."
          },
          {
            id: "lokal",
            title: "Lokal (Nerede/Nereye)",
            content: "TeKaMoLo treninin son vagonu L (Lokal), yani mekan ve yer bildiren kısımdır. Bu bölüm, olayın \"Nerede?\", \"Nereye?\" veya \"Nereden?\" gerçekleştiğini açıklar.\nKurala göre; zamanı, sebebi ve durumu (nasıl yapıldığını) anlattıktan sonra mekan bilgisini cümlenin en sonuna eklersin. Yani Almancada cümlenin detaylarını dizerken, olayın geçtiği yer bilgisi her zaman bu kuyruğun en sonunda yer alır.\nTam bir TeKaMoLo cümlesi örneği:\n* Ich fahre morgen (Te-zaman) wegen der Arbeit (Ka-neden) schnell (Mo-nasıl) nach Berlin (Lo-nereye).\n* Ben yarın iş yüzünden hızlıca Berlin'e gidiyorum.\nBöylece TeKaMoLo (Zaman - Neden - Nasıl - Mekan) sıralamasını tamamen bitirmiş olduk! Bu vagonları sırasıyla birbirine bağlamak Almancada doğal ve akıcı cümleler kurmanın temelidir."
          },
        ]
      }
    ]
  },
  {
    id: "baglaçlar-ve-yan-cumleler",
    icon: "ti-sitemap",
    name: "Bağlaçlar ve Yan Cümleler",
    subcategories: [
      {
        id: "fiili-sona-atanlar",
        name: "Fiili Sona Atanlar",
        lessons: [
          {
            id: "weil",
            title: "Weil (Çünkü/İçin)",
            content: "\"Fiili sona atanlar\" (yan cümleler) kulübünün en meşhur ve en çok kullanılan üyesi Weil (çünkü / -dığı için) kelimesidir.\nHatırlarsan, normalde kral (fiil) hep 2. koltuktaydı. Ancak cümleye weil girdiği an işler değişir. Weil öylesine güçlü bir bağlaçtır ki, kralı 2. sıradaki sarsılmaz tahtından kaldırıp cümlenin taaa en sonuna fırlatır.\nBasit bir örnekle görelim:\n* Normal cümle: O hasta. → Sie ist krank.\n* Weil girince: Begi çalışmıyor, çünkü o hasta. → Begi arbeitet nicht, weil sie krank ist.\nAslında weil ve diğer fiili sona atan bağlaçların mantığı bizim Türkçedeki cümle yapımıza çok benzer, çünkü biz de eylemi hep cümlenin en sonuna atarız.\nEğer cümleye doğrudan \"Weil\" ile başlarsak:\n* Weil sie krank ist, arbeitet Begi nicht. (Hasta olduğu için, Begi çalışmıyor.) — virgülden sonra fiil hemen başa gelir!"
          },
          {
            id: "dass",
            title: "Dass (-dığı/da)",
            content: "Almancada \"dass\" bağlacı, tıpkı \"weil\" gibi o meşhur \"fiili sona atanlar\" (yan cümle) kulübünün en önemli üyelerinden biridir. Türkçemize \"-dığı\", \"-eceği\" veya bazen sadece \"ki\" olarak çevrilir.\nMantığı çok basittir: İki ayrı cümleyi birbirine bağlamak için kullanılır. Cümleye \"dass\" girdiği an, o cümlenin çekimli fiilini (patronu) 2. sıradaki yerinden söküp alır ve taaa en sona fırlatır.\nBunu yaparken Almanlar önce asıl olayı (ana cümleyi) söyler, sonra virgül koyup \"dass\" ile açıklamayı ekler:\n1. Önce asıl olayı söylersin: \"Bilmiyordum...\" → Ich wusste nicht,\n2. Araya \"dass\" koyarsın: ...dass...\n3. Sonra fiili en sona atarak cümleyi bitirirsin: ...du mich liebst. (sen beni seviyorsun)\nSonuç: Ich wusste nicht, dass du mich liebst. (Beni sevdiğini bilmiyordum.)\nBu mantık tıpkı bizim Türkçede fiili hep en sona saklamamıza benzer."
          },
          {
            id: "wenn",
            title: "Wenn (Eğer/Zaman)",
            content: "\"Fiili sona atanlar\" (yan cümleler) kulübünün bir diğer güçlü üyesi Wenn bağlacıdır. Cümlenin gidişatına göre Türkçeye \"eğer/şayet\" (koşul) veya \"-dığı zaman / -dığında\" (zaman) olarak çevrilir.\nTıpkı \"weil\" ve \"dass\" bağlaçlarında olduğu gibi, bir cümleye Wenn girdiğinde o cümlenin çekimli fiili mecburen cümlenin en sonuna atılır.\n1. Cümlenin Ortasında Kullanım:\nÖnce asıl olayı normal temel dizilim kurallarıyla kurarsın, ardından virgül koyup \"wenn\" ile devam edersin.\n* Sana ödevinde yardım ederim, eğer zamanım olursa. → Ich helfe dir bei deinen Hausaufgaben, wenn ich Zeit habe.\n2. Cümlenin Başında Kullanım:\nCümleye doğrudan \"Wenn\" ile başlarsan, bu cümlenin fiili yine en sona gider. Dikkat: Wenn cümlesini başa alırsan, virgülden sonraki ana cümle mutlaka çekimli fiil ile başlamak zorundadır!\n* Wenn ich Zeit habe, helfe ich dir bei deinen Hausaufgaben.\nFark ettiysen \"habe\" ve \"helfe\" fiilleri virgülün sağında ve solunda yan yana geldi."
          },
          {
            id: "ob",
            title: "Ob (-ıp -madığı)",
            content: "\"Fiili sona atanlar\" (yan cümleler) kulübünün bir diğer harika üyesi Ob bağlacıdır. Türkçeye \"-ıp/madığı\" veya \"edip/etmediği\" şeklinde çevrilir.\nTıpkı weil, dass ve wenn gibi, cümleye Ob girdiğinde çekimli fiil (patron) o değişmez ikinci sırasından kalkıp mecburen cümlenin en sonuna atılır.\nBurada işini kolaylaştıracak en önemli detay şudur: \"Ob\" kelimesi zaten tek başına \"-ıp/madığı\" anlamını içinde barındırdığı için, Almanca cümlenin içine ekstra bir olumsuzluk kelimesi (nicht) eklemeye hiç gerek yoktur.\nÖrneklerle görelim:\n* Normal Cümle: O burada. → Er ist da.\n* Ob Girince: Onun burada olup olmadığını bilmiyorum. → Ich weiß nicht, ob er da ist.\nGördüğün gibi, asıl olayı (\"Bilmiyorum\") söyledikten sonra araya \"ob\" koyuyoruz ve fiili (ist) en sona fırlatıyoruz. Eğer istersen cümlenin sonuna \"oder nicht\" (ya da değil) ekleyebilirsin ama hiç gerek yoktur."
          },
        ]
      },
      {
        id: "cumle-basi-ortasi-baglaçlar",
        name: "Cümle Başı/Ortası Bağlaçlar",
        lessons: [
          {
            id: "trotzdem",
            title: "Trotzdem (Buna Rağmen)",
            content: "Almancada \"Trotzdem\", \"buna rağmen\" demektir ve iki cümleyi birbirine bağlarken beklenmedik bir durumu veya zıtlığı ifade etmek için kullanılır. Daha önce konuştuğumuz \"fiili sona fırlatan\" yan cümle bağlaçlarından (weil, dass, wenn) farklı olarak, trotzdem bambaşka bir mantıkla çalışır.\nOlayı en basit haliyle şöyle düşünmelisin: Trotzdem bir cümleye başlarken 1. sırayı kaplayan güçlü bir kelimedir. Kuralımız neydi? Çekimli fiil (patron) her zaman 2. sıradadır. Bu yüzden, trotzdem kelimesinden hemen sonra her zaman çekimli fiil gelmek zorundadır.\n* Er hat kein Geld, trotzdem arbeitet er nicht. (Onun parası yok, buna rağmen çalışmıyor.)\nSakın \"trotzdem er arbeitet nicht\" deme hatasına düşme; çünkü trotzdem 1. sırayı almıştır, fiil mecburen 2. sıraya oturur ve özne 3. sıraya kayar.\nBu bağlacın güzel bir esnekliği de vardır. Eğer cümleleri nokta ile ayırmak istersen, özne ile trotzdem'in yerini değiştirebilirsin:\n* Er hat kein Geld. Trotzdem arbeitet er nicht.\n* Er hat kein Geld. Er arbeitet trotzdem nicht.\nHer iki durumda da fiil o sarsılmaz 2. sırasında kalır."
          },
          {
            id: "deshalb-deswegen",
            title: "Deshalb / Deswegen (Bu Yüzden)",
            content: "Almancada \"deshalb\" ve \"deswegen\" bağlaçları \"bu yüzden\" veya \"bu sebeple\" anlamına gelir. Tıpkı trotzdem bağlacında olduğu gibi, bu kelimeler de bulundukları cümlenin 1. sırasını kaplarlar. Bu kuralın doğal bir sonucu olarak, bu bağlaçlardan hemen sonra her zaman çekimli fiil (2. sırada) gelmek zorundadır.\nCümle kurarken önce asıl olayı söylersin, ardından bağlacı ve fiili getirerek sonucu açıklarsın:\n* Daha fazla paraya ihtiyacım var, deshalb gehe ich zur Bank. (bu yüzden bankaya gidiyorum)\nSakın \"deshalb ich gehe\" deme hatasına düşme; fiil daima bağlacın hemen sağında olmalıdır.\nDeshalb ve Deswegen Arasındaki Fark:\nGramatik olarak hiçbir farkları yoktur, ikisini de aynı şekilde kullanabilirsin. Ancak Almanlar günlük konuşma dilinde \"deswegen\" kelimesini çok daha sık kullanırlar. Günlük hayatta duyduğun bir olaya sadece:\n* \"Ah, deswegen!\" (Ha, bu yüzden!)\n* \"Genau deswegen!\" (Tam da bu yüzden!)\ndiyerek kısa tepkiler verebilirsin. Raporlar gibi daha resmi ve yazılı metinlerde ise genellikle \"deshalb\" tercih edilir."
          },
          {
            id: "denn",
            title: "Denn (Çünkü)",
            content: ""
          },
        ]
      },
      {
        id: "dolayli-sorular",
        name: "Dolaylı Sorular",
        lessons: [
          { id: "indirekte-fragen", title: "Dolaylı Sorular (Indirekte Fragen)" },
        ]
      }
    ]
  },
  {
    id: "fiil-turleri-ve-zamanlar",
    icon: "ti-clock",
    name: "Fiil Türleri ve Zamanlar",
    subcategories: [
      {
        id: "modal-fiiller",
        name: "Modal Fiiller",
        lessons: [
          {
            id: "mussen",
            title: "Müssen (Zorunluluk)",
            content: "Almancada \"Modal Fiiller\", cümlenin asıl eylemine destek olan ve ona zorunluluk, yetenek veya istek gibi anlamlar katan özel fiillerdir. Bunlardan en temel olanı müssen, bir şeyi \"yapmak zorunda olmak\" yani mecburiyet anlamına gelir.\nAsıl Eylem En Sona Gider: Cümleye müssen girdiğinde, özneye göre çekimlenir ve değişmez 2. sıraya (patron koltuğuna) kurulur. Asıl yapmak zorunda olduğun işi anlatan fiil ise hiçbir değişime uğramadan (mastar halinde) cümlenin ta en sonuna atılır.\n* Ben Almanca öğrenmek zorundayım. → Ich muss Deutsch lernen.\n* Sen büroda çalışmak zorundasın. → Du musst im Büro arbeiten.\nÇekim Kolaylığı: Tüm modal fiillerin sana sağladığı harika bir kolaylık vardır; \"Ben\" (ich) ve \"O\" (er/sie/es) için yapılan çekimler birbirinin tamamen aynısıdır.\n* ich muss, er/sie/es muss\nSoru Sorarken: Müssen fiilini cümlenin en başına (1. sıraya) alırsın, asıl olay yine en sonda kalır.\n* O eve gitmek zorunda mı? → Muss sie nach Hause gehen?"
          },
          {
            id: "konnen",
            title: "Können (Yetenek/İmkân)",
            content: "Almancada \"Können\", bir şeyi \"yapabilmek\" yani yetenek veya imkân bildirmek için kullanılır. Tıpkı \"müssen\" (zorunluluk) fiilinde olduğu gibi, bu da bir modal fiildir ve cümlenin iskeletini tamamen aynı mantıkla kurar.\n1. Asıl Eylem Her Zaman En Sona Atılır:\nÖzneye göre çekimlediğin \"können\" fiilini cümlenin sarsılmaz 2. sırasına (patron koltuğuna) oturtursun. Senin asıl yeteneğini anlatan fiil ise hiçbir değişime uğramadan cümlenin ta en sonuna gider.\n* Ben gitar çalabilirim. → Ich kann Gitarre spielen.\n* O araba kullanabilir. → Sie kann Auto fahren.\n2. Ben ve O (Ich ve Er/Sie/Es) Kardeşliği:\nTüm modal fiillerde olan o harika kolaylık burada da geçerlidir. \"Ben\" (ich) ve \"O\" (er/sie/es) öznelerinin çekimleri tıpatıp aynıdır; ikisinde de fiil sadece kann olur. (Sen derken kannst, biz derken können olur.)\n3. Soru Sorarken Başa Geçer:\nBirine bir yeteneği olup olmadığını soracaksan, \"können\" fiilini alıp cümlenin en başına, 1. sıraya koyarsın. Asıl eylem yine en sonda uslu uslu bekler.\n* Yüzebilir misin? → Kannst du schwimmen?"
          },
          {
            id: "wollen",
            title: "Wollen (İstek/Niyet)",
            content: "Almancada wollen (istemek) fiili, bir şeyi yapma isteğimizi veya niyetimizi belirtir. Daha önce konuştuğumuz \"müssen\" ve \"können\" ile tamamen aynı mantıkla çalışır. Yani o meşhur \"patron 2. sırada, asıl eylem en sonda\" kuralı burada da tıkır tıkır işler.\n1. Asıl Eylem Her Zaman En Sona Atılır:\nÖzneye göre çekimlediğin \"wollen\" fiilini cümlenin 2. sırasına yerleştirirsin. Senin asıl yapmak istediğin eylem hiçbir ek almadan cümlenin ta en sonuna fırlatılır.\n* Müzik dinlemek istiyorum. → Ich will Musik hören.\n* O Almanya'da okumak istiyor. → Sie will in Deutschland studieren.\n2. Ben ve O (Ich ve Er/Sie/Es) Kardeşliği:\nTüm modal fiillerin o harika kolaylığı burada da var. \"Ben\" (ich) ve \"O\" (er/sie/es) öznelerinin çekimleri tıpatıp aynıdır; ikisinde de fiil will şeklini alır.\n3. Soru Sorarken Başa Geçer:\nBirine bir şey isteyip istemediğini soracaksan, \"wollen\" fiilini alıp cümlenin en başına, yani 1. sıraya koyarsın. Asıl eylem yine cümlenin en sonunda bekler.\n* Tenis oynamak istiyor musunuz? → Wollt ihr Tennis spielen?"
          },
          {
            id: "mochten",
            title: "Möchten (Kibar İstek)",
            content: "\"Modal Fiiller\" ailesinin en nazik üyesine geldik: Möchten. Bu fiil bir şeyi \"istemek\" veya \"arzu etmek\" anlamına gelir. Daha önce konuştuğumuz \"wollen\" fiili de istemek demektir ancak möchten çok daha kibar bir kullanımdır; bir kafede sipariş verirken veya günlük hayatta nazikçe bir şey isterken bunu kullanırız.\nTıpkı müssen, können ve wollen fiillerinde öğrendiğimiz gibi, bu ailenin sarsılmaz iskelet kuralları möchten için de aynen geçerlidir:\n1. Asıl Eylem Her Zaman En Sona Atılır:\nÖzneye göre çekimlediğin möchten fiilini cümlenin 2. sırasına yerleştirirsin. Senin asıl yapmak istediğin eylem hiçbir ek almadan, mastar halinde cümlenin ta en sonuna fırlatılır.\n* Sen su içmek istiyorsun. → Du möchtest Wasser trinken.\n* Biz tenis oynamak istiyoruz. → Wir möchten Tennis spielen.\n2. Ben ve O (Ich ve Er/Sie/Es) Kardeşliği:\n\"Ben\" (ich) ve \"O\" (er/sie/es) öznelerinin çekimleri tıpatıp aynıdır. İkisinde de fiil möchte şeklini alır.\n3. Soru Sorarken Başa Geçer:\nMöchten fiilini alıp cümlenin en başına (1. sıraya) koyarsın. Asıl eylem yine en sonda uslu uslu bekler.\n* Tenis oynamak istiyor musunuz? → Möchtet ihr Tennis spielen?"
          },
          {
            id: "durfen",
            title: "Dürfen (İzin/Yasak)",
            content: "\"Modal Fiiller\" ailesinin kuralları en çok seven üyesi Dürfen (izin/yasak) fiiline geldik!\nBir şeyi yapmaya gücümüzün yetmesi (können) veya mecbur olmamızdan (müssen) farklı olarak; dürfen, bir otoriteden (devlet, kurallar, anne-baba veya doktor gibi) izin aldığımızı veya yasaklı olduğumuzu anlatmak için kullanılır.\n1. Asıl Eylem Her Zaman En Sona Atılır:\nÖzneye göre çekimlediğin \"dürfen\" fiilini cümlenin 2. sırasına (patron koltuğuna) yerleştirirsin. Senin asıl yapmak için izin aldığın eylem ise hiçbir ek almadan, mastar halinde cümlenin ta en sonuna fırlatılır.\n* Çikolata yiyebilirim (Buna iznim var). → Ich darf Schokolade essen.\n2. Olumsuzluk (Nicht) Girdiğinde Kesin Bir Yasağa Dönüşür:\nEğer cümleye bir olumsuzluk kelimesi eklersen, bu \"iznim yok\" anlamından ziyade kesin bir yasağı ifade eder.\n* Yalan söyleyemezsin (Söylemene izin yok). → Du darfst nicht lügen.\n* Burada sigara içilmez (yasaktır). → Man darf hier nicht rauchen.\n3. Ben ve O (Ich ve Er/Sie/Es) Kardeşliği:\n\"Ben\" (ich) ve \"O\" (er/sie/es) öznelerinin çekimleri tıpatıp aynıdır. İkisinde de fiil kökten değişir ve darf şeklini alır. (Biz derken dürfen, siz derken dürft olur.)"
          },
          {
            id: "sollen",
            title: "Sollen (Tavsiye/Görev)",
            content: "Almancada \"Modal Fiiller\" ailesinin tavsiye ve görev bildiren üyesi sollen fiilidir ve Türkçeye \"-meli/-malı\" olarak çevrilir. Birinden bir tavsiye aldığımızda (örneğin bir doktorun \"spor yapmalısın\" demesi) veya bize bir görev verildiğinde bu fiili kullanırız.\nDiğer modal fiillerde öğrendiğimiz o meşhur iskelet kuralı burada da aynen geçerlidir:\nAsıl Eylem En Sona Gider:\nÖzneye göre çekimlediğin sollen fiilini cümlenin 2. sırasına (patron koltuğuna) yerleştirirsin. Asıl yapılması gereken eylem ise hiçbir ek almadan mastar halinde cümlenin en sonuna fırlatılır.\n* Erken kalkmalıyım. → Ich soll früh aufstehen.\n* Almanca öğrenmelisin. → Du sollst Deutsch lernen.\nBen ve O Kardeşliği:\n\"Ben\" (ich) ve \"O\" (er/sie/es) için çekimler tıpatıp aynıdır ve fiil soll şeklini alır.\nSoru Sorarken:\nBirine ne yapması gerektiğini sorarken sollen fiili başa, yani 1. sıraya geçer.\n* O spor yapmalı mı? → Soll er Sport machen?"
          },
        ]
      },
      {
        id: "zaman-formlari",
        name: "Zaman Formları",
        lessons: [
          {
            id: "prasens",
            title: "Präsens (Şimdiki ve Geniş Zaman)",
            content: "Almancada \"Präsens\" formu, Türkçedeki hem şimdiki zamanı (yapıyorum) hem de geniş zamanı (yaparım) tek başına karşılar.\nÖrneğin, \"Ich lerne Deutsch\" cümlesi duruma göre hem \"Ben Almanca öğreniyorum\" hem de \"Ben Almanca öğrenirim\" anlamına gelir. Hatta cümleye \"yarın\" veya \"bugün\" gibi bir zaman zarfı eklersen, bu form gelecek zaman anlamı bile taşıyabilir.\n* Ich lerne Deutsch. → Ben Almanca öğreniyorum / öğrenirim.\n* Morgen lerne ich Deutsch. → Yarın Almanca öğreneceğim.\nYani diğer dillerdeki gibi şimdiki zaman ve geniş zaman için fiilleri ayrı ayrı çekimlemeye hiç gerek yoktur. Tek bir Präsens formu her şeyi halleder!\nFiil çekimi hatırlatma:\n* ich lerne, du lernst, er/sie/es lernt\n* wir lernen, ihr lernt, sie/Sie lernen\nPräsens'in sağladığı bu büyük kolaylık kafana yattıysa, günlük hayatta geçmişte olan olayları anlatırken en çok kullandığımız \"Perfekt\" (Di'li Geçmiş Zaman) konusuna geçebilirsin."
          },
          {
            id: "perfekt",
            title: "Perfekt (-di'li Geçmiş Zaman)",
            content: "Almancada \"Perfekt\", günlük konuşma dilinde eylemleri \"-di'li\" geçmiş zamanla anlatmak için kullandığımız en yaygın formdur.\nBu zamanı kurabilmek için \"haben\" veya \"sein\" yardımcı fiillerinden birine ihtiyacın vardır. Kural yine o alıştığımız temel iskelet: Yardımcı fiil (haben veya sein) özneye göre çekimlenip 2. sıraya oturur, asıl hareket bildiren fiil ise geçmiş zaman formuna bürünerek (genellikle başına \"ge-\" alarak) cümlenin ta en sonuna fırlatılır.\n* Ich lerne Deutsch. (şimdiki) → Ich habe Deutsch gelernt. (geçmiş - Almanca öğrendim)\nHangisini seçeceğiz: haben mi, sein mi?\n* Eğer fiil bir yer değiştirme veya yönelim bildiriyorsa (gitmek, gelmek, uçmak, düşmek gibi): sein kullanırsın.\n* Ich bin nach Berlin gefahren. (Berlin'e gittim.)\n* Diğer fiillerin çok büyük bir kısmı haben ile kullanılır.\n* Ich habe das Buch gelesen. (Kitabı okudum.)\nAyrılabilir fiillerde de \"-ge-\" takısı ön ek ile fiilin arasına girer:\n* einkaufen → eingekauft\n* anrufen → angerufen"
          },
          {
            id: "prateritum",
            title: "Präteritum (Haben ve Sein)",
            content: "Almancada \"Zaman Formları\" içinde \"Präteritum\", günlük konuşmadan ziyade romanlarda, resmi yazışmalarda ve mektuplarda kullanılan \"yazılı geçmiş zaman\"dır. Anlam olarak daha önce konuştuğumuz \"Perfekt\" ile tamamen aynıdır, sadece gramer yapısı değişir.\nA2 seviyesinde bu zamanın en temel iki yapı taşı \"haben\" (sahip olmak) ve \"sein\" (olmak) fiilleridir:\nSein (war): Geçmişteki bir durumu veya bulunulan yeri belirtir.\n* Dün pazartesiydi. → Gestern war Montag.\n* Geçen hafta doktordaydım. → Du warst letzte Woche beim Arzt.\nHaben (hatte): Geçmişte sahip olduğun ama artık sende olmayan şeyleri anlatır.\n* Bir arabam vardı. → Ich hatte ein Auto.\nBurada işini çok kolaylaştıracak şaşmaz bir kural vardır: Präteritum formunda \"Ben\" (ich) ve \"O\" (er/sie/es) öznelerinin çekimleri birbiriyle tamamen aynıdır:\n* ich war = er war\n* ich hatte = er hatte"
          },
          {
            id: "konjunktiv-ii",
            title: "Konjunktiv II (Hätte, Wäre, Würde)",
            content: "Almancada \"Konjunktiv II\", gerçekleşmemiş dilekleri, istekleri, hayalleri veya varsayımları (dilek-şart kipi) ifade etmek için kullanılır. Gramer olarak \"Präteritum\" (yazılı geçmiş zaman) formundan türetilir, ancak anlam olarak kesinlikle geçmişi değil, şu anki veya gelecekteki hayali bir durumu anlatır.\nBu yapıyı kurabilmek için en temel üç fiilin Präteritum hallerindeki sesli harflerine iki nokta (umlaut) ekleyerek yumuşatırız:\n1. Wäre (Sein - Olmak)\nwar → wäre (a harfine iki nokta)\nKullanımı: Gerçekte orada değilsin ama bir yerde olmayı dilediğinde.\n* Şu an kumsalda olsam. → Ich wäre jetzt gerne am Strand.\n2. Hätte (Haben - Sahip Olmak)\nhatte → hätte (a harfine iki nokta)\nKullanımı: Gerçekte sahip olmadığın ama sahip olmayı dilediğin şeyler için.\n* Bir arabam olsa. → Ich hätte gerne ein Auto.\n3. Würde (Werden - Yardımcı Fiil)\nwurde → würde (u harfine iki nokta)\nKullanımı: Haben ve sein dışındaki diğer tüm asıl eylemlerle hayaller kurarken. Tıpkı modal fiillerde olduğu gibi, würde özneye göre çekimlenip 2. sıraya oturur. Asıl eylem ise mastar halinde cümlenin en sonuna atılır.\n* Yüzmeye gitsem. → Ich würde gerne schwimmen gehen.\ngerne (seve seve / isteyerek) kelimesi, cümleye \"isterdim\" anlamını katmak için sıkça kullanılır."
          },
        ]
      }
    ]
  },
  {
    id: "isim-ve-sifat-bilgisi",
    icon: "ti-vocabulary",
    name: "İsim ve Sıfat Bilgisi",
    subcategories: [
      {
        id: "zamirler",
        name: "Zamirler",
        lessons: [
          { id: "sahis-zamirleri", title: "Şahıs Zamirleri (Nominativ, Akkusativ, Dativ)" },
          { id: "iyelik-zamirleri", title: "İyelik Zamirleri (Possessivartikel)" },
        ]
      },
      {
        id: "sifatlar",
        name: "Sıfatlar",
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
    name: "Günlük Konular ve Kelimeler",
    subcategories: [
      {
        id: "temel-iletisim",
        name: "Temel İletişim",
        lessons: [
          { id: "selamlasma-vedalasma", title: "Selamlaşma ve Vedalaşma" },
          { id: "kendini-tanitma", title: "Kendini Tanıtma" },
          { id: "nasilsin", title: "Nasılsın? (Wie geht's?)" },
          { id: "yol-tarifi", title: "Yol Tarifi (Wegbeschreibung)" },
        ]
      },
      {
        id: "zaman-ve-sayilar",
        name: "Zaman ve Sayılar",
        lessons: [
          { id: "sayilar-siralama", title: "Sayılar ve Sıralama Sayıları" },
          { id: "saat-sorma", title: "Saat Sorma ve Söyleme" },
          { id: "gunler-aylar-mevsimler", title: "Günler, Aylar ve Mevsimler" },
          { id: "zaman-zarflari", title: "Zaman Zarfları (Morgens, Abends, vb.)" },
        ]
      },
      {
        id: "yasam-ve-cevre",
        name: "Yaşam ve Çevre",
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
    name: "Edatlar (Präpositionen)",
    subcategories: [
      {
        id: "edatlar-genel",
        name: "Edatlar",
        lessons: [
          { id: "yer-edatlari", title: "Yer Edatları (Lokale Präpositionen)" },
          { id: "yonelim-edatlari", title: "Yönelim Edatları (In, Zu, An, Nach)" },
          { id: "dativ-akkusativ-edatlar", title: "Dativ ve Akkusativ Alan Edatlar" },
        ]
      }
    ]
  },
];
