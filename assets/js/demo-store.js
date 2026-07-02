/**
 * demo-store.js
 * A tiny fake backend that stands in for Supabase in the portfolio demo.
 * Everything lives in the browser's localStorage — no server, no database.
 * Reloading the page keeps your changes; use DemoStore.reset() to start over.
 */

const DemoStore = (() => {
  const DB_KEY = "reciscam_demo_db";
  const SESSION_KEY = "reciscam_demo_session";
  const DAY_MS = 24 * 60 * 60 * 1000;

  function buildSeedAttendance() {
    const now = Date.now();
    return DEMO_SEED.attendance.map((a, i) => ({
      id: `seed-att-${i}`,
      user_id: a.userId,
      status: a.status,
      note: a.note || "",
      photo_name: "bukti-piket.jpg",
      created_at: new Date(now - a.daysAgo * DAY_MS).toISOString()
    }));
  }

  function buildSeedNotifications() {
    return DEMO_SEED.notifications.map((n, i) => ({
      id: `seed-note-${i}`,
      user_id: n.userId,
      message: n.message,
      is_read: false,
      created_at: new Date().toISOString()
    }));
  }

  function seedDB() {
    const db = {
      profiles: JSON.parse(JSON.stringify(DEMO_SEED.profiles)),
      attendance: buildSeedAttendance(),
      notifications: buildSeedNotifications()
    };
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    return db;
  }

  function getDB() {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : seedDB();
  }

  function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  function newId(prefix) {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  function init() {
    if (!localStorage.getItem(DB_KEY)) seedDB();
  }

  function reset() {
    localStorage.removeItem(DB_KEY);
    localStorage.removeItem(SESSION_KEY);
    seedDB();
  }

  /* ---------- Session ---------- */

  function getSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  function setSession(userId) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function currentProfile() {
    const session = getSession();
    if (!session) return null;
    return getDB().profiles.find(p => p.id === session.userId) || null;
  }

  /* ---------- Auth ---------- */

  function login(email) {
    const db = getDB();
    const profile = db.profiles.find(
      p => p.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!profile) {
      return { error: "Akun demo tidak ditemukan. Gunakan akun contoh atau daftar akun baru." };
    }
    setSession(profile.id);
    return { profile };
  }

  function register({ email, kelas, piketDay, fullName }) {
    const db = getDB();
    const exists = db.profiles.some(
      p => p.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      return { error: "Email sudah terdaftar di demo ini." };
    }
    const profile = {
      id: newId("student"),
      email: email.trim(),
      role: "student",
      full_name: fullName || email.split("@")[0],
      class: kelas,
      piket_day: piketDay
    };
    db.profiles.push(profile);
    saveDB(db);
    setSession(profile.id);
    return { profile };
  }

  function logout() {
    clearSession();
  }

  /* ---------- Attendance ---------- */

  function listAttendanceForUser(userId) {
    return getDB()
      .attendance.filter(a => a.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  function listAllAttendance() {
    const db = getDB();
    const profileMap = {};
    db.profiles.forEach(p => (profileMap[p.id] = p));
    return db.attendance
      .map(a => ({ ...a, profile: profileMap[a.user_id] || {} }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  function submitAttendance(userId, photoName) {
    const db = getDB();
    db.attendance.push({
      id: newId("att"),
      user_id: userId,
      status: "pending",
      note: "",
      photo_name: photoName || "bukti-piket.jpg",
      created_at: new Date().toISOString()
    });
    saveDB(db);
  }

  function updateAttendanceStatus(id, status, note) {
    const db = getDB();
    const record = db.attendance.find(a => a.id === id);
    if (!record) return;
    record.status = status;
    record.note = note || "";

    db.notifications.push({
      id: newId("note"),
      user_id: record.user_id,
      message:
        status === "present"
          ? "Laporan piket disetujui"
          : `Laporan piket ditolak${note ? ": " + note : ""}`,
      is_read: false,
      created_at: new Date().toISOString()
    });

    saveDB(db);
  }

  /* ---------- Notifications ---------- */

  function listUnreadNotifications(userId) {
    return getDB().notifications.filter(
      n => n.user_id === userId && !n.is_read
    );
  }

  function dismissNotification(id) {
    const db = getDB();
    const note = db.notifications.find(n => n.id === id);
    if (note) note.is_read = true;
    saveDB(db);
  }

  return {
    init,
    reset,
    getSession,
    currentProfile,
    login,
    register,
    logout,
    listAttendanceForUser,
    listAllAttendance,
    submitAttendance,
    updateAttendanceStatus,
    listUnreadNotifications,
    dismissNotification
  };
})();
