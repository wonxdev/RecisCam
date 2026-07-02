(function () {
  const STORAGE_KEYS = {
    users: 'reciscam_users',
    session: 'reciscam_session',
    attendance: 'reciscam_attendance',
    notifications: 'reciscam_notifications'
  };

  function readStorage(key, fallback = []) {
    try {
      const value = localStorage.getItem(key);
      if (!value) return fallback;
      return JSON.parse(value);
    } catch (error) {
      console.warn('Unable to read storage', error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function currentPagePath() {
    return window.location.pathname;
  }

  function resolvePath(targetPath) {
    return currentPagePath().includes('/pages/') ? `../${targetPath}` : targetPath;
  }

  function seedDemoData() {
    const existingUsers = readStorage(STORAGE_KEYS.users, []);
    if (existingUsers.length > 0) return;

    const demoPhoto = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220"><rect width="320" height="220" fill="#dcfce7"/><circle cx="160" cy="95" r="54" fill="#4ade80"/><rect x="74" y="154" width="172" height="42" rx="20" fill="#22c55e"/></svg>');

    const teacherId = 'teacher-demo';
    const studentId = 'student-demo';

    const users = [
      {
        id: teacherId,
        email: 'guru@reciscam.test',
        password: 'guru123',
        profile: {
          role: 'teacher',
          full_name: 'Bapak Arif',
          class: '',
          piket_day: ''
        }
      },
      {
        id: studentId,
        email: 'siswa@reciscam.test',
        password: 'siswa123',
        profile: {
          role: 'student',
          full_name: 'Alya Putri',
          class: 'XII A',
          piket_day: 'Senin'
        }
      }
    ];

    const attendance = [
      {
        id: 'att-1',
        user_id: studentId,
        photo_url: demoPhoto,
        status: 'approved',
        note: 'Foto jelas dan tepat waktu.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
      },
      {
        id: 'att-2',
        user_id: studentId,
        photo_url: demoPhoto,
        status: 'pending',
        note: '',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        id: 'att-3',
        user_id: studentId,
        photo_url: demoPhoto,
        status: 'rejected',
        note: 'Foto kurang fokus.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString()
      }
    ];

    const notifications = [
      {
        id: 'notif-1',
        user_id: studentId,
        message: 'Laporan piket Anda sedang menunggu verifikasi guru.',
        is_read: false,
        created_at: new Date().toISOString()
      }
    ];

    writeStorage(STORAGE_KEYS.users, users);
    writeStorage(STORAGE_KEYS.attendance, attendance);
    writeStorage(STORAGE_KEYS.notifications, notifications);
  }

  function getUsers() {
    seedDemoData();
    return readStorage(STORAGE_KEYS.users, []);
  }

  function getProfiles() {
    return getUsers().map((user) => user.profile);
  }

  function getCurrentSession() {
    return readStorage(STORAGE_KEYS.session, null);
  }

  function setCurrentSession(session) {
    writeStorage(STORAGE_KEYS.session, session);
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.session);
  }

  function login(email, password) {
    const users = getUsers();
    const match = users.find((user) => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password);

    if (!match) {
      throw new Error('Email atau kata sandi salah.');
    }

    const session = {
      id: match.id,
      email: match.email,
      role: match.profile.role,
      profile: match.profile
    };

    setCurrentSession(session);
    return session;
  }

  function registerStudent({ email, password, className, piketDay }) {
    const users = getUsers();
    const exists = users.some((user) => user.email.toLowerCase() === email.trim().toLowerCase());

    if (exists) {
      throw new Error('Email ini sudah terdaftar.');
    }

    const newUser = {
      id: `student-${Date.now()}`,
      email: email.trim(),
      password,
      profile: {
        role: 'student',
        full_name: email.split('@')[0],
        class: className,
        piket_day: piketDay
      }
    };

    users.push(newUser);
    writeStorage(STORAGE_KEYS.users, users);
    return newUser;
  }

  function logout() {
    clearSession();
    window.location.replace(resolvePath('index.html'));
  }

  function getAttendance() {
    seedDemoData();
    return readStorage(STORAGE_KEYS.attendance, []);
  }

  function saveAttendance(data) {
    writeStorage(STORAGE_KEYS.attendance, data);
  }

  function getNotifications(userId) {
    seedDemoData();
    return readStorage(STORAGE_KEYS.notifications, []).filter((item) => item.user_id === userId && !item.is_read);
  }

  function saveNotifications(data) {
    writeStorage(STORAGE_KEYS.notifications, data);
  }

  function createNotification(userId, message) {
    const notifications = readStorage(STORAGE_KEYS.notifications, []);
    notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: userId,
      message,
      is_read: false,
      created_at: new Date().toISOString()
    });
    saveNotifications(notifications);
  }

  function markNotificationRead(id) {
    const notifications = readStorage(STORAGE_KEYS.notifications, []);
    const next = notifications.map((item) => (item.id === id ? { ...item, is_read: true } : item));
    saveNotifications(next);
  }

  function createAttendanceEntry(userId, photoUrl) {
    const attendance = getAttendance();
    attendance.unshift({
      id: `att-${Date.now()}`,
      user_id: userId,
      photo_url: photoUrl,
      status: 'pending',
      note: '',
      created_at: new Date().toISOString()
    });
    saveAttendance(attendance);
    return attendance[0];
  }

  function updateAttendanceStatus(id, status, note) {
    const attendance = getAttendance();
    const next = attendance.map((item) => (item.id === id ? { ...item, status, note } : item));
    saveAttendance(next);
    return next.find((item) => item.id === id);
  }

  function buildWarningCount(records, profile) {
    if (!profile?.piket_day) return '0/3';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const relevant = records.filter((item) => {
      const entryDate = new Date(item.created_at);
      return entryDate <= today;
    });
    const missed = relevant.filter((item) => ['missed', 'absent', 'rejected', 'pending'].includes((item.status || '').toLowerCase())).length;
    return `${Math.min(missed, 3)}/3`;
  }

  function exportAttendanceCsv(records) {
    const rows = records.map((row) => ({
      Nama: row.profile?.full_name || 'Siswa',
      Kelas: row.profile?.class || '-',
      Hari: row.profile?.piket_day || '-',
      Status: row.status || 'pending',
      Catatan: row.note || '',
      Tanggal: new Date(row.created_at).toLocaleString('id-ID')
    }));

    const headers = ['Nama', 'Kelas', 'Hari', 'Status', 'Catatan', 'Tanggal'];
    const csv = [headers.join(','), ...rows.map((row) => headers.map((header) => `"${String(row[header]).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'RecisCam-Laporan.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Gagal membaca file.'));
      reader.readAsDataURL(file);
    });
  }

  function initializeLoginPage() {
    const session = getCurrentSession();
    if (session?.role === 'student') {
      window.location.replace(resolvePath('pages/student.html'));
      return;
    }

    if (session?.role === 'teacher') {
      window.location.replace(resolvePath('pages/teacher.html'));
      return;
    }

    const button = document.getElementById('loginBtn');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!button || !emailInput || !passwordInput) return;

    button.addEventListener('click', async () => {
      try {
        button.disabled = true;
        button.innerText = 'Masuk...';
        const sessionData = login(emailInput.value, passwordInput.value);
        window.location.replace(resolvePath(sessionData.role === 'teacher' ? 'pages/teacher.html' : 'pages/student.html'));
      } catch (error) {
        alert(error.message);
        button.disabled = false;
        button.innerText = 'Masuk';
      }
    });
  }

  function initializeRegisterPage() {
    const button = document.querySelector('button[onclick="register()"]');
    if (!button) return;

    window.register = function register() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const kelas = document.getElementById('kelas').value;
      const piketDay = document.getElementById('piketDay').value;

      if (!email || !password || !kelas || !piketDay) {
        alert('Semua kolom wajib diisi!');
        return;
      }

      button.disabled = true;
      button.innerText = 'Memproses...';

      try {
        registerStudent({
          email,
          password,
          className: kelas,
          piketDay
        });
        alert('Pendaftaran berhasil! Silakan masuk.');
        window.location.href = resolvePath('index.html');
      } catch (error) {
        alert('Gagal daftar: ' + error.message);
        button.disabled = false;
        button.innerText = 'Daftar Sekarang';
      }
    };
  }

  function initializeStudentPage() {
    const session = getCurrentSession();
    if (!session) {
      window.location.replace(resolvePath('index.html'));
      return;
    }

    const studentProfile = session.profile;
    document.getElementById('userName').innerText = studentProfile.full_name.split(' ')[0] || studentProfile.full_name;
    document.getElementById('userClass').innerText = studentProfile.class || 'Kelas Tidak Ada';
    document.getElementById('piketDay').innerText = studentProfile.piket_day || '-';

    const attendance = getAttendance().filter((item) => item.user_id === session.id);
    const warningCount = buildWarningCount(attendance, studentProfile);
    document.getElementById('warningCount').innerText = warningCount;

    const listEl = document.getElementById('scheduleList');
    const html = attendance.slice(0, 5).map((item) => {
      const date = new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const statusLabel = item.status === 'approved' ? 'Hadir' : item.status === 'rejected' ? 'Ditolak' : item.status === 'pending' ? 'Menunggu' : 'Terlewat';
      const badgeClass = item.status === 'approved' ? 'approved' : item.status === 'rejected' ? 'rejected' : item.status === 'pending' ? 'pending' : 'missed';
      return `
        <div class="card" style="padding:16px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:600;">${date}</div>
            ${item.note ? `<small style="color:var(--danger-text)">Output Guru: ${item.note}</small>` : ''}
          </div>
          <span class="badge ${badgeClass}">${statusLabel}</span>
        </div>`;
    }).join('');

    listEl.innerHTML = html || '<p style="text-align:center;">Belum ada laporan piket.</p>';

    const notifications = getNotifications(session.id);
    const toastContainer = document.getElementById('toast-container');
    notifications.forEach((item) => {
      const div = document.createElement('div');
      div.className = 'notification-toast';
      div.innerHTML = `<span>${item.message}</span><button class="close-toast" data-id="${item.id}" type="button">×</button>`;
      toastContainer.appendChild(div);
    });

    toastContainer.addEventListener('click', (event) => {
      const target = event.target;
      if (target.classList.contains('close-toast')) {
        const id = target.getAttribute('data-id');
        markNotificationRead(id);
        target.parentElement.remove();
      }
    });

    window.previewFile = function previewFile() {
      const file = document.getElementById('photo').files[0];
      if (!file) return;
      const preview = document.getElementById('preview');
      const filename = document.getElementById('filename');
      const previewImg = document.getElementById('previewImg');
      filename.innerText = file.name;
      preview.style.display = 'block';
      previewImg.style.display = 'block';
      previewImg.src = URL.createObjectURL(file);
    };

    window.submit = async function submit() {
      const fileInput = document.getElementById('photo');
      if (!fileInput.files[0]) {
        alert('Pilih foto terlebih dahulu!');
        return;
      }

      const button = document.querySelector('button[onclick="submit()"]');
      button.innerText = 'Mengirim...';
      button.disabled = true;

      try {
        const photoUrl = await readFileAsDataUrl(fileInput.files[0]);
        createAttendanceEntry(session.id, photoUrl);
        alert('✅ Laporan piket berhasil dikirim!');
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert('❌ Gagal mengirim: ' + error.message);
        button.innerText = 'Kirim Bukti';
        button.disabled = false;
      }
    };

    window.logout = function logout() {
      clearSession();
      window.location.replace(resolvePath('index.html'));
    };
  }

  function initializeTeacherPage() {
    const session = getCurrentSession();
    if (!session || session.role !== 'teacher') {
      window.location.replace(resolvePath('index.html'));
      return;
    }

    const listEl = document.getElementById('list');

    window.load = function load() {
      const dayFilter = document.getElementById('dayFilter').value || 'all';
      const merged = getAttendance().map((item) => {
        const profile = getUsers().find((user) => user.id === item.user_id)?.profile || {};
        return { ...item, profile };
      });

      const filtered = dayFilter === 'all'
        ? merged
        : merged.filter((item) => item.profile?.piket_day === dayFilter);

      render(filtered);
    };

    function render(data) {
      if (!data || data.length === 0) {
        listEl.innerHTML = '<div style="text-align:center; margin-top:40px;">Tidak ada data laporan piket.</div>';
        return;
      }

      const html = data.map((item) => {
        const date = new Date(item.created_at);
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const badgeClass = item.status === 'approved' ? 'approved' : item.status === 'rejected' ? 'rejected' : 'pending';
        const badgeText = item.status === 'approved' ? 'Hadir' : item.status === 'rejected' ? 'Ditolak' : 'Menunggu';
        const name = item.profile?.full_name || 'Siswa';
        const className = item.profile?.class || 'Kelas Tidak Ada';
        const piket = item.profile?.piket_day || '-';

        return `
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
              <div>
                <div style="font-weight:700; font-size:1.1rem;">${name} (${className})</div>
                <small style="color:var(--text-muted);">${piket} • ${dateStr} ${timeStr}</small>
              </div>
              <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <div style="margin-bottom:12px; background:#f8fafc; padding:8px; border-radius:8px;">
              <small style="display:block; color:var(--text-muted);">Bukti Dukung:</small>
              ${item.photo_url ? `<img src="${item.photo_url}" alt="Bukti piket" style="width:100%; border-radius:8px; margin-top:8px;">` : '<span>Tidak Ada</span>'}
            </div>
            <div style="margin-bottom:12px;">
              <label style="margin-top:0;">Catatan Guru</label>
              <input type="text" id="note_${item.id}" value="${item.note || ''}" placeholder="Feedback...">
            </div>
            <div class="actions">
              <button class="success" type="button" onclick="updateStatus('${item.id}', 'approved', this)">Terima</button>
              <button class="danger" type="button" onclick="updateStatus('${item.id}', 'rejected', this)">Tolak</button>
            </div>
          </div>`;
      }).join('');

      listEl.innerHTML = html;
    }

    window.updateStatus = function updateStatus(id, status, button) {
      const noteInput = document.getElementById(`note_${id}`);
      const note = noteInput ? noteInput.value : '';
      const originalText = button.innerText;
      button.innerText = '...';
      button.disabled = true;

      try {
        const updated = updateAttendanceStatus(id, status, note);
        const profile = getUsers().find((user) => user.id === updated.user_id)?.profile;
        if (profile?.role === 'student') {
          createNotification(updated.user_id, status === 'approved' ? 'Laporan piket disetujui.' : `Laporan piket ditolak${note ? ': ' + note : ''}`);
        }
        window.load();
      } catch (error) {
        alert('Gagal update: ' + error.message);
        button.innerText = originalText;
        button.disabled = false;
      }
    };

    window.exportExcel = function exportExcel() {
      const dayFilter = document.getElementById('dayFilter').value || 'all';
      const merged = getAttendance().map((item) => {
        const profile = getUsers().find((user) => user.id === item.user_id)?.profile || {};
        return { ...item, profile };
      });
      const filtered = dayFilter === 'all' ? merged : merged.filter((item) => item.profile?.piket_day === dayFilter);
      if (!filtered.length) return alert('Kosong!');
      exportAttendanceCsv(filtered);
    };

    window.logout = function logout() {
      clearSession();
      window.location.replace(resolvePath('index.html'));
    };

    window.load();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;
    if (pathname.endsWith('/index.html') || pathname === '/' || pathname.endsWith('/RecisCam/')) {
      initializeLoginPage();
    } else if (pathname.endsWith('/register.html')) {
      initializeRegisterPage();
    } else if (pathname.endsWith('/student.html')) {
      initializeStudentPage();
    } else if (pathname.endsWith('/teacher.html')) {
      initializeTeacherPage();
    }
  });

  window.RecisCamApp = {
    login,
    registerStudent,
    logout,
    getCurrentSession,
    getAttendance,
    createAttendanceEntry,
    updateAttendanceStatus,
    createNotification,
    markNotificationRead,
    exportAttendanceCsv,
    resolvePath
  };
})();
