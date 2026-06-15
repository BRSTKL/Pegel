// B1 German App - Sprachbausteine Data
const SPRACHBAUSTEINE_DATA = [
  {
    id: "sprachbausteine_1",
    title: "Gesundheit & Ernährung",
    emoji: "🍎",
    instruction: "Markieren Sie Ihre Lösungen für die Aufgaben 21–30 auf dem Antwortbogen.",
    text: "Liebe Mia,\n\nich brauche dringend (21) Rat zur Ernährung, weil du dich so gut mit gesundem Essen auskennst. In den (22) Monaten habe ich oft erst (23) spät gefrühstückt, und manchmal spare ich mir das Frühstück ganz. Dann esse ich mittags schnell etwas beim Bäcker, meistens (24) großes Sandwich mit viel Käse. Abends bin ich (25) der Arbeit so müde, dass ich mir oft nur eine Pizza in den Ofen schiebe oder mir Nudeln mit fertiger Soße koche.\n\nIch kann mir vorstellen, (26) du jetzt den Kopf schüttelst. Trotzdem fällt es mir schwer, meine Gewohnheiten zu ändern. Wenn du Zeit (27), würdest du mir vielleicht einen einfachen Plan (28) eine Woche schreiben? Es wäre toll, wenn ich wüsste, was ich im Büro mitnehmen kann. Außerdem frage ich (29), ob ich mich beim Einkaufen mehr auf (30) Gemüse konzentrieren sollte. Kannst du mir erklären, wie du das mit den Mahlzeiten am Abend machst, damit du dich nicht ständig beeilen musst?\n\nMach's gut!\nDein Tim",
    options: {
      21: { a: "deinen", b: "dein", c: "deinem" },
      22: { a: "letzter", b: "letzten", c: "letzte" },
      23: { a: "so", b: "viel", c: "sehr" },
      24: { a: "ein", b: "einen", c: "eine" },
      25: { a: "für", b: "von", c: "nach" },
      26: { a: "wenn", b: "weil", c: "dass" },
      27: { a: "würdest", b: "hättest", c: "wärst" },
      28: { a: "über", b: "für", c: "mit" },
      29: { a: "dich", b: "mich", c: "mir" },
      30: { a: "frische", b: "frischem", c: "frisches" }
    },
    answers: {
      21: "a",
      22: "b",
      23: "c",
      24: "a",
      25: "b",
      26: "c",
      27: "b",
      28: "b",
      29: "b",
      30: "c"
    },
    explanations: {
      21: "\"Rat\" (der Rat) eril tekildir. \"Brauchen\" fiili belirtili nesne (Akkusativ) gerektirir. Eril akkusativ sıfat çekimi \"deinen\" olur.",
      22: "\"in den Monaten\" ifadesi çoğul Dativ durumundadır. Çoğul Dativ sıfat takısı \"-en\" (letzten) alır.",
      23: "\"spät\" (geç) derecelendirme zarfı olarak \"sehr\" (çok) alır: \"sehr spät\" (çok geç).",
      24: "\"Sandwich\" (das Sandwich) nötr tekildir. Burada belirsiz tanım edatı (Akkusativ) olarak \"ein\" kullanılır.",
      25: "\"müde\" sıfatı \"von\" (Dativ) edatı ile kullanılır: \"müde von der Arbeit\" (işten yorgun).",
      26: "Cümle yapısında nesne yan cümlesi (dass-Satz) kullanılmaktadır: \"...tahmin edebiliyorum ki (dass)...\"",
      27: "Konjunktiv II (istek/şart) yapısı: \"Wenn du Zeit hättest...\" (Zamanın olsaydı...).",
      28: "\"Plan\" (der Plan) kelimesi bir süreliğine derken \"für\" (Akkusativ) edatı alır: \"Plan für eine Woche\" (bir haftalık plan).",
      29: "\"sich fragen\" dönüşlü fiili akkusativ refleksif zamir gerektirir. \"ich\" için akkusativ refleksif \"mich\" olur.",
      30: "\"Gemüse\" (das Gemüse) nötr tekildir. Edatsız (nullartikel) akkusativ nötr sıfat çekimi güçlü olup \"-es\" (frisches) takısı alır."
    }
  }
];

// Populate placeholder exercises 2-12
for (let i = 2; i <= 12; i++) {
  SPRACHBAUSTEINE_DATA.push({
    id: `sprachbausteine_${i}`,
    title: `Sprachbausteine ${i}`,
    emoji: "📝",
    isPlaceholder: true,
    instruction: "Bu alıştırmanın metni yakında eklenecektir.",
    text: "Liebe/r ..., \n\nDies ist ein Platzhalter für Sprachbausteine alıştırması. Metin ve seçenekler yakında eklenecektir.\n\nViele Grüße\n...",
    options: {
      21: { a: "A", b: "B", c: "C" },
      22: { a: "A", b: "B", c: "C" },
      23: { a: "A", b: "B", c: "C" },
      24: { a: "A", b: "B", c: "C" },
      25: { a: "A", b: "B", c: "C" },
      26: { a: "A", b: "B", c: "C" },
      27: { a: "A", b: "B", c: "C" },
      28: { a: "A", b: "B", c: "C" },
      29: { a: "A", b: "B", c: "C" },
      30: { a: "A", b: "B", c: "C" }
    },
    answers: {
      21: "a", 22: "a", 23: "a", 24: "a", 25: "a", 26: "a", 27: "a", 28: "a", 29: "a", 30: "a"
    },
    explanations: {}
  });
}
