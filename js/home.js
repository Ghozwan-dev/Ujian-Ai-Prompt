/**
 * PROJECT BARANG TEMUAN — HOMEPAGE JAVASCRIPT
 * Fungsionalitas interaktif:
 * 1. Bottom Navigation & Header Notification
 * 2. Inisialisasi & sinkronisasi data laporan barang (Terbaru & Terpercaya)
 * 3. Navigasi kartu barang ke detail-laporan.html?id=...
 * 4. Carousel geser horizontal (mobile touch & desktop mouse drag) tanpa konflik klik
 * 5. Indikator titik (dots) sinkron & dapat diklik untuk berpindah kartu
 * 6. Tombol "Lihat Semua" ke cari-barang.html
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. INISIALISASI DATA LAPORAN DASAR (LOCALSTORAGE)
  // ==========================================
  const baselineHilang = [
    {
      id: 'LH-SUPRA-01',
      nama: 'Motor SupraX',
      kategori: 'Kendaraan',
      lokasi: 'Mts Gaccan Solo',
      tanggal: '01 Des 2026',
      deskripsi: 'Motor Honda Supra X 125 warna hitam strip ungu, kondisi mulus, spion kanan ada stiker, plat nomor Solo.',
      foto: 'assets/item-supra.png',
      tipe: 'Hilang',
      nomorLaporan: '#3918274-02',
      pelapor: 'Budi Santoso',
      createdAt: '2026-12-01T08:00:00.000Z'
    },
    {
      id: 'LH-IPHONE-01',
      nama: 'Iphone 18 Pro 1 Tb',
      kategori: 'Elektronik',
      lokasi: 'Kamtout UMS',
      tanggal: '16 Nov 2026',
      deskripsi: 'iPhone 18 Pro 1 Tb warna maroon dengan dus lengkap, tertinggal di area kampus.',
      foto: 'assets/item-iphone.png',
      tipe: 'Hilang',
      nomorLaporan: '#4867284-01',
      pelapor: 'Rina Amelia',
      telepon: '0823-8743-3645',
      createdAt: '2026-11-16T14:30:00.000Z'
    }
  ];

  const baselineTemuan = [
    {
      id: 'LT-JAM-01',
      nama: 'Jam Tangan',
      kategori: 'Aksesoris',
      lokasi: 'Pom Bensin Waru',
      tanggal: '28 Nov 2026',
      deskripsi: 'Jam tangan Fossil tali kulit warna coklat, dial hitam angka romawi, kondisi mulus.',
      foto: 'assets/item-jam.png',
      tipe: 'Ditemukan',
      nomorLaporan: '#4867284-01',
      pelapor: 'Rina Amelia',
      telepon: '0823-8743-3645',
      createdAt: '2026-11-28T10:15:00.000Z'
    }
  ];

  // Simpan baseline ke localStorage jika belum ada, atau pastikan item-item ini terdaftar
  function seedBaselineData() {
    try {
      let hilangList = [];
      const storedHilang = localStorage.getItem('barangtemuan_laporan_hilang');
      if (storedHilang) {
        try { hilangList = JSON.parse(storedHilang) || []; } catch(e) { hilangList = []; }
      }
      baselineHilang.forEach(baseItem => {
        if (!hilangList.some(item => item.id === baseItem.id)) {
          hilangList.push(baseItem);
        }
      });
      localStorage.setItem('barangtemuan_laporan_hilang', JSON.stringify(hilangList));

      let temuanList = [];
      const storedTemuan = localStorage.getItem('barangtemuan_laporan_temuan');
      if (storedTemuan) {
        try { temuanList = JSON.parse(storedTemuan) || []; } catch(e) { temuanList = []; }
      }
      baselineTemuan.forEach(baseItem => {
        if (!temuanList.some(item => item.id === baseItem.id)) {
          temuanList.push(baseItem);
        }
      });
      localStorage.setItem('barangtemuan_laporan_temuan', JSON.stringify(temuanList));
    } catch(err) {
      console.warn('Gagal sinkronisasi data baseline localStorage:', err);
    }
  }
  seedBaselineData();

  // ==========================================
  // 2. TOMBOL "LIHAT SEMUA"
  // ==========================================
  const seeAllBtn = document.querySelector('.see-all-link');
  if (seeAllBtn) {
    seeAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'cari-barang.html';
    });
  }

  // ==========================================
  // 3. CAROUSEL TERBARU & TERPERCAYA (DESKTOP DRAG & MOBILE SWIPE)
  // ==========================================
  const slider = document.querySelector('.items-slider');
  const cards = document.querySelectorAll('.items-slider .item-card');
  const dots = document.querySelectorAll('.pagination-dots .dot');

  let isPointerDown = false;
  let startPointerX = 0;
  let startScrollLeft = 0;
  let hasDragged = false;
  const DRAG_THRESHOLD = 6; // px threshold untuk membedakan klik vs drag

  if (slider) {
    // Hindari drag default browser pada gambar
    slider.querySelectorAll('img').forEach(img => {
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Mouse Drag untuk Desktop
    slider.addEventListener('mousedown', (e) => {
      isPointerDown = true;
      hasDragged = false;
      startPointerX = e.pageX;
      startScrollLeft = slider.scrollLeft;
      slider.classList.add('grabbing');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isPointerDown) return;
      const currentX = e.pageX;
      const walk = currentX - startPointerX;
      if (Math.abs(walk) > DRAG_THRESHOLD) {
        hasDragged = true;
      }
      if (hasDragged) {
        e.preventDefault();
        slider.scrollLeft = startScrollLeft - walk;
      }
    });

    window.addEventListener('mouseup', () => {
      if (!isPointerDown) return;
      isPointerDown = false;
      slider.classList.remove('grabbing');
      // Berikan jeda sesaat agar event click kartu mengenali status hasDragged
      setTimeout(() => {
        hasDragged = false;
      }, 50);
    });

    // Touch Swipe untuk Mobile
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        hasDragged = false;
      }
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const touchCurrentX = e.touches[0].clientX;
        if (Math.abs(touchCurrentX - touchStartX) > DRAG_THRESHOLD) {
          hasDragged = true;
        }
      }
    }, { passive: true });

    slider.addEventListener('touchend', () => {
      setTimeout(() => {
        hasDragged = false;
      }, 50);
    }, { passive: true });

    // ==========================================
    // 4. SINKRONISASI INDIKATOR TITIK (PAGINATION DOTS)
    // ==========================================
    function updateActiveDot() {
      if (!dots.length || !cards.length) return;
      const sliderCenter = slider.scrollLeft + (slider.clientWidth / 2);
      let closestIdx = 0;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
        const distance = Math.abs(sliderCenter - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === closestIdx) {
          dot.classList.add('active');
          dot.setAttribute('aria-selected', 'true');
        } else {
          dot.classList.remove('active');
          dot.setAttribute('aria-selected', 'false');
        }
      });
    }

    slider.addEventListener('scroll', updateActiveDot, { passive: true });
    window.addEventListener('resize', updateActiveDot);

    // Klik pada titik pagination untuk scroll ke kartu yang bersangkutan
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        if (cards[idx]) {
          const targetCard = cards[idx];
          const targetLeft = targetCard.offsetLeft - (slider.clientWidth - targetCard.offsetWidth) / 2;
          slider.scrollTo({
            left: Math.max(0, targetLeft),
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ==========================================
  // 5. KLIK KARTU BARANG (DETAIL NAVIGATION)
  // ==========================================
  cards.forEach(card => {
    function navigateToDetail() {
      const id = card.getAttribute('data-id');
      const tipe = card.getAttribute('data-tipe');
      if (!id) return;
      let targetUrl = `detail-laporan.html?id=${encodeURIComponent(id)}`;
      if (tipe) {
        targetUrl += `&tipe=${encodeURIComponent(tipe)}`;
      }
      window.location.href = targetUrl;
    }

    // Klik mouse/tap
    card.addEventListener('click', (e) => {
      if (hasDragged) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      navigateToDetail();
    });

    // Keyboard Accessibility (Enter / Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateToDetail();
      }
    });
  });

  // ==========================================
  // 6. BOTTOM NAVIGATION TAB SWITCHING
  // ==========================================
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const href = item.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        return;
      }
      e.preventDefault();
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ==========================================
  // 7. FEEDBACK TOMBOL NOTIFIKASI
  // ==========================================
  const notifBtn = document.querySelector('.btn-notification');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      console.info('[Barang Temuan] Notifikasi dibuka.');
    });
  }

  // ==========================================
  // 8. CEK USER LOGIN DI LOCALSTORAGE
  // ==========================================
  const currentUserData = localStorage.getItem('barangtemuan_current_user');
  if (currentUserData) {
    try {
      const user = JSON.parse(currentUserData);
      if (user && user.name) {
        const sayaTab = document.querySelector('.nav-item:last-child');
        if (sayaTab) {
          const label = sayaTab.querySelector('span');
          if (label) {
            label.textContent = user.name.split(' ')[0]; // Nama depan
            label.style.fontWeight = '700';
          }
          sayaTab.setAttribute('title', `Akun: ${user.name}`);
        }
      }
    } catch (e) {}
  }
});
