/* ====================================================
   LIBRARY MANAGEMENT SYSTEM - app.js
   SWT301 - Mid Term Project
   ==================================================== */

// ==================== DATA STORE ====================
const DB = {
  get(key) { try { return JSON.parse(localStorage.getItem('lms_' + key)) || []; } catch { return []; } },
  set(key, val) { localStorage.setItem('lms_' + key, JSON.stringify(val)); },
  getObj(key) { try { return JSON.parse(localStorage.getItem('lms_' + key)) || {}; } catch { return {}; } },
  setObj(key, val) { localStorage.setItem('lms_' + key, JSON.stringify(val)); }
};

// ==================== SEED DATA ====================
function initData() {
  if (localStorage.getItem('lms_initialized')) return;

  // Categories (danh mục)
  DB.set('categories', [
    { id: 'cat1', name: 'Khoa học máy tính', description: 'Lập trình, thuật toán, cấu trúc dữ liệu' },
    { id: 'cat2', name: 'Toán học', description: 'Đại số, giải tích, thống kê' },
    { id: 'cat3', name: 'Vật lý', description: 'Cơ học, điện từ, quang học' },
    { id: 'cat4', name: 'Văn học', description: 'Tiểu thuyết, thơ, truyện ngắn' },
    { id: 'cat5', name: 'Kinh tế', description: 'Quản trị, tài chính, marketing' },
    { id: 'cat6', name: 'Ngoại ngữ', description: 'Tiếng Anh, tiếng Nhật, tiếng Pháp' },
  ]);

  // Authors (tác giả)
  DB.set('authors', [
    { id: 'au1', name: 'Nguyễn Văn Linh', nationality: 'Việt Nam', bio: 'Giáo sư Đại học Bách Khoa Hà Nội' },
    { id: 'au2', name: 'Trần Thị Mai', nationality: 'Việt Nam', bio: 'Tiến sĩ Toán học' },
    { id: 'au3', name: 'Robert C. Martin', nationality: 'Mỹ', bio: 'Tác giả Clean Code, chuyên gia phần mềm' },
    { id: 'au4', name: 'Donald Knuth', nationality: 'Mỹ', bio: 'Cha đẻ của phân tích thuật toán' },
    { id: 'au5', name: 'Nam Cao', nationality: 'Việt Nam', bio: 'Nhà văn lớn của Việt Nam' },
    { id: 'au6', name: 'Lê Hoàng Phương', nationality: 'Việt Nam', bio: 'Chuyên gia tài chính' },
  ]);

  // Books (sách)
  DB.set('books', [
    { id: 'b1', isbn: '978-0-13-110362-7', title: 'Lập trình C nâng cao', authorId: 'au1', categoryId: 'cat1', year: 2020, quantity: 5, available: 3, description: 'Sách học lập trình C từ cơ bản đến nâng cao', status: 'available' },
    { id: 'b2', isbn: '978-0-13-468599-1', title: 'Clean Code', authorId: 'au3', categoryId: 'cat1', year: 2008, quantity: 3, available: 2, description: 'Hướng dẫn viết code sạch và chuyên nghiệp', status: 'available' },
    { id: 'b3', isbn: '978-0-20-131452-9', title: 'The Art of Computer Programming', authorId: 'au4', categoryId: 'cat1', year: 2011, quantity: 2, available: 0, description: 'Kinh điển về thuật toán và cấu trúc dữ liệu', status: 'borrowed' },
    { id: 'b4', isbn: '978-0-13-235088-4', title: 'Giải tích Toán học', authorId: 'au2', categoryId: 'cat2', year: 2019, quantity: 8, available: 6, description: 'Giáo trình giải tích đại học', status: 'available' },
    { id: 'b5', isbn: '978-0-44-240524-9', title: 'Chí Phèo & Tuyển tập truyện ngắn', authorId: 'au5', categoryId: 'cat4', year: 2018, quantity: 10, available: 8, description: 'Tuyển tập tác phẩm của nhà văn Nam Cao', status: 'available' },
    { id: 'b6', isbn: '978-0-13-468501-4', title: 'Quản trị Tài chính', authorId: 'au6', categoryId: 'cat5', year: 2022, quantity: 4, available: 4, description: 'Nguyên lý quản trị tài chính doanh nghiệp', status: 'available' },
    { id: 'b7', isbn: '978-0-13-571056-2', title: 'Đại số tuyến tính', authorId: 'au2', categoryId: 'cat2', year: 2021, quantity: 6, available: 5, description: 'Giáo trình đại số tuyến tính', status: 'available' },
    { id: 'b8', isbn: '978-0-59-651798-1', title: 'JavaScript: The Good Parts', authorId: 'au3', categoryId: 'cat1', year: 2008, quantity: 3, available: 1, description: 'Tinh hoa của ngôn ngữ JavaScript', status: 'available' },
    { id: 'b9', isbn: '978-0-13-235082-2', title: 'Vật lý đại cương', authorId: 'au1', categoryId: 'cat3', year: 2020, quantity: 7, available: 7, description: 'Giáo trình vật lý đại học', status: 'available' },
    { id: 'b10', isbn: '978-0-52-103645-7', title: 'English Grammar in Use', authorId: 'au3', categoryId: 'cat6', year: 2019, quantity: 5, available: 3, description: 'Ngữ pháp tiếng Anh toàn diện', status: 'available' },
    { id: 'b11', isbn: '978-0-13-468505-2', title: 'Cấu trúc dữ liệu và giải thuật', authorId: 'au1', categoryId: 'cat1', year: 2021, quantity: 4, available: 4, description: 'Sách về cấu trúc dữ liệu và giải thuật', status: 'available' },
    { id: 'b12', isbn: '978-0-13-235080-8', title: 'Marketing căn bản', authorId: 'au6', categoryId: 'cat5', year: 2020, quantity: 3, available: 2, description: 'Giáo trình Marketing đại học', status: 'damaged' },
  ]);

  // Members (thành viên/sinh viên)
  DB.set('members', [
    { id: 'm1', code: 'SV001', name: 'Nguyễn Thị Hoa', email: 'hoa.nguyen@student.edu.vn', phone: '0901234567', address: 'Hà Nội', joinDate: '2023-09-01', status: 'active', accountId: 'acc3' },
    { id: 'm2', code: 'SV002', name: 'Trần Văn Minh', email: 'minh.tran@student.edu.vn', phone: '0912345678', address: 'Hà Nội', joinDate: '2023-09-01', status: 'active', accountId: 'acc4' },
    { id: 'm3', code: 'SV003', name: 'Lê Thị Lan', email: 'lan.le@student.edu.vn', phone: '0923456789', address: 'Hải Phòng', joinDate: '2023-09-01', status: 'locked', accountId: 'acc5' },
    { id: 'm4', code: 'SV004', name: 'Phạm Văn Đức', email: 'duc.pham@student.edu.vn', phone: '0934567890', address: 'Đà Nẵng', joinDate: '2024-02-01', status: 'active', accountId: 'acc6' },
    { id: 'm5', code: 'SV005', name: 'Hoàng Thị Thu', email: 'thu.hoang@student.edu.vn', phone: '0945678901', address: 'TP.HCM', joinDate: '2024-02-01', status: 'active', accountId: 'acc7' },
  ]);

  // Accounts (tài khoản)
  DB.set('accounts', [
    { id: 'acc1', username: 'admin', password: 'admin123', role: 'Admin', fullname: 'Nguyễn Admin', email: 'admin@library.edu.vn', status: 'active', createdAt: '2023-01-01' },
    { id: 'acc2', username: 'librarian1', password: 'lib123', role: 'Librarian', fullname: 'Nguyễn Thị Lan', email: 'librarian@library.edu.vn', status: 'active', createdAt: '2023-01-01', librarianId: 'lib1' },
    { id: 'acc3', username: 'student1', password: 'stu123', role: 'Member', fullname: 'Nguyễn Thị Hoa', email: 'hoa.nguyen@student.edu.vn', status: 'active', createdAt: '2023-09-01', memberId: 'm1' },
    { id: 'acc4', username: 'student2', password: 'stu123', role: 'Member', fullname: 'Trần Văn Minh', email: 'minh.tran@student.edu.vn', status: 'active', createdAt: '2023-09-01', memberId: 'm2' },
    { id: 'acc5', username: 'student3', password: 'stu123', role: 'Member', fullname: 'Lê Thị Lan', email: 'lan.le@student.edu.vn', status: 'locked', createdAt: '2023-09-01', memberId: 'm3' },
    { id: 'acc6', username: 'student4', password: 'stu123', role: 'Member', fullname: 'Phạm Văn Đức', email: 'duc.pham@student.edu.vn', status: 'active', createdAt: '2024-02-01', memberId: 'm4' },
    { id: 'acc7', username: 'student5', password: 'stu123', role: 'Member', fullname: 'Hoàng Thị Thu', email: 'thu.hoang@student.edu.vn', status: 'active', createdAt: '2024-02-01', memberId: 'm5' },
  ]);

  // Librarians
  DB.set('librarians', [
    { id: 'lib1', name: 'Nguyễn Thị Lan', email: 'librarian@library.edu.vn', phone: '0901234560', accountId: 'acc2' },
  ]);

  // System config
  DB.setObj('config', {
    maxBorrowDays: 14,
    maxBooksPerMember: 3,
    finePerDay: 2000,
    fineDamagedPercent: 50,
    fineLostPercent: 100,
    reminderDaysBefore: 2,
  });

  // Borrows (phiếu mượn)
  const today = new Date();
  const overdue = new Date(today); overdue.setDate(overdue.getDate() - 20);
  const overdueStr = overdue.toISOString().split('T')[0];
  const dueOverdue = new Date(today); dueOverdue.setDate(dueOverdue.getDate() - 6);
  const future = new Date(today); future.setDate(future.getDate() + 7);

  DB.set('borrows', [
    { id: 'br1', memberId: 'm1', librarianId: 'lib1', borrowDate: overdueStr, dueDate: dueOverdue.toISOString().split('T')[0], returnDate: null, status: 'overdue', note: '', fine: 0, bookIds: ['b3'] },
    { id: 'br2', memberId: 'm2', librarianId: 'lib1', borrowDate: '2024-06-01', dueDate: '2024-06-15', returnDate: '2024-06-13', status: 'returned', note: 'Trả đúng hạn', fine: 0, bookIds: ['b1'] },
    { id: 'br3', memberId: 'm1', librarianId: 'lib1', borrowDate: new Date(today.getTime() - 5 * 86400000).toISOString().split('T')[0], dueDate: future.toISOString().split('T')[0], returnDate: null, status: 'borrowing', note: '', fine: 0, bookIds: ['b8'] },
    { id: 'br4', memberId: 'm4', librarianId: 'lib1', borrowDate: '2024-05-20', dueDate: '2024-06-03', returnDate: '2024-06-10', status: 'returned', note: 'Trả muộn 7 ngày', fine: 14000, bookIds: ['b2'] },
    { id: 'br5', memberId: 'm3', librarianId: 'lib1', borrowDate: '2024-04-01', dueDate: '2024-04-15', returnDate: null, status: 'overdue', note: '', fine: 0, bookIds: ['b10'] },
  ]);

  localStorage.setItem('lms_initialized', '1');
}

// ==================== APP STATE ====================
let currentUser = null;
let currentPage = 'dashboard';
let selectedBorrowBooks = [];
let currentReturnBorrow = null;

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

// ==================== AUTH ====================
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginBtn');
  const errorEl = document.getElementById('loginError');

  btn.innerHTML = '<div class="spinner"></div> Đang xử lý...';
  btn.disabled = true;
  errorEl.classList.add('hidden');

  setTimeout(() => {
    const accounts = DB.get('accounts');
    const account = accounts.find(a => a.username === username && a.password === password);

    if (!account) {
      errorEl.classList.remove('hidden');
      btn.innerHTML = '<span>Đăng nhập</span><span>→</span>';
      btn.disabled = false;
      return;
    }

    if (account.status === 'locked') {
      errorEl.textContent = '🔒 Tài khoản đã bị khóa. Liên hệ admin để được hỗ trợ.';
      errorEl.classList.remove('hidden');
      btn.innerHTML = '<span>Đăng nhập</span><span>→</span>';
      btn.disabled = false;
      return;
    }

    currentUser = account;
    localStorage.setItem('lms_session', JSON.stringify(account));
    showApp();
  }, 600);
}

function fillLogin(u, p) {
  document.getElementById('loginUsername').value = u;
  document.getElementById('loginPassword').value = p;
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('lms_session');
  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginError').classList.add('hidden');
  // Reset login button state
  const btn = document.getElementById('loginBtn');
  if (btn) { btn.innerHTML = '<span>Đăng nhập</span><span>→</span>'; btn.disabled = false; }
  showToast('Đã đăng xuất thành công', 'info');
}

