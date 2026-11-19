/**
 * PROJECT BARANG TEMUAN — HASIL PENCOCOKAN JAVASCRIPT
 * Menghubungkan data hasil pencarian riil dengan kartu profil pencocokan dan detail laporan
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id');
  const query = (urlParams.get('q') || '').toLowerCase().trim();
  const typeFilter = urlParams.get('type') || '';
  const locFilter = (urlParams.get('loc') || '').toLowerCase().trim();
  const catFilter = (urlParams.get('cat') || '').toLowerCase().trim();

  const userName = document.getElementById('userName');
  const reportNumber = document.getElementById('reportNumber');
  const reportDate = document.getElementById('reportDate');
  const btnViewDetail = document.getElementById('btnViewDetail');
  const matchContainer = document.getElementById('matchContainer');

  // Baseline data aplikasi Barang Temuan
  const baselineReports = [
    {
      id: 'LT-JAM-01',
      nomorLaporan: '#4867284-01',
      pelapor: 'Rina Amelia',
      nama: 'Jam Tangan',
      lokasi: 'Pom Bensin Waru',
      tanggal: '20 Nov 2026',
      foto: 'assets/item-jam.png',
      tipe: 'Ditemukan',
      kategori: 'Aksesoris',
      deskripsi: 'Jam tangan Fossil tali kulit warna coklat, dial hitam angka romawi, kondisi mulus.'
    },
    {
      id: 'LH-SUPRA-01',
      nomorLaporan: '#3918274-02',
      pelapor: 'Budi Santoso',
      nama: 'Motor SupraX',
      lokasi: 'Mts Gaccan Solo',
      tanggal: '01 Des 2026',
      foto: 'assets/item-supra.png',
      tipe: 'Hilang',
      kategori: 'Kendaraan',
      deskripsi: 'Motor Honda Supra X 125 warna hitam strip ungu, kondisi mulus, spion kanan ada stiker, plat nomor Solo.'
    },
    {
      id: 'LH-IPHONE-01',
      nomorLaporan: '#2918394-03',
      pelapor: 'Ahmad Fauzi',
      nama: 'Iphone 18 Pro 1 Tb',
      lokasi: 'Kamtout UMS',
      tanggal: '16 Nov 2026',
      foto: 'assets/item-iphone.png',
      tipe: 'Hilang',
      kategori: 'Elektronik',
      deskripsi: 'iPhone 18 Pro 1 Tb warna maroon dengan dus lengkap, tertinggal di area kampus.'
    }
  ];

  // Kumpulkan seluruh data dari localStorage
  let allReports = [...baselineReports];

  try {
    const storedTemuan = localStorage.getItem('barangtemuan_laporan_temuan');
    if (storedTemuan) {
      const parsed = JSON.parse(storedTemuan);
      if (Array.isArray(parsed)) allReports.unshift(...parsed);
    }
  } catch(e) {}

  try {
    const storedHilang = localStorage.getItem('barangtemuan_laporan_hilang');
    if (storedHilang) {
      const parsed = JSON.parse(storedHilang);
      if (Array.isArray(parsed)) allReports.unshift(...parsed);
    }
  } catch(e) {}

  let matchedItems = [];

  // 1. Pencarian berdasarkan targetId eksplisit
  if (targetId) {
    const direct = allReports.find(r => r.id === targetId);
    if (direct) matchedItems.push(direct);
  }

  // 2. Pencarian berdasarkan parameter filter
  if (matchedItems.length === 0 && (query || typeFilter || locFilter || catFilter)) {
    matchedItems = allReports.filter(item => {
      if (typeFilter && item.tipe !== typeFilter) return false;

      if (query) {
        const nameMatch = (item.nama || '').toLowerCase().includes(query);
        const descMatch = (item.deskripsi || '').toLowerCase().includes(query);
        if (!nameMatch && !descMatch) return false;
      }

      if (locFilter && !(item.lokasi || '').toLowerCase().includes(locFilter)) {
        return false;
      }

      if (catFilter && !(item.kategori || '').toLowerCase().includes(catFilter)) {
        return false;
      }

      return true;
    });
  }

  // 3. Fallback ke laporan terbaru atau baseline screenshot default
  if (matchedItems.length === 0) {
    try {
      const latest = localStorage.getItem('barangtemuan_latest_report');
      if (latest) {
        const parsed = JSON.parse(latest);
        if (parsed && parsed.id) matchedItems.push(parsed);
      }
    } catch(e) {}
  }

  if (matchedItems.length === 0) {
    // Default baseline Rina Amelia sesuai screenshot referensi
    matchedItems.push(baselineReports[0]);
  }

  // Render hasil utama
  const primaryMatch = matchedItems[0];
  renderPrimaryCard(primaryMatch);

  // Jika ada lebih dari satu hasil, tampilkan kartu tambahan sesuai spesifikasi
  if (matchedItems.length > 1) {
    // Sisipkan kartu-kartu tambahan sebelum tombol Lihat Detail
    for (let i = 1; i < matchedItems.length; i++) {
      const extraCard = createCardElement(matchedItems[i]);
      matchContainer.insertBefore(extraCard, btnViewDetail);
    }
  }

  function renderPrimaryCard(item) {
    userName.textContent = getPelaporName(item);
    reportNumber.textContent = getNomorLaporan(item);
    reportDate.textContent = item.tanggal || '20 Nov 2026';
    btnViewDetail.href = 'detail-temuan.html?id=' + encodeURIComponent(item.id || 'LT-JAM-01');
  }

  function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.style.cursor = 'pointer';
    card.onclick = () => {
      window.location.href = 'detail-temuan.html?id=' + encodeURIComponent(item.id);
    };

    card.innerHTML = `
      <div class="profile-avatar-wrap">
        <svg class="profile-avatar-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
        </svg>
      </div>
      <div class="profile-info">
        <div class="profile-name">${getPelaporName(item)}</div>
        <div class="report-number">${getNomorLaporan(item)}</div>
        <div class="report-date">${item.tanggal || '-'}</div>
      </div>
    `;
    return card;
  }

  function getPelaporName(item) {
    if (item.pelapor) return item.pelapor;
    if (item.namaPelapor) return item.namaPelapor;
    // Jika laporan temuan/hilang milik user saat ini
    try {
      const curr = localStorage.getItem('barangtemuan_current_user');
      if (curr) {
        const u = JSON.parse(curr);
        if (u && u.nama) return u.nama;
      }
    } catch(e) {}
    // Default nama pelapor
    return item.tipe === 'Ditemukan' ? 'Rina Amelia' : 'Budi Santoso';
  }

  function getNomorLaporan(item) {
    if (item.nomorLaporan) return item.nomorLaporan;
    if (item.id) {
      if (item.id.startsWith('#')) return item.id;
      // Format nomor laporan seperti #4867284-01
      const clean = item.id.replace(/[^0-9]/g, '');
      const numPart = clean.slice(-7) || '4867284';
      return '#' + numPart + '-01';
    }
    return '#4867284-01';
  }
});
