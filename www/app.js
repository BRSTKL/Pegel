// app.js - Pegel German App Core Logic (Multi-Level: A1-A2 & B1)

// Per-level progress template
function emptyLevelProgress() {
  return {
    completedLessons: [],
    leseverstehenAnswers: {}, leseverstehenProgress: {},
    sprachbausteineAnswers: {}, sprachbausteineProgress: {},
    hoerverstehenAnswers: {}, hoerverstehenProgress: {},
    prepScores: {}, starredPreps: [],
    myVocabulary: [],
  };
}

// State management
let state = {
  // Global (level-independent)
  userName: "Baris",
  activeLevel: "B1",
  streak: 0,
  xp: 0,
  completedToday: { flashcards: false, quiz: false },
  currentScreen: "home",
  appVersion: 5,
  activeCategory: "verben",
  expandedSubcategories: {},
  theme: "dark",
  quizHistory: [],
  lastActiveDate: "",
  activeDates: [],
  activeLeseverstehenPart: 1,
  activeSprachbausteinePart: 1,
  activeHoerverstehenPart: 1,

  // Per-level progress
  progress: {
    "A1-A2": emptyLevelProgress(),
    "B1": emptyLevelProgress(),
  }
};

// Sound playback and haptic vibration utility
function playSound(type) {
  // Play sound (except for click)
  if (type !== "click") {
    try {
      const audio = new Audio(`sounds/${type}.mp3`);
      if (type === "true" || type === "false") {
        audio.volume = 0.65; // Soften correct/incorrect sounds slightly
      } else {
        audio.volume = 0.8; // Standard volume for done sound
      }
      audio.play().catch(err => console.log("Sound play error:", err));
    } catch (e) {
      console.error("Audio creation failed:", e);
    }
  }

  // Trigger phone haptic feedback vibration
  try {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
      const Haptics = window.Capacitor.Plugins.Haptics;
      if (type === "true" || type === "done") {
        Haptics.notification({ type: "SUCCESS" });
      } else if (type === "false") {
        Haptics.notification({ type: "ERROR" });
      } else if (type === "click") {
        Haptics.impact({ style: "LIGHT" });
      }
    } else {
      // Fallback for Web PWA environments (like Vercel deployed app)
      if (navigator.vibrate) {
        // Android and other browsers supporting HTML5 Vibration API
        if (type === "true" || type === "done") {
          navigator.vibrate([40, 40, 40]);
        } else if (type === "false") {
          navigator.vibrate([80, 50, 80, 50]);
        } else if (type === "click") {
          navigator.vibrate(15); // Clear button tap feedback (15ms)
        }
      } else {
        // iOS Safari / iOS PWA switch haptic workaround
        const triggerIosHaptic = () => {
          try {
            const label = document.createElement("label");
            label.ariaHidden = "true";
            label.style.display = "none";
            label.addEventListener("click", (e) => e.stopPropagation()); // Prevent recursion
            const input = document.createElement("input");
            input.type = "checkbox";
            input.setAttribute("switch", "");
            input.addEventListener("click", (e) => e.stopPropagation()); // Prevent recursion
            label.appendChild(input);
            document.head.appendChild(label);
            label.click();
            document.head.removeChild(label);
          } catch (err) {
            console.warn("iOS haptic workaround failed:", err);
          }
        };

        if (type === "true" || type === "done") {
          triggerIosHaptic();
          setTimeout(triggerIosHaptic, 120);
        } else if (type === "false") {
          triggerIosHaptic();
          setTimeout(triggerIosHaptic, 120);
          setTimeout(triggerIosHaptic, 240);
        } else if (type === "click") {
          triggerIosHaptic();
        }
      }
    }
  } catch (e) {
    console.warn("Haptic feedback failed:", e);
  }
}

// Global click sound feedback
document.addEventListener("click", (e) => {
  // Ignore clicks inside <head> or on hidden/aria-hidden elements to avoid feedback loops
  if (e.target.closest("head") || e.target.closest("[aria-hidden='true']")) {
    return;
  }
  // Check if click target or its parent is interactive
  const target = e.target.closest("button, a, input, select, textarea, [onclick]");
  if (target) {
    if (target.disabled || target.hasAttribute("disabled") || window.getComputedStyle(target).pointerEvents === "none") {
      return;
    }
    playSound("click");
    return;
  }
  
  let el = e.target;
  while (el && el !== document.body) {
    if (window.getComputedStyle(el).pointerEvents === "none") {
      return;
    }
    if (window.getComputedStyle(el).cursor === "pointer" || el.classList.contains("interactive-element")) {
      playSound("click");
      break;
    }
    el = el.parentElement;
  }
});

// --- Level Helper Functions ---
function getLevelProgress() {
  if (!state.progress) state.progress = { "A1-A2": emptyLevelProgress(), "B1": emptyLevelProgress() };
  if (!state.progress[state.activeLevel]) state.progress[state.activeLevel] = emptyLevelProgress();
  return state.progress[state.activeLevel];
}

function getActiveLessonsData() {
  return state.activeLevel === "A1-A2" ? LESSONS_DATA_A1A2 : LESSONS_DATA_B1;
}

function getActiveHoerData(teil) {
  const t = teil !== undefined ? teil : (state.activeHoerverstehenPart || 1);
  const a1a2 = { 1: HOERVERSTEHEN_TEIL_1_DATA_A1A2 };
  const b1 = { 1: HOERVERSTEHEN_TEIL_1_DATA_B1 };
  return (state.activeLevel === "A1-A2" ? a1a2 : b1)[t] || [];
}

function getActiveLeseverstehenData(teil) {
  const t = teil !== undefined ? teil : (state.activeLeseverstehenPart || 1);
  const a1a2 = { 1: LESEVERSTEHEN_TEIL_1_DATA_A1A2, 2: LESEVERSTEHEN_TEIL_2_DATA_A1A2, 3: LESEVERSTEHEN_TEIL_3_DATA_A1A2 };
  const b1 = { 1: LESEVERSTEHEN_TEIL_1_DATA_B1, 2: LESEVERSTEHEN_TEIL_2_DATA_B1, 3: LESEVERSTEHEN_TEIL_3_DATA_B1 };
  return (state.activeLevel === "A1-A2" ? a1a2 : b1)[t] || [];
}

function getActiveSprachbausteineData(teil) {
  const t = teil !== undefined ? teil : (state.activeSprachbausteinePart || 1);
  const a1a2 = { 1: SPRACHBAUSTEINE_TEIL_1_DATA_A1A2, 2: SPRACHBAUSTEINE_TEIL_2_DATA_A1A2 };
  const b1 = { 1: SPRACHBAUSTEINE_TEIL_1_DATA_B1, 2: SPRACHBAUSTEINE_TEIL_2_DATA_B1 };
  return (state.activeLevel === "A1-A2" ? a1a2 : b1)[t] || [];
}

function getActiveLessonQuizzes() {
  return state.activeLevel === "A1-A2" ? LESSON_QUIZZES_A1A2 : LESSON_QUIZZES_B1;
}

function switchLevel(level) {
  state.activeLevel = level;
  const firstCat = getActiveLessonsData()[0];
  if (firstCat) state.activeCategory = firstCat.id;
  saveState();
  showScreen("home");
  renderHomeScreen();
}

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

// Helper to save state locally (no timestamp update, no cloud push)
function saveStateLocally() {
  localStorage.setItem("b1_app_state", JSON.stringify(state));
}

let cloudSyncTimeout = null;

// Helper to save state (updates timestamp, saves locally, debounces cloud push)
function saveState() {
  state.lastModifiedAt = new Date().toISOString();
  saveStateLocally();
  
  if (window.Auth && !localStorage.getItem("pegel_guest_session")) {
    if (cloudSyncTimeout) clearTimeout(cloudSyncTimeout);
    cloudSyncTimeout = setTimeout(() => {
      Auth.pushState(state).catch(err => {
        console.warn("Cloud save failed:", err);
      });
    }, 1500); // 1.5 second debounce delay
  }
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

  const loadedVersion = saved ? (savedParsed.appVersion || 1) : 5;

  state = { ...state, ...savedParsed };

  // Force reset state if below version 4
  if (loadedVersion < 4) {
    state.xp = 0;
    state.streak = 0;
    state.completedToday = { flashcards: false, quiz: false };
    state.progress = { "A1-A2": emptyLevelProgress(), "B1": emptyLevelProgress() };
    state.activeLevel = "B1";
    state.appVersion = 5;
    saveStateLocally();
  }

  // Migrate from appVersion 4 to 5: move flat fields into progress structure
  if (!state.progress) {
    state.progress = {
      "A1-A2": emptyLevelProgress(),
      "B1": {
        completedLessons: savedParsed.completedLessons || [],
        leseverstehenAnswers: savedParsed.leseverstehenAnswers || {},
        leseverstehenProgress: savedParsed.leseverstehenProgress || {},
        sprachbausteineAnswers: savedParsed.sprachbausteineAnswers || {},
        sprachbausteineProgress: savedParsed.sprachbausteineProgress || {},
        hoerverstehenAnswers: savedParsed.hoerverstehenAnswers || {},
        hoerverstehenProgress: savedParsed.hoerverstehenProgress || {},
        prepScores: savedParsed.prepScores || {},
        starredPreps: savedParsed.starredPreps || [],
        myVocabulary: savedParsed.myVocabulary || [],
      }
    };
    if (!state.activeLevel) state.activeLevel = "B1";
    state.appVersion = 5;
    saveStateLocally();
  }

  // Ensure progress structure is complete for all levels
  if (!state.progress["A1-A2"]) state.progress["A1-A2"] = emptyLevelProgress();
  if (!state.progress["B1"]) state.progress["B1"] = emptyLevelProgress();
  const lp = getLevelProgress();
  if (!lp.completedLessons) lp.completedLessons = [];
  if (!lp.leseverstehenAnswers) lp.leseverstehenAnswers = {};
  if (!lp.leseverstehenProgress) lp.leseverstehenProgress = {};
  if (!lp.sprachbausteineAnswers) lp.sprachbausteineAnswers = {};
  if (!lp.sprachbausteineProgress) lp.sprachbausteineProgress = {};
  if (!lp.hoerverstehenAnswers) lp.hoerverstehenAnswers = {};
  if (!lp.hoerverstehenProgress) lp.hoerverstehenProgress = {};
  if (!lp.prepScores) lp.prepScores = {};
  if (!lp.starredPreps) lp.starredPreps = [];
  if (!lp.myVocabulary) lp.myVocabulary = [];

  if (!state.activeLeseverstehenPart) state.activeLeseverstehenPart = 1;
  if (!state.activeSprachbausteinePart) state.activeSprachbausteinePart = 1;
  if (!state.activeHoerverstehenPart) state.activeHoerverstehenPart = 1;

  // Safe migrations for activeDates tracking
  if (!state.activeDates) {
    state.activeDates = [];
    if (state.streak && state.streak > 0) {
      const todayDate = new Date();
      for (let i = 0; i < state.streak; i++) {
        const d = new Date();
        d.setDate(todayDate.getDate() - i);
        state.activeDates.push(d.toDateString());
      }
    }
  }

  // Backwards compatibility for completed activities today
  const completedSomethingToday = state.completedToday.flashcards || state.completedToday.quiz || getLevelProgress().completedLessons.length > 0;
  if (completedSomethingToday) {
    const todayStr = new Date().toDateString();
    if (!state.activeDates.includes(todayStr)) {
      state.activeDates.push(todayStr);
    }
  }

  // Keep state.streak in sync with actual sequence of active days
  state.streak = calculateStreak();

  const today = new Date().toDateString();
  if (state.lastActiveDate && state.lastActiveDate !== today) {
    state.completedToday.flashcards = false;
    state.completedToday.quiz = false;
  }
  state.lastActiveDate = today;
  saveStateLocally();
}

let lastSyncCheckTime = 0;

async function pullAndMergeState() {
  if (window.Auth && !localStorage.getItem("pegel_guest_session")) {
    const now = Date.now();
    // 10-second cooldown to prevent excessive API requests
    if (now - lastSyncCheckTime < 10000) return;
    lastSyncCheckTime = now;
    
    try {
      const cloudState = await Auth.fetchState();
      if (cloudState) {
        const localTime = new Date(state.lastModifiedAt || 0).getTime();
        const cloudTime = new Date(cloudState.lastModifiedAt || 0).getTime();
        
        // Last-Writer-Wins: Only overwrite if cloud state has a newer modification timestamp
        if (cloudTime > localTime) {
          const currentName = state.userName;
          state = { ...state, ...cloudState };
          state.userName = currentName;
          
          // Save locally
          saveStateLocally();
          
          // Refresh active screen display
          refreshCurrentScreen();
        } else if (localTime > cloudTime) {
          // Local is newer (e.g. offline edits), push back to cloud
          Auth.pushState(state).catch(err => console.warn("Cloud push failed during merge:", err));
        }
      }
    } catch (err) {
      console.warn("Cloud synchronization failed:", err);
    }
  }
}

function refreshCurrentScreen() {
  const screenId = state.currentScreen || "home";
  if (screenId === "home") renderHomeScreen();
  else if (screenId === "sitemap") renderSitemapScreen();
  else if (screenId === "verben-prep-dashboard") renderPrepDashboard();
  else if (screenId === "analytics") renderAnalyticsScreen();
  else if (screenId === "profile") renderProfileScreen();
  else if (screenId === "leseverstehen-dashboard") renderLeseverstehenDashboard();
  else if (screenId === "sprachbausteine-dashboard") renderSprachbausteineDashboard();
  else if (screenId === "myvocab") renderMyVocabScreen();
}

// Auto-sync when the browser window gains focus or the app tab becomes visible
window.addEventListener("focus", pullAndMergeState);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    pullAndMergeState();
  }
});

