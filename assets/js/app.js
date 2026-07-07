/**
 * app.js
 * Small shared helpers used on every page.
 */

// Injects the "Portfolio Demo" banner at the top of the page.
function renderDemoBadge() {
  const badge = document.createElement("div");
  badge.className = "demo-badge";
  badge.textContent = "Portfolio Demo — data contoh, tidak tersimpan ke server";
  document.body.prepend(badge);
}

// Shows a toast notification. `type` is "info", "success", or "danger".
// Auto-dismisses unless `sticky` is true. Returns the toast element.
function showToast(message, type = "info", { sticky = false, onClose } = {}) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = type === "info" ? "toast" : `toast toast-${type}`;
  toast.setAttribute("role", "status");

  const text = document.createElement("span");
  text.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.className = "toast-close";
  closeBtn.setAttribute("aria-label", "Tutup notifikasi");
  closeBtn.textContent = "×";

  function dismiss() {
    toast.classList.add("is-leaving");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
    if (onClose) onClose();
  }

  closeBtn.addEventListener("click", dismiss);
  toast.append(text, closeBtn);
  container.appendChild(toast);

  if (!sticky) setTimeout(dismiss, 4000);
  return toast;
}

// Redirects to index.html if no demo session exists, or to the wrong
// dashboard if the logged-in role doesn't match the page.
// NOTE: requireRole() and logoutAndRedirect() are only used by pages inside
// /pages/ (student.html, teacher.html), so their redirects are relative to
// that subfolder (one level up to reach the root index.html).
function requireRole(role) {
  const profile = DemoStore.currentProfile();
  if (!profile) {
    window.location.replace("../index.html");
    return null;
  }
  if (profile.role !== role) {
    window.location.replace(profile.role === "student" ? "student.html" : "teacher.html");
    return null;
  }
  return profile;
}

function logoutAndRedirect() {
  DemoStore.logout();
  window.location.replace("../index.html");
}

document.addEventListener("DOMContentLoaded", () => {
  DemoStore.init();
  renderDemoBadge();
});
