/**
 * PROJECT BARANG TEMUAN — CARI BARANG HILANG JAVASCRIPT
 * Fungsionalitas tab pencarian, dropdown filter, dan eksekusi pencarian data riil
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const btnCatFound = document.getElementById('btnCatFound');
  const btnCatLost = document.getElementById('btnCatLost');
  const searchNameInput = document.getElementById('searchNameInput');

  const categorySelectBtn = document.getElementById('categorySelectBtn');
  const categoryText = document.getElementById('categoryText');
  const selectedCategory = document.getElementById('selectedCategory');
  const categoryModal = document.getElementById('categoryModal');
  const categoryCloseBtn = document.getElementById('categoryCloseBtn');
  const categoryItems = document.querySelectorAll('#categoryList .sheet-item');

  const locationSelectBtn = document.getElementById('locationSelectBtn');
  const locationText = document.getElementById('locationText');
  const selectedLocation = document.getElementById('selectedLocation');
  const locationModal = document.getElementById('locationModal');
  const locationCloseBtn = document.getElementById('locationCloseBtn');
  const locationSearchInput = document.getElementById('locationSearchInput');
  const locationItems = document.querySelectorAll('#locationList .sheet-item');

  const btnSearch = document.getElementById('btnSearch');
  const btnViewAll = document.getElementById('btnViewAll');
  const resultsSection = document.getElementById('resultsSection');
  const resultsTitle = document.getElementById('resultsTitle');
  const resultsCount = document.getElementById('resultsCount');
  const resultsList = document.getElementById('resultsList');

  // State
  let activeType = 'Ditemukan'; // Default aktif: Barang Ditemukan

  /* ========================================================
   * 1. PILIHAN KATEGORI PENCARIAN (BARANG DITEMUKAN / HILANG)
   * ======================================================== */
  function setActiveType(type) {
    activeType = type;
    if (type === 'Ditemukan') {
      btnCatFound.classList.add('active');
      btnCatFound.setAttribute('aria-selected', 'true');
      btnCatLost.classList.remove('active');
      btnCatLost.setAttribute('aria-selected', 'false');
      searchNameInput.placeholder = 'Contoh : Jam Tangan';
    } else {
      btnCatLost.classList.add('active');
      btnCatLost.setAttribute('aria-selected', 'true');
      btnCatFound.classList.remove('active');
      btnCatFound.setAttribute('aria-selected', 'false');
      searchNameInput.placeholder = 'Contoh : Motor SupraX';
    }

    // Jika hasil pencarian sedang terbuka, jalankan pencarian ulang untuk tab baru
    if (resultsSection.style.display !== 'none') {
      performSearch();
    }
  }

  btnCatFound.addEventListener('click', () => setActiveType('Ditemukan'));
  btnCatLost.addEventListener('click', () => setActiveType('Hilang'));

  /* ========================================================
   * 2. DROPDOWN KATEGORI
   * ======================================================== */
  categorySelectBtn.addEventListener('click', () => {
    categoryModal.classList.add('active');
  });

  categoryCloseBtn.addEventListener('click', () => {
    categoryModal.classList.remove('active');
  });

  categoryModal.addEventListener('click', (e) => {
    if (e.target === categoryModal) categoryModal.classList.remove('active');
  });

  categoryItems.forEach(item => {
    item.addEventListener('click', () => {
      const val = item.getAttribute('data-value') || '';
      selectedCategory.value = val;
      if (val) {
        categoryText.textContent = item.textContent.trim();
        categoryText.classList.add('has-value');
      } else {
        categoryText.textContent = 'Kategori';
        categoryText.classList.remove('has-value');
      }
      categoryItems.forEach(el => el.classList.remove('is-selected'));
      item.classList.add('is-selected');
      categoryModal.classList.remove('active');
    });
  });

  /* ========================================================
   * 3. DROPDOWN LOKASI
   * ======================================================== */
  locationSelectBtn.addEventListener('click', () => {
    locationModal.classList.add('active');
    locationSearchInput.value = '';
    filterLocations('');
    setTimeout(() => locationSearchInput.focus(), 100);
  });

  locationCloseBtn.addEventListener('click', () => {
    locationModal.classList.remove('active');
  });

  locationModal.addEventListener('click', (e) => {
    if (e.target === locationModal) locationModal.classList.remove('active');
  });

  locationSearchInput.addEventListener('input', (e) => {
    filterLocations(e.target.value.toLowerCase());
  });

  function filterLocations(query) {
    locationItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'flex' : 'none';
    });
  }

  locationItems.forEach(item => {
    item.addEventListener('click', () => {
      const val = item.getAttribute('data-value') || '';
      selectedLocation.value = val;
      if (val) {
        locationText.textContent = item.textContent.trim();
        locationText.classList.add('has-value');
      } else {
        locationText.textContent = 'Pilih Lokasi';
        locationText.classList.remove('has-value');
      }
      locationItems.forEach(el => el.classList.remove('is-selected'));
      item.classList.add('is-selected');
      locationModal.classList.remove('active');
    });
  });

  /* ========================================================
   * 4. PENGUMPULAN DATA LAPORAN NYATA DARI SISTEM
   * ======================================================== */
  function getAllReports(type) {
    let reports = [];

    // Data dasar aplikasi Barang Temuan (homepage baseline)
    const baselineItems = [
      {
        id: 'LT-JAM-01',
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
        nama: 'Iphone 18 Pro 1 Tb',
        lokasi: 'Kamtout UMS',
        tanggal: '16 Nov 2026',
        foto: 'assets/item-iphone.png',
        tipe: 'Hilang',
        kategori: 'Elektronik',
        deskripsi: 'iPhone 18 Pro 1 Tb warna maroon dengan dus lengkap, tertinggal di area kampus.'
      }
    ];

    // Ambil data laporan tersimpan dari localStorage
    if (type === 'Ditemukan') {
      try {
        const stored = localStorage.getItem('barangtemuan_laporan_temuan');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) reports.push(...parsed);
        }
      } catch (e) {
        console.error(e);
      }
      // Tambahkan baseline temuan
      baselineItems.filter(i => i.tipe === 'Ditemukan').forEach(item => {
        if (!reports.some(r => r.id === item.id)) reports.push(item);
      });
    } else {
      try {
        const stored = localStorage.getItem('barangtemuan_laporan_hilang');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) reports.push(...parsed);
        }
      } catch (e) {
        console.error(e);
      }
      // Tambahkan baseline hilang
      baselineItems.filter(i => i.tipe === 'Hilang').forEach(item => {
        if (!reports.some(r => r.id === item.id)) reports.push(item);
      });
    }

    return reports;
  }

  /* ========================================================
   * 5. EKSEKUSI PENCARIAN & FILTERING DATA
   * ======================================================== */
  function performSearch(showAll = false) {
    const rawName = showAll ? '' : searchNameInput.value.trim().toLowerCase();
    const catVal = showAll ? '' : selectedCategory.value.trim().toLowerCase();
    const locVal = showAll ? '' : selectedLocation.value.trim().toLowerCase();

    const allData = getAllReports(activeType);

    const matches = allData.filter(item => {
      // Filter Nama / Deskripsi
      if (rawName) {
        const nameMatch = (item.nama || '').toLowerCase().includes(rawName);
        const descMatch = (item.deskripsi || '').toLowerCase().includes(rawName);
        if (!nameMatch && !descMatch) return false;
      }

      // Filter Kategori (jika ada atribut kategori)
      if (catVal) {
        const itemCat = (item.kategori || '').toLowerCase();
        const itemName = (item.nama || '').toLowerCase();
        if (!itemCat.includes(catVal) && !itemName.includes(catVal)) return false;
      }

      // Filter Lokasi
      if (locVal) {
        const itemLoc = (item.lokasi || '').toLowerCase();
        if (!itemLoc.includes(locVal)) return false;
      }

      return true;
    });

    renderResults(matches, showAll);
  }

  function renderResults(items, isAll) {
    resultsSection.style.display = 'flex';
    resultsTitle.textContent = isAll 
      ? `Seluruh Laporan ${activeType}` 
      : `Hasil Pencarian (${activeType})`;
    resultsCount.textContent = `${items.length} laporan ditemukan`;
    resultsList.innerHTML = '';

    if (items.length === 0) {
      resultsList.innerHTML = `
        <div class="empty-results">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <div class="empty-title">Tidak ada laporan yang cocok</div>
          <div class="empty-desc">Coba gunakan kata kunci nama barang yang lebih umum atau pilih "Semua Lokasi".</div>
        </div>
      `;
    } else {
      items.forEach(item => {
        const isTemuan = (item.tipe === 'Ditemukan');
        const badgeClass = isTemuan ? 'badge-ditemukan' : 'badge-hilang';
        const photoSrc = item.foto || (isTemuan ? 'assets/icon-box-check.png' : 'assets/icon-sad-backpack.png');

        const card = document.createElement('a');
        card.href = 'detail-laporan.html?id=' + encodeURIComponent(item.id);
        card.className = 'result-card';
        card.innerHTML = `
          <div class="result-photo-wrap">
            <img src="${photoSrc}" alt="${item.nama}" class="result-photo">
          </div>
          <div class="result-info">
            <span class="result-badge ${badgeClass}">${item.tipe || activeType}</span>
            <div class="result-name">${item.nama || 'Tanpa Nama'}</div>
            <div class="result-meta">
              <span class="result-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${item.lokasi || '-'}
              </span>
              <span class="result-meta-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                </svg>
                ${item.tanggal || '-'}
              </span>
            </div>
          </div>
          <svg class="result-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        `;
        resultsList.appendChild(card);
      });
    }

    // Scroll halus menuju section hasil pencarian
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ========================================================
   * 6. LISTENERS TOMBOL CARI & LIHAT SEMUA
   * ======================================================== */
  btnSearch.addEventListener('click', () => {
    const rawName = searchNameInput.value.trim();
    const catVal = selectedCategory.value.trim();
    const locVal = selectedLocation.value.trim();

    const params = new URLSearchParams();
    if (rawName) params.set('q', rawName);
    params.set('type', activeType);
    if (catVal) params.set('cat', catVal);
    if (locVal) params.set('loc', locVal);

    // Buka Halaman Hasil Pencocokan sesuai alur sistem
    window.location.href = 'hasil-pencocokan.html?' + params.toString();
  });

  searchNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      btnSearch.click();
    }
  });

  btnViewAll.addEventListener('click', () => {
    performSearch(true);
  });
});
