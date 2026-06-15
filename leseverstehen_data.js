// B1 German App - Leseverstehen Data
const LESEVERSTEHEN_DATA = [
  {
    id: "baumkuchen",
    title: "Baumkuchen",
    emoji: "🥮",
    hasImage: true,
    imagePath: "assets/baumkuchen.png",
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5. Finden Sie für jeden Text die passende Überschrift. Sie können jede Überschrift nur einmal benutzen. Markieren Sie Ihre Lösungen für die Aufgaben 1–5 auf dem Antwortbogen.",
    headings: {
      a: "Größere Menschen bekommen oft mehr Lohn",
      b: "Büro-Übungen beugen Rückenschmerzen vor",
      c: "Viel Stress, aber Job macht froh",
      d: "Luxus-Burger sorgt für Diskussionen",
      e: "Firmen organisieren eigene After-Work-Partys",
      f: "Soziale Medien kritisieren Restaurantpreise",
      g: "Einfache Übungen gegen Rückenschmerzen",
      h: "Forscher prüfen Einfluss der Ausstrahlung",
      i: "Feiern nach der Arbeit liegen im Trend",
      j: "Flexible Arbeitszeiten senken Stress"
    },
    texts: [
      {
        id: 1,
        content: "Der „Rücken-Gesundheits-Ratgeber“ vom GesundFit-Verlag ist ein praktisches Buch für alle, die Rückenschmerzen haben oder vorbeugen wollen. Der Autor, Dr. Martin Keller, erklärt in einfachen Worten, wie die Wirbelsäule funktioniert. Viele Fotos zeigen leichte Übungen für zu Hause und fürs Büro. Besonders hilfreich sind die kurzen Trainingspläne für jeden Tag. Das Buch kostet 14,90 Euro und ist im Buchhandel und online erhältlich."
      },
      {
        id: 2,
        content: "LONDON. In einem Luxus-Restaurant wurde gestern der angeblich teuerste Hamburger der Welt verkauft. Der Burger kostete 1.500 Pfund, also fast 1.800 Euro. Er wurde aus sehr hochwertigem Rindfleisch, Trüffel, Kaviar und einem speziellen Gold-Brötchen gemacht. Nur zehn Gäste durften den Hamburger probieren. Das Restaurant spendete einen Teil des Geldes für ein Kinderkrankenhaus. Viele Menschen diskutierten in den sozialen Medien über den Preis."
      },
      {
        id: 3,
        content: "Eine Studie der Universität Köln zeigt, dass es einen Zusammenhang zwischen Körpergröße und Gehalt gibt. In der Umfrage wurden 2.000 Angestellte aus verschiedenen Branchen befragt. Männer über 1,85 Meter verdienen im Durchschnitt 8 Prozent mehr als kleinere Männer. Bei Frauen ist der Unterschied etwas geringer, etwa 5 Prozent. Die Forscher sagen, dass große Personen oft selbstsicherer wirken und deshalb schneller befördert werden."
      },
      {
        id: 4,
        content: "Laut einer Umfrage des Instituts ArbeitPlus sind viele Deutsche gestresst, aber trotzdem relativ zufrieden mit ihrer Arbeit. Es wurden 1.500 Beschäftigte in Büros, Fabriken und im Einzelhandel befragt. 62 Prozent fühlen sich mehrmals pro Woche gestresst, vor allem durch Zeitdruck. Gleichzeitig sagten 70 Prozent, dass sie ihren Job insgesamt mögen. Wer flexible Arbeitszeiten hat, berichtet deutlich weniger Stress und eine höhere Arbeitszufriedenheit."
      },
      {
        id: 5,
        content: "BERLIN. After-Work-Partys sind in deutschen Großstädten immer beliebter geworden. In vielen Bars treffen sich Angestellte donnerstags oder freitags direkt nach der Arbeit. Die Veranstaltungen beginnen oft schon um 18 Uhr und dauern bis etwa 22 Uhr. Firmen nutzen die Partys, um das Teamgefühl zu stärken. Laut den Veranstaltern kommen besonders junge Berufstätige, die neue Leute kennenlernen und trotzdem nicht zu spät nach Hause gehen wollen."
      }
    ],
    answers: { 1: "g", 2: "d", 3: "a", 4: "c", 5: "i" }
  },
  {
    id: "berliner",
    title: "Berliner",
    emoji: "🍩",
    hasImage: true,
    imagePath: "assets/berliner.png",
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5. Finden Sie für jeden Text die passende Überschrift. Sie können jede Überschrift nur einmal benutzen. Markieren Sie Ihre Lösungen für die Aufgaben 1–5 auf dem Antwortbogen.",
    headings: {
      a: "Mehr Sport verbessert die Konzentration im Büro",
      b: "Neue App hilft beim Sprachenlernen im Alltag",
      c: "Hohe Preise für Bio-Lebensmittel in der Kritik",
      d: "Gemeinsames Kochen bringt Nachbarn zusammen",
      e: "Haustiere im Büro reduzieren Stress am Arbeitsplatz",
      f: "Kunden diskutieren über teuren Kaffee in Großstädten",
      g: "Fahrradfahren im Winter: Tipps für die Sicherheit",
      h: "Studie zeigt: Hunde am Arbeitsplatz machen glücklich",
      i: "Immer mehr Menschen kaufen Kleidung aus zweiter Hand",
      j: "Kochkurse für Singles werden immer beliebter"
    },
    texts: [
      {
        id: 1,
        content: "Der new Ratgeber „Sicher durch den Winter“ vom Fahrrad-Verband ist ein nützliches Heft für alle Radfahrer. Der Autor, Thomas Schmidt, erklärt mit einfachen Regeln, wie man auch bei Schnee und Eis sicher ans Ziel kommt. Viele Grafiken zeigen die richtige Kleidung und die besten Reifen für die kalte Jahreszeit. Das Heft ist kostenlos in vielen Fahrradgeschäften zu haben."
      },
      {
        id: 2,
        content: "MÜNCHEN. In einem modernen Café in der Innenstadt kostet ein einfacher Cappuccino seit gestern 8,50 Euro. Der Besitzer erklärt, dass er nur exklusive Kaffeebohnen aus fairem Handel und biologische Milch verwendet. Viele Kunden finden das übertrieben und beschweren sich im Internet über die extremen Preise, während andere die Qualität loben."
      },
      {
        id: 3,
        content: "Eine Untersuchung der Universität Hamburg zeigt, dass Tiere einen positiven Einfluss auf das Arbeitsklima haben können. Für die Studie wurden 1.200 Mitarbeiter in verschiedenen Unternehmen befragt. In Firmen, in denen Hunde erlaubt sind, fühlen sich die Angestellten deutlich wohlwer und haben weniger Angst vor Stress. Die Forscher sagen, dass die Präsenz von Tieren die Herzfrequenz senkt und für bessere Laune sorgt."
      },
      {
        id: 4,
        content: "Laut einer aktuellen Umfrage des Instituts „GrünLeben“ kaufen immer mehr Deutsche ihre Kleidung nicht mehr neu, sondern gebraucht. Es wurden 2.000 Personen in Großstädten befragt. Fast 45 Prozent der Befragten gaben an, regelmäßig in Second-Hand-Läden oder auf Online-Plattformen nach Kleidung zu suchen. Der Hauptgrund ist für die meisten der Umweltschutz, aber auch das Sparen von Geld spielt eine große Rolle."
      },
      {
        id: 5,
        content: "KÖLN. Ein neues Projekt im Stadtteil Ehrenfeld bringt Menschen durch Essen näher zusammen. Jeden Mittwochabend treffen sich Anwohner in einer großen Gemeinschaftsküche, um zusammen zu kochen und zu essen. Die Idee kommt von einem lokalen Verein, der die Einsamkeit in der Stadt bekämpfen möchte. Laut den Organisatoren kommen jede Woche über 30 Personen aus verschiedenen Kulturen und Altersgruppen."
      }
    ],
    answers: { 1: "g", 2: "f", 3: "h", 4: "i", 5: "d" }
  },
  {
    id: "bienenstich",
    title: "Bienenstich",
    emoji: "🍰",
    hasImage: false,
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5. Finden Sie für jeden Text die passende Überschrift. Sie können jede Überschrift nur einmal benutzen. Markieren Sie Ihre Lösungen für die Aufgaben 1–5 auf dem Antwortbogen.",
    headings: {
      a: "Arbeitnehmer fordern mehr Urlaub im Sommer",
      b: "Immer mehr Menschen nutzen das Fahrrad für den Arbeitsweg",
      c: "Neue Studie: Schokolade macht glücklich und gesund",
      d: "Großes Interesse an Kursen für gesunde Ernährung",
      e: "Langes Sitzen im Büro gefährdet die Gesundheit",
      f: "Traditionelle Buchhandlungen melden steigende Umsätze",
      g: "Musik beim Lernen verbessert die Noten von Schülern",
      h: "Zahl der Autokäufe in Großstädten geht stark zurück",
      i: "Digitale Bücher werden bei Jugendlichen immer beliebter",
      j: "Experten raten zu Pausen und Bewegung am Arbeitsplatz"
    },
    texts: [
      {
        id: 1,
        content: "Der neue Gesundheitsreport der Krankenkasse „ProVita“ warnt vor den Gefahren des modernen Büroalltags. Da die meisten Angestellten mehr als sieben Stunden pro Tag am Schreibtisch verbringen, steigen die Zahlen von Rückenschmerzen und Kreislaufproblemen. Der Report betont, dass der menschliche Körper nicht für dauerhafte Inaktivität gemacht ist."
      },
      {
        id: 2,
        content: "FRANKFURT. Eine Umfrage unter 3.000 Bürgern in deutschen Großstädten zeigt einen neuen Trend in der Mobilität: Fast 40 Prozent der Befragten geben an, dass sie ihren täglichen Weg zur Arbeit oder zur Universität mittlerweile mit dem Rad zurücklegen. Die Hauptgründe dafür sind das schlechte Wetter im Winter, das vermieden wird, und der Wunsch, fit zu bleiben. Viele Städte bauen deshalb die Radwege aus."
      },
      {
        id: 3,
        content: "Laut einer Studie des Instituts für Ernährungsforschung interessieren sich immer mehr Deutsche dafür, was auf ihren Teller kommt. Besonders Kochkurse, die sich auf vegetarische und frische Zutaten konzentrieren, sind komplett ausgebucht. Die Teilnehmer wollen lernen, wie man im stressigen Alltag schnell und ohne Fertigprodukte kochen kann, um das Immunsystem zu stärken."
      },
      {
        id: 4,
        content: "Eine Untersuchung an der Universität Leipzig hat gezeigt, wie wichtig regelmäßige Erholungsphasen während der Arbeitszeit هستند. Mitarbeiter, die alle 90 Minuten eine kurze Pause einlegen und sich dehnen oder ein paar Schritte gehen, sind am Nachmittag deutlich konzentrierter und produktiver. Die Wissenschaftler empfehlen Arbeitgebern, aktive Minipausen offiziell zu erlauben."
      },
      {
        id: 5,
        content: "STUTTGART. Entgegen allen Prognosen erleben klassische Buchläden in den Innenstädten gerade ein echtes Comeback. Eine Marktanalyse zeigt, dass die Verkaufszahlen von gedruckten Büchern im Vergleich zum Vorjahr um 7 Prozent gestiegen sind. Besonders junge Leser schätzen wieder das Gefühl, ein echtes Buch in den Händen zu halten ve in den Geschäften persönlich beraten zu werden."
      }
    ],
    answers: { 1: "e", 2: "b", 3: "d", 4: "j", 5: "f" }
  },
  {
    id: "brandenburger_tor",
    title: "Brandenburger Tor",
    emoji: "🏛️",
    hasImage: false,
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5. Finden Sie für jeden Text die passende Überschrift. Sie können jede Überschrift nur einmal benutzen. Markieren Sie Ihre Lösungen für die Aufgaben 1–5 auf dem Antwortbogen.",
    headings: {
      a: "Kino-Tickets werden für Familien immer teurer",
      b: "Ältere Menschen nutzen kaum noch moderne Smartphones",
      c: "Reisen mit dem Zug schont die Umwelt und spart Geld",
      d: "Neues Gesetz: Höhere Strafen für Müll in der Natur",
      e: "Immer mehr Senioren entdecken soziale Medien für sich",
      f: "Flugreisen sind trotz Klimadebatte weiterhin sehr beliebt",
      g: "Online-Shopping führt zu weniger Verkehr in den Städten",
      h: "Studie zeigt: Jugendliche lesen wieder mehr gedruckte Zeitungen",
      i: "Interesse an Urlaub im eigenen Land wächst stark",
      j: "Plastikmüll im Meer: Neue Technologie soll helfen"
    },
    texts: [
      {
        id: 1,
        content: "Der neue Reise-Report des Tourismus-Verbands zeigt, dass sich das Urlaubsverhalten der Deutschen verändert hat. Statt langer Flüge in die Karibik veya Asien planen fast 50 Prozent der Befragten ihren Sommerurlaub an der Nordsee, der Ostsee oder in den Alpen. Die Motive sind vor allem der Klimaschutz und der Wunsch, lange Wartezeiten an den Flughäfen zu vermeiden."
      },
      {
        id: 2,
        content: "MÜNCHEN. Eine Studie der Universität Augsburg hat das digitale Verhalten der Generation 65+ untersucht. Das Ergebnis überrascht: Über 60 Prozent der älteren Menschen nutzen mittlerweile täglich Plattformen wie WhatsApp oder Facebook, um mit ihren Enkeln in Kontakt zu bleiben oder alte Freunde wiederzufinden. Die Forscher betonen, dass die Bedienung von Smartphones für diese Gruppe kein Problem mehr darstellt."
      },
      {
        id: 3,
        content: "Laut einer Pressemitteilung des Umweltministeriums wird das Wegwerfen von Abfall in Parks und Wäldern ab nächstem Monat deutlich teurer. Wer Plastikflaschen, Grillreste oder Zigaretten in der Natur liegen lässt, muss mit einem Bußgeld von bis zu 250 Euro rechnen. Bisher kostete dieses Fehlverhalten nur 50 Euro. Die Regierung hofft, so die Sauberkeit in den Erholungsgebieten zu verbessern."
      },
      {
        id: 4,
        content: "Eine Umfrage unter 1.500 Jugendlichen zwischen 14 und 18 Jahren zeigt, dass traditionelle Tageszeitungen aus Papier kaum noch eine Rolle im Alltag der neuen Generation spielen. Fast 90 Prozent der Befragten gaben an, dass sie sich ausschließlich über kurze Videos auf TikTok veya Instagram über das aktuelle Weltgeschehen informieren. Lange Informationstexte werden meistens ignoriert."
      },
      {
        id: 5,
        content: "KÖLN. Trotz der Diskussionen über CO2-Emissionen und den Klimawandel verzeichnen die deutschen Flughäfen in diesem Jahr einen neuen Passagierrekord. Besonders die Buchungen für Kurzstreckenflüge innerhalb Europas sind im Vergleich zum Vorjahr um 12 Prozent gestiegen. Viele Reisende geben an, dass die Bahn oft keine echte Alternative ist, weil sie unpünktlich veya zu teuer ist."
      }
    ],
    answers: { 1: "i", 2: "e", 3: "d", 4: "h", 5: "f" }
  },
  {
    id: "bratwurst",
    title: "Bratwurst",
    emoji: "🌭",
    hasImage: false,
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5. Finden Sie für jeden Text die passende Überschrift. Sie können jede Überschrift nur einmal benutzen. Markieren Sie Ihre Lösungen für die Aufgaben 1–5 auf dem Antwortbogen.",
    headings: {
      a: "Immer mehr Menschen nutzen Carsharing in Großstädten",
      b: "Neue Studie: Kaffee ist gesünder als bisher gedacht",
      c: "Steigende Kosten für Strom und Gas belasten Familien",
      d: "Traditionelle Handwerksberufe finden keine Azubis mehr",
      e: "Online-Kurse für Fitness boomen während der Urlaubszeit",
      f: "Verbraucher sparen Geld durch den Kauf von gebrauchten Möbeln",
      g: "Interesse an vegetarischer Ernährung bei Jugendlichen sinkt",
      h: "Ältere Menschen meiden zunehmend das Einkaufen im Internet",
      i: "Große Mehrheit der Deutschen kauft Möbel lieber im Geschäft",
      j: "Neue Technologie reduziert den Energieverbrauch in Haushalten"
    },
    texts: [
      {
        id: 1,
        content: "Eine aktuelle Marktstudie im Auftrag des Handelsverbandes zeigt, dass der Online-Möbelhandel in Deutschland stagniert. Fast 75 Prozent der Verbraucher geben an, dass sie Sofas, Tische oder Betten vor dem Kauf unbedingt sehen, anfassen und ausprobieren wollen. Der Besuch im klassischen Möbelhaus gehört für die meisten Familien am Wochenende nach wie vor dazu."
      },
      {
        id: 2,
        content: "Laut einem Bericht der Bundesnetzagentur müssen sich Verbraucher in den kommenden Monaten auf deutlich höhere Preise für die Energieversorgung einstellen. Besonders Familien mit niedrigerem Einkommen sind von den steigenden monatlichen Abschlagszahlungen für Heizung und Elektrizität betroffen. Viele Beratungsstellen bieten nun kostenlose Hilfe zum Energiesparen an."
      },
      {
        id: 3,
        content: "Eine Untersuchung der Universität Mainz hat das Kaufverhalten von Senioren im Internet analysiert. Entgegen dem allgemeinen Trend zeigt sich, dass Menschen über 70 Jahre immer seltener in Online-Shops bestellen. Als Hauptgründe wurden komplizierte Bezahlverfahren, Angst vor Datenklau und der fehlende persönliche Kontakt im Servicefall genannt."
      },
      {
        id: 4,
        content: "Die Handwerkskammer Berlin warnt vor einem akuten Fachkräftemangel in der Branche. Obwohl viele Betriebe modernste Arbeitsplätze und gute Gehälter bieten, bleibt die Zahl der Bewerber für eine Ausbildung zum Tischler, Bäcker oder Installateur seit Jahren auf einem historischen Tiefstand. Viele Meisterbetriebe müssen deshalb Aufträge von Kunden ablehnen."
      },
      {
        id: 5,
        content: "Ein neues Start-up aus München hat ein intelligentes System für das Fehlermanagement in Heizungsanlagen entwickelt. Die kleine Box wird einfach an die Heizung angeschlossen und optimiert den Gas- und Stromverbrauch vollautomatisch per App. Erste Tests in über 500 Haushalten haben gezeigt, dass Familien dadurch bis zu 15 Prozent ihrer jährlichen Heizkosten einsparen können."
      }
    ],
    answers: { 1: "i", 2: "c", 3: "h", 4: "d", 5: "j" }
  },
  {
    id: "brezel",
    title: "Brezel",
    emoji: "🥨",
    hasImage: false,
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5 über die bayerische Brezel. Finden Sie die passende Überschrift.",
    headings: {
      a: "Laugengebäck: Die Entdeckung durch ein Missgeschick",
      b: "Die Brezel als Zunftzeichen der Bäcker",
      c: "Die bayerische Brezelzeit zum Weißwurst-Frühstück",
      d: "Trockene Brezeln wieder frisch machen",
      e: "Die größte Brezel der Welt kommt aus den USA",
      f: "Warum Brezeln ihre charakteristische Form haben",
      g: "Salzkörner: Gesundes Gebäck ohne Natrium",
      h: "Oktoberfest: Riesenbrezeln als Verkaufsschlager",
      i: "Süße Neujahrsbrezeln aus Hefeteig",
      j: "Die richtige Aufbewahrung in der Brotdose"
    },
    texts: [
      {
        id: 1,
        content: "Einer Legende nach erfand ein Bäcker die Laugenbrezel, als er versehentlich Natronlauge statt Zuckerwasser auf die Teiglinge strich. Die dunkle, glänzende Kruste nach dem Backen gefiel ihm so gut, dass er das Rezept behielt."
      },
      {
        id: 2,
        content: "Seit dem Mittelalter symbolisiert die geschlungene Form des Gebäcks das Bäckerhandwerk. Noch heute hängt an fast jeder traditionellen Bäckerei eine goldene Brezel als stolzes Zunftzeichen über der Eingangstür."
      },
      {
        id: 3,
        content: "In Bayern isst man die frisch gebackene Brezel am liebsten vormittags. Sie ist der unverzichtbare Begleiter zu warmen Weißwürsten, süßem Senf und einem kühlen Weizenbier beim traditionellen Brotzeit-Frühstück."
      },
      {
        id: 4,
        content: "Die typische Form mit den drei Löchern soll angeblich betenden Händen nachempfunden sein. Die Verschlingung in der Mitte verbindet die beiden Enden des Teigstrangs und sorgt für ein stabiles Gebäck."
      },
      {
        id: 5,
        content: "Auf dem weltberühmten Oktoberfest in München verkaufen Händler riesige Varianten, die fast so groß wie ein teller sind. Sie eignen sich perfekt zum Teilen in geselliger Runde im Festzelt."
      }
    ],
    answers: { 1: "a", 2: "b", 3: "c", 4: "f", 5: "h" }
  },
  {
    id: "currywurst",
    title: "Currywurst",
    emoji: "🍢",
    hasImage: false,
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5 über Currywurst. Finden Sie die passende Überschrift.",
    headings: {
      a: "Herta Heuwer: Die Erfinderin der Currywurst in Berlin",
      b: "Der Streit um das beste Rezept zwischen Berlin und Ruhrpott",
      c: "Currywurst in der VW-Kantine: Ein Millionen-Klassiker",
      d: "Wie gesund ist Currypulver wirklich?",
      e: "Das Currywurst-Museum schließt seine Pforten",
      f: "Scharfe Currysoßen: Rekorde beim Schärfegrad",
      g: "Currywurst als schnelles Fast-Food für Prominente",
      h: "Die richtige Beilage: Pommes rot-weiß",
      i: "Wie Currywurst im Ausland zubereitet wird",
      j: "Die Wurst als beliebtes Thema in Romanen und Filmen"
    },
    texts: [
      {
        id: 1,
        content: "Im September 1949 mischte Herta Heuwer in ihrem Berliner Imbissstand Tomatenmark, Currypulver und weitere Gewürze und goss die Soße über eine gebratene Wurst. Sie ließ die Rezeptur später sogar patentieren."
      },
      {
        id: 2,
        content: "Die Volkswagen-Kantine stellt eine eigene Currywurst nach geheimem Rezept her. Jedes Jahr produziert das Autowerk mehr Würste für seine Mitarbeiter als Fahrzeuge, was das Gericht zu einem echten Kult-Klassiker macht."
      },
      {
        id: 3,
        content: "Es gibt einen freundschaftlichen Wettstreit darüber, wo die Wurst am besten schmeckt. Während die Berliner Version oft ohne Darm serviert wird, schwören die Menschen im Ruhrgebiet auf ihre herzhafte Bratwurst-Variante."
      },
      {
        id: 4,
        content: "Manche Fast-Food-Fans lieben extreme Herausforderungen. Einige Imbissbuden bieten Soßen mit extrem scharfen Chilisorten an, die nur mit Schutzkleidung zubereitet werden und Tränen in die Augen treiben."
      },
      {
        id: 5,
        content: "Der Schriftsteller Uwe Timm setzte dem Imbissklassiker in seiner Novelle 'Die Entdeckung der Currywurst' ein literarisches Denkmal. Das Buch beschreibt die fiktive Entstehung der Spezialität in Hamburg."
      }
    ],
    answers: { 1: "a", 2: "c", 3: "b", 4: "f", 5: "j" }
  },
  {
    id: "donauwelle",
    title: "Donauwelle",
    emoji: "🍫",
    hasImage: false,
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5 über den Donauwelle-Kuchen. Finden Sie die passende Überschrift.",
    headings: {
      a: "Die Wellenform durch versinkende Kirschen",
      b: "Die Geschichte des Flusses Donau und des Kuchens",
      c: "Die Kombination aus hellem und dunklem Rührteig",
      d: "Schokoladenguss mit dem typischen Gabelmuster",
      e: "Bessere Verträglichkeit durch milchfreie Buttercreme",
      f: "Ein beliebtes Rezept für Kindergeburtstage",
      g: "Lagerung und Kühlung von Schokoladenkuchen",
      h: "Warum der Kuchen auch 'Schneewittchenkuchen' heißt",
      i: "Klassische Fehler bei der Teigzubereitung vermeiden",
      j: "Bäckereien bieten Donauwelle als To-Go-Snack an"
    },
    texts: [
      {
        id: 1,
        content: "Um das wellenartige Muster im Kuchen zu erzeugen, drückt man frische oder eingelegte Sauerkirschen in den zweifarbigen Teig. Beim Backen sinken die Kirschen ab und hinterlassen eine dekorative Wellenlinie."
      },
      {
        id: 2,
        content: "Der Kuchen besteht aus einer Schicht hellem Rührteig und einer Schicht dunklem Rührteig, der mit Kakaopulver verfeinert wird. Die beiden Teige werden vor dem Backen vorsichtig auf dem Blech übereinander geschichtet."
      },
      {
        id: 3,
        content: "Der krönende Abschluss des Kuchens ist eine Schicht aus geschmolzener Zartbitterschokolade. Mit einer Kuchengabel zieht man traditionell ein wellenförmiges Muster in die noch weiche Glasur."
      },
      {
        id: 4,
        content: "Wegen der drei Farben Rot (Kirschen), Weiß (Buttercreme) und Schwarz (Kakaoteig) erinnert der Blechkuchen stark an das Märchen der Gebrüder Grimm. Daher wird das Gebäck regional auch Schneewittchenkuchen genannt."
      },
      {
        id: 5,
        content: "Der süße, saftige Blechkuchen ist auf deutschen Geburtstagsfeiern sehr beliebt. Kinder lieben die süße Pudding-Buttercreme und die Schokolade, während Eltern die einfache Zubereitung auf dem Backblech schätzen."
      }
    ],
    answers: { 1: "a", 2: "c", 3: "d", 4: "h", 5: "f" }
  },
  {
    id: "elbphilharmonie",
    title: "Elbphilharmonie",
    emoji: "🏢",
    hasImage: false,
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5 über die Elbphilharmonie in Hamburg. Finden Sie die passende Überschrift.",
    headings: {
      a: "Die Plaza als öffentliche Aussichtsplattform für alle",
      b: "Die gläserne Fassade im Stil von Wellen und Segeln",
      c: "Die extreme Kostenexplosion während der Bauphase",
      d: "Akustik der Extraklasse im Großen Konzertsaal",
      e: "Die Geschichte des alten Kaispeichers als Fundament",
      f: "Anreise mit der Hamburger Hafenfähre",
      g: "Konzerte von Klassik bis Popmusik im Hamburger Hafen",
      h: "Luxuswohnungen und ein Hotel im oberen Bereich",
      i: "Das Wahrzeichen der HafenCity Hamburg",
      j: "Die spektakuläre gebogene Rolltreppe zum Eingang"
    },
    texts: [
      {
        id: 1,
        content: "In 37 Metern Höhe befindet sich die frei zugängliche Aussichtsplattform des Konzerthauses. Besucher können dort einmal um das gesamte Gebäude herumgehen und einen fantastischen Blick über den Hamburger Hafen genießen."
      },
      {
        id: 2,
        content: "Der obere, gläserne Neubau des Schweizer Architekturbüros erinnert an Wellen, Segel oder Eiskristalle. Die Fassade besteht aus über 1.000 gebogenen und bedruckten Glasscheiben, die das Sonnenlicht reflektieren."
      },
      {
        id: 3,
        content: "Das spektakuläre Projekt war jahrelang in den Schlagzeilen, da sich die Baukosten von ursprünglich geplanten 77 Millionen Euro auf schließlich fast 866 Millionen Euro vervielfachten und der Bau sich stark verzögerte."
      },
      {
        id: 4,
        content: "Für den perfekten Klang im großen Saal entwickelte ein japanischer Akustiker die 'Weiße Haut'. Die Wände sind mit 10.000 Gipsfaserplatten verkleidet, die den Schall gezielt streuen und reflektieren."
      },
      {
        id: 5,
        content: "Die Elbphilharmonie wurde auf einem historischen Backsteingebäude errichtet, dem ehemaligen Kaispeicher A aus dem Jahr 1963. Dieses diente früher als Lagerhaus für Kakao, Tee und Tabak im Hamburger Hafen."
      }
    ],
    answers: { 1: "a", 2: "b", 3: "c", 4: "d", 5: "e" }
  },
  {
    id: "fernsehturm",
    title: "Fernsehturm",
    emoji: "🗼",
    hasImage: false,
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5 über den Berliner Fernsehturm. Finden Sie die passende Überschrift.",
    headings: {
      a: "Das rotierende Restaurant in der Turmkugel",
      b: "Der Bau des Turms als sozialistisches Symbol der DDR",
      c: "Die Aussichtsplattform als Touristenattraktion",
      d: "Das Phänomen der 'Rache des Papstes'",
      e: "Sicherheitskontrollen und Ticketbuchung online",
      f: "Die Höhe des Turms und technische Daten",
      g: "Der Fernsehturm auf Berliner Souvenirs",
      h: "Spektakuläre Fallschirmsprünge vom Turmdach",
      i: "Der Sendebetrieb für Radio und Fernsehen",
      j: "Die Erreichbarkeit mit öffentlichen Verkehrsmitteln"
    },
    texts: [
      {
        id: 1,
        content: "Ein besonderes Highlight für Besucher ist das Panorama-Restaurant 'Sphere'. Es befindet sich über der Aussichtsetage und dreht sich innerhalb von 30 Minuten einmal komplett um die eigene Achse."
      },
      {
        id: 2,
        content: "Der Turm wurde in den 1960er Jahren von der DDR-Führung als Zeichen der technologischen Leistungsfähigkeit errichtet. Heute ist der Turm am Alexanderplatz das bekannteste Wahrzeichen des wiedervereinigten Berlins."
      },
      {
        id: 3,
        content: "Bei klarem Wetter können Besucher von der Aussichtsetage in 203 Metern Höhe bis zu 80 Kilometer weit sehen. Jährlich besuchen über eine Million Menschen die Plattform, um Berlin von oben zu betrachten."
      },
      {
        id: 4,
        content: "Wenn die Sonne auf die Kugel aus Edelstahl scheint, bildet sich eine Lichtreflexion in Form eines Kreuzes. Die Berliner nannten dieses Phänomen im atheistischen DDR-Staat scherzhaft 'Die Rache des Papstes'."
      },
      {
        id: 5,
        content: "Mit einer Gesamthöhe von 368 Metern ist der Berliner Fernsehturm das höchste Bauwerk in Deutschland und das dritthöchste freistehende Bauwerk in der Europäischen Union."
      }
    ],
    answers: { 1: "a", 2: "b", 3: "c", 4: "d", 5: "f" }
  },
  {
    id: "franzbroetchen",
    title: "Franzbrötchen",
    emoji: "🥐",
    hasImage: false,
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5 über das Hamburger Franzbrötchen. Finden Sie die passende Überschrift.",
    headings: {
      a: "Die Legende der französischen Besatzung in Hamburg",
      b: "Zimt und Zucker: Die unverzichtbare Füllung",
      c: "Die typische Plunderteig-Herstellung durch Tourieren",
      d: "Kreative Varianten mit Schokolade, Streuseln oder Kürbis",
      e: "Das Franzbrötchen erobert andere deutsche Städte",
      f: "Franzbrötchen selber machen: Tipps fürs Backen",
      g: "Wie man Franzbrötchen am besten warm genießt",
      h: "Kaloriengehalt des süßen Frühstücksgebäcks",
      i: "Der Unterschied zum klassischen französischen Croissant",
      j: "Hamburger Bäckereien feiern das Franzbrötchen-Festival"
    },
    texts: [
      {
        id: 1,
        content: "Das Gebäck entstand vermutlich während der französischen Besatzungszeit Hamburgs im frühen 19. Jahrhundert. Hamburger Bäcker versuchten damals, das beliebte französische Croissant (auch 'Franzbrot' genannt) nachzubacken."
      },
      {
        id: 2,
        content: "Die Füllung besteht traditionell aus einer Mischung aus weicher Butter, Zucker und reichlich gemahlenem Zimt. Diese Zutaten karamellisieren beim Backen und verleihen dem Gebäck seinen unverwechselbaren süßen Duft."
      },
      {
        id: 3,
        content: "Um den typisch blättrigen Teig zu erhalten, wird kalte Butter mehrfach in den Hefeteig gefaltet und ausgerollt. Dieser Vorgang wird in der Fachsprache der Bäcker als 'Tourieren' bezeichnet."
      },
      {
        id: 4,
        content: "Neben der klassischen Variante bieten moderne Bäckereien immer öfter abgewandelte Varianten an. Sehr beliebt sind Franzbrötchen, die zusätzlich mit Schokoladenstücken, Marzipan oder knusprigen Streuseln verfeinert werden."
      },
      {
        id: 5,
        content: "Obwohl das Gebäck lange Zeit nur im Norden Deutschlands bekannt war, findet man es mittlerweile auch in Bäckereien in Berlin, München oder Frankfurt, wo es sich zu einem echten Trendgebäck entwickelt."
      }
    ],
    answers: { 1: "a", 2: "b", 3: "c", 4: "d", 5: "e" }
  },
  {
    id: "koelner_dom",
    title: "Kölner Dom",
    emoji: "⛪",
    hasImage: false,
    instruction: "Lesen Sie die Überschriften a–j und die Texte 1–5 über den Kölner Dom. Finden Sie die passende Überschrift.",
    headings: {
      a: "Die Reliquien der Heiligen Drei Könige im goldenen Schrein",
      b: "Die jahrhundertelange Bauunterbrechung im Mittelalter",
      c: "Der Dom als Meisterwerk der gotischen Architektur",
      d: "Die Zerstörungen und der Wiederaufbau nach dem Weltkrieg",
      e: "Der Turmaufstieg als sportliche Herausforderung",
      f: "Die Ernennung zum UNESCO-Weltkulturerbe",
      g: "Eintrittspreise und Richtlinien für Gottesdienste",
      h: "Die berühmte Petersglocke, genannt 'Dicker Pitter'",
      i: "Der Kölner Dom als meistbesuchte Sehenswürdigkeit Deutschlands",
      j: "Die bunten Fenster des Künstlers Gerhard Richter"
    },
    texts: [
      {
        id: 1,
        content: "Im Jahr 1164 brachte der Erzbischof von Köln die Gebeine der Weisen aus dem Morgenland nach Köln. Für diese wertvollen Reliquien wurde ein prachtvoller goldener Schrein angefertigt, der noch heute hinter dem Hochaltar steht."
      },
      {
        id: 2,
        content: "Nach der Grundsteinlegung im Jahr 1248 wurde fast 300 Jahre lang am Dom gebaut. Im Jahr 1560 wurden die Arbeiten jedoch aus Geldmangel komplett eingestellt. Erst im 19. Jahrhundert wurde die Kathedrale schließlich vollendet."
      },
      {
        id: 3,
        content: "Der Dom gilt mit seinen zwei riesigen Türmen und den filigranen Strebebögen als ein Paradebeispiel der Gotik. Die Baupläne orientierten sich stark an den großen französischen Kathedralen von Amiens und Reims."
      },
      {
        id: 4,
        content: "Während des Zweiten Weltkriegs wurde das Bauwerk von rund 14 schweren Fliegerbomben getroffen, stürzte aber im Gegensatz zur restlichen Kölner Innenstadt nicht ein. Die Reparaturarbeiten dauerten bis in die 1950er Jahre."
      },
      {
        id: 5,
        content: "Wer den Südturm besteigen möchte, muss 533 Stufen zu Fuß ohne Aufzug bewältigen. Die Belohnung nach dem anstrengenden Aufstieg ist eine beeindruckende Aussicht über Köln und den Rhein aus 97 Metern Höhe."
      }
    ],
    answers: { 1: "a", 2: "b", 3: "c", 4: "d", 5: "e" }
  }
];
