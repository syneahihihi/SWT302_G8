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

