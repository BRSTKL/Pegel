// app.js - B1 German App Core Logic (Minimalist Redesign + Prepositions Dashboard)

// State management
let state = {
  userName: "Baris",
  streak: 0,
  xp: 0,
  completedLessons: [],
  completedToday: {
    flashcards: false,
    quiz: false
  },
  currentScreen: "home",
  appVersion: 4,
  activeCategory: "verben",
  expandedSubcategories: {},
  theme: "dark", // Default to dark mode for App_Tasarım.PNG aesthetic
  quizHistory: [],
  lastActiveDate: "",
  
  // Prepositions specific states
  prepScores: {},     // { 'abhängen_von': 3, ... }
  starredPreps: [],    // [ 'abhängen_von', ... ]

  // Sprachbausteine specific states
  sprachbausteineAnswers: {},
  sprachbausteineProgress: {},

  // Leseverstehen specific states
  activeLeseverstehenPart: 1,

  // Vocabulary specific states
  myVocabulary: []
};

// Flashcards pool based on the grammar content
const FLASHCARDS = [
  { front: "Das Fenster lässt sich nicht öffnen.", back: "Pencere açılamıyor. (Kestirme 'sich lassen' edilgen yapısı)" },
  { front: "Sie wäscht sich.", back: "Kendini yıkıyor. (Aynadakiler - Dönüşlü kullanılan normal fiil)" },
  { front: "Er lässt sich die Haare schneiden.", back: "Saçını kestiriyor. (İşi başkasına yaptırma / ettirgenlik)" },
  { front: "Sie wäscht den Hund.", back: "Köpeği yıkıyor. (Dönüşsüz eylem - nesne var)" },
  { front: "Wir treffen uns.", back: "Buluşuyoruz. (Karşılıklı - Reziprok eylem)" },
  { front: "Das Fenster kann nicht geöffnet werden.", back: "Pencere açılamıyor. (Uzun edilgen / Passiv hali)" },
  { front: "Ich brauche nicht zu kommen.", back: "Gelmek zorunda değilim. (brauchen + zu + nicht = müssen değil)" },
  { front: "Das Haus ist gebaut.", back: "Ev inşa edilmiş / hazır durumda. (Zustandspassiv - durum edilgeni)" },
  { front: "Das Haus wird gebaut.", back: "Ev inşa ediliyor. (Vorgangspassiv - süreç odaklı edilgen)" },
  { front: "Wenn benutzte Bücher...", back: "Eğer kullanılmış kitaplar... (Partizip II sıfat fiil kullanımı)" },
  { front: "Sie rasiert sich.", back: "Tıraş oluyor. (Kendi kendini tıraş etme)" },
  { front: "Sie küssen einander.", back: "Birbirlerini öpüyorlar. (Karşılıklı - 'einander' kullanımı)" }
];

// Quiz question pool directly based on lesson files
const QUIZ_QUESTIONS = [
  {
    question: "'Pencere açılamıyor' cümlesinin 'sich lassen' kullanılarak yapılan edilgen (kestirme) karşılığı hangisidir?",
    options: [
      "Das Fenster lässt sich öffnen.",
      "Das Fenster lässt sich nicht öffnen.",
      "Das Fenster kann nicht geöffnet werden.",
      "Das Fenster lässt sich nicht geöffnet."
    ],
    correct: 1
  },
  {
    question: "'Sie wäscht sich' (Kendini yıkıyor) cümlesindeki dönüşlü fiil hangi dönüşlü fiil grubuna aittir?",
    options: [
      "Yapışık ikizler (Echtes Reflexivpronomen)",
      "İki yüzlüler (Akkusativ/Dativ değişen)",
      "Aynadakiler (Dönüşlü kullanılan normal fiiller)",
      "Karşılıklı fiiller (Reziproke Verben)"
    ],
    correct: 2
  },
  {
    question: "'sich lassen' yapısında etkilenen nesne cümlede hangi öge durumuna geçer?",
    options: [
      "Akkusativ Nesne (Yüklem)",
      "Dativ Nesne",
      "Özne (Nominativ)",
      "Zarf Tümleci"
    ],
    correct: 2
  },
  {
    question: "'Ich lasse mir die Haare schneiden' cümlesindeki temel anlam hangisidir?",
    options: [
      "Kendi saçımı kendim kesiyorum.",
      "Saçımın kesilmesini engelliyorum.",
      "Saçımı bir başkasına (berbere) kestiriyorum.",
      "Saçımı kesmek zorundayım."
    ],
    correct: 2
  },
  {
    question: "'brauchen + zu' yapısı olumsuz veya sınırlayıcı cümlelerde (nicht/nur) Almancadaki hangi fiilin yerine kullanılır?",
    options: [
      "müssen (zorunda olmak)",
      "können (yapabilmek)",
      "dürfen (izinli olmak)",
      "wollen (istemek)"
    ],
    correct: 0
  },
  {
    question: "Süreç odaklı edilgen yapı (Vorgangspassiv) hangi yardımcı fiille kurulur?",
    options: [
      "sein",
      "haben",
      "werden",
      "lassen"
    ],
    correct: 2
  },
  {
    question: "Zustandspassiv (durum edilgeni) cümlelerinde hangi yardımcı fiil kullanılır?",
    options: [
      "werden",
      "sein",
      "lassen",
      "können"
    ],
    correct: 1
  },
  {
    question: "'Sie küssen sich' ile 'Sie küssen einander' arasındaki temel fark nedir?",
    options: [
      "Bir fark yoktur, tamamen aynıdır.",
      "Birincisi dönüşlü olabilir (kendilerini öpmeleri), ikincisinde ise eylem mutlaka karşılıklıdır.",
      "İkincisi edilgen yapıdır.",
      "Birincisi şimdiki zaman, ikincisi geçmiş zamandır."
    ],
    correct: 1
  }
];

// Fill in the blanks database
const FILLBLANKS_QUESTIONS = [
  {
    sentence: "Das Fenster ________ sich nicht öffnen.",
    translation: "Pencere açılamıyor.",
    options: ["lässt", "wird", "ist", "kann"],
    correct: "lässt"
  },
  {
    sentence: "Sie wäscht ________.",
    translation: "Kendini yıkıyor.",
    options: ["sich", "mich", "dir", "uns"],
    correct: "sich"
  },
  {
    sentence: "Ich brauche nicht ________ kommen.",
    translation: "Gelmek zorunda değilim.",
    options: ["zu", "um", "für", "an"],
    correct: "zu"
  },
  {
    sentence: "Das Haus ________ gebaut.",
    translation: "Ev inşa edilmiş (durumda).",
    options: ["ist", "wird", "hat", "lässt"],
    correct: "ist"
  },
  {
    sentence: "Wir treffen ________ um 8 Uhr.",
    translation: "Saat 8'de buluşuyoruz.",
    options: ["uns", "sich", "euch", "wir"],
    correct: "uns"
  }
];

// Helper to save state
function saveState() {
  localStorage.setItem("b1_app_state", JSON.stringify(state));
}

// Helper to load state
function loadState() {
  const saved = localStorage.getItem("b1_app_state");
  let savedParsed = {};
  if (saved) {
    try {
      savedParsed = JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing saved state", e);
    }
  }
  
  // If there is saved data but no appVersion, treat it as version 1
  const loadedVersion = saved ? (savedParsed.appVersion || 1) : 4;
  
  state = { ...state, ...savedParsed };
  
  // Force reset state to version 4 to clean up legacy mock data
  if (loadedVersion < 4) {
    state.xp = 0;
    state.streak = 0;
    state.completedLessons = [];
    state.completedToday = { flashcards: false, quiz: false };
    state.prepScores = {};
    state.starredPreps = [];
    state.sprachbausteineAnswers = {};
    state.sprachbausteineProgress = {};
    state.leseverstehenAnswers = {};
    state.leseverstehenProgress = {};
    state.myVocabulary = [];
    state.appVersion = 4;
    saveState();
  }
  
  // Safe migrations for newly added properties
  if (!state.prepScores) state.prepScores = {};
  if (!state.starredPreps) state.starredPreps = [];
  if (!state.leseverstehenAnswers) state.leseverstehenAnswers = {};
  if (!state.leseverstehenProgress) state.leseverstehenProgress = {};
  if (!state.sprachbausteineAnswers) state.sprachbausteineAnswers = {};
  if (!state.sprachbausteineProgress) state.sprachbausteineProgress = {};
  if (!state.activeLeseverstehenPart) state.activeLeseverstehenPart = 1;
  if (!state.activeSprachbausteinePart) state.activeSprachbausteinePart = 1;
  if (!state.myVocabulary) state.myVocabulary = [];
  
  const today = new Date().toDateString();
  if (state.lastActiveDate && state.lastActiveDate !== today) {
    state.completedToday.flashcards = false;
    state.completedToday.quiz = false;
  }
  state.lastActiveDate = today;
  saveState();
}

// Initializing the application
document.addEventListener("DOMContentLoaded", () => {
  loadState();
  applyTheme();
  initNav();
  showScreen(state.currentScreen);
  updateStreakBadge();
  
  // Home Today's task links -> directs to Exercises page
  document.getElementById("flashcard-today-btn")?.addEventListener("click", () => {
    showScreen("exercises");
  });
  
  document.getElementById("quiz-today-btn")?.addEventListener("click", () => {
    showScreen("exercises");
  });
  
  document.getElementById("continue-all-btn")?.addEventListener("click", () => {
    showScreen("sitemap");
  });
  
  // Exercises Menu Launchers
  document.getElementById("launcher-flashcards")?.addEventListener("click", () => {
    showScreen("flashcard-play");
  });
  
  document.getElementById("launcher-quiz")?.addEventListener("click", () => {
    startNewQuiz();
  });
  
  document.getElementById("launcher-fillblanks")?.addEventListener("click", () => {
    startNewFillBlanks();
  });
  
  document.getElementById("launcher-verben-prap")?.addEventListener("click", () => {
    showScreen("verben-prep-dashboard");
  });

  document.getElementById("launcher-leseverstehen")?.addEventListener("click", () => {
    showScreen("leseverstehen-parts");
  });

  document.querySelectorAll(".leseverstehen-part-card").forEach(card => {
    card.addEventListener("click", () => {
      const part = parseInt(card.getAttribute("data-part")) || 1;
      state.activeLeseverstehenPart = part;
      saveState();
      showScreen("leseverstehen-dashboard");
    });
  });

  document.getElementById("launcher-sprachbausteine")?.addEventListener("click", () => {
    showScreen("sprachbausteine-parts");
  });

  document.querySelectorAll(".sprachbausteine-part-card").forEach(card => {
    card.addEventListener("click", () => {
      const part = parseInt(card.getAttribute("data-part")) || 1;
      state.activeSprachbausteinePart = part;
      saveState();
      showScreen("sprachbausteine-dashboard");
    });
  });

  document.getElementById("launcher-myvocab")?.addEventListener("click", () => {
    showScreen("myvocab");
  });
  
  // Prepositions Dashboard Inputs Bindings
  document.getElementById("start-prep-quiz-btn")?.addEventListener("click", () => {
    startNewPrepQuiz();
  });
  document.getElementById("filter-level")?.addEventListener("change", () => {
    filterPrepList();
  });
  document.getElementById("filter-kasus")?.addEventListener("change", () => {
    filterPrepList();
  });
  document.getElementById("prep-search")?.addEventListener("keyup", () => {
    filterPrepList();
  });

  // Profile Screen Event Listeners
  document.getElementById("profile-theme-switch")?.addEventListener("click", () => {
    toggleTheme();
  });
  document.getElementById("profile-save-btn")?.addEventListener("click", () => {
    const nameInput = document.getElementById("profile-name-input");
    if (nameInput && nameInput.value.trim()) {
      state.userName = nameInput.value.trim();
      saveState();
      alert("Profil başarıyla kaydedildi!");
      renderHomeScreen();
    }
  });
  document.getElementById("profile-reset-btn")?.addEventListener("click", () => {
    if (confirm("Tüm ilerlemenizi sıfırlamak istediğinize emin misiniz?")) {
      localStorage.removeItem("b1_app_state");
      window.location.reload();
    }
  });
  
  // ================= MY VOCABULARY EVENT BINDINGS =================
  let selectedText = "";
  let selectionContext = "";
  
  function hideVocabFloatingButton() {
    const floatBtn = document.getElementById("vocab-floating-btn");
    if (floatBtn && !floatBtn.classList.contains("hidden")) {
      floatBtn.classList.add("hidden");
    }
  }
  
  document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    // We only want single word or short phrase selections
    if (text.length > 1 && text.length < 50 && !text.includes("\n")) {
      selectedText = text;
      
      const anchorNode = selection.anchorNode;
      if (anchorNode && anchorNode.parentElement) {
        // Only trigger inside reading text nodes/containers
        const isInsideExercise = anchorNode.parentElement.closest(".letter-container") || 
                                 anchorNode.parentElement.closest(".leseverstehen-text-pane") || 
                                 anchorNode.parentElement.closest("#leseverstehen-t2-article") ||
                                 anchorNode.parentElement.closest(".leseverstehen-card-details") ||
                                 anchorNode.parentElement.closest(".article-text") ||
                                 anchorNode.parentElement.closest(".text-card");
                                 
        if (isInsideExercise) {
          selectionContext = anchorNode.parentElement.textContent.trim();
          
          try {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            const floatBtn = document.getElementById("vocab-floating-btn");
            if (floatBtn) {
              const appContainer = document.querySelector(".app-container");
              const containerRect = appContainer ? appContainer.getBoundingClientRect() : { left: 0, top: 0 };
              
              // Position slightly above the highlight
              floatBtn.style.left = `${rect.left - containerRect.left + (rect.width / 2) - 60}px`;
              floatBtn.style.top = `${rect.top - containerRect.top - 38 + (appContainer ? appContainer.scrollTop : 0)}px`;
              floatBtn.classList.remove("hidden");
            }
          } catch (e) {
            // ignore range error
          }
          return;
        }
      }
    }
    
    hideVocabFloatingButton();
  });
  
  // Open modal when clicking floating button
  document.getElementById("vocab-floating-btn")?.addEventListener("mousedown", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (selectedText) {
      openVocabModal(selectedText, selectionContext);
    }
  });
  
  async function openVocabModal(word, contextText) {
    const wordInput = document.getElementById("vocab-word-input");
    const transInput = document.getElementById("vocab-translation-input");
    const contextInput = document.getElementById("vocab-context-input");
    const modal = document.getElementById("vocab-modal");
    
    if (!wordInput || !transInput || !contextInput || !modal) return;
    
    // Clean trailing/leading punctuation
    const cleanWord = word.replace(/^[.,\/#!$%\^&\*;:{}=\-_`~()"'„“]+|[.,\/#!$%\^&\*;:{}=\-_`~()"'„“]+$/g, "");
    
    wordInput.value = cleanWord;
    transInput.value = "";
    transInput.placeholder = "Çeviriliyor...";
    contextInput.value = extractSentence(contextText, cleanWord) || "";
    
    modal.classList.remove("hidden");
    hideVocabFloatingButton();
    
    // Clear selection
    window.getSelection().removeAllRanges();
    
    // Fetch translation
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=de&tl=tr&dt=t&q=${encodeURIComponent(cleanWord)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        transInput.value = data[0][0][0];
      } else {
        transInput.placeholder = "Anlamını buraya girin";
      }
    } catch (e) {
      console.error("Translation failed", e);
      transInput.placeholder = "Anlamını buraya girin";
    }
  }
  
  // Save/Cancel Modal actions
  document.getElementById("vocab-save-btn")?.addEventListener("click", () => {
    const word = document.getElementById("vocab-word-input")?.value.trim();
    const translation = document.getElementById("vocab-translation-input")?.value.trim();
    const context = document.getElementById("vocab-context-input")?.value.trim();
    
    if (!word || !translation) {
      alert("Kelime ve Çeviri alanları boş olamaz.");
      return;
    }
    
    if (!state.myVocabulary) state.myVocabulary = [];
    
    const existingIndex = state.myVocabulary.findIndex(item => item.word.toLowerCase() === word.toLowerCase());
    if (existingIndex > -1) {
      state.myVocabulary[existingIndex] = {
        id: state.myVocabulary[existingIndex].id,
        word,
        translation,
        context,
        dateAdded: new Date().toLocaleDateString()
      };
    } else {
      state.myVocabulary.push({
        id: Date.now().toString(),
        word,
        translation,
        context,
        dateAdded: new Date().toLocaleDateString()
      });
    }
    
    saveState();
    document.getElementById("vocab-modal")?.classList.add("hidden");
  });
  
  document.getElementById("vocab-cancel-btn")?.addEventListener("click", () => {
    document.getElementById("vocab-modal")?.classList.add("hidden");
  });
  
  // Vocabulary tab switching
  document.querySelectorAll(".vocab-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".vocab-tab-btn").forEach(b => {
        b.classList.remove("active");
        b.style.color = "var(--color-text-secondary)";
      });
      btn.classList.add("active");
      btn.style.color = "var(--color-text-primary)";
      
      const tab = btn.getAttribute("data-tab");
      const listContent = document.getElementById("vocab-tab-content-list");
      const studyContent = document.getElementById("vocab-tab-content-study");
      
      if (tab === "list") {
        listContent?.classList.remove("hidden");
        studyContent?.classList.add("hidden");
        renderVocabList();
      } else {
        listContent?.classList.add("hidden");
        studyContent?.classList.remove("hidden");
        startVocabStudy();
      }
    });
  });
  
  // Vocabulary search input binding
  document.getElementById("vocab-search-input")?.addEventListener("keyup", () => {
    renderVocabList();
  });

  // Back buttons
  document.querySelectorAll(".back-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target") || "home";
      showScreen(target);
    });
  });
});

// Theme support
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
}

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  applyTheme();
  saveState();
  renderProfileScreen();
}

// Streak UI helper
function updateStreakBadge() {
  const streakEl = document.getElementById("streak-counter");
  if (streakEl) {
    streakEl.innerHTML = `<i class="ti ti-flame" style="font-size:16px;" aria-hidden="true"></i> Seri: ${state.streak} Gün`;
  }
}

// Navigation controller
function initNav() {
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
      const screenId = item.getAttribute("data-screen");
      if (screenId) {
        showScreen(screenId);
      }
    });
  });
}

