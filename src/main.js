import './styles.css';
import { setupFetchInterceptor } from './core/api.js';
import { state, getCurrentUser, setCurrentUser } from './core/state.js';
import { navigateTo, registerRoutes, NAV_ADMIN, NAV_LIBRARIAN, NAV_MEMBER } from './core/router.js';
import { showToast } from './core/toast.js';

// Auth module imports
import { handleLogin, fillLogin, handleLogout } from './modules/auth/login.js';
import { showRegisterForm, showLoginForm, handleRegister, checkUsernameAvailable, checkPasswordStrength, togglePasswordVisibility } from './modules/auth/register.js';

// Module view imports
import { renderDashboard } from './modules/dashboard/dashboard.js';
import { renderBooks, openBookModal, saveBook, confirmDeleteBook, showBookDetail } from './modules/books/books.js';
import { renderCategories, openCategoryModal, saveCategory, confirmDeleteCategory } from './modules/books/categories.js';
import { renderAuthors, openAuthorModal, saveAuthor, confirmDeleteAuthor } from './modules/books/authors.js';
import { renderMembers, openMemberModal, confirmDeleteMember } from './modules/members/members.js';
import { renderAccounts, openAccountModal, saveAccount, toggleAccountStatus, confirmDeleteAccount } from './modules/accounts/accounts.js';
import { renderBorrows } from './modules/borrows/borrows.js';
import { renderBorrowProcess } from './modules/borrows/borrow-process.js';
import { renderReturnProcess } from './modules/borrows/return-process.js';
import { renderViolations } from './modules/borrows/violations.js';
import { renderMyBorrows } from './modules/my-space/my-borrows.js';
import { renderMyViolations } from './modules/my-space/my-violations.js';
import { renderReports } from './modules/reports/reports.js';
import { renderConfig } from './modules/config/config.js';

// Register routes in the router
registerRoutes({
  'dashboard': renderDashboard,
  'books': renderBooks,
  'categories': renderCategories,
  'authors': renderAuthors,
  'members': renderMembers,
  'accounts': renderAccounts,
  'borrows': renderBorrows,
  'borrow-process': renderBorrowProcess,
  'return-process': renderReturnProcess,
  'violations': renderViolations,
  'my-borrows': renderMyBorrows,
  'my-violations': renderMyViolations,
  'reports': renderReports,
  'config': renderConfig
});

// Setup fetch API interceptor
setupFetchInterceptor();

// Application entry-points linked to index.html elements
window.handleLogin = handleLogin;
window.fillLogin = fillLogin;
window.handleLogout = handleLogout;
window.showRegisterForm = showRegisterForm;
window.showLoginForm = showLoginForm;
window.handleRegister = handleRegister;
window.checkUsernameAvailable = checkUsernameAvailable;
window.checkPasswordStrength = checkPasswordStrength;
window.togglePasswordVisibility = togglePasswordVisibility;

// Expose book module APIs
window.openBookModal = openBookModal;
window.saveBook = saveBook;
window.confirmDeleteBook = confirmDeleteBook;
window.showBookDetail = showBookDetail;

// Expose category module APIs
window.openCategoryModal = openCategoryModal;
window.saveCategory = saveCategory;
window.confirmDeleteCategory = confirmDeleteCategory;

// Expose author module APIs
window.openAuthorModal = openAuthorModal;
window.saveAuthor = saveAuthor;
window.confirmDeleteAuthor = confirmDeleteAuthor;

// Expose member module APIs
window.openMemberModal = openMemberModal;
window.confirmDeleteMember = confirmDeleteMember;

// Expose accounts module APIs
window.openAccountModal = openAccountModal;
window.saveAccount = saveAccount;
window.toggleAccountStatus = toggleAccountStatus;
window.confirmDeleteAccount = confirmDeleteAccount;

// Expose general routing
window.navigateTo = navigateTo;

// Notification handlers
window.toggleNotifications = function() {
  fetch('/borrows')
    .then(res => res.json())
    .then(borrowsList => {
      const today = new Date().toISOString().split('T')[0];
      const overdue = borrowsList.filter(w => w.borrow && !w.borrow.returnDate && w.borrow.status === 'BORROWING' && w.borrow.dueDate < today);
      if (overdue.length > 0) {
        showToast(`Có ${overdue.length} phiếu mượn quá hạn cần xử lý!`, 'warning');
        if (state.currentUser.role !== 'Member') navigateTo('violations');
        else navigateTo('my-violations');
      } else {
        showToast('Không có thông báo mới', 'info');
      }
    })
    .catch(() => showToast('Lỗi khi tải thông báo', 'error'));
};

window.showApp = function() {
  const user = getCurrentUser();
  if (!user) return;

  document.getElementById('login-page').classList.add('d-none');
  document.getElementById('app').classList.remove('d-none');

  const roleLabels = { Admin: 'Quản trị viên', Librarian: 'Thủ thư', Member: 'Sinh viên' };
  const roleIcons = { Admin: '👑', Librarian: '📚', Member: '🎓' };
  const roleClasses = { Admin: 'text-danger', Librarian: 'text-primary', Member: 'text-success' };

  document.getElementById('sidebarAvatar').textContent = roleIcons[user.role] || '👤';
  document.getElementById('sidebarName').textContent = user.fullname || 'Người dùng';
  
  const roleEl = document.getElementById('sidebarRole');
  roleEl.textContent = roleLabels[user.role] || user.role;
  roleEl.className = 'small fw-bold ' + (roleClasses[user.role] || 'text-secondary');

  const navMap = { Admin: NAV_ADMIN, Librarian: NAV_LIBRARIAN, Member: NAV_MEMBER };
  renderSidebar(navMap[user.role] || NAV_MEMBER);

  navigateTo('dashboard');
};

function renderSidebar(navConfig) {
  const nav = document.getElementById('sidebarNav');
  nav.innerHTML = navConfig.map(section => `
    <div class="px-3 pt-3 pb-1 text-muted text-uppercase fs-8 fw-bold">${section.label}</div>
    <ul class="nav flex-column px-2 gap-1">
      ${section.sections.map(item => `
        <li class="nav-item">
          <a class="nav-link d-flex align-items-center gap-3 text-decoration-none fs-7 py-2" id="nav-${item.id}" href="#" onclick="window.navigateTo('${item.id}'); return false;">
            <i class="bi ${item.icon} fs-6"></i>
            <span>${item.label}</span>
          </a>
        </li>
      `).join('')}
    </ul>
  `).join('');
}

// App initialization
async function init() {
  const user = getCurrentUser();
  if (user) {
    try {
      const res = await fetch(`/accounts/${user.id}`);
      if (res.ok) {
        const fresh = await res.json();
        if (fresh && fresh.status === 'active') {
          setCurrentUser(fresh);
          window.showApp();
          return;
        }
      }
    } catch (e) {}
    setCurrentUser(null);
  }
  document.getElementById('login-page').classList.remove('d-none');
}

// Boot the application
init();
