// ==================== DASHBOARD (API) ====================
async function renderDashboard() {
  try {
    const [booksRes, borrowsRes, accountsRes] = await Promise.all([
      fetch('http://localhost:8080/api/books'),
      fetch('http://localhost:8080/api/borrows'),
      fetch('http://localhost:8080/api/accounts')
    ]);
    const books = await booksRes.json();
    const borrowsList = await borrowsRes.json();
    const accounts = await accountsRes.json();
    
    // Process borrows list
    const borrows = borrowsList.map(w => w.borrow);
    
    const role = currentUser.role;
    
    document.getElementById('pageContent').innerHTML = `
      <div class="section-header">
        <div>
          <div class="section-title">📊 Dashboard</div>
          <div class="section-subtitle">Tổng quan hệ thống thư viện</div>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="stat-icon blue">📚</div>
          <div class="stat-info">
            <div class="stat-value">${books.length}</div>
            <div class="stat-label">Tổng đầu sách</div>
          </div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon green">👥</div>
          <div class="stat-info">
            <div class="stat-value">${accounts.filter(a => a.role === 'Member').length}</div>
            <div class="stat-label">Thành viên</div>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="stat-icon purple">📖</div>
          <div class="stat-info">
            <div class="stat-value">${borrows.filter(b => b.status === 'BORROWING').length}</div>
            <div class="stat-label">Phiếu đang mượn</div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    showToast('Lỗi khi tải dữ liệu dashboard', 'error');
  }
}
