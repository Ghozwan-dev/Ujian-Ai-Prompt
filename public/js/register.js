/**
 * PROJECT BARANG TEMUAN — REGISTER PAGE JAVASCRIPT
 * Menangani toggle password, validasi komprehensif form registrasi, dan feedback sistem.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const registerForm = document.getElementById('registerForm');
  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');
  const passwordInput = document.getElementById('passwordInput');
  const confirmPasswordInput = document.getElementById('confirmPasswordInput');
  const termsCheckbox = document.getElementById('termsCheckbox');

  // Buttons & Alerts
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPasswordBtn');
  const submitBtn = document.getElementById('submitBtn');
  const systemAlert = document.getElementById('systemAlert');
  const alertTitle = document.getElementById('alertTitle');
  const alertDesc = document.getElementById('alertDesc');

  // Groups and Error elements
  const nameGroup = document.getElementById('nameGroup');
  const emailGroup = document.getElementById('emailGroup');
  const phoneGroup = document.getElementById('phoneGroup');
  const passwordGroup = document.getElementById('passwordGroup');
  const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
  const termsGroup = document.getElementById('termsGroup');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const phoneError = document.getElementById('phoneError');
  const passwordError = document.getElementById('passwordError');
  const confirmPasswordError = document.getElementById('confirmPasswordError');
  const termsError = document.getElementById('termsError');

  // Modals for Terms & Privacy
  const termsModal = document.getElementById('termsModal');
  const termsModalTitle = document.getElementById('termsModalTitle');
  const termsModalSubtitle = document.getElementById('termsModalSubtitle');
  const termsModalBody = document.getElementById('termsModalBody');
  const termsModalCloseBtn = document.getElementById('termsModalCloseBtn');
  const termsLink = document.getElementById('termsLink');
  const privacyLink = document.getElementById('privacyLink');

  /* ========================================================
   * 1. TOGGLE SHOW / HIDE PASSWORD (INDEPENDENT)
   * ======================================================== */
  function setupPasswordToggle(button, input) {
    if (!button || !input) return;

    button.addEventListener('click', (e) => {
      e.preventDefault();
      const isPassword = input.getAttribute('type') === 'password';
      const newType = isPassword ? 'text' : 'password';
      input.setAttribute('type', newType);

      const eyeIcon = button.querySelector('.icon-eye');
      const eyeOffIcon = button.querySelector('.icon-eye-off');

      if (isPassword) {
        eyeIcon.style.display = 'none';
        eyeOffIcon.style.display = 'block';
        button.setAttribute('aria-label', 'Sembunyikan kata sandi');
        button.setAttribute('title', 'Sembunyikan kata sandi');
      } else {
        eyeIcon.style.display = 'block';
        eyeOffIcon.style.display = 'none';
        button.setAttribute('aria-label', 'Tampilkan kata sandi');
        button.setAttribute('title', 'Tampilkan kata sandi');
      }

      input.focus();
    });
  }

  setupPasswordToggle(togglePasswordBtn, passwordInput);
  setupPasswordToggle(toggleConfirmPasswordBtn, confirmPasswordInput);

  /* ========================================================
   * 2. VALIDATION HELPERS
   * ======================================================== */
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  const phoneRegex = /^(\+62|62|08|0)[0-9]{8,13}$/;

  function validateName(val) {
    const trimmed = val.trim();
    if (!trimmed) {
      return { valid: false, message: 'Nama lengkap wajib diisi.' };
    }
    if (trimmed.length < 3) {
      return { valid: false, message: 'Nama lengkap minimal 3 karakter.' };
    }
    return { valid: true, value: trimmed };
  }

  function validateEmail(val) {
    const trimmed = val.trim();
    if (!trimmed) {
      return { valid: false, message: 'Alamat email wajib diisi.' };
    }
    if (!emailRegex.test(trimmed)) {
      return { valid: false, message: 'Format email tidak valid (contoh: nama@domain.com).' };
    }
    return { valid: true, value: trimmed };
  }

  function validatePhone(val) {
    const trimmed = val.trim().replace(/[\s-]/g, '');
    if (!trimmed) {
      return { valid: false, message: 'Nomor handphone wajib diisi.' };
    }
    if (!phoneRegex.test(trimmed)) {
      return { valid: false, message: 'Nomor handphone harus valid (10-14 digit, contoh: 08123456789).' };
    }
    return { valid: true, value: trimmed };
  }

  function validatePassword(val) {
    if (!val) {
      return { valid: false, message: 'Kata sandi wajib diisi.' };
    }
    if (val.length < 6) {
      return { valid: false, message: 'Kata sandi minimal 6 karakter.' };
    }
    return { valid: true };
  }

  function validateConfirmPassword(val, mainVal) {
    if (!val) {
      return { valid: false, message: 'Konfirmasi kata sandi wajib diisi.' };
    }
    if (val !== mainVal) {
      return { valid: false, message: 'Konfirmasi kata sandi tidak cocok dengan kata sandi di atas.' };
    }
    return { valid: true };
  }

  function showError(group, errorEl, message) {
    if (!group || !errorEl) return;
    group.classList.add('has-error');
    const msgSpan = errorEl.querySelector('.error-text');
    if (msgSpan) {
      msgSpan.textContent = message;
    } else {
      errorEl.textContent = message;
    }
  }

  function clearError(group) {
    if (!group) return;
    group.classList.remove('has-error');
  }

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

  // Clear errors on user input
  const inputMap = [
    { el: nameInput, group: nameGroup },
    { el: emailInput, group: emailGroup },
    { el: phoneInput, group: phoneGroup },
    { el: passwordInput, group: passwordGroup },
    { el: confirmPasswordInput, group: confirmPasswordGroup },
    { el: termsCheckbox, group: termsGroup }
  ];

  inputMap.forEach(({ el, group }) => {
    if (!el) return;
    const eventName = el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(eventName, () => {
      clearError(group);
      hideSystemAlert();
    });
  });

  /* ========================================================
   * 3. FORM SUBMISSION
   * ======================================================== */
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideSystemAlert();

    const nameRes = validateName(nameInput.value);
    const emailRes = validateEmail(emailInput.value);
    const phoneRes = validatePhone(phoneInput.value);
    const pwdRes = validatePassword(passwordInput.value);
    const confPwdRes = validateConfirmPassword(confirmPasswordInput.value, passwordInput.value);
    const termsRes = termsCheckbox.checked;

    let hasError = false;
    let firstErrorEl = null;

    if (!nameRes.valid) {
      showError(nameGroup, nameError, nameRes.message);
      hasError = true;
      firstErrorEl = firstErrorEl || nameInput;
    } else {
      clearError(nameGroup);
    }

    if (!emailRes.valid) {
      showError(emailGroup, emailError, emailRes.message);
      hasError = true;
      firstErrorEl = firstErrorEl || emailInput;
    } else {
      clearError(emailGroup);
    }

    if (!phoneRes.valid) {
      showError(phoneGroup, phoneError, phoneRes.message);
      hasError = true;
      firstErrorEl = firstErrorEl || phoneInput;
    } else {
      clearError(phoneGroup);
    }

    if (!pwdRes.valid) {
      showError(passwordGroup, passwordError, pwdRes.message);
      hasError = true;
      firstErrorEl = firstErrorEl || passwordInput;
    } else {
      clearError(passwordGroup);
    }

    if (!confPwdRes.valid) {
      showError(confirmPasswordGroup, confirmPasswordError, confPwdRes.message);
      hasError = true;
      firstErrorEl = firstErrorEl || confirmPasswordInput;
    } else {
      clearError(confirmPasswordGroup);
    }

    if (!termsRes) {
      showError(termsGroup, termsError, 'Anda harus menyetujui Syarat & Ketentuan untuk mendaftar.');
      hasError = true;
      firstErrorEl = firstErrorEl || termsCheckbox;
    } else {
      clearError(termsGroup);
    }

    if (hasError) {
      if (firstErrorEl) firstErrorEl.focus();
      return;
    }

    // Tampilkan loading spinner
    submitBtn.classList.add('is-loading');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Mendaftarkan Akun...';

    setTimeout(() => {
      // Simpan akun baru ke LocalStorage (Simulasi Alur Lengkap)
      const newUser = {
        name: nameRes.value,
        email: emailRes.value.toLowerCase(),
        phone: phoneRes.value,
        password: passwordInput.value,
        registeredAt: new Date().toISOString()
      };

      let users = [];
      try {
        const stored = localStorage.getItem('barangtemuan_users');
        if (stored) users = JSON.parse(stored);
        if (!Array.isArray(users)) users = [];
      } catch (e) {
        users = [];
      }

      const existingIndex = users.findIndex(u => u.email === newUser.email || u.phone === newUser.phone);
      if (existingIndex >= 0) {
        users[existingIndex] = newUser;
      } else {
        users.push(newUser);
      }

      localStorage.setItem('barangtemuan_users', JSON.stringify(users));
      localStorage.setItem('barangtemuan_last_registered', JSON.stringify({
        email: newUser.email,
        phone: newUser.phone,
        name: newUser.name
      }));

      submitBtn.classList.remove('is-loading');
      submitBtn.querySelector('.btn-text').textContent = 'Pendaftaran Berhasil!';

      showSystemFeedback(
        'Pendaftaran Berhasil!',
        `Selamat datang, ${newUser.name}! Akun Anda telah berhasil dibuat. Mengarahkan ke halaman Masuk...`,
        'success'
      );

      console.info('[Barang Temuan] Pendaftaran Berhasil (Disimpan ke LocalStorage):', {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        timestamp: newUser.registeredAt
      });

      // Redirect otomatis ke halaman Login
      setTimeout(() => {
        window.location.href = 'login.html?registered=true';
      }, 1800);
    }, 650);
  });

  /* ========================================================
   * 4. MODAL SYARAT & KETENTUAN / KEBIJAKAN PRIVASI
   * ======================================================== */
  function openTermsModal(title, subtitle, contentHtml) {
    if (!termsModal) return;
    termsModalTitle.textContent = title;
    termsModalSubtitle.textContent = subtitle;
    termsModalBody.innerHTML = contentHtml;
    termsModal.classList.add('active');
    termsModal.setAttribute('aria-hidden', 'false');
  }

  function closeTermsModal() {
    if (!termsModal) return;
    termsModal.classList.remove('active');
    termsModal.setAttribute('aria-hidden', 'true');
  }

  if (termsModalCloseBtn) {
    termsModalCloseBtn.addEventListener('click', closeTermsModal);
  }

  if (termsModal) {
    termsModal.addEventListener('click', (e) => {
      if (e.target === termsModal) {
        closeTermsModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && termsModal && termsModal.classList.contains('active')) {
      closeTermsModal();
    }
  });

  if (termsLink) {
    termsLink.addEventListener('click', (e) => {
      e.preventDefault();
      openTermsModal(
        'Syarat & Ketentuan',
        'Ketentuan Layanan Aplikasi Barang Temuan',
        '<p>1. Pengguna wajib memberikan informasi yang akurat dan jujur saat mendaftar serta melaporkan barang hilang atau ditemukan.</p><p style="margin-top: 8px;">2. Pengguna bertanggung jawab menjaga keamanan kredensial akun masing-masing.</p><p style="margin-top: 8px;">3. Dilarang keras melakukan penipuan, pemerasan, atau penyalahgunaan data kontak sesama pengguna portal.</p>'
      );
    });
  }

  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      openTermsModal(
        'Kebijakan Privasi',
        'Perlindungan Data Pribadi Pengguna',
        '<p>1. Kami menghormati privasi Anda. Nomor handphone dan email hanya digunakan untuk keperluan koordinasi penemuan barang dan notifikasi keamanan akun.</p><p style="margin-top: 8px;">2. Data pribadi pengguna tidak akan diperjualbelikan kepada pihak ketiga.</p>'
      );
    });
  }
});