// ==================== REGISTER ====================
function showRegisterForm(e) {
  if (e) e.preventDefault();
  document.getElementById('login-page').classList.add('hidden');
  document.getElementById('register-page').classList.remove('hidden');
  resetRegisterForm();
}

function showLoginForm(e) {
  if (e) e.preventDefault();
  document.getElementById('register-page').classList.add('hidden');
  document.getElementById('login-page').classList.remove('hidden');
}

function resetRegisterForm() {
  const form = document.getElementById('registerForm');
  if (form) form.reset();
  ['regFullname','regStudentId','regEmail','regPhone','regUsername','regPassword','regConfirmPassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('input-error', 'input-ok'); }
  });
  ['errRegFullname','errRegStudentId','errRegEmail','errRegPhone','errRegUsername','errRegPassword','errRegConfirmPassword','errRegTerms'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.add('hidden'); el.textContent = ''; }
  });
  const hint = document.getElementById('hintRegUsername');
  if (hint) { hint.textContent = ''; hint.className = 'field-hint'; }
  const bar = document.getElementById('pwStrengthBar');
  if (bar) bar.style.display = 'none';
  const fill = document.getElementById('pwStrengthFill');
  if (fill) { fill.style.width = '0%'; fill.className = 'pw-strength-fill'; }
  const errBox = document.getElementById('registerError');
  if (errBox) errBox.classList.add('hidden');
  const sucBox = document.getElementById('registerSuccess');
  if (sucBox) sucBox.classList.add('hidden');
  const regBtn = document.getElementById('registerBtn');
  if (regBtn) { regBtn.innerHTML = '<span>Tạo tài khoản</span><span>✨</span>'; regBtn.disabled = false; }
}

function setFieldError(fieldId, errId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (field) { field.classList.add('input-error'); field.classList.remove('input-ok'); }
  if (err) { err.textContent = '⚠ ' + msg; err.classList.remove('hidden'); }
}

function clearFieldError(fieldId, errId) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById(errId);
  if (field) { field.classList.remove('input-error'); field.classList.add('input-ok'); }
  if (err) { err.classList.add('hidden'); err.textContent = ''; }
}

function checkUsernameAvailable(val) {
  const hint = document.getElementById('hintRegUsername');
  const field = document.getElementById('regUsername');
  if (!hint || !field) return;
  const v = val.trim();
  if (v.length < 3) {
    hint.textContent = '';
    hint.className = 'field-hint';
    field.classList.remove('input-ok', 'input-error');
    return;
  }
  const accounts = DB.get('accounts');
  const taken = accounts.some(a => a.username.toLowerCase() === v.toLowerCase());
  if (taken) {
    hint.textContent = '✗ Tên đăng nhập đã được sử dụng';
    hint.className = 'field-hint taken';
    field.classList.add('input-error');
    field.classList.remove('input-ok');
  } else {
    hint.textContent = '✓ Tên đăng nhập khả dụng';
    hint.className = 'field-hint ok';
    field.classList.remove('input-error');
    field.classList.add('input-ok');
  }
}

function checkPasswordStrength(val) {
  const bar = document.getElementById('pwStrengthBar');
  const fill = document.getElementById('pwStrengthFill');
  const label = document.getElementById('pwStrengthLabel');
  if (!bar || !fill || !label) return;

  if (!val) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';

  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  if (score <= 1) {
    fill.style.width = '25%';
    fill.className = 'pw-strength-fill weak';
    label.textContent = 'Yếu';
    label.style.color = 'var(--accent-rose)';
  } else if (score <= 3) {
    fill.style.width = '60%';
    fill.className = 'pw-strength-fill medium';
    label.textContent = 'Trung bình';
    label.style.color = 'var(--accent-amber)';
  } else {
    fill.style.width = '100%';
    fill.className = 'pw-strength-fill strong';
    label.textContent = 'Mạnh';
    label.style.color = 'var(--accent-green)';
  }
}

function togglePasswordVisibility(inputId, btnId) {
  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input || !btn) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = '🙈';
  } else {
    input.type = 'password';
    btn.textContent = '👁';
  }
}

function handleRegister(e) {
  e.preventDefault();

  // Collect values
  const fullname = document.getElementById('regFullname').value.trim();
  const studentId = document.getElementById('regStudentId').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const terms = document.getElementById('regTerms').checked;

  // Clear all errors first
  ['regFullname','regStudentId','regEmail','regPhone','regUsername','regPassword','regConfirmPassword'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('input-error', 'input-ok'); }
  });
  ['errRegFullname','errRegStudentId','errRegEmail','errRegPhone','errRegUsername','errRegPassword','errRegConfirmPassword','errRegTerms'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.add('hidden'); el.textContent = ''; }
  });
  document.getElementById('registerError').classList.add('hidden');
  document.getElementById('registerSuccess').classList.add('hidden');

  let hasError = false;

  // ---- Validation ----
  // Họ tên
  if (!fullname) {
    setFieldError('regFullname', 'errRegFullname', 'Họ và tên không được để trống');
    hasError = true;
  } else if (fullname.length < 2) {
    setFieldError('regFullname', 'errRegFullname', 'Họ và tên phải có ít nhất 2 ký tự');
    hasError = true;
  } else if (fullname.length > 100) {
    setFieldError('regFullname', 'errRegFullname', 'Họ và tên không được vượt quá 100 ký tự');
    hasError = true;
  } else {
    clearFieldError('regFullname', 'errRegFullname');
  }

  // Mã sinh viên
  const members = DB.get('members');
  const svIdRegex = /^SV\d{3,10}$/i;
  if (!studentId) {
    setFieldError('regStudentId', 'errRegStudentId', 'Mã sinh viên không được để trống');
    hasError = true;
  } else if (!svIdRegex.test(studentId)) {
    setFieldError('regStudentId', 'errRegStudentId', 'Mã sinh viên không hợp lệ (VD: SV2024001)');
    hasError = true;
  } else if (members.some(m => m.code.toLowerCase() === studentId.toLowerCase())) {
    setFieldError('regStudentId', 'errRegStudentId', 'Mã sinh viên đã được đăng ký trong hệ thống');
    hasError = true;
  } else {
    clearFieldError('regStudentId', 'errRegStudentId');
  }

  // Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    setFieldError('regEmail', 'errRegEmail', 'Email không được để trống');
    hasError = true;
  } else if (!emailRegex.test(email)) {
    setFieldError('regEmail', 'errRegEmail', 'Email không đúng định dạng (VD: user@example.com)');
    hasError = true;
  } else if (members.some(m => m.email.toLowerCase() === email.toLowerCase())) {
    setFieldError('regEmail', 'errRegEmail', 'Email đã được đăng ký trong hệ thống');
    hasError = true;
  } else {
    clearFieldError('regEmail', 'errRegEmail');
  }

  // Số điện thoại
  const phoneRegex = /^(0|\+84)[3-9]\d{8}$/;
  if (!phone) {
    setFieldError('regPhone', 'errRegPhone', 'Số điện thoại không được để trống');
    hasError = true;
  } else if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    setFieldError('regPhone', 'errRegPhone', 'Số điện thoại không hợp lệ (VD: 0901234567)');
    hasError = true;
  } else {
    clearFieldError('regPhone', 'errRegPhone');
  }

  // Tên đăng nhập
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  const accounts = DB.get('accounts');
  if (!username) {
    setFieldError('regUsername', 'errRegUsername', 'Tên đăng nhập không được để trống');
    hasError = true;
  } else if (!usernameRegex.test(username)) {
    setFieldError('regUsername', 'errRegUsername', 'Tên đăng nhập chỉ được dùng chữ, số, dấu _ và từ 3-30 ký tự');
    hasError = true;
  } else if (accounts.some(a => a.username.toLowerCase() === username.toLowerCase())) {
    setFieldError('regUsername', 'errRegUsername', 'Tên đăng nhập đã được sử dụng, vui lòng chọn tên khác');
    hasError = true;
  } else {
    clearFieldError('regUsername', 'errRegUsername');
  }

  // Mật khẩu
  if (!password) {
    setFieldError('regPassword', 'errRegPassword', 'Mật khẩu không được để trống');
    hasError = true;
  } else if (password.length < 6) {
    setFieldError('regPassword', 'errRegPassword', 'Mật khẩu phải có ít nhất 6 ký tự');
    hasError = true;
  } else if (password.length > 100) {
    setFieldError('regPassword', 'errRegPassword', 'Mật khẩu không được vượt quá 100 ký tự');
    hasError = true;
  } else {
    clearFieldError('regPassword', 'errRegPassword');
  }

  // Xác nhận mật khẩu
  if (!confirmPassword) {
    setFieldError('regConfirmPassword', 'errRegConfirmPassword', 'Vui lòng nhập lại mật khẩu');
    hasError = true;
  } else if (confirmPassword !== password) {
    setFieldError('regConfirmPassword', 'errRegConfirmPassword', 'Mật khẩu xác nhận không khớp');
    hasError = true;
  } else {
    clearFieldError('regConfirmPassword', 'errRegConfirmPassword');
  }

  // Điều khoản
  if (!terms) {
    const errTerms = document.getElementById('errRegTerms');
    if (errTerms) { errTerms.textContent = '⚠ Bạn phải đồng ý với điều khoản sử dụng để tiếp tục'; errTerms.classList.remove('hidden'); }
    hasError = true;
  }

  if (hasError) return;

  // ---- Submit ----
  const btn = document.getElementById('registerBtn');
  btn.innerHTML = '<span>Đang xử lý...</span>';
  btn.disabled = true;

  setTimeout(() => {
    try {
      const now = new Date().toISOString().split('T')[0];
      const newMemberId = 'm' + Date.now();
      const newAccountId = 'acc' + Date.now();

      // Tạo thành viên mới
      const newMember = {
        id: newMemberId,
        code: studentId.toUpperCase(),
        name: fullname,
        email: email,
        phone: phone,
        address: '',
        joinDate: now,
        status: 'active',
      };
      const updatedMembers = [...DB.get('members'), newMember];
      DB.set('members', updatedMembers);

      // Tạo tài khoản mới
      const newAccount = {
        id: newAccountId,
        username: username,
        password: password,
        fullname: fullname,
        email: email,
        role: 'Member',
        memberId: newMemberId,
        status: 'active',
        createdAt: now,
      };
      const updatedAccounts = [...DB.get('accounts'), newAccount];
      DB.set('accounts', updatedAccounts);

      // Show success
      const sucBox = document.getElementById('registerSuccess');
      sucBox.innerHTML = `✅ Đăng ký thành công! Tài khoản <strong>${username}</strong> đã được tạo. Bạn có thể đăng nhập ngay.`;
      sucBox.classList.remove('hidden');

      btn.innerHTML = '<span>Đăng ký thành công</span><span>✅</span>';
      btn.disabled = true;

      showToast('Đăng ký tài khoản thành công!', 'success');

      // Tự động chuyển về login sau 2.5s
      setTimeout(() => {
        showLoginForm();
        document.getElementById('loginUsername').value = username;
        showToast('Vui lòng đăng nhập để tiếp tục', 'info');
      }, 2500);

    } catch (err) {
      const errBox = document.getElementById('registerError');
      errBox.textContent = '❌ Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại.';
      errBox.classList.remove('hidden');
      btn.innerHTML = '<span>Tạo tài khoản</span><span>✨</span>';
      btn.disabled = false;
    }
  }, 700);
}

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

// ==================== DASHBOARD ====================
function renderDashboard() {
  const role = currentUser.role;
  if (role === 'Admin') renderAdminDashboard();
  else if (role === 'Librarian') renderLibrarianDashboard();
  else renderMemberDashboard();
}

