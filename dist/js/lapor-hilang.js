/**
 * PROJECT BARANG TEMUAN — LAPORKAN BARANG HILANG JAVASCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const reportForm = document.getElementById('reportForm');
  const fileInput = document.getElementById('photoInput');
  const uploadArea = document.getElementById('uploadArea');
  const uploadWrapper = document.getElementById('uploadWrapper');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const uploadPreview = document.getElementById('uploadPreview');
  const previewImg = document.getElementById('previewImg');
  const btnRemovePhoto = document.getElementById('btnRemovePhoto');
  const uploadError = document.getElementById('uploadError');

  // Input elements
  const itemNameInput = document.getElementById('itemNameInput');
  const itemDescInput = document.getElementById('itemDescInput');
  const locationSelectBtn = document.getElementById('locationSelectBtn');
  const locationInput = document.getElementById('locationInput');
  const locationText = document.getElementById('locationText');
  const dateSelectBtn = document.getElementById('dateSelectBtn');
  const dateInput = document.getElementById('dateInput');
  const dateText = document.getElementById('dateText');
  const submitBtn = document.getElementById('submitBtn');

  // Groups and errors
  const nameGroup = document.getElementById('nameGroup');
  const descGroup = document.getElementById('descGroup');
  const locationGroup = document.getElementById('locationGroup');
  const dateGroup = document.getElementById('dateGroup');

  const nameError = document.getElementById('nameError');
  const descError = document.getElementById('descError');
  const locationError = document.getElementById('locationError');
  const dateError = document.getElementById('dateError');

  // Location Modal elements
  const locationModal = document.getElementById('locationModal');
  const locationCloseBtn = document.getElementById('locationCloseBtn');
  const locationSearch = document.getElementById('locationSearch');
  const locationItems = document.querySelectorAll('.location-item');

  // Date Modal elements
  const dateModal = document.getElementById('dateModal');
  const dateCloseBtn = document.getElementById('dateCloseBtn');
  const btnQuickDates = document.querySelectorAll('.btn-quick-date');
  const modalDatePicker = document.getElementById('modalDatePicker');
  const btnApplyCustomDate = document.getElementById('btnApplyCustomDate');

  // Success Modal elements
  const successModal = document.getElementById('successModal');
  const btnSuccessDone = document.getElementById('btnSuccessDone');

  let currentPhotoData = null;

  /* ========================================================
   * 1. UPLOAD FOTO (JPG, PNG) & PREVIEW
   * ======================================================== */
  uploadArea.addEventListener('click', (e) => {
    if (e.target === btnRemovePhoto || btnRemovePhoto.contains(e.target)) {
      return;
    }
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
  });

  // Drag and Drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    handleFile(file);
  });

  function handleFile(file) {
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      showError(uploadWrapper, uploadError, 'Format file harus JPG atau PNG.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showError(uploadWrapper, uploadError, 'Ukuran foto maksimal 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      currentPhotoData = event.target.result;
      previewImg.src = currentPhotoData;
      uploadPreview.classList.add('active');
      uploadPlaceholder.style.display = 'none';
      clearError(uploadWrapper);
    };
    reader.readAsDataURL(file);
  }

  btnRemovePhoto.addEventListener('click', (e) => {
    e.stopPropagation();
    currentPhotoData = null;
    fileInput.value = '';
    previewImg.src = '';
    uploadPreview.classList.remove('active');
    uploadPlaceholder.style.display = 'flex';
  });

  /* ========================================================
   * 2. LOKASI SELECTION (MODAL / CUSTOM INPUT)
   * ======================================================== */
  locationSelectBtn.addEventListener('click', () => {
    locationModal.classList.add('active');
    locationSearch.value = '';
    filterLocations('');
    setTimeout(() => locationSearch.focus(), 100);
  });

  locationCloseBtn.addEventListener('click', () => {
    locationModal.classList.remove('active');
  });

  locationModal.addEventListener('click', (e) => {
    if (e.target === locationModal) {
      locationModal.classList.remove('active');
    }
  });

  locationItems.forEach(item => {
    item.addEventListener('click', () => {
      const loc = item.getAttribute('data-location') || item.textContent.trim();
      selectLocation(loc);
    });
  });

  locationSearch.addEventListener('input', (e) => {
    filterLocations(e.target.value);
  });

  locationSearch.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = locationSearch.value.trim();
      if (val) {
        selectLocation(val);
      }
    }
  });

  function filterLocations(query) {
    const q = query.toLowerCase();
    locationItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? 'flex' : 'none';
    });
  }

  function selectLocation(val) {
    locationInput.value = val;
    locationText.textContent = val;
    locationText.classList.add('has-value');
    clearError(locationGroup);
    locationModal.classList.remove('active');
  }

  /* ========================================================
   * 3. TANGGAL SELECTION (BOTTOM SHEET & KALENDER INTERAKTIF)
   * ======================================================== */
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
  ];

  dateSelectBtn.addEventListener('click', () => {
    dateModal.classList.add('active');
  });

  dateCloseBtn.addEventListener('click', () => {
    dateModal.classList.remove('active');
  });

  dateModal.addEventListener('click', (e) => {
    if (e.target === dateModal) {
      dateModal.classList.remove('active');
    }
  });

  // Tombol Pilihan Tanggal Cepat
  btnQuickDates.forEach(btn => {
    btn.addEventListener('click', () => {
      const offset = parseInt(btn.getAttribute('data-offset'), 10) || 0;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - offset);

      const day = String(targetDate.getDate()).padStart(2, '0');
      const monthIdx = targetDate.getMonth();
      const year = targetDate.getFullYear();

      const formatted = `${day} ${monthNames[monthIdx]} ${year}`;
      const iso = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${day}`;

      selectDate(formatted, iso);
    });
  });

  // Pemilih Tanggal Kalender Manual
  btnApplyCustomDate.addEventListener('click', () => {
    applyCustomDate();
  });

  modalDatePicker.addEventListener('change', () => {
    applyCustomDate();
  });

  function applyCustomDate() {
    const val = modalDatePicker.value; // YYYY-MM-DD
    if (!val) return;
    const parts = val.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIdx = parseInt(parts[1], 10) - 1;
      const day = parts[2];
      const formatted = `${day} ${monthNames[monthIdx] || parts[1]} ${year}`;
      selectDate(formatted, val);
    }
  }

  function selectDate(formatted, isoVal) {
    dateInput.value = isoVal || formatted;
    dateText.textContent = formatted;
    dateText.classList.add('has-value');
    clearError(dateGroup);
    dateModal.classList.remove('active');
  }

  /* ========================================================
   * 4. REAL-TIME CLEAR ERRORS
   * ======================================================== */
  function showError(group, errorEl, message) {
    if (!group) return;
    group.classList.add('has-error');
    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  function clearError(group) {
    if (!group) return;
    group.classList.remove('has-error');
  }

  itemNameInput.addEventListener('input', () => {
    if (nameGroup.classList.contains('has-error')) {
      clearError(nameGroup);
    }
  });

  itemDescInput.addEventListener('input', () => {
    if (descGroup.classList.contains('has-error')) {
      clearError(descGroup);
    }
  });

  /* ========================================================
   * 5. FORM SUBMISSION & VALIDASI LENGKAP
   * ======================================================== */
  reportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasError = false;
    let firstErrorEl = null;

    // A. Validasi Foto
    if (!currentPhotoData) {
      showError(uploadWrapper, uploadError, 'Silakan unggah foto barang yang hilang.');
      hasError = true;
      firstErrorEl = firstErrorEl || uploadArea;
    } else {
      clearError(uploadWrapper);
    }

    // B. Validasi Nama Barang
    const nameVal = itemNameInput.value.trim();
    if (!nameVal) {
      showError(nameGroup, nameError, 'Nama barang wajib diisi.');
      hasError = true;
      firstErrorEl = firstErrorEl || itemNameInput;
    } else {
      clearError(nameGroup);
    }

    // C. Validasi Deskripsi
    const descVal = itemDescInput.value.trim();
    if (!descVal) {
      showError(descGroup, descError, 'Deskripsi ciri-ciri barang wajib diisi.');
      hasError = true;
      firstErrorEl = firstErrorEl || itemDescInput;
    } else {
      clearError(descGroup);
    }

    // D. Validasi Lokasi
    const locVal = locationInput.value.trim();
    if (!locVal) {
      showError(locationGroup, locationError, 'Silakan pilih lokasi terakhir terlihat.');
      hasError = true;
      firstErrorEl = firstErrorEl || locationSelectBtn;
    } else {
      clearError(locationGroup);
    }

    // E. Validasi Tanggal
    const dateVal = dateInput.value.trim();
    if (!dateVal) {
      showError(dateGroup, dateError, 'Silakan pilih tanggal kehilangan.');
      hasError = true;
      firstErrorEl = firstErrorEl || dateSelectBtn;
    } else {
      clearError(dateGroup);
    }

    if (hasError) {
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (firstErrorEl.focus) firstErrorEl.focus();
      }
      return;
    }

    // Simpan ke LocalStorage
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      let currentUserId = null;
      let currentUserEmail = null;
      let pelaporName = 'Pengguna';
      try {
        const u = localStorage.getItem('barangtemuan_current_user');
        if (u) {
          const parsed = JSON.parse(u);
          if (parsed) {
            currentUserId = parsed.id || null;
            currentUserEmail = parsed.email || null;
            if (parsed.name) pelaporName = parsed.name;
          }
        }
      } catch (e) {}

      const newReport = {
        id: 'LH-' + Date.now(),
        nama: nameVal,
        deskripsi: descVal,
        lokasi: locVal,
        tanggal: dateText.textContent,
        rawTanggal: dateVal,
        foto: currentPhotoData,
        tipe: 'Hilang',
        status: 'Menunggu',
        userId: currentUserId,
        userEmail: currentUserEmail,
        pelapor: pelaporName,
        isUserReport: true,
        createdAt: new Date().toISOString()
      };

      let reports = [];
      try {
        const stored = localStorage.getItem('barangtemuan_laporan_hilang');
        if (stored) reports = JSON.parse(stored);
        if (!Array.isArray(reports)) reports = [];
      } catch (err) {
        reports = [];
      }

      reports.unshift(newReport);
      localStorage.setItem('barangtemuan_laporan_hilang', JSON.stringify(reports));
      localStorage.setItem('barangtemuan_latest_report', JSON.stringify(newReport));

      // Tambahkan notifikasi laporan baru ke sistem notifikasi
      try {
        const storedNotifs = localStorage.getItem('barangtemuan_notifications');
        let notifs = storedNotifs ? JSON.parse(storedNotifs) : [];
        if (!Array.isArray(notifs)) notifs = [];
        notifs.unshift({
          id: 'notif_' + Date.now(),
          category: 'laporan',
          subType: 'submitted',
          title: 'Laporan Berhasil Dikirim',
          description: `Laporan kehilangan ${newReport.nama} (${newReport.nomorLaporan}) berhasil dikirim ke sistem.`,
          time: 'Baru saja',
          timestamp: Date.now(),
          isRead: false,
          targetUrl: 'detail-laporan.html?id=' + encodeURIComponent(newReport.id)
        });
        localStorage.setItem('barangtemuan_notifications', JSON.stringify(notifs));
      } catch(e) {}

      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;

      // Alihkan ke Halaman Laporan Berhasil sesuai alur sistem
      window.location.href = 'laporan-berhasil.html?id=' + encodeURIComponent(newReport.id);
    }, 500);
  });

  if (btnSuccessDone) {
    btnSuccessDone.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
});
