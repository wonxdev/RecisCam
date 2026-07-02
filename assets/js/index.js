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
    window.location.href = existing.role === "student" ? "student.html" : "teacher.html";
    return;
  }

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const btn = document.getElementById("loginBtn");

  function attemptLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Email dan kata sandi wajib diisi.");
      return;
    }

    const result = DemoStore.login(email);
    if (result.error) {
      alert(result.error);
      return;
    }

    window.location.href = result.profile.role === "student" ? "student.html" : "teacher.html";
  }

  btn.addEventListener("click", attemptLogin);

  document.querySelectorAll("[data-demo-account]").forEach(el => {
    el.addEventListener("click", () => {
      emailInput.value = el.dataset.demoAccount;
      passwordInput.value = "demo1234";
      attemptLogin();
    });
  });
});
