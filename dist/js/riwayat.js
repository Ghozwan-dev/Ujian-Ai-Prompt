/**
 * PROJECT BARANG TEMUAN — HALAMAN RIWAYAT JAVASCRIPT
 * Fungsionalitas:
 * 1. Pemuatan data laporan riil dari database (localStorage) milik pengguna login
 * 2. Pemfilteran kategori horizontal (Semua, Barang Hilang, Barang Ditemukan)
 * 3. Indikator status dinamis (Menunggu, Diproses, Ditemukan, Sudah Dihubungi, Selesai)
 * 4. Navigasi interaktif ke detail laporan dengan routing kembali ke Riwayat
 * 5. Tampilan Empty State jika belum ada riwayat
 * 6. Sinkronisasi otomatis saat status laporan diperbarui
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const historyList = document.getElementById('historyList');
  const emptyState = document.getElementById('emptyState');
  const summaryInfoBar = document.getElementById('summaryInfoBar');
  const summaryText = document.getElementById('summaryText');
  const btnRefresh = document.getElementById('btnRefresh');
  const filterTabs = document.querySelectorAll('.filter-tab');

  const countAll = document.getElementById('countAll');
  const countHilang = document.getElementById('countHilang');
  const countDitemukan = document.getElementById('countDitemukan');

  const headerUserBadge = document.getElementById('headerUserBadge');
  const userInitial = document.getElementById('userInitial');

  let currentFilter = 'all'; // 'all', 'hilang', 'ditemukan'
  let allReports = [];

  // ==========================================
  // 1. CEK USER LOGIN DI LOCALSTORAGE
  // ==========================================
  let currentUser = null;
  const userData = localStorage.getItem('barangtemuan_current_user');
  if (userData) {
    try {
      currentUser = JSON.parse(userData);
      if (currentUser && currentUser.name) {
        if (headerUserBadge && userInitial) {
          headerUserBadge.style.display = 'flex';
          userInitial.textContent = currentUser.name.charAt(0).toUpperCase();
        }
        // Update tab Profile pada bottom nav
        const profileTab = document.querySelector('.nav-item:last-child');
        if (profileTab) {
          profileTab.setAttribute('href', 'profile.html');
          profileTab.setAttribute('title', `Profile: ${currentUser.name}`);
          const label = profileTab.querySelector('span');
          if (label) {
            label.textContent = 'Profile';
          }
        }
      }
    } catch (e) {
      currentUser = null;
    }
  }

  // ==========================================
  // 2. PEMUATAN DATA LAPORAN DARI DATABASE (LOCALSTORAGE)
  // ==========================================
  function getRawReportsFromStorage() {
    let reports = [];

    // Laporan Barang Hilang
    try {
      const storedHilang = localStorage.getItem('barangtemuan_laporan_hilang');
      if (storedHilang) {
        const parsed = JSON.parse(storedHilang);
        if (Array.isArray(parsed)) {
          parsed.forEach(item => {
            reports.push({
              ...item,
              tipe: item.tipe || 'Hilang'
            });
          });
        }
      }
    } catch (e) {
      console.warn('Gagal membaca barangtemuan_laporan_hilang', e);
    }

    // Laporan Barang Temuan
    try {
      const storedTemuan = localStorage.getItem('barangtemuan_laporan_temuan');
      if (storedTemuan) {
        const parsed = JSON.parse(storedTemuan);
        if (Array.isArray(parsed)) {
          parsed.forEach(item => {
            reports.push({
              ...item,
              tipe: item.tipe || 'Ditemukan'
            });
          });
        }
      }
    } catch (e) {
      console.warn('Gagal membaca barangtemuan_laporan_temuan', e);
    }

    return reports;
  }

  // Menentukan status aktual laporan secara dinamis (Requirement 4 & 9)
  function resolveActualStatus(report) {
    // 1. Cek apakah ada status selesai di laporan atau sessionStorage/localStorage
    if (report.status === 'Selesai' || report.status === 'Selesai Dikembalikan') {
      return {
        label: 'Selesai',
        className: 'status-selesai'
      };
    }

    // 2. Cek apakah item ini sudah ditandai dihubungi
    const contactKey = 'barangtemuan_contacted_' + report.id;
    const isContacted = localStorage.getItem(contactKey) === 'true';
    if (isContacted || report.status === 'Sudah Dihubungi') {
      return {
        label: 'Sudah Dihubungi',
        className: 'status-sudah-dihubungi'
      };
    }

    // 3. Cek apakah ada status kecocokan (Ditemukan)
    if (report.status === 'Ditemukan' || report.status === 'Cocok') {
      return {
        label: 'Ditemukan',
        className: 'status-ditemukan'
      };
    }

    // 4. Cek apakah status verifikasi sedang diproses
    if (report.status === 'Diproses' || report.status === 'Verifikasi') {
      return {
        label: 'Diproses',
        className: 'status-diproses'
      };
    }

    // 5. Default: laporan baru dikirim / sedang menunggu
    return {
      label: report.status || 'Menunggu',
      className: 'status-menunggu'
    };
  }

  // Format nomor laporan rapi
  function formatReportNumber(id) {
    if (!id) return '#4867284-01';
    if (id.startsWith('#')) return id;
    if (id.startsWith('LH-') || id.startsWith('LT-')) {
      const parts = id.split('-');
      if (parts.length >= 2 && parts[1].length >= 6) {
        return '#' + parts[0] + '-' + parts[1].slice(-6);
      }
      return '#' + id;
    }
    return '#' + id;
  }

  // Filter laporan milik user yang sedang login
  function loadUserReports() {
    const rawReports = getRawReportsFromStorage();

    // Saring laporan milik user login atau laporan riil yang dibuat pada sesi browser
    allReports = rawReports.filter(report => {
      // Jika ada currentUser:
      if (currentUser) {
        if (report.userId && report.userId === currentUser.id) return true;
        if (report.userEmail && report.userEmail === currentUser.email) return true;
        if (report.pelapor && currentUser.name && report.pelapor.toLowerCase() === currentUser.name.toLowerCase()) return true;
      }
      // Laporan riil yang dibuat melalui form (memiliki isUserReport atau id hasil generate form LH-1.../LT-1...)
      if (report.isUserReport === true) return true;
      if (report.id && /^L[HT]-\d{10,}/.test(report.id)) return true;

      // Jika user belum memiliki laporan baru dan belum login khusus, jangan tampilkan data dummy orang lain
      return false;
    });

    // Urutkan berdasarkan waktu pembuatan terbaru
    allReports.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    // Update Counter Tabs
    const totalCount = allReports.length;
    const hilangCount = allReports.filter(r => r.tipe === 'Hilang').length;
    const temuanCount = allReports.filter(r => r.tipe === 'Ditemukan').length;

    if (countAll) countAll.textContent = totalCount;
    if (countHilang) countHilang.textContent = hilangCount;
    if (countDitemukan) countDitemukan.textContent = temuanCount;

    renderList();
  }

  // ==========================================
  // 3. RENDER KARTU RIWAYAT
  // ==========================================
  function renderList() {
    // Saring berdasarkan filter tab aktif
    let filtered = allReports;
    if (currentFilter === 'hilang') {
      filtered = allReports.filter(r => r.tipe === 'Hilang');
    } else if (currentFilter === 'ditemukan') {
      filtered = allReports.filter(r => r.tipe === 'Ditemukan');
    }

    historyList.innerHTML = '';

    // Jika kosong, tampilkan empty state
    if (filtered.length === 0) {
      historyList.style.display = 'none';
      if (summaryInfoBar) summaryInfoBar.style.display = 'none';
      if (emptyState) emptyState.style.display = 'flex';
      return;
    }

    // Tampilkan list & info bar
    historyList.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';
    if (summaryInfoBar) {
      summaryInfoBar.style.display = 'flex';
      if (summaryText) {
        summaryText.textContent = `${filtered.length} laporan ditemukan`;
      }
    }

    filtered.forEach(report => {
      const statusInfo = resolveActualStatus(report);
      const isHilang = report.tipe === 'Hilang';
      const typeBadgeClass = isHilang ? 'type-hilang' : 'type-ditemukan';
      const typeText = isHilang ? 'Hilang' : 'Ditemukan';
      const reportNum = formatReportNumber(report.id);
      const locationText = report.lokasi || 'Lokasi tidak dicantumkan';
      const dateText = report.tanggal || 'Baru saja';

      // Gambar fallback
      let photoSrc = report.foto;
      if (!photoSrc) {
        photoSrc = isHilang ? 'assets/item-supra.png' : 'assets/item-jam.png';
      }

      const card = document.createElement('article');
      card.className = 'history-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Detail laporan ${report.nama || 'Barang'} - Status ${statusInfo.label}`);
      card.setAttribute('data-id', report.id);
      card.setAttribute('data-tipe', report.tipe);

      card.innerHTML = `
        <div class="card-thumb-wrap">
          <img src="${escapeHtml(photoSrc)}" alt="${escapeHtml(report.nama || 'Barang')}" class="card-thumb-img" onerror="this.src='assets/item-jam.png'">
        </div>
        <div class="card-main">
          <div class="card-top-row">
            <h3 class="card-item-name" title="${escapeHtml(report.nama || 'Barang')}">${escapeHtml(report.nama || 'Barang Laporan')}</h3>
            <span class="status-badge ${statusInfo.className}">${statusInfo.label}</span>
          </div>
          <div class="card-meta-row">
            <span class="type-pill ${typeBadgeClass}">${typeText}</span>
            <span class="report-num">${escapeHtml(reportNum)}</span>
          </div>
          <div class="card-details-row">
            <div class="card-detail-item" title="${escapeHtml(locationText)}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>${escapeHtml(locationText)}</span>
            </div>
            <div class="card-detail-item" title="${escapeHtml(dateText)}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${escapeHtml(dateText)}</span>
            </div>
            <svg class="card-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      `;

      // Interaksi Klik Kartu -> Detail Laporan
      function goToDetail() {
        window.location.href = `detail-laporan.html?id=${encodeURIComponent(report.id)}&from=riwayat`;
      }

      card.addEventListener('click', goToDetail);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToDetail();
        }
      });

      historyList.appendChild(card);
    });
  }

  // ==========================================
  // 4. EVENT FILTER TABS HORIZONTAL
  // ==========================================
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filterVal = tab.getAttribute('data-filter');
      if (filterVal === currentFilter) return;

      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      currentFilter = filterVal;

      renderList();
    });
  });

  // Tombol Refresh Data
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      btnRefresh.style.transform = 'rotate(180deg)';
      loadUserReports();
      setTimeout(() => {
        btnRefresh.style.transform = 'none';
      }, 300);
    });
  }

  // ==========================================
  // 5. AUTO-UPDATE SINKRONISASI
  // ==========================================
  window.addEventListener('pageshow', () => {
    loadUserReports();
  });

  window.addEventListener('storage', () => {
    loadUserReports();
  });

  // Inisialisasi awal
  loadUserReports();

  // Helper aman XSS
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
