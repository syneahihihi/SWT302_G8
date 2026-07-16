// ==================== ACCOUNTS (API) ====================
const ACCOUNT_API_URL = 'http://localhost:8080/api/accounts';

async function renderAccounts() {
  try {
    const response = await fetch(ACCOUNT_API_URL);
    const accounts = await response.json();

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
                  <td><span class="badge badge-${a.status === 'active' ? 'active' : 'locked'}">${a.status === 'active' ? 'Hoạt động' : 'Khóa'}</span></td>
                  <td>
                    <div style="display:flex;gap:6px;">
                      <button class="btn btn-secondary btn-sm" onclick="openAccountModal('${a.id}')">✏️</button>
                      <button class="btn btn-sm ${a.status === 'active' ? 'btn-warning' : 'btn-success'}" onclick="toggleAccountStatus('${a.id}', '${a.status}')">${a.status === 'active' ? '🔒' : '🔓'}</button>
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
  } catch (error) {
    showToast('Lỗi khi tải dữ liệu', 'error');
  }
}

async function openAccountModal(accId = null) {
  if (accId) {
    try {
      const response = await fetch(`${ACCOUNT_API_URL}/${accId}`);
      if (!response.ok) throw new Error('Không tìm thấy tài khoản');
      const a = await response.json();
      
      document.getElementById('modalAccountTitle').textContent = '✏️ Sửa tài khoản';
      document.getElementById('accountUsername').value = a.username;
      document.getElementById('accountUsername').disabled = true;
      document.getElementById('accountPassword').placeholder = 'Bỏ trống nếu không đổi mật khẩu';
      document.getElementById('accountFullname').value = a.fullname;
      document.getElementById('accountEmail').value = a.email || '';
      document.getElementById('accountRole').value = a.role;
      document.getElementById('accountEditId').value = a.id;
    } catch (error) {
      showToast('Lỗi khi tải dữ liệu', 'error');
      return;
    }
  } else {
    document.getElementById('modalAccountTitle').textContent = '+ Thêm tài khoản';
    document.getElementById('formAccount').reset();
    document.getElementById('accountUsername').disabled = false;
    document.getElementById('accountPassword').placeholder = '••••••••';
    document.getElementById('accountEditId').value = '';
  }
  openModal('modalAccount');
}

async function saveAccount(e) {
  e.preventDefault();
  const editId = document.getElementById('accountEditId').value;
  const pw = document.getElementById('accountPassword').value;
  const data = {
    username: document.getElementById('accountUsername').value.trim(),
    fullname: document.getElementById('accountFullname').value.trim(),
    email: document.getElementById('accountEmail').value.trim(),
    role: document.getElementById('accountRole').value
  };

  // Only send password if editing and it's filled, or if creating
  if (!editId) {
    if (!pw) {
        showToast("Mật khẩu là bắt buộc khi tạo mới", "error");
        return;
    }
    data.password = pw;
  } else if (pw) {
    data.password = pw;
  }

  try {
    const url = editId ? `${ACCOUNT_API_URL}/${editId}` : ACCOUNT_API_URL;
    const method = editId ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Lỗi lưu dữ liệu');
    showToast(editId ? 'Đã cập nhật tài khoản' : 'Đã tạo tài khoản mới', 'success');
    closeModal('modalAccount');
    renderAccounts();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function toggleAccountStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'locked' : 'active';
  try {
    const response = await fetch(`${ACCOUNT_API_URL}/${id}`);
    const acc = await response.json();
    acc.status = newStatus;
    
    const putRes = await fetch(`${ACCOUNT_API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(acc)
    });
    if (!putRes.ok) throw new Error('Lỗi cập nhật');
    showToast(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản`, 'success');
    renderAccounts();
  } catch(error) {
    showToast(error.message, 'error');
  }
}

function confirmDeleteAccount(id) {
  showConfirm(`Bạn có chắc muốn xóa tài khoản này?`, async () => {
    try {
      const response = await fetch(`${ACCOUNT_API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Không thể xóa tài khoản');
      showToast('Đã xóa tài khoản', 'success');
      renderAccounts();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