function showScreen(screenId) {
  state.currentScreen = screenId;
  saveState();
  
  // Clear timers if navigating away from play screens
  if (screenId !== "leseverstehen-play" && leseverstehenTimerInterval) {
    clearInterval(leseverstehenTimerInterval);
    leseverstehenTimerInterval = null;
  }
  if (screenId !== "sprachbausteine-play" && sprachbausteineTimerInterval) {
    clearInterval(sprachbausteineTimerInterval);
    sprachbausteineTimerInterval = null;
  }

  // Hide all screens
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  
  // Remove active nav styling
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  
  // Show target screen
  const targetScreen = document.getElementById(`${screenId}-screen`);
  if (targetScreen) {
    targetScreen.classList.remove("hidden");
  }
  
  // Toggle wide-mode class on container for split layout
  const appContainer = document.querySelector(".app-container");
  if (screenId === "leseverstehen-play" || screenId === "sprachbausteine-play") {
    appContainer?.classList.add("wide-mode");
  } else {
    appContainer?.classList.remove("wide-mode");
  }
  
  // Highlight active nav item
  // Map sub-activities back to the active navbar tab
  let navActiveId = screenId;
  if (screenId === "lesson" || screenId === "lesson-quiz") {
    navActiveId = "sitemap";
  } else if (screenId === "flashcard-play" || screenId === "quiz" || screenId === "fillblanks-play" || screenId === "verben-prep-dashboard" || screenId === "verben-prep-quiz" || screenId === "leseverstehen-play" || screenId === "leseverstehen-dashboard" || screenId === "leseverstehen-parts" || screenId === "sprachbausteine-play" || screenId === "sprachbausteine-dashboard" || screenId === "sprachbausteine-parts" || screenId === "myvocab") {
    navActiveId = "exercises";
  }
  const activeNav = document.querySelector(`.nav-item[data-screen="${navActiveId}"]`);
  if (activeNav) {
    activeNav.classList.add("active");
  }
  
  // Render specific screen content
  if (screenId === "home") {
    renderHomeScreen();
  } else if (screenId === "sitemap") {
    renderSitemapScreen();
  } else if (screenId === "verben-prep-dashboard") {
    renderPrepDashboard();
  } else if (screenId === "flashcard-play") {
    renderFlashcardScreen();
  } else if (screenId === "analytics") {
    renderAnalyticsScreen();
  } else if (screenId === "profile") {
    renderProfileScreen();
  } else if (screenId === "leseverstehen-play") {
    renderLeseverstehenScreen();
  } else if (screenId === "leseverstehen-dashboard") {
    renderLeseverstehenDashboard();
  } else if (screenId === "sprachbausteine-play") {
    renderSprachbausteineScreen();
  } else if (screenId === "sprachbausteine-dashboard") {
    renderSprachbausteineDashboard();
  } else if (screenId === "myvocab") {
    renderMyVocabScreen();
  }
}

// HOME SCREEN RENDERING
function renderHomeScreen() {
  document.getElementById("profile-name").textContent = state.userName;
  
  const totalLessons = countTotalLessons();
  const completedCount = state.completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  document.getElementById("progress-text-percent").textContent = `${progressPercent}%`;
  document.getElementById("progress-bar-fill").style.width = `${progressPercent}%`;
  document.getElementById("completed-fraction").textContent = `${completedCount}/${totalLessons} tamamlandı`;
  
  const totalTopicsCount = document.getElementById("total-topics-count");
  if (totalTopicsCount) {
    totalTopicsCount.textContent = `${totalLessons} konu`;
  }
  
  updateStreakBadge();
  
  const fcText = document.getElementById("fc-status-text");
  if (fcText) {
    fcText.textContent = state.completedToday.flashcards ? "Tamamlandı! 🎉" : "12 kart bekliyor";
  }
  const quizText = document.getElementById("quiz-status-text");
  if (quizText) {
    quizText.textContent = state.completedToday.quiz ? "Tamamlandı! 🎉" : "5 dakika";
  }
  
  // Devam et (Active topics) list
  const continueList = document.getElementById("continue-list");
  if (continueList) {
    continueList.innerHTML = "";
    
    LESSONS_DATA.forEach(cat => {
      cat.subcategories.forEach(sub => {
        const subLessons = sub.lessons;
        if (subLessons.length > 0) {
          const completedSub = subLessons.filter(l => state.completedLessons.includes(l.id)).length;
          
          if (completedSub > 0 && completedSub < subLessons.length) {
            const pct = Math.round((completedSub / subLessons.length) * 100);
            
            const card = document.createElement("div");
            card.className = "interactive-card";
            card.style = "border-radius: var(--border-radius-lg); padding: 12px 14px; display:flex; align-items:center; gap: 12px; margin-bottom: 10px;";
            card.innerHTML = `
              <div class="c-${cat.color}-bg" style="width:36px; height:36px; border-radius: var(--border-radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i class="ti ${cat.icon}" style="font-size:16px;" aria-hidden="true"></i>
              </div>
              <div style="flex:1; min-width:0;">
                <p style="font-size: 13.5px; font-weight: 600; margin:0;">${sub.name}</p>
                <p class="ts" style="font-size: 11.5px; margin:2px 0 0;">${completedSub}/${subLessons.length} alt başlık tamamlandı</p>
                <div style="height: 4px; background: var(--color-background-primary); border-radius: 99px; margin-top:6px; overflow:hidden; border:1px solid var(--color-border-primary);">
                  <div style="width: ${pct}%; height:100%; background: var(--theme-${cat.color}); border-radius:99px;"></div>
                </div>
              </div>
              <i class="ti ti-chevron-right" style="font-size:16px; color:var(--color-text-tertiary); flex-shrink:0;" aria-hidden="true"></i>
            `;
            
            card.addEventListener("click", () => {
              state.activeCategory = cat.id;
              state.expandedSubcategories[sub.name] = true;
              showScreen("sitemap");
            });
            continueList.appendChild(card);
          }
        }
      });
    });
    
    if (continueList.innerHTML === "") {
      // Find the first subcategory that is not fully completed
      let recommendedSub = null;
      let recommendedCat = null;
      
      for (const cat of LESSONS_DATA) {
        for (const sub of cat.subcategories) {
          const subLessons = sub.lessons;
          if (subLessons.length > 0) {
            const completedSub = subLessons.filter(l => state.completedLessons.includes(l.id)).length;
            if (completedSub < subLessons.length) {
              recommendedSub = sub;
              recommendedCat = cat;
              break;
            }
          }
        }
        if (recommendedSub) break;
      }
      
      if (recommendedSub && recommendedCat) {
        const subLessons = recommendedSub.lessons;
        const completedSub = subLessons.filter(l => state.completedLessons.includes(l.id)).length;
        const pct = Math.round((completedSub / subLessons.length) * 100);
        
        continueList.innerHTML = `
          <div class="interactive-card" style="border-radius: var(--border-radius-lg); padding: 12px 14px; display:flex; align-items:center; gap: 12px; margin-bottom: 10px;" id="fallback-continue-card">
            <div class="c-${recommendedCat.color}-bg" style="width:36px; height:36px; border-radius: var(--border-radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <i class="ti ${recommendedCat.icon}" style="font-size:16px;" aria-hidden="true"></i>
            </div>
            <div style="flex:1; min-width:0;">
              <p style="font-size: 13.5px; font-weight: 600; margin:0;">${recommendedSub.name}</p>
              <p class="ts" style="font-size: 11.5px; margin:2px 0 0;">${completedSub}/${subLessons.length} alt başlık tamamlandı</p>
              <div style="height: 4px; background: var(--color-background-primary); border-radius: 99px; margin-top:6px; overflow:hidden; border:1px solid var(--color-border-primary);">
                <div style="width: ${pct}%; height:100%; background: var(--theme-${recommendedCat.color}); border-radius:99px;"></div>
              </div>
            </div>
            <i class="ti ti-chevron-right" style="font-size:16px; color:var(--color-text-tertiary); flex-shrink:0;" aria-hidden="true"></i>
          </div>
        `;
        document.getElementById("fallback-continue-card")?.addEventListener("click", () => {
          state.activeCategory = recommendedCat.id;
          state.expandedSubcategories[recommendedSub.name] = true;
          showScreen("sitemap");
        });
      }
    }
  }
  
  // Categories section bindings
  const categoriesList = document.getElementById("categories-grid-list");
  if (categoriesList) {
    categoriesList.innerHTML = "";
    LESSONS_DATA.forEach(cat => {
      let totalCatLessons = 0;
      cat.subcategories.forEach(sub => totalCatLessons += sub.lessons.length);
      
      const catCard = document.createElement("div");
      catCard.className = `${cat.color} interactive-card`;
      catCard.style = "border-radius: var(--border-radius-lg); padding: 14px; display:flex; flex-direction:column; gap: 10px; min-height: 84px;";
      catCard.innerHTML = `
        <i class="ti ${cat.icon}" style="font-size:18px;" aria-hidden="true"></i>
        <div>
          <p class="t" style="font-size: 13px; font-weight: 600; margin:0;">${cat.name}</p>
          <p class="ts" style="font-size: 11px; margin: 2px 0 0;">${totalCatLessons} konu</p>
        </div>
      `;
      catCard.addEventListener("click", () => {
        state.activeCategory = cat.id;
        showScreen("sitemap");
      });
      categoriesList.appendChild(catCard);
    });
  }
}

// SITEMAP SCREEN RENDERING
function renderSitemapScreen() {
  const catNav = document.getElementById("sitemap-category-nav");
  const sitemapList = document.getElementById("sitemap-topics-list");
  
  if (!catNav || !sitemapList) return;
  
  catNav.innerHTML = "";
  LESSONS_DATA.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `category-tab-btn ${state.activeCategory === cat.id ? 'active' : ''}`;
    btn.style = `flex: 1; padding: 10px 0; border: none; border-bottom: 2px solid ${state.activeCategory === cat.id ? 'var(--theme-purple)' : 'transparent'}; background: none; font-size: 13px; font-weight: 600; cursor: pointer; color: ${state.activeCategory === cat.id ? 'var(--theme-purple)' : 'var(--color-text-secondary)'};`;
    btn.textContent = cat.name.split(" ")[0];
    btn.addEventListener("click", () => {
      state.activeCategory = cat.id;
      saveState();
      renderSitemapScreen();
    });
    catNav.appendChild(btn);
  });
  
  const activeCatObj = LESSONS_DATA.find(c => c.id === state.activeCategory);
  if (!activeCatObj) return;
  
  sitemapList.innerHTML = "";
  
  activeCatObj.subcategories.forEach(sub => {
    const item = document.createElement("div");
    item.className = "subcategory-item";
    item.style = "margin-bottom: 10px;";
    
    const isExpanded = state.expandedSubcategories[sub.name];
    
    const header = document.createElement("div");
    header.className = "subcategory-header";
    header.innerHTML = `
      <span class="t">${sub.name}</span>
      <i class="ti ${isExpanded ? 'ti-chevron-down' : 'ti-chevron-right'}" style="color: var(--color-text-tertiary);"></i>
    `;
    header.addEventListener("click", () => {
      state.expandedSubcategories[sub.name] = !isExpanded;
      saveState();
      renderSitemapScreen();
    });
    item.appendChild(header);
    
    if (isExpanded) {
      const lessonsList = document.createElement("div");
      lessonsList.className = "lessons-list";
      
      if (sub.lessons.length === 0) {
        const noLesson = document.createElement("div");
        noLesson.style = "padding: 12px 18px; font-size: 12.5px; color: var(--color-text-tertiary); font-style: italic;";
        noLesson.textContent = "Bu kategoride henüz ders eklenmemiş.";
        lessonsList.appendChild(noLesson);
      } else {
        sub.lessons.forEach(les => {
          const isCompleted = state.completedLessons.includes(les.id);
          const lesItem = document.createElement("div");
          lesItem.className = `lesson-item ${isCompleted ? 'completed' : ''}`;
          lesItem.innerHTML = `
            <span class="lesson-item-title">${les.title}</span>
            <i class="ti ${isCompleted ? 'ti-circle-check completed' : 'ti-circle'} lesson-status-icon ${isCompleted ? 'completed' : 'incomplete'}"></i>
          `;
          lesItem.addEventListener("click", () => {
            openLesson(les);
          });
          lessonsList.appendChild(lesItem);
        });
      }
      item.appendChild(lessonsList);
    }
    
    sitemapList.appendChild(item);
  });
}

// LESSON DETAILS SCREEN
function openLesson(lesson) {
  showScreen("lesson");
  
  document.getElementById("lesson-title").textContent = lesson.title;
  
  const lessonBody = document.getElementById("lesson-body-content");
  if (lessonBody) {
    lessonBody.innerHTML = formatLessonContent(lesson.content);
  }
  
  const actionContainer = document.getElementById("lesson-action-container");
  if (actionContainer) {
    actionContainer.innerHTML = "";
    
    const isCompleted = state.completedLessons.includes(lesson.id);
    const hasQuiz = typeof LESSON_QUIZZES !== 'undefined' && LESSON_QUIZZES[lesson.id];
    
    const btn = document.createElement("button");
    btn.style = "width: 100%; border: none; padding: 13px; border-radius: var(--border-radius-lg); font-size: 13.5px; font-weight: 600; cursor: pointer;";
    
    if (hasQuiz) {
      if (isCompleted) {
        btn.className = "c-teal";
        btn.innerHTML = `<i class="ti ti-circle-check"></i> Sınavı Tekrar Et`;
      } else {
        btn.className = "c-purple";
        btn.innerHTML = `<i class="ti ti-pencil"></i> Sınav Yap`;
      }
      btn.addEventListener("click", () => {
        startLessonQuiz(lesson);
      });
    } else {
      // Fallback manual completion if no quiz exists yet
      updateCompleteButtonState(btn, isCompleted);
      btn.addEventListener("click", () => {
        const index = state.completedLessons.indexOf(lesson.id);
        let nowCompleted = false;
        if (index > -1) {
          state.completedLessons.splice(index, 1);
        } else {
          state.completedLessons.push(lesson.id);
          state.xp += 15;
          nowCompleted = true;
        }
        saveState();
        updateCompleteButtonState(btn, nowCompleted);
        updateStreakBadge();
      });
    }
    actionContainer.appendChild(btn);
  }
}

function updateCompleteButtonState(btn, isCompleted) {
  btn.style = "width:100%; padding:13px; border-radius:var(--border-radius-lg); font-size:13.5px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; border:none;";
  if (isCompleted) {
    btn.className = "c-teal";
    btn.innerHTML = `<i class="ti ti-circle-check-filled"></i> Tamamlandı olarak işaretlendi`;
  } else {
    btn.className = "c-purple";
    btn.innerHTML = `<i class="ti ti-circle-check"></i> Tamamlandı olarak işaretle (+15 XP)`;
  }
}

function formatLessonContent(content) {
  const lines = content.split("\n");
  let html = "";
  
  lines.forEach(line => {
    let trimmed = line.trim();
    if (!trimmed) return;
    
    if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
      const cleaned = trimmed.substring(1).trim();
      html += `<div class="lesson-example-box">${formatCitations(cleaned)}</div>`;
    } else {
      html += `<p>${formatCitations(trimmed)}</p>`;
    }
  });
  
  return html;
}

function formatCitations(text) {
  let formatted = text;
  
  formatted = formatted.replace(/"([^"]+)"/g, '<strong>“$1”</strong>');
  
  formatted = formatted.replace(/\s+(\d+)(,\s*\d+)*/g, (match) => {
    const nums = match.trim().split(/\s*,\s*/);
    return nums.map(n => `<span class="citation" title="Kaynak Referans ${n}">${n}</span>`).join("");
  });
  
  return formatted;
}

// FLASHCARDS CONTROLLER
let currentCardIndex = 0;
function renderFlashcardScreen() {
  currentCardIndex = 0;
  updateFlashcardUI();
  
  const prevBtn = document.getElementById("fc-prev-btn");
  const nextBtn = document.getElementById("fc-next-btn");
  
  if (prevBtn && nextBtn) {
    prevBtn.onclick = () => {
      if (currentCardIndex > 0) {
        currentCardIndex--;
        updateFlashcardUI();
      }
    };
    nextBtn.onclick = () => {
      if (currentCardIndex < FLASHCARDS.length - 1) {
        currentCardIndex++;
        updateFlashcardUI();
      } else {
        state.completedToday.flashcards = true;
        state.xp += 20;
        saveState();
        alert("Harika! Tüm kartları incelediniz ve +20 XP kazandınız! 🎉");
        showScreen("exercises");
      }
    };
  }
}

function updateFlashcardUI() {
  const card = FLASHCARDS[currentCardIndex];
  const container = document.getElementById("flashcard-container");
  
  if (!container) return;
  
  container.innerHTML = `
    <div class="flashcard" id="active-flashcard">
      <div class="card-face card-front">
        <div style="font-size: 11.5px; color: var(--color-text-tertiary); display:flex; justify-content:space-between;">
          <span>Kart ${currentCardIndex + 1} / ${FLASHCARDS.length}</span>
          <span>B1 Almanca</span>
        </div>
        <div style="font-size: 17.5px; font-weight: 600; text-align: center; margin: auto 0; line-height:1.55;">
          ${card.front}
        </div>
        <div style="font-size: 11px; color: var(--color-text-tertiary); text-align: center;">
          Türkçesini görmek için dokunun
        </div>
      </div>
      <div class="card-face card-back">
        <div style="font-size: 11.5px; color: var(--color-text-tertiary); display:flex; justify-content:space-between;">
          <span>Kart ${currentCardIndex + 1} / ${FLASHCARDS.length}</span>
          <span>Türkçe Karşılığı</span>
        </div>
        <div style="font-size: 15.5px; font-weight: 500; text-align: center; margin: auto 0; line-height:1.6; color: var(--theme-purple);">
          ${card.back}
        </div>
        <div style="font-size: 11px; color: var(--color-text-tertiary); text-align: center;">
          Almancasını görmek için dokunun
        </div>
      </div>
    </div>
  `;
  
  const fcElement = document.getElementById("active-flashcard");
  if (fcElement) {
    fcElement.addEventListener("click", () => {
      fcElement.classList.toggle("flipped");
    });
  }
  
  const prevBtn = document.getElementById("fc-prev-btn");
  if (prevBtn) {
    prevBtn.disabled = currentCardIndex === 0;
    prevBtn.style.opacity = currentCardIndex === 0 ? "0.4" : "1";
  }
  
  const nextBtn = document.getElementById("fc-next-btn");
  if (nextBtn) {
    nextBtn.textContent = currentCardIndex === FLASHCARDS.length - 1 ? "Tamamla" : "Sonraki";
  }
}

// QUIZ CONTROLLER
let activeQuizQuestions = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;