function renderAdminDashboard() {
  const books = DB.get('books');
  const members = DB.get('members');
  const borrows = DB.get('borrows');
  const accounts = DB.get('accounts');
  const today = new Date().toISOString().split('T')[0];

  const activeBorrows = borrows.filter(b => b.status === 'borrowing' || b.status === 'overdue');
  const overdue = borrows.filter(b => !b.returnDate && b.dueDate < today && b.status !== 'returned');
  const totalFine = borrows.reduce((s, b) => s + (b.fine || 0), 0);
  const returnedToday = borrows.filter(b => b.returnDate === today).length;

  const recentActivity = borrows.slice(-5).reverse().map(b => {
    const member = DB.get('members').find(m => m.id === b.memberId);
    return { title: `${member ? member.name : '?'} – ${b.status === 'returned' ? 'Trả sách' : 'Mượn sách'}`, time: b.returnDate || b.borrowDate, icon: b.status === 'returned' ? '🔄' : '📖', color: b.status === 'returned' ? 'green' : 'blue' };
  });

  // Borrow stats by month (last 7 months)
  const monthStats = getLast7MonthBorrows(borrows);

  document.getElementById('pageContent').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon blue">📚</div>
        <div class="stat-info">
          <div class="stat-value">${books.length}</div>
          <div class="stat-label">Tổng số đầu sách</div>
          <div class="stat-change up">↑ ${books.filter(b => b.status === 'available').length} có sẵn</div>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green">👥</div>
        <div class="stat-info">
          <div class="stat-value">${members.filter(m => m.status === 'active').length}</div>
          <div class="stat-label">Thành viên hoạt động</div>
          <div class="stat-change up">/ ${members.length} tổng</div>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon purple">📖</div>
        <div class="stat-info">
          <div class="stat-value">${activeBorrows.length}</div>
          <div class="stat-label">Đang được mượn</div>
          <div class="stat-change up">Hôm nay: +${returnedToday} trả</div>
        </div>
      </div>
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdue.length}</div>
          <div class="stat-label">Quá hạn</div>
          <div class="stat-change down">${overdue.length > 0 ? '⚠️ Cần xử lý' : '✅ Tốt'}</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">💰</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(totalFine)}</div>
          <div class="stat-label">Tổng tiền phạt thu</div>
          <div class="stat-change up">Từ ${borrows.filter(b => b.fine > 0).length} phiếu</div>
        </div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon teal">🔐</div>
        <div class="stat-info">
          <div class="stat-value">${accounts.length}</div>
          <div class="stat-label">Tài khoản hệ thống</div>
          <div class="stat-change up">${accounts.filter(a => a.status === 'locked').length} bị khóa</div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">📊 Lượt mượn 7 tháng gần đây</div>
            <div class="card-subtitle">Thống kê theo tháng</div>
          </div>
        </div>
        <div class="chart-bar-container" id="borrowChart"></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">🕐 Hoạt động gần đây</div>
        </div>
        <div class="activity-list">
          ${recentActivity.map(a => `
            <div class="activity-item">
              <div class="activity-icon" style="background:rgba(${a.color === 'green' ? '16,185,129' : '79,142,247'},0.15)">${a.icon}</div>
              <div class="activity-text">
                <div class="activity-title">${a.title}</div>
              </div>
              <div class="activity-time">${fmtDate(a.time)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📚 Sách được mượn nhiều nhất</div>
        </div>
        ${getTopBorrowedBooks(borrows, 5)}
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">⚠️ Phiếu quá hạn</div>
          ${overdue.length > 0 ? `<span class="badge badge-overdue">${overdue.length}</span>` : ''}
        </div>
        ${renderOverdueList(overdue)}
      </div>
    </div>
  `;

  // Render chart
  setTimeout(() => renderBorrowChart(monthStats), 100);
}

function renderLibrarianDashboard() {
  const books = DB.get('books');
  const members = DB.get('members');
  const borrows = DB.get('borrows');
  const today = new Date().toISOString().split('T')[0];
  const todayBorrows = borrows.filter(b => b.borrowDate === today).length;
  const todayReturns = borrows.filter(b => b.returnDate === today).length;
  const overdue = borrows.filter(b => !b.returnDate && b.dueDate < today && b.status !== 'returned');

  document.getElementById('pageContent').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon blue">📖</div>
        <div class="stat-info">
          <div class="stat-value">${todayBorrows}</div>
          <div class="stat-label">Mượn hôm nay</div>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green">🔄</div>
        <div class="stat-info">
          <div class="stat-value">${todayReturns}</div>
          <div class="stat-label">Trả hôm nay</div>
        </div>
      </div>
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdue.length}</div>
          <div class="stat-label">Quá hạn chưa trả</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">📚</div>
        <div class="stat-info">
          <div class="stat-value">${books.filter(b => b.available > 0).length}</div>
          <div class="stat-label">Đầu sách có sẵn</div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">⚡ Thao tác nhanh</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <button class="btn btn-primary" onclick="navigateTo('borrow-process')" style="padding:20px;flex-direction:column;height:auto;gap:8px;">
            <span style="font-size:28px;">📖</span>
            <span>Mượn sách</span>
          </button>
          <button class="btn btn-success" onclick="navigateTo('return-process')" style="padding:20px;flex-direction:column;height:auto;gap:8px;">
            <span style="font-size:28px;">🔄</span>
            <span>Trả sách</span>
          </button>
          <button class="btn btn-secondary" onclick="navigateTo('books')" style="padding:20px;flex-direction:column;height:auto;gap:8px;">
            <span style="font-size:28px;">📚</span>
            <span>Kho sách</span>
          </button>
          <button class="btn btn-secondary" onclick="navigateTo('members')" style="padding:20px;flex-direction:column;height:auto;gap:8px;">
            <span style="font-size:28px;">👥</span>
            <span>Thành viên</span>
          </button>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">⚠️ Phiếu quá hạn</div>
          ${overdue.length > 0 ? `<span class="badge badge-overdue">${overdue.length}</span>` : ''}
        </div>
        ${renderOverdueList(overdue)}
      </div>
    </div>
  `;
}

function renderMemberDashboard() {
  const borrows = DB.get('borrows');
  const members = DB.get('members');
  const member = members.find(m => m.id === currentUser.memberId);
  const myBorrows = borrows.filter(b => b.memberId === (member ? member.id : ''));
  const today = new Date().toISOString().split('T')[0];
  const activeBorrows = myBorrows.filter(b => !b.returnDate);
  const overdueBorrows = myBorrows.filter(b => !b.returnDate && b.dueDate < today);
  const totalFine = myBorrows.reduce((s, b) => s + (b.fine || 0), 0);

  document.getElementById('pageContent').innerHTML = `
    <div style="margin-bottom:24px;">
      <div class="card" style="background:linear-gradient(135deg,rgba(79,142,247,0.1),rgba(139,92,246,0.05));border-color:rgba(79,142,247,0.2);">
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--grad-blue);display:flex;align-items:center;justify-content:center;font-size:28px;">🎓</div>
          <div>
            <div style="font-size:22px;font-weight:700;">${member ? member.name : currentUser.fullname}</div>
            <div style="color:var(--text-secondary);">Mã SV: ${member ? member.code : '—'} &nbsp;|&nbsp; ${member ? member.email : currentUser.email}</div>
            <div class="badge badge-active" style="margin-top:6px;">✅ Thành viên hoạt động</div>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon blue">📖</div>
        <div class="stat-info">
          <div class="stat-value">${activeBorrows.length}</div>
          <div class="stat-label">Đang mượn</div>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green">✅</div>
        <div class="stat-info">
          <div class="stat-value">${myBorrows.filter(b => b.returnDate).length}</div>
          <div class="stat-label">Đã trả</div>
        </div>
      </div>
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdueBorrows.length}</div>
          <div class="stat-label">Quá hạn</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">💰</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(totalFine)}</div>
          <div class="stat-label">Tổng tiền phạt</div>
        </div>
      </div>
    </div>

    ${overdueBorrows.length > 0 ? `
      <div class="alert-box alert-danger">
        ⚠️ Bạn có <strong>${overdueBorrows.length}</strong> phiếu mượn quá hạn! Vui lòng trả sách ngay để tránh phạt thêm.
      </div>
    ` : ''}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📋 Sách đang mượn</div>
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('my-borrows')">Xem tất cả</button>
        </div>
        ${activeBorrows.length === 0 ? `
          <div class="empty-state" style="padding:30px 20px;">
            <div class="empty-icon">📭</div>
            <div>Bạn chưa mượn sách nào</div>
          </div>
        ` : activeBorrows.slice(0, 3).map(b => {
    const books = DB.get('books');
    const bookTitles = b.bookIds.map(id => books.find(bk => bk.id === id)?.title || '?').join(', ');
    const isOverdue = b.dueDate < today;
    return `
            <div class="activity-item" style="border:1px solid ${isOverdue ? 'rgba(244,63,94,0.2)' : 'var(--border)'};border-radius:8px;margin-bottom:8px;padding:12px;">
              <div class="activity-icon" style="background:${isOverdue ? 'rgba(244,63,94,0.1)' : 'rgba(79,142,247,0.1)'};">${isOverdue ? '⚠️' : '📖'}</div>
              <div class="activity-text">
                <div class="activity-title">${bookTitles}</div>
                <div class="activity-subtitle">Hạn trả: ${fmtDate(b.dueDate)} ${isOverdue ? '<span style="color:var(--accent-rose);">– QUÁ HẠN</span>' : ''}</div>
              </div>
            </div>
          `;
  }).join('')}
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">📚 Sách mới nhất</div>
          <button class="btn btn-primary btn-sm" onclick="navigateTo('books')">Tìm sách</button>
        </div>
        ${DB.get('books').slice(-4).map(b => {
    const cat = DB.get('categories').find(c => c.id === b.categoryId);
    return `
            <div class="activity-item" style="cursor:pointer;" onclick="showBookDetail('${b.id}')">
              <div class="activity-icon" style="background:rgba(139,92,246,0.1);">📗</div>
              <div class="activity-text">
                <div class="activity-title">${b.title}</div>
                <div class="activity-subtitle">${cat?.name || ''} · ${b.available > 0 ? '<span style="color:var(--accent-green)">Có sẵn</span>' : '<span style="color:var(--accent-rose)">Hết</span>'}</div>
              </div>
            </div>
          `;
  }).join('')}
      </div>
    </div>
  `;
}

// ==================== BOOKS ====================
let bookFilter = { search: '', category: '', status: '' };

function renderBooks() {
  const canEdit = currentUser.role === 'Admin' || currentUser.role === 'Librarian';
  const isStudent = currentUser.role === 'Member';
  const categories = DB.get('categories');

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">${isStudent ? '🔍 Tìm kiếm Sách' : '📚 Quản lý Sách'}</div>
        <div class="section-subtitle">${isStudent ? 'Tìm và xem thông tin sách trong thư viện' : 'Thêm, sửa, quản lý kho sách'}</div>
      </div>
      ${canEdit ? `<button class="btn btn-primary" onclick="openBookModal()">+ Thêm sách mới</button>` : ''}
    </div>

    <div class="filters-bar">
      <div class="search-input-group" style="flex:2;min-width:200px;">
        <span class="search-icon">🔍</span>
        <input class="form-control" type="text" id="bookSearchInput" placeholder="Tìm theo tên sách, ISBN, tác giả..." oninput="filterBooks()" value="${bookFilter.search}" />
      </div>
      <select class="form-control" id="bookCatFilter" onchange="filterBooks()" style="flex:1;min-width:150px;max-width:200px;">
        <option value="">Tất cả danh mục</option>
        ${categories.map(c => `<option value="${c.id}" ${bookFilter.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
      </select>
      ${!isStudent ? `
        <select class="form-control" id="bookStatusFilter" onchange="filterBooks()" style="flex:1;min-width:130px;max-width:180px;">
          <option value="">Tất cả trạng thái</option>
          <option value="available" ${bookFilter.status === 'available' ? 'selected' : ''}>Có sẵn</option>
          <option value="borrowed" ${bookFilter.status === 'borrowed' ? 'selected' : ''}>Đang mượn</option>
          <option value="damaged" ${bookFilter.status === 'damaged' ? 'selected' : ''}>Hỏng</option>
          <option value="lost" ${bookFilter.status === 'lost' ? 'selected' : ''}>Mất</option>
        </select>
      ` : ''}
    </div>

    <div id="booksDisplay"></div>
  `;

  filterBooks();
}

function filterBooks() {
  const search = (document.getElementById('bookSearchInput')?.value || '').toLowerCase();
  const category = document.getElementById('bookCatFilter')?.value || '';
  const status = document.getElementById('bookStatusFilter')?.value || '';
  bookFilter = { search, category, status };

  const books = DB.get('books');
  const authors = DB.get('authors');
  const categories = DB.get('categories');
  const isStudent = currentUser.role === 'Member';

  let filtered = books.filter(b => {
    const author = authors.find(a => a.id === b.authorId);
    const matchSearch = !search ||
      b.title.toLowerCase().includes(search) ||
      b.isbn.toLowerCase().includes(search) ||
      (author?.name.toLowerCase().includes(search));
    const matchCat = !category || b.categoryId === category;
    const matchStatus = !status || b.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  const display = document.getElementById('booksDisplay');
  if (!display) return;

  if (filtered.length === 0) {
    display.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><h3>Không tìm thấy sách</h3><p>Thử thay đổi từ khóa hoặc bộ lọc</p></div>`;
    return;
  }

  if (isStudent) {
    display.innerHTML = `<div class="book-grid">${filtered.map((b, i) => {
      const author = authors.find(a => a.id === b.authorId);
      const cat = categories.find(c => c.id === b.categoryId);
      const coverClass = 'book-cover-' + ((i % 6) + 1);
      const badgeClass = b.available > 0 ? 'badge-available' : 'badge-borrowed';
      const badgeText = b.available > 0 ? '✅ Có sẵn' : '❌ Hết';
      return `
        <div class="book-card" onclick="showBookDetail('${b.id}')">
          <div class="book-cover ${coverClass}">
            📗
            <span class="book-status-badge badge ${badgeClass}" style="font-size:9px;padding:2px 6px;">${badgeText}</span>
          </div>
          <div class="book-info">
            <div class="book-title">${b.title}</div>
            <div class="book-author">${author?.name || '—'}</div>
            <div class="book-category">${cat?.name || '—'}</div>
          </div>
        </div>
      `;
    }).join('')}</div>`;
  } else {
    const canEdit = currentUser.role === 'Admin' || currentUser.role === 'Librarian';
    display.innerHTML = `
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Danh mục</th>
              <th>Năm</th>
              <th>SL</th>
              <th>Có sẵn</th>
              <th>Trạng thái</th>
              ${canEdit ? '<th>Hành động</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${filtered.map(b => {
      const author = authors.find(a => a.id === b.authorId);
      const cat = categories.find(c => c.id === b.categoryId);
      const badgeMap = { available: 'badge-available', borrowed: 'badge-borrowed', damaged: 'badge-damaged', lost: 'badge-lost' };
      const labelMap = { available: '✅ Có sẵn', borrowed: '📖 Đang mượn', damaged: '🔧 Hỏng', lost: '❌ Mất' };
      return `
                <tr>
                  <td><code style="font-family:var(--mono);font-size:11px;color:var(--text-muted)">${b.isbn}</code></td>
                  <td><strong style="cursor:pointer;color:var(--accent-blue);" onclick="showBookDetail('${b.id}')">${b.title}</strong></td>
                  <td>${author?.name || '—'}</td>
                  <td>${cat?.name || '—'}</td>
                  <td>${b.year || '—'}</td>
                  <td>${b.quantity || 1}</td>
                  <td><strong style="color:${b.available > 0 ? 'var(--accent-green)' : 'var(--accent-rose)'}">${b.available}</strong></td>
                  <td><span class="badge ${badgeMap[b.status] || 'badge-available'}">${labelMap[b.status] || b.status}</span></td>
                  ${canEdit ? `
                    <td>
                      <div style="display:flex;gap:6px;">
                        <button class="btn btn-secondary btn-sm" onclick="openBookModal('${b.id}')">✏️</button>
                        <button class="btn btn-danger btn-sm" onclick="confirmDeleteBook('${b.id}')">🗑️</button>
                      </div>
                    </td>
                  ` : ''}
                </tr>
              `;
    }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

function openBookModal(bookId = null) {
  const modal = document.getElementById('modalBook');
  const authors = DB.get('authors');
  const categories = DB.get('categories');

  document.getElementById('bookAuthor').innerHTML = authors.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  document.getElementById('bookCategory').innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  if (bookId) {
    const book = DB.get('books').find(b => b.id === bookId);
    if (!book) return;
    document.getElementById('modalBookTitle').textContent = '✏️ Chỉnh sửa sách';
    document.getElementById('bookISBN').value = book.isbn;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.authorId;
    document.getElementById('bookCategory').value = book.categoryId;
    document.getElementById('bookYear').value = book.year || '';
    document.getElementById('bookQuantity').value = book.quantity || 1;
    document.getElementById('bookDescription').value = book.description || '';
    document.getElementById('bookStatus').value = book.status || 'available';
    document.getElementById('bookEditId').value = bookId;
    document.getElementById('bookStatusGroup').style.display = '';
  } else {
    document.getElementById('modalBookTitle').textContent = '+ Thêm sách mới';
    document.getElementById('formBook').reset();
    document.getElementById('bookEditId').value = '';
    document.getElementById('bookStatusGroup').style.display = 'none';
  }

  openModal('modalBook');
}

function saveBook(e) {
  e.preventDefault();
  const books = DB.get('books');
  const editId = document.getElementById('bookEditId').value;
  const qty = parseInt(document.getElementById('bookQuantity').value) || 1;

  const data = {
    isbn: document.getElementById('bookISBN').value.trim(),
    title: document.getElementById('bookTitle').value.trim(),
    authorId: document.getElementById('bookAuthor').value,
    categoryId: document.getElementById('bookCategory').value,
    year: parseInt(document.getElementById('bookYear').value) || null,
    quantity: qty,
    description: document.getElementById('bookDescription').value.trim(),
  };

  if (editId) {
    const idx = books.findIndex(b => b.id === editId);
    if (idx >= 0) {
      const oldBook = books[idx];
      const diff = qty - oldBook.quantity;
      books[idx] = { ...oldBook, ...data, available: Math.max(0, (oldBook.available || 0) + diff), status: document.getElementById('bookStatus').value };
    }
    showToast('Đã cập nhật sách thành công', 'success');
  } else {
    data.id = 'b' + Date.now();
    data.available = qty;
    data.status = 'available';
    books.push(data);
    showToast('Đã thêm sách thành công', 'success');
  }

  DB.set('books', books);
  closeModal('modalBook');
  renderBooks();
}

function confirmDeleteBook(bookId) {
  const book = DB.get('books').find(b => b.id === bookId);
  showConfirm(`Bạn có chắc muốn xóa sách "${book?.title}"?`, () => {
    const books = DB.get('books').filter(b => b.id !== bookId);
    DB.set('books', books);
    showToast('Đã xóa sách', 'success');
    renderBooks();
  });
}

function showBookDetail(bookId) {
  const book = DB.get('books').find(b => b.id === bookId);
  if (!book) return;
  const author = DB.get('authors').find(a => a.id === book.authorId);
  const cat = DB.get('categories').find(c => c.id === book.categoryId);
  const borrows = DB.get('borrows').filter(b => b.bookIds.includes(bookId));
  const badgeMap = { available: 'badge-available', borrowed: 'badge-borrowed', damaged: 'badge-damaged', lost: 'badge-lost' };
  const labelMap = { available: '✅ Có sẵn', borrowed: '📖 Đang mượn', damaged: '🔧 Hỏng', lost: '❌ Mất' };

  document.getElementById('bookDetailContent').innerHTML = `
    <div style="display:flex;gap:24px;margin-bottom:24px;flex-wrap:wrap;">
      <div style="width:120px;height:160px;border-radius:12px;background:linear-gradient(135deg,#1e3a5f,#2d6a9f);display:flex;align-items:center;justify-content:center;font-size:52px;flex-shrink:0;">📗</div>
      <div style="flex:1;min-width:200px;">
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">${book.title}</h2>
        <div style="margin-bottom:16px;">
          <span class="badge ${badgeMap[book.status]}">${labelMap[book.status]}</span>
        </div>
        <div class="info-row"><span class="info-label">ISBN</span><span class="info-value" style="font-family:monospace;">${book.isbn}</span></div>
        <div class="info-row"><span class="info-label">Tác giả</span><span class="info-value">${author?.name || '—'}</span></div>
        <div class="info-row"><span class="info-label">Danh mục</span><span class="info-value">${cat?.name || '—'}</span></div>
        <div class="info-row"><span class="info-label">Năm xuất bản</span><span class="info-value">${book.year || '—'}</span></div>
        <div class="info-row"><span class="info-label">Số lượng</span><span class="info-value">${book.quantity}</span></div>
        <div class="info-row"><span class="info-label">Còn lại</span><span class="info-value" style="color:${book.available > 0 ? 'var(--accent-green)' : 'var(--accent-rose)'};font-weight:700;">${book.available}</span></div>
      </div>
    </div>
    ${book.description ? `<div class="divider"></div><p style="color:var(--text-secondary);font-size:13px;line-height:1.7;">${book.description}</p>` : ''}
    <div class="divider"></div>
    <div style="font-size:13px;color:var(--text-secondary);">Đã được mượn: <strong style="color:var(--text-primary)">${borrows.length} lần</strong></div>
  `;
  openModal('modalBookDetail');
}

// ==================== CATEGORIES ====================
function renderCategories() {
  const categories = DB.get('categories');
  const books = DB.get('books');

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">🏷️ Danh mục Sách</div>
        <div class="section-subtitle">Quản lý phân loại sách trong thư viện</div>
      </div>
      <button class="btn btn-primary" onclick="openCategoryModal()">+ Thêm danh mục</button>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>#</th><th>Tên danh mục</th><th>Mô tả</th><th>Số sách</th><th>Hành động</th></tr></thead>
        <tbody>
          ${categories.map((c, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><strong>${c.name}</strong></td>
              <td style="color:var(--text-secondary)">${c.description || '—'}</td>
              <td>${books.filter(b => b.categoryId === c.id).length}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-secondary btn-sm" onclick="openCategoryModal('${c.id}')">✏️ Sửa</button>
                  <button class="btn btn-danger btn-sm" onclick="confirmDeleteCategory('${c.id}')">🗑️</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openCategoryModal(catId = null) {
  if (catId) {
    const cat = DB.get('categories').find(c => c.id === catId);
    document.getElementById('modalCategoryTitle').textContent = '✏️ Sửa danh mục';
    document.getElementById('categoryName').value = cat.name;
    document.getElementById('categoryDesc').value = cat.description || '';
    document.getElementById('categoryEditId').value = catId;
  } else {
    document.getElementById('modalCategoryTitle').textContent = '+ Thêm danh mục';
    document.getElementById('formCategory').reset();
    document.getElementById('categoryEditId').value = '';
  }
  openModal('modalCategory');
}

function saveCategory(e) {
  e.preventDefault();
  const cats = DB.get('categories');
  const editId = document.getElementById('categoryEditId').value;
  const data = { name: document.getElementById('categoryName').value.trim(), description: document.getElementById('categoryDesc').value.trim() };

  if (editId) {
    const idx = cats.findIndex(c => c.id === editId);
    if (idx >= 0) cats[idx] = { ...cats[idx], ...data };
    showToast('Đã cập nhật danh mục', 'success');
  } else {
    cats.push({ id: 'cat' + Date.now(), ...data });
    showToast('Đã thêm danh mục', 'success');
  }
  DB.set('categories', cats);
  closeModal('modalCategory');
  renderCategories();
}

function confirmDeleteCategory(id) {
  const cat = DB.get('categories').find(c => c.id === id);
  showConfirm(`Xóa danh mục "${cat?.name}"?`, () => {
    DB.set('categories', DB.get('categories').filter(c => c.id !== id));
    showToast('Đã xóa danh mục', 'success');
    renderCategories();
  });
}

// ==================== AUTHORS ====================
function renderAuthors() {
  const authors = DB.get('authors');
  const books = DB.get('books');

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">✍️ Tác giả</div>
        <div class="section-subtitle">Quản lý danh sách tác giả</div>
      </div>
      <button class="btn btn-primary" onclick="openAuthorModal()">+ Thêm tác giả</button>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>#</th><th>Tên tác giả</th><th>Quốc tịch</th><th>Tiểu sử</th><th>Số sách</th><th>Hành động</th></tr></thead>
        <tbody>
          ${authors.map((a, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><strong>${a.name}</strong></td>
              <td>${a.nationality || '—'}</td>
              <td style="color:var(--text-secondary);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a.bio || '—'}</td>
              <td>${books.filter(b => b.authorId === a.id).length}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-secondary btn-sm" onclick="openAuthorModal('${a.id}')">✏️ Sửa</button>
                  <button class="btn btn-danger btn-sm" onclick="confirmDeleteAuthor('${a.id}')">🗑️</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openAuthorModal(authorId = null) {
  if (authorId) {
    const a = DB.get('authors').find(x => x.id === authorId);
    document.getElementById('modalAuthorTitle').textContent = '✏️ Sửa tác giả';
    document.getElementById('authorName').value = a.name;
    document.getElementById('authorNationality').value = a.nationality || '';
    document.getElementById('authorBio').value = a.bio || '';
    document.getElementById('authorEditId').value = authorId;
  } else {
    document.getElementById('modalAuthorTitle').textContent = '+ Thêm tác giả';
    document.getElementById('formAuthor').reset();
    document.getElementById('authorEditId').value = '';
  }
  openModal('modalAuthor');
}

function saveAuthor(e) {
  e.preventDefault();
  const authors = DB.get('authors');
  const editId = document.getElementById('authorEditId').value;
  const data = { name: document.getElementById('authorName').value.trim(), nationality: document.getElementById('authorNationality').value.trim(), bio: document.getElementById('authorBio').value.trim() };

  if (editId) {
    const idx = authors.findIndex(a => a.id === editId);
    if (idx >= 0) authors[idx] = { ...authors[idx], ...data };
    showToast('Đã cập nhật tác giả', 'success');
  } else {
    authors.push({ id: 'au' + Date.now(), ...data });
    showToast('Đã thêm tác giả', 'success');
  }
  DB.set('authors', authors);
  closeModal('modalAuthor');
  renderAuthors();
}

function confirmDeleteAuthor(id) {
  const a = DB.get('authors').find(x => x.id === id);
  showConfirm(`Xóa tác giả "${a?.name}"?`, () => {
    DB.set('authors', DB.get('authors').filter(x => x.id !== id));
    showToast('Đã xóa tác giả', 'success');
    renderAuthors();
  });
}

// ==================== MEMBERS ====================
function renderMembers() {
  const members = DB.get('members');
  const borrows = DB.get('borrows');
  const today = new Date().toISOString().split('T')[0];
  let searchVal = '';

  const renderTable = (list) => {
    if (list.length === 0) return `<div class="empty-state"><div class="empty-icon">👥</div><h3>Không tìm thấy thành viên</h3></div>`;
    return `
      <div class="table-container">
        <table>
          <thead><tr><th>Mã SV</th><th>Họ tên</th><th>Email</th><th>Điện thoại</th><th>Ngày tham gia</th><th>Đang mượn</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            ${list.map(m => {
      const activeBorrows = borrows.filter(b => b.memberId === m.id && !b.returnDate).length;
      const overdue = borrows.filter(b => b.memberId === m.id && !b.returnDate && b.dueDate < today).length;
      return `
                <tr>
                  <td><code style="color:var(--accent-blue)">${m.code}</code></td>
                  <td><strong>${m.name}</strong></td>
                  <td style="color:var(--text-secondary)">${m.email}</td>
                  <td>${m.phone || '—'}</td>
                  <td>${fmtDate(m.joinDate)}</td>
                  <td>
                    ${activeBorrows > 0 ? `<span class="badge badge-borrowed">${activeBorrows}</span>` : '—'}
                    ${overdue > 0 ? `<span class="badge badge-overdue" style="margin-left:4px;">${overdue} quá hạn</span>` : ''}
                  </td>
                  <td><span class="badge ${m.status === 'active' ? 'badge-active' : 'badge-locked'}">${m.status === 'active' ? '✅ Hoạt động' : '🔒 Khóa'}</span></td>
                  <td>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;">
                      <button class="btn btn-secondary btn-sm" onclick="openMemberModal('${m.id}')">✏️</button>
                      <button class="btn btn-sm ${m.status === 'active' ? 'btn-warning' : 'btn-success'}" onclick="toggleMemberStatus('${m.id}')">${m.status === 'active' ? '🔒' : '🔓'}</button>
                      <button class="btn btn-danger btn-sm" onclick="confirmDeleteMember('${m.id}')">🗑️</button>
                    </div>
                  </td>
                </tr>
              `;
    }).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">👥 Quản lý Thành viên</div>
        <div class="section-subtitle">Quản lý thẻ thành viên và tình trạng mượn sách</div>
      </div>
      <button class="btn btn-primary" onclick="openMemberModal()">+ Thêm thành viên</button>
    </div>
    <div class="filters-bar">
      <div class="search-input-group" style="flex:1;">
        <span class="search-icon">🔍</span>
        <input class="form-control" type="text" id="memberSearchInput" placeholder="Tìm theo tên, mã SV, email..." oninput="filterMembersDisplay()" />
      </div>
      <select class="form-control" id="memberStatusFilter" onchange="filterMembersDisplay()" style="max-width:160px;">
        <option value="">Tất cả</option>
        <option value="active">Hoạt động</option>
        <option value="locked">Bị khóa</option>
      </select>
    </div>
    <div id="membersTableContainer">${renderTable(members)}</div>
  `;

  window.filterMembersDisplay = () => {
    const search = document.getElementById('memberSearchInput').value.toLowerCase();
    const status = document.getElementById('memberStatusFilter').value;
    const filtered = members.filter(m =>
      (!search || m.name.toLowerCase().includes(search) || m.code.toLowerCase().includes(search) || m.email.toLowerCase().includes(search)) &&
      (!status || m.status === status)
    );
    document.getElementById('membersTableContainer').innerHTML = renderTable(filtered);
  };
}

function openMemberModal(memberId = null) {
  const infoEl = document.getElementById('memberAccountInfo');
  if (memberId) {
    const m = DB.get('members').find(x => x.id === memberId);
    document.getElementById('modalMemberTitle').textContent = '✏️ Sửa thông tin thành viên';
    document.getElementById('memberName').value = m.name;
    document.getElementById('memberCode').value = m.code;
    document.getElementById('memberEmail').value = m.email;
    document.getElementById('memberPhone').value = m.phone || '';
    document.getElementById('memberAddress').value = m.address || '';
    document.getElementById('memberEditId').value = memberId;
    infoEl.textContent = 'Tài khoản đã được tạo.';
  } else {
    document.getElementById('modalMemberTitle').textContent = '+ Thêm thành viên mới';
    document.getElementById('formMember').reset();
    document.getElementById('memberEditId').value = '';
    infoEl.textContent = 'Tài khoản sẽ được tạo tự động với mật khẩu mặc định: stu123';
  }
  openModal('modalMember');
}

function saveMember(e) {
  e.preventDefault();
  const members = DB.get('members');
  const editId = document.getElementById('memberEditId').value;
  const data = {
    name: document.getElementById('memberName').value.trim(),
    code: document.getElementById('memberCode').value.trim(),
    email: document.getElementById('memberEmail').value.trim(),
    phone: document.getElementById('memberPhone').value.trim(),
    address: document.getElementById('memberAddress').value.trim(),
  };

  if (editId) {
    const idx = members.findIndex(m => m.id === editId);
    if (idx >= 0) members[idx] = { ...members[idx], ...data };
    showToast('Đã cập nhật thành viên', 'success');
  } else {
    const newId = 'm' + Date.now();
    const accId = 'acc' + Date.now();
    const username = 'sv' + data.code.toLowerCase().replace(/\s/g, '');
    const newAcc = { id: accId, username, password: 'stu123', role: 'Member', fullname: data.name, email: data.email, status: 'active', createdAt: new Date().toISOString().split('T')[0], memberId: newId };
    const accounts = DB.get('accounts');
    accounts.push(newAcc);
    DB.set('accounts', accounts);
    members.push({ id: newId, ...data, joinDate: new Date().toISOString().split('T')[0], status: 'active', accountId: accId });
    showToast(`Đã thêm thành viên. Tài khoản: ${username} / stu123`, 'success');
  }
  DB.set('members', members);
  closeModal('modalMember');
  renderMembers();
}

function toggleMemberStatus(memberId) {
  const members = DB.get('members');
  const accounts = DB.get('accounts');
  const idx = members.findIndex(m => m.id === memberId);
  if (idx < 0) return;

  const newStatus = members[idx].status === 'active' ? 'locked' : 'active';
  members[idx].status = newStatus;
  DB.set('members', members);

  const accIdx = accounts.findIndex(a => a.memberId === memberId);
  if (accIdx >= 0) { accounts[accIdx].status = newStatus; DB.set('accounts', accounts); }

  showToast(`Đã ${newStatus === 'locked' ? 'khóa' : 'mở khóa'} tài khoản thành viên`, newStatus === 'locked' ? 'warning' : 'success');
  renderMembers();
}

function confirmDeleteMember(id) {
  const m = DB.get('members').find(x => x.id === id);
  showConfirm(`Xóa thành viên "${m?.name}"?`, () => {
    DB.set('members', DB.get('members').filter(x => x.id !== id));
    showToast('Đã xóa thành viên', 'success');
    renderMembers();
  });
}

// ==================== ACCOUNTS ====================
function renderAccounts() {
  const accounts = DB.get('accounts');

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">🔐 Quản lý Tài khoản</div>
        <div class="section-subtitle">Quản lý tài khoản và phân quyền hệ thống</div>
      </div>
      <button class="btn btn-primary" onclick="openAccountModal()">+ Thêm tài khoản</button>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>Username</th><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Ngày tạo</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
        <tbody>
          ${accounts.map(a => {
    const roleClasses = { Admin: 'badge-admin', Librarian: 'badge-librarian', Member: 'badge-member' };
    const roleLabels = { Admin: '👑 Admin', Librarian: '📚 Thủ thư', Member: '🎓 Sinh viên' };
    return `
              <tr>
                <td><code style="color:var(--accent-blue)">${a.username}</code></td>
                <td><strong>${a.fullname}</strong></td>
                <td style="color:var(--text-secondary)">${a.email || '—'}</td>
                <td><span class="badge ${roleClasses[a.role]}">${roleLabels[a.role]}</span></td>
                <td>${fmtDate(a.createdAt)}</td>
                <td><span class="badge ${a.status === 'active' ? 'badge-active' : 'badge-locked'}">${a.status === 'active' ? '✅ Hoạt động' : '🔒 Khóa'}</span></td>
                <td>
                  <div style="display:flex;gap:6px;">
                    <button class="btn btn-secondary btn-sm" onclick="openAccountModal('${a.id}')">✏️</button>
                    <button class="btn btn-sm ${a.status === 'active' ? 'btn-warning' : 'btn-success'}" onclick="toggleAccountStatus('${a.id}')">${a.status === 'active' ? '🔒' : '🔓'}</button>
                    ${a.username !== 'admin' ? `<button class="btn btn-danger btn-sm" onclick="confirmDeleteAccount('${a.id}')">🗑️</button>` : ''}
                  </div>
                </td>
              </tr>
            `;
  }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openAccountModal(accId = null) {
  if (accId) {
    const a = DB.get('accounts').find(x => x.id === accId);
    document.getElementById('modalAccountTitle').textContent = '✏️ Sửa tài khoản';
    document.getElementById('accountUsername').value = a.username;
    document.getElementById('accountFullname').value = a.fullname;
    document.getElementById('accountRole').value = a.role;
    document.getElementById('accountEmail').value = a.email || '';
    document.getElementById('accountPassword').value = '';
    document.getElementById('accountPassword').placeholder = '(Để trống = không đổi)';
    document.getElementById('accountEditId').value = accId;
  } else {
    document.getElementById('modalAccountTitle').textContent = '+ Thêm tài khoản';
    document.getElementById('formAccount').reset();
    document.getElementById('accountPassword').placeholder = '••••••••';
    document.getElementById('accountEditId').value = '';
  }
  openModal('modalAccount');
}

function saveAccount(e) {
  e.preventDefault();
  const accounts = DB.get('accounts');
  const editId = document.getElementById('accountEditId').value;
  const password = document.getElementById('accountPassword').value;
  const data = {
    username: document.getElementById('accountUsername').value.trim(),
    fullname: document.getElementById('accountFullname').value.trim(),
    role: document.getElementById('accountRole').value,
    email: document.getElementById('accountEmail').value.trim(),
  };
  if (password) data.password = password;

  if (editId) {
    const idx = accounts.findIndex(a => a.id === editId);
    if (idx >= 0) accounts[idx] = { ...accounts[idx], ...data };
    showToast('Đã cập nhật tài khoản', 'success');
  } else {
    if (!password) { showToast('Vui lòng nhập mật khẩu', 'error'); return; }
    accounts.push({ id: 'acc' + Date.now(), ...data, status: 'active', createdAt: new Date().toISOString().split('T')[0] });
    showToast('Đã tạo tài khoản mới', 'success');
  }
  DB.set('accounts', accounts);
  closeModal('modalAccount');
  renderAccounts();
}

function toggleAccountStatus(id) {
  const accounts = DB.get('accounts');
  const idx = accounts.findIndex(a => a.id === id);
  if (idx < 0) return;
  accounts[idx].status = accounts[idx].status === 'active' ? 'locked' : 'active';
  DB.set('accounts', accounts);
  showToast('Đã cập nhật trạng thái tài khoản', 'success');
  renderAccounts();
}

function confirmDeleteAccount(id) {
  const a = DB.get('accounts').find(x => x.id === id);
  showConfirm(`Xóa tài khoản "${a?.username}"?`, () => {
    DB.set('accounts', DB.get('accounts').filter(x => x.id !== id));
    showToast('Đã xóa tài khoản', 'success');
    renderAccounts();
  });
}

// ==================== BORROWS ====================
function renderBorrows() {
  const borrows = DB.get('borrows');
  const members = DB.get('members');
  const books = DB.get('books');
  const today = new Date().toISOString().split('T')[0];
  let activeTab = 'all';

  const renderBorrowTable = (list) => {
    if (list.length === 0) return `<div class="empty-state"><div class="empty-icon">📋</div><h3>Không có phiếu mượn</h3></div>`;
    return `
      <div class="table-container">
        <table>
          <thead><tr><th>Mã phiếu</th><th>Thành viên</th><th>Sách mượn</th><th>Ngày mượn</th><th>Hạn trả</th><th>Trả lúc</th><th>Trạng thái</th><th>Phạt</th></tr></thead>
          <tbody>
            ${list.map(b => {
      const member = members.find(m => m.id === b.memberId);
      const bookTitles = b.bookIds.map(id => books.find(bk => bk.id === id)?.title || '?').join(', ');
      const isOverdue = !b.returnDate && b.dueDate < today;
      const statusMap = {
        borrowing: '<span class="badge badge-borrowed">📖 Đang mượn</span>',
        returned: '<span class="badge badge-available">✅ Đã trả</span>',
        overdue: '<span class="badge badge-overdue">⚠️ Quá hạn</span>',
      };
      const status = isOverdue ? 'overdue' : (b.status || 'borrowing');
      return `
                <tr style="${isOverdue ? 'background:rgba(244,63,94,0.03);' : ''}">
                  <td><code style="font-size:11px;color:var(--accent-blue)">${b.id}</code></td>
                  <td><strong>${member?.name || '?'}</strong><br><small style="color:var(--text-muted)">${member?.code || ''}</small></td>
                  <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${bookTitles}">${bookTitles}</td>
                  <td>${fmtDate(b.borrowDate)}</td>
                  <td style="color:${isOverdue ? 'var(--accent-rose)' : 'inherit'};font-weight:${isOverdue ? '700' : '400'}">${fmtDate(b.dueDate)}</td>
                  <td>${b.returnDate ? fmtDate(b.returnDate) : '—'}</td>
                  <td>${statusMap[status] || statusMap['borrowing']}</td>
                  <td>${b.fine ? `<strong style="color:var(--accent-amber)">${fmtMoney(b.fine)}</strong>` : '—'}</td>
                </tr>
              `;
    }).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">📋 Danh sách Phiếu mượn</div>
        <div class="section-subtitle">Theo dõi tất cả giao dịch mượn/trả sách</div>
      </div>
      ${currentUser.role !== 'Member' ? `<button class="btn btn-primary" onclick="openModal('modalBorrow');initBorrowModal()">+ Tạo phiếu mượn</button>` : ''}
    </div>
    <div class="tabs">
      <button class="tab-btn active" id="tab-all" onclick="switchBorrowTab('all')">Tất cả (${borrows.length})</button>
      <button class="tab-btn" id="tab-borrowing" onclick="switchBorrowTab('borrowing')">Đang mượn (${borrows.filter(b => !b.returnDate && b.dueDate >= today).length})</button>
      <button class="tab-btn" id="tab-overdue" onclick="switchBorrowTab('overdue')">Quá hạn (${borrows.filter(b => !b.returnDate && b.dueDate < today).length})</button>
      <button class="tab-btn" id="tab-returned" onclick="switchBorrowTab('returned')">Đã trả (${borrows.filter(b => b.returnDate).length})</button>
    </div>
    <div id="borrowTableContainer">${renderBorrowTable(borrows)}</div>
  `;

  window.switchBorrowTab = (tab) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab)?.classList.add('active');
    let filtered;
    if (tab === 'all') filtered = borrows;
    else if (tab === 'borrowing') filtered = borrows.filter(b => !b.returnDate && b.dueDate >= today);
    else if (tab === 'overdue') filtered = borrows.filter(b => !b.returnDate && b.dueDate < today);
    else filtered = borrows.filter(b => b.returnDate);
    document.getElementById('borrowTableContainer').innerHTML = renderBorrowTable(filtered);
  };
}

// ==================== BORROW PROCESS ====================
function renderBorrowProcess() {
  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">📖 Mượn Sách</div>
        <div class="section-subtitle">Tạo phiếu mượn sách mới cho thành viên</div>
      </div>
    </div>
    <div class="card" style="max-width:700px;margin:0 auto;">
      <div class="card-header" style="margin-bottom:8px;">
        <div class="card-title">📝 Thông tin phiếu mượn</div>
      </div>
      <div style="color:var(--text-secondary);font-size:13px;margin-bottom:20px;">Điền thông tin bên dưới để tạo phiếu mượn sách mới.</div>
      <form onsubmit="processBorrowInline(event)">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Thành viên *</label>
            <select class="form-control" id="borrowMemberInline" required>
              <option value="">-- Chọn thành viên --</option>
              ${DB.get('members').filter(m => m.status === 'active').map(m => `<option value="${m.id}">${m.name} (${m.code})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Ngày hết hạn</label>
            <input class="form-control" type="date" id="borrowDueDateInline" value="${getDefaultDueDate()}" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Tìm & chọn sách *</label>
          <input class="form-control" type="text" id="borrowBookSearchInline" placeholder="Nhập tên sách hoặc ISBN..." oninput="searchBorrowBooksInline(this.value)" />
        </div>
        <div id="borrowBookListInline" style="max-height:220px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:16px;display:none;"></div>
        <div id="selectedBooksInline" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;"></div>
        <div id="borrowWarningInline"></div>
        <div style="display:flex;gap:12px;justify-content:flex-end;">
          <button type="button" class="btn btn-secondary" onclick="navigateTo('dashboard')">Hủy</button>
          <button type="submit" class="btn btn-success">✅ Xác nhận mượn</button>
        </div>
      </form>
    </div>
  `;

  window._selectedBorrowBooksInline = [];

  window.searchBorrowBooksInline = (val) => {
    const list = document.getElementById('borrowBookListInline');
    if (!val.trim()) { list.style.display = 'none'; return; }
    const books = DB.get('books').filter(b => b.available > 0 && (b.title.toLowerCase().includes(val.toLowerCase()) || b.isbn.includes(val)));
    if (books.length === 0) { list.innerHTML = '<div style="padding:12px;color:var(--text-muted);text-align:center;">Không tìm thấy sách có sẵn</div>'; list.style.display = ''; return; }
    list.style.display = '';
    list.innerHTML = books.map(b => `
      <div style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;transition:background 0.15s;" onmouseenter="this.style.background='rgba(79,142,247,0.05)'" onmouseleave="this.style.background=''" onclick="addBorrowBookInline('${b.id}')">
        <div>
          <div style="font-size:13px;font-weight:500;">${b.title}</div>
          <div style="font-size:11px;color:var(--text-muted);">ISBN: ${b.isbn} · Còn: ${b.available}</div>
        </div>
        <button type="button" class="btn btn-primary btn-sm">+ Chọn</button>
      </div>
    `).join('');
  };

  window.addBorrowBookInline = (bookId) => {
    const config = DB.getObj('config');
    if (window._selectedBorrowBooksInline.includes(bookId)) { showToast('Sách đã được chọn', 'warning'); return; }
    if (window._selectedBorrowBooksInline.length >= config.maxBooksPerMember) {
      showToast(`Tối đa ${config.maxBooksPerMember} sách mỗi lần mượn`, 'warning'); return;
    }
    window._selectedBorrowBooksInline.push(bookId);
    renderSelectedBooksInline();
    document.getElementById('borrowBookSearchInline').value = '';
    document.getElementById('borrowBookListInline').style.display = 'none';
  };

  window.removeBorrowBookInline = (bookId) => {
    window._selectedBorrowBooksInline = window._selectedBorrowBooksInline.filter(id => id !== bookId);
    renderSelectedBooksInline();
  };

  window.renderSelectedBooksInline = () => {
    const container = document.getElementById('selectedBooksInline');
    const books = DB.get('books');
    if (window._selectedBorrowBooksInline.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = window._selectedBorrowBooksInline.map(id => {
      const b = books.find(x => x.id === id);
      return `<div style="display:flex;align-items:center;gap:8px;background:rgba(79,142,247,0.1);border:1px solid rgba(79,142,247,0.2);border-radius:20px;padding:4px 12px;font-size:12px;">
        📗 ${b?.title || '?'}
        <span style="cursor:pointer;color:var(--accent-rose);font-weight:700;" onclick="removeBorrowBookInline('${id}')">×</span>
      </div>`;
    }).join('');
  };

  window.processBorrowInline = (e) => {
    e.preventDefault();
    const memberId = document.getElementById('borrowMemberInline').value;
    const dueDate = document.getElementById('borrowDueDateInline').value;
    if (!memberId) { showToast('Vui lòng chọn thành viên', 'error'); return; }
    if (window._selectedBorrowBooksInline.length === 0) { showToast('Vui lòng chọn ít nhất 1 sách', 'error'); return; }

    const books = DB.get('books');
    const borrows = DB.get('borrows');
    const config = DB.getObj('config');

    // Check member's current borrows
    const memberCurrentBorrows = borrows.filter(b => b.memberId === memberId && !b.returnDate);
    if (memberCurrentBorrows.length + window._selectedBorrowBooksInline.length > config.maxBooksPerMember) {
      showToast(`Thành viên đã mượn quá số lượng cho phép (${config.maxBooksPerMember} sách)`, 'error'); return;
    }

    // Create borrow
    const newBorrow = {
      id: 'br' + Date.now(),
      memberId,
      librarianId: currentUser.librarianId || 'lib1',
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || getDefaultDueDate(),
      returnDate: null,
      status: 'borrowing',
      note: '',
      fine: 0,
      bookIds: window._selectedBorrowBooksInline,
    };

    borrows.push(newBorrow);
    DB.set('borrows', borrows);

    // Update book availability
    window._selectedBorrowBooksInline.forEach(bookId => {
      const idx = books.findIndex(b => b.id === bookId);
      if (idx >= 0) {
        books[idx].available = Math.max(0, books[idx].available - 1);
        if (books[idx].available === 0) books[idx].status = 'borrowed';
      }
    });
    DB.set('books', books);

    showToast(`✅ Đã tạo phiếu mượn thành công! Mã: ${newBorrow.id}`, 'success');
    window._selectedBorrowBooksInline = [];
    navigateTo('borrows');
  };
}

// ==================== RETURN PROCESS ====================
function renderReturnProcess() {
  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">🔄 Trả Sách</div>
        <div class="section-subtitle">Xử lý trả sách và tính phí phạt nếu có</div>
      </div>
    </div>
    <div class="card" style="max-width:700px;margin:0 auto;">
      <div class="form-group">
        <label class="form-label">🔍 Tìm phiếu mượn (theo mã hoặc tên thành viên)</label>
        <input class="form-control" type="text" id="returnSearchInline" placeholder="Nhập mã phiếu hoặc tên thành viên..." oninput="searchReturnBorrowInline(this.value)" />
      </div>
      <div id="returnResultsInline"></div>
    </div>
  `;

  window.searchReturnBorrowInline = (val) => {
    const container = document.getElementById('returnResultsInline');
    if (!val.trim()) { container.innerHTML = ''; return; }
    const borrows = DB.get('borrows').filter(b => !b.returnDate);
    const members = DB.get('members');
    const books = DB.get('books');
    const today = new Date().toISOString().split('T')[0];
    const config = DB.getObj('config');

    const filtered = borrows.filter(b => {
      const m = members.find(m => m.id === b.memberId);
      return b.id.toLowerCase().includes(val.toLowerCase()) || (m && m.name.toLowerCase().includes(val.toLowerCase()));
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state" style="padding:30px;"><div class="empty-icon">🔍</div><h3>Không tìm thấy phiếu mượn</h3><p>Hãy kiểm tra lại mã hoặc tên thành viên</p></div>`;
      return;
    }

    container.innerHTML = filtered.map(b => {
      const member = members.find(m => m.id === b.memberId);
      const bookTitles = b.bookIds.map(id => books.find(bk => bk.id === id)?.title || '?').join(', ');
      const isOverdue = b.dueDate < today;
      const lateDays = isOverdue ? Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000) : 0;
      const lateFine = lateDays * config.finePerDay;

      return `
        <div style="border:1px solid ${isOverdue ? 'rgba(244,63,94,0.3)' : 'var(--border)'};border-radius:var(--radius-md);padding:16px;margin-bottom:12px;background:${isOverdue ? 'rgba(244,63,94,0.03)' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div>
              <code style="color:var(--accent-blue);font-size:13px;">${b.id}</code>
              <div style="font-size:15px;font-weight:600;margin-top:4px;">${member?.name || '?'}</div>
              <div style="font-size:12px;color:var(--text-muted);">📗 ${bookTitles}</div>
            </div>
            ${isOverdue ? `<span class="badge badge-overdue">⚠️ Quá hạn ${lateDays} ngày</span>` : '<span class="badge badge-borrowed">📖 Đang mượn</span>'}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;font-size:12px;">
            <div><span style="color:var(--text-muted)">Ngày mượn: </span>${fmtDate(b.borrowDate)}</div>
            <div><span style="color:var(--text-muted)">Hạn trả: </span><span style="color:${isOverdue ? 'var(--accent-rose)' : 'inherit'}">${fmtDate(b.dueDate)}</span></div>
            <div><span style="color:var(--text-muted)">Tiền phạt: </span><strong style="color:var(--accent-amber)">${isOverdue ? fmtMoney(lateFine) : 'Không có'}</strong></div>
          </div>
          <div style="display:flex;gap:12px;align-items:center;">
            <select class="form-control" id="condition_${b.id}" style="flex:1;max-width:200px;">
              <option value="good">Tình trạng: Tốt</option>
              <option value="damaged">Có hư hại (+50% giá sách)</option>
              <option value="lost">Báo mất (+100% giá sách)</option>
            </select>
            <button class="btn btn-success" onclick="confirmReturn('${b.id}')">✅ Xác nhận trả</button>
          </div>
        </div>
      `;
    }).join('');
  };

  window.confirmReturn = (borrowId) => {
    const borrows = DB.get('borrows');
    const books = DB.get('books');
    const today = new Date().toISOString().split('T')[0];
    const config = DB.getObj('config');
    const condition = document.getElementById('condition_' + borrowId)?.value || 'good';

    const idx = borrows.findIndex(b => b.id === borrowId);
    if (idx < 0) return;

    const borrow = borrows[idx];
    const isOverdue = borrow.dueDate < today;
    const lateDays = isOverdue ? Math.ceil((new Date(today) - new Date(borrow.dueDate)) / 86400000) : 0;
    let fine = lateDays * config.finePerDay;

    if (condition === 'damaged') fine += 50000;
    else if (condition === 'lost') fine += 200000;

    borrows[idx] = { ...borrow, returnDate: today, status: 'returned', fine, note: `Tình trạng: ${condition}` };
    DB.set('borrows', borrows);

    // Update book availability
    borrow.bookIds.forEach(bookId => {
      const bidx = books.findIndex(b => b.id === bookId);
      if (bidx >= 0) {
        if (condition === 'lost') { books[bidx].status = 'lost'; }
        else if (condition === 'damaged') { books[bidx].status = 'damaged'; }
        else { books[bidx].available = Math.min(books[bidx].quantity, books[bidx].available + 1); if (books[bidx].available > 0) books[bidx].status = 'available'; }
      }
    });
    DB.set('books', books);

    const msg = fine > 0 ? `✅ Đã xác nhận trả! Tiền phạt: ${fmtMoney(fine)}` : '✅ Đã xác nhận trả sách thành công!';
    showToast(msg, fine > 0 ? 'warning' : 'success');
    navigateTo('borrows');
  };
}

// ==================== VIOLATIONS ====================
function renderViolations() {
  const borrows = DB.get('borrows');
  const members = DB.get('members');
  const books = DB.get('books');
  const today = new Date().toISOString().split('T')[0];
  const config = DB.getObj('config');

  const overdueBorrows = borrows.filter(b => !b.returnDate && b.dueDate < today);
  const fineBorrows = borrows.filter(b => b.fine > 0);
  const totalFine = fineBorrows.reduce((s, b) => s + b.fine, 0);

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">⚠️ Quản lý Vi phạm</div>
        <div class="section-subtitle">Theo dõi các trường hợp vi phạm và thu phạt</div>
      </div>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);">
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdueBorrows.length}</div>
          <div class="stat-label">Quá hạn chưa trả</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">💰</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(totalFine)}</div>
          <div class="stat-label">Tổng tiền phạt đã thu</div>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon purple">📋</div>
        <div class="stat-info">
          <div class="stat-value">${fineBorrows.length}</div>
          <div class="stat-label">Phiếu có phạt</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">📋 Phiếu mượn quá hạn</div>
        <span class="badge badge-overdue">${overdueBorrows.length} phiếu</span>
      </div>
      ${overdueBorrows.length === 0 ? `
        <div class="empty-state" style="padding:30px;">
          <div class="empty-icon">✅</div>
          <h3>Không có vi phạm</h3>
          <p>Tất cả phiếu mượn đều trong hạn</p>
        </div>
      ` : `
        <div class="table-container">
          <table>
            <thead><tr><th>Mã phiếu</th><th>Thành viên</th><th>Sách</th><th>Hạn trả</th><th>Quá hạn</th><th>Tiền phạt dự kiến</th><th>Hành động</th></tr></thead>
            <tbody>
              ${overdueBorrows.map(b => {
    const member = members.find(m => m.id === b.memberId);
    const bookTitles = b.bookIds.map(id => books.find(bk => bk.id === id)?.title || '?').join(', ');
    const lateDays = Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000);
    const fine = lateDays * config.finePerDay;
    return `
                  <tr style="background:rgba(244,63,94,0.03);">
                    <td><code style="color:var(--accent-blue)">${b.id}</code></td>
                    <td><strong>${member?.name || '?'}</strong><br><small style="color:var(--text-muted)">${member?.email || ''}</small></td>
                    <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${bookTitles}</td>
                    <td style="color:var(--accent-rose);font-weight:600">${fmtDate(b.dueDate)}</td>
                    <td><span class="badge badge-overdue">${lateDays} ngày</span></td>
                    <td><strong style="color:var(--accent-amber)">${fmtMoney(fine)}</strong></td>
                    <td>
                      <button class="btn btn-sm btn-success" onclick="quickReturn('${b.id}')">🔄 Xử lý trả</button>
                    </td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>

    <div class="card" style="margin-top:24px;">
      <div class="card-header">
        <div class="card-title">💰 Lịch sử phiếu có phạt</div>
      </div>
      ${fineBorrows.length === 0 ? '<div class="empty-state" style="padding:30px;"><div class="empty-icon">💰</div><h3>Chưa có phiếu phạt</h3></div>' : `
        <div class="table-container">
          <table>
            <thead><tr><th>Mã phiếu</th><th>Thành viên</th><th>Ngày trả</th><th>Ghi chú</th><th>Tiền phạt</th></tr></thead>
            <tbody>
              ${fineBorrows.map(b => {
    const m = members.find(x => x.id === b.memberId);
    return `
                  <tr>
                    <td><code style="color:var(--accent-blue)">${b.id}</code></td>
                    <td>${m?.name || '?'}</td>
                    <td>${fmtDate(b.returnDate)}</td>
                    <td style="color:var(--text-secondary)">${b.note || '—'}</td>
                    <td><strong style="color:var(--accent-amber)">${fmtMoney(b.fine)}</strong></td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;

  window.quickReturn = (borrowId) => {
    navigateTo('return-process');
    setTimeout(() => {
      const input = document.getElementById('returnSearchInline');
      if (input) { input.value = borrowId; window.searchReturnBorrowInline(borrowId); }
    }, 100);
  };
}

// ==================== MY BORROWS (Student) ====================
function renderMyBorrows() {
  const members = DB.get('members');
  const member = members.find(m => m.accountId === currentUser.id || m.id === currentUser.memberId);
  const borrows = member ? DB.get('borrows').filter(b => b.memberId === member.id) : [];
  const books = DB.get('books');
  const today = new Date().toISOString().split('T')[0];

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">📖 Lịch sử Mượn sách</div>
        <div class="section-subtitle">Xem lại tất cả các lần bạn đã mượn sách</div>
      </div>
    </div>

    ${borrows.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>Bạn chưa mượn sách nào</h3>
        <p>Hãy tìm kiếm và yêu cầu mượn sách từ thủ thư</p>
        <button class="btn btn-primary" onclick="navigateTo('books')" style="margin-top:16px;">🔍 Tìm kiếm sách</button>
      </div>
    ` : `
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${borrows.slice().reverse().map(b => {
    const bookTitles = b.bookIds.map(id => books.find(bk => bk.id === id)?.title || '?');
    const isOverdue = !b.returnDate && b.dueDate < today;
    const isReturned = !!b.returnDate;
    let statusLabel, statusClass;
    if (isReturned) { statusLabel = '✅ Đã trả'; statusClass = 'badge-available'; }
    else if (isOverdue) { statusLabel = '⚠️ Quá hạn'; statusClass = 'badge-overdue'; }
    else { statusLabel = '📖 Đang mượn'; statusClass = 'badge-borrowed'; }

    return `
            <div class="card" style="${isOverdue ? 'border-color:rgba(244,63,94,0.3);background:rgba(244,63,94,0.02);' : ''}">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
                <div>
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <code style="color:var(--accent-blue);font-size:12px;">${b.id}</code>
                    <span class="badge ${statusClass}">${statusLabel}</span>
                    ${isOverdue ? '<span class="badge badge-overdue">Cần trả ngay!</span>' : ''}
                  </div>
                  ${bookTitles.map(t => `<div style="font-size:15px;font-weight:600;margin-bottom:4px;">📗 ${t}</div>`).join('')}
                </div>
                ${b.fine > 0 ? `<div style="text-align:right;"><div style="font-size:11px;color:var(--text-muted)">Tiền phạt</div><div style="font-size:20px;font-weight:700;color:var(--accent-amber)">${fmtMoney(b.fine)}</div></div>` : ''}
              </div>
              <div style="display:flex;gap:24px;margin-top:12px;font-size:13px;color:var(--text-secondary);flex-wrap:wrap;">
                <div>📅 Ngày mượn: <strong style="color:var(--text-primary)">${fmtDate(b.borrowDate)}</strong></div>
                <div>⏰ Hạn trả: <strong style="color:${isOverdue ? 'var(--accent-rose)' : 'var(--text-primary)'}">${fmtDate(b.dueDate)}</strong></div>
                ${b.returnDate ? `<div>✅ Ngày trả: <strong style="color:var(--text-primary)">${fmtDate(b.returnDate)}</strong></div>` : ''}
              </div>
              ${b.note ? `<div style="margin-top:8px;font-size:12px;color:var(--text-muted);">📝 ${b.note}</div>` : ''}
            </div>
          `;
  }).join('')}
      </div>
    `}
  `;
}

// ==================== MY VIOLATIONS (Student) ====================
function renderMyViolations() {
  const members = DB.get('members');
  const member = members.find(m => m.accountId === currentUser.id || m.id === currentUser.memberId);
  const borrows = member ? DB.get('borrows').filter(b => b.memberId === member.id) : [];
  const today = new Date().toISOString().split('T')[0];
  const config = DB.getObj('config');

  const overdueBorrows = borrows.filter(b => !b.returnDate && b.dueDate < today);
  const fineBorrows = borrows.filter(b => b.fine > 0);
  const totalFine = fineBorrows.reduce((s, b) => s + b.fine, 0);

  const pendingFine = overdueBorrows.reduce((s, b) => {
    const days = Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000);
    return s + days * config.finePerDay;
  }, 0);

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">⚠️ Vi phạm & Phạt</div>
        <div class="section-subtitle">Theo dõi các vi phạm và tiền phạt của bạn</div>
      </div>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);">
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdueBorrows.length}</div>
          <div class="stat-label">Đang quá hạn</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">💰</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(pendingFine)}</div>
          <div class="stat-label">Phạt dự kiến hiện tại</div>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon purple">📋</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(totalFine)}</div>
          <div class="stat-label">Tổng đã phạt</div>
        </div>
      </div>
    </div>

    ${overdueBorrows.length > 0 ? `
      <div class="alert-box alert-danger">
        ⚠️ Bạn có ${overdueBorrows.length} phiếu quá hạn với tiền phạt dự kiến ${fmtMoney(pendingFine)}. Vui lòng mang sách đến thư viện để trả ngay!
      </div>
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><div class="card-title">📋 Phiếu đang quá hạn</div></div>
        ${overdueBorrows.map(b => {
    const bks = DB.get('books');
    const bookTitles = b.bookIds.map(id => bks.find(bk => bk.id === id)?.title || '?').join(', ');
    const lateDays = Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000);
    const fine = lateDays * config.finePerDay;
    return `
            <div class="violation-card">
              <div class="violation-header">
                <div class="violation-title">📗 ${bookTitles}</div>
                <div class="violation-fine">${fmtMoney(fine)}</div>
              </div>
              <div style="font-size:13px;color:var(--text-secondary);">
                Hạn trả: ${fmtDate(b.dueDate)} · Quá hạn: <strong style="color:var(--accent-rose)">${lateDays} ngày</strong> · Phạt: ${fmtMoney(config.finePerDay)}/ngày
              </div>
            </div>
          `;
  }).join('')}
      </div>
    ` : `
      <div class="alert-box alert-success">✅ Bạn hiện không có vi phạm nào. Hãy tiếp tục duy trì!</div>
    `}

    <div class="card">
      <div class="card-header"><div class="card-title">📜 Lịch sử phạt</div></div>
      ${fineBorrows.length === 0 ? `<div class="empty-state" style="padding:30px;"><div class="empty-icon">😊</div><h3>Chưa có lịch sử phạt</h3></div>` : `
        <div class="table-container">
          <table>
            <thead><tr><th>Mã phiếu</th><th>Sách</th><th>Ngày trả</th><th>Ghi chú</th><th>Tiền phạt</th></tr></thead>
            <tbody>
              ${fineBorrows.map(b => {
    const bks = DB.get('books');
    const bookTitles = b.bookIds.map(id => bks.find(bk => bk.id === id)?.title || '?').join(', ');
    return `
                  <tr>
                    <td><code style="color:var(--accent-blue)">${b.id}</code></td>
                    <td>${bookTitles}</td>
                    <td>${fmtDate(b.returnDate)}</td>
                    <td style="color:var(--text-secondary)">${b.note || '—'}</td>
                    <td><strong style="color:var(--accent-amber)">${fmtMoney(b.fine)}</strong></td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

// ==================== REPORTS ====================
function renderReports() {
  const borrows = DB.get('borrows');
  const books = DB.get('books');
  const members = DB.get('members');
  const today = new Date().toISOString().split('T')[0];

  // Top borrowed books
  const bookBorrowCount = {};
  borrows.forEach(b => b.bookIds.forEach(id => { bookBorrowCount[id] = (bookBorrowCount[id] || 0) + 1; }));
  const topBooks = Object.entries(bookBorrowCount).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Top members
  const memberBorrowCount = {};
  borrows.forEach(b => { memberBorrowCount[b.memberId] = (memberBorrowCount[b.memberId] || 0) + 1; });
  const topMembers = Object.entries(memberBorrowCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Monthly stats
  const monthStats = getLast7MonthBorrows(borrows);
  const totalFine = borrows.reduce((s, b) => s + (b.fine || 0), 0);
  const overdue = borrows.filter(b => !b.returnDate && b.dueDate < today).length;

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">📈 Báo cáo Thống kê</div>
        <div class="section-subtitle">Tổng quan và phân tích hoạt động thư viện</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon blue">📖</div>
        <div class="stat-info">
          <div class="stat-value">${borrows.length}</div>
          <div class="stat-label">Tổng lượt mượn</div>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green">✅</div>
        <div class="stat-info">
          <div class="stat-value">${borrows.filter(b => b.returnDate).length}</div>
          <div class="stat-label">Lượt trả thành công</div>
        </div>
      </div>
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdue}</div>
          <div class="stat-label">Đang quá hạn</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">💰</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(totalFine)}</div>
          <div class="stat-label">Doanh thu phạt</div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-bottom:24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📊 Lượt mượn 7 tháng gần đây</div>
        </div>
        <div class="chart-bar-container" id="reportChart"></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">📚 Kho sách</div>
        </div>
        <div class="info-row"><span class="info-label">Tổng đầu sách</span><strong>${books.length}</strong></div>
        <div class="info-row"><span class="info-label">Có sẵn</span><strong style="color:var(--accent-green)">${books.filter(b => b.available > 0).length}</strong></div>
        <div class="info-row"><span class="info-label">Hỏng</span><strong style="color:var(--accent-amber)">${books.filter(b => b.status === 'damaged').length}</strong></div>
        <div class="info-row"><span class="info-label">Mất</span><strong style="color:var(--accent-rose)">${books.filter(b => b.status === 'lost').length}</strong></div>
        <div class="info-row"><span class="info-label">Thành viên</span><strong>${members.length}</strong></div>
        <div class="info-row"><span class="info-label">Đang hoạt động</span><strong style="color:var(--accent-green)">${members.filter(m => m.status === 'active').length}</strong></div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div class="card">
        <div class="card-header"><div class="card-title">🏆 Sách được mượn nhiều nhất</div></div>
        ${topBooks.map(([bookId, count], i) => {
    const book = books.find(b => b.id === bookId);
    const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
    return `
            <div class="report-row">
              <div class="report-rank ${rankClass}">${i + 1}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${book?.title || '?'}</div>
              </div>
              <div style="font-size:13px;font-weight:700;color:var(--accent-blue)">${count} lần</div>
            </div>
          `;
  }).join('')}
        ${topBooks.length === 0 ? '<div class="empty-state" style="padding:20px;"><div class="empty-icon">📚</div><div>Chưa có dữ liệu</div></div>' : ''}
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">👑 Thành viên mượn nhiều nhất</div></div>
        ${topMembers.map(([memberId, count], i) => {
    const m = members.find(x => x.id === memberId);
    const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
    return `
            <div class="report-row">
              <div class="report-rank ${rankClass}">${i + 1}</div>
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:500;">${m?.name || '?'}</div>
                <div style="font-size:11px;color:var(--text-muted)">${m?.code || ''}</div>
              </div>
              <div style="font-size:13px;font-weight:700;color:var(--accent-purple)">${count} lần</div>
            </div>
          `;
  }).join('')}
        ${topMembers.length === 0 ? '<div class="empty-state" style="padding:20px;"><div class="empty-icon">👥</div><div>Chưa có dữ liệu</div></div>' : ''}
      </div>
    </div>
  `;

  setTimeout(() => renderBorrowChart(monthStats, 'reportChart'), 100);
}

// ==================== CONFIG ====================
function renderConfig() {
  const config = DB.getObj('config');

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">⚙️ Cấu hình Hệ thống</div>
        <div class="section-subtitle">Thiết lập các tham số hoạt động của thư viện</div>
      </div>
    </div>

    <div class="config-grid">
      <div class="config-item">
        <div class="config-label">📅 Thời hạn mượn tối đa (ngày)</div>
        <input class="form-control" type="number" id="cfg_maxBorrowDays" value="${config.maxBorrowDays}" min="1" max="60" />
      </div>
      <div class="config-item">
        <div class="config-label">📚 Số sách tối đa mỗi lần mượn</div>
        <input class="form-control" type="number" id="cfg_maxBooksPerMember" value="${config.maxBooksPerMember}" min="1" max="10" />
      </div>
      <div class="config-item">
        <div class="config-label">💰 Phí phạt mỗi ngày quá hạn (VND)</div>
        <input class="form-control" type="number" id="cfg_finePerDay" value="${config.finePerDay}" min="0" step="500" />
      </div>
      <div class="config-item">
        <div class="config-label">🔧 Phụ phí sách hỏng (%)</div>
        <input class="form-control" type="number" id="cfg_fineDamagedPercent" value="${config.fineDamagedPercent}" min="0" max="200" />
      </div>
      <div class="config-item">
        <div class="config-label">❌ Phụ phí sách mất (%)</div>
        <input class="form-control" type="number" id="cfg_fineLostPercent" value="${config.fineLostPercent}" min="0" max="300" />
      </div>
      <div class="config-item">
        <div class="config-label">🔔 Nhắc nhở trước hạn (ngày)</div>
        <input class="form-control" type="number" id="cfg_reminderDaysBefore" value="${config.reminderDaysBefore}" min="1" max="14" />
      </div>
    </div>

    <div style="display:flex;gap:12px;margin-top:24px;justify-content:flex-end;">
      <button class="btn btn-secondary" onclick="renderConfig()">↩️ Hủy thay đổi</button>
      <button class="btn btn-primary" onclick="saveConfig()">💾 Lưu cấu hình</button>
    </div>

    <div class="card" style="margin-top:32px;">
      <div class="card-header"><div class="card-title">⚠️ Vùng nguy hiểm</div></div>
      <div style="color:var(--text-secondary);font-size:13px;margin-bottom:16px;">Các thao tác sau không thể hoàn tác. Hãy cân nhắc kỹ trước khi thực hiện.</div>
      <button class="btn btn-danger" onclick="confirmResetData()">🗑️ Reset toàn bộ dữ liệu demo</button>
    </div>
  `;
}

function saveConfig() {
  const config = {
    maxBorrowDays: parseInt(document.getElementById('cfg_maxBorrowDays').value) || 14,
    maxBooksPerMember: parseInt(document.getElementById('cfg_maxBooksPerMember').value) || 3,
    finePerDay: parseInt(document.getElementById('cfg_finePerDay').value) || 2000,
    fineDamagedPercent: parseInt(document.getElementById('cfg_fineDamagedPercent').value) || 50,
    fineLostPercent: parseInt(document.getElementById('cfg_fineLostPercent').value) || 100,
    reminderDaysBefore: parseInt(document.getElementById('cfg_reminderDaysBefore').value) || 2,
  };
  DB.setObj('config', config);
  showToast('✅ Đã lưu cấu hình hệ thống', 'success');
}

function confirmResetData() {
  showConfirm('⚠️ Bạn có chắc muốn reset toàn bộ dữ liệu? Hành động này KHÔNG THỂ hoàn tác!', () => {
    localStorage.removeItem('lms_initialized');
    ['categories', 'authors', 'books', 'members', 'accounts', 'librarians', 'borrows', 'config'].forEach(k => localStorage.removeItem('lms_' + k));
    showToast('Đã reset dữ liệu. Tải lại trang để khởi tạo lại.', 'warning');
    setTimeout(() => location.reload(), 1500);
  });
}

// ==================== HELPERS ====================
function getDefaultDueDate() {
  const config = DB.getObj('config');
  const d = new Date();
  d.setDate(d.getDate() + (config.maxBorrowDays || 14));
  return d.toISOString().split('T')[0];
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return dateStr; }
}

function fmtMoney(amount) {
  if (!amount) return '0đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function getLast7MonthBorrows(borrows) {
  const months = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `T${d.getMonth() + 1}`;
    const count = borrows.filter(b => b.borrowDate && b.borrowDate.startsWith(key)).length;
    months.push({ label, count });
  }
  return months;
}

