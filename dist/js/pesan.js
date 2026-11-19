/**
 * PROJECT BARANG TEMUAN — HALAMAN PESAN JAVASCRIPT
 * Fungsionalitas:
 * 1. Pemuatan percakapan riil dari database (localStorage)
 * 2. Pencarian percakapan real-time berdasarkan nama & isi pesan
 * 3. Indikator pesan belum dibaca & badge unread
 * 4. Navigasi ke ruang obrolan (chat.html)
 * 5. Tampilan Empty State jika belum ada pesan
 */

document.addEventListener('DOMContentLoaded', () => {
  const conversationList = document.getElementById('conversationList');
  const emptyState = document.getElementById('emptyState');
  const searchChatInput = document.getElementById('searchChatInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  const searchEmptyState = document.getElementById('searchEmptyState');
  const headerUnreadBadge = document.getElementById('headerUnreadBadge');
  const headerUnreadCount = document.getElementById('headerUnreadCount');
  const btnInitDemoChat = document.getElementById('btnInitDemoChat');

  let chats = [];
  let currentSearchQuery = '';

  // ==========================================
  // 1. CEK USER LOGIN DI LOCALSTORAGE
  // ==========================================
  const userData = localStorage.getItem('barangtemuan_current_user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user && user.name) {
        const profileTab = document.querySelector('.nav-item:last-child');
        if (profileTab) {
          profileTab.setAttribute('href', 'profile.html');
          profileTab.setAttribute('title', `Profile: ${user.name}`);
          const label = profileTab.querySelector('span');
          if (label) {
            label.textContent = 'Profile';
          }
        }
      }
    } catch (e) {}
  }

  // ==========================================
  // 2. AMBIL DATA PERCAKAPAN DARI LOCALSTORAGE
  // ==========================================
  function loadChats() {
    try {
      const stored = localStorage.getItem('barangtemuan_chats');
      if (stored) {
        chats = JSON.parse(stored);
        if (!Array.isArray(chats)) chats = [];
      } else {
        chats = [];
      }
    } catch (e) {
      console.warn('Gagal membaca barangtemuan_chats', e);
      chats = [];
    }

    // Urutkan berdasarkan waktu pesan terakhir (terbaru di atas)
    chats.sort((a, b) => (b.lastTimestamp || 0) - (a.lastTimestamp || 0));

    // Update badge unread total di header
    updateHeaderUnread();

    // Render list
    renderConversations();
  }

  function updateHeaderUnread() {
    const totalUnread = chats.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    if (totalUnread > 0) {
      headerUnreadBadge.style.display = 'block';
      headerUnreadCount.textContent = totalUnread > 99 ? '99+' : totalUnread;
    } else {
      headerUnreadBadge.style.display = 'none';
    }
  }

  // ==========================================
  // 3. RENDER DAFTAR PERCAKAPAN
  // ==========================================
  function renderConversations() {
    conversationList.innerHTML = '';

    // Jika database percakapan kosong
    if (chats.length === 0) {
      emptyState.style.display = 'flex';
      conversationList.style.display = 'none';
      searchEmptyState.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';

    // Filter berdasarkan query pencarian jika ada
    const query = currentSearchQuery.trim().toLowerCase();
    const filtered = chats.filter(chat => {
      if (!query) return true;
      const matchName = (chat.participantName || '').toLowerCase().includes(query);
      const matchMsg = (chat.lastMessage || '').toLowerCase().includes(query);
      const matchReport = (chat.reportName || '').toLowerCase().includes(query);
      return matchName || matchMsg || matchReport;
    });

    if (filtered.length === 0) {
      conversationList.style.display = 'none';
      searchEmptyState.style.display = 'flex';
      return;
    }

    conversationList.style.display = 'flex';
    searchEmptyState.style.display = 'none';

    filtered.forEach(chat => {
      const item = document.createElement('article');
      const hasUnread = (chat.unreadCount && chat.unreadCount > 0);
      item.className = 'conversation-item' + (hasUnread ? ' has-unread' : '');
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `Percakapan dengan ${chat.participantName}. Pesan terakhir: ${chat.lastMessage}`);
      item.setAttribute('data-id', chat.id);

      const initial = (chat.participantName || 'U').charAt(0).toUpperCase();
      const timeStr = chat.lastTime || 'Baru saja';
      const lastMsgText = chat.lastMessage || 'Mulai percakapan...';

      let reportBadgeHtml = '';
      if (chat.reportName) {
        reportBadgeHtml = `
          <div class="conv-context-row">
            <span class="conv-report-pill" title="Laporan terkait: ${escapeHtml(chat.reportName)}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <path d="M9 3v18"></path>
              </svg>
              ${escapeHtml(chat.reportName)} ${chat.reportNum ? '(' + escapeHtml(chat.reportNum) + ')' : ''}
            </span>
          </div>
        `;
      }

      const unreadBadgeHtml = hasUnread ? `
        <span class="conv-badge">${chat.unreadCount}</span>
      ` : '';

      item.innerHTML = `
        <div class="conv-avatar-wrap" aria-hidden="true">
          <svg class="conv-avatar-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
          </svg>
          <span class="online-dot" title="Online"></span>
        </div>
        <div class="conv-content">
          <div class="conv-header-row">
            <h3 class="conv-name">${escapeHtml(chat.participantName || 'Pengguna')}</h3>
            <span class="conv-time">${escapeHtml(timeStr)}</span>
          </div>
          ${reportBadgeHtml}
          <div class="conv-footer-row">
            <p class="conv-last-msg">${escapeHtml(lastMsgText)}</p>
            ${unreadBadgeHtml}
          </div>
        </div>
      `;

      function openChat() {
        // Tandai chat sudah dibaca
        chat.unreadCount = 0;
        chat.isRead = true;
        try {
          localStorage.setItem('barangtemuan_chats', JSON.stringify(chats));
        } catch(e) {}
        window.location.href = `chat.html?chatId=${encodeURIComponent(chat.id)}`;
      }

      item.addEventListener('click', openChat);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openChat();
        }
      });

      conversationList.appendChild(item);
    });
  }

  // ==========================================
  // 4. PENCARIAN PERCAKAPAN REAL-TIME
  // ==========================================
  searchChatInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value;
    if (currentSearchQuery.length > 0) {
      btnClearSearch.style.display = 'flex';
    } else {
      btnClearSearch.style.display = 'none';
    }
    renderConversations();
  });

  btnClearSearch.addEventListener('click', () => {
    searchChatInput.value = '';
    currentSearchQuery = '';
    btnClearSearch.style.display = 'none';
    searchChatInput.focus();
    renderConversations();
  });

  // ==========================================
  // 5. INISIALISASI OBROLAN DEMO / CONTOH (RINA AMELIA)
  // ==========================================
  if (btnInitDemoChat) {
    btnInitDemoChat.addEventListener('click', () => {
      const demoChatId = 'chat_rina_amelia_LH-IPHONE-01';
      const existing = chats.find(c => c.id === demoChatId);
      if (!existing) {
        const newDemoChat = {
          id: demoChatId,
          participantName: 'Rina Amelia',
          participantPhone: '0823-8743-3645',
          onlineStatus: 'Online',
          reportId: 'LH-IPHONE-01',
          reportName: 'Iphone 18 Pro',
          reportNum: '#4867284-01',
          reportPhoto: 'assets/item-iphone.png',
          lastMessage: 'Apakah barang tersebut masih tersedia?',
          lastTime: '10:45',
          lastTimestamp: Date.now() - (1000 * 60 * 15),
          unreadCount: 1,
          isRead: false
        };

        const initialMessages = [
          {
            id: 'msg_demo_1',
            sender: 'other',
            senderName: 'Rina Amelia',
            text: 'Halo, saya Rina Amelia pemilik iPhone 18 Pro sesuai laporan kehilangan #4867284-01.',
            time: '10:42',
            timestamp: Date.now() - (1000 * 60 * 18)
          },
          {
            id: 'msg_demo_2',
            sender: 'other',
            senderName: 'Rina Amelia',
            text: 'Apakah barang tersebut masih tersedia? Saya bisa menunjukkan bukti kotak dan nomor seri barang.',
            time: '10:45',
            timestamp: Date.now() - (1000 * 60 * 15)
          }
        ];

        chats.unshift(newDemoChat);
        try {
          localStorage.setItem('barangtemuan_chats', JSON.stringify(chats));
          localStorage.setItem('barangtemuan_messages_' + demoChatId, JSON.stringify(initialMessages));
        } catch(e) {}
      }

      window.location.href = `chat.html?chatId=${encodeURIComponent(demoChatId)}`;
    });
  }

  // ==========================================
  // 6. AUTO-REFRESH SINKRONISASI
  // ==========================================
  window.addEventListener('pageshow', loadChats);
  window.addEventListener('storage', loadChats);

  // Inisialisasi awal
  loadChats();

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