function startNewQuiz() {
  showScreen("quiz");
  const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
  activeQuizQuestions = shuffled.slice(0, 5);
  currentQuestionIndex = 0;
  correctAnswersCount = 0;
  
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById("quiz-content-area");
  if (!container) return;
  
  const q = activeQuizQuestions[currentQuestionIndex];
  
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
      <span class="ts" style="font-size:12.5px; font-weight:500;">Soru ${currentQuestionIndex + 1} / 5</span>
      <div style="width: 80px; height: 5px; background: var(--color-border-primary); border-radius: 99px; overflow:hidden;">
        <div style="width: ${(currentQuestionIndex + 1) * 20}%; height:100%; background: var(--theme-coral); border-radius:99px;"></div>
      </div>
    </div>
    
    <p style="font-size: 15px; font-weight: 600; line-height: 1.55; margin-bottom: 24px; color: var(--color-text-primary);">
      ${q.question}
    </p>
    
    <div style="display:flex; flex-direction:column; gap:11px;" id="quiz-options-container">
      ${q.options.map((opt, idx) => `
        <button class="quiz-option" data-idx="${idx}">
          <span>${opt}</span>
          <i class="ti ti-circle" style="font-size:16px; color:var(--color-text-tertiary); flex-shrink:0; margin-left:8px;"></i>
        </button>
      `).join("")}
    </div>
  `;
  
  const options = container.querySelectorAll(".quiz-option");
  options.forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedIdx = parseInt(btn.getAttribute("data-idx"));
      handleQuizAnswer(selectedIdx, btn, options);
    });
  });
}

function handleQuizAnswer(selectedIdx, clickedBtn, allOptions) {
  const q = activeQuizQuestions[currentQuestionIndex];
  const correctIdx = q.correct;
  
  allOptions.forEach(opt => opt.disabled = true);
  
  if (selectedIdx === correctIdx) {
    clickedBtn.classList.add("correct");
    clickedBtn.querySelector("i").className = "ti ti-circle-check-filled";
    correctAnswersCount++;
    state.xp += 10;
  } else {
    clickedBtn.classList.add("incorrect");
    clickedBtn.querySelector("i").className = "ti ti-circle-x-filled";
    
    const correctBtn = allOptions[correctIdx];
    correctBtn.classList.add("correct");
    correctBtn.querySelector("i").className = "ti ti-circle-check-filled";
  }
  
  saveState();
  
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < activeQuizQuestions.length) {
      renderQuizQuestion();
    } else {
      finishQuiz();
    }
  }, 1600);
}

function finishQuiz() {
  const container = document.getElementById("quiz-content-area");
  if (!container) return;
  
  state.completedToday.quiz = true;
  state.streak++;
  state.xp += 25;
  saveState();
  updateStreakBadge();
  
  container.innerHTML = `
    <div style="text-align: center; padding: 24px 10px; display:flex; flex-direction:column; align-items:center; gap:18px;">
      <div style="width: 64px; height: 64px; border-radius: 50%; display:flex; align-items:center; justify-content:center; border: 1px solid var(--color-border-primary); background-color: var(--color-background-secondary); color: var(--theme-coral);">
        <i class="ti ti-trophy" style="font-size:30px;"></i>
      </div>
      <div>
        <h2 style="font-size:19px; font-weight:700; margin:0 0 6px;">Quiz Tamamlandı!</h2>
        <p class="ts" style="font-size:13px; margin:0;">
          Tebrikler Baris, bugünkü quizi başarıyla bitirdin.
        </p>
      </div>
      
      <div style="background: var(--color-background-secondary); border: 1px solid var(--color-border-primary); border-radius: var(--border-radius-lg); padding: 16px; width: 100%; display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin: 8px 0;">
        <div style="text-align:center; border-right: 1px solid var(--color-border-secondary);">
          <p class="ts" style="font-size:11px; margin:0 0 4px;">Skor</p>
          <p style="font-size:18px; font-weight:700; margin:0; color:var(--theme-coral);">${correctAnswersCount} / 5</p>
        </div>
        <div style="text-align:center;">
          <p class="ts" style="font-size:11px; margin:0 0 4px;">Kazanılan XP</p>
          <p style="font-size:18px; font-weight:700; margin:0; color:var(--theme-teal);">+${correctAnswersCount * 10 + 25}</p>
        </div>
      </div>
      
      <div style="display:flex; align-items:center; gap:6px; font-size:12.5px; font-weight:600; color:var(--theme-purple);">
        <i class="ti ti-flame" style="font-size:16px;"></i> Seri: ${state.streak} Gün!
      </div>
      
      <button class="c-purple" style="width:100%; border:none; padding:12px; border-radius:var(--border-radius-lg); font-size:13.5px; font-weight:600; cursor:pointer; color:var(--color-background-primary); margin-top:10px;" id="quiz-done-btn">
        Alıştırma Sayfasına Dön
      </button>
    </div>
  `;
  
  document.getElementById("quiz-done-btn")?.addEventListener("click", () => {
    showScreen("exercises");
  });
}

// BOŞLUK DOLDURMA (FILL IN BLANKS) CONTROLLER
let activeFbQuestions = [];
let currentFbIndex = 0;
let correctFbCount = 0;

function startNewFillBlanks() {
  showScreen("fillblanks-play");
  activeFbQuestions = [...FILLBLANKS_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
  currentFbIndex = 0;
  correctFbCount = 0;
  renderFbQuestion();
}

function renderFbQuestion() {
  const container = document.getElementById("fillblanks-content-area");
  if (!container) return;
  
  const q = activeFbQuestions[currentFbIndex];
  
  const blankBox = `<span style="border-bottom: 2px solid var(--theme-teal); padding: 0 16px; margin: 0 4px; display: inline-block; min-width: 60px; text-align: center; color: var(--theme-teal); font-weight: 700;" id="fb-blank-word">...</span>`;
  const sentenceHtml = q.sentence.replace("________", blankBox);
  
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
      <span class="ts" style="font-size:12.5px; font-weight:500;">Soru ${currentFbIndex + 1} / 5</span>
      <div style="width: 80px; height: 5px; background: var(--color-border-primary); border-radius: 99px; overflow:hidden;">
        <div style="width: ${(currentFbIndex + 1) * 20}%; height:100%; background: var(--theme-teal); border-radius:99px;"></div>
      </div>
    </div>
    
    <div style="background: var(--color-background-secondary); border: 1px solid var(--color-border-primary); border-radius: var(--border-radius-lg); padding: 20px; text-align: center; margin-bottom: 24px;">
      <p style="font-size: 16px; font-weight: 600; line-height: 1.6; margin: 0 0 10px; color: var(--color-text-primary);">
        ${sentenceHtml}
      </p>
      <p class="ts" style="font-size: 12.5px; font-style: italic; margin: 0;">
        Türkçe: "${q.translation}"
      </p>
    </div>
    
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top: auto; margin-bottom: 20px;" id="fb-options-container">
      ${q.options.map(opt => `
        <button class="quiz-option" style="justify-content: center; text-align: center;" data-val="${opt}">
          <span>${opt}</span>
        </button>
      `).join("")}
    </div>
  `;
  
  const options = container.querySelectorAll("#fb-options-container button");
  options.forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedVal = btn.getAttribute("data-val");
      handleFbAnswer(selectedVal, btn, options);
    });
  });
}

function handleFbAnswer(selectedVal, clickedBtn, allOptions) {
  const q = activeFbQuestions[currentFbIndex];
  const correctVal = q.correct;
  
  const blankWord = document.getElementById("fb-blank-word");
  if (blankWord) {
    blankWord.textContent = selectedVal;
  }
  
  allOptions.forEach(opt => opt.disabled = true);
  
  if (selectedVal === correctVal) {
    clickedBtn.classList.add("correct");
    correctFbCount++;
    state.xp += 10;
  } else {
    clickedBtn.classList.add("incorrect");
    
    allOptions.forEach(opt => {
      if (opt.getAttribute("data-val") === correctVal) {
        opt.classList.add("correct");
      }
    });
  }
  
  saveState();
  
  setTimeout(() => {
    currentFbIndex++;
    if (currentFbIndex < activeFbQuestions.length) {
      renderFbQuestion();
    } else {
      finishFb();
    }
  }, 1600);
}

function finishFb() {
  const container = document.getElementById("fillblanks-content-area");
  if (!container) return;
  
  state.completedToday.flashcards = true;
  state.streak++;
  state.xp += 20;
  saveState();
  updateStreakBadge();
  
  container.innerHTML = `
    <div style="text-align: center; padding: 24px 10px; display:flex; flex-direction:column; align-items:center; gap:18px;">
      <div style="width: 64px; height: 64px; border-radius: 50%; display:flex; align-items:center; justify-content:center; border: 1px solid var(--color-border-primary); background-color: var(--color-background-secondary); color: var(--theme-teal);">
        <i class="ti ti-trophy" style="font-size:30px;"></i>
      </div>
      <div>
        <h2 style="font-size:19px; font-weight:700; margin:0 0 6px;">Egzersiz Tamamlandı!</h2>
        <p class="ts" style="font-size:13px; margin:0;">
          Boşluk doldurma alıştırmasını başarıyla tamamladınız.
        </p>
      </div>
      
      <div style="background: var(--color-background-secondary); border: 1px solid var(--color-border-primary); border-radius: var(--border-radius-lg); padding: 16px; width: 100%; display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin: 8px 0;">
        <div style="text-align:center; border-right: 1px solid var(--color-border-secondary);">
          <p class="ts" style="font-size:11px; margin:0 0 4px;">Doğru Cevap</p>
          <p style="font-size:18px; font-weight:700; margin:0; color:var(--theme-teal);">${correctFbCount} / 5</p>
        </div>
        <div style="text-align:center;">
          <p class="ts" style="font-size:11px; margin:0 0 4px;">Kazanılan XP</p>
          <p style="font-size:18px; font-weight:700; margin:0; color:var(--theme-teal);">+${correctFbCount * 10 + 20}</p>
        </div>
      </div>
      
      <div style="display:flex; align-items:center; gap:6px; font-size:12.5px; font-weight:600; color:var(--theme-purple);">
        <i class="ti ti-flame" style="font-size:16px;"></i> Seri: ${state.streak} Gün!
      </div>
      
      <button class="c-purple" style="width:100%; border:none; padding:12px; border-radius:var(--border-radius-lg); font-size:13.5px; font-weight:600; cursor:pointer; color:var(--color-background-primary); margin-top:10px;" id="fb-done-btn">
        Alıştırma Sayfasına Dön
      </button>
    </div>
  `;
  
  document.getElementById("fb-done-btn")?.addEventListener("click", () => {
    showScreen("exercises");
  });
}

// ═══════════════════════════════════════════
// VERBEN MIT PRÄPOSITIONEN DASHBOARD LOGIC
// ═══════════════════════════════════════════

function renderPrepDashboard() {
  // Counters calculation
  let notStarted = 0;
  let learning = 0;
  let learned = 0;
  
  VERBEN_PREP_DATA.forEach(item => {
    const key = `${item.verb}_${item.prep}`;
    const score = state.prepScores[key] || 0;
    if (score === 0) notStarted++;
    else if (score <= 2) learning++;
    else learned++;
  });
  
  document.getElementById("stat-not-started").textContent = notStarted;
  document.getElementById("stat-learning").textContent = learning;
  document.getElementById("stat-learned").textContent = learned;
  
  filterPrepList();
}

function filterPrepList() {
  const levelVal = document.getElementById("filter-level").value;
  const kasusVal = document.getElementById("filter-kasus").value;
  const query = document.getElementById("prep-search").value.trim().toLowerCase();
  
  const container = document.getElementById("prep-words-list");
  if (!container) return;
  
  container.innerHTML = "";
  
  // Filtering combinations
  const filtered = VERBEN_PREP_DATA.filter(item => {
    // Level check
    if (levelVal === "a1a2" && item.level !== "A1" && item.level !== "A2") return false;
    if (levelVal === "b1" && item.level !== "B1") return false;
    if (levelVal === "b2" && item.level !== "B2") return false;
    
    // Case check
    if (kasusVal !== "all" && item.kasus !== kasusVal) return false;
    
    // Search query check
    if (query) {
      const v = item.verb.toLowerCase();
      const p = item.prep.toLowerCase();
      const m = item.meaning.toLowerCase();
      if (!v.includes(query) && !p.includes(query) && !m.includes(query)) return false;
    }
    
    return true;
  });
  
  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--color-text-tertiary); font-size:13px; font-style:italic;">Kriterlere uygun kelime bulunamadı.</div>`;
    return;
  }
  
  // Render cards
  filtered.forEach(item => {
    const key = `${item.verb}_${item.prep}`;
    const score = state.prepScores[key] || 0;
    const isStarred = state.starredPreps.includes(key);
    
    let stateText = "Başlanmamış";
    let stateClass = "not-started";
    if (score > 0 && score <= 2) {
      stateText = "Öğreniliyor";
      stateClass = "learning";
    } else if (score >= 3) {
      stateText = "Öğrenildi";
      stateClass = "learned";
    }
    
    const card = document.createElement("div");
    card.className = "verb-list-item";
    card.innerHTML = `
      <div class="verb-list-item-header">
        <div class="verb-tags-group">
          <span class="verb-tag" style="background-color: var(--color-background-primary); font-weight:700;">${item.level}</span>
          <span class="verb-tag">${item.kasus === 'Dat' ? 'Dativ' : 'Akkusativ'}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="stat-badge ${stateClass}">${stateText}</span>
          <i class="ti ${isStarred ? 'ti-star-filled starred' : 'ti-star'} star-icon" data-key="${key}"></i>
        </div>
      </div>
      
      <p style="font-size:14.5px; font-weight:600; margin: 0 0 4px; color:var(--color-text-primary);">
        ${item.verb} <span style="color:var(--theme-purple); font-weight:700;">+ ${item.prep}</span>
      </p>
      <p class="ts" style="font-size:12px; margin: 0 0 8px;">${item.meaning}</p>
      
      <div style="border-top:1px solid var(--color-border-secondary); padding-top:6px; margin-top:6px; font-size:11.5px; line-height:1.5;">
        <p style="color:var(--color-text-secondary);"><i class="ti ti-notes" style="font-size:12px; margin-right:4px;"></i>${item.example}</p>
        <p class="ts" style="font-size:11px; margin-top:2px; font-style:italic;">${item.translation}</p>
      </div>
    `;
    
    // Star click event
    card.querySelector(".star-icon").addEventListener("click", (e) => {
      e.stopPropagation();
      const starredIdx = state.starredPreps.indexOf(key);
      if (starredIdx > -1) {
        state.starredPreps.splice(starredIdx, 1);
        e.target.className = "ti ti-star star-icon";
      } else {
        state.starredPreps.push(key);
        e.target.className = "ti ti-star-filled starred star-icon";
      }
      saveState();
      renderPrepDashboard(); // refresh counts
    });
    
    container.appendChild(card);
  });
}

// ═══════════════════════════════════════════
// VERBEN MIT PRÄPOSITIONEN QUIZ PLAY ENGINE
// ═══════════════════════════════════════════

let activePrepQuizQuestions = [];
let currentPrepQuizIdx = 0;
let correctPrepQuizScore = 0;
let currentPrepQuestionObj = {};
let prapAnswered = false;

// Web Speech Synthesis TTS Speaker helper
function speakGerman(text) {
  if ('speechSynthesis' in window) {
    // Cancel ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    
    // Try to select a German voice
    const voices = window.speechSynthesis.getVoices();
    const deVoice = voices.find(v => v.lang.includes('de-') || v.lang.includes('DE'));
    if (deVoice) {
      utterance.voice = deVoice;
    }
    window.speechSynthesis.speak(utterance);
  }
}

// Load voices once available (specifically for Chrome/mobile support)
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {};
}

function startNewPrepQuiz() {
  const levelVal = document.getElementById("filter-level").value;
  const kasusVal = document.getElementById("filter-kasus").value;
  
  // Filter vocabulary pool matching current selectors
  const pool = VERBEN_PREP_DATA.filter(item => {
    if (levelVal === "a1a2" && item.level !== "A1" && item.level !== "A2") return false;
    if (levelVal === "b1" && item.level !== "B1") return false;
    if (levelVal === "b2" && item.level !== "B2") return false;
    if (kasusVal !== "all" && item.kasus !== kasusVal) return false;
    return true;
  });
  
  if (pool.length === 0) {
    alert("Seçtiğiniz filtrelere uygun kelime bulunamadı. Lütfen filtrelerinizi genişletin!");
    return;
  }
  
  showScreen("verben-prep-quiz");
  
  // Weighted Random Selection: prioritizes unlearned and starred items
  // weight formula: base score weight + star bonus
  const weightedPool = pool.map(item => {
    const key = `${item.verb}_${item.prep}`;
    const score = state.prepScores[key] || 0;
    const isStarred = state.starredPreps.includes(key);
    
    let weight = 100; // Not started weight
    if (score === 1) weight = 80;
    else if (score === 2) weight = 60;
    else if (score >= 3) weight = 10; // Already learned weight
    
    if (isStarred) weight += 50; // Starred bonus
    
    return { item, weight };
  });
  
  // Pick 10 items based on weights
  activePrepQuizQuestions = [];
  const countToPick = Math.min(10, pool.length);
  
  for (let step = 0; step < countToPick; step++) {
    const totalWeight = weightedPool.reduce((acc, curr) => acc + curr.weight, 0);
    let randomNum = Math.random() * totalWeight;
    
    let selectedIdx = 0;
    for (let idx = 0; idx < weightedPool.length; idx++) {
      randomNum -= weightedPool[idx].weight;
      if (randomNum <= 0) {
        selectedIdx = idx;
        break;
      }
    }
    
    // Add item and remove from pool to prevent duplicates
    activePrepQuizQuestions.push(weightedPool[selectedIdx].item);
    weightedPool.splice(selectedIdx, 1);
  }
  
  currentPrepQuizIdx = 0;
  correctPrepQuizScore = 0;
  prapAnswered = false;
  
  renderPrepQuizQuestion();
}