// ================= LOGIN SCREEN LOGIC =================
function initLoginScreen() {
  // Tab switching
  document.querySelectorAll(".login-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".login-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const tabName = tab.getAttribute("data-tab");
      const signinForm = document.getElementById("signin-form");
      const signupForm = document.getElementById("signup-form");
      if (tabName === "signin") {
        signinForm?.classList.remove("hidden");
        signupForm?.classList.add("hidden");
      } else {
        signinForm?.classList.add("hidden");
        signupForm?.classList.remove("hidden");
      }
      // Clear errors
      const signinErr = document.getElementById("signin-error");
      const signupErr = document.getElementById("signup-error");
      if (signinErr) signinErr.textContent = "";
      if (signupErr) signupErr.textContent = "";
    });
  });

  // Helper: show spinner, disable button
  function setLoading(btn, loading) {
    const textEl = btn.querySelector(".login-btn-text");
    const spinnerEl = btn.querySelector(".login-spinner");
    if (loading) {
      btn.disabled = true;
      if (textEl) textEl.style.display = "none";
      if (spinnerEl) spinnerEl.classList.remove("hidden");
    } else {
      btn.disabled = false;
      if (textEl) textEl.style.display = "";
      if (spinnerEl) spinnerEl.classList.add("hidden");
    }
  }

  // Helper: show error with shake
  function showError(errorEl, message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    const form = errorEl.closest(".login-form");
    if (form) {
      form.classList.remove("login-shake");
      void form.offsetWidth; // trigger reflow
      form.classList.add("login-shake");
    }
  }

  // Helper: after successful auth, transition to home
  async function onAuthSuccess(displayName) {
    if (window.Auth) {
      try {
        const cloudState = await Auth.fetchState();
        if (cloudState) {
          const localTime = new Date(state.lastModifiedAt || 0).getTime();
          const cloudTime = new Date(cloudState.lastModifiedAt || 0).getTime();
          if (cloudTime > localTime) {
            state = { ...state, ...cloudState };
            saveStateLocally();
          } else if (localTime > cloudTime) {
            Auth.pushState(state).catch(err => console.warn("Push on auth success failed:", err));
          }
        } else {
          Auth.pushState(state).catch(err => console.warn("Push on auth success failed:", err));
        }
      } catch (e) {
        console.error("Failed to fetch cloud state on login:", e);
      }
    }
    state.userName = displayName || "Kullanıcı";
    saveStateLocally();
    const bottomNav = document.getElementById("main-bottom-nav");
    if (bottomNav) bottomNav.classList.remove("hidden");
    showScreen("home");
  }

  // Sign In
  document.getElementById("signin-btn")?.addEventListener("click", async () => {
    const emailInput = document.getElementById("signin-email");
    const passInput = document.getElementById("signin-password");
    const errorEl = document.getElementById("signin-error");
    const btn = document.getElementById("signin-btn");

    const email = emailInput?.value.trim() || "";
    const password = passInput?.value || "";

    if (!email || !password) {
      showError(errorEl, "E-posta ve şifre alanları boş bırakılamaz.");
      return;
    }

    setLoading(btn, true);

    if (window.Auth) {
      const { data, error } = await Auth.signIn(email, password);
      setLoading(btn, false);
      if (error) {
        showError(errorEl, error.message || "Giriş başarısız. Lütfen tekrar deneyin.");
        return;
      }
      const displayName = data?.user?.user_metadata?.display_name || email.split("@")[0];
      onAuthSuccess(displayName);
    } else {
      setLoading(btn, false);
      showError(errorEl, "Kimlik doğrulama servisi yüklenemedi.");
    }
  });

  // Sign Up
  document.getElementById("signup-btn")?.addEventListener("click", async () => {
    const nameInput = document.getElementById("signup-name");
    const emailInput = document.getElementById("signup-email");
    const passInput = document.getElementById("signup-password");
    const errorEl = document.getElementById("signup-error");
    const btn = document.getElementById("signup-btn");

    const fullName = nameInput?.value.trim() || "";
    const email = emailInput?.value.trim() || "";
    const password = passInput?.value || "";

    if (!fullName || !email || !password) {
      showError(errorEl, "Tüm alanları doldurunuz.");
      return;
    }
    if (password.length < 6) {
      showError(errorEl, "Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(btn, true);

    if (window.Auth) {
      const { data, error } = await Auth.signUp(email, password, fullName);
      setLoading(btn, false);
      if (error) {
        showError(errorEl, error.message || "Kayıt başarısız. Lütfen tekrar deneyin.");
        return;
      }
      onAuthSuccess(fullName);
    } else {
      setLoading(btn, false);
      showError(errorEl, "Kimlik doğrulama servisi yüklenemedi.");
    }
  });

  // Guest entry
  document.getElementById("guest-btn")?.addEventListener("click", () => {
    localStorage.setItem("pegel_guest_session", "true");
    state.userName = "Misafir";
    saveState();
    const bottomNav = document.getElementById("main-bottom-nav");
    if (bottomNav) bottomNav.classList.remove("hidden");
    showScreen("home");
  });

  // Enter key support for login forms
  document.getElementById("signin-password")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("signin-btn")?.click();
  });
  document.getElementById("signup-password")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") document.getElementById("signup-btn")?.click();
  });
}

// Initializing the application
document.addEventListener("DOMContentLoaded", async () => {
  if (window.Capacitor) {
    document.body.classList.add("is-native");
  }
  loadState();
  applyTheme();
  initNav();
  initLoginScreen();

  // Check authentication state
  const bottomNav = document.getElementById("main-bottom-nav");
  let isLoggedIn = false;

  if (window.Auth) {
    try {
      const { user } = await Auth.getCurrentUser();
      if (user) {
        isLoggedIn = true;
        // Update userName from auth profile
        const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Kullanıcı";
        state.userName = displayName;
        
        // Fetch progress from cloud on startup
        try {
          const cloudState = await Auth.fetchState();
          if (cloudState) {
            const localTime = new Date(state.lastModifiedAt || 0).getTime();
            const cloudTime = new Date(cloudState.lastModifiedAt || 0).getTime();
            if (cloudTime > localTime) {
              state = { ...state, ...cloudState };
              state.userName = displayName; // preserve display name
              saveStateLocally();
            } else if (localTime > cloudTime) {
              Auth.pushState(state).catch(err => console.warn("Startup cloud push failed:", err));
            }
          } else {
            Auth.pushState(state).catch(err => console.warn("Startup cloud push failed:", err));
          }
        } catch (err) {
          console.error("Failed to fetch cloud state on app launch:", err);
        }
      }
    } catch (e) {
      console.warn("Auth check failed, falling back to guest mode:", e);
    }
  }

  // Also treat as logged in if guest session exists
  if (!isLoggedIn && localStorage.getItem("pegel_guest_session")) {
    isLoggedIn = true;
  }

  if (isLoggedIn) {
    // Show main app
    if (bottomNav) bottomNav.classList.remove("hidden");
    showScreen("home");
  } else {
    // Show login screen
    if (bottomNav) bottomNav.classList.add("hidden");
    showScreen("login");
  }
  updateStreakBadge();
  initProgressRive();

  // Home Screen Level Switcher Interactivity
  const homeLevelBtn = document.getElementById("home-level-btn");
  const homeLevelDropdown = document.getElementById("home-level-dropdown");
  if (homeLevelBtn && homeLevelDropdown) {
    homeLevelBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      homeLevelDropdown.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
      if (!homeLevelDropdown.classList.contains("hidden") && !homeLevelDropdown.contains(e.target) && e.target !== homeLevelBtn) {
        homeLevelDropdown.classList.add("hidden");
      }
    });
  }
  const homeProfileAvatar = document.getElementById("home-profile-avatar");
  if (homeProfileAvatar) {
    homeProfileAvatar.addEventListener("click", () => {
      showScreen("profile");
    });
  }
  
  // Floating Answer Island & Modal event listeners
  const floatingBtn = document.getElementById("floating-answer-island");
  const modalOverlay = document.getElementById("answer-modal-overlay");
  const modalCloseBtn = document.getElementById("answer-modal-close-btn");
  const modalBackdrop = document.querySelector(".answer-modal-backdrop");

  const openAnswerModal = () => {
    modalOverlay?.classList.remove("hidden");
  };

  const closeAnswerModal = () => {
    modalOverlay?.classList.add("hidden");
  };

  floatingBtn?.addEventListener("click", openAnswerModal);
  modalCloseBtn?.addEventListener("click", closeAnswerModal);
  modalBackdrop?.addEventListener("click", closeAnswerModal);

  // Lesson Preview overlay close triggers
  const lessonPreviewOverlay = document.getElementById("lesson-preview-overlay");
  const lessonPreviewCloseBtn = document.getElementById("lesson-preview-close-btn");
  const lessonPreviewBackdrop = document.getElementById("lesson-preview-backdrop");

  const closeLessonPreview = () => {
    lessonPreviewOverlay?.classList.add("hidden");
  };

  lessonPreviewCloseBtn?.addEventListener("click", closeLessonPreview);
  lessonPreviewBackdrop?.addEventListener("click", closeLessonPreview);

  // Close modals with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modalOverlay && !modalOverlay.classList.contains("hidden")) {
        closeAnswerModal();
      }
      if (lessonPreviewOverlay && !lessonPreviewOverlay.classList.contains("hidden")) {
        closeLessonPreview();
      }
    }
  });
  
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

  // Logout button
  document.getElementById("profile-logout-btn")?.addEventListener("click", async () => {
    if (confirm("Oturumunuzu kapatmak istediğinize emin misiniz?")) {
      if (window.Auth) {
        await Auth.signOut();
      }
      localStorage.removeItem("pegel_guest_session");
      localStorage.removeItem("pegel_local_active_user");
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
    
    if (!getLevelProgress().myVocabulary) getLevelProgress().myVocabulary = [];
    
    const existingIndex = getLevelProgress().myVocabulary.findIndex(item => item.word.toLowerCase() === word.toLowerCase());
    if (existingIndex > -1) {
      getLevelProgress().myVocabulary[existingIndex] = {
        id: getLevelProgress().myVocabulary[existingIndex].id,
        word,
        translation,
        context,
        dateAdded: new Date().toLocaleDateString()
      };
    } else {
      getLevelProgress().myVocabulary.push({
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

  initHoerverstehen();
});

// ================= HÖRVERSTEHEN GAME ENGINE =================
let activeHoerverstehenGame = null;
let hoerverstehenSubmitted = false;

function initHoerverstehen() {
  // Launch from Exercises page
  document.getElementById("launcher-hoerverstehen")?.addEventListener("click", () => {
    showScreen("hoerverstehen-parts");
  });

  // Launch dashboard from part selection
  document.querySelectorAll(".hoerverstehen-part-card").forEach(card => {
    card.addEventListener("click", () => {
      const part = parseInt(card.getAttribute("data-part")) || 1;
      state.activeHoerverstehenPart = part;
      saveStateLocally();
      showScreen("hoerverstehen-dashboard");
    });
  });

  // Audio Play/Pause Button
  const playBtn = document.getElementById("hoerverstehen-play-btn");
  const playIcon = document.getElementById("hoerverstehen-play-icon");
  const audio = document.getElementById("hoerverstehen-audio");

  playBtn?.addEventListener("click", () => {
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => {
        if (playIcon) playIcon.className = "ti ti-pause";
      }).catch(err => console.error("Audio playback failed:", err));
    } else {
      audio.pause();
      if (playIcon) playIcon.className = "ti ti-play";
    }
  });

  // Rewind 10s Button
  const rewindBtn = document.getElementById("hoerverstehen-rewind-btn");
  rewindBtn?.addEventListener("click", () => {
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  });

  // Progress Bar Seek
  const progressBar = document.getElementById("hoerverstehen-progress");
  progressBar?.addEventListener("input", (e) => {
    if (!audio || !audio.duration) return;
    const seekTime = (parseFloat(e.target.value) / 100) * audio.duration;
    audio.currentTime = seekTime;
  });

  // Update Progress Bar during playback
  audio?.addEventListener("timeupdate", () => {
    if (!audio || !audio.duration) return;
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    if (progressBar) progressBar.value = progressPercent;

    // Current Time display update
    const currentTimeEl = document.getElementById("hoerverstehen-current-time");
    if (currentTimeEl) {
      const mins = Math.floor(audio.currentTime / 60);
      const secs = Math.floor(audio.currentTime % 60);
      currentTimeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  });

  // Update Total Duration when metadata loads
  audio?.addEventListener("loadedmetadata", () => {
    if (!audio) return;
    const durationEl = document.getElementById("hoerverstehen-total-duration");
    if (durationEl) {
      const mins = Math.floor(audio.duration / 60);
      const secs = Math.floor(audio.duration % 60);
      durationEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  });

  // When audio finishes, reset play icon
  audio?.addEventListener("ended", () => {
    if (playIcon) playIcon.className = "ti ti-play";
    if (progressBar) progressBar.value = 0;
  });

  // Speed Control Button
  const speedBtn = document.getElementById("hoerverstehen-speed-btn");
  const speedMenu = document.getElementById("hoerverstehen-speed-menu");
  const speedLabel = document.getElementById("hoerverstehen-speed-label");

  speedBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    speedMenu?.classList.toggle("hidden");
  });

  // Close speed menu when clicking outside
  document.addEventListener("click", () => {
    speedMenu?.classList.add("hidden");
  });

  // Change speed options
  document.querySelectorAll(".hoerverstehen-speed-option").forEach(opt => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!audio) return;
      
      const speed = parseFloat(opt.getAttribute("data-speed")) || 1.0;
      audio.playbackRate = speed;
      
      if (speedLabel) speedLabel.textContent = `${speed}x`;
      
      document.querySelectorAll(".hoerverstehen-speed-option").forEach(o => {
        o.classList.remove("active");
        o.style.fontWeight = "normal";
      });
      opt.classList.add("active");
      opt.style.fontWeight = "600";
      
      speedMenu?.classList.add("hidden");
    });
  });

  // Section Jump Buttons (Skip intro, Repeat, etc.)
  document.querySelectorAll(".hoerverstehen-seek-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!audio) return;
      const targetTime = parseFloat(btn.getAttribute("data-time")) || 0;
      audio.currentTime = targetTime;
      
      // Auto play if paused
      if (audio.paused) {
        audio.play().then(() => {
          if (playIcon) playIcon.className = "ti ti-pause";
        }).catch(err => console.error("Auto-play on seek failed:", err));
      }
    });
  });

  // Submit Button
  const submitBtn = document.getElementById("hoerverstehen-submit-btn");
  submitBtn?.addEventListener("click", () => {
    if (hoerverstehenSubmitted) {
      showScreen("hoerverstehen-dashboard");
    } else {
      submitHoerverstehen();
    }
  });
}

