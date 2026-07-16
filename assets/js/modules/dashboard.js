// ==================== DASHBOARD ====================
function renderDashboard() {
  const role = currentUser.role;
  if (role === 'Admin') renderAdminDashboard();
  else if (role === 'Librarian') renderLibrarianDashboard();
  else renderMemberDashboard();
}

function renderAdminDashboard() {
  const books = DB.get('books');
  const members = DB.get('members');
  const borrows = DB.get('borrows');
  const accounts = DB.get('accounts');
  const today = new Date().toISOString().split('T')[0];

  const activeBorrows = borrows.filter(b => b.status === 'borrowing' || b.status === 'overdue');
  const overdue = borrows.filter(b => !b.returnDate && b.dueDate < today && b.status !== 'returned');
  const totalFine = borrows.reduce((s, b) => s + (b.fine || 0), 0);
  const returnedToday = borrows.filter(b => b.returnDate === today).length;

  const recentActivity = borrows.slice(-5).reverse().map(b => {
    const member = DB.get('members').find(m => m.id === b.memberId);
    return { title: `${member ? member.name : '?'} – ${b.status === 'returned' ? 'Trả sách' : 'Mượn sách'}`, time: b.returnDate || b.borrowDate, icon: b.status === 'returned' ? '🔄' : '📖', color: b.status === 'returned' ? 'green' : 'blue' };
  });

  // Borrow stats by month (last 7 months)
  const monthStats = getLast7MonthBorrows(borrows);

  document.getElementById('pageContent').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon blue">📚</div>
        <div class="stat-info">
          <div class="stat-value">${books.length}</div>
          <div class="stat-label">Tổng số đầu sách</div>
          <div class="stat-change up">↑ ${books.filter(b => b.status === 'available').length} có sẵn</div>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green">👥</div>
        <div class="stat-info">
          <div class="stat-value">${members.filter(m => m.status === 'active').length}</div>
          <div class="stat-label">Thành viên hoạt động</div>
          <div class="stat-change up">/ ${members.length} tổng</div>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon purple">📖</div>
        <div class="stat-info">
          <div class="stat-value">${activeBorrows.length}</div>
          <div class="stat-label">Đang được mượn</div>
          <div class="stat-change up">Hôm nay: +${returnedToday} trả</div>
        </div>
      </div>
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdue.length}</div>
          <div class="stat-label">Quá hạn</div>
          <div class="stat-change down">${overdue.length > 0 ? '⚠️ Cần xử lý' : '✅ Tốt'}</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">💰</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(totalFine)}</div>
          <div class="stat-label">Tổng tiền phạt thu</div>
          <div class="stat-change up">Từ ${borrows.filter(b => b.fine > 0).length} phiếu</div>
        </div>
      </div>
      <div class="stat-card teal">
        <div class="stat-icon teal">🔐</div>
        <div class="stat-info">
          <div class="stat-value">${accounts.length}</div>
          <div class="stat-label">Tài khoản hệ thống</div>
          <div class="stat-change up">${accounts.filter(a => a.status === 'locked').length} bị khóa</div>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">📊 Lượt mượn 7 tháng gần đây</div>
            <div class="card-subtitle">Thống kê theo tháng</div>
          </div>
        </div>
        <div class="chart-bar-container" id="borrowChart"></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">🕐 Hoạt động gần đây</div>
        </div>
        <div class="activity-list">
          ${recentActivity.map(a => `
            <div class="activity-item">
              <div class="activity-icon" style="background:rgba(${a.color === 'green' ? '16,185,129' : '79,142,247'},0.15)">${a.icon}</div>
              <div class="activity-text">
                <div class="activity-title">${a.title}</div>
              </div>
              <div class="activity-time">${fmtDate(a.time)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📚 Sách được mượn nhiều nhất</div>
        </div>
        ${getTopBorrowedBooks(borrows, 5)}
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">⚠️ Phiếu quá hạn</div>
          ${overdue.length > 0 ? `<span class="badge badge-overdue">${overdue.length}</span>` : ''}
        </div>
        ${renderOverdueList(overdue)}
      </div>
    </div>
  `;

  // Render chart
  setTimeout(() => renderBorrowChart(monthStats), 100);
}

function renderLibrarianDashboard() {
  const books = DB.get('books');
  const members = DB.get('members');
  const borrows = DB.get('borrows');
  const today = new Date().toISOString().split('T')[0];
  const todayBorrows = borrows.filter(b => b.borrowDate === today).length;
  const todayReturns = borrows.filter(b => b.returnDate === today).length;
  const overdue = borrows.filter(b => !b.returnDate && b.dueDate < today && b.status !== 'returned');

  document.getElementById('pageContent').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon blue">📖</div>
        <div class="stat-info">
          <div class="stat-value">${todayBorrows}</div>
          <div class="stat-label">Mượn hôm nay</div>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green">🔄</div>
        <div class="stat-info">
          <div class="stat-value">${todayReturns}</div>
          <div class="stat-label">Trả hôm nay</div>
        </div>
      </div>
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdue.length}</div>
          <div class="stat-label">Quá hạn chưa trả</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">📚</div>
        <div class="stat-info">
          <div class="stat-value">${books.filter(b => b.available > 0).length}</div>
          <div class="stat-label">Đầu sách có sẵn</div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">⚡ Thao tác nhanh</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <button class="btn btn-primary" onclick="navigateTo('borrow-process')" style="padding:20px;flex-direction:column;height:auto;gap:8px;">
            <span style="font-size:28px;">📖</span>
            <span>Mượn sách</span>
          </button>
          <button class="btn btn-success" onclick="navigateTo('return-process')" style="padding:20px;flex-direction:column;height:auto;gap:8px;">
            <span style="font-size:28px;">🔄</span>
            <span>Trả sách</span>
          </button>
          <button class="btn btn-secondary" onclick="navigateTo('books')" style="padding:20px;flex-direction:column;height:auto;gap:8px;">
            <span style="font-size:28px;">📚</span>
            <span>Kho sách</span>
          </button>
          <button class="btn btn-secondary" onclick="navigateTo('members')" style="padding:20px;flex-direction:column;height:auto;gap:8px;">
            <span style="font-size:28px;">👥</span>
            <span>Thành viên</span>
          </button>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">⚠️ Phiếu quá hạn</div>
          ${overdue.length > 0 ? `<span class="badge badge-overdue">${overdue.length}</span>` : ''}
        </div>
        ${renderOverdueList(overdue)}
      </div>
    </div>
  `;
}

function renderMemberDashboard() {
  const borrows = DB.get('borrows');
  const members = DB.get('members');
  const member = members.find(m => m.id === currentUser.memberId);
  const myBorrows = borrows.filter(b => b.memberId === (member ? member.id : ''));
  const today = new Date().toISOString().split('T')[0];
  const activeBorrows = myBorrows.filter(b => !b.returnDate);
  const overdueBorrows = myBorrows.filter(b => !b.returnDate && b.dueDate < today);
  const totalFine = myBorrows.reduce((s, b) => s + (b.fine || 0), 0);

  document.getElementById('pageContent').innerHTML = `
    <div style="margin-bottom:24px;">
      <div class="card" style="background:linear-gradient(135deg,rgba(79,142,247,0.1),rgba(139,92,246,0.05));border-color:rgba(79,142,247,0.2);">
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--grad-blue);display:flex;align-items:center;justify-content:center;font-size:28px;">🎓</div>
          <div>
            <div style="font-size:22px;font-weight:700;">${member ? member.name : currentUser.fullname}</div>
            <div style="color:var(--text-secondary);">Mã SV: ${member ? member.code : '—'} &nbsp;|&nbsp; ${member ? member.email : currentUser.email}</div>
            <div class="badge badge-active" style="margin-top:6px;">✅ Thành viên hoạt động</div>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon blue">📖</div>
        <div class="stat-info">
          <div class="stat-value">${activeBorrows.length}</div>
          <div class="stat-label">Đang mượn</div>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green">✅</div>
        <div class="stat-info">
          <div class="stat-value">${myBorrows.filter(b => b.returnDate).length}</div>
          <div class="stat-label">Đã trả</div>
        </div>
      </div>
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdueBorrows.length}</div>
          <div class="stat-label">Quá hạn</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">💰</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(totalFine)}</div>
          <div class="stat-label">Tổng tiền phạt</div>
        </div>
      </div>
    </div>

    ${overdueBorrows.length > 0 ? `
      <div class="alert-box alert-danger">
        ⚠️ Bạn có <strong>${overdueBorrows.length}</strong> phiếu mượn quá hạn! Vui lòng trả sách ngay để tránh phạt thêm.
      </div>
    ` : ''}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📋 Sách đang mượn</div>
          <button class="btn btn-secondary btn-sm" onclick="navigateTo('my-borrows')">Xem tất cả</button>
        </div>
        ${activeBorrows.length === 0 ? `
          <div class="empty-state" style="padding:30px 20px;">
            <div class="empty-icon">📭</div>
            <div>Bạn chưa mượn sách nào</div>
          </div>
        ` : activeBorrows.slice(0, 3).map(b => {
    const books = DB.get('books');
    const bookTitles = b.bookIds.map(id => books.find(bk => bk.id === id)?.title || '?').join(', ');
    const isOverdue = b.dueDate < today;
    return `
            <div class="activity-item" style="border:1px solid ${isOverdue ? 'rgba(244,63,94,0.2)' : 'var(--border)'};border-radius:8px;margin-bottom:8px;padding:12px;">
              <div class="activity-icon" style="background:${isOverdue ? 'rgba(244,63,94,0.1)' : 'rgba(79,142,247,0.1)'};">${isOverdue ? '⚠️' : '📖'}</div>
              <div class="activity-text">
                <div class="activity-title">${bookTitles}</div>
                <div class="activity-subtitle">Hạn trả: ${fmtDate(b.dueDate)} ${isOverdue ? '<span style="color:var(--accent-rose);">– QUÁ HẠN</span>' : ''}</div>
              </div>
            </div>
          `;
  }).join('')}
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">📚 Sách mới nhất</div>
          <button class="btn btn-primary btn-sm" onclick="navigateTo('books')">Tìm sách</button>
        </div>
        ${DB.get('books').slice(-4).map(b => {
    const cat = DB.get('categories').find(c => c.id === b.categoryId);
    return `
            <div class="activity-item" style="cursor:pointer;" onclick="showBookDetail('${b.id}')">
              <div class="activity-icon" style="background:rgba(139,92,246,0.1);">📗</div>
              <div class="activity-text">
                <div class="activity-title">${b.title}</div>
                <div class="activity-subtitle">${cat?.name || ''} · ${b.available > 0 ? '<span style="color:var(--accent-green)">Có sẵn</span>' : '<span style="color:var(--accent-rose)">Hết</span>'}</div>
              </div>
            </div>
          `;
  }).join('')}
      </div>
    </div>
  `;
}