function renderBorrowChart(data, containerId = 'borrowChart') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const max = Math.max(...data.map(d => d.count), 1);
  container.innerHTML = data.map(d => `
    <div class="chart-bar-wrapper">
      <div style="font-size:11px;font-weight:600;color:${d.count > 0 ? 'var(--accent-blue)' : 'var(--text-muted)'};margin-bottom:4px;">${d.count || ''}</div>
      <div class="chart-bar" style="height:${Math.max(4, Math.round((d.count / max) * 100))}px;"></div>
      <div class="chart-bar-label">${d.label}</div>
    </div>
  `).join('');
}

function getTopBorrowedBooks(borrows, limit = 5) {
  const bookBorrowCount = {};
  borrows.forEach(b => b.bookIds.forEach(id => { bookBorrowCount[id] = (bookBorrowCount[id] || 0) + 1; }));
  const top = Object.entries(bookBorrowCount).sort((a, b) => b[1] - a[1]).slice(0, limit);
  const books = DB.get('books');
  if (top.length === 0) return '<div class="empty-state" style="padding:20px;"><div class="empty-icon">📚</div><div>Chưa có dữ liệu</div></div>';
  return top.map(([bookId, count], i) => {
    const book = books.find(b => b.id === bookId);
    const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
    return `<div class="report-row"><div class="report-rank ${rankClass}">${i + 1}</div><div style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;">${book?.title || '?'}</div><div style="font-weight:700;color:var(--accent-blue);font-size:13px;">${count}</div></div>`;
  }).join('');
}

