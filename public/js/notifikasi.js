/**
 * PROJECT BARANG TEMUAN — NOTIFIKASI JAVASCRIPT
 * Mengelola riwayat pemberitahuan pengguna, filter real-time, status baca persisten,
 * dan integrasi navigasi ke laporan, pesan, atau profil.
 */

document.addEventListener('DOMContentLoaded', () => {
  const notificationList = document.getElementById('notificationList');
  const emptyState = document.getElementById('emptyState');
  const emptyTitle = document.getElementById('emptyTitle');
  const emptyDesc = document.getElementById('emptyDesc');
  const btnMarkAllRead = document.getElementById('btnMarkAllRead');
  const btnBack = document.getElementById('btnBack');
  const countAll = document.getElementById('countAll');
  const countUnread = document.getElementById('countUnread');
  const notifToast = document.getElementById('notifToast');
  const toastMsg = document.getElementById('toastMsg');
  const filterChips = document.querySelectorAll('.filter-chip');

  let notifications = [];
  let currentFilter = 'all';
  let toastTimer = null;

  // ==========================================
  // 1. DATA DASAR / BASELINE NOTIFIKASI
  // ==========================================
  const baselineNotifications = [
    {
      id: 'notif_match_01',
      category: 'laporan',
      subType: 'match',
      title: 'Ditemukan Kecocokan Barang!',
      description: 'Barang iPhone 18 Pro Anda cocok dengan temuan di Kamtout UMS oleh Rina Amelia.',
      time: '15 mnt lalu',
      timestamp: Date.now() - (15 * 60 * 1000),
      isRead: false,
      targetUrl: 'detail-temuan.html?id=LH-IPHONE-01'
    },
    {
      id: 'notif_msg_01',
      category: 'pesan',
      subType: 'message',
      title: 'Pesan Baru dari Rina Amelia',
      description: '"Apakah barang tersebut masih tersedia? Saya bisa menunjukkan bukti kotak dan nomor seri barang."',
      time: '30 mnt lalu',
      timestamp: Date.now() - (30 * 60 * 1000),
      isRead: false,
      targetUrl: 'chat.html?chatId=chat_rina_amelia_LH-IPHONE-01'
    },
    {
      id: 'notif_verify_01',
      category: 'laporan',
      subType: 'verified',
      title: 'Laporan Sedang Diverifikasi',
      description: 'Laporan temuan Jam Tangan (#4867284-01) di Pom Bensin Waru sedang diverifikasi oleh tim.',
      time: '2 jam lalu',
      timestamp: Date.now() - (2 * 3600 * 1000),
      isRead: false,
      targetUrl: 'detail-laporan.html?id=LT-JAM-01'
    },
    {
      id: 'notif_submit_01',
      category: 'laporan',
      subType: 'submitted',
      title: 'Laporan Berhasil Dikirim',
      description: 'Laporan kehilangan Motor Honda Supra X 125 telah berhasil masuk ke sistem Barang Temuan.',
      time: '5 jam lalu',
      timestamp: Date.now() - (5 * 3600 * 1000),
      isRead: true,
      targetUrl: 'detail-laporan.html?id=LH-SUPRA-01'
    },
    {
      id: 'notif_msg_02',
      category: 'pesan',
      subType: 'message_reply',
      title: 'Ahmad Fauzi Membalas Percakapan',
      description: '"Saya menemukan barang yang Anda laporkan di dekat area kampus."',
      time: '1 hari lalu',
      timestamp: Date.now() - (24 * 3600 * 1000),
      isRead: true,
      targetUrl: 'pesan.html'
    },
    {
      id: 'notif_return_01',
      category: 'laporan',
      subType: 'returned',
      title: 'Barang Berhasil Dikembalikan',
      description: 'Barang temuan telah berhasil diserahkan kepada pemilik yang sah.',
      time: '2 hari lalu',
      timestamp: Date.now() - (48 * 3600 * 1000),
      isRead: true,
      targetUrl: 'pengembalian-berhasil.html'
    },
    {
      id: 'notif_account_01',
      category: 'akun',
      subType: 'account',
      title: 'Informasi Aktivitas Akun',
      description: 'Akun Anda berhasil masuk dan siap digunakan untuk memantau laporan.',
      time: '3 hari lalu',
      timestamp: Date.now() - (72 * 3600 * 1000),
      isRead: true,
      targetUrl: 'profile.html'
    }
  ];

  // ==========================================
  // 2. MUAT DATA DARI LOCALSTORAGE
  // ==========================================
  function loadNotifications() {
    try {
      const stored = localStorage.getItem('barangtemuan_notifications');
      if (stored) {
        notifications = JSON.parse(stored);
        if (!Array.isArray(notifications)) notifications = [];
      } else {
        notifications = [...baselineNotifications];
        saveNotifications();
      }
    } catch (e) {
      notifications = [...baselineNotifications];
    }

    // Urutkan dari notifikasi terbaru ke terlama
    notifications.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    updateBadgeCounts();
    renderNotifications();
  }

  function saveNotifications() {
    try {
      localStorage.setItem('barangtemuan_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Gagal menyimpan barangtemuan_notifications', e);
    }
  }

  function updateBadgeCounts() {
    const totalCount = notifications.length;
    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (countAll) countAll.textContent = totalCount;
    if (countUnread) countUnread.textContent = unreadCount;

    // Update tombol Tandai Semua Dibaca
    if (btnMarkAllRead) {
      if (unreadCount === 0) {
        btnMarkAllRead.style.opacity = '0.5';
        btnMarkAllRead.style.pointerEvents = 'none';
      } else {
        btnMarkAllRead.style.opacity = '1';
        btnMarkAllRead.style.pointerEvents = 'auto';
      }
    }
  }

  // ==========================================
  // 3. RENDER DAFTAR NOTIFIKASI
  // ==========================================
  function renderNotifications() {
    notificationList.innerHTML = '';

    // Filter berdasarkan tab aktif
    const filtered = notifications.filter(item => {
      if (currentFilter === 'unread') return !item.isRead;
      if (currentFilter === 'laporan') return item.category === 'laporan';
      if (currentFilter === 'pesan') return item.category === 'pesan';
      return true; // 'all'
    });

    if (filtered.length === 0) {
      notificationList.style.display = 'none';
      emptyState.style.display = 'flex';

      if (currentFilter === 'unread') {
        emptyTitle.textContent = 'Tidak Ada Notifikasi Baru';
        emptyDesc.textContent = 'Semua pemberitahuan sudah Anda baca.';
      } else if (currentFilter === 'laporan') {
        emptyTitle.textContent = 'Belum Ada Notifikasi Laporan';
        emptyDesc.textContent = 'Pemberitahuan aktivitas laporan akan tampil di sini.';
      } else if (currentFilter === 'pesan') {
        emptyTitle.textContent = 'Belum Ada Notifikasi Pesan';
        emptyDesc.textContent = 'Pemberitahuan pesan dari pengguna lain akan tampil di sini.';
      } else {
        emptyTitle.textContent = 'Belum Ada Notifikasi';
        emptyDesc.textContent = 'Pemberitahuan aktivitas Anda akan muncul di sini.';
      }
      return;
    }

    notificationList.style.display = 'flex';
    emptyState.style.display = 'none';

    filtered.forEach(item => {
      const card = document.createElement('article');
      card.className = 'notification-item' + (!item.isRead ? ' is-unread' : '');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${item.title}. ${item.description}.`);
      card.setAttribute('data-id', item.id);

      // Icon & styling per category & subType
      const iconData = getNotificationIcon(item.category, item.subType);

      const unreadDotHtml = !item.isRead 
        ? `<span class="notif-unread-dot" title="Belum dibaca"></span>` 
        : '';

      const categoryPill = getCategoryPillLabel(item.category);

      card.innerHTML = `
        <div class="notif-icon-wrap ${iconData.bgClass}" aria-hidden="true">
          ${iconData.svg}
        </div>
        <div class="notif-body">
          <div class="notif-top-row">
            <h3 class="notif-title">${escapeHtml(item.title)}</h3>
            <span class="notif-category-pill">${escapeHtml(categoryPill)}</span>
          </div>
          <p class="notif-desc">${escapeHtml(item.description)}</p>
          <span class="notif-time">${escapeHtml(item.time || 'Baru saja')}</span>
        </div>
        ${unreadDotHtml}
      `;

      function handleItemClick() {
        // Tandai notifikasi ini sudah dibaca
        item.isRead = true;
        saveNotifications();
        updateBadgeCounts();

        // Arahkan ke halaman tujuan jika ada
        const destination = item.targetUrl || 'index.html';
        window.location.href = destination;
      }

      card.addEventListener('click', handleItemClick);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleItemClick();
        }
      });

      notificationList.appendChild(card);
    });
  }

  // ==========================================
  // 4. IKON & LABEL NOTIFIKASI
  // ==========================================
  function getNotificationIcon(category, subType) {
    if (subType === 'match') {
      return {
        bgClass: 'icon-amber',
        svg: `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        `
      };
    }
    if (subType === 'verified' || subType === 'returned') {
      return {
        bgClass: 'icon-green',
        svg: `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        `
      };
    }
    if (category === 'pesan' || subType === 'message' || subType === 'message_reply') {
      return {
        bgClass: 'icon-blue',
        svg: `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        `
      };
    }
    if (category === 'akun') {
      return {
        bgClass: 'icon-indigo',
        svg: `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        `
      };
    }
    // Default Laporan / Dokumen
    return {
      bgClass: 'icon-blue',
      svg: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      `
    };
  }

  function getCategoryPillLabel(cat) {
    if (cat === 'laporan') return 'Laporan';
    if (cat === 'pesan') return 'Pesan';
    if (cat === 'akun') return 'Akun';
    return 'Info';
  }

  // ==========================================
  // 5. FILTER CHIPS INTERACTION
  // ==========================================
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-selected', 'true');
      currentFilter = chip.getAttribute('data-filter') || 'all';
      renderNotifications();
    });
  });

  // ==========================================
  // 6. TOMBOL "TANDAI SEMUA DIBACA"
  // ==========================================
  if (btnMarkAllRead) {
    btnMarkAllRead.addEventListener('click', () => {
      const unreadExists = notifications.some(n => !n.isRead);
      if (!unreadExists) return;

      notifications.forEach(n => {
        n.isRead = true;
      });

      saveNotifications();
      updateBadgeCounts();
      renderNotifications();
      showToast('Semua notifikasi ditandai telah dibaca.');
    });
  }

  // ==========================================
  // 7. TOMBOL KEMBALI
  // ==========================================
  if (btnBack) {
    btnBack.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.history.length > 1 && document.referrer && !document.referrer.includes('notifikasi.html')) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }

  // ==========================================
  // 8. TOAST NOTIFIKASI
  // ==========================================
  function showToast(msg) {
    if (!notifToast || !toastMsg) return;
    toastMsg.textContent = msg;
    notifToast.style.display = 'flex';

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      notifToast.style.display = 'none';
    }, 2400);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Auto-refresh saat kembali ke halaman
  window.addEventListener('pageshow', loadNotifications);
  window.addEventListener('storage', loadNotifications);

  // Inisialisasi awal
  loadNotifications();
});
