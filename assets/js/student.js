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
      return { badgeClass: "approved", label: "Hadir" };
    case "rejected":
    case "absent":
      return { badgeClass: "rejected", label: "Ditolak" };
    case "pending":
      return { badgeClass: "pending", label: "Menunggu" };
    case "upcoming":
      return { badgeClass: "pending", label: "Jadwal Hari Ini" };
    default:
      return { badgeClass: "missed", label: "Terlewat" };
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
  warningEl.innerText = `${warnings}/3`;
  if (warnings >= 3) warningEl.style.color = "#f87171";

  const html = rows
    .map(item => {
      const dateStr = item.date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
      const { badgeClass, label } = statusLabel(item.status);
      const note = item.match && item.match.note
        ? `<small style="color:var(--danger-text)">Catatan Guru: ${item.match.note}</small>`
        : "";

      return `
        <div class="card" style="padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:600;">${dateStr}</div>
            ${note}
          </div>
          <span class="badge ${badgeClass}">${label}</span>
        </div>`;
    })
    .join("");

  document.getElementById("scheduleList").innerHTML = html || "<p style='text-align:center;'>Belum ada jadwal.</p>";
}

function renderNotifications() {
  const unread = DemoStore.listUnreadNotifications(profile.id);
  const container = document.getElementById("toast-container");

  unread.forEach(n => {
    const div = document.createElement("div");
    div.className = "notification-toast";
    div.innerHTML = `<span>${n.message}</span><button class="close-toast">×</button>`;
    div.querySelector(".close-toast").addEventListener("click", () => {
      div.remove();
      DemoStore.dismissNotification(n.id);
    });
    container.appendChild(div);
  });
}

function previewFile() {
  const input = document.getElementById("photo");
  selectedFile = input.files[0];
  if (!selectedFile) return;

  document.getElementById("preview").style.display = "block";
  document.getElementById("filename").innerText = selectedFile.name;

  const img = document.getElementById("previewImg");
  img.style.display = "block";
  img.src = URL.createObjectURL(selectedFile);
}

function submitAttendance() {
  if (!selectedFile) {
    alert("Pilih foto terlebih dahulu!");
    return;
  }

  const btn = document.getElementById("submitBtn");
  btn.innerText = "Mengirim...";
  btn.disabled = true;

  DemoStore.submitAttendance(profile.id, selectedFile.name);

  setTimeout(() => {
    alert("✅ Laporan piket berhasil dikirim! (data demo)");
    location.reload();
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  profile = requireRole("student");
  if (!profile) return;

  document.getElementById("userName").innerText = profile.full_name || profile.email.split("@")[0];
  document.getElementById("userClass").innerText = profile.class || "Kelas Tidak Ada";
  document.getElementById("piketDay").innerText = profile.piket_day || "-";

  renderSchedule();
  renderNotifications();

  document.getElementById("photo").addEventListener("change", previewFile);
  document.getElementById("submitBtn").addEventListener("click", submitAttendance);
  document.getElementById("logoutBtn").addEventListener("click", logoutAndRedirect);
});