function renderPrepQuizQuestion() {
  const container = document.getElementById("verben-prep-quiz-content");
  if (!container) return;
  
  const q = activePrepQuizQuestions[currentPrepQuizIdx];
  const pct = Math.round(currentPrepQuizIdx / activePrepQuizQuestions.length * 100);
  
  // Choose question type dynamically (0, 1, or 2)
  const qType = currentPrepQuizIdx % 3;
  let qHTML = "";
  let choices = [];
  let correctChoice = "";
  
  const allPrepositions = [...new Set(VERBEN_PREP_DATA.map(v => v.prep))];
  
  if (qType === 0) {
    // Type 0: Fill preposition blank in German example sentence
    const prepsToHide = getWordsToReplace(q.prep);
    // Hide matching prepositions in the sentence
    const maskedSentence = q.example.replace(new RegExp('\\b(' + prepsToHide.join('|') + ')\\b', 'gi'), '___');
    
    // Draw 3 distractors
    const distractors = allPrepositions.filter(p => p !== q.prep).sort(() => 0.5 - Math.random()).slice(0, 3);
    choices = [...distractors, q.prep].sort(() => 0.5 - Math.random());
    correctChoice = q.prep;
    
    qHTML = `
      <div class="qtype">Cümledeki boşluğa uygun edatı seçin</div>
      <div class="qsent" style="font-size: 15.5px; font-weight:600; text-align:center; padding: 16px; border: 1px solid var(--color-border-primary); border-radius: var(--border-radius-lg); background-color: var(--color-background-secondary); margin-bottom:20px; line-height:1.6;">
        ${maskedSentence.replace('___', '<span style="border-bottom: 2px solid var(--theme-purple); padding: 0 8px; color: var(--theme-purple);">___</span>')}
      </div>
    `;
  } else if (qType === 1) {
    // Type 1: Meaning matching (Verb + Prep -> Meaning)
    const distractors = VERBEN_PREP_DATA.filter(v => v.verb !== q.verb).sort(() => 0.5 - Math.random()).slice(0, 3);
    choices = [...distractors.map(d => d.meaning), q.meaning].sort(() => 0.5 - Math.random());
    correctChoice = q.meaning;
    
    qHTML = `
      <div class="qtype">Fiilin Türkçe karşılığı nedir?</div>
      <div class="qsent" style="font-size: 18px; font-weight:700; text-align:center; padding: 18px; border: 1px solid var(--color-border-primary); border-radius: var(--border-radius-lg); background-color: var(--color-background-secondary); margin-bottom:20px;">
        ${q.verb} <span style="color:var(--theme-purple);">+ ${q.prep}</span>
      </div>
    `;
  } else {
    // Type 2: Verb + Prep matching (Meaning -> Verb + Prep)
    const distractors = VERBEN_PREP_DATA.filter(v => v.verb !== q.verb || v.prep !== q.prep).sort(() => 0.5 - Math.random()).slice(0, 3);
    choices = [...distractors.map(d => `${d.verb} + ${d.prep}`), `${q.verb} + ${q.prep}`].sort(() => 0.5 - Math.random());
    correctChoice = `${q.verb} + ${q.prep}`;
    
    qHTML = `
      <div class="qtype">Belirtilen anlama uygun fiil + edat hangisidir?</div>
      <div class="qsent" style="font-size: 16px; font-weight:600; text-align:center; padding: 18px; border: 1px solid var(--color-border-primary); border-radius: var(--border-radius-lg); background-color: var(--color-background-secondary); margin-bottom:20px;">
        "${q.meaning}"
      </div>
    `;
  }
  
  currentPrepQuestionObj = {
    correct: correctChoice,
    example: q.example,
    translation: q.translation,
    verb: q.verb,
    prep: q.prep
  };
  prapAnswered = false;
  
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px;">
      <span class="ts" style="font-size:12.5px; font-weight:500;">Soru ${currentPrepQuizIdx + 1} / ${activePrepQuizQuestions.length}</span>
      <div style="width: 80px; height: 5px; background: var(--color-border-primary); border-radius: 99px; overflow:hidden;">
        <div style="width: ${pct}%; height:100%; background: var(--theme-purple); border-radius:99px;"></div>
      </div>
    </div>
    
    <div style="display:flex; flex-direction:column; flex:1;">
      ${qHTML}
      
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom: 16px;" id="prap-choices-area">
        ${choices.map(c => `
          <button class="quiz-option" data-val="${c.replace(/"/g, '&quot;')}">
            <span>${c}</span>
            <i class="ti ti-circle" style="font-size:16px; color:var(--color-text-tertiary); flex-shrink:0; margin-left:8px;"></i>
          </button>
        `).join("")}
      </div>
      
      <div id="prap-feedback-box"></div>
    </div>
  `;
  
  // Bind choice actions
  const options = container.querySelectorAll("#prap-choices-area button");
  options.forEach(btn => {
    btn.addEventListener("click", () => {
      handlePrepQuizAnswer(btn, options);
    });
  });
}

function handlePrepQuizAnswer(clickedBtn, allOptions) {
  if (prapAnswered) return;
  prapAnswered = true;
  
  const chosen = clickedBtn.getAttribute("data-val");
  const correct = currentPrepQuestionObj.correct;
  const isOk = chosen === correct;
  
  if (isOk) correctPrepQuizScore++;
  
  // Update score in local state
  const q = activePrepQuizQuestions[currentPrepQuizIdx];
  const key = `${q.verb}_${q.prep}`;
  let score = state.prepScores[key] || 0;
  
  if (isOk) {
    score = Math.min(5, score + 1);
  } else {
    score = Math.max(-2, score - 2);
  }
  state.prepScores[key] = score;
  saveState();
  
  // Highlight options
  allOptions.forEach(opt => {
    opt.disabled = true;
    const val = opt.getAttribute("data-val");
    if (val === correct) {
      opt.classList.add("correct");
      opt.querySelector("i").className = "ti ti-circle-check-filled";
    } else if (val === chosen && !isOk) {
      opt.classList.add("incorrect");
      opt.querySelector("i").className = "ti ti-circle-x-filled";
    }
  });
  
  // Speak the example sentence in German
  speakGerman(currentPrepQuestionObj.example);
  
  // Render feedback details card
  const feedback = document.getElementById("prap-feedback-box");
  feedback.innerHTML = `
    <div style="background-color: var(--color-background-secondary); border: 1px solid var(--color-border-primary); border-radius: var(--border-radius-lg); padding: 14px; margin-bottom: 16px; border-left: 3px solid ${isOk ? 'var(--theme-teal)' : 'var(--theme-coral)'};">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
        <span style="font-size:12.5px; font-weight:700; color: ${isOk ? 'var(--theme-teal)' : 'var(--theme-coral)'};">
          ${isOk ? '✓ Doğru Cevap!' : '✗ Yanlış Cevap'}
        </span>
        <button onclick="speakGerman('${currentPrepQuestionObj.example.replace(/'/g, "\\'")}')" style="background:none; border:none; color:var(--color-text-secondary); cursor:pointer; display:flex; align-items:center; justify-content:center; padding: 2px;" title="Tekrar Dinle">
          <i class="ti ti-volume" style="font-size:16px;"></i>
        </button>
      </div>
      <p style="font-size:13px; font-weight:600; margin:0 0 4px; color:var(--color-text-primary); line-height:1.5;">${currentPrepQuestionObj.example}</p>
      <p class="ts" style="font-size:11.5px; margin:0; font-style:italic;">${currentPrepQuestionObj.translation}</p>
    </div>
    
    <button class="c-purple" style="width:100%; border:none; padding:12px; border-radius:var(--border-radius-lg); font-size:13.5px; font-weight:600; cursor:pointer; color:var(--color-background-primary);" id="next-prep-q-btn">
      ${currentPrepQuizIdx + 1 >= activePrepQuizQuestions.length ? 'Sonuçları Gör' : 'Sonraki Soru →'}
    </button>
  `;
  
  document.getElementById("next-prep-q-btn")?.addEventListener("click", () => {
    currentPrepQuizIdx++;
    if (currentPrepQuizIdx < activePrepQuizQuestions.length) {
      renderPrepQuizQuestion();
    } else {
      finishPrepQuiz();
    }
  });
}

function finishPrepQuiz() {
  const container = document.getElementById("verben-prep-quiz-content");
  if (!container) return;
  
  state.completedToday.quiz = true;
  state.streak++;
  state.xp += 30; // +30 XP complete bonus
  saveState();
  updateStreakBadge();
  
  const pct = Math.round(correctPrepQuizScore / activePrepQuizQuestions.length * 100);
  
  container.innerHTML = `
    <div style="text-align: center; padding: 24px 10px; display:flex; flex-direction:column; align-items:center; gap:18px;">
      <div style="width: 64px; height: 64px; border-radius: 50%; display:flex; align-items:center; justify-content:center; border: 1px solid var(--color-border-primary); background-color: var(--color-background-secondary); color: var(--theme-purple);">
        <i class="ti ti-checklist" style="font-size:30px;"></i>
      </div>
      <div>
        <h2 style="font-size:19px; font-weight:700; margin:0 0 6px;">Alıştırma Bitti!</h2>
        <p class="ts" style="font-size:13px; margin:0;">
          Edat alıştırma setini tamamladınız.
        </p>
      </div>
      
      <div style="background: var(--color-background-secondary); border: 1px solid var(--color-border-primary); border-radius: var(--border-radius-lg); padding: 16px; width: 100%; display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin: 8px 0;">
        <div style="text-align:center; border-right: 1px solid var(--color-border-secondary);">
          <p class="ts" style="font-size:11px; margin:0 0 4px;">Başarı Oranı</p>
          <p style="font-size:18px; font-weight:700; margin:0; color:var(--theme-purple);">${pct}%</p>
          <p class="ts" style="font-size:9.5px; margin:2px 0 0;">${correctPrepQuizScore} / ${activePrepQuizQuestions.length} Doğru</p>
        </div>
        <div style="text-align:center;">
          <p class="ts" style="font-size:11px; margin:0 0 4px;">Kazanılan XP</p>
          <p style="font-size:18px; font-weight:700; margin:0; color:var(--theme-teal);">+${correctPrepQuizScore * 10 + 30}</p>
          <p class="ts" style="font-size:9.5px; margin:2px 0 0;">Tamamlama Bonusu</p>
        </div>
      </div>
      
      <div style="display:flex; align-items:center; gap:6px; font-size:12.5px; font-weight:600; color:var(--theme-purple);">
        <i class="ti ti-flame" style="font-size:16px;"></i> Seri: ${state.streak} Gün!
      </div>
      
      <button class="c-purple" style="width:100%; border:none; padding:12px; border-radius:var(--border-radius-lg); font-size:13.5px; font-weight:600; cursor:pointer; color:var(--color-background-primary); margin-top:10px;" id="prep-quiz-done-btn">
        Prepozisyon Sayfasına Dön
      </button>
    </div>
  `;
  
  document.getElementById("prep-quiz-done-btn")?.addEventListener("click", () => {
    showScreen("verben-prep-dashboard");
  });
}

// Helper: inflection rules for masking prepositions in sentence
function getWordsToReplace(p) {
  const arr = [p, 'da'+p, 'dar'+p, 'wo'+p, 'wor'+p];
  if(p==='zu') arr.push('zum','zur');
  if(p==='an') arr.push('am','ans');
  if(p==='in') arr.push('im','ins');
  if(p==='von') arr.push('vom');
  if(p==='bei') arr.push('beim');
  return arr.sort((a,b)=>b.length-a.length);
}

// Utility lesson counters
function countTotalLessons() {
  let count = 0;
  LESSONS_DATA.forEach(cat => {
    cat.subcategories.forEach(sub => {
      count += sub.lessons.length;
    });
  });
  return count;
}

// ================= LESEVERSTEHEN GAME ENGINE =================

let activeLeseverstehenGame = null;
let leseverstehenSubmitted = false;
let leseverstehenTimerInterval = null;

function renderLeseverstehenDashboard() {
  const dbTitle = document.getElementById("leseverstehen-dashboard-title");
  if (dbTitle) {
    dbTitle.textContent = `Okuma Anlama · Teil ${state.activeLeseverstehenPart}`;
  }

  const cardsGrid = document.getElementById("leseverstehen-cards-grid");
  if (!cardsGrid) return;
  
  cardsGrid.innerHTML = "";
  
  let completedCount = 0;
  
  LESEVERSTEHEN_DATA.forEach(ex => {
    const attempts = state.leseverstehenProgress[ex.id] || [];
    const attemptCount = attempts.length;
    
    // Check if completed (has at least one attempt with score > 0)
    if (attemptCount > 0) {
      completedCount++;
    }
    
    const card = document.createElement("div");
    card.className = "leseverstehen-card";
    card.onclick = () => startNewLeseverstehen(ex.id);
    
    // Render 3 history badges
    let badgesHtml = "";
    for (let i = 0; i < 3; i++) {
      if (i < attemptCount) {
        const attempt = attempts[i];
        let scoreClass = "score-low";
        if (attempt.score >= 80) scoreClass = "score-high";
        else if (attempt.score >= 40) scoreClass = "score-med";
        
        badgesHtml += `<span class="leseverstehen-badge-circle ${scoreClass}" title="${Math.floor(attempt.duration / 60)}:${(attempt.duration % 60).toString().padStart(2, '0')} dak">${attempt.score}</span>`;
      } else {
        badgesHtml += `<span class="leseverstehen-badge-circle">-</span>`;
      }
    }
    
    let attemptsLabel = "Deneme yapılmadı";
    if (attemptCount > 0) {
      const lastAttempt = attempts[attempts.length - 1];
      const mins = Math.floor(lastAttempt.duration / 60);
      const secs = lastAttempt.duration % 60;
      const timeStr = `${mins}:${secs.toString().padStart(2, '0')} dk`;
      attemptsLabel = `${attemptCount} deneme • ${timeStr}`;
    }
    
    const colors = ["c-blue-bg", "c-purple-bg", "c-teal-bg", "c-coral-bg", "c-pink-bg"];
    const colorClass = colors[LESEVERSTEHEN_DATA.indexOf(ex) % colors.length];
    
    card.innerHTML = `
      <div class="leseverstehen-card-icon-wrapper ${colorClass}">
        <span class="leseverstehen-card-emoji">${ex.emoji}</span>
      </div>
      <div class="leseverstehen-card-details">
        <p class="leseverstehen-card-title">${ex.title}</p>
        <p class="leseverstehen-card-attempts">${attemptsLabel}</p>
      </div>
      <div class="leseverstehen-card-badges">
        ${badgesHtml}
      </div>
    `;
    
    cardsGrid.appendChild(card);
  });
  
  // Update overall progress stats
  const totalCount = LESEVERSTEHEN_DATA.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  document.getElementById("leseverstehen-progress-percent").textContent = `${progressPercent}%`;
  document.getElementById("leseverstehen-progress-fill").style.width = `${progressPercent}%`;
  document.getElementById("leseverstehen-progress-count").textContent = `${completedCount}/${totalCount} tamamlandı`;
}

function startNewLeseverstehen(exerciseId) {
  const ex = LESEVERSTEHEN_DATA.find(item => item.id === exerciseId);
  if (!ex) return;
  
  activeLeseverstehenGame = ex;
  leseverstehenSubmitted = false;
  state.leseverstehenAnswers = {};
  
  // Set play screen title
  const playTitle = document.getElementById("leseverstehen-play-title");
  if (playTitle) {
    playTitle.textContent = ex.title;
  }
  
  // Setup timer in state
  state.leseverstehenStartTime = Date.now();
  saveState();
  
  // Start header timer interval
  if (leseverstehenTimerInterval) {
    clearInterval(leseverstehenTimerInterval);
  }
  
  const timerDisplay = document.getElementById("leseverstehen-timer-display");
  if (timerDisplay) {
    timerDisplay.innerHTML = `<i class="ti ti-clock"></i> 00:00`;
  }
  
  leseverstehenTimerInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - state.leseverstehenStartTime) / 1000);
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    if (timerDisplay) {
      timerDisplay.innerHTML = `<i class="ti ti-clock"></i> ${mins}:${secs}`;
    }
  }, 1000);
  
  showScreen("leseverstehen-play");
}

function renderLeseverstehenScreen() {
  if (!activeLeseverstehenGame) return;
  
  const exercise = activeLeseverstehenGame;
  const isTeil2 = exercise.type === "teil2";
  const isTeil3 = exercise.type === "teil3";
  
  // Set instruction
  document.getElementById("leseverstehen-instruction-text").textContent = exercise.instruction;
  
  // Toggle containers
  const t1Container = document.getElementById("leseverstehen-t1-container");
  const t2Container = document.getElementById("leseverstehen-t2-container");
  const t3Container = document.getElementById("leseverstehen-t3-container");
  
  // Set dynamic tips
  const tipsContent = document.getElementById("leseverstehen-tips-content");
  if (tipsContent) {
    if (isTeil2) {
      tipsContent.innerHTML = `
        <p>1. Önce <b>metni (Artikel)</b> dikkatlice okuyun ve ana fikri anlayın.</p>
        <p>2. Ardından <b>soruları (6-10)</b> sırayla okuyun. Her sorunun cevabı metinde bulunabilir.</p>
        <p>3. Her soru için üç seçenek (a, b, c) vardır. <b>Yalnızca biri doğrudur.</b></p>
        <p>4. Metindeki anahtar cümleleri bularak doğru seçeneği işaretleyin.</p>
      `;
    } else if (isTeil3) {
      tipsContent.innerHTML = `
        <p>1. Önce <b>durumları (11-20)</b> dikkatlice okuyun ve anahtar ihtiyaçları belirleyin.</p>
        <p>2. Ardından <b>ilanları (a-l)</b> okuyun. Her ilanda ne sunulduğunu not edin.</p>
        <p>3. Her ilan <b>yalnızca bir kez</b> kullanılabilir. Uygun ilan yoksa <b>X</b> işaretleyin.</p>
        <p>4. Tarihlere, saatlere ve özel koşullara dikkat edin!</p>
      `;
    } else {
      tipsContent.innerHTML = `
        <p>1. Önce <b>başlıkları (a-j)</b> dikkatlice okuyun ve anahtar kelimeleri belirleyin.</p>
        <p>2. Ardından <b>metinleri (1-5)</b> okuyun. Her metinde neyin anlatıldığını özetleyen anahtar kelimeleri bulun.</p>
        <p>3. Her başlık <b>yalnızca bir kez</b> kullanılabilir. Eşleştirdiğiniz başlıkları cevap formunda işaretleyin.</p>
        <p>4. Emin olmadığınız durumlarda eleme yöntemini kullanın.</p>
      `;
    }
  }
  
  if (isTeil2) {
    // === Teil 2: Article + Multiple Choice ===
    if (t1Container) t1Container.classList.add("hidden");
    if (t2Container) t2Container.classList.remove("hidden");
    if (t3Container) t3Container.classList.add("hidden");
    
    // Render article text
    const articleEl = document.getElementById("leseverstehen-t2-article");
    if (articleEl) {
      articleEl.textContent = exercise.text;
    }
    
    // Render questions list
    const questionsList = document.getElementById("leseverstehen-t2-questions-list");
    questionsList.innerHTML = "";
    
    (exercise.questions || []).forEach(q => {
      const card = document.createElement("div");
      card.className = "interactive-card";
      card.style = "padding: 16px; border-radius: var(--border-radius-lg); position: relative; border-left: 3px solid var(--theme-purple); background: var(--color-background-secondary); border-top: 1px solid var(--color-border-primary); border-right: 1px solid var(--color-border-primary); border-bottom: 1px solid var(--color-border-primary);";
      
      const userAns = state.leseverstehenAnswers[q.id];
      const correctAns = exercise.answers[String(q.id)];
      
      let optionsHtml = "";
      ["a", "b", "c"].forEach(opt => {
        const optText = q.options[opt] || "";
        const isSelected = userAns === opt;
        let optClass = "leseverstehen-t2-option";
        if (leseverstehenSubmitted) {
          if (opt === correctAns) optClass += " correct";
          else if (isSelected && opt !== correctAns) optClass += " incorrect";
        } else if (isSelected) {
          optClass += " selected";
        }
        optionsHtml += `
          <div class="${optClass}" data-qid="${q.id}" data-opt="${opt}">
            <span class="option-letter-circle">${opt}</span>
            <span>${optText}</span>
          </div>
        `;
      });
      
      let feedbackHtml = "";
      if (leseverstehenSubmitted) {
        if (userAns === correctAns) {
          feedbackHtml = `<div class="text-feedback-badge correct"><i class="ti ti-circle-check"></i> Doğru (${correctAns})</div>`;
        } else {
          feedbackHtml = `<div class="text-feedback-badge incorrect"><i class="ti ti-circle-x"></i> Yanlış (Seçiminiz: ${userAns || 'Boş'}, Doğru: ${correctAns})</div>`;
        }
        if (exercise.explanations && exercise.explanations[String(q.id)]) {
          feedbackHtml += `<div style="margin-top:8px;font-size:11px;color:var(--color-text-secondary);line-height:1.4;border-top:1px dashed var(--color-border-secondary);padding-top:6px;"><i class="ti ti-bulb" style="color:var(--theme-purple);font-size:13px;margin-right:2px;"></i> ${exercise.explanations[String(q.id)]}</div>`;
        }
      }
      
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <span class="bubble-row-num" style="width:22px;height:22px;font-size:11px;">${q.id}</span>
          <span style="font-size:12.5px;font-weight:600;color:var(--color-text-primary);">${q.question}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;">${optionsHtml}</div>
        ${feedbackHtml}
      `;
      questionsList.appendChild(card);
    });
    
    if (!leseverstehenSubmitted) {
      questionsList.querySelectorAll(".leseverstehen-t2-option").forEach(el => {
        el.addEventListener("click", () => {
          selectBubbleAnswer(parseInt(el.getAttribute("data-qid")), el.getAttribute("data-opt"));
        });
      });
    }
    
  } else if (isTeil3) {
    // === Teil 3: Situation-to-Ad Matching (11-20, a-l + x) ===
    if (t1Container) t1Container.classList.add("hidden");
    if (t2Container) t2Container.classList.add("hidden");
    if (t3Container) t3Container.classList.remove("hidden");
    
    // Render situations list (11-20)
    const situationsList = document.getElementById("leseverstehen-t3-situations-list");
    situationsList.innerHTML = "";
    
    Object.entries(exercise.situations).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).forEach(([num, desc]) => {
      const qNum = parseInt(num);
      const userAns = state.leseverstehenAnswers[qNum];
      const correctAns = exercise.answers[String(qNum)];
      
      let feedbackHtml = "";
      if (leseverstehenSubmitted) {
        if (userAns === correctAns) {
          const adTitle = correctAns === 'x' ? 'X (Uygun ilan yok)' : (exercise.ads[correctAns] ? exercise.ads[correctAns].title : correctAns.toUpperCase());
          feedbackHtml = `<div class="text-feedback-badge correct" style="margin-top:6px;"><i class="ti ti-circle-check"></i> Doğru → ${correctAns.toUpperCase()}: ${adTitle}</div>`;
        } else {
          const correctAdTitle = correctAns === 'x' ? 'X (Uygun ilan yok)' : (exercise.ads[correctAns] ? exercise.ads[correctAns].title : correctAns.toUpperCase());
          feedbackHtml = `<div class="text-feedback-badge incorrect" style="margin-top:6px;"><i class="ti ti-circle-x"></i> Yanlış → Seçiminiz: ${userAns ? userAns.toUpperCase() : 'Boş'} | Doğru: ${correctAns.toUpperCase()}: ${correctAdTitle}</div>`;
        }
        if (exercise.explanations && exercise.explanations[String(qNum)]) {
          feedbackHtml += `<div style="margin-top:6px;font-size:11px;color:var(--color-text-secondary);line-height:1.4;"><i class="ti ti-bulb" style="color:var(--theme-purple);font-size:13px;margin-right:2px;"></i> ${exercise.explanations[String(qNum)]}</div>`;
        }
      }
      
      const row = document.createElement("div");
      row.style = "padding: 10px 12px; border-radius: var(--border-radius-md); border: 1px solid var(--color-border-primary); background: var(--color-background-secondary); font-size: 12.5px; line-height: 1.5;";
      if (userAns && !leseverstehenSubmitted) row.style.borderColor = "var(--theme-purple)";
      if (leseverstehenSubmitted && userAns === correctAns) row.style.borderColor = "#10b981";
      if (leseverstehenSubmitted && userAns !== correctAns) row.style.borderColor = "#ef4444";
      
      row.innerHTML = `
        <div style="display:flex;align-items:flex-start;gap:8px;">
          <span class="bubble-row-num" style="width:22px;height:22px;font-size:10px;flex-shrink:0;margin-top:1px;">${qNum}</span>
          <div style="flex:1;">
            <p style="margin:0;color:var(--color-text-secondary);">${desc}</p>
            ${userAns ? `<p style="margin:4px 0 0;font-size:11px;font-weight:600;color:var(--theme-purple);">Seçili: ${userAns.toUpperCase()}${userAns !== 'x' && exercise.ads[userAns] ? ' – ' + exercise.ads[userAns].title : ''}</p>` : ''}
            ${feedbackHtml}
          </div>
        </div>
      `;
      situationsList.appendChild(row);
    });
    
    // Render ads grid (a-l)
    const adsGrid = document.getElementById("leseverstehen-t3-ads-grid");
    adsGrid.innerHTML = "";
    
    Object.entries(exercise.ads).sort((a, b) => a[0].localeCompare(b[0])).forEach(([letter, ad]) => {
      const isUsed = Object.values(state.leseverstehenAnswers).includes(letter);
      const card = document.createElement("div");
      card.style = `padding:12px;border-radius:var(--border-radius-md);border:1px solid var(--color-border-primary);background:var(--color-background-secondary);font-size:12px;line-height:1.5;position:relative;${isUsed && !leseverstehenSubmitted ? 'border-color:var(--theme-purple);opacity:0.7;' : ''}`;
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
          <span class="option-letter-circle" style="flex-shrink:0;">${letter}</span>
          <span style="font-size:12px;font-weight:700;color:var(--color-text-primary);line-height:1.3;">${ad.title}</span>
        </div>
        <p style="margin:0;color:var(--color-text-secondary);font-size:11px;line-height:1.5;">${ad.body}</p>
      `;
      adsGrid.appendChild(card);
    });
    
  } else {
    // === Teil 1: Heading Matching ===
    if (t1Container) t1Container.classList.remove("hidden");
    if (t2Container) t2Container.classList.add("hidden");
    if (t3Container) t3Container.classList.add("hidden");
    
    // Render Headings List
    const headingsList = document.getElementById("leseverstehen-headings-list");
    headingsList.innerHTML = "";
    Object.keys(exercise.headings).forEach(letter => {
      const card = document.createElement("div");
      card.className = "leseverstehen-heading-card";
      card.innerHTML = `<span class="leseverstehen-heading-letter">${letter})</span><span>${exercise.headings[letter]}</span>`;
      headingsList.appendChild(card);
    });
    
    // Render Texts List
    const textsList = document.getElementById("leseverstehen-texts-list");
    textsList.innerHTML = "";
    exercise.texts.forEach(text => {
      const card = document.createElement("div");
      card.className = "interactive-card";
      card.style = "padding: 16px; border-radius: var(--border-radius-lg); position: relative; border-left: 3px solid var(--theme-purple); background: var(--color-background-secondary); border-top: 1px solid var(--color-border-primary); border-right: 1px solid var(--color-border-primary); border-bottom: 1px solid var(--color-border-primary);";
      
      let feedbackHtml = "";
      if (leseverstehenSubmitted) {
        const userAns = state.leseverstehenAnswers[text.id];
        const correctAns = exercise.answers[text.id];
        if (userAns === correctAns) {
          feedbackHtml = `<div class="text-feedback-badge correct"><i class="ti ti-circle-check"></i> Doğru (Başlık ${correctAns.toUpperCase()})</div>`;
        } else {
          feedbackHtml = `<div class="text-feedback-badge incorrect"><i class="ti ti-circle-x"></i> Yanlış (Seçiminiz: ${userAns ? userAns.toUpperCase() : 'Boş'}, Doğru: ${correctAns.toUpperCase()})</div>`;
        }
      }
      
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span class="bubble-row-num" style="width:22px;height:22px;font-size:11px;">${text.id}</span>
          <span style="font-size:12.5px;font-weight:600;color:var(--color-text-primary);">Metin ${text.id}</span>
        </div>
        <p style="font-size:12.5px;line-height:1.6;margin:0;color:var(--color-text-secondary);text-align:justify;">${text.content}</p>
        ${feedbackHtml}
      `;
      textsList.appendChild(card);
    });
  }
  
  // Render Answer Sheet (Antwortbogen)
  renderAnswersSheet();
  
  // Setup Submit Button
  const submitBtn = document.getElementById("leseverstehen-submit-btn");
  if (submitBtn) {
    if (leseverstehenSubmitted) {
      submitBtn.innerHTML = '<i class="ti ti-check"></i> Alıştırmayı Tamamla';
      submitBtn.className = "c-teal";
      submitBtn.onclick = () => { showScreen("leseverstehen-dashboard"); };
    } else {
      submitBtn.innerHTML = '<i class="ti ti-send"></i> Cevapları Gönder';
      submitBtn.className = "c-purple";
      submitBtn.onclick = submitLeseverstehen;
    }
  }
}

