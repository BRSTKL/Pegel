// auth.js - Supabase Authentication & Sync Service (Global Namespace)
// Tüm fonksiyonlar window.Auth global nesnesi üzerinden erişilir.

(function() {
  "use strict";

  // TODO: Supabase projenizi oluşturduktan sonra bu iki değeri kendi projenize göre güncelleyin.
  const SUPABASE_URL = ""; 
  const SUPABASE_ANON_KEY = "";

  let supabaseClient = null;

  function isConfigured() {
    return SUPABASE_URL.trim() !== "" && SUPABASE_ANON_KEY.trim() !== "";
  }

  function getSupabase() {
    if (!supabaseClient && isConfigured() && window.supabase) {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
  }

  // Kayıt Ol
  async function signUp(email, password, fullName) {
    const sb = getSupabase();
    if (!sb) {
      // Çevrimdışı modda yerel kullanıcı kaydı
      let users = JSON.parse(localStorage.getItem("pegel_local_users") || "[]");
      if (users.some(u => u.email === email)) {
        return { data: null, error: { message: "Bu e-posta adresi zaten kayıtlı." } };
      }
      const newUser = { email, password, fullName, state: null };
      users.push(newUser);
      localStorage.setItem("pegel_local_users", JSON.stringify(users));
      localStorage.setItem("pegel_local_active_user", email);
      return { data: { user: { email, user_metadata: { display_name: fullName } } }, error: null };
    }

    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { display_name: fullName } }
    });
    return { data, error };
  }

  // Giriş Yap
  async function signIn(email, password) {
    const sb = getSupabase();
    if (!sb) {
      let users = JSON.parse(localStorage.getItem("pegel_local_users") || "[]");
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        return { data: null, error: { message: "Hatalı e-posta veya şifre." } };
      }
      localStorage.setItem("pegel_local_active_user", email);
      return { data: { user: { email, user_metadata: { display_name: user.fullName } } }, error: null };
    }

    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    return { data, error };
  }

  // Çıkış Yap
  async function signOut() {
    const sb = getSupabase();
    if (!sb) {
      localStorage.removeItem("pegel_local_active_user");
      return { error: null };
    }
    const { error } = await sb.auth.signOut();
    return { error };
  }

  // Oturum bilgisini al
  async function getCurrentUser() {
    const sb = getSupabase();
    if (!sb) {
      const active = localStorage.getItem("pegel_local_active_user");
      if (active) {
        let users = JSON.parse(localStorage.getItem("pegel_local_users") || "[]");
        const user = users.find(u => u.email === active);
        if (user) {
          return { user: { email: user.email, user_metadata: { display_name: user.fullName } } };
        }
      }
      return { user: null };
    }
    const { data: { user } } = await sb.auth.getUser();
    return { user };
  }

  // İlerlemeyi buluta kaydet
  async function pushState(stateData) {
    const sb = getSupabase();
    const { user } = await getCurrentUser();
    if (!user) return false;

    if (!sb) {
      let users = JSON.parse(localStorage.getItem("pegel_local_users") || "[]");
      const idx = users.findIndex(u => u.email === user.email);
      if (idx !== -1) {
        users[idx].state = stateData;
        localStorage.setItem("pegel_local_users", JSON.stringify(users));
      }
      return true;
    }

    try {
      const { error } = await sb
        .from("user_progress")
        .upsert({
          user_id: user.id,
          state: stateData,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });
      if (error) { console.error("Push error:", error); return false; }
      return true;
    } catch (err) {
      console.error("Push state failed:", err);
      return false;
    }
  }

  // İlerlemeyi buluttan çek
  async function fetchState() {
    const sb = getSupabase();
    const { user } = await getCurrentUser();
    if (!user) return null;

    if (!sb) {
      let users = JSON.parse(localStorage.getItem("pegel_local_users") || "[]");
      const localUser = users.find(u => u.email === user.email);
      return localUser ? localUser.state : null;
    }

    try {
      const { data, error } = await sb
        .from("user_progress")
        .select("state")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) { console.error("Fetch error:", error); return null; }
      return data ? data.state : null;
    } catch (err) {
      console.error("Fetch state failed:", err);
      return null;
    }
  }

  // Global nesneye ata
  window.Auth = {
    isConfigured,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    pushState,
    fetchState
  };
})();
