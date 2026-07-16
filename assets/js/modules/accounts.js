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

