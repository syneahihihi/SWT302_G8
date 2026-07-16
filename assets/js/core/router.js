// ==================== NAVIGATION CONFIG ====================
const NAV_ADMIN = [
  {
    label: 'Tổng quan', sections: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    ]
  },
  {
    label: 'Quản lý', sections: [
      { id: 'books', icon: '📚', label: 'Quản lý Sách' },
      { id: 'categories', icon: '🏷️', label: 'Danh mục' },
      { id: 'authors', icon: '✍️', label: 'Tác giả' },
      { id: 'members', icon: '👥', label: 'Thành viên' },
      { id: 'accounts', icon: '🔐', label: 'Tài khoản' },
    ]
  },
  {
    label: 'Vận hành', sections: [
      { id: 'borrows', icon: '📖', label: 'Phiếu mượn' },
      { id: 'reports', icon: '📈', label: 'Báo cáo' },
      { id: 'config', icon: '⚙️', label: 'Cấu hình' },
    ]
  },
];

const NAV_LIBRARIAN = [
  {
    label: 'Tổng quan', sections: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    ]
  },
  {
    label: 'Nghiệp vụ', sections: [
      { id: 'borrow-process', icon: '📖', label: 'Mượn sách' },
      { id: 'return-process', icon: '🔄', label: 'Trả sách' },
      { id: 'borrows', icon: '📋', label: 'Danh sách mượn' },
    ]
  },
  {
    label: 'Quản lý', sections: [
      { id: 'books', icon: '📚', label: 'Kho sách' },
      { id: 'members', icon: '👥', label: 'Thành viên' },
      { id: 'violations', icon: '⚠️', label: 'Vi phạm' },
    ]
  },
];

const NAV_MEMBER = [
  {
    label: 'Tổng quan', sections: [
      { id: 'dashboard', icon: '📊', label: 'Dashboard' },
      { id: 'books', icon: '📚', label: 'Tìm kiếm sách' },
    ]
  },
  {
    label: 'Cá nhân', sections: [
      { id: 'my-borrows', icon: '📖', label: 'Lịch sử mượn' },
      { id: 'my-violations', icon: '⚠️', label: 'Vi phạm & Phạt' },
    ]
  },
];

