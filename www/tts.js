// tts.js - Read-aloud (text-to-speech) for the German reading texts.
//
// Engines:
//  - Native app (Android/iOS): @capacitor-community/text-to-speech. Android's
//    WebView has no speechSynthesis at all, so the plugin is required there.
//  - Browser: Web Speech API, auto-picking the best German voice on the device
//    (Edge "Natural", Google, Apple Premium/Enhanced voices rank highest).
//
// Texts are rendered as sentence spans (ReadAloud.markup) and spoken one
// sentence at a time. That gives sentence highlighting, pause/resume and
// prev/next on both engines (the native plugin has no pause), and keeps each
// utterance short enough for Chrome's network voices, which cut off long ones.

const ReadAloud = (() => {
  const LANG = "de-DE";
  const RATES = [0.6, 0.8, 1, 1.2];
  const PREFS_KEY = "pegel_tts_prefs";

  // A period after these words does not end a sentence ("Dr. Keller", "Tel. 030", "ca. 20").
  const ABBREVIATIONS = new Set([
    "Abb", "Abs", "Abt", "allg", "Anm", "Apr", "Aug", "Bd", "bspw", "bzgl", "bzw", "ca", "Ca",
    "Chr", "Co", "Dez", "Di", "Dipl", "Do", "Dr", "ehem", "einschl", "entspr", "evtl", "exkl",
    "Feb", "Fr", "Frl", "geb", "gegr", "ggf", "Hbf", "Hr", "Hrn", "Hrsg", "Ing", "inkl", "insb",
    "Jan", "Jh", "Jul", "Jun", "Kap", "Mär", "max", "Mi", "min", "mind", "Mio", "Mo", "Mrd",
    "Nov", "Nr", "Okt", "Pkt", "Prof", "Sa", "Sep", "Sept", "So", "sog", "St", "Std", "Str",
    "Tel", "Tsd", "vgl", "Vgl", "zzgl",
    // capitalised at the start of a sentence or line
    "Bzw", "Evtl", "Ggf", "Inkl", "Max", "Min", "Mind", "Zzgl"
  ]);
  const SENTENCE_END = /[.!?…]+["'“”„«»‘’)\]]*(?=\s|$)/g;

  // Apple's novelty voices (Eddy, Grandma, Rocko...) sound robotic; never offer them.
  const NOVELTY_VOICE = /eloquence|speech\.synthesis|\b(eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b/i;

  let prefs = { rate: 1, voiceURI: "" };
  try {
    Object.assign(prefs, JSON.parse(localStorage.getItem(PREFS_KEY)) || {});
  } catch (e) { /* keep defaults */ }
  if (!RATES.includes(prefs.rate)) prefs.rate = 1;

  function savePrefs() {
    try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) { /* ignore */ }
  }

  // ================= TEXT → SENTENCES =================

  function isSentenceBoundary(str, punctIdx, end) {
    const next = str.slice(end).trimStart()[0] || "";
    if (/[a-zäöüß,;:]/.test(next)) return false; // sentence continues
    if (str[punctIdx] !== ".") return true;
    const word = (str.slice(0, punctIdx).match(/[\p{L}\d]+$/u) || [""])[0];
    if (/^\d{1,2}$/.test(word)) return false; // German ordinals: "am 3. Mai"
    if (/^\p{L}$/u.test(word)) return false;  // initials, "z. B.", "u. a."
    return !ABBREVIATIONS.has(word);
  }

  // Some texts are hard-wrapped at ~60 chars ("…gut für die Umwelt. Viele\nStädte…").
  // A long line that stops without punctuation continues on the next line;
  // any other line break (headings, ad lines, list items) ends the sentence.
  function isSoftWrap(line, nextLine) {
    return line.trim().length >= 35 && !/[.!?…:"“”»)]\s*$/.test(line) && !/^\s*[-–•*]/.test(nextLine);
  }

  function pushRange(ranges, str, base, from, to) {
    const seg = str.slice(from, to);
    if (!seg.trim()) return;
    const lead = seg.length - seg.trimStart().length;
    const trail = seg.length - seg.trimEnd().length;
    ranges.push([base + from + lead, base + to - trail]);
  }

  function splitBlock(text, from, to, ranges) {
    const block = text.slice(from, to);
    let segStart = 0;
    let m;
    SENTENCE_END.lastIndex = 0;
    while ((m = SENTENCE_END.exec(block))) {
      const end = m.index + m[0].length;
      if (end < block.length && !isSentenceBoundary(block, m.index, end)) continue;
      pushRange(ranges, block, from, segStart, end);
      segStart = end;
    }
    pushRange(ranges, block, from, segStart, block.length);
  }

  // Returns [start, end] offsets of each sentence in `text`.
  function splitSentences(text) {
    const ranges = [];
    const lines = [];
    const lineRe = /[^\n]+/g;
    let m;
    while ((m = lineRe.exec(text))) lines.push([m.index, m.index + m[0].length]);

    let blockStart = null;
    lines.forEach(([start, end], i) => {
      if (blockStart === null) blockStart = start;
      const next = lines[i + 1];
      const paragraphBreak = !next || /\n\s*\n/.test(text.slice(end, next[0]));
      if (paragraphBreak || !isSoftWrap(text.slice(start, end), text.slice(next[0], next[1]))) {
        splitBlock(text, blockStart, end, ranges);
        blockStart = null;
      }
    });
    return ranges;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // Escaped HTML for `text` with every sentence wrapped in a .tts-sentence span.
  // Whitespace between sentences is kept, so pre-line paragraphs render as before.
  function markup(text) {
    const src = String(text || "");
    let html = "";
    let pos = 0;
    splitSentences(src).forEach(([start, end]) => {
      html += escapeHtml(src.slice(pos, start));
      html += `<span class="tts-sentence">${escapeHtml(src.slice(start, end))}</span>`;
      pos = end;
    });
    return html + escapeHtml(src.slice(pos));
  }

  function buttonHtml(blockId, label) {
    return `<button type="button" class="tts-listen-btn" data-tts-play="${escapeHtml(blockId)}" data-tts-label="${escapeHtml(label)}" aria-label="${escapeHtml(label)} – sesli dinle" title="Sesli dinle"><i class="ti ti-volume"></i><span>Dinle</span></button>`;
  }

  // ================= ENGINES =================

  function nativePlugin() {
    const cap = window.Capacitor;
    if (!cap || !cap.isNativePlatform || !cap.isNativePlatform()) return null;
    return (cap.Plugins && cap.Plugins.TextToSpeech) || null;
  }

  function webSynth() {
    return ("speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined") ? window.speechSynthesis : null;
  }

  function platform() {
    const cap = window.Capacitor;
    if (cap && cap.isNativePlatform && cap.isNativePlatform()) return cap.getPlatform();
    const ua = navigator.userAgent || "";
    if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) return "ios";
    return /Android/.test(ua) ? "android" : "web";
  }

  function voiceScore(v) {
    const id = `${v.name || ""} ${v.voiceURI || ""}`.toLowerCase();
    const lang = (v.lang || "").replace("_", "-").toLowerCase();
    let score = lang === "de-de" ? 20 : 0;
    if (/natural|neural/.test(id)) score += 100;      // Edge / Azure neural voices
    if (/premium/.test(id)) score += 90;              // Apple premium
    if (/enhanced|verbessert/.test(id)) score += 70;  // Apple enhanced
    if (/google/.test(id)) score += 50;               // Chrome's Google Deutsch
    if (/-network$/.test(id)) score += 30;            // Android network voices
    if (/compact/.test(id)) score -= 10;
    return score;
  }

  function germanVoices(list) {
    return list
      .map((v, index) => ({ v, index }))
      .filter(({ v }) => (v.lang || "").toLowerCase().startsWith("de") && !NOVELTY_VOICE.test(`${v.name} ${v.voiceURI}`))
      .sort((a, b) => voiceScore(b.v) - voiceScore(a.v));
  }

  function voiceLabel(v) {
    const uri = v.voiceURI || "";
    const android = uri.match(/x-([a-z]{3})-(local|network)$/i);
    if (android) return `Google ${android[1].toUpperCase()} · ${android[2] === "network" ? "çevrimiçi" : "cihazda"}`;
    let label = (v.name || uri).replace(/\s+-\s+.*$/, "");
    if (/premium/i.test(uri) && !/premium/i.test(label)) label += " · Premium";
    else if (/enhanced/i.test(uri) && !/enhanced/i.test(label)) label += " · Gelişmiş";
    const region = (v.lang || "").split(/[-_]/)[1];
    if (region && region.toUpperCase() !== "DE") label += ` (${region.toUpperCase()})`;
    return label;
  }

  let nativeVoicesPromise = null;
  function nativeVoices() {
    const plugin = nativePlugin();
    if (!plugin) return Promise.resolve([]);
    if (!nativeVoicesPromise) {
      nativeVoicesPromise = plugin.getSupportedVoices()
        .then(res => (res && res.voices) || [])
        .catch(() => { nativeVoicesPromise = null; return []; });
    }
    return nativeVoicesPromise;
  }

  // All German voices on this device, best first: [{ voiceURI, label }].
  async function listVoices() {
    const raw = nativePlugin() ? await nativeVoices() : (webSynth() ? webSynth().getVoices() : []);
    return germanVoices(raw).map(({ v }) => ({ voiceURI: v.voiceURI, label: voiceLabel(v) }));
  }

  async function nativeVoiceIndex() {
    const voices = germanVoices(await nativeVoices());
    if (prefs.voiceURI) {
      const chosen = voices.find(({ v }) => v.voiceURI === prefs.voiceURI);
      if (chosen) return chosen.index;
    }
    // Android's engine default for de-DE is already its best local voice. iOS
    // defaults to the compact voice even when Premium/Enhanced is installed.
    if (platform() === "ios" && voices.length) return voices[0].index;
    return -1;
  }

  function webVoice() {
    const synth = webSynth();
    const voices = synth ? germanVoices(synth.getVoices()) : [];
    if (prefs.voiceURI) {
      const chosen = voices.find(({ v }) => v.voiceURI === prefs.voiceURI);
      if (chosen) return chosen.v;
    }
    return voices.length ? voices[0].v : null;
  }

  // Chrome's Google network voices stop after ~15 s, so long sentences are cut at
  // commas for them. Other voices get whole sentences for natural intonation.
  function speechChunks(sentence) {
    const voice = !nativePlugin() && webVoice();
    if (!voice || voice.localService || !/google/i.test(voice.name)) return [sentence];
    const limit = Math.round(170 * Math.min(1, prefs.rate));
    if (sentence.length <= limit) return [sentence];
    const chunks = [];
    let current = "";
    // Cut after , ; : – followed by a space ("14,90" and "12:00" stay whole).
    // No lookbehind here: it is a syntax error before iOS 16.4.
    (sentence.match(/(?:[^,;:–—]|[,;:–—](?=\S))+[,;:–—]*/g) || [sentence]).map(part => part.trim()).filter(Boolean).forEach(part => {
      if (current && (current + " " + part).length > limit) {
        chunks.push(current);
        current = part;
      } else {
        current = current ? `${current} ${part}` : part;
      }
    });
    if (current) chunks.push(current);
    return chunks;
  }

  let currentUtterance = null; // Chrome drops onend if the utterance is garbage collected
  let webCancelled = false;

  function webSpeak(synth, text) {
    return new Promise((resolve, reject) => {
      const u = new SpeechSynthesisUtterance(text);
      const voice = webVoice();
      u.lang = voice ? voice.lang : LANG;
      if (voice) u.voice = voice;
      u.rate = prefs.rate;
      u.onend = () => resolve();
      u.onerror = e => (e.error === "interrupted" || e.error === "canceled") ? resolve() : reject(e);
      currentUtterance = u;
      const start = () => {
        if (currentUtterance !== u) return resolve();
        if (synth.paused) synth.resume();
        synth.speak(u);
      };
      // Safari drops an utterance queued right after cancel(). The very first
      // speak() stays synchronous: iOS only allows it inside the tap handler.
      if (webCancelled) {
        webCancelled = false;
        setTimeout(start, 80);
      } else {
        start();
      }
    });
  }

  async function engineSpeak(text) {
    const plugin = nativePlugin();
    if (plugin) {
      const options = { text, lang: LANG, rate: prefs.rate, category: "playback" };
      const voice = await nativeVoiceIndex();
      if (voice >= 0) options.voice = voice;
      return plugin.speak(options);
    }
    const synth = webSynth();
    if (synth) return webSpeak(synth, text);
    throw new Error("unsupported");
  }

  function engineStop() {
    const plugin = nativePlugin();
    if (plugin) {
      plugin.stop().catch(() => {});
      return;
    }
    const synth = webSynth();
    if (synth) {
      currentUtterance = null;
      if (synth.speaking || synth.pending) webCancelled = true;
      synth.cancel();
    }
  }

  // ================= PLAYBACK =================

  // { blockId, label, sentences, index, chunk, playing, done, notice }
  let session = null;
  // Bumped on every stop/seek; a playback loop exits once its token is stale.
  // (Android never resolves a speak() that stop() interrupted.)
  let token = 0;

  function blockEl(blockId) {
    return Array.from(document.querySelectorAll("[data-tts-block]")).find(el => el.dataset.ttsBlock === blockId) || null;
  }

  function sentenceEls(block) {
    return block ? Array.from(block.querySelectorAll(".tts-sentence")) : [];
  }

  async function run(myToken) {
    while (session && myToken === token && session.index < session.sentences.length) {
      syncUi(true);
      const chunks = speechChunks(session.sentences[session.index]);
      for (let c = session.chunk; c < chunks.length; c++) {
        session.chunk = c;
        try {
          await engineSpeak(chunks[c]);
        } catch (err) {
          if (myToken === token) fail(err);
          return;
        }
        if (!session || myToken !== token) return;
      }
      session.chunk = 0;
      session.index++;
    }
    if (session && myToken === token) {
      session.playing = false;
      session.done = true;
      session.index = 0;
      syncUi();
    }
  }

  // console.log, not warn: warnings open the on-screen debug panel (index.html)
  function fail(err) {
    console.log("Read-aloud failed:", err && (err.message || err.error || err));
    if (!session) return;
    session.playing = false;
    const unsupported = /not supported|unsupported/i.test(String(err && (err.message || err)));
    session.notice = unsupported ? "Almanca ses bulunamadı" : "Ses çalınamadı";
    syncUi();
    if (unsupported) openSettings(true);
  }

  function play(blockId, label) {
    const block = blockEl(blockId);
    const sentences = sentenceEls(block).map(el => el.textContent.replace(/\s+/g, " ").trim());
    if (!sentences.length) return;
    stop();
    session = { blockId, label: label || "Metin", sentences, index: 0, chunk: 0, playing: false, done: false, notice: "" };
    if (!nativePlugin() && !webSynth()) {
      session.notice = "Bu cihaz sesli okumayı desteklemiyor";
      syncUi();
      return;
    }
    resume();
  }

  function resume() {
    if (!session) return;
    session.playing = true;
    session.done = false;
    session.notice = "";
    run(++token);
  }

  function pause() {
    if (!session || !session.playing) return;
    token++;
    session.playing = false;
    engineStop();
    syncUi();
  }

  function stop() {
    token++;
    if (session) engineStop();
    session = null;
    closeSettings();
    syncUi();
  }

  function seek(index) {
    if (!session) return;
    const wasPlaying = session.playing;
    token++;
    if (wasPlaying) engineStop();
    session.index = Math.max(0, Math.min(index, session.sentences.length - 1));
    session.chunk = 0;
    session.done = false;
    if (wasPlaying) resume();
    else syncUi(true);
  }

  // Restart the current sentence so a new speed/voice applies right away.
  function restartCurrent() {
    if (session && session.playing) {
      token++;
      engineStop();
      session.chunk = 0;
      resume();
    }
  }

  function toggle(blockId, label) {
    if (!session || session.blockId !== blockId) return play(blockId, label);
    if (session.playing) pause();
    else resume();
  }

  // Pronounce a single word or sentence (vocabulary cards, quiz examples).
  function speakOnce(text) {
    if (!text) return;
    stop();
    engineStop();
    engineSpeak(String(text)).catch(err => console.log("Read-aloud failed:", err && (err.message || err.error || err)));
  }

  // ================= UI =================

  function scrollIntoViewIfNeeded(el) {
    let scroller = el.parentElement;
    while (scroller && scroller !== document.body) {
      const oy = getComputedStyle(scroller).overflowY;
      if ((oy === "auto" || oy === "scroll") && scroller.scrollHeight > scroller.clientHeight) break;
      scroller = scroller.parentElement;
    }
    if (!scroller || scroller === document.body) return;
    const box = scroller.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.top < box.top + 12 || r.bottom > box.bottom - 12) {
      scroller.scrollBy({ top: r.top - box.top - 60, behavior: "smooth" });
    }
  }

  // Re-applies highlight and button states; call after re-rendering a text.
  function syncUi(scrollToCurrent = false) {
    const activeId = session && session.blockId;
    const playing = !!(session && session.playing);

    document.querySelectorAll("[data-tts-play]").forEach(btn => {
      const active = btn.dataset.ttsPlay === activeId;
      const isPlaying = active && playing;
      btn.classList.toggle("is-active", active);
      btn.classList.toggle("is-playing", isPlaying);
      btn.setAttribute("aria-pressed", isPlaying ? "true" : "false");
      const icon = btn.querySelector("i");
      if (icon) icon.className = `ti ${isPlaying ? "ti-player-pause" : "ti-volume"}`;
      const text = btn.querySelector("span");
      if (text) text.textContent = isPlaying ? "Duraklat" : (active && !session.done ? "Devam" : "Dinle");
    });

    document.querySelectorAll("[data-tts-block]").forEach(block => {
      const active = block.dataset.ttsBlock === activeId;
      block.classList.toggle("tts-block-active", active);
      sentenceEls(block).forEach((el, i) => {
        el.classList.toggle("tts-current", active && !session.done && i === session.index);
      });
    });

    const player = document.getElementById("tts-player");
    if (!player) return;
    player.classList.toggle("hidden", !session);
    if (!session) return;

    const total = session.sentences.length;
    player.querySelector("#tts-player-title").textContent = session.label;
    player.querySelector("#tts-player-progress").textContent = session.notice
      || (session.done ? "Tamamlandı · tekrar dinlemek için ▶" : `Cümle ${session.index + 1} / ${total}`);
    const mainBtn = player.querySelector('[data-tts-action="toggle"]');
    mainBtn.querySelector("i").className = `ti ${playing ? "ti-player-pause" : "ti-player-play"}`;
    mainBtn.setAttribute("aria-label", playing ? "Duraklat" : "Oynat");
    player.querySelector('[data-tts-action="rate"]').textContent = `${prefs.rate}x`;
    player.querySelector('[data-tts-action="prev"]').disabled = session.index === 0;
    player.querySelector('[data-tts-action="next"]').disabled = session.index >= total - 1;

    if (scrollToCurrent && !session.done) {
      const current = sentenceEls(blockEl(session.blockId))[session.index];
      if (current) scrollIntoViewIfNeeded(current);
    }
  }

  function closeSettings() {
    const panel = document.getElementById("tts-player-settings");
    if (panel) panel.classList.add("hidden");
    const btn = document.querySelector('[data-tts-action="settings"]');
    if (btn) btn.setAttribute("aria-expanded", "false");
  }

  async function openSettings(forceOpen = false) {
    const panel = document.getElementById("tts-player-settings");
    if (!panel) return;
    if (!forceOpen && !panel.classList.contains("hidden")) return closeSettings();
    panel.classList.remove("hidden");
    document.querySelector('[data-tts-action="settings"]')?.setAttribute("aria-expanded", "true");

    const select = document.getElementById("tts-voice-select");
    const hint = document.getElementById("tts-voice-hint");
    const installBtn = document.getElementById("tts-install-btn");
    const voices = await listVoices();

    select.innerHTML = `<option value="">Otomatik (en iyi ses)</option>` +
      voices.map(v => `<option value="${escapeHtml(v.voiceURI)}">${escapeHtml(v.label)}</option>`).join("");
    select.value = voices.some(v => v.voiceURI === prefs.voiceURI) ? prefs.voiceURI : "";

    const os = platform();
    const hasHighQuality = voices.some(v => /premium|enhanced/i.test(v.voiceURI));
    let hintText = "";
    if (!voices.length) {
      hintText = os === "android" && nativePlugin()
        ? "Cihazınızda Almanca ses paketi yok. Aşağıdaki butonla indirebilirsiniz."
        : "Cihazınızda Almanca ses bulunamadı. Sistem ayarlarından Almanca bir ses indirin.";
    } else if (os === "ios" && !hasHighQuality) {
      hintText = "Daha doğal bir ses için: Ayarlar › Erişilebilirlik › Sesli İçerik › Sesler › Almanca bölümünden “Anna (Gelişmiş)” veya “Premium” bir ses indirin.";
    }
    hint.textContent = hintText;
    hint.classList.toggle("hidden", !hintText);
    installBtn.classList.toggle("hidden", !(os === "android" && nativePlugin()));
    installBtn.lastChild.textContent = voices.length ? " Ses paketlerini yönet" : " Almanca ses paketini yükle";
  }

  function bindUi() {
    document.addEventListener("click", e => {
      const playBtn = e.target.closest("[data-tts-play]");
      if (playBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggle(playBtn.dataset.ttsPlay, playBtn.dataset.ttsLabel);
        return;
      }

      const action = e.target.closest("[data-tts-action]");
      if (action) {
        const name = action.dataset.ttsAction;
        if (name === "toggle" && session) {
          if (session.playing) pause();
          else resume();
        } else if (name === "prev" && session) {
          seek(session.index - 1);
        } else if (name === "next" && session) {
          seek(session.index + 1);
        } else if (name === "rate") {
          prefs.rate = RATES[(RATES.indexOf(prefs.rate) + 1) % RATES.length];
          savePrefs();
          syncUi();
          restartCurrent();
        } else if (name === "settings") {
          openSettings();
        } else if (name === "install") {
          const plugin = nativePlugin();
          if (plugin) plugin.openInstall().catch(() => {});
          nativeVoicesPromise = null;
        } else if (name === "close") {
          stop();
        }
        return;
      }

      // Tapping a sentence of the text being read jumps there.
      const sentence = e.target.closest(".tts-sentence");
      if (sentence && session) {
        const block = sentence.closest("[data-tts-block]");
        const selection = window.getSelection && window.getSelection();
        if (block && block.dataset.ttsBlock === session.blockId && (!selection || selection.isCollapsed)) {
          const index = sentenceEls(block).indexOf(sentence);
          if (index >= 0) {
            seek(index);
            if (!session.playing) resume();
          }
        }
      }
    });

    document.addEventListener("change", e => {
      if (e.target && e.target.id === "tts-voice-select") {
        prefs.voiceURI = e.target.value;
        savePrefs();
        restartCurrent();
      }
    });

    // Chrome loads voices asynchronously; refresh an open voice list when they arrive.
    const synth = webSynth();
    if (synth && !nativePlugin()) {
      const onVoices = () => {
        const panel = document.getElementById("tts-player-settings");
        if (panel && !panel.classList.contains("hidden")) openSettings(true);
      };
      if (synth.addEventListener) synth.addEventListener("voiceschanged", onVoices);
      else synth.onvoiceschanged = onVoices;
      synth.getVoices();
    }
  }

  bindUi();

  return { markup, buttonHtml, toggle, stop, speakOnce, syncUi, splitSentences };
})();
