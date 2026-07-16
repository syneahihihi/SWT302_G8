// ==================== REPORTS ====================
function renderReports() {
  const borrows = DB.get('borrows');
  const books = DB.get('books');
  const members = DB.get('members');
  const today = new Date().toISOString().split('T')[0];

  // Top borrowed books
  const bookBorrowCount = {};
  borrows.forEach(b => b.bookIds.forEach(id => { bookBorrowCount[id] = (bookBorrowCount[id] || 0) + 1; }));
  const topBooks = Object.entries(bookBorrowCount).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Top members
  const memberBorrowCount = {};
  borrows.forEach(b => { memberBorrowCount[b.memberId] = (memberBorrowCount[b.memberId] || 0) + 1; });
  const topMembers = Object.entries(memberBorrowCount).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Monthly stats
  const monthStats = getLast7MonthBorrows(borrows);
  const totalFine = borrows.reduce((s, b) => s + (b.fine || 0), 0);
  const overdue = borrows.filter(b => !b.returnDate && b.dueDate < today).length;

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">📈 Báo cáo Thống kê</div>
        <div class="section-subtitle">Tổng quan và phân tích hoạt động thư viện</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="stat-icon blue">📖</div>
        <div class="stat-info">
          <div class="stat-value">${borrows.length}</div>
          <div class="stat-label">Tổng lượt mượn</div>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon green">✅</div>
        <div class="stat-info">
          <div class="stat-value">${borrows.filter(b => b.returnDate).length}</div>
          <div class="stat-label">Lượt trả thành công</div>
        </div>
      </div>
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdue}</div>
          <div class="stat-label">Đang quá hạn</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">💰</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(totalFine)}</div>
          <div class="stat-label">Doanh thu phạt</div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-bottom:24px;">
      <div class="card">
        <div class="card-header">
          <div class="card-title">📊 Lượt mượn 7 tháng gần đây</div>
        </div>
        <div class="chart-bar-container" id="reportChart"></div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">📚 Kho sách</div>
        </div>
        <div class="info-row"><span class="info-label">Tổng đầu sách</span><strong>${books.length}</strong></div>
        <div class="info-row"><span class="info-label">Có sẵn</span><strong style="color:var(--accent-green)">${books.filter(b => b.available > 0).length}</strong></div>
        <div class="info-row"><span class="info-label">Hỏng</span><strong style="color:var(--accent-amber)">${books.filter(b => b.status === 'damaged').length}</strong></div>
        <div class="info-row"><span class="info-label">Mất</span><strong style="color:var(--accent-rose)">${books.filter(b => b.status === 'lost').length}</strong></div>
        <div class="info-row"><span class="info-label">Thành viên</span><strong>${members.length}</strong></div>
        <div class="info-row"><span class="info-label">Đang hoạt động</span><strong style="color:var(--accent-green)">${members.filter(m => m.status === 'active').length}</strong></div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div class="card">
        <div class="card-header"><div class="card-title">🏆 Sách được mượn nhiều nhất</div></div>
        ${topBooks.map(([bookId, count], i) => {
    const book = books.find(b => b.id === bookId);
    const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
    return `
            <div class="report-row">
              <div class="report-rank ${rankClass}">${i + 1}</div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${book?.title || '?'}</div>
              </div>
              <div style="font-size:13px;font-weight:700;color:var(--accent-blue)">${count} lần</div>
            </div>
          `;
  }).join('')}
        ${topBooks.length === 0 ? '<div class="empty-state" style="padding:20px;"><div class="empty-icon">📚</div><div>Chưa có dữ liệu</div></div>' : ''}
      </div>
      <div class="card">
        <div class="card-header"><div class="card-title">👑 Thành viên mượn nhiều nhất</div></div>
        ${topMembers.map(([memberId, count], i) => {
    const m = members.find(x => x.id === memberId);
    const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
    return `
            <div class="report-row">
              <div class="report-rank ${rankClass}">${i + 1}</div>
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:500;">${m?.name || '?'}</div>
                <div style="font-size:11px;color:var(--text-muted)">${m?.code || ''}</div>
              </div>
              <div style="font-size:13px;font-weight:700;color:var(--accent-purple)">${count} lần</div>
            </div>
          `;
  }).join('')}
        ${topMembers.length === 0 ? '<div class="empty-state" style="padding:20px;"><div class="empty-icon">👥</div><div>Chưa có dữ liệu</div></div>' : ''}
      </div>
    </div>
  `;

  setTimeout(() => renderBorrowChart(monthStats, 'reportChart'), 100);
}

