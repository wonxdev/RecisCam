/**
 * student.js — student dashboard
 * Shows piket schedule, lets the student "upload" attendance proof,
 * and lists past attendance history. All data is local/demo only.
 */

const DAY_INDEX = { Minggu: 0, Senin: 1, Selasa: 2, Rabu: 3, Kamis: 4, Jumat: 5, Sabtu: 6 };
const WEEKS_OF_HISTORY = 5;

let profile = null;
let selectedFile = null;

function statusLabel(status) {
  switch (status) {
    case "approved":
    case "present":
      return { badgeClass: "badge-success", label: "Hadir" };
    case "rejected":
    case "absent":
      return { badgeClass: "badge-danger", label: "Ditolak" };
    case "pending":
      return { badgeClass: "badge-warning", label: "Menunggu" };
    case "upcoming":
      return { badgeClass: "badge-warning", label: "Jadwal Hari Ini" };
    default:
      return { badgeClass: "badge-danger", label: "Terlewat" };
  }
}

function buildScheduleRows() {
  const targetDay = DAY_INDEX[profile.piket_day];
  if (targetDay === undefined) return { rows: [], warnings: 0 };

  const history = DemoStore.listAttendanceForUser(profile.id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows = [];
  let warnings = 0;

  for (let week = 0; week < WEEKS_OF_HISTORY; week++) {
    const d = new Date();
    d.setDate(d.getDate() - week * 7);
    d.setDate(d.getDate() + (targetDay - d.getDay()));
    d.setHours(0, 0, 0, 0);

    if (d > today) continue;

    const match = history.find(h => {
      const hDate = new Date(h.created_at);
      return (
        hDate.getDate() === d.getDate() &&
        hDate.getMonth() === d.getMonth() &&
        hDate.getFullYear() === d.getFullYear()
      );
    });

    let status = match ? match.status : d.getTime() === today.getTime() ? "upcoming" : "missed";
    if (["missed", "absent", "rejected"].includes(status)) warnings++;

    rows.push({ date: d, status, match });
  }

  return { rows, warnings };
}

function renderSchedule() {
  const { rows, warnings } = buildScheduleRows();

  const warningEl = document.getElementById("warningCount");
  warningEl.textContent = `${warnings}/3`;
  warningEl.classList.toggle("is-danger", warnings >= 3);

  const html = rows
    .map(item => {
      const dateStr = item.date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      const { badgeClass, label } = statusLabel(item.status);
      const note = item.match && item.match.note
        ? `<span class="list-row-note">Catatan Guru: ${item.match.note}</span>`
        : "";

      return `
        <div class="list-row">
          <div>
            <div class="list-row-title">${dateStr}</div>
            ${note}
          </div>
          <span class="badge ${badgeClass}">${label}</span>
        </div>`;
    })
    .join("");

  document.getElementById("scheduleList").innerHTML =
    html || `<div class="empty-state">Belum ada jadwal.</div>`;
}

function renderNotifications() {
  const unread = DemoStore.listUnreadNotifications(profile.id);

  unread.forEach(n => {
    showToast(n.message, "info", {
      sticky: true,
      onClose: () => DemoStore.dismissNotification(n.id)
    });
  });
}

function previewFile() {
  const input = document.getElementById("photo");
  selectedFile = input.files[0];
  if (!selectedFile) return;

  document.getElementById("preview").hidden = false;
  document.getElementById("filename").textContent = selectedFile.name;

  const img = document.getElementById("previewImg");
  img.hidden = false;
  img.src = URL.createObjectURL(selectedFile);
}

function resetUploadForm() {
  selectedFile = null;
  document.getElementById("photo").value = "";
  document.getElementById("preview").hidden = true;
  document.getElementById("previewImg").hidden = true;
}

function submitAttendance() {
  if (!selectedFile) {
    showToast("Pilih foto terlebih dahulu.", "danger");
    return;
  }

  const btn = document.getElementById("submitBtn");
  btn.textContent = "Mengirim…";
  btn.disabled = true;

  DemoStore.submitAttendance(profile.id, selectedFile.name);

  setTimeout(() => {
    showToast("Laporan piket berhasil dikirim (data demo).", "success");
    resetUploadForm();
    renderSchedule();
    btn.textContent = "Kirim Bukti";
    btn.disabled = false;
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  profile = requireRole("student");
  if (!profile) return;

  document.getElementById("userName").textContent = profile.full_name || profile.email.split("@")[0];
  document.getElementById("userClass").textContent = profile.class || "Kelas Tidak Ada";
  document.getElementById("piketDay").textContent = profile.piket_day || "-";

  renderSchedule();
  renderNotifications();

  document.getElementById("photo").addEventListener("change", previewFile);
  document.getElementById("submitBtn").addEventListener("click", submitAttendance);
  document.getElementById("logoutBtn").addEventListener("click", logoutAndRedirect);
});
