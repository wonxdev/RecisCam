/**
 * register.js — registration page
 * Creates a new student profile in the local demo database.
 */

document.addEventListener("DOMContentLoaded", () => {
  DemoStore.init();

  const form = document.getElementById("registerForm");
  const btn = document.getElementById("registerBtn");

  form.addEventListener("submit", event => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const kelas = document.getElementById("kelas").value;
    const piketDay = document.getElementById("piketDay").value;

    if (!email || !password || !kelas || !piketDay) {
      showToast("Semua kolom wajib diisi.", "danger");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Memproses…";

    const result = DemoStore.register({ email, kelas, piketDay });

    if (result.error) {
      showToast(result.error, "danger");
      btn.disabled = false;
      btn.textContent = "Daftar Sekarang";
      return;
    }

    window.location.href = "student.html";
  });
});
