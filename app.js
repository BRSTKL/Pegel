// app.js - B1 German App Core Logic

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
  theme: "light",
  quizHistory: [],
  lastActiveDate: ""
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
  
  // Date check for streak and daily tasks resets
  const today = new Date().toDateString();
  if (state.lastActiveDate && state.lastActiveDate !== today) {
    // If we missed a day, streak reset or maintain? Let's just make it persistent, but reset daily tasks
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
  
  // Handle today's card clicks
  document.getElementById("flashcard-today-btn")?.addEventListener("click", () => {
    showScreen("flashcards");
  });
  
  document.getElementById("quiz-today-btn")?.addEventListener("click", () => {
    startNewQuiz();
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
    streakEl.innerHTML = `<i class="ti ti-flame" style="font-size:18px;" aria-hidden="true"></i> ${state.streak}`;
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
  
  // Highlight active nav item
  const activeNav = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
  if (activeNav) {
    activeNav.classList.add("active");
  }
  
  // Render specific screen content
  if (screenId === "home") {
    renderHomeScreen();
  } else if (screenId === "sitemap") {
    renderSitemapScreen();
  } else if (screenId === "flashcards") {
    renderFlashcardScreen();
  } else if (screenId === "analytics") {
    renderAnalyticsScreen();
  } else if (screenId === "profile") {
    renderProfileScreen();
  }
}

// HOME SCREEN RENDERING
function renderHomeScreen() {
  document.getElementById("profile-name").textContent = state.userName;
  
  // Calculations
  const totalLessons = countTotalLessons();
  const completedCount = state.completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  document.getElementById("progress-text-percent").textContent = `${progressPercent}%`;
  document.getElementById("progress-bar-fill").style.width = `${progressPercent}%`;
  document.getElementById("completed-fraction").textContent = `${completedCount}/${totalLessons} tamamlandı`;
  
  // Update Streak badge
  updateStreakBadge();
  
  // Daily checklist status updates
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
    
    // Find active categories & subcategories from lessons data
    LESSONS_DATA.forEach(cat => {
      cat.subcategories.forEach(sub => {
        const subLessons = sub.lessons;
        if (subLessons.length > 0) {
          const completedSub = subLessons.filter(l => state.completedLessons.includes(l.id)).length;
          
          // Show only if partially completed or if not completed but active
          if (completedSub > 0 && completedSub < subLessons.length) {
            const pct = Math.round((completedSub / subLessons.length) * 100);
            
            const card = document.createElement("div");
            card.className = "interactive-card";
            card.style = "border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 14px; display:flex; align-items:center; gap: 12px; margin-bottom: 10px;";
            card.innerHTML = `
              <div class="c-${cat.color}-bg" style="width:40px; height:40px; border-radius: var(--border-radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i class="ti ${cat.icon}" style="font-size:18px;" aria-hidden="true"></i>
              </div>
              <div style="flex:1; min-width:0;">
                <p style="font-size: 14px; font-weight: 500; margin:0;">${sub.name}</p>
                <p style="font-size: 12px; color: var(--color-text-secondary); margin:2px 0 0;">${completedSub}/${subLessons.length} alt başlık tamamlandı</p>
                <div style="height: 4px; background: var(--color-background-secondary); border-radius: 99px; margin-top:6px; overflow:hidden;">
                  <div style="width: ${pct}%; height:100%; background: var(--color-text-info); border-radius:99px;"></div>
                </div>
              </div>
              <i class="ti ti-chevron-right" style="font-size:18px; color:var(--color-text-tertiary); flex-shrink:0;" aria-hidden="true"></i>
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
      // Fallback to defaults matching mockup
      continueList.innerHTML = `
        <div class="interactive-card" style="border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 14px; display:flex; align-items:center; gap: 12px; margin-bottom: 10px;">
          <div class="c-purple-bg" style="width:40px; height:40px; border-radius: var(--border-radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <i class="ti ti-bolt" style="font-size:18px;" aria-hidden="true"></i>
          </div>
          <div style="flex:1; min-width:0;">
            <p style="font-size: 14px; font-weight: 500; margin:0;">Das Verb 'lassen'</p>
            <p style="font-size: 12px; color: var(--color-text-secondary); margin:2px 0 0;">3/5 alt başlık tamamlandı</p>
            <div style="height: 4px; background: var(--color-background-secondary); border-radius: 99px; margin-top:6px; overflow:hidden;">
              <div style="width: 60%; height:100%; background: var(--color-text-info); border-radius:99px;"></div>
            </div>
          </div>
          <i class="ti ti-chevron-right" style="font-size:18px; color:var(--color-text-tertiary); flex-shrink:0;" aria-hidden="true"></i>
        </div>
      `;
    }
  }
  
  // Categories section bindings
  const categoriesList = document.getElementById("categories-grid-list");
  if (categoriesList) {
    categoriesList.innerHTML = "";
    LESSONS_DATA.forEach(cat => {
      // Calculate lesson counts
      let totalCatLessons = 0;
      cat.subcategories.forEach(sub => totalCatLessons += sub.lessons.length);
      
      const catCard = document.createElement("div");
      catCard.className = `c-${cat.color} interactive-card`;
      catCard.style = "border-radius: var(--border-radius-lg); padding: 14px; display:flex; flex-direction:column; gap: 10px; min-height: 88px;";
      catCard.innerHTML = `
        <i class="ti ${cat.icon}" style="font-size:20px;" aria-hidden="true"></i>
        <div>
          <p class="t" style="font-size: 13px; font-weight: 500; margin:0;">${cat.name}</p>
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
  
  // Render Category Navigation tabs
  catNav.innerHTML = "";
  LESSONS_DATA.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = `category-tab-btn ${state.activeCategory === cat.id ? 'active c-' + cat.color : ''}`;
    btn.style = `flex: 1; padding: 10px 0; border: none; border-bottom: 2px solid ${state.activeCategory === cat.id ? 'currentColor' : 'transparent'}; background: none; font-size: 13px; font-weight: 600; cursor: pointer; color: ${state.activeCategory === cat.id ? 'var(--color-text-info)' : 'var(--color-text-secondary)'};`;
    btn.textContent = cat.name.split(" ")[0]; // First word
    btn.addEventListener("click", () => {
      state.activeCategory = cat.id;
      saveState();
      renderSitemapScreen();
    });
    catNav.appendChild(btn);
  });
  
  // Find current active category
  const activeCatObj = LESSONS_DATA.find(c => c.id === state.activeCategory);
  if (!activeCatObj) return;
  
  // Render subcategories inside accordion
  sitemapList.innerHTML = "";
  
  activeCatObj.subcategories.forEach(sub => {
    const item = document.createElement("div");
    item.className = "subcategory-item";
    item.style = "margin-bottom: 12px;";
    
    const isExpanded = state.expandedSubcategories[sub.name];
    
    // Header
    const header = document.createElement("div");
    header.className = "subcategory-header";
    header.innerHTML = `
      <span>${sub.name}</span>
      <i class="ti ${isExpanded ? 'ti-chevron-down' : 'ti-chevron-right'}"></i>
    `;
    header.addEventListener("click", () => {
      state.expandedSubcategories[sub.name] = !isExpanded;
      saveState();
      renderSitemapScreen();
    });
    item.appendChild(header);
    
    // Lessons List
    if (isExpanded) {
      const lessonsList = document.createElement("div");
      lessonsList.className = "lessons-list";
      
      if (sub.lessons.length === 0) {
        const noLesson = document.createElement("div");
        noLesson.style = "padding: 14px 20px; font-size: 13px; color: var(--color-text-tertiary); font-style: italic;";
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
  // Hide sitemap, show lesson
  showScreen("lesson");
  
  document.getElementById("lesson-title").textContent = lesson.title;
  
  // Format content
  const lessonBody = document.getElementById("lesson-body-content");
  if (lessonBody) {
    lessonBody.innerHTML = formatLessonContent(lesson.content);
  }
  
  // Complete Button Setup
  const compBtn = document.getElementById("lesson-complete-btn");
  if (compBtn) {
    const isCompleted = state.completedLessons.includes(lesson.id);
    updateCompleteButtonState(compBtn, isCompleted);
    
    // Clear old listener and add new
    const newCompBtn = compBtn.cloneNode(true);
    compBtn.parentNode.replaceChild(newCompBtn, compBtn);
    
    newCompBtn.addEventListener("click", () => {
      const index = state.completedLessons.indexOf(lesson.id);
      let nowCompleted = false;
      if (index > -1) {
        state.completedLessons.splice(index, 1); // remove
      } else {
        state.completedLessons.push(lesson.id); // add
        state.xp += 15; // award XP
        nowCompleted = true;
      }
      saveState();
      updateCompleteButtonState(newCompBtn, nowCompleted);
      updateStreakBadge();
    });
  }
}

function updateCompleteButtonState(btn, isCompleted) {
  if (isCompleted) {
    btn.className = "c-teal";
    btn.style = "width:100%; border:none; padding:14px; border-radius:var(--border-radius-lg); font-size:14px; font-weight:600; cursor:pointer; color:#ffffff; display:flex; align-items:center; justify-content:center; gap:8px;";
    btn.innerHTML = `<i class="ti ti-circle-check-filled"></i> Tamamlandı olarak işaretlendi`;
  } else {
    btn.className = "c-purple";
    btn.style = "width:100%; border:none; padding:14px; border-radius:var(--border-radius-lg); font-size:14px; font-weight:600; cursor:pointer; color:#ffffff; display:flex; align-items:center; justify-content:center; gap:8px;";
    btn.innerHTML = `<i class="ti ti-circle-check"></i> Tamamlandı olarak işaretle (+15 XP)`;
  }
}

// Parse lesson text and apply rich styling
function formatLessonContent(content) {
  // Split into lines
  const lines = content.split("\n");
  let html = "";
  
  lines.forEach(line => {
    let trimmed = line.trim();
    if (!trimmed) return;
    
    // Check if it's an example box or normal list
    if (trimmed.startsWith("*") || trimmed.startsWith("-")) {
      // Styled example box
      const cleaned = trimmed.substring(1).trim();
      html += `<div class="lesson-example-box">${formatCitations(cleaned)}</div>`;
    } else {
      // Normal paragraph
      html += `<p>${formatCitations(trimmed)}</p>`;
    }
  });
  
  return html;
}

// Convert footnote numbers like "1, 2" or "3" into styled citation bubbles
function formatCitations(text) {
  // Regex to match citation footnote numbers at the end of clauses or sentences
  // e.g. " 1", " 2, 3"
  let formatted = text;
  
  // Highlight German expressions in quotes
  formatted = formatted.replace(/"([^"]+)"/g, '<strong>“$1”</strong>');
  
  // Replace citation numbers
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
  
  // Next/Previous triggers
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
        // Deck completed!
        state.completedToday.flashcards = true;
        state.xp += 20;
        saveState();
        alert("Harika! Tüm kartları incelediniz ve +20 XP kazandınız! 🎉");
        showScreen("home");
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
        <div style="font-size: 12px; color: var(--color-text-secondary); display:flex; justify-content:space-between;">
          <span>Kart ${currentCardIndex + 1} / ${FLASHCARDS.length}</span>
          <span>B1 Almanca</span>
        </div>
        <div style="font-size: 20px; font-weight: 500; text-align: center; margin: auto 0; line-height:1.5;">
          ${card.front}
        </div>
        <div style="font-size: 11px; color: var(--color-text-tertiary); text-align: center;">
          Çeviriyi görmek için tıkla
        </div>
      </div>
      <div class="card-face card-back">
        <div style="font-size: 12px; color: var(--color-text-secondary); display:flex; justify-content:space-between;">
          <span>Kart ${currentCardIndex + 1} / ${FLASHCARDS.length}</span>
          <span>Türkçe Anlamı</span>
        </div>
        <div style="font-size: 17px; font-weight: 500; text-align: center; margin: auto 0; line-height:1.6; color: var(--theme-purple);">
          ${card.back}
        </div>
        <div style="font-size: 11px; color: var(--color-text-tertiary); text-align: center;">
          Ön yüze dönmek için tıkla
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
  
  // Disable prev button if first
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
  
  // Shuffle and select 5 questions
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
  
  // Header Info
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 15px;">
      <span style="font-size:13px; font-weight:500; color:var(--color-text-secondary);">Soru ${currentQuestionIndex + 1} / 5</span>
      <div style="width: 100px; height: 6px; background: var(--color-border-primary); border-radius: 99px; overflow:hidden;">
        <div style="width: ${(currentQuestionIndex + 1) * 20}%; height:100%; background: var(--theme-coral); border-radius:99px;"></div>
      </div>
    </div>
    
    <p style="font-size: 16px; font-weight: 600; line-height: 1.5; margin-bottom: 24px;">
      ${q.question}
    </p>
    
    <div style="display:flex; flex-direction:column; gap:12px;" id="quiz-options-container">
      ${q.options.map((opt, idx) => `
        <button class="quiz-option" data-idx="${idx}">
          <span>${opt}</span>
          <i class="ti ti-circle" style="font-size:18px; color:var(--color-text-tertiary);"></i>
        </button>
      `).join("")}
    </div>
  `;
  
  // Bind options click listeners
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
  
  // Disable all options
  allOptions.forEach(opt => opt.disabled = true);
  
  if (selectedIdx === correctIdx) {
    // Correct!
    clickedBtn.classList.add("correct");
    clickedBtn.querySelector("i").className = "ti ti-circle-check-filled";
    correctAnswersCount++;
    state.xp += 10;
  } else {
    // Incorrect!
    clickedBtn.classList.add("incorrect");
    clickedBtn.querySelector("i").className = "ti ti-circle-x-filled";
    
    // Highlight correct option
    const correctBtn = allOptions[correctIdx];
    correctBtn.classList.add("correct");
    correctBtn.querySelector("i").className = "ti ti-circle-check-filled";
  }
  
  // Save State
  saveState();
  
  // Load next question or complete after 1.8 seconds delay
  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < activeQuizQuestions.length) {
      renderQuizQuestion();
    } else {
      finishQuiz();
    }
  }, 1800);
}

function finishQuiz() {
  const container = document.getElementById("quiz-content-area");
  if (!container) return;
  
  state.completedToday.quiz = true;
  state.streak++; // increment streak
  state.xp += 25; // complete bonus
  saveState();
  updateStreakBadge();
  
  container.innerHTML = `
    <div style="text-align: center; padding: 30px 10px; display:flex; flex-direction:column; align-items:center; gap:20px;">
      <div class="c-coral" style="width: 72px; height: 72px; border-radius: 50%; display:flex; align-items:center; justify-content:center; box-shadow: var(--shadow-lg);">
        <i class="ti ti-trophy" style="font-size:36px; color:#ffffff;"></i>
      </div>
      <div>
        <h2 style="font-size:22px; font-weight:700; margin:0 0 8px;">Quiz Tamamlandı!</h2>
        <p style="font-size:14px; color:var(--color-text-secondary); margin:0;">
          Tebrikler Baris, bugünkü hızlı quizi bitirdin.
        </p>
      </div>
      
      <div style="background: var(--color-background-secondary); border-radius: var(--border-radius-lg); padding: 18px; width: 100%; display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin: 10px 0;">
        <div style="text-align:center; border-right: 1px solid var(--color-border-primary);">
          <p style="font-size:12px; color:var(--color-text-secondary); margin:0 0 4px;">Skor</p>
          <p style="font-size:20px; font-weight:700; margin:0; color:var(--theme-coral);">${correctAnswersCount} / 5</p>
        </div>
        <div style="text-align:center;">
          <p style="font-size:12px; color:var(--color-text-secondary); margin:0 0 4px;">Kazanılan XP</p>
          <p style="font-size:20px; font-weight:700; margin:0; color:var(--theme-teal);">+${correctAnswersCount * 10 + 25}</p>
        </div>
      </div>
      
      <div style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:600; color:var(--theme-purple);">
        <i class="ti ti-flame" style="font-size:18px;"></i> Günlük seri: ${state.streak} güne yükseldi!
      </div>
      
      <button class="c-purple" style="width:100%; border:none; padding:14px; border-radius:var(--border-radius-lg); font-size:14px; font-weight:600; cursor:pointer; color:#ffffff; margin-top:10px;" id="quiz-done-btn">
        Ana Sayfaya Dön
      </button>
    </div>
  `;
  
  document.getElementById("quiz-done-btn")?.addEventListener("click", () => {
    showScreen("home");
  });
}

// ANALYTICS SCREEN RENDERING
function renderAnalyticsScreen() {
  // Overall progress
  const total = countTotalLessons();
  const completed = state.completedLessons.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  document.getElementById("analytics-overall-percent").textContent = `${pct}%`;
  document.getElementById("analytics-completed-text").textContent = `${completed} / ${total} ders tamamlandı`;
  document.getElementById("analytics-xp-text").textContent = `${state.xp} Toplam XP`;
  
  // Render categories progress details
  const detailsContainer = document.getElementById("analytics-categories-details");
  if (detailsContainer) {
    detailsContainer.innerHTML = "";
    LESSONS_DATA.forEach(cat => {
      let catTotal = 0;
      cat.subcategories.forEach(sub => catTotal += sub.lessons.length);
      
      let catCompleted = 0;
      cat.subcategories.forEach(sub => {
        sub.lessons.forEach(l => {
          if (state.completedLessons.includes(l.id)) {
            catCompleted++;
          }
        });
      });
      
      const catPct = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;
      
      const item = document.createElement("div");
      item.style = "border: 1px solid var(--color-border-primary); border-radius: var(--border-radius-lg); padding: 14px; margin-bottom:12px;";
      item.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <i class="ti ${cat.icon}" style="font-size:18px; color:var(--theme-${cat.color});"></i>
            <span style="font-size:13.5px; font-weight:600;">${cat.name}</span>
          </div>
          <span style="font-size:13px; font-weight:600; color:var(--theme-${cat.color});">${catPct}%</span>
        </div>
        <div style="height: 6px; background: var(--color-background-secondary); border-radius: 99px; overflow:hidden; margin-bottom:6px;">
          <div style="width: ${catPct}%; height:100%; background: var(--theme-${cat.color}); border-radius:99px;"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--color-text-secondary);">
          <span>${catCompleted}/${catTotal} ders</span>
          <span>${cat.subcategories.length} alt başlık</span>
        </div>
      `;
      detailsContainer.appendChild(item);
    });
  }
  
  // Render Streak Calendar grid
  const calendarGrid = document.getElementById("streak-calendar-grid");
  if (calendarGrid) {
    calendarGrid.innerHTML = "";
    const days = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];
    
    // Header row
    days.forEach(d => {
      const header = document.createElement("div");
      header.style = "text-align:center; font-size:11px; font-weight:600; color:var(--color-text-tertiary); padding:4px 0;";
      header.textContent = d;
      calendarGrid.appendChild(header);
    });
    
    // Calendar days for past 4 weeks
    const today = new Date();
    const startDay = new Date();
    startDay.setDate(today.getDate() - 27); // 4 weeks ago
    
    // Adjust start day to nearest Monday
    const dayOfWeek = startDay.getDay(); // 0 is Sunday, 1 is Monday
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDay.setDate(startDay.getDate() - diffToMonday);
    
    for (let i = 0; i < 28; i++) {
      const cellDate = new Date(startDay);
      cellDate.setDate(startDay.getDate() + i);
      
      const cell = document.createElement("div");
      cell.className = "calendar-day";
      cell.textContent = cellDate.getDate();
      
      // Highlight today
      if (cellDate.toDateString() === today.toDateString()) {
        cell.classList.add("active");
      }
      
      // Mock completed study days (streak indicator)
      // Highlight past active days corresponding to our streak
      const dayDiff = Math.ceil((today - cellDate) / (1000 * 60 * 60 * 24));
      if (dayDiff > 0 && dayDiff <= state.streak) {
        cell.classList.add("completed");
      }
      
      calendarGrid.appendChild(cell);
    }
  }
}

// PROFILE SCREEN RENDERING
function renderProfileScreen() {
  document.getElementById("profile-name-input").value = state.userName;
  
  // Theme indicator display
  const switchEl = document.getElementById("profile-theme-switch");
  if (switchEl) {
    switchEl.onclick = toggleTheme;
  }
  
  // Save button binding
  const saveBtn = document.getElementById("profile-save-btn");
  if (saveBtn) {
    saveBtn.onclick = () => {
      const inputVal = document.getElementById("profile-name-input").value.trim();
      if (inputVal) {
        state.userName = inputVal;
        saveState();
        alert("Profil ismi güncellendi!");
        showScreen("home");
      }
    };
  }
  
  // Reset progress binding
  const resetBtn = document.getElementById("profile-reset-btn");
  if (resetBtn) {
    resetBtn.onclick = () => {
      if (confirm("Tüm ders tamamlama, streak ve XP ilerlemenizi sıfırlamak istediğinizden emin misiniz?")) {
        state.completedLessons = [];
        state.streak = 1;
        state.xp = 0;
        state.completedToday = { flashcards: false, quiz: false };
        saveState();
        showScreen("home");
      }
    };
  }
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
