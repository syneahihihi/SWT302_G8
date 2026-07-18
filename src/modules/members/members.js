import { showToast } from '../../core/toast.js';
import { fmtDate } from '../../shared/helpers.js';

export async function renderMembers() {
  try {
    const res = await fetch('/members');
    if (!res.ok) throw new Error('Không thể fetch dữ liệu thành viên');
    const members = await res.json();
    
    document.getElementById('pageContent').innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="text-light fw-bold mb-1"><i class="bi bi-people-fill text-primary me-2"></i>Quản lý Thành viên</h3>
          <p class="text-muted small mb-0">Xem danh sách sinh viên đăng ký thẻ mượn sách thư viện</p>
        </div>
        <button class="btn btn-primary" onclick="window.openMemberModal()"><i class="bi bi-plus-lg me-1"></i> Thêm thành viên</button>
      </div>

      <div class="card bg-dark border-secondary">
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Mã SV</th>
                <th>Username</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Ngày tham gia</th>
                <th style="width: 150px; text-align: center;">Trạng thái</th>
                <th style="width: 150px; text-align: center;">Hành động</th>
              </tr>
            </thead>
            <tbody>
              ${members.length === 0 ? '<tr><td colspan="7" class="text-center py-4 text-muted">Chưa có thành viên nào</td></tr>' : ''}
              ${members.map(m => `
                <tr>
                  <td><strong class="text-light">${m.code}</strong></td>
                  <td><code class="text-primary font-monospace">${m.account?.username || '—'}</code></td>
                  <td><strong class="text-light">${m.account?.fullname || '—'}</strong></td>
                  <td class="text-secondary">${m.account?.email || '—'}</td>
                  <td>${fmtDate(m.joinDate)}</td>
                  <td class="text-center">
                    <span class="badge ${m.status === 'active' ? 'bg-success' : 'bg-danger'}">
                      ${m.status === 'active' ? 'Hoạt động' : 'Khóa'}
                    </span>
                  </td>
                  <td class="text-center">
                    <div class="btn-group">
                      <button class="btn btn-outline-secondary btn-sm" onclick="window.openMemberModal('${m.id}')" title="Sửa"><i class="bi bi-pencil-fill"></i> Sửa</button>
                      <button class="btn btn-outline-danger btn-sm" onclick="window.confirmDeleteMember('${m.id}')" title="Xóa"><i class="bi bi-trash-fill"></i> Xóa</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (e) {
    showToast('Lỗi khi tải dữ liệu thành viên: ' + e.message, 'error');
  }
}

export function openMemberModal() {
  showToast('Tính năng thêm/sửa thành viên đang được tích hợp cùng hệ thống đăng ký.', 'info');
}

export function confirmDeleteMember(id) {
  showToast('Tính năng xóa thành viên đang được xây dựng bảo mật.', 'info');
}