function renderHoerverstehenDashboard() {
  const dbTitle = document.getElementById("hoerverstehen-dashboard-title");
  if (dbTitle) {
    dbTitle.textContent = `Dinleme Anlama · Teil ${state.activeHoerverstehenPart || 1}`;
  }

  const cardsGrid = document.getElementById("hoerverstehen-cards-grid");
  if (!cardsGrid) return;
  cardsGrid.innerHTML = "";

  // Select target data based on selected part
  let targetData = [];
  if (state.activeHoerverstehenPart === 1) {
    targetData = getActiveHoerData(1) || [];
  } else if (state.activeHoerverstehenPart === 2) {
    targetData = getActiveHoerData(2) || [];
  } else if (state.activeHoerverstehenPart === 3) {
    targetData = getActiveHoerData(3) || [];
  }

  let completedCount = 0;

  targetData.forEach(ex => {
    const attempts = getLevelProgress().hoerverstehenProgress[ex.id] || [];
    const attemptCount = attempts.length;
    if (attemptCount > 0) {
      completedCount++;
    }

    const card = document.createElement("div");
    card.className = "hoerverstehen-card";
    card.onclick = () => startNewHoerverstehen(ex.id);

    // 3 history badges
    let badgesHtml = "";
    for (let i = 0; i < 3; i++) {
      if (i < attemptCount) {
        const attempt = attempts[i];
        let scoreClass = "score-low";
        if (attempt.score >= 80) scoreClass = "score-high";
        else if (attempt.score >= 40) scoreClass = "score-med";
        badgesHtml += `<span class="hoerverstehen-badge-circle ${scoreClass}">${attempt.score}</span>`;
      } else {
        badgesHtml += `<span class="hoerverstehen-badge-circle">-</span>`;
      }
    }

    let attemptsLabel = "Deneme yapılmadı";
    if (attemptCount > 0) {
      attemptsLabel = `${attemptCount} deneme`;
    }

    const colors = ["c-purple-bg", "c-blue-bg", "c-teal-bg", "c-coral-bg", "c-pink-bg"];
    const colorClass = colors[targetData.indexOf(ex) % colors.length];

    card.innerHTML = `
      <div class="hoerverstehen-card-icon-wrapper ${colorClass}">
        <span class="hoerverstehen-card-emoji">${ex.emoji}</span>
      </div>
      <div class="hoerverstehen-card-details">
        <p class="hoerverstehen-card-title">${ex.title}</p>
        <p class="hoerverstehen-card-attempts">${attemptsLabel}</p>
      </div>
      <div class="hoerverstehen-card-badges">
        ${badgesHtml}
      </div>
    `;
    cardsGrid.appendChild(card);
  });

  // Update stats
  const totalCount = targetData.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const progressPercentEl = document.getElementById("hoerverstehen-progress-percent");
  const progressFillEl = document.getElementById("hoerverstehen-progress-fill");
  const progressCountEl = document.getElementById("hoerverstehen-progress-count");

  if (progressPercentEl) progressPercentEl.textContent = `${progressPercent}%`;
  if (progressFillEl) progressFillEl.style.width = `${progressPercent}%`;
  if (progressCountEl) progressCountEl.textContent = `${completedCount}/${totalCount} tamamlandı`;
}

function startNewHoerverstehen(exerciseId) {
  let ex = null;
  // Look up across all parts
  ex = (getActiveHoerData(1) || []).find(item => item.id === exerciseId) ||
       (getActiveHoerData(2) || []).find(item => item.id === exerciseId) ||
       (getActiveHoerData(3) || []).find(item => item.id === exerciseId);
       
  if (!ex) return;

  activeHoerverstehenGame = ex;
  hoerverstehenSubmitted = false;
  getLevelProgress().hoerverstehenAnswers = {};

  // Setup play screen title
  const playTitle = document.getElementById("hoerverstehen-play-title");
  if (playTitle) playTitle.textContent = ex.title;

  // Set audio source
  const audio = document.getElementById("hoerverstehen-audio");
  if (audio) {
    audio.src = ex.audioPath;
    audio.load();
    audio.playbackRate = 1.0;
  }

  // Reset audio UI controls
  const playIcon = document.getElementById("hoerverstehen-play-icon");
  if (playIcon) playIcon.className = "ti ti-play";
  
  const speedLabel = document.getElementById("hoerverstehen-speed-label");
  if (speedLabel) speedLabel.textContent = "1x";
  
  const currentTimeEl = document.getElementById("hoerverstehen-current-time");
  if (currentTimeEl) currentTimeEl.textContent = "0:00";
  
  const durationEl = document.getElementById("hoerverstehen-total-duration");
  if (durationEl) durationEl.textContent = "0:00";
  
  const progressBar = document.getElementById("hoerverstehen-progress");
  if (progressBar) progressBar.value = 0;

  // Dynamic seek button settings based on exercise ID
  const jumpContainer = document.getElementById("hoerverstehen-jump-container");
  if (jumpContainer) {
    if (ex.id === "ohne_vitamin_b") {
      jumpContainer.classList.remove("hidden");
    } else {
      jumpContainer.classList.add("hidden"); // hide for other exercises if they have no custom jump points
    }
  }

  showScreen("hoerverstehen-play");
}

