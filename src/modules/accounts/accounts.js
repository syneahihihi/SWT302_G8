import { showToast } from '../../core/toast.js';
import { openModal, closeModal, showConfirm } from '../../core/modal.js';
import { fmtDate } from '../../shared/helpers.js';

export async function renderAccounts() {
  try {
    const response = await fetch('/accounts');
    if (!response.ok) throw new Error('Không thể tải danh sách tài khoản');
    const accounts = await response.json();

    document.getElementById('pageContent').innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="text-light fw-bold mb-1"><i class="bi bi-shield-lock-fill text-primary me-2"></i>Quản lý Tài khoản</h3>
          <p class="text-muted small mb-0">Quản lý và cấp quyền truy cập hệ thống thư viện cho nhân viên & sinh viên</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAccountModal()"><i class="bi bi-plus-lg me-1"></i> Thêm tài khoản</button>
      </div>

      <div class="card bg-dark border-secondary">
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Username</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th style="width: 120px; text-align: center;">Trạng thái</th>
                <th style="width: 180px; text-align: center;">Hành động</th>
              </tr>
            </thead>
            <tbody>
              ${accounts.map(a => {
                const roleClasses = { Admin: 'bg-danger-subtle border border-danger text-danger', Librarian: 'bg-primary-subtle border border-primary text-primary', Member: 'bg-success-subtle border border-success text-success' };
                const roleLabels = { Admin: '👑 Admin', Librarian: '📚 Thủ thư', Member: '🎓 Sinh viên' };
                
                return `
                  <tr>
                    <td><code class="text-primary font-monospace fs-7">${a.username}</code></td>
                    <td><strong class="text-light">${a.fullname}</strong></td>
                    <td class="text-secondary">${a.email || '—'}</td>
                    <td><span class="badge ${roleClasses[a.role] || 'bg-secondary'} px-2 py-1">${roleLabels[a.role] || a.role}</span></td>
                    <td>${fmtDate(a.createdAt)}</td>
                    <td class="text-center">
                      <span class="badge ${a.status === 'active' ? 'bg-success' : 'bg-danger'} px-2 py-1">
                        ${a.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td class="text-center">
                      <div class="btn-group">
                        <button class="btn btn-outline-secondary btn-sm" onclick="window.openAccountModal('${a.id}')" title="Sửa thông tin"><i class="bi bi-pencil-fill"></i></button>
                        <button class="btn ${a.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'} btn-sm" onclick="window.toggleAccountStatus('${a.id}', '${a.status}')" title="${a.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}">
                          <i class="bi ${a.status === 'active' ? 'bi-lock-fill' : 'bi-unlock-fill'}"></i>
                        </button>
                        ${a.username !== 'admin' ? `
                          <button class="btn btn-outline-danger btn-sm" onclick="window.confirmDeleteAccount('${a.id}')" title="Xóa tài khoản"><i class="bi bi-trash-fill"></i></button>
                        ` : ''}
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (error) {
    showToast('Lỗi khi tải dữ liệu tài khoản: ' + error.message, 'error');
  }
}

export async function openAccountModal(accId = null) {
  if (accId) {
    try {
      const response = await fetch(`/accounts/${accId}`);
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
      showToast('Lỗi khi tải dữ liệu: ' + error.message, 'error');
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

export async function saveAccount(e) {
  e.preventDefault();
  const editId = document.getElementById('accountEditId').value;
  const pw = document.getElementById('accountPassword').value;
  const data = {
    username: document.getElementById('accountUsername').value.trim(),
    fullname: document.getElementById('accountFullname').value.trim(),
    email: document.getElementById('accountEmail').value.trim(),
    role: document.getElementById('accountRole').value
  };

  if (!editId) {
    if (!pw) {
      showToast("Mật khẩu là bắt buộc khi tạo mới tài khoản", "error");
      return;
    }
    data.password = pw;
  } else if (pw) {
    data.password = pw;
  }

  try {
    const url = editId ? `/accounts/${editId}` : '/accounts';
    const method = editId ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Lỗi lưu dữ liệu tài khoản');
    showToast(editId ? 'Đã cập nhật tài khoản thành công' : 'Đã tạo tài khoản mới thành công', 'success');
    closeModal('modalAccount');
    renderAccounts();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

export async function toggleAccountStatus(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'locked' : 'active';
  try {
    const response = await fetch(`/accounts/${id}`);
    if (!response.ok) throw new Error('Không tìm thấy tài khoản để thay đổi trạng thái');
    const acc = await response.json();
    acc.status = newStatus;
    
    const putRes = await fetch(`/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(acc)
    });
    if (!putRes.ok) throw new Error('Lỗi cập nhật trạng thái');
    showToast(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản thành công`, 'success');
    renderAccounts();
  } catch(error) {
    showToast(error.message, 'error');
  }
}

export function confirmDeleteAccount(id) {
  showConfirm(`Bạn có chắc muốn xóa tài khoản này?`, async () => {
    try {
      const response = await fetch(`/accounts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Không thể xóa tài khoản');
      showToast('Đã xóa tài khoản thành công', 'success');
      renderAccounts();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