function renderAnswersSheet() {
  if (!activeLeseverstehenGame) return;
  const exercise = activeLeseverstehenGame;
  const isTeil2 = exercise.type === "teil2";
  const isTeil3 = exercise.type === "teil3";
  const container = document.getElementById("leseverstehen-answers-sheet");
  container.innerHTML = "";
  
  if (isTeil3) {
    // Teil 3: Situations 11-20, bubbles a-l + x (13 options, split into rows)
    const situations = exercise.situations || {};
    const sortedNums = Object.keys(situations).sort((a, b) => parseInt(a) - parseInt(b));
    
    sortedNums.forEach(numStr => {
      const qNum = parseInt(numStr);
      const row = document.createElement("div");
      row.className = "bubble-grid-row";
      row.style = "display:flex;flex-direction:column;gap:8px;align-items:stretch;";
      
      const rowHeader = document.createElement("div");
      rowHeader.style = "display:flex;align-items:center;gap:8px;";
      rowHeader.innerHTML = `
        <span class="bubble-row-num">${qNum}</span>
        <span style="font-size:11.5px;font-weight:600;color:var(--color-text-primary);">Durum ${qNum}:</span>
      `;
      row.appendChild(rowHeader);
      
      const grid = document.createElement("div");
      grid.className = "bubble-grid-container";
      const row1 = document.createElement("div");
      row1.className = "bubble-buttons-grid";
      row1.style = "grid-template-columns: repeat(7, 1fr);";
      const row2 = document.createElement("div");
      row2.className = "bubble-buttons-grid";
      row2.style = "grid-template-columns: repeat(7, 1fr);";
      
      // a-l + x = 13 letters
      const letters = ["a","b","c","d","e","f","g","h","i","j","k","l","x"];
      const userAns = state.leseverstehenAnswers[qNum];
      const correctAns = exercise.answers[String(qNum)];
      
      letters.forEach((letter, idx) => {
        const btn = document.createElement("button");
        btn.className = "bubble-btn";
        btn.textContent = letter;
        if (letter === "x") btn.style.fontWeight = "700";
        
        const isSelected = userAns === letter;
        if (isSelected) btn.classList.add("selected");
        
        if (leseverstehenSubmitted) {
          btn.classList.add("disabled");
          if (letter === correctAns) btn.classList.add("correct");
          else if (isSelected && letter !== correctAns) btn.classList.add("incorrect");
        } else {
          btn.onclick = () => selectBubbleAnswer(qNum, letter);
        }
        
        if (idx < 7) row1.appendChild(btn);
        else row2.appendChild(btn);
      });
      
      grid.appendChild(row1);
      grid.appendChild(row2);
      row.appendChild(grid);
      container.appendChild(row);
    });
    
  } else if (isTeil2) {
    // Teil 2: Questions 6-10 with 3 bubbles (a, b, c)
    const questions = exercise.questions || [];
    questions.forEach(q => {
      const row = document.createElement("div");
      row.className = "bubble-grid-row";
      row.style = "display:flex;flex-direction:column;gap:8px;align-items:stretch;";
      
      const rowHeader = document.createElement("div");
      rowHeader.style = "display:flex;align-items:center;gap:8px;";
      rowHeader.innerHTML = `
        <span class="bubble-row-num">${q.id}</span>
        <span style="font-size:12px;font-weight:600;color:var(--color-text-primary);">Soru ${q.id} için cevap seçin:</span>
      `;
      row.appendChild(rowHeader);
      
      const grid = document.createElement("div");
      grid.className = "bubble-grid-container";
      const row1 = document.createElement("div");
      row1.className = "bubble-buttons-grid";
      row1.style = "grid-template-columns: repeat(3, 1fr);";
      
      const userAns = state.leseverstehenAnswers[q.id];
      ["a", "b", "c"].forEach(letter => {
        const btn = document.createElement("button");
        btn.className = "bubble-btn";
        btn.textContent = letter;
        const isSelected = userAns === letter;
        if (isSelected) btn.classList.add("selected");
        if (leseverstehenSubmitted) {
          btn.classList.add("disabled");
          const correctAns = exercise.answers[String(q.id)];
          if (letter === correctAns) btn.classList.add("correct");
          else if (isSelected && letter !== correctAns) btn.classList.add("incorrect");
        } else {
          btn.onclick = () => selectBubbleAnswer(q.id, letter);
        }
        row1.appendChild(btn);
      });
      
      grid.appendChild(row1);
      row.appendChild(grid);
      container.appendChild(row);
    });
  } else {
    // Teil 1: Texts 1-5 with 10 bubbles (a-j)
    exercise.texts.forEach(text => {
      const row = document.createElement("div");
      row.className = "bubble-grid-row";
      row.style = "display:flex;flex-direction:column;gap:8px;align-items:stretch;";
      
      const rowHeader = document.createElement("div");
      rowHeader.style = "display:flex;align-items:center;gap:8px;";
      rowHeader.innerHTML = `
        <span class="bubble-row-num">${text.id}</span>
        <span style="font-size:12px;font-weight:600;color:var(--color-text-primary);">Metin ${text.id} için başlık seçin:</span>
      `;
      row.appendChild(rowHeader);
      
      const grid = document.createElement("div");
      grid.className = "bubble-grid-container";
      const row1 = document.createElement("div");
      row1.className = "bubble-buttons-grid";
      const row2 = document.createElement("div");
      row2.className = "bubble-buttons-grid";
      
      const letters = ["a","b","c","d","e","f","g","h","i","j"];
      const userAns = state.leseverstehenAnswers[text.id];
      
      letters.forEach((letter, idx) => {
        const btn = document.createElement("button");
        btn.className = "bubble-btn";
        btn.textContent = letter;
        const isSelected = userAns === letter;
        if (isSelected) btn.classList.add("selected");
        if (leseverstehenSubmitted) {
          btn.classList.add("disabled");
          const correctAns = exercise.answers[text.id];
          if (letter === correctAns) btn.classList.add("correct");
          else if (isSelected && letter !== correctAns) btn.classList.add("incorrect");
        } else {
          btn.onclick = () => selectBubbleAnswer(text.id, letter);
        }
        if (idx < 5) row1.appendChild(btn);
        else row2.appendChild(btn);
      });
      
      grid.appendChild(row1);
      grid.appendChild(row2);
      row.appendChild(grid);
      container.appendChild(row);
    });
  }
  
  updateLeseverstehenStatus();
}

function selectBubbleAnswer(qNum, option) {
  if (leseverstehenSubmitted) return;
  
  const exerciseType = activeLeseverstehenGame && activeLeseverstehenGame.type;
  const isTeil1 = !exerciseType || exerciseType === 'teil1';
  
  // Unique choice enforcement: only for Teil 1 and Teil 3 (each heading/ad only once)
  // Teil 2 allows same choice for multiple questions
  if (isTeil1 || exerciseType === 'teil3') {
    Object.keys(state.leseverstehenAnswers).forEach(key => {
      if (state.leseverstehenAnswers[key] === option) {
        state.leseverstehenAnswers[key] = null;
      }
    });
  }
  
  // Toggle selection
  if (state.leseverstehenAnswers[qNum] === option) {
    state.leseverstehenAnswers[qNum] = null;
  } else {
    state.leseverstehenAnswers[qNum] = option;
  }
  
  saveState();
  renderLeseverstehenScreen();
}

