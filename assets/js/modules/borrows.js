// ==================== BORROWS ====================
function renderBorrows() {
  const borrows = DB.get('borrows');
  const members = DB.get('members');
  const books = DB.get('books');
  const today = new Date().toISOString().split('T')[0];
  let activeTab = 'all';

  const renderBorrowTable = (list) => {
    if (list.length === 0) return `<div class="empty-state"><div class="empty-icon">📋</div><h3>Không có phiếu mượn</h3></div>`;
    return `
      <div class="table-container">
        <table>
          <thead><tr><th>Mã phiếu</th><th>Thành viên</th><th>Sách mượn</th><th>Ngày mượn</th><th>Hạn trả</th><th>Trả lúc</th><th>Trạng thái</th><th>Phạt</th></tr></thead>
          <tbody>
            ${list.map(b => {
      const member = members.find(m => m.id === b.memberId);
      const bookTitles = b.bookIds.map(id => books.find(bk => bk.id === id)?.title || '?').join(', ');
      const isOverdue = !b.returnDate && b.dueDate < today;
      const statusMap = {
        borrowing: '<span class="badge badge-borrowed">📖 Đang mượn</span>',
        returned: '<span class="badge badge-available">✅ Đã trả</span>',
        overdue: '<span class="badge badge-overdue">⚠️ Quá hạn</span>',
      };
      const status = isOverdue ? 'overdue' : (b.status || 'borrowing');
      return `
                <tr style="${isOverdue ? 'background:rgba(244,63,94,0.03);' : ''}">
                  <td><code style="font-size:11px;color:var(--accent-blue)">${b.id}</code></td>
                  <td><strong>${member?.name || '?'}</strong><br><small style="color:var(--text-muted)">${member?.code || ''}</small></td>
                  <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${bookTitles}">${bookTitles}</td>
                  <td>${fmtDate(b.borrowDate)}</td>
                  <td style="color:${isOverdue ? 'var(--accent-rose)' : 'inherit'};font-weight:${isOverdue ? '700' : '400'}">${fmtDate(b.dueDate)}</td>
                  <td>${b.returnDate ? fmtDate(b.returnDate) : '—'}</td>
                  <td>${statusMap[status] || statusMap['borrowing']}</td>
                  <td>${b.fine ? `<strong style="color:var(--accent-amber)">${fmtMoney(b.fine)}</strong>` : '—'}</td>
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
        <div class="section-title">📋 Danh sách Phiếu mượn</div>
        <div class="section-subtitle">Theo dõi tất cả giao dịch mượn/trả sách</div>
      </div>
      ${currentUser.role !== 'Member' ? `<button class="btn btn-primary" onclick="openModal('modalBorrow');initBorrowModal()">+ Tạo phiếu mượn</button>` : ''}
    </div>
    <div class="tabs">
      <button class="tab-btn active" id="tab-all" onclick="switchBorrowTab('all')">Tất cả (${borrows.length})</button>
      <button class="tab-btn" id="tab-borrowing" onclick="switchBorrowTab('borrowing')">Đang mượn (${borrows.filter(b => !b.returnDate && b.dueDate >= today).length})</button>
      <button class="tab-btn" id="tab-overdue" onclick="switchBorrowTab('overdue')">Quá hạn (${borrows.filter(b => !b.returnDate && b.dueDate < today).length})</button>
      <button class="tab-btn" id="tab-returned" onclick="switchBorrowTab('returned')">Đã trả (${borrows.filter(b => b.returnDate).length})</button>
    </div>
    <div id="borrowTableContainer">${renderBorrowTable(borrows)}</div>
  `;

  window.switchBorrowTab = (tab) => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab)?.classList.add('active');
    let filtered;
    if (tab === 'all') filtered = borrows;
    else if (tab === 'borrowing') filtered = borrows.filter(b => !b.returnDate && b.dueDate >= today);
    else if (tab === 'overdue') filtered = borrows.filter(b => !b.returnDate && b.dueDate < today);
    else filtered = borrows.filter(b => b.returnDate);
    document.getElementById('borrowTableContainer').innerHTML = renderBorrowTable(filtered);
  };
}

