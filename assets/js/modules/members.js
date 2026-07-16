// ==================== MEMBERS (API) ====================
const MEMBER_API_URL = 'http://localhost:8080/api/members';

async function renderMembers() {
  try {
    const res = await fetch(MEMBER_API_URL);
    const members = await res.json();
    
    document.getElementById('pageContent').innerHTML = `
      <div class="section-header">
        <div>
          <div class="section-title">👥 Quản lý Thành viên</div>
          <div class="section-subtitle">Danh sách thành viên đăng ký mượn sách</div>
        </div>
        <button class="btn btn-primary" onclick="openMemberModal()">+ Thêm thành viên</button>
      </div>
      <div class="table-container">
        <table>
          <thead><tr><th>Mã SV/CB</th><th>Tên tài khoản</th><th>Họ tên</th><th>Email</th><th>Ngày tham gia</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            ${members.length === 0 ? '<tr><td colspan="7" style="text-align:center">Chưa có thành viên nào</td></tr>' : ''}
            ${members.map(m => `
              <tr>
                <td><strong>${m.code}</strong></td>
                <td>${m.account?.username || '—'}</td>
                <td>${m.account?.fullname || '—'}</td>
                <td>${m.account?.email || '—'}</td>
                <td>${fmtDate(m.joinDate)}</td>
                <td>
                  <span class="badge badge-${m.status === 'active' ? 'active' : 'locked'}">
                    ${m.status === 'active' ? 'Hoạt động' : 'Khóa'}
                  </span>
                </td>
                <td>
                  <div style="display:flex;gap:6px;">
                    <button class="btn btn-secondary btn-sm" onclick="openMemberModal('${m.id}')">✏️ Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteMember('${m.id}')">🗑️ Xóa</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (e) {
    showToast('Lỗi khi tải dữ liệu thành viên', 'error');
  }
}

// NOTE: Member creation/edit logic is complex as it requires creating an Account first.
// For simplicity in this UI iteration, we will leave the save logic as a placeholder or basic implement.
function openMemberModal() {
  showToast('Tính năng thêm/sửa thành viên đang được xây dựng lại.', 'info');
}

function confirmDeleteMember(id) {
  showToast('Tính năng xóa thành viên đang được xây dựng lại.', 'info');
}