function renderHoerverstehenScreen() {
  if (!activeHoerverstehenGame) return;
  const ex = activeHoerverstehenGame;

  // Set instruction
  const instructionEl = document.getElementById("hoerverstehen-instruction-text");
  if (instructionEl) instructionEl.textContent = ex.instruction;

  // Header questions label
  const qHeader = document.getElementById("hoerverstehen-questions-header");
  if (qHeader) {
    const qIds = ex.questions.map(q => q.id);
    if (qIds.length > 0) {
      qHeader.textContent = `Aufgaben ${Math.min(...qIds)}-${Math.max(...qIds)}`;
    }
  }

  // Render questions cards list
  const listContainer = document.getElementById("hoerverstehen-questions-list");
  if (!listContainer) return;
  listContainer.innerHTML = "";

  ex.questions.forEach(q => {
    const card = document.createElement("div");
    card.className = "interactive-card";
    card.style = "padding: 16px; border-radius: var(--border-radius-lg); border-left: 3px solid var(--theme-purple); background: var(--color-background-secondary); border-top: 1px solid var(--color-border-primary); border-right: 1px solid var(--color-border-primary); border-bottom: 1px solid var(--color-border-primary);";

    const userAns = getLevelProgress().hoerverstehenAnswers[q.id];
    const isRichtigSelected = userAns === "+";
    const isFalschSelected = userAns === "-";

    let rBtnClass = "hoerverstehen-option-btn";
    let fBtnClass = "hoerverstehen-option-btn";

    if (hoerverstehenSubmitted) {
      if (q.correct === "+") {
        rBtnClass += " correct";
        if (isFalschSelected) fBtnClass += " incorrect";
      } else {
        fBtnClass += " correct";
        if (isRichtigSelected) rBtnClass += " incorrect";
      }
    } else {
      if (isRichtigSelected) rBtnClass += " selected";
      if (isFalschSelected) fBtnClass += " selected";
    }

    let feedbackHtml = "";
    if (hoerverstehenSubmitted) {
      const isCorrect = userAns === q.correct;
      if (isCorrect) {
        feedbackHtml = `<div class="text-feedback-badge correct" style="margin-top: 10px;"><i class="ti ti-circle-check"></i> Doğru (Cevap: ${q.correct === "+" ? "Richtig" : "Falsch"})</div>`;
      } else {
        feedbackHtml = `<div class="text-feedback-badge incorrect" style="margin-top: 10px;"><i class="ti ti-circle-x"></i> Yanlış (Seçiminiz: ${userAns === "+" ? "Richtig" : (userAns === "-" ? "Falsch" : "Boş")}, Doğru: ${q.correct === "+" ? "Richtig" : "Falsch"})</div>`;
      }
    }

    card.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <span class="bubble-row-num" style="width:24px;height:24px;font-size:12px;flex-shrink:0;margin-top:2px;">${q.id}</span>
        <span style="font-size:13px;font-weight:600;color:var(--color-text-primary);line-height:1.4;">${q.text}</span>
      </div>
      <div class="hoerverstehen-options-container">
        <button class="${rBtnClass}" data-qid="${q.id}" data-val="+" ${hoerverstehenSubmitted ? 'disabled' : ''}>
          <i class="ti ti-plus" style="font-size:13px;"></i> Richtig (+)
        </button>
        <button class="${fBtnClass}" data-qid="${q.id}" data-val="-" ${hoerverstehenSubmitted ? 'disabled' : ''}>
          <i class="ti ti-minus" style="font-size:13px;"></i> Falsch (-)
        </button>
      </div>
      ${feedbackHtml}
    `;

    // Listeners for choices if not submitted
    if (!hoerverstehenSubmitted) {
      card.querySelectorAll(".hoerverstehen-option-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const qId = parseInt(btn.getAttribute("data-qid"));
          const val = btn.getAttribute("data-val");
          selectHoerverstehenAnswer(qId, val);
        });
      });
    }

    listContainer.appendChild(card);
  });

  // Footer button state
  const submitBtn = document.getElementById("hoerverstehen-submit-btn");
  if (submitBtn) {
    if (hoerverstehenSubmitted) {
      submitBtn.innerHTML = '<i class="ti ti-check"></i> Alıştırmayı Tamamla';
      submitBtn.className = "c-teal";
    } else {
      submitBtn.innerHTML = '<i class="ti ti-send"></i> Cevapları Gönder';
      submitBtn.className = "c-purple";
    }
  }
}

function selectHoerverstehenAnswer(qId, choice) {
  if (hoerverstehenSubmitted) return;
  if (getLevelProgress().hoerverstehenAnswers[qId] === choice) {
    getLevelProgress().hoerverstehenAnswers[qId] = null; // deselect
  } else {
    getLevelProgress().hoerverstehenAnswers[qId] = choice;
  }
  saveStateLocally();
  renderHoerverstehenScreen();
}

function submitHoerverstehen() {
  if (!activeHoerverstehenGame || hoerverstehenSubmitted) return;
  const ex = activeHoerverstehenGame;

  let correctCount = 0;
  const totalCount = ex.questions.length;

  ex.questions.forEach(q => {
    if (getLevelProgress().hoerverstehenAnswers[q.id] === q.correct) {
      correctCount++;
    }
  });

  hoerverstehenSubmitted = true;
  state.xp += correctCount * 10;
  playSound("done");

  // Record attempt in progress (scale to 100% regardless of question count)
  let attempts = getLevelProgress().hoerverstehenProgress[ex.id] || [];
  const finalScore = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  attempts.push({ score: finalScore });
  if (attempts.length > 3) attempts.shift();
  getLevelProgress().hoerverstehenProgress[ex.id] = attempts;

  logActiveDay();
  renderHoerverstehenScreen();
}

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

// Calculate user streak based on consecutive dates in state.activeDates
function calculateStreak() {
  if (!state.activeDates) state.activeDates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const activeSet = new Set(state.activeDates);
  
  let streak = 0;
  let checkDate = new Date(today);
  
  // Check if today is active
  if (activeSet.has(checkDate.toDateString())) {
    while (activeSet.has(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else {
    // If today is not active, check yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    while (activeSet.has(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }
  return streak;
}

// Log active day in history and recalculate streak
function logActiveDay() {
  if (!state.activeDates) state.activeDates = [];
  const todayStr = new Date().toDateString();
  if (!state.activeDates.includes(todayStr)) {
    state.activeDates.push(todayStr);
  }
  state.streak = calculateStreak();
  saveState();
  updateStreakBadge();
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

  // Pause hoerverstehen audio if navigating away
  if (screenId !== "hoerverstehen-play") {
    const audioEl = document.getElementById("hoerverstehen-audio");
    if (audioEl && !audioEl.paused) {
      audioEl.pause();
      const playIcon = document.getElementById("hoerverstehen-play-icon");
      if (playIcon) {
        playIcon.className = "ti ti-play";
      }
    }
  }

  // Hide all screens
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  
  // Remove active nav styling
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
  
  // Show target screen
  const targetScreen = document.getElementById(`${screenId}-screen`);
  if (targetScreen) {
    targetScreen.classList.remove("hidden");
    
    // Reset scroll positions of parent containers (.app-content, body, window)
    const appContent = document.querySelector(".app-content");
    if (appContent) {
      appContent.scrollTop = 0;
    }
    window.scrollTo(0, 0);

    // Reset scroll positions of the target screen and all inner elements
    targetScreen.scrollTop = 0;
    targetScreen.querySelectorAll("*").forEach(el => {
      el.scrollTop = 0;
    });
  }
  
  // Toggle bottom nav visibility - hide on login screen
  const bottomNav = document.getElementById("main-bottom-nav");
  if (screenId === "login") {
    bottomNav?.classList.add("hidden");
  } else {
    bottomNav?.classList.remove("hidden");
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
  } else if (screenId === "flashcard-play" || screenId === "quiz" || screenId === "fillblanks-play" || screenId === "verben-prep-dashboard" || screenId === "verben-prep-quiz" || screenId === "leseverstehen-play" || screenId === "leseverstehen-dashboard" || screenId === "leseverstehen-parts" || screenId === "sprachbausteine-play" || screenId === "sprachbausteine-dashboard" || screenId === "sprachbausteine-parts" || screenId === "hoerverstehen-play" || screenId === "hoerverstehen-dashboard" || screenId === "hoerverstehen-parts" || screenId === "myvocab") {
    navActiveId = "exercises";
  }
  const activeNav = document.querySelector(`.nav-item[data-screen="${navActiveId}"]`);
  if (activeNav) {
    activeNav.classList.add("active");
  }
  
  // Render specific screen content
  if (screenId === "home") {
    renderHomeScreen();
  } else if (screenId === "exercises") {
    const subtitle = document.getElementById("exercises-subtitle");
    if (subtitle) {
      subtitle.textContent = `${state.activeLevel} seviyesinde pratik yaparak bilgilerinizi pekiştirin.`;
    }
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
  } else if (screenId === "hoerverstehen-dashboard") {
    renderHoerverstehenDashboard();
  } else if (screenId === "hoerverstehen-play") {
    renderHoerverstehenScreen();
  } else if (screenId === "myvocab") {
    renderMyVocabScreen();
  }

  // Show/Hide Floating Answer Island
  const floatingAnswerIsland = document.getElementById("floating-answer-island");
  const leseverstehenModalGroup = document.getElementById("leseverstehen-modal-group");
  const sprachbausteineModalGroup = document.getElementById("sprachbausteine-modal-group");
  const answerModalOverlay = document.getElementById("answer-modal-overlay");

  // Reset modal states when changing screens
  answerModalOverlay?.classList.add("hidden");
  leseverstehenModalGroup?.classList.add("hidden");
  sprachbausteineModalGroup?.classList.add("hidden");

  if (screenId === "leseverstehen-play") {
    console.log("Entering leseverstehen-play screen, showing floating answer island");
    if (floatingAnswerIsland) {
      floatingAnswerIsland.classList.remove("hidden");
      floatingAnswerIsland.style.setProperty("display", "flex", "important");
    }
    leseverstehenModalGroup?.classList.remove("hidden");
  } else if (screenId === "sprachbausteine-play") {
    console.log("Entering sprachbausteine-play screen, showing floating answer island");
    if (floatingAnswerIsland) {
      floatingAnswerIsland.classList.remove("hidden");
      floatingAnswerIsland.style.setProperty("display", "flex", "important");
    }
    sprachbausteineModalGroup?.classList.remove("hidden");
  } else {
    if (floatingAnswerIsland) {
      floatingAnswerIsland.classList.add("hidden");
      floatingAnswerIsland.style.setProperty("display", "none", "important");
    }
  }
}

// RIVE PROGRESS BAR INTEGRATION
let progressRiveInstance = null;
let progressRiveInput = null;

// ================= SITEMAP ANIMATIONS ENGINE =================
const SITEMAP_ANIMATION_FILES = [
  { name: "boy.riv" },
  { name: "bunny.riv" },
  { name: "cat-character.riv" },
  { name: "cat_animation.riv" },
  { name: "cat_animation_2.riv" },
  { name: "client.riv" },
  { name: "handshake.riv" },
  { name: "happy-dog.riv" },
  { name: "house.riv" },
  { name: "octo.riv" },
  { name: "pirate.riv" },
  { name: "slap-the-pudding.riv" },
  { name: "teddy.riv" },
  { name: "x-mas-star.riv" }
];

let sitemapRiveInstances = [];

function cleanupSitemapAnimations() {
  sitemapRiveInstances.forEach(inst => {
    try {
      inst.cleanup();
    } catch (e) {
      console.error("Error cleaning up Rive instance:", e);
    }
  });
  sitemapRiveInstances = [];
}

function initSitemapRive(canvasId, animConfig) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  if (typeof rive === "undefined") {
    console.warn("Rive library is not loaded yet.");
    return;
  }
  
  try {
    let inst;
    const rConfig = {
      src: "animations/" + animConfig.name,
      canvas: canvas,
      autoplay: true,
      onLoad: () => {
        if (inst) {
          if (typeof inst.resizeDrawingSurfaceToCanvas === "function") {
            inst.resizeDrawingSurfaceToCanvas();
          } else if (typeof inst.resizeDrawingToCanvas === "function") {
            inst.resizeDrawingToCanvas();
          }
          
          // Fallback sequence to guarantee that all animations run their animated versions
          const sms = inst.stateMachineNames || [];
          const anims = inst.animationNames || [];
          
          if (sms.includes("State Machine 1")) {
            inst.play("State Machine 1");
          } else if (sms.includes("smile9")) {
            inst.play("smile9");
          } else if (sms.includes("Movement")) {
            inst.play("Movement");
          } else if (sms.includes("movement")) {
            inst.play("movement");
          } else if (sms.length > 0) {
            inst.play(sms[0]);
          } else if (anims.includes("idle")) {
            inst.play("idle");
          } else if (anims.includes("idle9")) {
            inst.play("idle9");
          } else if (anims.length > 0) {
            inst.play(anims[0]);
          } else {
            inst.play();
          }
        }
      },
      onLoadError: (err) => {
        console.error(`Rive load error for ${animConfig.name}:`, err);
      }
    };
    
    // Always register possible State Machine names as listeners to catch complex animations
    rConfig.stateMachines = ["State Machine 1", "smile9", "Movement", "movement"];
    
    inst = new rive.Rive(rConfig);
    sitemapRiveInstances.push(inst);
  } catch (e) {
    console.error(`Rive initialization error for ${animConfig.name}:`, e);
  }
}

function base64ToArrayBuffer(base64) {
  const cleanBase64 = base64.replace(/\s/g, '');
  const binaryString = atob(cleanBase64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function initProgressRive() {
  updateRiveProgress();
}

function updateRiveProgress() {
  const totalLessons = countTotalLessons();
  const completedCount = getLevelProgress().completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  const fill = document.getElementById("liquid-progress-fill");
  if (fill) {
    fill.style.width = progressPercent + "%";
  }
}

// HOME SCREEN RENDERING
function renderHomeScreen() {
  document.getElementById("profile-name").textContent = state.userName;

  const homeLevelBtn = document.getElementById("home-level-btn");
  const homeLevelBtnText = document.getElementById("home-level-btn-text");
  
  if (homeLevelBtn && homeLevelBtnText) {
    const isB1 = state.activeLevel === "B1";
    
    // Set text (only level names)
    homeLevelBtnText.textContent = isB1 ? "B1" : "A1-A2";
    
    // Set purple color theme for all levels
    homeLevelBtn.style.background = "var(--theme-purple-light)";
    homeLevelBtn.style.borderColor = "rgba(177, 159, 251, 0.2)";
    homeLevelBtn.style.color = "var(--theme-purple)";
  }

  const levelList = document.getElementById("home-level-list");
  if (levelList) {
    levelList.innerHTML = "";
    const levels = [
      { id: "A1-A2", label: "A1-A2", badge: "A1/2" },
      { id: "B1", label: "B1", badge: "B1" }
    ];
    levels.forEach(lvl => {
      const isActive = state.activeLevel === lvl.id;
      const option = document.createElement("div");
      option.style = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 6px 8px;
        border-radius: var(--border-radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
        background: ${isActive ? 'var(--theme-purple-light)' : 'transparent'};
        border: 1px solid ${isActive ? 'rgba(177, 159, 251, 0.2)' : 'transparent'};
      `;
      option.addEventListener("mouseenter", () => {
        if (!isActive) option.style.backgroundColor = "var(--color-background-tertiary)";
      });
      option.addEventListener("mouseleave", () => {
        if (!isActive) option.style.backgroundColor = "transparent";
      });
      option.addEventListener("click", () => {
        switchLevel(lvl.id);
        document.getElementById("home-level-dropdown")?.classList.add("hidden");
      });
      
      const leftPart = document.createElement("div");
      leftPart.style = "display: flex; align-items: center; gap: 8px;";
      
      const badge = document.createElement("div");
      badge.textContent = lvl.badge;
      badge.style = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9.5px;
        font-weight: 700;
        background: ${isActive ? 'var(--theme-purple)' : 'var(--color-background-tertiary)'};
        color: ${isActive ? 'var(--color-background-secondary)' : 'var(--color-text-secondary)'};
      `;
      
      const label = document.createElement("span");
      label.textContent = lvl.label;
      label.style = `
        font-size: 12px;
        font-weight: 500;
        color: ${isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'};
      `;
      
      leftPart.appendChild(badge);
      leftPart.appendChild(label);
      option.appendChild(leftPart);
      
      if (isActive) {
        const check = document.createElement("i");
        check.className = "ti ti-check";
        check.style = "font-size: 12px; color: var(--theme-purple);";
        option.appendChild(check);
      }
      
      levelList.appendChild(option);
    });
  }

  const levelLabel = document.getElementById("home-level-label");
  if (levelLabel) levelLabel.textContent = `${state.activeLevel} hedefine ilerleme`;

  const totalLessons = countTotalLessons();
  const completedCount = getLevelProgress().completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  document.getElementById("progress-text-percent").textContent = `${progressPercent}%`;
  updateRiveProgress();
  document.getElementById("completed-fraction").textContent = `${completedCount}/${totalLessons} tamamlandı`;
  
  const totalTopicsCount = document.getElementById("total-topics-count");
  if (totalTopicsCount) {
    totalTopicsCount.textContent = `${totalLessons} konu`;
  }
  
  updateStreakBadge();
  
  const fcText = document.getElementById("fc-status-text");
  if (fcText) {
    const vocabCount = (getLevelProgress().myVocabulary || []).length;
    fcText.textContent = state.completedToday.flashcards ? "Tamamlandı! 🎉" : `${vocabCount} kart bekliyor`;
  }
  const quizText = document.getElementById("quiz-status-text");
  if (quizText) {
    quizText.textContent = state.completedToday.quiz ? "Tamamlandı! 🎉" : "5 dakika";
  }
  
  // Devam et (Active topics) list
  const continueList = document.getElementById("continue-list");
  if (continueList) {
    continueList.innerHTML = "";
    
    getActiveLessonsData().forEach(cat => {
      cat.subcategories.forEach(sub => {
        const subLessons = sub.lessons;
        if (subLessons.length > 0) {
          const completedSub = subLessons.filter(l => getLevelProgress().completedLessons.includes(l.id)).length;
          
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
      
      for (const cat of getActiveLessonsData()) {
        for (const sub of cat.subcategories) {
          const subLessons = sub.lessons;
          if (subLessons.length > 0) {
            const completedSub = subLessons.filter(l => getLevelProgress().completedLessons.includes(l.id)).length;
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
        const completedSub = subLessons.filter(l => getLevelProgress().completedLessons.includes(l.id)).length;
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

    if (getActiveLessonsData().length === 0) {
      categoriesList.style.gridTemplateColumns = "1fr";
      categoriesList.innerHTML = `
        <div class="interactive-card" style="border-radius: var(--border-radius-lg); padding: 24px 20px; text-align:center; grid-column: 1 / -1;">
          <p style="font-size: 28px; margin: 0 0 10px;">🚀</p>
          <p style="font-size: 14px; font-weight: 600; margin: 0 0 4px;">${state.activeLevel} seviyesi yakında!</p>
          <p class="ts" style="font-size: 12px; margin: 0;">İçerikler hazırlanıyor. Şimdilik B1 seviyesiyle çalışabilirsin.</p>
        </div>`;
    } else {
      categoriesList.style.gridTemplateColumns = "";
    }

    getActiveLessonsData().forEach(cat => {
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

// ================= LEVEL PATH ZIGZAG FUNCTIONS =================
function getSequentialLessons() {
  const lessons = [];
  getActiveLessonsData().forEach(cat => {
    cat.subcategories.forEach(sub => {
      sub.lessons.forEach(les => {
        lessons.push({
          ...les,
          categoryId: cat.id,
          categoryName: cat.name,
          categoryColor: cat.color || "purple",
          categoryIcon: cat.icon || "ti-book",
          subcategoryName: sub.name
        });
      });
    });
  });
  return lessons;
}

function getLessonIcon(lesson, index) {
  if (getLevelProgress().completedLessons.includes(lesson.id)) {
    return "ti-check";
  }
  const icons = ["ti-notebook", "ti-video", "ti-headphones", "ti-star"];
  return icons[index % icons.length];
}

function renderLevelPath() {
  cleanupSitemapAnimations();

  const pathView = document.getElementById("level-path-view");
  if (!pathView) return;
  
  pathView.innerHTML = "";
  
  const lessons = getSequentialLessons();
  if (lessons.length === 0) {
    pathView.innerHTML = `<div style="text-align:center; padding: 40px; color: var(--color-text-secondary); font-size:13px;">Dersler yükleniyor...</div>`;
    return;
  }
  
  const completedLessons = getLevelProgress().completedLessons;
  const maxCompletedIndex = lessons.reduce((max, les, idx) => completedLessons.includes(les.id) ? idx : max, -1);
  
  const processedLessons = lessons.map((les, idx) => {
    const isCompleted = completedLessons.includes(les.id);
    let status = "locked";
    if (isCompleted) {
      status = "completed";
    } else if (idx <= maxCompletedIndex + 1) {
      status = "active";
    } else {
      status = "locked";
    }
    return { ...les, status };
  });
  
  const containerWidth = pathView.clientWidth || 340;
  const centerX = containerWidth / 2;
  
  let currentY = 15;
  let lastCategoryId = null;
  let nodeInCategoryIndex = 0;
  
  let categoryInfo = [];
  const candidates = [];
  
  processedLessons.forEach((les, index) => {
    if (les.categoryId !== lastCategoryId) {
      const banner = document.createElement("div");
      banner.className = `category-banner c-${les.categoryColor}-bg`;
      banner.style.top = `${currentY}px`;
      banner.style.borderLeftColor = `var(--theme-${les.categoryColor})`;
      
      const categories = getActiveLessonsData();
      const catIndex = categories.findIndex(c => c.id === les.categoryId) + 1;
      
      banner.innerHTML = `
        <span class="kisim-title" style="color: var(--theme-${les.categoryColor});">${catIndex}. KISIM</span>
        <span class="kisim-name">${les.categoryName}</span>
      `;
      pathView.appendChild(banner);
      
      currentY += 56 + 24;
      
      categoryInfo.push({
        id: les.categoryId,
        y0: currentY,
        lessonCount: 0
      });
      
      lastCategoryId = les.categoryId;
      nodeInCategoryIndex = 0;
    }
    
    if (categoryInfo.length > 0) {
      categoryInfo[categoryInfo.length - 1].lessonCount++;
    }
    
    // Calculate zigzag position
    const amplitude = Math.min(containerWidth * 0.22, 72);
    const x = centerX + Math.sin(nodeInCategoryIndex * 0.8) * amplitude;
    
    const btn = document.createElement("button");
    btn.className = `droplet-node ${les.status}`;
    btn.style.left = `${x - 29}px`;
    btn.style.top = `${currentY}px`;
    
    // Gradient definitions mapping
    const colorGradients = {
      purple: { start: "#c5b6ff", end: "#8368f9", glow: "rgba(131, 104, 249, 0.6)" },
      teal: { start: "#34e8b0", end: "#0fa572", glow: "rgba(15, 165, 114, 0.6)" },
      coral: { start: "#fca395", end: "#dc6d5e", glow: "rgba(220, 109, 94, 0.6)" },
      pink: { start: "#fcaecc", end: "#db7ea0", glow: "rgba(219, 126, 160, 0.6)" }
    };
    
    let startColor = "#3d3d3b";
    let endColor = "#2c2c2a";
    let strokeColor = "rgba(255, 255, 255, 0.12)";
    let strokeWidth = "1.5";
    
    const theme = colorGradients[les.categoryColor] || colorGradients.purple;
    
    if (les.status === "completed") {
      startColor = theme.start;
      endColor = theme.end;
      strokeColor = "rgba(255, 255, 255, 0.35)";
    } else if (les.status === "active") {
      startColor = theme.start;
      endColor = theme.end;
      strokeColor = "#ffffff";
      strokeWidth = "2.5";
      btn.style.setProperty('--active-glow-color', theme.glow);
    }
    
    btn.innerHTML = `
      <svg class="droplet-svg" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="grad-${les.id}-${index}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${startColor}" />
            <stop offset="100%" stop-color="${endColor}" />
          </linearGradient>
        </defs>
        <path d="M 32,4 C 30,13 13,28 13,43 A 19,19 0 0,0 51,43 C 51,28 34,13 32,4 Z" 
              fill="url(#grad-${les.id}-${index})" stroke="${strokeColor}" stroke-width="${strokeWidth}" />
      </svg>
      <div class="droplet-icon-container">
        <i class="ti ${les.status === 'locked' ? 'ti-lock' : getLessonIcon(les, index)}"></i>
      </div>
    `;
    
    btn.addEventListener("click", () => {
      showLessonPreview(les, les.status);
    });
    
    pathView.appendChild(btn);
    
    // Check if this node forms a peak curve to place an animation on the opposite side
    if (nodeInCategoryIndex === 2 || nodeInCategoryIndex === 10 || nodeInCategoryIndex === 18) {
      candidates.push({
        categoryId: les.categoryId,
        index: nodeInCategoryIndex,
        side: "left",
        top: currentY - 58,
        x: x
      });
    } else if (nodeInCategoryIndex === 6 || nodeInCategoryIndex === 14 || nodeInCategoryIndex === 22) {
      candidates.push({
        categoryId: les.categoryId,
        index: nodeInCategoryIndex,
        side: "right",
        top: currentY - 58,
        x: x
      });
    }
    
    currentY += 92;
    nodeInCategoryIndex++;
  });
  
  pathView.style.height = `${currentY + 30}px`;
  
  // DYNAMIC SITEMAP ILLUSTRATIONS RENDER BASED ON ROAD WINDING GAPS
  const animInstancesToInit = [];
  const shuffledAnims = [...SITEMAP_ANIMATION_FILES].sort(() => 0.5 - Math.random());
  let animIdx = 0;
  
  candidates.forEach(candidate => {
    const cat = categoryInfo.find(c => c.id === candidate.categoryId);
    if (!cat) return;
    
    // Ensure there is at least one lesson after the peak to avoid overlap at the end of the category
    if (cat.lessonCount - candidate.index < 2) return;
    
    const anim = shuffledAnims[animIdx % shuffledAnims.length];
    animIdx++;
    
    const animContainer = document.createElement("div");
    const canvasId = `sitemap-canvas-${candidate.side}-${candidate.categoryId}-${candidate.index}`;
    
    animContainer.style.position = "absolute";
    
    // Calculate size and alignment dynamically based on available side space to center the animation
    let animWidth = 180;
    let offset = 8;
    
    if (candidate.side === "left") {
      const leftSpace = candidate.x - 29;
      const maxAvailableWidth = leftSpace - 16; // 8px margin on each side
      animWidth = Math.max(120, Math.min(180, maxAvailableWidth));
      offset = (leftSpace - animWidth) / 2;
      animContainer.style.left = `${offset}px`;
    } else {
      const rightSpace = containerWidth - (candidate.x + 29);
      const maxAvailableWidth = rightSpace - 16; // 8px margin on each side
      animWidth = Math.max(120, Math.min(180, maxAvailableWidth));
      offset = (rightSpace - animWidth) / 2;
      animContainer.style.right = `${offset}px`;
    }
    
    // Centering vertically relative to droplet center
    const centeredTop = candidate.top + 90 - (animWidth / 2);
    
    animContainer.style.top = `${centeredTop}px`;
    animContainer.style.width = `${animWidth}px`;
    animContainer.style.height = `${animWidth}px`;
    animContainer.style.zIndex = "1";
    animContainer.style.pointerEvents = "none";
    
    // Double width and height for high-DPI screens (Retina support)
    animContainer.innerHTML = `<canvas id="${canvasId}" width="${animWidth * 2}" height="${animWidth * 2}" style="width: 100%; height: 100%;"></canvas>`;
    
    pathView.appendChild(animContainer);
    animInstancesToInit.push({ canvasId, anim });
  });
  
  if (animInstancesToInit.length > 0) {
    setTimeout(() => {
      animInstancesToInit.forEach(item => {
        initSitemapRive(item.canvasId, item.anim);
      });
    }, 50);
  }
}

function showLessonPreview(lesson, status) {
  if (status === "locked") {
    playSound("click");
    if (typeof capacitorHapticVibrate === "function") {
      capacitorHapticVibrate("warning");
    }
    alert("Bu konuya erişmek için lütfen önceki konuları tamamlayın.");
    return;
  }
  
  playSound("click");
  if (typeof capacitorHapticVibrate === "function") {
    capacitorHapticVibrate("light");
  }
  
  const overlay = document.getElementById("lesson-preview-overlay");
  const badge = document.getElementById("lesson-preview-badge");
  const statusBadge = document.getElementById("lesson-preview-status-badge");
  const title = document.getElementById("lesson-preview-title");
  const teaser = document.getElementById("lesson-preview-teaser");
  const actions = document.getElementById("lesson-preview-actions");
  
  if (!overlay || !badge || !statusBadge || !title || !teaser || !actions) return;
  
  title.textContent = lesson.title;
  badge.textContent = lesson.subcategoryName;
  badge.style.backgroundColor = `var(--theme-${lesson.categoryColor}-light)`;
  badge.style.color = `var(--theme-${lesson.categoryColor})`;
  badge.style.border = `1px solid rgba(177, 159, 251, 0.2)`;
  
  if (status === "completed") {
    statusBadge.innerHTML = `<span style="color: var(--theme-teal); display: flex; align-items: center; gap: 4px;"><i class="ti ti-circle-check-filled"></i> Tamamlandı</span>`;
  } else {
    statusBadge.innerHTML = `<span style="color: var(--theme-purple); display: flex; align-items: center; gap: 4px;"><i class="ti ti-flame"></i> Sıradaki Konu</span>`;
  }
  
  const contentText = lesson.content || "";
  const cleanText = contentText.replace(/[#*`]/g, "").substring(0, 150) + (contentText.length > 150 ? "..." : "");
  teaser.textContent = cleanText || "Bu ders için konu anlatımı henüz hazır değil.";
  
  actions.innerHTML = "";
  
  const readBtn = document.createElement("button");
  readBtn.className = "c-purple";
  readBtn.style = "width: 100%; border: none; padding: 12px; border-radius: var(--border-radius-lg); font-size: 13.5px; font-weight: 600; cursor: pointer; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 8px;";
  readBtn.innerHTML = `<i class="ti ti-book-open"></i> Dersi Oku`;
  readBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    openLesson(lesson, "sitemap");
  });
  actions.appendChild(readBtn);
  
  const quizzes = getActiveLessonQuizzes();
  const hasQuiz = quizzes && quizzes[lesson.id];
  if (hasQuiz) {
    const quizBtn = document.createElement("button");
    quizBtn.className = "c-teal";
    quizBtn.style = "width: 100%; border: none; padding: 12px; border-radius: var(--border-radius-lg); font-size: 13.5px; font-weight: 600; cursor: pointer; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 8px;";
    quizBtn.innerHTML = `<i class="ti ti-pencil"></i> Sınava Başla`;
    quizBtn.addEventListener("click", () => {
      overlay.classList.add("hidden");
      state.quizReferrer = "sitemap";
      saveState();
      startLessonQuiz(lesson);
    });
    actions.appendChild(quizBtn);
  }
  
  overlay.classList.remove("hidden");
}


