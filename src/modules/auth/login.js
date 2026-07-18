import { setCurrentUser } from '../../core/state.js';
import { showToast } from '../../core/toast.js';

export async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginBtn');
  const errorEl = document.getElementById('loginError');

  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Đang xử lý...';
  btn.disabled = true;
  errorEl.classList.add('d-none');

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Tài khoản hoặc mật khẩu không đúng!');
    }
    
    const account = await res.json();

    if (account.status === 'locked') {
      errorEl.innerHTML = '<i class="bi bi-lock-fill me-1"></i> Tài khoản đã bị khóa. Liên hệ admin để được hỗ trợ.';
      errorEl.classList.remove('d-none');
      btn.innerHTML = '<span>Đăng nhập</span> <i class="bi bi-arrow-right ms-1"></i>';
      btn.disabled = false;
      return;
    }

    setCurrentUser(account);
    window.showApp();
  } catch(error) {
    errorEl.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-1"></i> ${error.message || 'Không thể kết nối đến máy chủ API!'}`;
    errorEl.classList.remove('d-none');
    btn.innerHTML = '<span>Đăng nhập</span> <i class="bi bi-arrow-right ms-1"></i>';
    btn.disabled = false;
  }
}

export function fillLogin(u, p) {
  document.getElementById('loginUsername').value = u;
  document.getElementById('loginPassword').value = p;
}

export function handleLogout() {
  setCurrentUser(null);
  document.getElementById('app').classList.add('d-none');
  document.getElementById('login-page').classList.remove('d-none');
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginError').classList.add('d-none');
  const btn = document.getElementById('loginBtn');
  if (btn) {
    btn.innerHTML = '<span>Đăng nhập</span> <i class="bi bi-arrow-right ms-1"></i>';
    btn.disabled = false;
  }
  showToast('Đã đăng xuất thành công', 'info');
}
