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

