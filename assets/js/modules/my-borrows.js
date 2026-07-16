// ==================== MY BORROWS (Student) ====================
function renderMyBorrows() {
  const members = DB.get('members');
  const member = members.find(m => m.accountId === currentUser.id || m.id === currentUser.memberId);
  const borrows = member ? DB.get('borrows').filter(b => b.memberId === member.id) : [];
  const books = DB.get('books');
  const today = new Date().toISOString().split('T')[0];

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">📖 Lịch sử Mượn sách</div>
        <div class="section-subtitle">Xem lại tất cả các lần bạn đã mượn sách</div>
      </div>
    </div>

    ${borrows.length === 0 ? `
      <div class="empty-state">
        <div class="empty-icon">📚</div>
        <h3>Bạn chưa mượn sách nào</h3>
        <p>Hãy tìm kiếm và yêu cầu mượn sách từ thủ thư</p>
        <button class="btn btn-primary" onclick="navigateTo('books')" style="margin-top:16px;">🔍 Tìm kiếm sách</button>
      </div>
    ` : `
      <div style="display:flex;flex-direction:column;gap:16px;">
        ${borrows.slice().reverse().map(b => {
    const bookTitles = b.bookIds.map(id => books.find(bk => bk.id === id)?.title || '?');
    const isOverdue = !b.returnDate && b.dueDate < today;
    const isReturned = !!b.returnDate;
    let statusLabel, statusClass;
    if (isReturned) { statusLabel = '✅ Đã trả'; statusClass = 'badge-available'; }
    else if (isOverdue) { statusLabel = '⚠️ Quá hạn'; statusClass = 'badge-overdue'; }
    else { statusLabel = '📖 Đang mượn'; statusClass = 'badge-borrowed'; }

    return `
            <div class="card" style="${isOverdue ? 'border-color:rgba(244,63,94,0.3);background:rgba(244,63,94,0.02);' : ''}">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
                <div>
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                    <code style="color:var(--accent-blue);font-size:12px;">${b.id}</code>
                    <span class="badge ${statusClass}">${statusLabel}</span>
                    ${isOverdue ? '<span class="badge badge-overdue">Cần trả ngay!</span>' : ''}
                  </div>
                  ${bookTitles.map(t => `<div style="font-size:15px;font-weight:600;margin-bottom:4px;">📗 ${t}</div>`).join('')}
                </div>
                ${b.fine > 0 ? `<div style="text-align:right;"><div style="font-size:11px;color:var(--text-muted)">Tiền phạt</div><div style="font-size:20px;font-weight:700;color:var(--accent-amber)">${fmtMoney(b.fine)}</div></div>` : ''}
              </div>
              <div style="display:flex;gap:24px;margin-top:12px;font-size:13px;color:var(--text-secondary);flex-wrap:wrap;">
                <div>📅 Ngày mượn: <strong style="color:var(--text-primary)">${fmtDate(b.borrowDate)}</strong></div>
                <div>⏰ Hạn trả: <strong style="color:${isOverdue ? 'var(--accent-rose)' : 'var(--text-primary)'}">${fmtDate(b.dueDate)}</strong></div>
                ${b.returnDate ? `<div>✅ Ngày trả: <strong style="color:var(--text-primary)">${fmtDate(b.returnDate)}</strong></div>` : ''}
              </div>
              ${b.note ? `<div style="margin-top:8px;font-size:12px;color:var(--text-muted);">📝 ${b.note}</div>` : ''}
            </div>
          `;
  }).join('')}
      </div>
    `}
  `;
}

