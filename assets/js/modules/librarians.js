// ==================== LIBRARIANS (API) ====================
async function renderLibrarians() {
  try {
    const res = await fetch('http://localhost:8080/api/librarians');
    const librarians = await res.json();
    
    document.getElementById('pageContent').innerHTML = `
      <div class="section-header">
        <div>
          <div class="section-title">👩‍💼 Quản lý Thủ thư</div>
          <div class="section-subtitle">Danh sách nhân viên quản lý thư viện</div>
        </div>
      </div>
      <div class="table-container">
        <table>
          <thead><tr><th>Tên tài khoản</th><th>Họ tên</th><th>Chi nhánh</th><th>Số nội bộ</th><th>Email</th></tr></thead>
          <tbody>
            ${librarians.map(l => `
              <tr>
                <td><strong>${l.account?.username || '—'}</strong></td>
                <td>${l.account?.fullname || '—'}</td>
                <td>${l.branch || '—'}</td>
                <td>${l.account?.phone || '—'}</td>
                <td>${l.account?.email || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch(e) {
    showToast('Lỗi tải danh sách thủ thư', 'error');
  }
}
