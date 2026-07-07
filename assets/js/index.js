/**
 * index.js — login page
 * Demo login: password is not checked, only the email needs to match
 * a seeded or registered demo account.
 */

document.addEventListener("DOMContentLoaded", () => {
  DemoStore.init();

  // Already "logged in"? Skip straight to the right dashboard.
  const existing = DemoStore.currentProfile();
  if (existing) {
    window.location.href = existing.role === "student" ? "pages/student.html" : "pages/teacher.html";
    return;
  }

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  function attemptLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showToast("Email dan kata sandi wajib diisi.", "danger");
      return;
    }

    const result = DemoStore.login(email);
    if (result.error) {
      showToast(result.error, "danger");
      return;
    }

    window.location.href = result.profile.role === "student" ? "pages/student.html" : "pages/teacher.html";
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    attemptLogin();
  });

  document.querySelectorAll("[data-demo-account]").forEach(el => {
    el.addEventListener("click", () => {
      emailInput.value = el.dataset.demoAccount;
      passwordInput.value = "demo1234";
      attemptLogin();
    });
  });
});
