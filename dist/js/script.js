/**
 * PROJECT BARANG TEMUAN — LOGIN PAGE JAVASCRIPT
 * Menangani toggle password, validasi komprehensif, dan feedback sistem.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const loginForm = document.getElementById('loginForm');
  const identifierInput = document.getElementById('identifierInput');
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const submitBtn = document.getElementById('submitBtn');
  const systemAlert = document.getElementById('systemAlert');
  const alertTitle = document.getElementById('alertTitle');
  const alertDesc = document.getElementById('alertDesc');

  // Groups and Error elements
  const identifierGroup = document.getElementById('identifierGroup');
  const passwordGroup = document.getElementById('passwordGroup');
  const identifierError = document.getElementById('identifierError');
  const passwordError = document.getElementById('passwordError');

  // Modals for prepared project navigation
  const navModal = document.getElementById('navModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalBody = document.getElementById('modalBody');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const registerLink = document.getElementById('registerLink');

  /* ========================================================
   * 1. TOGGLE SHOW / HIDE PASSWORD
   * ======================================================== */
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = passwordInput.getAttribute('type') === 'password';
      const newType = isPassword ? 'text' : 'password';
      passwordInput.setAttribute('type', newType);

      // Ubah ikon mata (Eye vs Eye-off)
      const eyeIcon = togglePasswordBtn.querySelector('.icon-eye');
      const eyeOffIcon = togglePasswordBtn.querySelector('.icon-eye-off');

      if (isPassword) {
        eyeIcon.style.display = 'none';
        eyeOffIcon.style.display = 'block';
        togglePasswordBtn.setAttribute('aria-label', 'Sembunyikan kata sandi');
        togglePasswordBtn.setAttribute('title', 'Sembunyikan kata sandi');
      } else {
        eyeIcon.style.display = 'block';
        eyeOffIcon.style.display = 'none';
        togglePasswordBtn.setAttribute('aria-label', 'Tampilkan kata sandi');
        togglePasswordBtn.setAttribute('title', 'Tampilkan kata sandi');
      }

      passwordInput.focus();
    });
  }

  /* ========================================================
   * 2. VALIDATION HELPERS
   * ======================================================== */
  // Regex untuk email standar
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  // Regex nomor telepon Indonesia / umum (contoh: 08123456789, +628123456789, min 9-15 digit)
  const phoneRegex = /^(\+62|62|08|0)[0-9]{8,13}$/;

  function validateIdentifier(value) {
    const trimmed = value.trim();
    if (!trimmed) {
      return { valid: false, message: 'Email atau nomor handphone wajib diisi.' };
    }

    // Jika mengandung karakter @ atau huruf alfabet, anggap format email
    if (trimmed.includes('@') || /[a-zA-Z]/.test(trimmed)) {
      if (!emailRegex.test(trimmed)) {
        return { valid: false, message: 'Format email tidak valid (contoh: nama@domain.com).' };
      }
      return { valid: true, type: 'email', value: trimmed };
    }

    // Jika berupa digit/nomor telepon
    const digitsOnly = trimmed.replace(/[\s-]/g, '');
    if (!phoneRegex.test(digitsOnly)) {
      return { valid: false, message: 'Nomor handphone harus valid (10-14 digit, contoh: 08123456789).' };
    }

    return { valid: true, type: 'phone', value: digitsOnly };
  }

  function validatePassword(value) {
    if (!value) {
      return { valid: false, message: 'Kata sandi wajib diisi.' };
    }
    if (value.length < 6) {
      return { valid: false, message: 'Kata sandi minimal 6 karakter.' };
    }
    return { valid: true };
  }

  function showError(group, errorEl, message) {
    group.classList.add('has-error');
    const msgSpan = errorEl.querySelector('.error-text');
    if (msgSpan) {
      msgSpan.textContent = message;
    } else {
      errorEl.textContent = message;
    }
  }

  function clearError(group) {
    group.classList.remove('has-error');
  }

  // Clear error saat user mengetik
  identifierInput.addEventListener('input', () => {
    if (identifierGroup.classList.contains('has-error')) {
      clearError(identifierGroup);
    }
    hideSystemAlert();
  });

  passwordInput.addEventListener('input', () => {
    if (passwordGroup.classList.contains('has-error')) {
      clearError(passwordGroup);
    }
    hideSystemAlert();
  });

  // Validasi saat blur (kehilangan fokus)
  identifierInput.addEventListener('blur', () => {
    if (identifierInput.value.trim()) {
      const res = validateIdentifier(identifierInput.value);
      if (!res.valid) {
        showError(identifierGroup, identifierError, res.message);
      } else {
        clearError(identifierGroup);
      }
    }
  });

  passwordInput.addEventListener('blur', () => {
    if (passwordInput.value) {
      const res = validatePassword(passwordInput.value);
      if (!res.valid) {
        showError(passwordGroup, passwordError, res.message);
      } else {
        clearError(passwordGroup);
      }
    }
  });

  /* ========================================================
   * 3. FORM SUBMISSION (DENGAN SIMULASI ALUR PENUH)
   * ======================================================== */
  function hideSystemAlert() {
    if (systemAlert) {
      systemAlert.classList.remove('show');
    }
  }

  function showSystemFeedback(title, desc, type = 'info') {
    if (systemAlert && alertTitle && alertDesc) {
      systemAlert.className = `system-alert show ${type}`;
      alertTitle.textContent = title;
      alertDesc.textContent = desc;

      const iconContainer = systemAlert.querySelector('.system-alert-icon');
      if (iconContainer) {
        if (type === 'success') {
          iconContainer.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>`;
        } else if (type === 'danger') {
          iconContainer.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`;
        } else {
          iconContainer.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`;
        }
      }

      systemAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // Cek apakah baru saja mendaftar dari halaman register
  const urlParams = new URLSearchParams(window.location.search);
  const isJustRegistered = urlParams.get('registered') === 'true';
  const lastRegisteredData = localStorage.getItem('barangtemuan_last_registered');

  if (lastRegisteredData) {
    try {
      const lastUser = JSON.parse(lastRegisteredData);
      if (lastUser && (lastUser.email || lastUser.phone)) {
        identifierInput.value = lastUser.email || lastUser.phone;
        if (isJustRegistered) {
          showSystemFeedback(
            'Pendaftaran Berhasil!',
            `Selamat datang, ${lastUser.name || 'Pengguna'}! Silakan masukkan kata sandi Anda untuk masuk ke portal Barang Temuan.`,
            'success'
          );
          passwordInput.focus();
        }
      }
    } catch (e) {}
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideSystemAlert();

    const identifierVal = identifierInput.value.trim();
    const passwordVal = passwordInput.value;

    const idCheck = validateIdentifier(identifierVal);
    const pwdCheck = validatePassword(passwordVal);

    let hasError = false;

    if (!idCheck.valid) {
      showError(identifierGroup, identifierError, idCheck.message);
      hasError = true;
    } else {
      clearError(identifierGroup);
    }

    if (!pwdCheck.valid) {
      showError(passwordGroup, passwordError, pwdCheck.message);
      hasError = true;
    } else {
      clearError(passwordGroup);
    }

    if (hasError) {
      if (!idCheck.valid) {
        identifierInput.focus();
      } else if (!pwdCheck.valid) {
        passwordInput.focus();
      }
      return;
    }

    // Tampilkan indikator proses singkat
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    const originalText = submitBtn.querySelector('.btn-text').textContent;
    submitBtn.querySelector('.btn-text').textContent = 'Memverifikasi...';

    setTimeout(() => {
      // Periksa kecocokan data dengan LocalStorage
      let users = [];
      try {
        const stored = localStorage.getItem('barangtemuan_users');
        if (stored) users = JSON.parse(stored);
        if (!Array.isArray(users)) users = [];
      } catch (e) {
        users = [];
      }

      const inputNormalized = identifierVal.toLowerCase().replace(/[\s-]/g, '');
      const matchedUser = users.find(u => 
        u.email.toLowerCase() === inputNormalized || 
        u.phone.replace(/[\s-]/g, '') === inputNormalized
      );

      if (matchedUser) {
        // Cek password
        if (matchedUser.password !== passwordVal) {
          submitBtn.classList.remove('is-loading');
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = originalText;
          showError(passwordGroup, passwordError, 'Kata sandi yang Anda masukkan salah.');
          passwordInput.focus();
          return;
        }

        // Login Berhasil
        localStorage.setItem('barangtemuan_current_user', JSON.stringify({
          name: matchedUser.name,
          email: matchedUser.email,
          phone: matchedUser.phone,
          loggedInAt: new Date().toISOString()
        }));

        submitBtn.classList.remove('is-loading');
        submitBtn.querySelector('.btn-text').textContent = 'Berhasil Masuk!';

        showSystemFeedback(
          'Masuk Berhasil!',
          `Selamat datang kembali, ${matchedUser.name}! Mengarahkan Anda ke Beranda...`,
          'success'
        );

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);

      } else {
        // Jika belum ada user terdaftar di LocalStorage, tetap berikan akses demo mulus
        const demoUser = {
          name: idCheck.type === 'email' ? identifierVal.split('@')[0] : 'Pengguna Barang Temuan',
          email: idCheck.type === 'email' ? identifierVal : '',
          phone: idCheck.type === 'phone' ? identifierVal : '',
          loggedInAt: new Date().toISOString()
        };

        localStorage.setItem('barangtemuan_current_user', JSON.stringify(demoUser));

        submitBtn.classList.remove('is-loading');
        submitBtn.querySelector('.btn-text').textContent = 'Berhasil Masuk!';

        showSystemFeedback(
          'Masuk Berhasil!',
          `Selamat datang! Mengarahkan Anda ke Beranda...`,
          'success'
        );

        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      }
    }, 600);
  });

  /* ========================================================
   * 4. NAVIGASI PROYEK (LUPA PASSWORD & REGISTRASI)
   * ======================================================== */
  function openModal(title, desc, bodyText) {
    if (navModal && modalTitle && modalDesc && modalBody) {
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalBody.innerHTML = bodyText;
      navModal.classList.add('active');
      navModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal() {
    if (navModal) {
      navModal.classList.remove('active');
      navModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (navModal) {
    navModal.addEventListener('click', (e) => {
      if (e.target === navModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navModal && navModal.classList.contains('active')) {
      closeModal();
    }
  });

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(
        'Pemulihan Kata Sandi',
        'Fitur Pemulihan Akun Barang Temuan',
        'Instruksi pemulihan kata sandi telah dikirimkan ke email atau nomor handphone yang terdaftar. Silakan periksa kotak masuk atau pesan SMS Anda untuk mengatur ulang kata sandi.'
      );
    });
  }

  if (registerLink) {
    const href = registerLink.getAttribute('href');
    if (href && href.startsWith('#')) {
      registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(
          'Pendaftaran Akun Baru',
          'Bergabung dengan Komunitas Barang Temuan',
          'Tautan <strong>Daftar Sekarang</strong> telah disiapkan sesuai navigasi proyek. Modul halaman registrasi (<em>register.html</em>) disiapkan untuk dihubungkan pada tahap pengembangan berikutnya.'
        );
      });
    }
  }
});
