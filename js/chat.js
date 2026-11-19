/**
 * PROJECT BARANG TEMUAN — HALAMAN CHAT JAVASCRIPT
 * Mengelola ruang obrolan 1-on-1, penyimpanan pesan persisten di localStorage,
 * dan integrasi konteks laporan barang.
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const paramChatId = urlParams.get('chatId');
  const paramTargetUser = urlParams.get('targetUser');
  const paramPhone = urlParams.get('phone');
  const paramReportId = urlParams.get('reportId');
  const paramReportName = urlParams.get('reportName');
  const paramReportNum = urlParams.get('reportNum');
  const paramReportPhoto = urlParams.get('reportPhoto');
  const paramReportType = urlParams.get('reportType');

  // DOM Elements
  const btnBack = document.getElementById('btnBack');
  const chatUserName = document.getElementById('chatUserName');
  const chatUserStatus = document.getElementById('chatUserStatus');
  const onlineDot = document.getElementById('onlineDot');
  const btnCall = document.getElementById('btnCall');
  const reportContextBanner = document.getElementById('reportContextBanner');
  const rcbPhoto = document.getElementById('rcbPhoto');
  const rcbBadge = document.getElementById('rcbBadge');
  const rcbNum = document.getElementById('rcbNum');
  const rcbItemName = document.getElementById('rcbItemName');
  const rcbDetailLink = document.getElementById('rcbDetailLink');
  const chatMessagesContainer = document.getElementById('chatMessagesContainer');
  const chatForm = document.getElementById('chatForm');
  const messageInput = document.getElementById('messageInput');

  let chats = [];
  let currentChat = null;
  let currentChatId = '';
  let messages = [];

  // ==========================================
  // 1. MUAT DAN INISIALISASI DATA PERCAKAPAN
  // ==========================================
  try {
    const storedChats = localStorage.getItem('barangtemuan_chats');
    if (storedChats) {
      chats = JSON.parse(storedChats);
      if (!Array.isArray(chats)) chats = [];
    }
  } catch (e) {
    chats = [];
  }

  // Cari percakapan yang sesuai
  if (paramChatId) {
    currentChat = chats.find(c => c.id === paramChatId);
    currentChatId = paramChatId;
  } else if (paramTargetUser) {
    // Cari berdasarkan nama pengguna dan reportId
    currentChat = chats.find(c => 
      c.participantName === paramTargetUser && 
      (!paramReportId || c.reportId === paramReportId)
    );
    if (currentChat) {
      currentChatId = currentChat.id;
    } else {
      const slug = paramTargetUser.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const repSlug = (paramReportId || 'general').replace(/[^a-z0-9]/g, '_');
      currentChatId = `chat_${slug}_${repSlug}`;
    }
  } else {
    // Default fallback ke Rina Amelia (LH-IPHONE-01)
    currentChatId = 'chat_rina_amelia_LH-IPHONE-01';
    currentChat = chats.find(c => c.id === currentChatId);
  }

  // Jika percakapan belum terdaftar di database, buat baru
  if (!currentChat) {
    const participantName = paramTargetUser || 'Rina Amelia';
    const participantPhone = paramPhone || '0823-8743-3645';
    const reportName = paramReportName || 'Iphone 18 Pro';
    const reportNum = paramReportNum || '#4867284-01';
    const reportId = paramReportId || 'LH-IPHONE-01';
    const reportPhoto = paramReportPhoto || 'assets/item-iphone.png';
    const reportType = paramReportType || 'Hilang';

    currentChat = {
      id: currentChatId,
      participantName: participantName,
      participantPhone: participantPhone,
      onlineStatus: 'Online',
      reportId: reportId,
      reportName: reportName,
      reportNum: reportNum,
      reportPhoto: reportPhoto,
      reportType: reportType,
      lastMessage: 'Apakah barang tersebut masih tersedia?',
      lastTime: formatCurrentTime(),
      lastTimestamp: Date.now(),
      unreadCount: 0,
      isRead: true
    };

    chats.unshift(currentChat);
    saveChats();
  } else {
    // Update data laporan jika ada parameter baru yang lebih lengkap
    if (paramReportName && !currentChat.reportName) currentChat.reportName = paramReportName;
    if (paramReportNum && !currentChat.reportNum) currentChat.reportNum = paramReportNum;
    if (paramReportPhoto && !currentChat.reportPhoto) currentChat.reportPhoto = paramReportPhoto;
    if (paramPhone && !currentChat.participantPhone) currentChat.participantPhone = paramPhone;

    // Tandai sudah dibaca saat dibuka
    currentChat.unreadCount = 0;
    currentChat.isRead = true;
    saveChats();
  }

  // ==========================================
  // 2. RENDER INFORMASI HEADER & KONTEKS LAPORAN
  // ==========================================
  chatUserName.textContent = currentChat.participantName || 'Pengguna';
  chatUserStatus.textContent = currentChat.onlineStatus || 'Online';

  if (currentChat.onlineStatus === 'Offline') {
    onlineDot.classList.add('offline');
    chatUserStatus.classList.add('offline');
  }

  // Tombol Panggilan
  const cleanPhone = (currentChat.participantPhone || '082387433645').replace(/[^0-9+]/g, '');
  btnCall.href = 'tel:' + cleanPhone;

  // Banner Konteks Laporan
  if (currentChat.reportName) {
    reportContextBanner.style.display = 'block';
    rcbItemName.textContent = currentChat.reportName;
    rcbNum.textContent = currentChat.reportNum || '';
    rcbBadge.textContent = currentChat.reportType || 'Laporan';
    if (currentChat.reportPhoto) {
      rcbPhoto.src = currentChat.reportPhoto;
      rcbPhoto.alt = currentChat.reportName;
    }
    rcbDetailLink.href = currentChat.reportId ? `detail-temuan.html?id=${encodeURIComponent(currentChat.reportId)}` : 'detail-temuan.html';
  } else {
    reportContextBanner.style.display = 'none';
  }

  // ==========================================
  // 3. MUAT DAN RENDER RIWAYAT PESAN PERSISTEN
  // ==========================================
  const storageKey = 'barangtemuan_messages_' + currentChatId;
  try {
    const storedMsgs = localStorage.getItem(storageKey);
    if (storedMsgs) {
      messages = JSON.parse(storedMsgs);
      if (!Array.isArray(messages)) messages = [];
    }
  } catch (e) {
    messages = [];
  }

  // Jika pesan kosong pada chat demo / awal, sediakan pesan konteks awal
  if (messages.length === 0) {
    if (currentChat.participantName === 'Rina Amelia' || currentChat.id.includes('rina')) {
      messages = [
        {
          id: 'msg_init_1',
          sender: 'other',
          senderName: 'Rina Amelia',
          text: `Halo, saya Rina Amelia pemilik ${currentChat.reportName || 'barang'} sesuai laporan ${currentChat.reportNum || '#4867284-01'}.`,
          time: '10:42',
          timestamp: Date.now() - (1000 * 60 * 18)
        },
        {
          id: 'msg_init_2',
          sender: 'other',
          senderName: 'Rina Amelia',
          text: 'Apakah barang tersebut masih tersedia? Saya bisa menunjukkan bukti kotak dan nomor seri barang.',
          time: '10:45',
          timestamp: Date.now() - (1000 * 60 * 15)
        }
      ];
    } else {
      messages = [
        {
          id: 'msg_init_1',
          sender: 'other',
          senderName: currentChat.participantName,
          text: `Halo, terima kasih telah menghubungi terkait ${currentChat.reportName || 'barang ini'}. Apakah ada informasi lebih lanjut?`,
          time: formatCurrentTime(),
          timestamp: Date.now() - 30000
        }
      ];
    }
    saveMessages();
  }

  renderAllMessages();
  scrollToBottom(false);

  // ==========================================
  // 4. LOGIKA PENGIRIMAN PESAN
  // ==========================================
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const newMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      senderName: 'Saya',
      text: text,
      time: formatCurrentTime(),
      timestamp: Date.now()
    };

    messages.push(newMsg);
    saveMessages();

    // Update data percakapan di daftar utama (pesan terakhir & waktu)
    currentChat.lastMessage = text;
    currentChat.lastTime = newMsg.time;
    currentChat.lastTimestamp = newMsg.timestamp;
    currentChat.unreadCount = 0;
    currentChat.isRead = true;

    // Geser ke urutan paling atas
    const chatIdx = chats.findIndex(c => c.id === currentChatId);
    if (chatIdx > -1) {
      chats.splice(chatIdx, 1);
    }
    chats.unshift(currentChat);
    saveChats();

    // Render pesan baru di DOM
    appendMessageElement(newMsg);
    messageInput.value = '';
    messageInput.focus();
    scrollToBottom(true);
  });

  // Tombol Kembali
  btnBack.addEventListener('click', (e) => {
    e.preventDefault();
    if (window.history.length > 1 && document.referrer && !document.referrer.includes('chat.html')) {
      window.history.back();
    } else {
      window.location.href = 'pesan.html';
    }
  });

  // ==========================================
  // HELPER FUNCTIONS
  // ==========================================
  function renderAllMessages() {
    // Bersihkan semua balon pesan selain date-divider
    const existingBubbles = chatMessagesContainer.querySelectorAll('.message-row');
    existingBubbles.forEach(el => el.remove());

    messages.forEach(msg => {
      appendMessageElement(msg);
    });
  }

  function appendMessageElement(msg) {
    const row = document.createElement('div');
    const isUser = (msg.sender === 'user');
    row.className = `message-row ${isUser ? 'message-outgoing' : 'message-incoming'}`;

    const checkmarkSvg = isUser ? `
      <svg class="message-status-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M12.3 4.3a1 1 0 0 0-1.4 0L6 9.2 4.1 7.3a1 1 0 1 0-1.4 1.4l2.6 2.6a1 1 0 0 0 1.4 0l5.6-5.6a1 1 0 0 0 0-1.4z"/>
      </svg>
    ` : '';

    row.innerHTML = `
      <div class="message-bubble ${isUser ? 'outgoing-bubble' : 'incoming-bubble'}">
        <div class="message-text">${escapeHtml(msg.text)}</div>
        <div class="message-meta">
          <span class="message-time">${escapeHtml(msg.time || '')}</span>
          ${checkmarkSvg}
        </div>
      </div>
    `;

    chatMessagesContainer.appendChild(row);
  }

  function scrollToBottom(smooth = false) {
    requestAnimationFrame(() => {
      chatMessagesContainer.scrollTo({
        top: chatMessagesContainer.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto'
      });
    });
  }

  function saveChats() {
    try {
      localStorage.setItem('barangtemuan_chats', JSON.stringify(chats));
    } catch (e) {
      console.warn('Gagal menyimpan barangtemuan_chats', e);
    }
  }

  function saveMessages() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      console.warn('Gagal menyimpan messages', e);
    }
  }

  function formatCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  }

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