// SITEMAP SCREEN RENDERING
function renderSitemapScreen() {
  const isA1A2 = state.activeLevel === "A1-A2";
  const classicContent = document.getElementById("classic-sitemap-content");
  const pathContent = document.getElementById("path-sitemap-content");

  const sub = document.getElementById("sitemap-subtitle");
  if (sub) {
    sub.textContent = `Seviyenize göre organize edilmiş ${state.activeLevel} Almanca ders sırası.`;
  }

  classicContent?.classList.add("hidden");
  pathContent?.classList.remove("hidden");
  renderLevelPath();
  
  // Auto-scroll to active lesson node within path-sitemap-content
  setTimeout(() => {
    const activeNode = document.querySelector(".droplet-node.active");
    const pathSitemap = document.getElementById("path-sitemap-content");
    if (activeNode && pathSitemap) {
      const rect = activeNode.getBoundingClientRect();
      const parentRect = pathSitemap.getBoundingClientRect();
      const relativeTop = pathSitemap.scrollTop + rect.top - parentRect.top;
      pathSitemap.scrollTo({
        top: relativeTop - parentRect.height / 2 + rect.height / 2,
        behavior: "smooth"
      });
    }
  }, 150);
}

// LESSON DETAILS SCREEN
function openLesson(lesson, referrer = "sitemap") {
  showScreen("lesson");
  
  const backBtn = document.querySelector("#lesson-screen .back-btn");
  if (backBtn) {
    backBtn.setAttribute("data-target", referrer);
  }
  
  document.getElementById("lesson-title").textContent = lesson.title;
  
  const lessonBody = document.getElementById("lesson-body-content");
  if (lessonBody) {
    lessonBody.innerHTML = formatLessonContent(lesson.content);
  }
  
  const actionContainer = document.getElementById("lesson-action-container");
  if (actionContainer) {
    actionContainer.innerHTML = "";
    
    const isCompleted = getLevelProgress().completedLessons.includes(lesson.id);
    const hasQuiz = typeof getActiveLessonQuizzes() !== 'undefined' && getActiveLessonQuizzes()[lesson.id];
    
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
        const index = getLevelProgress().completedLessons.indexOf(lesson.id);
        let nowCompleted = false;
        if (index > -1) {
          getLevelProgress().completedLessons.splice(index, 1);
        } else {
          getLevelProgress().completedLessons.push(lesson.id);
          state.xp += 15;
          nowCompleted = true;
          logActiveDay();
        }
        updateCompleteButtonState(btn, nowCompleted);
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
  if (!content) return `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding: 40px 20px; text-align:center;"><i class="ti ti-clock" style="font-size:36px; color:var(--theme-purple); opacity:0.6;"></i><p style="margin:0; font-size:14px; font-weight:600; color:var(--color-text-primary);">İçerik Hazırlanıyor</p><p style="margin:0; font-size:12.5px; color:var(--color-text-secondary); line-height:1.5;">Bu konunun konu anlatımı yakında eklenecek.</p></div>`;
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
let activeFlashcards = [];

function renderFlashcardScreen() {
  const vocabList = getLevelProgress().myVocabulary || [];
  
  if (vocabList.length === 0) {
    alert("Kelime listeniz henüz boş! Flashcard turu yapabilmek için lütfen önce Kelimelerim kısmından kelime ekleyin.");
    showScreen("exercises");
    return;
  }
  
  // Map myVocabulary to flashcard format
  activeFlashcards = vocabList.map(item => ({
    front: item.word,
    back: item.translation,
    context: item.context
  }));
  
  // Shuffle flashcards
  activeFlashcards.sort(() => 0.5 - Math.random());
  
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
      if (currentCardIndex < activeFlashcards.length - 1) {
        currentCardIndex++;
        updateFlashcardUI();
      } else {
        state.completedToday.flashcards = true;
        state.xp += 20;
        saveState();
        alert("Harika! Tüm kelimelerinizi incelediniz ve +20 XP kazandınız! 🎉");
        showScreen("exercises");
      }
    };
  }
}