function updateLeseverstehenStatus() {
  if (!activeLeseverstehenGame) return;
  const exercise = activeLeseverstehenGame;
  const isTeil2 = exercise.type === "teil2";
  const isTeil3 = exercise.type === "teil3";
  const statusText = document.getElementById("leseverstehen-status-text");
  
  // Build items and answer lookup based on type
  let items, totalCount;
  if (isTeil3) {
    items = Object.keys(exercise.situations || {}).map(k => ({ id: parseInt(k) }));
    totalCount = 10;
  } else if (isTeil2) {
    items = exercise.questions || [];
    totalCount = 5;
  } else {
    items = exercise.texts || [];
    totalCount = 5;
  }
  
  const getCorrectAns = (item) => {
    if (isTeil2) return exercise.answers[String(item.id)];
    if (isTeil3) return exercise.answers[String(item.id)];
    return exercise.answers[item.id];
  };
  
  const resultsSummary = document.getElementById("leseverstehen-results-summary");
  if (leseverstehenSubmitted) {
    let correctCount = 0;
    items.forEach(item => {
      if (state.leseverstehenAnswers[item.id] === getCorrectAns(item)) correctCount++;
    });
    
    const attempts = state.leseverstehenProgress[exercise.id] || [];
    const lastAttempt = attempts[attempts.length - 1];
    let timeFormatted = "--:--";
    if (lastAttempt) {
      const mins = Math.floor(lastAttempt.duration / 60);
      const secs = lastAttempt.duration % 60;
      timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    statusText.textContent = `Sonuç: ${correctCount}/${totalCount} Doğru! (+${correctCount * 10} XP)`;
    statusText.style.color = "#10b981";
    
    if (resultsSummary) {
      resultsSummary.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--border-radius-md); padding: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 13px; font-weight: 700; color: #10b981; display: flex; align-items: center; gap: 6px;">
              <i class="ti ti-circle-check"></i> Alıştırma Tamamlandı!
            </span>
            <span style="font-size: 11px; font-weight: 600; background: #10b981; color: #fff; padding: 2px 8px; border-radius: 99px;">
              +${correctCount * 10} XP
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--color-text-primary); margin-top: 4px; border-top: 1px solid var(--color-border-primary); padding-top: 6px;">
            <span>Doğruluk: <strong>${correctCount}/${totalCount}</strong></span>
            <span style="display: flex; align-items: center; gap: 4px;">
              <i class="ti ti-clock" style="color: var(--theme-coral);"></i> Süre: <strong>${timeFormatted}</strong>
            </span>
          </div>
        </div>
      `;
    }
    return;
  } else {
    if (resultsSummary) {
      resultsSummary.innerHTML = "";
    }
  }
  
  let answeredCount = 0;
  items.forEach(item => {
    if (state.leseverstehenAnswers[item.id]) answeredCount++;
  });
  
  const remaining = totalCount - answeredCount;
  if (remaining === 0) {
    statusText.textContent = "Bütün sorular cevaplandı. Cevapları gönderin!";
    statusText.style.color = "#98b5b6";
  } else {
    statusText.textContent = `${remaining} boş soru doldurulmayı bekliyor.`;
    statusText.style.color = "var(--theme-coral)";
  }
}

function submitLeseverstehen() {
  if (leseverstehenSubmitted) return;
  if (!activeLeseverstehenGame) return;
  const exercise = activeLeseverstehenGame;
  const isTeil2 = exercise.type === "teil2";
  const isTeil3 = exercise.type === "teil3";
  
  if (leseverstehenTimerInterval) {
    clearInterval(leseverstehenTimerInterval);
    leseverstehenTimerInterval = null;
  }
  
  const durationSeconds = Math.round((Date.now() - state.leseverstehenStartTime) / 1000);
  
  // Calculate correct answers
  let correctCount = 0;
  let items;
  if (isTeil3) {
    items = Object.keys(exercise.situations || {}).map(k => ({ id: parseInt(k) }));
    items.forEach(item => {
      if (state.leseverstehenAnswers[item.id] === exercise.answers[String(item.id)]) correctCount++;
    });
  } else if (isTeil2) {
    items = exercise.questions || [];
    items.forEach(item => {
      if (state.leseverstehenAnswers[item.id] === exercise.answers[String(item.id)]) correctCount++;
    });
  } else {
    items = exercise.texts || [];
    items.forEach(item => {
      if (state.leseverstehenAnswers[item.id] === exercise.answers[item.id]) correctCount++;
    });
  }
  
  leseverstehenSubmitted = true;
  state.xp += correctCount * 10;
  
  const scoreMultiplier = isTeil3 ? 10 : 20;
  const score = correctCount * scoreMultiplier;
  
  let attempts = state.leseverstehenProgress[exercise.id] || [];
  attempts.push({ score: score, duration: durationSeconds });
  if (attempts.length > 3) attempts.shift();
  state.leseverstehenProgress[exercise.id] = attempts;
  
  saveState();
  renderLeseverstehenScreen();
}

// ================= SPRACHBAUSTEINE GAME ENGINE =================

let activeSprachbausteineGame = null;
let sprachbausteineSubmitted = false;
let sprachbausteineTimerInterval = null;

function renderSprachbausteineDashboard() {
  const dbTitle = document.getElementById("sprachbausteine-dashboard-title");
  if (dbTitle) {
    dbTitle.textContent = `Kelime Yerleştirme · Teil ${state.activeSprachbausteinePart || 1}`;
  }

  const cardsGrid = document.getElementById("sprachbausteine-cards-grid");
  if (!cardsGrid) return;
  
  cardsGrid.innerHTML = "";
  
  let completedCount = 0;
  
  SPRACHBAUSTEINE_DATA.forEach(ex => {
    const attempts = state.sprachbausteineProgress[ex.id] || [];
    const attemptCount = attempts.length;
    
    if (attemptCount > 0) {
      completedCount++;
    }
    
    const card = document.createElement("div");
    card.className = "sprachbausteine-card";
    card.onclick = () => startNewSprachbausteine(ex.id);
    
    let badgesHtml = "";
    for (let i = 0; i < 3; i++) {
      if (i < attemptCount) {
        const attempt = attempts[i];
        let scoreClass = "score-low";
        if (attempt.score >= 80) scoreClass = "score-high";
        else if (attempt.score >= 40) scoreClass = "score-med";
        
        badgesHtml += `<span class="leseverstehen-badge-circle ${scoreClass}" title="${Math.floor(attempt.duration / 60)}:${(attempt.duration % 60).toString().padStart(2, '0')} dak">${attempt.score}</span>`;
      } else {
        badgesHtml += `<span class="leseverstehen-badge-circle">-</span>`;
      }
    }
    
    let attemptsLabel = "Deneme yapılmadı";
    if (attemptCount > 0) {
      const lastAttempt = attempts[attempts.length - 1];
      const mins = Math.floor(lastAttempt.duration / 60);
      const secs = lastAttempt.duration % 60;
      const timeStr = `${mins}:${secs.toString().padStart(2, '0')} dk`;
      attemptsLabel = `${attemptCount} deneme • ${timeStr}`;
    }
    
    const colors = ["c-blue-bg", "c-purple-bg", "c-teal-bg", "c-coral-bg", "c-pink-bg"];
    const colorClass = colors[SPRACHBAUSTEINE_DATA.indexOf(ex) % colors.length];
    
    card.innerHTML = `
      <div class="sprachbausteine-card-icon-wrapper ${colorClass}">
        <span class="sprachbausteine-card-emoji">${ex.emoji}</span>
      </div>
      <div class="sprachbausteine-card-details">
        <p class="sprachbausteine-card-title">${ex.title}</p>
        <p class="sprachbausteine-card-attempts">${attemptsLabel}</p>
      </div>
      <div class="sprachbausteine-card-badges">
        ${badgesHtml}
      </div>
    `;
    
    cardsGrid.appendChild(card);
  });
  
  const totalCount = SPRACHBAUSTEINE_DATA.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  document.getElementById("sprachbausteine-progress-percent").textContent = `${progressPercent}%`;
  document.getElementById("sprachbausteine-progress-fill").style.width = `${progressPercent}%`;
  document.getElementById("sprachbausteine-progress-count").textContent = `${completedCount}/${totalCount} tamamlandı`;
}

function startNewSprachbausteine(exerciseId) {
  const ex = SPRACHBAUSTEINE_DATA.find(item => item.id === exerciseId);
  if (!ex) return;
  
  activeSprachbausteineGame = ex;
  sprachbausteineSubmitted = false;
  state.sprachbausteineAnswers = {};
  
  const playTitle = document.getElementById("sprachbausteine-play-title");
  if (playTitle) {
    playTitle.textContent = ex.title;
  }
  
  state.sprachbausteineStartTime = Date.now();
  saveState();
  
  if (sprachbausteineTimerInterval) {
    clearInterval(sprachbausteineTimerInterval);
  }
  
  const timerDisplay = document.getElementById("sprachbausteine-timer-display");
  if (timerDisplay) {
    timerDisplay.innerHTML = `<i class="ti ti-clock"></i> 00:00`;
  }
  
  sprachbausteineTimerInterval = setInterval(() => {
    const elapsed = Math.round((Date.now() - state.sprachbausteineStartTime) / 1000);
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    if (timerDisplay) {
      timerDisplay.innerHTML = `<i class="ti ti-clock"></i> ${mins}:${secs}`;
    }
  }, 1000);
  
  showScreen("sprachbausteine-play");
}

function renderSprachbausteineScreen() {
  if (!activeSprachbausteineGame) return;
  
  const exercise = activeSprachbausteineGame;
  const isTeil2 = exercise.type === "teil2";
  
  const playTitle = document.getElementById("sprachbausteine-play-title");
  if (playTitle) {
    playTitle.textContent = exercise.title;
  }
  
  const instructionText = document.getElementById("sprachbausteine-instruction-text");
  if (instructionText) {
    instructionText.textContent = exercise.instruction || "Markieren Sie Ihre Lösungen für die Aufgaben 21–30 auf dem Antwortbogen.";
  }
  
  const letterContainer = document.querySelector(".letter-container");
  if (letterContainer) {
    let textHtml = exercise.text.replace(/\((\d+)\)/g, (match, num) => {
      const gapNum = parseInt(num);
      if (exercise.options[gapNum]) {
        const userAns = state.sprachbausteineAnswers[gapNum];
        let word = "";
        if (userAns && exercise.options[gapNum]) {
          word = " " + exercise.options[gapNum][userAns];
        }
        
        let statusClass = "";
        if (sprachbausteineSubmitted) {
          const correctAns = exercise.answers[gapNum];
          if (userAns === correctAns) {
            statusClass = " correct";
          } else {
            statusClass = " incorrect";
          }
        } else if (userAns) {
          statusClass = " selected";
        }
        
        return `<span class="gap-badge${statusClass}" data-gap="${gapNum}" onclick="scrollToGapCard(${gapNum})">(${gapNum})${word}</span>`;
      }
      return match;
    });
    
    letterContainer.innerHTML = textHtml;
  }
  
  const t1Container = document.getElementById("sprachbausteine-t1-container");
  const t2Container = document.getElementById("sprachbausteine-t2-container");
  
  if (isTeil2) {
    t1Container?.classList.add("hidden");
    t2Container?.classList.remove("hidden");
    
    // Render Word Bank grid (a-o)
    const wordbankGrid = document.getElementById("sprachbausteine-wordbank-grid");
    if (wordbankGrid) {
      wordbankGrid.innerHTML = "";
      
      const firstGap = Object.keys(exercise.options)[0];
      const wordBank = exercise.options[firstGap];
      
      Object.entries(wordBank).sort((a, b) => a[0].localeCompare(b[0])).forEach(([letter, word]) => {
        const isUsed = Object.values(state.sprachbausteineAnswers).includes(letter);
        const card = document.createElement("div");
        card.style = `padding: 10px; border-radius: var(--border-radius-md); border: 1px solid var(--color-border-primary); background: var(--color-background-secondary); font-size: 11.5px; display: flex; align-items: center; gap: 8px; ${isUsed && !sprachbausteineSubmitted ? 'opacity: 0.5; border-color: var(--theme-purple);' : ''}`;
        
        card.innerHTML = `
          <span class="option-letter-circle" style="width: 20px; height: 20px; font-size: 10px; flex-shrink: 0; margin-bottom: 0;">${letter}</span>
          <span style="font-weight: 600; color: var(--color-text-primary); text-transform: uppercase;">${word}</span>
        `;
        wordbankGrid.appendChild(card);
      });
    }
  } else {
    t1Container?.classList.remove("hidden");
    t2Container?.classList.add("hidden");
    
    const optionsContainer = document.getElementById("sprachbausteine-options-container");
    if (optionsContainer) {
      optionsContainer.innerHTML = "";
      
      const gapsList = Object.keys(exercise.options).sort((a, b) => parseInt(a) - parseInt(b));
      gapsList.forEach(gapStr => {
        const gapNum = parseInt(gapStr);
        const card = document.createElement("div");
        card.className = "sprachbausteine-option-card";
        card.id = `sprachbausteine-option-card-${gapNum}`;
        
        if (sprachbausteineSubmitted) {
          const userAns = state.sprachbausteineAnswers[gapNum];
          const correctAns = exercise.answers[gapNum];
          if (userAns === correctAns) {
            card.style.borderColor = "#10b981";
          } else {
            card.style.borderColor = "var(--theme-coral)";
          }
        }
        
        const header = document.createElement("div");
        header.className = "option-card-header";
        header.innerHTML = `
          <span class="option-num-badge">${gapNum}</span>
          <span style="font-size: 11px; font-weight: 600; color: var(--color-text-secondary);">Boşluk ${gapNum}</span>
        `;
        card.appendChild(header);
        
        const choicesList = document.createElement("div");
        choicesList.className = "option-choices-list";
        
        const gapOptions = exercise.options[gapNum] || { a: "A", b: "B", c: "C" };
        const userAns = state.sprachbausteineAnswers[gapNum];
        
        Object.keys(gapOptions).forEach(choice => {
          const wordText = gapOptions[choice];
          const item = document.createElement("div");
          item.className = "option-choice-item";
          item.setAttribute("data-choice", choice);
          
          const isSelected = userAns === choice;
          if (isSelected) {
            item.classList.add("selected");
          }
          
          if (sprachbausteineSubmitted) {
            item.classList.add("disabled");
            const correctAns = exercise.answers[gapNum];
            if (choice === correctAns) {
              item.classList.add("correct");
            } else if (isSelected && choice !== correctAns) {
              item.classList.add("incorrect");
            }
          } else {
            item.onclick = () => selectSprachbausteineAnswer(gapNum, choice);
          }
          
          item.innerHTML = `
            <span class="option-letter-circle">${choice}</span>
            <span>${wordText}</span>
          `;
          choicesList.appendChild(item);
        });
        
        card.appendChild(choicesList);
        
        if (sprachbausteineSubmitted && exercise.explanations && exercise.explanations[gapNum]) {
          const expDiv = document.createElement("div");
          expDiv.style = "margin-top: 8px; font-size: 11px; color: var(--color-text-secondary); line-height: 1.4; border-top: 1px dashed var(--color-border-secondary); padding-top: 6px;";
          expDiv.innerHTML = `<i class="ti ti-bulb" style="color: var(--theme-purple); font-size: 13px; margin-right: 2px;"></i> ${exercise.explanations[gapNum]}`;
          card.appendChild(expDiv);
        }
        
        optionsContainer.appendChild(card);
      });
    }
  }
  
  renderSprachbausteineAnswersSheet();
  
  const submitBtn = document.getElementById("sprachbausteine-submit-btn");
  if (submitBtn) {
    if (sprachbausteineSubmitted) {
      submitBtn.innerHTML = '<i class="ti ti-check"></i> Alıştırmayı Tamamla';
      submitBtn.className = "c-teal";
      submitBtn.onclick = () => {
        showScreen("sprachbausteine-dashboard");
      };
    } else {
      submitBtn.innerHTML = '<i class="ti ti-send"></i> Cevapları Gönder';
      submitBtn.className = "c-purple";
      submitBtn.onclick = submitSprachbausteine;
    }
  }
}

function renderSprachbausteineAnswersSheet() {
  if (!activeSprachbausteineGame) return;
  const exercise = activeSprachbausteineGame;
  const isTeil2 = exercise.type === "teil2";
  const container = document.getElementById("sprachbausteine-answers-sheet");
  if (!container) return;
  container.innerHTML = "";
  
  const gapsList = Object.keys(exercise.options).sort((a, b) => parseInt(a) - parseInt(b));
  const letters = Object.keys(exercise.options[gapsList[0]]).sort();
  
  gapsList.forEach(gapStr => {
    const gapNum = parseInt(gapStr);
    const row = document.createElement("div");
    row.className = "bubble-grid-row";
    row.setAttribute("data-gap", gapNum);
    row.style = "display: flex; flex-direction: column; gap: 8px; background: var(--color-background-secondary); padding: 10px; border-radius: var(--border-radius-md); border: 1px solid var(--color-border-primary); align-items: stretch;";
    if (state.sprachbausteineAnswers[gapNum] && !sprachbausteineSubmitted) {
      row.style.borderColor = "var(--theme-purple)";
    }
    
    const rowHeader = document.createElement("div");
    rowHeader.style = "display: flex; align-items: center; gap: 8px;";
    rowHeader.innerHTML = `
      <span class="bubble-row-num" style="width: 24px; height: 24px; font-size: 11px;">${gapNum}</span>
      <span style="font-size: 12px; font-weight: 600; color: var(--color-text-primary);">Boşluk ${gapNum}</span>
    `;
    row.appendChild(rowHeader);
    
    const buttonsGrid = document.createElement("div");
    buttonsGrid.className = "bubble-buttons-grid";
    if (isTeil2) {
      buttonsGrid.style = "grid-template-columns: repeat(5, 1fr); gap: 4px; display: grid; margin-top: 4px;";
    } else {
      buttonsGrid.style = "grid-template-columns: repeat(3, 1fr); gap: 6px; display: grid; margin-top: 4px;";
    }
    
    const userAns = state.sprachbausteineAnswers[gapNum];
    const correctAns = exercise.answers[gapNum];
    
    letters.forEach(letter => {
      const btn = document.createElement("button");
      btn.className = "bubble-btn";
      btn.textContent = letter;
      
      const isSelected = userAns === letter;
      if (isSelected) {
        btn.classList.add("selected");
      }
      
      if (sprachbausteineSubmitted) {
        btn.classList.add("disabled");
        if (letter === correctAns) {
          btn.classList.add("correct");
        } else if (isSelected && letter !== correctAns) {
          btn.classList.add("incorrect");
        }
      } else {
        btn.onclick = () => selectSprachbausteineAnswer(gapNum, letter);
      }
      
      buttonsGrid.appendChild(btn);
    });
    
    row.appendChild(buttonsGrid);
    
    // Append feedback and explanations inside sheet row
    if (sprachbausteineSubmitted) {
      let feedbackHtml = "";
      if (userAns === correctAns) {
        feedbackHtml = `<div class="text-feedback-badge correct" style="margin-top: 6px; font-size: 11px;"><i class="ti ti-circle-check"></i> Doğru (${correctAns.toUpperCase()})</div>`;
      } else {
        const userChoiceText = userAns ? userAns.toUpperCase() : "Boş";
        feedbackHtml = `<div class="text-feedback-badge incorrect" style="margin-top: 6px; font-size: 11px;"><i class="ti ti-circle-x"></i> Yanlış (Seçim: ${userChoiceText}, Doğru: ${correctAns.toUpperCase()})</div>`;
      }
      if (exercise.explanations && exercise.explanations[gapNum]) {
        feedbackHtml += `<div style="margin-top: 6px; font-size: 11px; color: var(--color-text-secondary); line-height: 1.4; border-top: 1px dashed var(--color-border-secondary); padding-top: 4px;"><i class="ti ti-bulb" style="color: var(--theme-purple); font-size: 12.5px; margin-right: 2px;"></i> ${exercise.explanations[gapNum]}</div>`;
      }
      
      const feedbackContainer = document.createElement("div");
      feedbackContainer.innerHTML = feedbackHtml;
      row.appendChild(feedbackContainer);
      
      if (userAns === correctAns) {
        row.style.borderColor = "#10b981";
      } else {
        row.style.borderColor = "#ef4444";
      }
    }
    
    container.appendChild(row);
  });
  
  updateSprachbausteineStatus();
}

function selectSprachbausteineAnswer(gapNum, option) {
  if (sprachbausteineSubmitted) return;
  
  const exercise = activeSprachbausteineGame;
  const isTeil2 = exercise && exercise.type === "teil2";
  
  if (isTeil2) {
    // Unique choice selection: clear this word from any other gaps
    Object.keys(state.sprachbausteineAnswers).forEach(key => {
      if (state.sprachbausteineAnswers[key] === option) {
        state.sprachbausteineAnswers[key] = null;
      }
    });
  }
  
  if (state.sprachbausteineAnswers[gapNum] === option) {
    state.sprachbausteineAnswers[gapNum] = null;
  } else {
    state.sprachbausteineAnswers[gapNum] = option;
  }
  
  saveState();
  renderSprachbausteineScreen();
}

function updateSprachbausteineStatus() {
  if (!activeSprachbausteineGame) return;
  const exercise = activeSprachbausteineGame;
  const statusText = document.getElementById("sprachbausteine-status-text");
  if (!statusText) return;
  
  const gapsList = Object.keys(exercise.options).sort((a, b) => parseInt(a) - parseInt(b));
  const totalCount = gapsList.length;
  
  const resultsSummary = document.getElementById("sprachbausteine-results-summary");
  if (sprachbausteineSubmitted) {
    let correctCount = 0;
    gapsList.forEach(gapNum => {
      if (state.sprachbausteineAnswers[gapNum] === exercise.answers[gapNum]) {
        correctCount++;
      }
    });
    
    const attempts = state.sprachbausteineProgress[exercise.id] || [];
    const lastAttempt = attempts[attempts.length - 1];
    let timeFormatted = "--:--";
    if (lastAttempt) {
      const mins = Math.floor(lastAttempt.duration / 60);
      const secs = lastAttempt.duration % 60;
      timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    statusText.textContent = `Sonuç: ${correctCount}/${totalCount} Doğru! (+${correctCount * 10} XP)`;
    statusText.style.color = "#10b981";
    
    if (resultsSummary) {
      resultsSummary.innerHTML = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: var(--border-radius-md); padding: 12px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 13px; font-weight: 700; color: #10b981; display: flex; align-items: center; gap: 6px;">
              <i class="ti ti-circle-check"></i> Alıştırma Tamamlandı!
            </span>
            <span style="font-size: 11px; font-weight: 600; background: #10b981; color: #fff; padding: 2px 8px; border-radius: 99px;">
              +${correctCount * 10} XP
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; color: var(--color-text-primary); margin-top: 4px; border-top: 1px solid var(--color-border-primary); padding-top: 6px;">
            <span>Doğruluk: <strong>${correctCount}/${totalCount}</strong></span>
            <span style="display: flex; align-items: center; gap: 4px;">
              <i class="ti ti-clock" style="color: var(--theme-coral);"></i> Süre: <strong>${timeFormatted}</strong>
            </span>
          </div>
        </div>
      `;
    }
    return;
  } else {
    if (resultsSummary) {
      resultsSummary.innerHTML = "";
    }
  }
  
  let answeredCount = 0;
  gapsList.forEach(gapNum => {
    if (state.sprachbausteineAnswers[gapNum]) {
      answeredCount++;
    }
  });
  
  const remaining = totalCount - answeredCount;
  if (remaining === 0) {
    statusText.textContent = "Bütün sorular cevaplandı. Cevapları gönderin!";
    statusText.style.color = "#98b5b6";
  } else {
    statusText.textContent = `${remaining} boş soru doldurulmayı bekliyor.`;
    statusText.style.color = "var(--theme-coral)";
  }
}

