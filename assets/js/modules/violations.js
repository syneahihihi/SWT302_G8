// ==================== VIOLATIONS ====================
function renderViolations() {
  const borrows = DB.get('borrows');
  const members = DB.get('members');
  const books = DB.get('books');
  const today = new Date().toISOString().split('T')[0];
  const config = DB.getObj('config');

  const overdueBorrows = borrows.filter(b => !b.returnDate && b.dueDate < today);
  const fineBorrows = borrows.filter(b => b.fine > 0);
  const totalFine = fineBorrows.reduce((s, b) => s + b.fine, 0);

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">⚠️ Quản lý Vi phạm</div>
        <div class="section-subtitle">Theo dõi các trường hợp vi phạm và thu phạt</div>
      </div>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);">
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdueBorrows.length}</div>
          <div class="stat-label">Quá hạn chưa trả</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">💰</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(totalFine)}</div>
          <div class="stat-label">Tổng tiền phạt đã thu</div>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon purple">📋</div>
        <div class="stat-info">
          <div class="stat-value">${fineBorrows.length}</div>
          <div class="stat-label">Phiếu có phạt</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title">📋 Phiếu mượn quá hạn</div>
        <span class="badge badge-overdue">${overdueBorrows.length} phiếu</span>
      </div>
      ${overdueBorrows.length === 0 ? `
        <div class="empty-state" style="padding:30px;">
          <div class="empty-icon">✅</div>
          <h3>Không có vi phạm</h3>
          <p>Tất cả phiếu mượn đều trong hạn</p>
        </div>
      ` : `
        <div class="table-container">
          <table>
            <thead><tr><th>Mã phiếu</th><th>Thành viên</th><th>Sách</th><th>Hạn trả</th><th>Quá hạn</th><th>Tiền phạt dự kiến</th><th>Hành động</th></tr></thead>
            <tbody>
              ${overdueBorrows.map(b => {
    const member = members.find(m => m.id === b.memberId);
    const bookTitles = b.bookIds.map(id => books.find(bk => bk.id === id)?.title || '?').join(', ');
    const lateDays = Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000);
    const fine = lateDays * config.finePerDay;
    return `
                  <tr style="background:rgba(244,63,94,0.03);">
                    <td><code style="color:var(--accent-blue)">${b.id}</code></td>
                    <td><strong>${member?.name || '?'}</strong><br><small style="color:var(--text-muted)">${member?.email || ''}</small></td>
                    <td style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${bookTitles}</td>
                    <td style="color:var(--accent-rose);font-weight:600">${fmtDate(b.dueDate)}</td>
                    <td><span class="badge badge-overdue">${lateDays} ngày</span></td>
                    <td><strong style="color:var(--accent-amber)">${fmtMoney(fine)}</strong></td>
                    <td>
                      <button class="btn btn-sm btn-success" onclick="quickReturn('${b.id}')">🔄 Xử lý trả</button>
                    </td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>

    <div class="card" style="margin-top:24px;">
      <div class="card-header">
        <div class="card-title">💰 Lịch sử phiếu có phạt</div>
      </div>
      ${fineBorrows.length === 0 ? '<div class="empty-state" style="padding:30px;"><div class="empty-icon">💰</div><h3>Chưa có phiếu phạt</h3></div>' : `
        <div class="table-container">
          <table>
            <thead><tr><th>Mã phiếu</th><th>Thành viên</th><th>Ngày trả</th><th>Ghi chú</th><th>Tiền phạt</th></tr></thead>
            <tbody>
              ${fineBorrows.map(b => {
    const m = members.find(x => x.id === b.memberId);
    return `
                  <tr>
                    <td><code style="color:var(--accent-blue)">${b.id}</code></td>
                    <td>${m?.name || '?'}</td>
                    <td>${fmtDate(b.returnDate)}</td>
                    <td style="color:var(--text-secondary)">${b.note || '—'}</td>
                    <td><strong style="color:var(--accent-amber)">${fmtMoney(b.fine)}</strong></td>
                  </tr>
                `;
  }).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;

  window.quickReturn = (borrowId) => {
    navigateTo('return-process');
    setTimeout(() => {
      const input = document.getElementById('returnSearchInline');
      if (input) { input.value = borrowId; window.searchReturnBorrowInline(borrowId); }
    }, 100);
  };
}

