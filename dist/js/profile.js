/**
 * PROJECT BARANG TEMUAN — PROFILE JAVASCRIPT
 * Mengelola data profil pengguna dinamis, pembaruan foto & informasi akun di LocalStorage,
 * pengaturan, bantuan, dan proses keluar akun (logout).
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Profile Header & Info
  const profileHeaderName = document.getElementById('profileHeaderName');
  const profileHeaderEmail = document.getElementById('profileHeaderEmail');
  const profileAvatarImg = document.getElementById('profileAvatarImg');
  const profileAvatarIcon = document.getElementById('profileAvatarIcon');
  const btnChangeAvatar = document.getElementById('btnChangeAvatar');
  const avatarFileInput = document.getElementById('avatarFileInput');

  const infoFullName = document.getElementById('infoFullName');
  const infoEmailAddress = document.getElementById('infoEmailAddress');
  const infoPhoneNumber = document.getElementById('infoPhoneNumber');
  const infoUserAddress = document.getElementById('infoUserAddress');

  const btnHeaderEditProfile = document.getElementById('btnHeaderEditProfile');
  const btnEditInfo = document.getElementById('btnEditInfo');

  // Menu Items
  const menuEditProfile = document.getElementById('menuEditProfile');
  const menuPengaturanAkun = document.getElementById('menuPengaturanAkun');
  const menuBantuan = document.getElementById('menuBantuan');
  const menuLogout = document.getElementById('menuLogout');

  // Modal 1: Edit Profile
  const modalEditProfile = document.getElementById('modalEditProfile');
  const backdropEditProfile = document.getElementById('backdropEditProfile');
  const btnCloseEditModal = document.getElementById('btnCloseEditModal');
  const btnCancelEdit = document.getElementById('btnCancelEdit');
  const formEditProfile = document.getElementById('formEditProfile');
  const editAvatarImg = document.getElementById('editAvatarImg');
  const editAvatarIcon = document.getElementById('editAvatarIcon');
  const btnTriggerFilePicker = document.getElementById('btnTriggerFilePicker');
  const inputName = document.getElementById('inputName');
  const inputEmail = document.getElementById('inputEmail');
  const inputPhone = document.getElementById('inputPhone');
  const inputAddress = document.getElementById('inputAddress');

  // Modal 2: Settings
  const modalSettings = document.getElementById('modalSettings');
  const backdropSettings = document.getElementById('backdropSettings');
  const btnCloseSettingsModal = document.getElementById('btnCloseSettingsModal');
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  const toggleNotifications = document.getElementById('toggleNotifications');
  const togglePhonePrivacy = document.getElementById('togglePhonePrivacy');
  const btnChangePassword = document.getElementById('btnChangePassword');

  // Modal 3: Help
  const modalHelp = document.getElementById('modalHelp');
  const backdropHelp = document.getElementById('backdropHelp');
  const btnCloseHelpModal = document.getElementById('btnCloseHelpModal');

  // Modal 4: Logout
  const modalLogout = document.getElementById('modalLogout');
  const backdropLogout = document.getElementById('backdropLogout');
  const btnCancelLogout = document.getElementById('btnCancelLogout');
  const btnConfirmLogout = document.getElementById('btnConfirmLogout');

  // Toast
  const profileToast = document.getElementById('profileToast');
  const toastText = document.getElementById('toastText');
  let toastTimer = null;

  // State Pengguna Aktif
  let currentUser = null;
  let tempAvatarData = null;

  // ==========================================
  // 1. INISIALISASI & MUAT DATA PENGGUNA
  // ==========================================
  function loadUserData() {
    try {
      const stored = localStorage.getItem('barangtemuan_current_user');
      if (stored) {
        currentUser = JSON.parse(stored);
      }
    } catch (e) {
      currentUser = null;
    }

    // Jika belum ada user aktif, periksa apakah ada user terdaftar di sistem
    if (!currentUser) {
      try {
        const usersStored = localStorage.getItem('barangtemuan_users');
        if (usersStored) {
          const usersList = JSON.parse(usersStored);
          if (Array.isArray(usersList) && usersList.length > 0) {
            currentUser = { ...usersList[0] };
          }
        }
      } catch (e) {}
    }

    // Fallback data profil default yang realistis sesuai identitas aplikasi
    if (!currentUser) {
      currentUser = {
        name: 'Ghozwan Alifi',
        email: 'ghozwan.alifi@email.com',
        phone: '0812-3456-7890',
        address: 'Jl. Slamet Riyadi No. 120, Surakarta',
        photo: '',
        loggedInAt: new Date().toISOString()
      };
      saveUserData();
    } else {
      // Pastikan atribut alamat dan foto tersedia
      if (!currentUser.address) currentUser.address = 'Jl. Slamet Riyadi No. 120, Surakarta';
      if (!currentUser.photo) currentUser.photo = '';
    }

    renderUserDisplay();
  }

  // ==========================================
  // 2. RENDER TAMPILAN PROFIL KE DOM
  // ==========================================
  function renderUserDisplay() {
    const displayName = currentUser.name || 'Pengguna Barang Temuan';
    const displayEmail = currentUser.email || 'email@barangtemuan.id';
    const displayPhone = currentUser.phone || '0812-3456-7890';
    const displayAddress = currentUser.address || 'Belum diatur';

    profileHeaderName.textContent = displayName;
    profileHeaderEmail.textContent = displayEmail;

    infoFullName.textContent = displayName;
    infoEmailAddress.textContent = displayEmail;
    infoPhoneNumber.textContent = displayPhone;
    infoUserAddress.textContent = displayAddress;

    // Foto Profil
    if (currentUser.photo) {
      profileAvatarImg.src = currentUser.photo;
      profileAvatarImg.style.display = 'block';
      profileAvatarIcon.style.display = 'none';

      editAvatarImg.src = currentUser.photo;
      editAvatarImg.style.display = 'block';
      editAvatarIcon.style.display = 'none';
    } else {
      profileAvatarImg.style.display = 'none';
      profileAvatarIcon.style.display = 'flex';

      editAvatarImg.style.display = 'none';
      editAvatarIcon.style.display = 'flex';
    }
  }

  function saveUserData() {
    try {
      localStorage.setItem('barangtemuan_current_user', JSON.stringify(currentUser));

      // Sinkronkan juga ke database user list jika email/phone cocok
      const usersStored = localStorage.getItem('barangtemuan_users');
      if (usersStored) {
        let usersList = JSON.parse(usersStored);
        if (Array.isArray(usersList)) {
          const idx = usersList.findIndex(u => u.email === currentUser.email || u.phone === currentUser.phone);
          if (idx >= 0) {
            usersList[idx] = { ...usersList[idx], ...currentUser };
          } else {
            usersList.push(currentUser);
          }
          localStorage.setItem('barangtemuan_users', JSON.stringify(usersList));
        }
      }
    } catch (e) {
      console.warn('Gagal menyimpan data pengguna:', e);
    }
  }

  // ==========================================
  // 3. FUNGSI PERBARUI FOTO PROFIL
  // ==========================================
  function handleAvatarUpload(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, atau WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      currentUser.photo = base64Data;
      saveUserData();
      renderUserDisplay();
      showToast('Foto profil berhasil diperbarui!');
    };
    reader.readAsDataURL(file);
  }

  btnChangeAvatar.addEventListener('click', () => {
    avatarFileInput.click();
  });

  if (btnTriggerFilePicker) {
    btnTriggerFilePicker.addEventListener('click', () => {
      avatarFileInput.click();
    });
  }

  avatarFileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      handleAvatarUpload(file);
    }
  });

  // ==========================================
  // 4. MODAL: EDIT PROFIL
  // ==========================================
  function openEditModal() {
    inputName.value = currentUser.name || '';
    inputEmail.value = currentUser.email || '';
    inputPhone.value = currentUser.phone || '';
    inputAddress.value = currentUser.address || '';

    if (currentUser.photo) {
      editAvatarImg.src = currentUser.photo;
      editAvatarImg.style.display = 'block';
      editAvatarIcon.style.display = 'none';
    } else {
      editAvatarImg.style.display = 'none';
      editAvatarIcon.style.display = 'flex';
    }

    modalEditProfile.classList.add('is-active');
    modalEditProfile.setAttribute('aria-hidden', 'false');
    inputName.focus();
  }

  function closeEditModal() {
    modalEditProfile.classList.remove('is-active');
    modalEditProfile.setAttribute('aria-hidden', 'true');
  }

  btnHeaderEditProfile.addEventListener('click', openEditModal);
  btnEditInfo.addEventListener('click', openEditModal);
  menuEditProfile.addEventListener('click', openEditModal);
  btnCloseEditModal.addEventListener('click', closeEditModal);
  btnCancelEdit.addEventListener('click', closeEditModal);
  backdropEditProfile.addEventListener('click', closeEditModal);

  formEditProfile.addEventListener('submit', (e) => {
    e.preventDefault();

    const newName = inputName.value.trim();
    const newEmail = inputEmail.value.trim();
    const newPhone = inputPhone.value.trim();
    const newAddress = inputAddress.value.trim();

    if (!newName) {
      alert('Nama lengkap tidak boleh kosong.');
      inputName.focus();
      return;
    }

    currentUser.name = newName;
    currentUser.email = newEmail;
    currentUser.phone = newPhone;
    currentUser.address = newAddress;

    saveUserData();
    renderUserDisplay();

    // Catat notifikasi aktivitas akun
    try {
      const storedNotifs = localStorage.getItem('barangtemuan_notifications');
      let notifs = storedNotifs ? JSON.parse(storedNotifs) : [];
      if (!Array.isArray(notifs)) notifs = [];
      notifs.unshift({
        id: 'notif_' + Date.now(),
        category: 'akun',
        subType: 'account_update',
        title: 'Informasi Perubahan Profil',
        description: 'Data profil akun Anda telah berhasil diperbarui.',
        time: 'Baru saja',
        timestamp: Date.now(),
        isRead: false,
        targetUrl: 'profile.html'
      });
      localStorage.setItem('barangtemuan_notifications', JSON.stringify(notifs));
    } catch (e) {}

    closeEditModal();
    showToast('Profil berhasil diperbarui!');
  });

  // ==========================================
  // 5. MODAL: PENGATURAN AKUN
  // ==========================================
  function loadSettings() {
    try {
      const stored = localStorage.getItem('barangtemuan_settings');
      if (stored) {
        const s = JSON.parse(stored);
        if (s.notifications !== undefined) toggleNotifications.checked = s.notifications;
        if (s.phonePrivacy !== undefined) togglePhonePrivacy.checked = s.phonePrivacy;
      }
    } catch(e) {}
  }

  function saveSettings() {
    try {
      const s = {
        notifications: toggleNotifications.checked,
        phonePrivacy: togglePhonePrivacy.checked
      };
      localStorage.setItem('barangtemuan_settings', JSON.stringify(s));
    } catch(e) {}
  }

  function openSettingsModal() {
    loadSettings();
    modalSettings.classList.add('is-active');
    modalSettings.setAttribute('aria-hidden', 'false');
  }

  function closeSettingsModal() {
    saveSettings();
    modalSettings.classList.remove('is-active');
    modalSettings.setAttribute('aria-hidden', 'true');
  }

  menuPengaturanAkun.addEventListener('click', openSettingsModal);
  btnCloseSettingsModal.addEventListener('click', closeSettingsModal);
  btnSaveSettings.addEventListener('click', closeSettingsModal);
  backdropSettings.addEventListener('click', closeSettingsModal);

  toggleNotifications.addEventListener('change', () => {
    saveSettings();
    showToast(toggleNotifications.checked ? 'Notifikasi diaktifkan.' : 'Notifikasi dinonaktifkan.');
  });

  togglePhonePrivacy.addEventListener('change', () => {
    saveSettings();
    showToast(togglePhonePrivacy.checked ? 'Nomor telepon ditampilkan ke publik.' : 'Nomor telepon disembunyikan.');
  });

  btnChangePassword.addEventListener('click', () => {
    const newPass = prompt('Masukkan kata sandi baru (minimal 6 karakter):');
    if (newPass !== null) {
      if (newPass.length < 6) {
        alert('Kata sandi terlalu pendek. Minimal 6 karakter.');
      } else {
        currentUser.password = newPass;
        saveUserData();
        showToast('Kata sandi berhasil diperbarui!');
      }
    }
  });

  // ==========================================
  // 6. MODAL: BANTUAN
  // ==========================================
  function openHelpModal() {
    modalHelp.classList.add('is-active');
    modalHelp.setAttribute('aria-hidden', 'false');
  }

  function closeHelpModal() {
    modalHelp.classList.remove('is-active');
    modalHelp.setAttribute('aria-hidden', 'true');
  }

  menuBantuan.addEventListener('click', openHelpModal);
  btnCloseHelpModal.addEventListener('click', closeHelpModal);
  backdropHelp.addEventListener('click', closeHelpModal);

  // ==========================================
  // 7. MODAL: KELUAR (LOGOUT)
  // ==========================================
  function openLogoutModal() {
    modalLogout.classList.add('is-active');
    modalLogout.setAttribute('aria-hidden', 'false');
  }

  function closeLogoutModal() {
    modalLogout.classList.remove('is-active');
    modalLogout.setAttribute('aria-hidden', 'true');
  }

  menuLogout.addEventListener('click', openLogoutModal);
  btnCancelLogout.addEventListener('click', closeLogoutModal);
  backdropLogout.addEventListener('click', closeLogoutModal);

  btnConfirmLogout.addEventListener('click', () => {
    btnConfirmLogout.disabled = true;
    btnConfirmLogout.textContent = 'Memproses...';

    // Hapus sesi pengguna saat ini
    try {
      localStorage.removeItem('barangtemuan_current_user');
    } catch (e) {}

    showToast('Berhasil keluar. Mengarahkan ke Masuk...');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 900);
  });

  // ==========================================
  // 8. TOAST NOTIFIKASI
  // ==========================================
  function showToast(message) {
    if (!profileToast || !toastText) return;
    toastText.textContent = message;
    profileToast.style.display = 'flex';

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      profileToast.style.display = 'none';
    }, 2400);
  }

  // Muat data saat halaman dibuka
  loadUserData();
});
