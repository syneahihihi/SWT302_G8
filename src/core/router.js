// ==================== NAVIGATION CONFIG & ROUTER ====================
import { state } from './state.js';

// Module rendering functions will be set dynamically at application start to avoid circular imports.
const renderMap = {};

export function registerRoutes(routes) {
  Object.assign(renderMap, routes);
}

export const NAV_ADMIN = [
  {
    label: 'Tổng quan', sections: [
      { id: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    ]
  },
  {
    label: 'Quản lý', sections: [
      { id: 'books', icon: 'bi-book-fill', label: 'Quản lý Sách' },
      { id: 'categories', icon: 'bi-tags-fill', label: 'Danh mục' },
      { id: 'authors', icon: 'bi-pen-fill', label: 'Tác giả' },
      { id: 'members', icon: 'bi-people-fill', label: 'Thành viên' },
      { id: 'accounts', icon: 'bi-shield-lock-fill', label: 'Tài khoản' },
    ]
  },
  {
    label: 'Vận hành', sections: [
      { id: 'borrows', icon: 'bi-journal-bookmark-fill', label: 'Phiếu mượn' },
      { id: 'reports', icon: 'bi-graph-up', label: 'Báo cáo' },
      { id: 'config', icon: 'bi-gear-fill', label: 'Cấu hình' },
    ]
  },
];

export const NAV_LIBRARIAN = [
  {
    label: 'Tổng quan', sections: [
      { id: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    ]
  },
  {
    label: 'Nghiệp vụ', sections: [
      { id: 'borrow-process', icon: 'bi-journal-arrow-down', label: 'Mượn sách' },
      { id: 'return-process', icon: 'bi-journal-arrow-up', label: 'Trả sách' },
      { id: 'borrows', icon: 'bi-journal-text', label: 'Danh sách mượn' },
    ]
  },
  {
    label: 'Quản lý', sections: [
      { id: 'books', icon: 'bi-book-fill', label: 'Kho sách' },
      { id: 'members', icon: 'bi-people-fill', label: 'Thành viên' },
      { id: 'violations', icon: 'bi-exclamation-octagon-fill', label: 'Vi phạm' },
    ]
  },
];

export const NAV_MEMBER = [
  {
    label: 'Tổng quan', sections: [
      { id: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
      { id: 'books', icon: 'bi-search', label: 'Tìm kiếm sách' },
    ]
  },
  {
    label: 'Cá nhân', sections: [
      { id: 'my-borrows', icon: 'bi-clock-history', label: 'Lịch sử mượn' },
      { id: 'my-violations', icon: 'bi-exclamation-triangle-fill', label: 'Vi phạm & Phạt' },
    ]
  },
];

export function navigateTo(page) {
  state.currentPage = page;
  
  // Update sidebar active link state
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');

  const pageContent = document.getElementById('pageContent');
  if (!pageContent) return;

  pageContent.innerHTML = '<div class="d-flex justify-content-center py-5"><div class="spinner-border text-primary" role="status"></div></div>';
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

  const topbarTitle = document.getElementById('topbarTitle');
  if (topbarTitle) {
    topbarTitle.textContent = titleMap[page] || page;
  }

  if (renderMap[page]) {
    renderMap[page]();
  } else {
    pageContent.innerHTML = `<div class="alert alert-warning">Trang ${page} không tìm thấy hoặc chưa được định nghĩa render handler.</div>`;
  }
}
