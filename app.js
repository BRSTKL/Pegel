// app.js - B1 German App Core Logic (Minimalist Redesign + Prepositions Dashboard)

// State management
let state = {
  userName: "Baris",
  streak: 3,
  xp: 120,
  completedLessons: [
    "almanca_lassen_fiilinin_kullanim_rehberi",
    "lassen_fiilinin_yardimci_fiil_olarak_kullanimi_ve_islevleri",
    "almanca_donuslu_fiillerin_mantigi_ve_kullanimi",
    "almanca_donuslu_fiillerin_uc_grubu",
    "almanca_karisilikli_fiillerin_mantigi_ve_kullanimi",
    "almanca_gercek_karisilikli_fiillerin_mantigi_ve_kullanimi"
  ],
  completedToday: {
    flashcards: false,
    quiz: false
  },
  currentScreen: "home",
  activeCategory: "verben",
  expandedSubcategories: {},
  theme: "dark", // Default to dark mode for App_Tasarım.PNG aesthetic
  quizHistory: [],
  lastActiveDate: "",
  
  // Prepositions specific states
  prepScores: {},     // { 'abhängen_von': 3, ... }
  starredPreps: []    // [ 'abhängen_von', ... ]
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
  if (saved) {
    try {
      state = { ...state, ...JSON.parse(saved) };
    } catch (e) {
      console.error("Error parsing saved state", e);
    }
  }
  
  // Safe migrations for newly added properties
  if (!state.prepScores) state.prepScores = {};
  if (!state.starredPreps) state.starredPreps = [];
  if (!state.leseverstehenAnswers) state.leseverstehenAnswers = {};
  if (!state.leseverstehenProgress) state.leseverstehenProgress = {};
  
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
    showScreen("leseverstehen-dashboard");
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
  if (screenId === "leseverstehen-play") {
    appContainer?.classList.add("wide-mode");
  } else {
    appContainer?.classList.remove("wide-mode");
  }
  
  // Highlight active nav item
  // Map sub-activities back to the active navbar tab
  let navActiveId = screenId;
  if (screenId === "flashcard-play" || screenId === "quiz" || screenId === "fillblanks-play" || screenId === "verben-prep-dashboard" || screenId === "verben-prep-quiz" || screenId === "leseverstehen-play" || screenId === "leseverstehen-dashboard") {
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
      continueList.innerHTML = `
        <div class="interactive-card" style="border-radius: var(--border-radius-lg); padding: 12px 14px; display:flex; align-items:center; gap: 12px; margin-bottom: 10px;" id="fallback-continue-card">
          <div class="c-purple-bg" style="width:36px; height:36px; border-radius: var(--border-radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <i class="ti ti-bolt" style="font-size:16px;" aria-hidden="true"></i>
          </div>
          <div style="flex:1; min-width:0;">
            <p style="font-size: 13.5px; font-weight: 600; margin:0;">Das Verb 'lassen'</p>
            <p class="ts" style="font-size: 11.5px; margin:2px 0 0;">3/5 alt başlık tamamlandı</p>
            <div style="height: 4px; background: var(--color-background-primary); border-radius: 99px; margin-top:6px; overflow:hidden; border:1px solid var(--color-border-primary);">
              <div style="width: 60%; height:100%; background: var(--theme-purple); border-radius:99px;"></div>
            </div>
          </div>
          <i class="ti ti-chevron-right" style="font-size:16px; color:var(--color-text-tertiary); flex-shrink:0;" aria-hidden="true"></i>
        </div>
      `;
      document.getElementById("fallback-continue-card")?.addEventListener("click", () => {
        state.activeCategory = "verben";
        state.expandedSubcategories["Das Verb 'lassen'"] = true;
        showScreen("sitemap");
      });
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
            <i class="ti ${isCompleted ? 'ti-circle-check-filled completed' : 'ti-circle'} lesson-status-icon ${isCompleted ? 'completed' : 'incomplete'}"></i>
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
  
  const compBtn = document.getElementById("lesson-complete-btn");
  if (compBtn) {
    const isCompleted = state.completedLessons.includes(lesson.id);
    updateCompleteButtonState(compBtn, isCompleted);
    
    const newCompBtn = compBtn.cloneNode(true);
    compBtn.parentNode.replaceChild(newCompBtn, compBtn);
    
    newCompBtn.addEventListener("click", () => {
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
      updateCompleteButtonState(newCompBtn, nowCompleted);
      updateStreakBadge();
    });
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
    if (attemptCount === 1) {
      attemptsLabel = "1 deneme";
    } else if (attemptCount > 1) {
      attemptsLabel = `${attemptCount} deneme`;
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
  
  // Set instruction
  document.getElementById("leseverstehen-instruction-text").textContent = exercise.instruction;
  
  // Render Headings List
  const headingsList = document.getElementById("leseverstehen-headings-list");
  headingsList.innerHTML = "";
  Object.keys(exercise.headings).forEach(letter => {
    const card = document.createElement("div");
    card.className = "leseverstehen-heading-card";
    card.innerHTML = `
      <span class="leseverstehen-heading-letter">${letter})</span>
      <span>${exercise.headings[letter]}</span>
    `;
    headingsList.appendChild(card);
  });
  
  // Render Texts List
  const textsList = document.getElementById("leseverstehen-texts-list");
  textsList.innerHTML = "";
  exercise.texts.forEach(text => {
    const card = document.createElement("div");
    card.className = "interactive-card";
    card.style = "padding: 16px; border-radius: var(--border-radius-lg); position: relative; border-left: 3px solid var(--theme-purple); background: var(--color-background-secondary); border-top: 1px solid var(--color-border-primary); border-right: 1px solid var(--color-border-primary); border-bottom: 1px solid var(--color-border-primary);";
    
    // Check if we need to show correction feedback
    let feedbackHtml = "";
    if (leseverstehenSubmitted) {
      const userAns = state.leseverstehenAnswers[text.id];
      const correctAns = exercise.answers[text.id];
      if (userAns === correctAns) {
        feedbackHtml = `
          <div class="text-feedback-badge correct">
            <i class="ti ti-circle-check"></i> Doğru (Başlık ${correctAns.toUpperCase()})
          </div>
        `;
      } else {
        const userChoiceText = userAns ? userAns.toUpperCase() : "Boş";
        feedbackHtml = `
          <div class="text-feedback-badge incorrect">
            <i class="ti ti-circle-x"></i> Yanlış (Sizin seçiminiz: ${userChoiceText}, Doğru: ${correctAns.toUpperCase()})
          </div>
        `;
      }
    }
    
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap: 8px; margin-bottom: 8px;">
        <span class="bubble-row-num" style="width:22px; height:22px; font-size:11px;">${text.id}</span>
        <span style="font-size:12.5px; font-weight:600; color:var(--color-text-primary);">Metin ${text.id}</span>
      </div>
      <p style="font-size:12.5px; line-height:1.6; margin:0; color:var(--color-text-secondary); text-align: justify;">${text.content}</p>
      ${feedbackHtml}
    `;
    textsList.appendChild(card);
  });
  
  // Render Answer Sheet (Antwortbogen)
  renderAnswersSheet();
  
  // Setup Submit Button
  const submitBtn = document.getElementById("leseverstehen-submit-btn");
  if (submitBtn) {
    if (leseverstehenSubmitted) {
      submitBtn.innerHTML = '<i class="ti ti-check"></i> Alıştırmayı Tamamla';
      submitBtn.className = "c-teal";
      submitBtn.onclick = () => {
        showScreen("leseverstehen-dashboard");
      };
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
  const container = document.getElementById("leseverstehen-answers-sheet");
  container.innerHTML = "";
  
  exercise.texts.forEach(text => {
    const row = document.createElement("div");
    row.className = "bubble-grid-row";
    row.style = "display: flex; flex-direction: column; gap: 8px; align-items: stretch;";
    
    // Task number header
    const rowHeader = document.createElement("div");
    rowHeader.style = "display: flex; align-items: center; gap: 8px;";
    rowHeader.innerHTML = `
      <span class="bubble-row-num">${text.id}</span>
      <span style="font-size:12px; font-weight:600; color:var(--color-text-primary);">Metin ${text.id} için başlık seçin:</span>
    `;
    row.appendChild(rowHeader);
    
    // Bubble buttons grid (split into 2 rows of 5 for layout fit)
    const grid = document.createElement("div");
    grid.className = "bubble-grid-container";
    
    const row1 = document.createElement("div");
    row1.className = "bubble-buttons-grid";
    const row2 = document.createElement("div");
    row2.className = "bubble-buttons-grid";
    
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
    const userAns = state.leseverstehenAnswers[text.id];
    
    letters.forEach((letter, idx) => {
      const btn = document.createElement("button");
      btn.className = "bubble-btn";
      btn.textContent = letter;
      
      const isSelected = userAns === letter;
      if (isSelected) {
        btn.classList.add("selected");
      }
      
      // If submitted, show correct/incorrect color coding
      if (leseverstehenSubmitted) {
        btn.classList.add("disabled");
        const correctAns = exercise.answers[text.id];
        if (letter === correctAns) {
          btn.classList.add("correct");
        } else if (isSelected && letter !== correctAns) {
          btn.classList.add("incorrect");
        }
      } else {
        btn.onclick = () => selectBubbleAnswer(text.id, letter);
      }
      
      if (idx < 5) {
        row1.appendChild(btn);
      } else {
        row2.appendChild(btn);
      }
    });
    
    grid.appendChild(row1);
    grid.appendChild(row2);
    row.appendChild(grid);
    container.appendChild(row);
  });
  
  updateLeseverstehenStatus();
}

function selectBubbleAnswer(qNum, option) {
  if (leseverstehenSubmitted) return;
  
  // Unique choice enforcement: if this heading option was selected elsewhere, clear it
  Object.keys(state.leseverstehenAnswers).forEach(key => {
    if (state.leseverstehenAnswers[key] === option) {
      state.leseverstehenAnswers[key] = null;
    }
  });
  
  // Toggle selection
  if (state.leseverstehenAnswers[qNum] === option) {
    state.leseverstehenAnswers[qNum] = null;
  } else {
    state.leseverstehenAnswers[qNum] = option;
  }
  
  saveState();
  renderAnswersSheet();
}

function updateLeseverstehenStatus() {
  if (!activeLeseverstehenGame) return;
  const exercise = activeLeseverstehenGame;
  const statusText = document.getElementById("leseverstehen-status-text");
  
  if (leseverstehenSubmitted) {
    let correctCount = 0;
    exercise.texts.forEach(text => {
      if (state.leseverstehenAnswers[text.id] === exercise.answers[text.id]) {
        correctCount++;
      }
    });
    
    // Find the current attempt to read duration
    const attempts = state.leseverstehenProgress[exercise.id] || [];
    const lastAttempt = attempts[attempts.length - 1];
    let timeFormatted = "";
    if (lastAttempt) {
      const mins = Math.floor(lastAttempt.duration / 60);
      const secs = lastAttempt.duration % 60;
      timeFormatted = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    statusText.textContent = `Sonuç: ${correctCount}/5 Doğru! (${timeFormatted} sürede tamamlandı. +${correctCount * 10} XP)`;
    statusText.style.color = "#10b981";
    return;
  }
  
  let answeredCount = 0;
  exercise.texts.forEach(text => {
    if (state.leseverstehenAnswers[text.id]) {
      answeredCount++;
    }
  });
  
  const remaining = 5 - answeredCount;
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
  
  // Stop timer interval
  if (leseverstehenTimerInterval) {
    clearInterval(leseverstehenTimerInterval);
    leseverstehenTimerInterval = null;
  }
  
  const durationSeconds = Math.round((Date.now() - state.leseverstehenStartTime) / 1000);
  
  // Calculate correct answers
  let correctCount = 0;
  exercise.texts.forEach(text => {
    if (state.leseverstehenAnswers[text.id] === exercise.answers[text.id]) {
      correctCount++;
    }
  });
  
  leseverstehenSubmitted = true;
  
  // Award XP
  const xpEarned = correctCount * 10;
  state.xp += xpEarned;
  
  // Record attempt history (max last 3)
  let attempts = state.leseverstehenProgress[exercise.id] || [];
  attempts.push({ score: correctCount * 20, duration: durationSeconds });
  if (attempts.length > 3) {
    attempts.shift();
  }
  state.leseverstehenProgress[exercise.id] = attempts;
  
  saveState();
  
  // Render again with review marks
  renderLeseverstehenScreen();
}
