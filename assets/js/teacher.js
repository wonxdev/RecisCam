/**
 * teacher.js — teacher dashboard
 * Lists attendance reports from the local demo database, lets the
 * teacher approve/reject them, and exports the list to Excel.
 */

let cachedData = [];

function statusBadge(status) {
  const s = (status || "").toLowerCase();
  if (["present", "approved", "hadir"].includes(s)) return { badgeClass: "approved", label: "Hadir" };
  if (["absent", "rejected", "ditolak"].includes(s)) return { badgeClass: "rejected", label: "Ditolak" };
  if (["late", "terlambat"].includes(s)) return { badgeClass: "pending", label: "Terlambat" };
  if (["overdue", "terlewat", "missed"].includes(s)) return { badgeClass: "rejected", label: "Terlewat" };
  return { badgeClass: "pending", label: "Menunggu" };
}

function loadList() {
  const listEl = document.getElementById("list");
  const dayFilter = document.getElementById("dayFilter").value || "all";

  let data = DemoStore.listAllAttendance();
  if (dayFilter !== "all") {
    data = data.filter(item => item.profile && item.profile.piket_day === dayFilter);
  }

  cachedData = data;

  if (data.length === 0) {
    listEl.innerHTML = `<div style="text-align:center; margin-top:40px;">Belum ada laporan masuk.</div>`;
    return;
  }

  listEl.innerHTML = data
    .map(a => {
      const date = new Date(a.created_at);
      const timeStr = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      const dateStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      const { badgeClass, label } = statusBadge(a.status);

      const name = a.profile.full_name || "Siswa";
      const className = a.profile.class || "Kelas Tidak Ada";
      const piket = a.profile.piket_day || "-";

      return `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <div style="font-weight:700; font-size:1.1rem;">${name} (${className})</div>
              <small style="color:var(--text-muted);">${piket} • ${dateStr} ${timeStr}</small>
            </div>
            <span class="badge ${badgeClass}">${label}</span>
          </div>

          <div style="margin-bottom:12px; background:#f8fafc; padding:8px; border-radius:8px;">
            <small style="display:block; color:var(--text-muted);">Bukti Dukung:</small>
            <span style="color:var(--primary); font-weight:500;">${a.photo_name || "Tidak Ada"} (contoh)</span>
          </div>

          <div style="margin-bottom:12px;">
            <label style="margin-top:0;">Catatan Guru</label>
            <input type="text" id="note_${a.id}" value="${a.note || ""}" placeholder="Feedback...">
          </div>

          <div class="actions">
            <button class="success" data-action="present" data-id="${a.id}">Terima</button>
            <button class="danger" data-action="absent" data-id="${a.id}">Tolak</button>
          </div>
        </div>`;
    })
    .join("");

  listEl.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => updateStatus(btn.dataset.id, btn.dataset.action, btn));
  });
}

function updateStatus(id, status, btn) {
  const noteInput = document.getElementById(`note_${id}`);
  const note = noteInput ? noteInput.value : "";

  btn.disabled = true;
  btn.innerText = "...";

  DemoStore.updateAttendanceStatus(id, status, note);
  loadList();
}

function exportExcel() {
  if (!cachedData.length) {
    alert("Kosong!");
    return;
  }
  const ws = XLSX.utils.json_to_sheet(
    cachedData.map(r => ({
      Nama: r.profile.full_name || "Siswa",
      Kelas: r.profile.class || "-",
      Status: r.status,
      Tanggal: r.created_at
    }))
  );
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Laporan");
  XLSX.writeFile(wb, "RecisCam-demo.xlsx");
}

document.addEventListener("DOMContentLoaded", () => {
  const profile = requireRole("teacher");
  if (!profile) return;

  loadList();

  document.getElementById("dayFilter").addEventListener("change", loadList);
  document.getElementById("exportBtn").addEventListener("click", exportExcel);
  document.getElementById("logoutBtn").addEventListener("click", logoutAndRedirect);
});
