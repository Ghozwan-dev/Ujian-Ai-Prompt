/**
 * PROJECT BARANG TEMUAN — DETAIL TEMUAN JAVASCRIPT
 * Menampilkan data detail temuan, fungsi panggilan telepon, dan status komunikasi
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetId = urlParams.get('id');

  const btnBack = document.getElementById('btnBack');
  const itemPhoto = document.getElementById('itemPhoto');
  const itemName = document.getElementById('itemName');
  const reportOwnerLabel = document.getElementById('reportOwnerLabel');
  const ownerName = document.getElementById('ownerName');
  const ownerPhone = document.getElementById('ownerPhone');
  const btnContact = document.getElementById('btnContact');
  const btnChatAction = document.getElementById('btnChatAction');
  const btnMarkContacted = document.getElementById('btnMarkContacted');
  const markContactedIcon = document.getElementById('markContactedIcon');
  const markContactedText = document.getElementById('markContactedText');

  // Baseline data aplikasi Barang Temuan
  const baselineReports = [
    {
      id: 'LH-IPHONE-01',
      nomorLaporan: '#4867284-01',
      pelapor: 'Rina Amelia',
      telepon: '0823-8743-3645',
      nama: 'Iphone 18 Pro',
      lokasi: 'Kamtout UMS',
      tanggal: '16 Nov 2026',
      foto: 'assets/item-iphone.png',
      tipe: 'Hilang'
    },
    {
      id: 'LT-JAM-01',
      nomorLaporan: '#4867284-01',
      pelapor: 'Rina Amelia',
      telepon: '0823-8743-3645',
      nama: 'Jam Tangan',
      lokasi: 'Pom Bensin Waru',
      tanggal: '20 Nov 2026',
      foto: 'assets/item-jam.png',
      tipe: 'Ditemukan'
    },
    {
      id: 'LH-SUPRA-01',
      nomorLaporan: '#3918274-02',
      pelapor: 'Budi Santoso',
      telepon: '0812-9876-5432',
      nama: 'Motor SupraX',
      lokasi: 'Mts Gaccan Solo',
      tanggal: '01 Des 2026',
      foto: 'assets/item-supra.png',
      tipe: 'Hilang'
    }
  ];

  let currentReport = null;

  // 1. Coba cari di localStorage
  const sources = ['barangtemuan_laporan_temuan', 'barangtemuan_laporan_hilang'];
  for (const key of sources) {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const list = JSON.parse(stored);
        if (Array.isArray(list)) {
          if (targetId) {
            currentReport = list.find(r => r.id === targetId);
            if (currentReport) break;
          }
        }
      }
    } catch(e) {}
  }

  // 2. Coba cari di baseline catalog
  if (!currentReport && targetId) {
    currentReport = baselineReports.find(r => r.id === targetId);
  }

  // 3. Fallback ke baseline iPhone 18 Pro sesuai screenshot referensi
  if (!currentReport) {
    currentReport = baselineReports[0];
  }

  // Render Data
  if (currentReport.foto) {
    itemPhoto.src = currentReport.foto;
    itemPhoto.alt = currentReport.nama || 'Foto Barang';
  } else {
    itemPhoto.src = 'assets/item-iphone.png';
  }

  const displayName = currentReport.nama || 'Iphone 18 Pro';
  itemName.textContent = displayName;

  const displayReportNum = currentReport.nomorLaporan || formatReportNumber(currentReport.id);
  reportOwnerLabel.textContent = 'Laporan Pemilik : ' + displayReportNum;

  const displayOwner = currentReport.pelapor || currentReport.namaPemilik || 'Rina Amelia';
  ownerName.textContent = displayOwner;

  const displayPhone = currentReport.telepon || '0823-8743-3645';
  ownerPhone.textContent = displayPhone;

  // Set URL tombol hubungi pemilik
  const cleanPhone = displayPhone.replace(/[^0-9+]/g, '');
  btnContact.href = 'tel:' + cleanPhone;

  // Set URL tombol kirim pesan (chat)
  if (btnChatAction) {
    const chatParams = new URLSearchParams({
      targetUser: displayOwner,
      phone: displayPhone,
      reportId: currentReport.id || '',
      reportName: displayName,
      reportNum: displayReportNum,
      reportPhoto: currentReport.foto || '',
      reportType: currentReport.tipe || 'Hilang'
    });
    btnChatAction.href = 'chat.html?' + chatParams.toString();
  }

  // Cek Status Komunikasi yang tersimpan
  const reportKey = currentReport.id || 'default_report';
  const isContactedKey = 'barangtemuan_contacted_' + reportKey;
  let isContacted = localStorage.getItem(isContactedKey) === 'true';

  updateContactedButtonState(isContacted);

  btnMarkContacted.addEventListener('click', () => {
    isContacted = !isContacted;
    localStorage.setItem(isContactedKey, isContacted ? 'true' : 'false');
    updateContactedButtonState(isContacted);
  });

  function updateContactedButtonState(contacted) {
    if (contacted) {
      btnMarkContacted.classList.add('is-contacted');
      markContactedIcon.style.display = 'inline-block';
      markContactedText.textContent = 'Sudah Dihubungi';
    } else {
      btnMarkContacted.classList.remove('is-contacted');
      markContactedIcon.style.display = 'none';
      markContactedText.textContent = 'Tandai Sudah Dihubungi';
    }
  }

  function formatReportNumber(id) {
    if (!id) return '#4867284-01';
    if (id.startsWith('#')) return id;
    const clean = id.replace(/[^0-9]/g, '');
    const numPart = clean.slice(-7) || '4867284';
    return '#' + numPart + '-01';
  }

  // Tombol Kembali
  btnBack.addEventListener('click', (e) => {
    if (urlParams.get('from') === 'riwayat' || (document.referrer && document.referrer.includes('riwayat.html'))) {
      e.preventDefault();
      window.location.href = 'riwayat.html';
    } else if (document.referrer && document.referrer.includes('hasil-pencocokan.html')) {
      e.preventDefault();
      window.history.back();
    }
  });
});