function submitSprachbausteine() {
  if (sprachbausteineSubmitted) return;
  if (!activeSprachbausteineGame) return;
  const exercise = activeSprachbausteineGame;
  
  if (sprachbausteineTimerInterval) {
    clearInterval(sprachbausteineTimerInterval);
    sprachbausteineTimerInterval = null;
  }
  
  const durationSeconds = Math.round((Date.now() - state.sprachbausteineStartTime) / 1000);
  
  const gapsList = Object.keys(exercise.options).sort((a, b) => parseInt(a) - parseInt(b));
  const totalCount = gapsList.length;
  
  let correctCount = 0;
  gapsList.forEach(gapNum => {
    if (state.sprachbausteineAnswers[gapNum] === exercise.answers[gapNum]) {
      correctCount++;
    }
  });
  
  sprachbausteineSubmitted = true;
  
  const xpEarned = correctCount * 10;
  state.xp += xpEarned;
  
  // Calculate score out of 100
  const scoreMultiplier = 100 / totalCount;
  const score = Math.round(correctCount * scoreMultiplier);
  
  let attempts = state.sprachbausteineProgress[exercise.id] || [];
  attempts.push({ score: score, duration: durationSeconds });
  if (attempts.length > 3) {
    attempts.shift();
  }
  state.sprachbausteineProgress[exercise.id] = attempts;
  
  saveState();
  
  renderSprachbausteineScreen();
}

function scrollToGapCard(gapNum) {
  const isTeil2 = activeSprachbausteineGame && activeSprachbausteineGame.type === "teil2";
  if (isTeil2) {
    const row = document.querySelector(`#sprachbausteine-answers-sheet .bubble-grid-row[data-gap="${gapNum}"]`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.style.borderColor = 'var(--theme-purple)';
      setTimeout(() => {
        if (!sprachbausteineSubmitted) {
          row.style.borderColor = 'var(--color-border-primary)';
        } else {
          const correctAns = activeSprachbausteineGame.answers[gapNum];
          const userAns = state.sprachbausteineAnswers[gapNum];
          row.style.borderColor = userAns === correctAns ? '#10b981' : '#ef4444';
        }
      }, 1500);
    }
    return;
  }
  
  const card = document.getElementById(`sprachbausteine-option-card-${gapNum}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.borderColor = 'var(--theme-purple)';
    setTimeout(() => {
      if (!sprachbausteineSubmitted) {
        card.style.borderColor = 'var(--color-border-primary)';
      }
    }, 1500);
  }
}

// ================= ANALYTICS SCREEN RENDERING =================

function renderAnalyticsScreen() {
  const totalLessons = countTotalLessons();
  const completedCount = state.completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  const overallPercentEl = document.getElementById("analytics-overall-percent");
  if (overallPercentEl) overallPercentEl.textContent = `${progressPercent}%`;
  
  const completedTextEl = document.getElementById("analytics-completed-text");
  if (completedTextEl) completedTextEl.textContent = `${completedCount}/${totalLessons} ders`;
  
  const xpTextEl = document.getElementById("analytics-xp-text");
  if (xpTextEl) xpTextEl.textContent = `${state.xp} XP`;
  
  renderStreakCalendar();
  renderAnalyticsCategoriesBreakdown();
}

function renderStreakCalendar() {
  const calendarGrid = document.getElementById("streak-calendar-grid");
  if (!calendarGrid) return;
  
  calendarGrid.innerHTML = "";
  
  const today = new Date();
  const days = [];
  
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  
  days.forEach(day => {
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = day.getDate();
    
    if (day.toDateString() === today.toDateString()) {
      dayDiv.classList.add("active");
    }
    
    const completedSomethingToday = state.completedToday.flashcards || state.completedToday.quiz || state.completedLessons.length > 0;
    if (day.toDateString() === today.toDateString() && completedSomethingToday) {
      dayDiv.classList.add("completed");
    }
    
    calendarGrid.appendChild(dayDiv);
  });
}

function renderAnalyticsCategoriesBreakdown() {
  const container = document.getElementById("analytics-categories-details");
  if (!container) return;
  
  container.innerHTML = "";
  
  const totalLessons = countTotalLessons();
  const completedLessons = state.completedLessons.length;
  const lessonPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  const totalPreps = typeof VERBEN_PREP_DATA !== 'undefined' ? VERBEN_PREP_DATA.length : 0;
  const learnedPreps = Object.values(state.prepScores || {}).filter(score => score >= 3).length;
  const prepPct = totalPreps > 0 ? Math.round((learnedPreps / totalPreps) * 100) : 0;
  
  const totalLese = (typeof LESEVERSTEHEN_TEIL_1_DATA !== 'undefined' ? LESEVERSTEHEN_TEIL_1_DATA.length : 0) +
                    (typeof LESEVERSTEHEN_TEIL_2_DATA !== 'undefined' ? LESEVERSTEHEN_TEIL_2_DATA.length : 0) +
                    (typeof LESEVERSTEHEN_TEIL_3_DATA !== 'undefined' ? LESEVERSTEHEN_TEIL_3_DATA.length : 0);
  const completedLese = Object.keys(state.leseverstehenProgress || {}).length;
  const lesePct = totalLese > 0 ? Math.round((completedLese / totalLese) * 100) : 0;
  
  // Calculate average score for Leseverstehen
  let totalLeseScore = 0;
  let leseAttemptedCount = 0;
  Object.values(state.leseverstehenProgress || {}).forEach(attempts => {
    if (attempts && attempts.length > 0) {
      const latest = attempts[attempts.length - 1];
      totalLeseScore += latest.score;
      leseAttemptedCount++;
    }
  });
  const leseAvgScore = leseAttemptedCount > 0 ? Math.round(totalLeseScore / leseAttemptedCount) : 0;
  
  const totalSprach = (typeof SPRACHBAUSTEINE_TEIL_1_DATA !== 'undefined' ? SPRACHBAUSTEINE_TEIL_1_DATA.length : 0) +
                      (typeof SPRACHBAUSTEINE_TEIL_2_DATA !== 'undefined' ? SPRACHBAUSTEINE_TEIL_2_DATA.length : 0);
  const completedSprach = Object.keys(state.sprachbausteineProgress || {}).length;
  const sprachPct = totalSprach > 0 ? Math.round((completedSprach / totalSprach) * 100) : 0;
  
  // Calculate average score for Sprachbausteine
  let totalSprachScore = 0;
  let sprachAttemptedCount = 0;
  Object.values(state.sprachbausteineProgress || {}).forEach(attempts => {
    if (attempts && attempts.length > 0) {
      const latest = attempts[attempts.length - 1];
      totalSprachScore += latest.score;
      sprachAttemptedCount++;
    }
  });
  const sprachAvgScore = sprachAttemptedCount > 0 ? Math.round(totalSprachScore / sprachAttemptedCount) : 0;
  
  const categories = [
    { 
      name: "Dilbilgisi Konuları", 
      pct: lessonPct, 
      label: `${completedLessons}/${totalLessons} tamamlandı`, 
      badge: `${lessonPct}%`,
      theme: "var(--theme-purple)" 
    },
    { 
      name: "Fiil & Edat Eşleştirmeleri", 
      pct: prepPct, 
      label: `${learnedPreps}/${totalPreps} ezberlendi`, 
      badge: `${prepPct}%`,
      theme: "var(--theme-pink)" 
    },
    { 
      name: "Okuma Anlama (Leseverstehen)", 
      pct: lesePct, 
      label: `${completedLese}/${totalLese} alıştırma tamamlandı`, 
      badge: leseAttemptedCount > 0 ? `${leseAvgScore}/100` : "-/100",
      theme: "var(--theme-teal)" 
    },
    { 
      name: "Kelime Yerleştirme (Sprachbausteine)", 
      pct: sprachPct, 
      label: `${completedSprach}/${totalSprach} alıştırma tamamlandı`, 
      badge: sprachAttemptedCount > 0 ? `${sprachAvgScore}/100` : "-/100",
      theme: "var(--theme-coral)" 
    }
  ];
  
  categories.forEach(cat => {
    const item = document.createElement("div");
    item.style = "background: var(--color-background-secondary); border: 1px solid var(--color-border-primary); border-radius: var(--border-radius-lg); padding: 12px 14px; margin-bottom: 10px;";
    
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom: 6px;">
        <span style="font-size: 12.5px; font-weight:600; color:var(--color-text-primary);">${cat.name}</span>
        <span style="font-size: 13px; font-weight:700; color:${cat.theme};">${cat.badge}</span>
      </div>
      <div style="height: 4px; background: var(--color-background-primary); border-radius: 99px; overflow:hidden;">
        <div style="width: ${cat.pct}%; height: 100%; background: ${cat.theme}; border-radius: 99px;"></div>
      </div>
      <div style="margin-top: 6px; font-size: 10.5px; color: var(--color-text-secondary);">${cat.label}</div>
    `;
    container.appendChild(item);
  });
}

// ================= PROFILE SCREEN RENDERING =================

function renderProfileScreen() {
  const nameInput = document.getElementById("profile-name-input");
  if (nameInput) {
    nameInput.value = state.userName;
  }
}

// ================= MY VOCABULARY SCREEN RENDERING & FUNCTIONS =================

function renderMyVocabScreen() {
  const listBtn = document.querySelector('.vocab-tab-btn[data-tab="list"]');
  const studyBtn = document.querySelector('.vocab-tab-btn[data-tab="study"]');
  const listContent = document.getElementById("vocab-tab-content-list");
  const studyContent = document.getElementById("vocab-tab-content-study");
  
  // Set tab state to list initially
  if (listBtn && studyBtn && listContent && studyContent) {
    listBtn.classList.add("active");
    listBtn.style.color = "var(--color-text-primary)";
    studyBtn.classList.remove("active");
    studyBtn.style.color = "var(--color-text-secondary)";
    
    listContent.classList.remove("hidden");
    studyContent.classList.add("hidden");
  }
  
  // Clear search field
  const searchInput = document.getElementById("vocab-search-input");
  if (searchInput) {
    searchInput.value = "";
  }
  
  renderVocabList();
}

