// ==================== AUTH ====================
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginBtn');
  const errorEl = document.getElementById('loginError');

  btn.innerHTML = '<div class="spinner"></div> Đang xử lý...';
  btn.disabled = true;
  errorEl.classList.add('hidden');

  try {
      const res = await fetch('http://localhost:8080/api/accounts');
      if (!res.ok) throw new Error("Failed to fetch");
      const accounts = await res.json();
      
      const account = accounts.find(a => a.username === username && a.password === password);

      if (!account) {
        errorEl.textContent = '⚠️ Tên đăng nhập hoặc mật khẩu không đúng!';
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
  } catch(error) {
      errorEl.textContent = '⚠️ Không thể kết nối đến máy chủ API!';
      errorEl.classList.remove('hidden');
      btn.innerHTML = '<span>Đăng nhập</span><span>→</span>';
      btn.disabled = false;
  }
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
