/**
 * app.js
 * Small shared helpers used on every page.
 */

// Injects the "Portfolio Demo" badge into the top of the page.
function renderDemoBadge() {
  const badge = document.createElement("div");
  badge.className = "demo-badge";
  badge.innerHTML = "Portfolio Demo - data contoh, tidak tersimpan ke server";
  document.body.prepend(badge);
}

// Redirects to index.html if no demo session exists, or to the wrong
// dashboard if the logged-in role doesn't match the page.
function requireRole(role) {
  const profile = DemoStore.currentProfile();
  if (!profile) {
    window.location.replace("index.html");
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
  window.location.replace("index.html");
}

document.addEventListener("DOMContentLoaded", () => {
  DemoStore.init();
  renderDemoBadge();
});