function renderVocabList() {
  const container = document.getElementById("vocab-list-cards-container");
  if (!container) return;
  
  container.innerHTML = "";
  const query = document.getElementById("vocab-search-input")?.value.toLowerCase().trim() || "";
  
  const vocabList = state.myVocabulary || [];
  const filtered = vocabList.filter(item => 
    item.word.toLowerCase().includes(query) || 
    (item.translation && item.translation.toLowerCase().includes(query))
  );
  
  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--color-text-secondary); display:flex; flex-direction:column; gap:12px; align-items:center;">
        <i class="ti ti-bookmark" style="font-size: 36px; color: var(--theme-purple); opacity:0.6;"></i>
        <p style="font-size: 13px; line-height: 1.5; margin: 0; text-align: center;">
          ${vocabList.length === 0 
            ? "Henüz kelime eklemediniz.<br><span style='font-size:11.5px; opacity:0.8;'>Alıştırmalardaki metinlerden kelime seçerek kelimelerinizi buraya kaydedebilirsiniz.</span>" 
            : "Aramanızla eşleşen kelime bulunamadı."}
        </p>
      </div>
    `;
    return;
  }
  
  filtered.forEach(item => {
    const card = document.createElement("div");
    card.style = "background: var(--color-background-secondary); border: 1px solid var(--color-border-primary); border-radius: var(--border-radius-lg); padding: 14px; display: flex; flex-direction: column; gap: 8px; position: relative; animation: fadeIn 0.2s ease-out;";
    
    let contextHtml = "";
    if (item.context) {
      const escapedWord = item.word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(${escapedWord})`, 'gi');
      contextHtml = item.context.replace(regex, `<strong style="color: var(--theme-purple); text-decoration: underline; text-underline-offset: 3px;">$1</strong>`);
    }
    
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap: 10px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size: 14.5px; font-weight: 700; color: var(--color-text-primary);">${item.word}</span>
          <button class="vocab-speak-btn" data-word="${item.word}" style="background:none; border:none; color: var(--theme-coral); cursor:pointer; font-size:16px; padding:2px; display:flex; align-items:center; justify-content:center; outline:none;">
            <i class="ti ti-volume"></i>
          </button>
        </div>
        <button class="vocab-delete-btn" data-id="${item.id}" style="background:none; border:none; color: var(--theme-coral); opacity:0.6; cursor:pointer; font-size:15px; padding:2px; display:flex; align-items:center; justify-content:center; outline:none;">
          <i class="ti ti-trash"></i>
        </button>
      </div>
      
      <div style="font-size: 13px; font-weight: 600; color: #10b981; display:flex; gap: 4px; align-items:center;">
        <i class="ti ti-arrow-right-circle" style="font-size:14px;"></i> ${item.translation}
      </div>
      
      ${contextHtml ? `
        <div style="font-size: 11.5px; color: var(--color-text-secondary); background: var(--color-background-primary); padding: 8px 10px; border-radius: var(--border-radius-sm); border-left: 2px solid var(--color-border-primary); line-height: 1.4; font-style: italic;">
          "${contextHtml}"
        </div>
      ` : ''}
    `;
    
    card.querySelector(".vocab-delete-btn")?.addEventListener("click", () => {
      if (confirm(`"${item.word}" kelimesini silmek istediğinize emin misiniz?`)) {
        state.myVocabulary = (state.myVocabulary || []).filter(v => v.id !== item.id);
        saveState();
        renderVocabList();
      }
    });
    
    card.querySelector(".vocab-speak-btn")?.addEventListener("click", () => {
      speakGermanWord(item.word);
    });
    
    container.appendChild(card);
  });
}

function speakGermanWord(word) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'de-DE';
    const voices = window.speechSynthesis.getVoices();
    const deVoice = voices.find(v => v.lang.startsWith('de'));
    if (deVoice) {
      utterance.voice = deVoice;
    }
    window.speechSynthesis.speak(utterance);
  }
}

let vocabStudyIndex = 0;
let vocabStudyFlipped = false;

function startVocabStudy() {
  vocabStudyIndex = 0;
  vocabStudyFlipped = false;
  renderVocabStudyCard();
}

function renderVocabStudyCard() {
  const container = document.getElementById("vocab-study-game-container");
  if (!container) return;
  
  const vocabList = state.myVocabulary || [];
  
  if (vocabList.length < 3) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--color-text-secondary); display:flex; flex-direction:column; gap:12px; align-items:center;">
        <i class="ti ti-bulb" style="font-size: 36px; color: var(--theme-coral); opacity:0.6;"></i>
        <p style="font-size: 13.5px; line-height: 1.5; margin: 0; text-align: center;">
          Tekrar yapabilmek için en az <strong>3 kelime</strong> kaydetmelisiniz.<br>
          <span style="font-size:12px; opacity:0.8; display:block; margin-top:6px;">Şu an kayıtlı kelime sayısı: ${vocabList.length}</span>
        </p>
      </div>
    `;
    return;
  }
  
  const item = vocabList[vocabStudyIndex];
  
  let contextHtml = "";
  if (item.context) {
    const escapedWord = item.word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedWord})`, 'gi');
    contextHtml = item.context.replace(regex, `<strong style="color: var(--theme-purple); text-decoration: underline;">$1</strong>`);
  }
  
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--color-text-secondary); margin-bottom:12px;">
      <span>Kelime <strong>${vocabStudyIndex + 1}/${vocabList.length}</strong></span>
      <button id="vocab-study-reset-btn" style="background:none; border:none; color:var(--theme-coral); font-size:11.5px; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:2px; outline:none;">
        <i class="ti ti-refresh"></i> Yeniden Başlat
      </button>
    </div>
    
    <div id="vocab-study-card" style="height: 230px; cursor:pointer; border-radius: var(--border-radius-lg); border: 1px solid var(--color-border-primary); background: var(--color-background-secondary); padding: 20px; display:flex; flex-direction:column; justify-content:center; align-items:center; gap:12px; text-align:center; position:relative; box-shadow: var(--box-shadow-md); transition: border-color 0.2s; overflow:hidden;">
      ${vocabStudyFlipped ? `
        <!-- Back side -->
        <div style="font-size:10px; font-weight:600; color:var(--color-text-tertiary); text-transform:uppercase; letter-spacing:0.5px; position:absolute; top:12px;">Türkçe Anlamı</div>
        <span style="font-size:20px; font-weight:700; color:var(--color-text-primary);">${item.word}</span>
        <span style="font-size:17px; font-weight:700; color:#10b981; display:flex; align-items:center; gap:6px;"><i class="ti ti-arrow-right-circle"></i> ${item.translation}</span>
        <div style="font-size:10px; color:var(--color-text-tertiary); position:absolute; bottom:12px;"><i class="ti ti-refresh"></i> Çevirmek için dokunun</div>
      ` : `
        <!-- Front side -->
        <div style="font-size:10px; font-weight:600; color:var(--color-text-tertiary); text-transform:uppercase; letter-spacing:0.5px; position:absolute; top:12px;">Almanca Kelime</div>
        <span style="font-size:22px; font-weight:700; color:var(--color-text-primary);">${item.word}</span>
        ${contextHtml ? `<p style="font-size:12.5px; color:var(--color-text-secondary); font-style:italic; margin:0 10px; line-height:1.4;">"${contextHtml}"</p>` : ''}
        <div style="font-size:10px; color:var(--color-text-tertiary); position:absolute; bottom:12px;"><i class="ti ti-refresh"></i> Çevirmek için dokunun</div>
      `}
    </div>
    
    <div style="display:flex; justify-content:space-between; gap:12px; margin-top:16px;">
      <button id="vocab-study-prev-btn" style="flex:1; border: 1px solid var(--color-border-primary); color: var(--color-text-primary); background: none; padding: 12px; border-radius: var(--border-radius-md); font-size:12.5px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:4px; outline:none;" ${vocabStudyIndex === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
        <i class="ti ti-arrow-left"></i> Önceki
      </button>
      <button id="vocab-study-speak-btn" style="width: 50px; border: 1px solid var(--color-border-primary); color: var(--theme-coral); background: none; padding: 12px; border-radius: var(--border-radius-md); font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; outline:none;">
        <i class="ti ti-volume"></i>
      </button>
      <button id="vocab-study-next-btn" class="c-purple" style="flex:1; border: none; padding: 12px; border-radius: var(--border-radius-md); font-size:12.5px; font-weight:600; cursor:pointer; color:var(--color-background-primary); display:flex; align-items:center; justify-content:center; gap:4px; outline:none;" ${vocabStudyIndex === vocabList.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>
        Sonraki <i class="ti ti-arrow-right"></i>
      </button>
    </div>
  `;
  
  document.getElementById("vocab-study-card")?.addEventListener("click", () => {
    vocabStudyFlipped = !vocabStudyFlipped;
    renderVocabStudyCard();
  });
  
  document.getElementById("vocab-study-speak-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    speakGermanWord(item.word);
  });
  
  document.getElementById("vocab-study-prev-btn")?.addEventListener("click", () => {
    if (vocabStudyIndex > 0) {
      vocabStudyIndex--;
      vocabStudyFlipped = false;
      renderVocabStudyCard();
    }
  });
  
  document.getElementById("vocab-study-next-btn")?.addEventListener("click", () => {
    if (vocabStudyIndex < vocabList.length - 1) {
      vocabStudyIndex++;
      vocabStudyFlipped = false;
      renderVocabStudyCard();
    }
  });
  
  document.getElementById("vocab-study-reset-btn")?.addEventListener("click", () => {
    startVocabStudy();
  });
}

function extractSentence(textBlock, word) {
  if (!textBlock || !word) return "";
  
  // Split text into sentences using standard German punctuation boundaries
  // Use negative lookbehinds for abbreviations like Dr. bzw. z.B. etc.
  const sentences = textBlock.split(/(?<!\b(Dr|Prof|bzw|ca|vs|etc|z\.B|z\.\sB))\.(?=\s|$)|(?<=[!?])\s+/i);
  
  const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(escapedWord, 'i');
  
  const matched = sentences.find(s => regex.test(s));
  if (matched) {
    let sentence = matched.trim();
    // Re-append a period if it was stripped by split
    if (!sentence.endsWith('.') && !sentence.endsWith('!') && !sentence.endsWith('?')) {
      sentence += '.';
    }
    return sentence;
  }
  return textBlock;
}

// ================= LESSON QUIZ ENGINE =================
let activeLessonQuiz = null;
let activeLessonQuizQuestions = [];
let lessonQuizCurrentIndex = 0;
let lessonQuizLives = 3;
let lessonQuizAnswersText = {};
let lessonQuizCorrectStates = {};

function startLessonQuiz(lesson) {
  activeLessonQuiz = lesson;
  const quizEntry = LESSON_QUIZZES[lesson.id];
  if (quizEntry && quizEntry.questions) {
    activeLessonQuizQuestions = quizEntry.questions;
  } else {
    activeLessonQuizQuestions = quizEntry || [];
  }
  lessonQuizCurrentIndex = 0;
  lessonQuizLives = 3;
  lessonQuizAnswersText = {};
  lessonQuizCorrectStates = {};
  
  if (activeLessonQuizQuestions.length === 0) {
    alert("Bu ders için henüz sınav bulunamadı.");
    return;
  }
  
  showScreen("lesson-quiz");
  
  // Header title
  const headerTitle = document.getElementById("lesson-quiz-header-title");
  if (headerTitle) {
    headerTitle.textContent = `${lesson.title} - Sınav`;
  }
  
  // Hide result overlay
  const overlay = document.getElementById("lesson-quiz-result-overlay");
  if (overlay) overlay.classList.add("hidden");
  
  // Setup back button
  const backBtn = document.getElementById("lesson-quiz-back-btn");
  if (backBtn) {
    const newBackBtn = backBtn.cloneNode(true);
    backBtn.parentNode.replaceChild(newBackBtn, backBtn);
    newBackBtn.addEventListener("click", () => {
      if (confirm("Sınavdan çıkmak istiyor musunuz? İlerlemeniz kaybolacaktır.")) {
        showScreen("lesson");
      }
    });
  }
  
  renderLessonQuizLives();
  renderLessonQuizQuestion();
}

function renderLessonQuizLives() {
  const container = document.getElementById("lesson-quiz-lives-container");
  if (!container) return;
  
  container.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    if (i < lessonQuizLives) {
      container.innerHTML += `<span style="color: var(--theme-coral); text-shadow: 0 0 4px rgba(232, 139, 125, 0.4);">❤️</span>`;
    } else {
      container.innerHTML += `<span style="opacity: 0.3; filter: grayscale(100%);">❤️</span>`; // lost heart
    }
  }
}

function renderLessonQuizQuestion() {
  const qCount = document.getElementById("lesson-quiz-q-count");
  const qPercent = document.getElementById("lesson-quiz-q-percent");
  const progressBar = document.getElementById("lesson-quiz-progress-bar");
  const questionArea = document.getElementById("lesson-quiz-question-area");
  
  if (!activeLessonQuizQuestions || activeLessonQuizQuestions.length === 0) return;
  
  const totalQuestions = activeLessonQuizQuestions.length;
  const q = activeLessonQuizQuestions[lessonQuizCurrentIndex];
  
  const pct = Math.round((lessonQuizCurrentIndex / totalQuestions) * 100);
  
  if (qCount) qCount.textContent = `Soru ${lessonQuizCurrentIndex + 1} / ${totalQuestions}`;
  if (qPercent) qPercent.textContent = `${pct}%`;
  if (progressBar) progressBar.style.width = `${pct}%`;
  
  if (questionArea) {
    const isTeil2 = lessonQuizCurrentIndex >= 5;
    const quizEntry = LESSON_QUIZZES[activeLessonQuiz.id];
    const letterText = quizEntry && quizEntry.letterText ? quizEntry.letterText : "";
    
    // Generate dropdown HTML
    const optionsHtml = q.options.map((opt, oIdx) => `
      <div class="quiz-dropdown-item" data-idx="${oIdx}" onclick="selectQuizOption(event, ${oIdx})">
        <span>${opt}</span>
        <i class="ti ti-circle" style="font-size:12px; opacity:0.5; margin-left:8px; flex-shrink:0;"></i>
      </div>
    `).join("");
    
    let contentHtml = "";
    
    if (isTeil2 && letterText) {
      let formattedLetter = letterText.replace(/\((\d+)\)/g, (match, num) => {
        const gapNum = parseInt(num);
        const gapIdx = gapNum - 1;
        
        if (gapIdx === lessonQuizCurrentIndex) {
          return `
            <div class="quiz-gap-wrapper" style="position: relative; display: inline-block; vertical-align: middle;">
              <span class="quiz-letter-gap active" onclick="toggleQuizDropdown(event)">(${gapNum}) _____</span>
              <div class="quiz-dropdown-menu hidden">
                ${optionsHtml}
              </div>
            </div>
          `;
        } else if (gapIdx < lessonQuizCurrentIndex) {
          const answeredText = lessonQuizAnswersText[gapIdx] || "_____";
          const wasCorrect = lessonQuizCorrectStates[gapIdx];
          const statusClass = wasCorrect ? "correct" : "incorrect";
          return `<span class="quiz-letter-gap answered ${statusClass}">${answeredText}</span>`;
        } else {
          return `<span class="quiz-letter-gap pending">(${gapNum}) _____</span>`;
        }
      });
      
      formattedLetter = formattedLetter.replace(/\n/g, "<br>");
      
      contentHtml = `
        <div class="quiz-letter-preview">
          ${formattedLetter}
        </div>
      `;
    } else {
      const formattedSentence = q.question.replace(/\((\d+)\)\s*_____/g, (match, gapNum) => {
        return `
          <div class="quiz-gap-wrapper" style="position: relative; display: inline-block; vertical-align: middle;">
            <span class="quiz-letter-gap active" onclick="toggleQuizDropdown(event)">(${gapNum}) _____</span>
            <div class="quiz-dropdown-menu hidden">
              ${optionsHtml}
            </div>
          </div>
        `;
      });
      
      contentHtml = `
        <div class="quiz-sentence-preview">
          ${formattedSentence}
        </div>
      `;
    }
    
    questionArea.innerHTML = contentHtml;
  }
}

function toggleQuizDropdown(event) {
  event.stopPropagation();
  const gapBtn = event.currentTarget;
  const wrapper = gapBtn.closest(".quiz-gap-wrapper");
  if (!wrapper) return;
  
  const menu = wrapper.querySelector(".quiz-dropdown-menu");
  if (!menu) return;
  
  // Close all other dropdowns
  document.querySelectorAll(".quiz-dropdown-menu").forEach(m => {
    if (m !== menu) m.classList.add("hidden");
  });
  
  menu.classList.toggle("hidden");
}

function selectQuizOption(event, selectedIdx) {
  event.stopPropagation();
  const item = event.currentTarget;
  const menu = item.closest(".quiz-dropdown-menu");
  const wrapper = item.closest(".quiz-gap-wrapper");
  if (!wrapper || !menu) return;
  
  const gapBtn = wrapper.querySelector(".quiz-letter-gap.active");
  const allItems = menu.querySelectorAll(".quiz-dropdown-item");
  
  handleLessonQuizAnswer(selectedIdx, gapBtn, item, allItems, menu);
}

function handleLessonQuizAnswer(selectedIdx, gapBtn, clickedItem, allItems, menu) {
  const q = activeLessonQuizQuestions[lessonQuizCurrentIndex];
  const correctIdx = q.correct;
  
  // Disable all options in dropdown
  allItems.forEach(opt => opt.style.pointerEvents = "none");
  
  const isCorrect = selectedIdx === correctIdx;
  lessonQuizCorrectStates[lessonQuizCurrentIndex] = isCorrect;
  lessonQuizAnswersText[lessonQuizCurrentIndex] = q.options[selectedIdx];
  
  // Update the gap text and style
  if (gapBtn) {
    gapBtn.textContent = q.options[selectedIdx];
    gapBtn.className = isCorrect ? "quiz-letter-gap active correct" : "quiz-letter-gap active incorrect";
  }
  
  if (isCorrect) {
    clickedItem.classList.add("correct");
    const icon = clickedItem.querySelector("i");
    if (icon) icon.className = "ti ti-circle-check";
  } else {
    clickedItem.classList.add("incorrect");
    const icon = clickedItem.querySelector("i");
    if (icon) icon.className = "ti ti-circle-x";
    
    // Highlight correct one in green
    const correctItem = allItems[correctIdx];
    if (correctItem) {
      correctItem.classList.add("correct");
      const cIcon = correctItem.querySelector("i");
      if (cIcon) cIcon.className = "ti ti-circle-check";
    }
    
    lessonQuizLives--;
    renderLessonQuizLives();
  }
  
  setTimeout(() => {
    if (menu) menu.classList.add("hidden");
    
    if (lessonQuizLives <= 0) {
      finishLessonQuiz(false);
    } else {
      lessonQuizCurrentIndex++;
      if (lessonQuizCurrentIndex >= activeLessonQuizQuestions.length) {
        finishLessonQuiz(true);
      } else {
        renderLessonQuizQuestion();
      }
    }
  }, isCorrect ? 1200 : 1800);
}

// Close dropdowns when clicking outside
document.addEventListener("click", () => {
  document.querySelectorAll(".quiz-dropdown-menu").forEach(menu => {
    menu.classList.add("hidden");
  });
});

function finishLessonQuiz(success) {
  const overlay = document.getElementById("lesson-quiz-result-overlay");
  const card = document.getElementById("lesson-quiz-result-card");
  
  if (!overlay || !card) return;
  
  overlay.classList.remove("hidden");
  
  if (success) {
    // Save completion state
    if (!state.completedLessons.includes(activeLessonQuiz.id)) {
      state.completedLessons.push(activeLessonQuiz.id);
      state.xp += 15;
      saveState();
      updateStreakBadge();
    }
    
    card.innerHTML = `
      <div style="font-size: 50px; margin-bottom: 10px;">🎉</div>
      <h2 style="font-size: 19px; font-weight: 700; margin: 0; color: var(--color-text-primary);">Sınavı Geçtiniz!</h2>
      <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.5; margin: 0;">
        Tebrikler, konuyu başarıyla kavradınız ve sınavı geçtiniz!
      </p>
      <div class="c-teal-bg" style="padding: 6px 12px; border-radius: var(--border-radius-full); font-size: 12px; font-weight: 600;">
        +15 XP Kazandınız!
      </div>
      <button id="lesson-quiz-result-ok-btn" class="c-purple" style="width: 100%; border: none; padding: 12px; border-radius: var(--border-radius-lg); font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 10px; color: #ffffff;">
        Konulara Dön
      </button>
    `;
    
    document.getElementById("lesson-quiz-result-ok-btn")?.addEventListener("click", () => {
      overlay.classList.add("hidden");
      showScreen("sitemap");
    });
  } else {
    card.innerHTML = `
      <div style="font-size: 50px; margin-bottom: 10px;">💔</div>
      <h2 style="font-size: 19px; font-weight: 700; margin: 0; color: var(--color-text-primary);">Sınav Başarısız!</h2>
      <p style="font-size: 13px; color: var(--color-text-secondary); line-height: 1.5; margin: 0;">
        3 hata yaptınız ve tüm canlarınız tükendi. Konu metnini tekrar okuyup deneyebilirsiniz.
      </p>
      <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; margin-top: 10px;">
        <button id="lesson-quiz-result-retry-btn" class="c-purple" style="width: 100%; border: none; padding: 12px; border-radius: var(--border-radius-lg); font-size: 13px; font-weight: 600; cursor: pointer; color: #ffffff;">
          Tekrar Dene
        </button>
        <button id="lesson-quiz-result-close-btn" style="width: 100%; border: 1px solid var(--color-border-primary); background: none; padding: 12px; border-radius: var(--border-radius-lg); font-size: 13px; font-weight: 600; cursor: pointer; color: var(--color-text-secondary);">
          Konuya Geri Dön
        </button>
      </div>
    `;
    
    document.getElementById("lesson-quiz-result-retry-btn")?.addEventListener("click", () => {
      overlay.classList.add("hidden");
      startLessonQuiz(activeLessonQuiz);
    });
    
    document.getElementById("lesson-quiz-result-close-btn")?.addEventListener("click", () => {
      overlay.classList.add("hidden");
      showScreen("lesson");
    });
  }
}
