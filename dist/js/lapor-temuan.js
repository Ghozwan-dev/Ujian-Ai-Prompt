/**
 * PROJECT BARANG TEMUAN — LAPORKAN BARANG TEMUAN JAVASCRIPT
 * Validasi form, interaksi upload, modal lokasi & tanggal, dan penyimpanan data
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const reportForm = document.getElementById('reportForm');
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('photoInput');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const uploadPreview = document.getElementById('uploadPreview');
  const previewImg = document.getElementById('previewImg');
  const btnRemovePhoto = document.getElementById('btnRemovePhoto');
  const uploadWrapper = document.getElementById('uploadWrapper');
  const uploadError = document.getElementById('uploadError');

  const itemNameInput = document.getElementById('itemNameInput');
  const nameGroup = document.getElementById('nameGroup');
  const nameError = document.getElementById('nameError');

  const locationSelectBtn = document.getElementById('locationSelectBtn');
  const locationInput = document.getElementById('locationInput');
  const locationText = document.getElementById('locationText');
  const locationGroup = document.getElementById('locationGroup');
  const locationError = document.getElementById('locationError');
  const locationModal = document.getElementById('locationModal');
  const locationCloseBtn = document.getElementById('locationCloseBtn');
  const locationSearch = document.getElementById('locationSearch');
  const locationItems = document.querySelectorAll('.location-item');

  const dateSelectBtn = document.getElementById('dateSelectBtn');
  const dateInput = document.getElementById('dateInput');
  const dateText = document.getElementById('dateText');
  const dateGroup = document.getElementById('dateGroup');
  const dateError = document.getElementById('dateError');
  const dateModal = document.getElementById('dateModal');
  const dateCloseBtn = document.getElementById('dateCloseBtn');
  const modalDatePicker = document.getElementById('modalDatePicker');
  const btnApplyCustomDate = document.getElementById('btnApplyCustomDate');
  const quickDateButtons = document.querySelectorAll('.btn-quick-date');

  const itemDescInput = document.getElementById('itemDescInput');
  const descGroup = document.getElementById('descGroup');
  const descError = document.getElementById('descError');

  const submitBtn = document.getElementById('submitBtn');

  let currentPhotoData = null;

  /* ========================================================
   * 1. UPLOAD FOTO (JPG / PNG, DRAG & DROP, PREVIEW)
   * ======================================================== */
  uploadArea.addEventListener('click', (e) => {
    if (e.target !== btnRemovePhoto && !btnRemovePhoto.contains(e.target)) {
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    handleFile(file);
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
    });
  });

  uploadArea.addEventListener('drop', (e) => {
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
   * 2. LOKASI DITEMUKAN (BOTTOM SHEET / SELECTION)
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
    filterLocations(e.target.value.toLowerCase());
  });

  locationSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = locationSearch.value.trim();
      if (val) {
        selectLocation(val);
      }
    }
  });

  function filterLocations(query) {
    locationItems.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? 'flex' : 'none';
    });
  }

  function selectLocation(name) {
    locationInput.value = name;
    locationText.textContent = name;
    locationText.classList.add('has-value');
    clearError(locationGroup);
    locationModal.classList.remove('active');
  }

  /* ========================================================
   * 3. TANGGAL DITEMUKAN (BOTTOM SHEET / QUICK & PICKER)
   * ======================================================== */
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

  quickDateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const offset = parseInt(btn.getAttribute('data-offset'), 10) || 0;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - offset);
      applySelectedDate(targetDate);
    });
  });

  btnApplyCustomDate.addEventListener('click', () => {
    if (!modalDatePicker.value) {
      modalDatePicker.focus();
      return;
    }
    const parts = modalDatePicker.value.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      applySelectedDate(d);
    }
  });

  function applySelectedDate(d) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const formatted = `${day} ${month} ${year}`;
    const isoVal = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}-${day}`;

    dateInput.value = isoVal;
    dateText.textContent = formatted;
    dateText.classList.add('has-value');
    clearError(dateGroup);
    dateModal.classList.remove('active');
  }

  /* ========================================================
   * 4. REAL-TIME INPUT VALIDATION HELPERS
   * ======================================================== */
  itemNameInput.addEventListener('input', () => {
    if (itemNameInput.value.trim()) clearError(nameGroup);
  });

  itemDescInput.addEventListener('input', () => {
    if (itemDescInput.value.trim()) clearError(descGroup);
  });

  function showError(groupEl, errorEl, message) {
    if (groupEl) groupEl.classList.add('has-error');
    if (errorEl) {
      if (message) errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  function clearError(groupEl) {
    if (groupEl) {
      groupEl.classList.remove('has-error');
      const err = groupEl.querySelector('.error-message');
      if (err) err.style.display = 'none';
    }
  }

  /* ========================================================
   * 5. SUBMIT FORM & SIMPAN LAPORAN BARANG TEMUAN
   * ======================================================== */
  reportForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasError = false;
    let firstErrorEl = null;

    // A. Validasi Upload Foto
    if (!currentPhotoData) {
      showError(uploadWrapper, uploadError, 'Silakan unggah foto barang temuan.');
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

    // C. Validasi Lokasi Ditemukan
    const locVal = locationInput.value.trim();
    if (!locVal) {
      showError(locationGroup, locationError, 'Silakan pilih lokasi ditemukan.');
      hasError = true;
      firstErrorEl = firstErrorEl || locationSelectBtn;
    } else {
      clearError(locationGroup);
    }

    // D. Validasi Tanggal Ditemukan
    const dateVal = dateInput.value.trim();
    if (!dateVal) {
      showError(dateGroup, dateError, 'Silakan pilih tanggal ditemukan.');
      hasError = true;
      firstErrorEl = firstErrorEl || dateSelectBtn;
    } else {
      clearError(dateGroup);
    }

    // E. Validasi Deskripsi
    const descVal = itemDescInput.value.trim();
    if (!descVal) {
      showError(descGroup, descError, 'Deskripsi ciri-ciri barang wajib diisi.');
      hasError = true;
      firstErrorEl = firstErrorEl || itemDescInput;
    } else {
      clearError(descGroup);
    }

    if (hasError) {
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (firstErrorEl.focus) firstErrorEl.focus();
      }
      return;
    }

    // Simpan ke LocalStorage khusus barang temuan
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      const newReport = {
        id: 'LT-' + Date.now(),
        nama: nameVal,
        deskripsi: descVal,
        lokasi: locVal,
        tanggal: dateText.textContent,
        rawTanggal: dateVal,
        foto: currentPhotoData,
        tipe: 'Ditemukan',
        createdAt: new Date().toISOString()
      };

      let reports = [];
      try {
        const stored = localStorage.getItem('barangtemuan_laporan_temuan');
        if (stored) reports = JSON.parse(stored);
        if (!Array.isArray(reports)) reports = [];
      } catch (err) {
        reports = [];
      }

      reports.unshift(newReport);
      localStorage.setItem('barangtemuan_laporan_temuan', JSON.stringify(reports));
      localStorage.setItem('barangtemuan_latest_report', JSON.stringify(newReport));

      submitBtn.classList.remove('is-loading');
      submitBtn.disabled = false;

      // Alihkan ke Halaman Laporan Berhasil Temuan sesuai alur sistem
      window.location.href = 'laporan-berhasil-temuan.html?id=' + encodeURIComponent(newReport.id);
    }, 500);
  });
});
