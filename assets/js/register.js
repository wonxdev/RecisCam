/**
 * register.js — registration page
 * Creates a new student profile in the local demo database.
 */

document.addEventListener("DOMContentLoaded", () => {
  DemoStore.init();

  const btn = document.getElementById("registerBtn");
  btn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const kelas = document.getElementById("kelas").value;
    const piketDay = document.getElementById("piketDay").value;

    if (!email || !password || !kelas || !piketDay) {
      alert("Semua kolom wajib diisi!");
      return;
    }

    btn.disabled = true;
    btn.innerText = "Memproses...";

    const result = DemoStore.register({ email, kelas, piketDay });

    if (result.error) {
      alert("Gagal daftar: " + result.error);
      btn.disabled = false;
      btn.innerText = "Daftar Sekarang";
      return;
    }

    alert("Pendaftaran berhasil! Selamat datang di demo RecisCam.");
    window.location.href = "student.html";
  });
});