function updateFlashcardUI() {
  if (activeFlashcards.length === 0) return;
  const card = activeFlashcards[currentCardIndex];
  const container = document.getElementById("flashcard-container");
  
  if (!container || !card) return;
  
  let contextHtml = "";
  if (card.context) {
    contextHtml = `
      <div style="font-size: 12.5px; color: var(--color-text-secondary); margin-bottom: auto; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 12px; font-style: italic; line-height: 1.5; text-align: center; max-width: 90%; margin-left: auto; margin-right: auto;">
        "${card.context}"
      </div>
    `;
  }
  
  container.innerHTML = `
    <div class="flashcard" id="active-flashcard">
      <div class="card-face card-front" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div style="display:flex; justify-content:space-between; align-items:center; width: 100%;">
          <span style="background: rgba(177, 159, 251, 0.12); color: var(--theme-purple); padding: 4px 10px; border-radius: 99px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.3px;">KELİMELERİM</span>
          <span style="color: var(--color-text-tertiary); font-size: 11.5px; font-weight: 500;">${currentCardIndex + 1} / ${activeFlashcards.length}</span>
        </div>
        <div style="font-size: 21px; font-weight: 700; text-align: center; margin: auto 0; line-height:1.5; color: #ffffff; letter-spacing: 0.2px;">
          ${card.front}
        </div>
        <div style="font-size: 10.5px; color: var(--theme-purple); opacity: 0.85; text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 600; letter-spacing: 0.2px;">
          <i class="ti ti-eye-check" style="font-size: 13px;"></i> TÜRKÇESİNİ GÖSTER
        </div>
      </div>
      <div class="card-face card-back" style="display: flex; flex-direction: column; justify-content: space-between;">
        <div style="display:flex; justify-content:space-between; align-items:center; width: 100%;">
          <span style="background: rgba(52, 232, 176, 0.12); color: var(--theme-teal); padding: 4px 10px; border-radius: 99px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.3px;">TÜRKÇE ÇEVİRİ</span>
          <span style="color: var(--color-text-tertiary); font-size: 11.5px; font-weight: 500;">${currentCardIndex + 1} / ${activeFlashcards.length}</span>
        </div>
        <div style="font-size: 19px; font-weight: 700; text-align: center; margin: auto 0; line-height:1.55; color: var(--theme-teal); letter-spacing: 0.2px;">
          ${card.back}
        </div>
        ${contextHtml}
        <div style="font-size: 10.5px; color: var(--theme-teal); opacity: 0.85; text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px; font-weight: 600; letter-spacing: 0.2px; margin-top: auto;">
          <i class="ti ti-eye-off" style="font-size: 13px;"></i> ALMANCASINI GÖSTER
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
    nextBtn.textContent = currentCardIndex === activeFlashcards.length - 1 ? "Tamamla" : "Sonraki";
  }
}

// QUIZ CONTROLLER
let activeQuizQuestions = [];
let currentQuestionIndex = 0;
let correctAnswersCount = 0;

function getGlobalReviewQuestions() {
  const quizzes = getActiveLessonQuizzes();
  const completedLessons = getLevelProgress().completedLessons || [];
  let allQuestions = [];
  
  // Gather questions from completed lessons
  for (const lessonId of completedLessons) {
    const entry = quizzes[lessonId];
    if (entry) {
      const qs = (entry && entry.questions) ? entry.questions : (Array.isArray(entry) ? entry : []);
      if (qs && qs.length > 0) {
        allQuestions = allQuestions.concat(qs);
      }
    }
  }
  
  // Fallback: If no lessons are completed, or completed lessons have no questions,
  // load all questions from the active level's quizzes.
  if (allQuestions.length === 0) {
    for (const key in quizzes) {
      const entry = quizzes[key];
      if (entry) {
        const qs = (entry && entry.questions) ? entry.questions : (Array.isArray(entry) ? entry : []);
        if (qs && qs.length > 0) {
          allQuestions = allQuestions.concat(qs);
        }
      }
    }
  }
  
  if (allQuestions.length === 0) {
    return typeof QUIZ_QUESTIONS !== 'undefined' ? QUIZ_QUESTIONS : [];
  }
  return allQuestions;
}

function startNewQuiz() {
  showScreen("quiz");
  const pool = getGlobalReviewQuestions();
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  activeQuizQuestions = shuffled.slice(0, 10);
  currentQuestionIndex = 0;
  correctAnswersCount = 0;
  
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const container = document.getElementById("quiz-content-area");
  if (!container) return;
  
  const q = activeQuizQuestions[currentQuestionIndex];
  const total = activeQuizQuestions.length;
  const progressPct = total > 0 ? ((currentQuestionIndex + 1) / total) * 100 : 0;
  
  let contentHtml = "";
  if (q.type === "sentence-builder") {
    sentenceBuilderSelectedWords = [];
    sentenceBuilderScrambledWords = [...q.words].sort(() => 0.5 - Math.random());
    
    contentHtml = `
      <div class="quiz-sentence-preview" style="margin-bottom: 15px; font-weight: 600; color: var(--color-text-primary);">
        ${q.question}
      </div>
      
      <!-- Built sentence area -->
      <div class="sentence-builder-zone" id="sentence-builder-zone" style="min-height: 56px; border: 1.5px dashed var(--color-border-primary); border-radius: var(--border-radius-lg); padding: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-content: center; margin-bottom: 20px; background-color: rgba(0,0,0,0.015); transition: all 0.2s;">
        <span class="placeholder-text" style="color: var(--color-text-tertiary); font-size: 13px; padding-left: 8px;" id="sentence-builder-placeholder">Kelimelere dokunarak cümleyi kurun...</span>
      </div>
      
      <!-- Scrambled word pills -->
      <div class="scrambled-words-container" id="scrambled-words-container" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; justify-content: center;">
        ${sentenceBuilderScrambledWords.map((word, idx) => `
          <button class="word-pill" data-scrambled-idx="${idx}" onclick="handleWordPillTap(${idx})">
            ${word}
          </button>
        `).join("")}
      </div>
      
      <!-- Action Check Button -->
      <button id="sentence-builder-check-btn" class="c-purple" onclick="checkSentenceBuilderAnswer()" style="width: 100%; border: none; padding: 13px; border-radius: var(--border-radius-lg); font-size: 13.5px; font-weight: 600; cursor: pointer; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;" disabled>
        <i class="ti ti-check" aria-hidden="true"></i> Kontrol Et
      </button>
    `;
  } else {
    contentHtml = `
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
  }
  
  container.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
      <span class="ts" style="font-size:12.5px; font-weight:500;">Soru ${currentQuestionIndex + 1} / ${total}</span>
      <div style="width: 80px; height: 5px; background: var(--color-border-primary); border-radius: 99px; overflow:hidden;">
        <div style="width: ${progressPct}%; height:100%; background: var(--theme-coral); border-radius:99px;"></div>
      </div>
    </div>
    
    <div id="quiz-question-body-area">
      ${contentHtml}
    </div>
  `;
  
  if (q.type !== "sentence-builder") {
    const options = container.querySelectorAll(".quiz-option");
    options.forEach(btn => {
      btn.addEventListener("click", () => {
        const selectedIdx = parseInt(btn.getAttribute("data-idx"));
        handleQuizAnswer(selectedIdx, btn, options);
      });
    });
  }
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
    playSound("true");
  } else {
    clickedBtn.classList.add("incorrect");
    clickedBtn.querySelector("i").className = "ti ti-circle-x-filled";
    
    const correctBtn = allOptions[correctIdx];
    correctBtn.classList.add("correct");
    correctBtn.querySelector("i").className = "ti ti-circle-check-filled";
    playSound("false");
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
  state.xp += 25;
  logActiveDay();
  playSound("done");
  
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
          <p style="font-size:18px; font-weight:700; margin:0; color:var(--theme-coral);">${correctAnswersCount} / ${activeQuizQuestions.length}</p>
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
    playSound("true");
  } else {
    clickedBtn.classList.add("incorrect");
    
    allOptions.forEach(opt => {
      if (opt.getAttribute("data-val") === correctVal) {
        opt.classList.add("correct");
      }
    });
    playSound("false");
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
  state.xp += 20;
  logActiveDay();
  playSound("done");
  
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
    const score = getLevelProgress().prepScores[key] || 0;
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
    const score = getLevelProgress().prepScores[key] || 0;
    const isStarred = getLevelProgress().starredPreps.includes(key);
    
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
      const starredIdx = getLevelProgress().starredPreps.indexOf(key);
      if (starredIdx > -1) {
        getLevelProgress().starredPreps.splice(starredIdx, 1);
        e.target.className = "ti ti-star star-icon";
      } else {
        getLevelProgress().starredPreps.push(key);
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
    
    // Try to select a German voice (Prefer Anna, then Enhanced/Premium, then any German voice)
    const voices = window.speechSynthesis.getVoices();
    let deVoice = voices.find(v => v.lang.startsWith('de') && v.name.toLowerCase().includes('anna'));
    if (!deVoice) {
      deVoice = voices.find(v => v.lang.startsWith('de') && (v.name.toLowerCase().includes('enhanced') || v.name.toLowerCase().includes('premium')));
    }
    if (!deVoice) {
      deVoice = voices.find(v => v.lang.startsWith('de') || v.lang.includes('DE'));
    }
    
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
    const score = getLevelProgress().prepScores[key] || 0;
    const isStarred = getLevelProgress().starredPreps.includes(key);
    
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
  
  if (isOk) {
    correctPrepQuizScore++;
    playSound("true");
  } else {
    playSound("false");
  }
  
  // Update score in local state
  const q = activePrepQuizQuestions[currentPrepQuizIdx];
  const key = `${q.verb}_${q.prep}`;
  let score = getLevelProgress().prepScores[key] || 0;
  
  if (isOk) {
    score = Math.min(5, score + 1);
  } else {
    score = Math.max(-2, score - 2);
  }
  getLevelProgress().prepScores[key] = score;
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
  state.xp += 30; // +30 XP complete bonus
  logActiveDay();
  playSound("done");
  
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
  getActiveLessonsData().forEach(cat => {
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
    const attempts = getLevelProgress().leseverstehenProgress[ex.id] || [];
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
  getLevelProgress().leseverstehenAnswers = {};
  
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
      
      const userAns = getLevelProgress().leseverstehenAnswers[q.id];
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
      const userAns = getLevelProgress().leseverstehenAnswers[qNum];
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
      const isUsed = Object.values(getLevelProgress().leseverstehenAnswers).includes(letter);
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
        const userAns = getLevelProgress().leseverstehenAnswers[text.id];
        const correctAns = exercise.answers[text.id];
        if (userAns === correctAns) {
          feedbackHtml = `<div class="text-feedback-badge correct"><i class="ti ti-circle-check"></i> Doğru (Başlık ${correctAns.toUpperCase()})</div>`;
        } else {
          feedbackHtml = `<div class="text-feedback-badge incorrect"><i class="ti ti-circle-x"></i> Yanlış (Seçiminiz: ${userAns ? userAns.toUpperCase() : 'Boş'}, Doğru: ${correctAns.toUpperCase()})</div>`;
        }
        if (exercise.explanations && exercise.explanations[String(text.id)]) {
          feedbackHtml += `<div style="margin-top:8px;font-size:11px;color:var(--color-text-secondary);line-height:1.4;border-top:1px dashed var(--color-border-secondary);padding-top:6px;"><i class="ti ti-bulb" style="color:var(--theme-purple);font-size:13px;margin-right:2px;"></i> ${exercise.explanations[String(text.id)]}</div>`;
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
      const userAns = getLevelProgress().leseverstehenAnswers[qNum];
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
      
      const userAns = getLevelProgress().leseverstehenAnswers[q.id];
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
      const userAns = getLevelProgress().leseverstehenAnswers[text.id];
      
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
    Object.keys(getLevelProgress().leseverstehenAnswers).forEach(key => {
      if (getLevelProgress().leseverstehenAnswers[key] === option) {
        getLevelProgress().leseverstehenAnswers[key] = null;
      }
    });
  }
  
  // Toggle selection
  if (getLevelProgress().leseverstehenAnswers[qNum] === option) {
    getLevelProgress().leseverstehenAnswers[qNum] = null;
  } else {
    getLevelProgress().leseverstehenAnswers[qNum] = option;
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
      if (getLevelProgress().leseverstehenAnswers[item.id] === getCorrectAns(item)) correctCount++;
    });
    
    const attempts = getLevelProgress().leseverstehenProgress[exercise.id] || [];
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
    
    const island = document.getElementById("floating-answer-island");
    if (island) {
      island.style.background = "#10b981";
    }
    const badge = document.getElementById("floating-answer-badge");
    if (badge) {
      badge.innerHTML = `${correctCount}/${totalCount} <i class="ti ti-check" style="font-size:10px;margin-left:2px;"></i>`;
    }
    return;
  } else {
    if (resultsSummary) {
      resultsSummary.innerHTML = "";
    }
  }
  
  let answeredCount = 0;
  items.forEach(item => {
    if (getLevelProgress().leseverstehenAnswers[item.id]) answeredCount++;
  });
  
  const remaining = totalCount - answeredCount;
  if (remaining === 0) {
    statusText.textContent = "Bütün sorular cevaplandı. Cevapları gönderin!";
    statusText.style.color = "#98b5b6";
  } else {
    statusText.textContent = `${remaining} boş soru doldurulmayı bekliyor.`;
    statusText.style.color = "var(--theme-coral)";
  }
  
  const island = document.getElementById("floating-answer-island");
  if (island) {
    island.style.background = "linear-gradient(135deg, var(--theme-purple), #a855f7)";
  }
  const badge = document.getElementById("floating-answer-badge");
  if (badge) {
    badge.textContent = `${answeredCount}/${totalCount}`;
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
      if (getLevelProgress().leseverstehenAnswers[item.id] === exercise.answers[String(item.id)]) correctCount++;
    });
  } else if (isTeil2) {
    items = exercise.questions || [];
    items.forEach(item => {
      if (getLevelProgress().leseverstehenAnswers[item.id] === exercise.answers[String(item.id)]) correctCount++;
    });
  } else {
    items = exercise.texts || [];
    items.forEach(item => {
      if (getLevelProgress().leseverstehenAnswers[item.id] === exercise.answers[item.id]) correctCount++;
    });
  }
  
  leseverstehenSubmitted = true;
  state.xp += correctCount * 10;
  playSound("done");
  
  const scoreMultiplier = isTeil3 ? 10 : 20;
  const score = correctCount * scoreMultiplier;
  
  let attempts = getLevelProgress().leseverstehenProgress[exercise.id] || [];
  attempts.push({ score: score, duration: durationSeconds });
  if (attempts.length > 3) attempts.shift();
  getLevelProgress().leseverstehenProgress[exercise.id] = attempts;
  
  logActiveDay();
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
    const attempts = getLevelProgress().sprachbausteineProgress[ex.id] || [];
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
  getLevelProgress().sprachbausteineAnswers = {};
  
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
  
  const tipsContent = document.getElementById("sprachbausteine-tips-content");
  if (tipsContent) {
    if (isTeil2) {
      tipsContent.innerHTML = `
        <p>1. Önce <b>mektubun konusunu</b> ve genel akışını anlamak için baştan sona hızlıca okuyun.</p>
        <p>2. Kelime havuzundaki (a-o) kelimelerin türlerini (isim, fiil, edat, bağlaç vb.) belirleyin.</p>
        <p>3. Her boşluğa hangi kelime türünün geleceğini analiz edin (örneğin edattan sonra Dativ alan bir isim veya mektup başındaki hitap kelimesi).</p>
        <p>4. Kullandığınız kelimeleri havuzdan eleyerek seçenek sayısını azaltın.</p>
      `;
    } else {
      tipsContent.innerHTML = `
        <p>1. Önce <b>mektubu</b> boşlukları dikkate almadan hızlıca okuyarak genel konuyu anlayın.</p>
        <p>2. Her boşluğun öncesindeki ve sonrasındaki kelimeleri (özellikle edatlar, artikeller ve fiil çekimleri) analiz edin.</p>
        <p>3. Bağlaçların (weil, dass, wenn, ob vb.) yan cümle kurallarına ve fiilin sonda olma kuralına dikkat edin.</p>
        <p>4. Seçenekler arasındaki dil bilgisi farklarını (Akkusativ/Dativ çekimleri, tekil/çoğul uyumu) karşılaştırın.</p>
      `;
    }
  }
  
  const letterContainer = document.querySelector(".letter-container");
  if (letterContainer) {
    let textHtml = exercise.text.replace(/\((\d+)\)/g, (match, num) => {
      const gapNum = parseInt(num);
      if (exercise.options[gapNum]) {
        const userAns = getLevelProgress().sprachbausteineAnswers[gapNum];
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
        const isUsed = Object.values(getLevelProgress().sprachbausteineAnswers).includes(letter);
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
          const userAns = getLevelProgress().sprachbausteineAnswers[gapNum];
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
        const userAns = getLevelProgress().sprachbausteineAnswers[gapNum];
        
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
    if (getLevelProgress().sprachbausteineAnswers[gapNum] && !sprachbausteineSubmitted) {
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
    
    const userAns = getLevelProgress().sprachbausteineAnswers[gapNum];
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
    Object.keys(getLevelProgress().sprachbausteineAnswers).forEach(key => {
      if (getLevelProgress().sprachbausteineAnswers[key] === option) {
        getLevelProgress().sprachbausteineAnswers[key] = null;
      }
    });
  }
  
  if (getLevelProgress().sprachbausteineAnswers[gapNum] === option) {
    getLevelProgress().sprachbausteineAnswers[gapNum] = null;
  } else {
    getLevelProgress().sprachbausteineAnswers[gapNum] = option;
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
      if (getLevelProgress().sprachbausteineAnswers[gapNum] === exercise.answers[gapNum]) {
        correctCount++;
      }
    });
    
    const attempts = getLevelProgress().sprachbausteineProgress[exercise.id] || [];
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
    
    const island = document.getElementById("floating-answer-island");
    if (island) {
      island.style.background = "#10b981";
    }
    const badge = document.getElementById("floating-answer-badge");
    if (badge) {
      badge.innerHTML = `${correctCount}/${totalCount} <i class="ti ti-check" style="font-size:10px;margin-left:2px;"></i>`;
    }
    return;
  } else {
    if (resultsSummary) {
      resultsSummary.innerHTML = "";
    }
  }
  
  let answeredCount = 0;
  gapsList.forEach(gapNum => {
    if (getLevelProgress().sprachbausteineAnswers[gapNum]) {
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
  
  const island = document.getElementById("floating-answer-island");
  if (island) {
    island.style.background = "linear-gradient(135deg, var(--theme-purple), #a855f7)";
  }
  const badge = document.getElementById("floating-answer-badge");
  if (badge) {
    badge.textContent = `${answeredCount}/${totalCount}`;
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
    if (getLevelProgress().sprachbausteineAnswers[gapNum] === exercise.answers[gapNum]) {
      correctCount++;
    }
  });
  
  sprachbausteineSubmitted = true;
  playSound("done");
  
  const xpEarned = correctCount * 10;
  state.xp += xpEarned;
  
  // Calculate score out of 100
  const scoreMultiplier = 100 / totalCount;
  const score = Math.round(correctCount * scoreMultiplier);
  
  let attempts = getLevelProgress().sprachbausteineProgress[exercise.id] || [];
  attempts.push({ score: score, duration: durationSeconds });
  if (attempts.length > 3) {
    attempts.shift();
  }
  getLevelProgress().sprachbausteineProgress[exercise.id] = attempts;
  
  logActiveDay();
  
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
          const userAns = getLevelProgress().sprachbausteineAnswers[gapNum];
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
  const completedCount = getLevelProgress().completedLessons.length;
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
  
  const activeSet = new Set(state.activeDates || []);
  
  days.forEach(day => {
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = day.getDate();
    
    const dayStr = day.toDateString();
    if (dayStr === today.toDateString()) {
      dayDiv.classList.add("active");
    }
    
    if (activeSet.has(dayStr)) {
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
  const completedLessons = getLevelProgress().completedLessons.length;
  const lessonPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  
  const totalPreps = typeof VERBEN_PREP_DATA !== 'undefined' ? VERBEN_PREP_DATA.length : 0;
  const learnedPreps = Object.values(getLevelProgress().prepScores || {}).filter(score => score >= 3).length;
  const prepPct = totalPreps > 0 ? Math.round((learnedPreps / totalPreps) * 100) : 0;
  
  const totalLese = (typeof getActiveLeseverstehenData(1) !== 'undefined' ? getActiveLeseverstehenData(1).length : 0) +
                    (typeof getActiveLeseverstehenData(2) !== 'undefined' ? getActiveLeseverstehenData(2).length : 0) +
                    (typeof getActiveLeseverstehenData(3) !== 'undefined' ? getActiveLeseverstehenData(3).length : 0);
  const completedLese = Object.keys(getLevelProgress().leseverstehenProgress || {}).length;
  const lesePct = totalLese > 0 ? Math.round((completedLese / totalLese) * 100) : 0;
  
  // Calculate average score for Leseverstehen
  let totalLeseScore = 0;
  let leseAttemptedCount = 0;
  Object.values(getLevelProgress().leseverstehenProgress || {}).forEach(attempts => {
    if (attempts && attempts.length > 0) {
      const latest = attempts[attempts.length - 1];
      totalLeseScore += latest.score;
      leseAttemptedCount++;
    }
  });
  const leseAvgScore = leseAttemptedCount > 0 ? Math.round(totalLeseScore / leseAttemptedCount) : 0;
  
  const totalSprach = (typeof getActiveSprachbausteineData(1) !== 'undefined' ? getActiveSprachbausteineData(1).length : 0) +
                      (typeof getActiveSprachbausteineData(2) !== 'undefined' ? getActiveSprachbausteineData(2).length : 0);
  const completedSprach = Object.keys(getLevelProgress().sprachbausteineProgress || {}).length;
  const sprachPct = totalSprach > 0 ? Math.round((completedSprach / totalSprach) * 100) : 0;
  
  // Calculate average score for Sprachbausteine
  let totalSprachScore = 0;
  let sprachAttemptedCount = 0;
  Object.values(getLevelProgress().sprachbausteineProgress || {}).forEach(attempts => {
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
  if (nameInput) nameInput.value = state.userName;

  const profileAvatarLarge = document.getElementById("profile-avatar-large");
  if (profileAvatarLarge) {
    profileAvatarLarge.textContent = state.userName ? state.userName.charAt(0).toUpperCase() : "B";
  }

  // Level switcher button states
  const btnA1A2 = document.getElementById("level-btn-a1a2");
  const btnB1 = document.getElementById("level-btn-b1");
  if (btnA1A2 && btnB1) {
    const activeStyle = "background: var(--theme-purple); color: #fff; border-color: var(--theme-purple);";
    const inactiveStyle = "background: var(--color-background-secondary); color: var(--color-text-secondary); border-color: var(--color-border-primary);";
    btnA1A2.style.cssText = btnA1A2.style.cssText.replace(/background:[^;]+;|color:[^;]+;|border-color:[^;]+;/g, "") + (state.activeLevel === "A1-A2" ? activeStyle : inactiveStyle);
    btnB1.style.cssText = btnB1.style.cssText.replace(/background:[^;]+;|color:[^;]+;|border-color:[^;]+;/g, "") + (state.activeLevel === "B1" ? activeStyle : inactiveStyle);
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
  
  const vocabList = getLevelProgress().myVocabulary || [];
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
        getLevelProgress().myVocabulary = (getLevelProgress().myVocabulary || []).filter(v => v.id !== item.id);
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
    
    // Try to select a German voice (Prefer Anna, then Enhanced/Premium, then any German voice)
    const voices = window.speechSynthesis.getVoices();
    let deVoice = voices.find(v => v.lang.startsWith('de') && v.name.toLowerCase().includes('anna'));
    if (!deVoice) {
      deVoice = voices.find(v => v.lang.startsWith('de') && (v.name.toLowerCase().includes('enhanced') || v.name.toLowerCase().includes('premium')));
    }
    if (!deVoice) {
      deVoice = voices.find(v => v.lang.startsWith('de') || v.lang.includes('DE'));
    }
    
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
  
  const vocabList = getLevelProgress().myVocabulary || [];
  
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
  if (!state.quizReferrer) {
    state.quizReferrer = document.querySelector("#lesson-screen .back-btn")?.getAttribute("data-target") || "sitemap";
  }
  const quizEntry = getActiveLessonQuizzes()[lesson.id];
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
    const quizEntry = getActiveLessonQuizzes()[activeLessonQuiz.id];
    const letterText = quizEntry && quizEntry.letterText ? quizEntry.letterText : "";
    
    let contentHtml = "";
    
    if (isTeil2 && letterText) {
      let formattedLetter = letterText.replace(/\((\d+)\)/g, (match, num) => {
        const gapNum = parseInt(num);
        const gapIdx = gapNum - 1;
        
        if (gapIdx === lessonQuizCurrentIndex) {
          return `<span class="quiz-letter-gap active">(${gapNum}) _____</span>`;
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
      
      // Determine columns based on number of options to prevent squishing
      const columnsCount = q.options.length > 4 ? 2 : 1;
      
      contentHtml = `
        <div class="quiz-letter-preview">
          ${formattedLetter}
        </div>
        <div class="quiz-letter-options-title" style="margin-top: 20px; margin-bottom: 10px; font-weight: 600; color: var(--color-text-secondary); font-size: 13.5px; display: flex; align-items: center; gap: 6px;">
          <i class="ti ti-list-check" style="color: var(--theme-purple); font-size: 16px;"></i>
          <span>Boşluk (${lessonQuizCurrentIndex + 1}) için doğru seçeneği seçin:</span>
        </div>
        <div style="display:grid; grid-template-columns: repeat(${columnsCount}, 1fr); gap:10px; margin-top: 10px;" id="lesson-quiz-options-container">
          ${q.options.map((opt, idx) => `
            <button class="quiz-option" data-idx="${idx}" onclick="selectLetterOption(event, ${idx})" style="padding: 12px 14px; font-size: 13px;">
              <span>${opt}</span>
              <i class="ti ti-circle" style="font-size:16px; color:var(--color-text-tertiary); flex-shrink:0; margin-left:8px;"></i>
            </button>
          `).join("")}
        </div>
      `;
    } else if (q.type === "sentence-builder") {
      sentenceBuilderSelectedWords = [];
      sentenceBuilderScrambledWords = [...q.words].sort(() => 0.5 - Math.random());
      
      contentHtml = `
        <div class="quiz-sentence-preview" style="margin-bottom: 15px; font-weight: 600;">
          ${q.question}
        </div>
        
        <!-- Built sentence area -->
        <div class="sentence-builder-zone" id="sentence-builder-zone" style="min-height: 56px; border: 1.5px dashed var(--color-border-primary); border-radius: var(--border-radius-lg); padding: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-content: center; margin-bottom: 20px; background-color: rgba(0,0,0,0.015); transition: all 0.2s;">
          <span class="placeholder-text" style="color: var(--color-text-tertiary); font-size: 13px; padding-left: 8px;" id="sentence-builder-placeholder">Kelimelere dokunarak cümleyi kurun...</span>
        </div>
        
        <!-- Scrambled word pills -->
        <div class="scrambled-words-container" id="scrambled-words-container" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; justify-content: center;">
          ${sentenceBuilderScrambledWords.map((word, idx) => `
            <button class="word-pill" data-scrambled-idx="${idx}" onclick="handleWordPillTap(${idx})">
              ${word}
            </button>
          `).join("")}
        </div>
        
        <!-- Action Check Button -->
        <button id="sentence-builder-check-btn" class="c-purple" onclick="checkSentenceBuilderAnswer()" style="width: 100%; border: none; padding: 13px; border-radius: var(--border-radius-lg); font-size: 13.5px; font-weight: 600; cursor: pointer; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;" disabled>
          <i class="ti ti-check" aria-hidden="true"></i> Kontrol Et
        </button>
      `;
    } else if (q.type === "write-in") {
      const formattedSentence = q.question.replace(/\((\d+)\)\s*_____/g, (match, gapNum) => {
        return `<span class="quiz-sentence-gap">(${gapNum}) _____</span>`;
      });
      
      contentHtml = `
        <div class="quiz-sentence-preview">
          ${formattedSentence}
        </div>
        
        <div class="quiz-write-in-container" style="margin-top: 24px; display: flex; flex-direction: column; gap: 15px;">
          <input type="text" id="quiz-write-in-input" class="quiz-write-in-input" 
                 placeholder="Cevabınızı yazın..." autocomplete="off" autofocus>
                 
          <div id="quiz-write-in-reveal-area"></div>
          
          <button id="quiz-write-in-submit-btn" class="c-purple" onclick="submitWriteInAnswer()" 
                  style="width: 100%; border: none; padding: 14px; border-radius: var(--border-radius-lg); font-size: 14px; font-weight: 600; cursor: pointer; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;">
            <i class="ti ti-check" aria-hidden="true"></i> Kontrol Et
          </button>
        </div>
        
        <div id="quiz-translation-box" class="quiz-translation-box hidden">
          <span class="quiz-translation-title">Türkçe Çeviri / Açıklama</span>
          <span id="quiz-translation-text"></span>
        </div>
      `;
    } else {
      const formattedSentence = q.question.replace(/\((\d+)\)\s*_____/g, (match, gapNum) => {
        return `<span class="quiz-sentence-gap">(${gapNum}) _____</span>`;
      });
      
      contentHtml = `
        <div class="quiz-sentence-preview">
          ${formattedSentence}
        </div>
        <div style="display:flex; flex-direction:column; gap:11px; margin-top: 20px;" id="lesson-quiz-options-container">
          ${q.options.map((opt, idx) => `
            <button class="quiz-option" data-idx="${idx}" onclick="selectSentenceOption(event, ${idx})">
              <span>${opt}</span>
              <i class="ti ti-circle" style="font-size:16px; color:var(--color-text-tertiary); flex-shrink:0; margin-left:8px;"></i>
            </button>
          `).join("")}
        </div>
        
        <div id="quiz-translation-box" class="quiz-translation-box hidden">
          <span class="quiz-translation-title">Türkçe Çeviri / Açıklama</span>
          <span id="quiz-translation-text"></span>
        </div>
      `;
    }
    
    questionArea.innerHTML = contentHtml;
    
    if (q.type === "write-in") {
      const inputEl = document.getElementById("quiz-write-in-input");
      if (inputEl) {
        inputEl.focus();
        inputEl.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            const btn = document.getElementById("quiz-write-in-submit-btn");
            if (btn) btn.click();
          }
        });
      }
    }
  }
}

function selectSentenceOption(event, selectedIdx) {
  const q = activeLessonQuizQuestions[lessonQuizCurrentIndex];
  const correctIdx = q.correct;
  const container = document.getElementById("lesson-quiz-options-container");
  if (!container) return;
  
  const allButtons = container.querySelectorAll(".quiz-option");
  allButtons.forEach(btn => btn.style.pointerEvents = "none");
  
  const clickedBtn = event.currentTarget;
  const isCorrect = selectedIdx === correctIdx;
  lessonQuizCorrectStates[lessonQuizCurrentIndex] = isCorrect;
  lessonQuizAnswersText[lessonQuizCurrentIndex] = q.options[selectedIdx];
  
  // Update the sentence gap preview
  const gapSpan = document.querySelector(".quiz-sentence-gap");
  if (gapSpan) {
    gapSpan.textContent = q.options[selectedIdx];
    gapSpan.className = isCorrect ? "quiz-sentence-gap correct" : "quiz-sentence-gap incorrect";
  }
  
  if (isCorrect) {
    clickedBtn.classList.add("correct");
    const icon = clickedBtn.querySelector("i");
    if (icon) icon.className = "ti ti-circle-check";
    playSound("true");
  } else {
    clickedBtn.classList.add("incorrect");
    const icon = clickedBtn.querySelector("i");
    if (icon) icon.className = "ti ti-circle-x";
    
    // Highlight correct option
    const correctBtn = allButtons[correctIdx];
    if (correctBtn) {
      correctBtn.classList.add("correct");
      const cIcon = correctBtn.querySelector("i");
      if (cIcon) cIcon.className = "ti ti-circle-check";
    }
    
    lessonQuizLives--;
    renderLessonQuizLives();
    playSound("false");
  }
  
  // Show translation if available
  if (q.translation) {
    const transBox = document.getElementById("quiz-translation-box");
    const transText = document.getElementById("quiz-translation-text");
    if (transBox && transText) {
      transText.textContent = q.translation;
      transBox.classList.remove("hidden");
    }
  }
  
  const delay = q.translation ? 3000 : (isCorrect ? 1200 : 1800);
  
  setTimeout(() => {
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
  }, delay);
}

function submitWriteInAnswer() {
  const q = activeLessonQuizQuestions[lessonQuizCurrentIndex];
  const inputEl = document.getElementById("quiz-write-in-input");
  const submitBtn = document.getElementById("quiz-write-in-submit-btn");
  const revealArea = document.getElementById("quiz-write-in-reveal-area");
  if (!inputEl || !submitBtn) return;
  
  // If the button is currently in "Devam Et" (Continue) state:
  if (submitBtn.getAttribute("data-state") === "continue") {
    proceedFromWriteIn();
    return;
  }
  
  const userText = inputEl.value.trim();
  
  // Check answer case-insensitively
  const userClean = userText.toLowerCase().replace(/\s+/g, " ");
  const correctClean = q.correctAnswer.toLowerCase().replace(/\s+/g, " ");
  
  // Support both "-er" and "er" style for suffixes
  let isCorrect = (userClean === correctClean);
  if (!isCorrect && q.correctAnswer.startsWith("-")) {
    const rawSuffix = q.correctAnswer.slice(1).toLowerCase();
    isCorrect = (userClean === rawSuffix);
  }
  
  // Support "Ek yok" or "boş" for "Ek yok (boş)" correct answers
  if (!isCorrect && q.correctAnswer === "Ek yok (boş)") {
    isCorrect = (userClean === "ek yok" || userClean === "bos" || userClean === "boş" || userClean === "-" || userClean === "");
  }
  
  // Update sentence gap preview
  const gapSpan = document.querySelector(".quiz-sentence-gap");
  if (gapSpan) {
    gapSpan.textContent = userText || "_____";
    gapSpan.className = isCorrect ? "quiz-sentence-gap correct" : "quiz-sentence-gap incorrect";
  }
  
  // Disable input
  inputEl.disabled = true;
  
  if (isCorrect) {
    inputEl.classList.add("correct");
    playSound("true");
  } else {
    inputEl.classList.add("incorrect");
    // Reveal correct answer underneath
    if (revealArea) {
      revealArea.innerHTML = `
        <div class="quiz-write-in-correct-reveal">
          <i class="ti ti-info-circle"></i> Doğru Cevap: <strong>${q.correctAnswer}</strong>
        </div>
      `;
    }
    
    lessonQuizLives--;
    renderLessonQuizLives();
    playSound("false");
  }
  
  // Show translation if available
  if (q.translation) {
    const transBox = document.getElementById("quiz-translation-box");
    const transText = document.getElementById("quiz-translation-text");
    if (transBox && transText) {
      transText.textContent = q.translation;
      transBox.classList.remove("hidden");
    }
  }
  
  // Change button to "Devam Et" (Continue) state
  submitBtn.innerHTML = `<i class="ti ti-arrow-right"></i> Devam Et`;
  submitBtn.setAttribute("data-state", "continue");
  
  // Focus continue button so user can press Enter to go to the next question
  submitBtn.focus();
}

function proceedFromWriteIn() {
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
}

function selectLetterOption(event, selectedIdx) {
  const q = activeLessonQuizQuestions[lessonQuizCurrentIndex];
  const correctIdx = q.correct;
  const container = document.getElementById("lesson-quiz-options-container");
  if (!container) return;
  
  const allButtons = container.querySelectorAll(".quiz-option");
  allButtons.forEach(btn => btn.style.pointerEvents = "none");
  
  const clickedBtn = event.currentTarget;
  const isCorrect = selectedIdx === correctIdx;
  lessonQuizCorrectStates[lessonQuizCurrentIndex] = isCorrect;
  lessonQuizAnswersText[lessonQuizCurrentIndex] = q.options[selectedIdx];
  
  // Update active letter gap text & style in the letter text preview
  const activeGap = document.querySelector(".quiz-letter-gap.active");
  if (activeGap) {
    activeGap.textContent = q.options[selectedIdx];
    activeGap.className = isCorrect ? "quiz-letter-gap answered correct" : "quiz-letter-gap answered incorrect";
  }
  
  if (isCorrect) {
    clickedBtn.classList.add("correct");
    const icon = clickedBtn.querySelector("i");
    if (icon) icon.className = "ti ti-circle-check";
  } else {
    clickedBtn.classList.add("incorrect");
    const icon = clickedBtn.querySelector("i");
    if (icon) icon.className = "ti ti-circle-x";
    
    // Highlight correct option
    const correctBtn = allButtons[correctIdx];
    if (correctBtn) {
      correctBtn.classList.add("correct");
      const cIcon = correctBtn.querySelector("i");
      if (cIcon) cIcon.className = "ti ti-circle-check";
    }
    
    lessonQuizLives--;
    renderLessonQuizLives();
  }
  
  setTimeout(() => {
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

function finishLessonQuiz(success) {
  const overlay = document.getElementById("lesson-quiz-result-overlay");
  const card = document.getElementById("lesson-quiz-result-card");
  
  if (!overlay || !card) return;
  
  overlay.classList.remove("hidden");
  
  if (success) {
    // Save completion state
    if (!getLevelProgress().completedLessons.includes(activeLessonQuiz.id)) {
      getLevelProgress().completedLessons.push(activeLessonQuiz.id);
      state.xp += 15;
      saveState();
      updateStreakBadge();
    }
    playSound("done");
    
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
      const target = state.quizReferrer || "sitemap";
      state.quizReferrer = "";
      saveState();
      showScreen(target);
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

// ================= SENTENCE BUILDER QUIZ COMPONENT =================
let sentenceBuilderSelectedWords = [];
let sentenceBuilderScrambledWords = [];

function handleWordPillTap(scrambledIdx) {
  const scrambledContainer = document.getElementById("scrambled-words-container");
  if (!scrambledContainer) return;
  
  const pill = scrambledContainer.querySelector(`[data-scrambled-idx="${scrambledIdx}"]`);
  if (!pill || pill.classList.contains("used")) return;
  
  // Add to selected list
  sentenceBuilderSelectedWords.push({
    scrambledIdx: scrambledIdx,
    word: sentenceBuilderScrambledWords[scrambledIdx]
  });
  
  // Style as used
  pill.classList.add("used");
  
  // Re-render selected zone
  renderSentenceBuilderZone();
}

function handleSelectedWordPillTap(selectedIdx) {
  // Get item to remove
  const item = sentenceBuilderSelectedWords[selectedIdx];
  if (!item) return;
  
  // Remove from selected list
  sentenceBuilderSelectedWords.splice(selectedIdx, 1);
  
  // Re-enable pill in scrambled container
  const scrambledContainer = document.getElementById("scrambled-words-container");
  if (scrambledContainer) {
    const pill = scrambledContainer.querySelector(`[data-scrambled-idx="${item.scrambledIdx}"]`);
    if (pill) {
      pill.classList.remove("used");
    }
  }
  
  // Re-render selected zone
  renderSentenceBuilderZone();
}

function renderSentenceBuilderZone() {
  const zone = document.getElementById("sentence-builder-zone");
  const checkBtn = document.getElementById("sentence-builder-check-btn");
  if (!zone) return;
  
  if (sentenceBuilderSelectedWords.length === 0) {
    zone.innerHTML = `<span class="placeholder-text" style="color: var(--color-text-tertiary); font-size: 13px; padding-left: 8px;" id="sentence-builder-placeholder">Kelimelere dokunarak cümleyi kurun...</span>`;
    if (checkBtn) checkBtn.disabled = true;
  } else {
    zone.innerHTML = sentenceBuilderSelectedWords.map((item, idx) => `
      <button class="word-pill selected-word" onclick="handleSelectedWordPillTap(${idx})" style="animation: popIn 0.15s ease-out;">
        ${item.word}
      </button>
    `).join("");
    if (checkBtn) checkBtn.disabled = false;
  }
}

function sanitizeSentence(s) {
  return s.trim()
          .replace(/\s+/g, " ")
          .replace(/[\.\?\!\,\;\:\-]/g, "")
          .toLowerCase();
}

function checkSentenceBuilderAnswer() {
  const isGlobalQuiz = state.currentScreen === "quiz";
  const q = isGlobalQuiz 
    ? activeQuizQuestions[currentQuestionIndex] 
    : activeLessonQuizQuestions[lessonQuizCurrentIndex];
    
  const checkBtn = document.getElementById("sentence-builder-check-btn");
  const zone = document.getElementById("sentence-builder-zone");
  const scrambledContainer = document.getElementById("scrambled-words-container");
  
  if (!q || !zone || !checkBtn) return;
  
  // Disable check button and all interactions
  checkBtn.disabled = true;
  zone.style.pointerEvents = "none";
  if (scrambledContainer) scrambledContainer.style.pointerEvents = "none";
  
  // Construct user string
  const userStr = sentenceBuilderSelectedWords.map(item => item.word).join(" ");
  const sanitizedUser = sanitizeSentence(userStr);
  
  // Check if it matches any correct answers
  const isCorrect = q.correctAnswers.some(ans => sanitizeSentence(ans) === sanitizedUser);
  
  if (!isGlobalQuiz) {
    lessonQuizCorrectStates[lessonQuizCurrentIndex] = isCorrect;
    lessonQuizAnswersText[lessonQuizCurrentIndex] = userStr;
  }
  
  if (isCorrect) {
    zone.style.borderColor = "#22c55e";
    zone.style.backgroundColor = "rgba(34, 197, 94, 0.08)";
    checkBtn.innerHTML = `<i class="ti ti-circle-check-filled" style="font-size: 18px;"></i> Doğru!`;
    checkBtn.style.backgroundColor = "#22c55e";
    checkBtn.style.borderColor = "#22c55e";
    if (isGlobalQuiz) {
      correctAnswersCount++;
      state.xp += 10;
    }
    playSound("true");
  } else {
    zone.style.borderColor = "#ef4444";
    zone.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
    checkBtn.innerHTML = `<i class="ti ti-circle-x-filled" style="font-size: 18px;"></i> Yanlış`;
    checkBtn.style.backgroundColor = "#ef4444";
    checkBtn.style.borderColor = "#ef4444";
    
    // Show correct answers below the check button
    const explanation = document.createElement("div");
    explanation.style = "margin-top: 14px; padding: 12px; border-radius: var(--border-radius-md); background: rgba(239, 68, 68, 0.05); border: 1.5px solid rgba(239, 68, 68, 0.2); font-size: 12.5px; color: #ef4444; font-weight: 500; line-height: 1.5; text-align: left;";
    explanation.innerHTML = `<p style="margin: 0 0 6px 0; font-weight: 700;">Doğru Cevap(lar):</p>` + q.correctAnswers.map(ans => `<p style="margin: 3px 0 0 0;">✨ ${ans}</p>`).join("");
    zone.parentNode.insertBefore(explanation, checkBtn.nextSibling);
    
    if (!isGlobalQuiz) {
      lessonQuizLives--;
      renderLessonQuizLives();
    }
    playSound("false");
  }
  
  saveState();
  
  setTimeout(() => {
    if (isGlobalQuiz) {
      currentQuestionIndex++;
      if (currentQuestionIndex < activeQuizQuestions.length) {
        renderQuizQuestion();
      } else {
        finishQuiz();
      }
    } else {
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
    }
  }, isCorrect ? 1500 : 3500);
}
