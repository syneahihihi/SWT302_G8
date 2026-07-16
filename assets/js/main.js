// ==================== APP INIT ====================
function showApp() {
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');

  // Update sidebar user info
  const roleLabels = { Admin: 'Quản trị viên', Librarian: 'Thủ thư', Member: 'Sinh viên' };
  const roleIcons = { Admin: '👑', Librarian: '📚', Member: '🎓' };
  const roleClasses = { Admin: 'role-admin', Librarian: 'role-librarian', Member: 'role-member' };

  document.getElementById('sidebarAvatar').textContent = roleIcons[currentUser.role];
  document.getElementById('sidebarName').textContent = currentUser.fullname;
  const roleEl = document.getElementById('sidebarRole');
  roleEl.textContent = roleLabels[currentUser.role];
  roleEl.className = 'sidebar-user-role ' + roleClasses[currentUser.role];

  // Render navigation
  const navMap = { Admin: NAV_ADMIN, Librarian: NAV_LIBRARIAN, Member: NAV_MEMBER };
  renderSidebar(navMap[currentUser.role]);

  // Navigate to dashboard
  navigateTo('dashboard');
  updateOverdueBadges();
}

function renderSidebar(navConfig) {
  const nav = document.getElementById('sidebarNav');
  nav.innerHTML = navConfig.map(section => `
    <div class="nav-section-label">${section.label}</div>
    ${section.sections.map(item => `
      <div class="nav-item" id="nav-${item.id}" onclick="navigateTo('${item.id}')">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
        ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
      </div>
    `).join('')}
  `).join('');
}

function navigateTo(page) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');

  const pageContent = document.getElementById('pageContent');
  pageContent.innerHTML = '';
  pageContent.classList.add('fade-in');
  setTimeout(() => pageContent.classList.remove('fade-in'), 300);

  const titleMap = {
    'dashboard': 'Dashboard',
    'books': 'Quản lý Sách',
    'categories': 'Danh mục Sách',
    'authors': 'Tác giả',
    'members': 'Quản lý Thành viên',
    'accounts': 'Quản lý Tài khoản',
    'borrows': 'Danh sách Phiếu mượn',
    'borrow-process': 'Mượn Sách',
    'return-process': 'Trả Sách',
    'reports': 'Báo cáo',
    'config': 'Cấu hình Hệ thống',
    'violations': 'Quản lý Vi phạm',
    'my-borrows': 'Lịch sử Mượn sách',
    'my-violations': 'Vi phạm & Phạt',
  };

  document.getElementById('topbarTitle').textContent = titleMap[page] || page;

  const renderMap = {
    'dashboard': renderDashboard,
    'books': renderBooks,
    'categories': renderCategories,
    'authors': renderAuthors,
    'members': renderMembers,
    'accounts': renderAccounts,
    'borrows': renderBorrows,
    'borrow-process': renderBorrowProcess,
    'return-process': renderReturnProcess,
    'reports': renderReports,
    'config': renderConfig,
    'violations': renderViolations,
    'my-borrows': renderMyBorrows,
    'my-violations': renderMyViolations,
  };

  if (renderMap[page]) renderMap[page]();
}

function updateOverdueBadges() {
  const borrows = DB.get('borrows');
  const today = new Date().toISOString().split('T')[0];
  const overdue = borrows.filter(b => !b.returnDate && b.dueDate < today && b.status !== 'returned').length;
  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = overdue > 0 ? '' : 'none';
}

// ==================== INIT ====================
function init() {
  initData();
  const session = localStorage.getItem('lms_session');
  if (session) {
    try {
      const acc = JSON.parse(session);
      const fresh = DB.get('accounts').find(a => a.id === acc.id);
      if (fresh && fresh.status === 'active') {
        currentUser = fresh;
        showApp();
        return;
      }
    } catch (e) { }
    localStorage.removeItem('lms_session');
  }
  document.getElementById('login-page').classList.remove('hidden');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); document.getElementById('globalSearch')?.focus(); }
});

// Start app
init();
