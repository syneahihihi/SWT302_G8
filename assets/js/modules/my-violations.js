// ==================== MY VIOLATIONS (Student) ====================
function renderMyViolations() {
  const members = DB.get('members');
  const member = members.find(m => m.accountId === currentUser.id || m.id === currentUser.memberId);
  const borrows = member ? DB.get('borrows').filter(b => b.memberId === member.id) : [];
  const today = new Date().toISOString().split('T')[0];
  const config = DB.getObj('config');

  const overdueBorrows = borrows.filter(b => !b.returnDate && b.dueDate < today);
  const fineBorrows = borrows.filter(b => b.fine > 0);
  const totalFine = fineBorrows.reduce((s, b) => s + b.fine, 0);

  const pendingFine = overdueBorrows.reduce((s, b) => {
    const days = Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000);
    return s + days * config.finePerDay;
  }, 0);

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">⚠️ Vi phạm & Phạt</div>
        <div class="section-subtitle">Theo dõi các vi phạm và tiền phạt của bạn</div>
      </div>
    </div>

    <div class="stats-grid" style="grid-template-columns:repeat(3,1fr);">
      <div class="stat-card rose">
        <div class="stat-icon rose">⚠️</div>
        <div class="stat-info">
          <div class="stat-value">${overdueBorrows.length}</div>
          <div class="stat-label">Đang quá hạn</div>
        </div>
      </div>
      <div class="stat-card amber">
        <div class="stat-icon amber">💰</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(pendingFine)}</div>
          <div class="stat-label">Phạt dự kiến hiện tại</div>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-icon purple">📋</div>
        <div class="stat-info">
          <div class="stat-value">${fmtMoney(totalFine)}</div>
          <div class="stat-label">Tổng đã phạt</div>
        </div>
      </div>
    </div>

    ${overdueBorrows.length > 0 ? `
      <div class="alert-box alert-danger">
        ⚠️ Bạn có ${overdueBorrows.length} phiếu quá hạn với tiền phạt dự kiến ${fmtMoney(pendingFine)}. Vui lòng mang sách đến thư viện để trả ngay!
      </div>
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header"><div class="card-title">📋 Phiếu đang quá hạn</div></div>
        ${overdueBorrows.map(b => {
    const bks = DB.get('books');
    const bookTitles = b.bookIds.map(id => bks.find(bk => bk.id === id)?.title || '?').join(', ');
    const lateDays = Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000);
    const fine = lateDays * config.finePerDay;
    return `
            <div class="violation-card">
              <div class="violation-header">
                <div class="violation-title">📗 ${bookTitles}</div>
                <div class="violation-fine">${fmtMoney(fine)}</div>
              </div>
              <div style="font-size:13px;color:var(--text-secondary);">
                Hạn trả: ${fmtDate(b.dueDate)} · Quá hạn: <strong style="color:var(--accent-rose)">${lateDays} ngày</strong> · Phạt: ${fmtMoney(config.finePerDay)}/ngày
              </div>
            </div>
          `;
  }).join('')}
      </div>
    ` : `
      <div class="alert-box alert-success">✅ Bạn hiện không có vi phạm nào. Hãy tiếp tục duy trì!</div>
    `}

    <div class="card">
      <div class="card-header"><div class="card-title">📜 Lịch sử phạt</div></div>
      ${fineBorrows.length === 0 ? `<div class="empty-state" style="padding:30px;"><div class="empty-icon">😊</div><h3>Chưa có lịch sử phạt</h3></div>` : `
        <div class="table-container">
          <table>
            <thead><tr><th>Mã phiếu</th><th>Sách</th><th>Ngày trả</th><th>Ghi chú</th><th>Tiền phạt</th></tr></thead>
            <tbody>
              ${fineBorrows.map(b => {
    const bks = DB.get('books');
    const bookTitles = b.bookIds.map(id => bks.find(bk => bk.id === id)?.title || '?').join(', ');
    return `
                  <tr>
                    <td><code style="color:var(--accent-blue)">${b.id}</code></td>
                    <td>${bookTitles}</td>
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
}