function renderOverdueList(overdue) {
  if (overdue.length === 0) return '<div class="empty-state" style="padding:20px;"><div class="empty-icon">✅</div><div style="font-size:13px;">Không có phiếu quá hạn</div></div>';
  const members = DB.get('members');
  const today = new Date().toISOString().split('T')[0];
  return overdue.slice(0, 5).map(b => {
    const m = members.find(x => x.id === b.memberId);
    const lateDays = Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000);
    return `<div class="activity-item"><div class="activity-icon" style="background:rgba(244,63,94,0.1);">⚠️</div><div class="activity-text"><div class="activity-title">${m?.name || '?'}</div><div class="activity-subtitle">Quá hạn ${lateDays} ngày</div></div></div>`;
  }).join('');
}

// ==================== MODAL HELPERS ====================
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

function showConfirm(message, callback) {
  document.getElementById('confirmMessage').textContent = message;
  const btn = document.getElementById('confirmBtn');
  btn.onclick = () => { closeModal('modalConfirm'); callback(); };
  openModal('modalConfirm');
}

// Close modals on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

// ==================== TOAST ====================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==================== GLOBAL SEARCH ====================
function globalSearchHandler(val) {
  if (!val.trim()) return;
  if (currentPage !== 'books') {
    navigateTo('books');
    setTimeout(() => {
      const inp = document.getElementById('bookSearchInput');
      if (inp) { inp.value = val; bookFilter.search = val.toLowerCase(); filterBooks(); }
    }, 100);
  } else {
    const inp = document.getElementById('bookSearchInput');
    if (inp) { inp.value = val; filterBooks(); }
  }
}

function toggleNotifications() {
  const borrows = DB.get('borrows');
  const today = new Date().toISOString().split('T')[0];
  const overdue = borrows.filter(b => !b.returnDate && b.dueDate < today);
  if (overdue.length > 0) {
    showToast(`⚠️ Có ${overdue.length} phiếu mượn quá hạn cần xử lý!`, 'warning');
    if (currentUser.role !== 'Member') navigateTo('violations');
  } else {
    showToast('✅ Không có thông báo mới', 'info');
  }
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
