// ==================== RETURN PROCESS ====================
function renderReturnProcess() {
  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">🔄 Trả Sách</div>
        <div class="section-subtitle">Xử lý trả sách và tính phí phạt nếu có</div>
      </div>
    </div>
    <div class="card" style="max-width:700px;margin:0 auto;">
      <div class="form-group">
        <label class="form-label">🔍 Tìm phiếu mượn (theo mã hoặc tên thành viên)</label>
        <input class="form-control" type="text" id="returnSearchInline" placeholder="Nhập mã phiếu hoặc tên thành viên..." oninput="searchReturnBorrowInline(this.value)" />
      </div>
      <div id="returnResultsInline"></div>
    </div>
  `;

  window.searchReturnBorrowInline = (val) => {
    const container = document.getElementById('returnResultsInline');
    if (!val.trim()) { container.innerHTML = ''; return; }
    const borrows = DB.get('borrows').filter(b => !b.returnDate);
    const members = DB.get('members');
    const books = DB.get('books');
    const today = new Date().toISOString().split('T')[0];
    const config = DB.getObj('config');

    const filtered = borrows.filter(b => {
      const m = members.find(m => m.id === b.memberId);
      return b.id.toLowerCase().includes(val.toLowerCase()) || (m && m.name.toLowerCase().includes(val.toLowerCase()));
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state" style="padding:30px;"><div class="empty-icon">🔍</div><h3>Không tìm thấy phiếu mượn</h3><p>Hãy kiểm tra lại mã hoặc tên thành viên</p></div>`;
      return;
    }

    container.innerHTML = filtered.map(b => {
      const member = members.find(m => m.id === b.memberId);
      const bookTitles = b.bookIds.map(id => books.find(bk => bk.id === id)?.title || '?').join(', ');
      const isOverdue = b.dueDate < today;
      const lateDays = isOverdue ? Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000) : 0;
      const lateFine = lateDays * config.finePerDay;

      return `
        <div style="border:1px solid ${isOverdue ? 'rgba(244,63,94,0.3)' : 'var(--border)'};border-radius:var(--radius-md);padding:16px;margin-bottom:12px;background:${isOverdue ? 'rgba(244,63,94,0.03)' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div>
              <code style="color:var(--accent-blue);font-size:13px;">${b.id}</code>
              <div style="font-size:15px;font-weight:600;margin-top:4px;">${member?.name || '?'}</div>
              <div style="font-size:12px;color:var(--text-muted);">📗 ${bookTitles}</div>
            </div>
            ${isOverdue ? `<span class="badge badge-overdue">⚠️ Quá hạn ${lateDays} ngày</span>` : '<span class="badge badge-borrowed">📖 Đang mượn</span>'}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;font-size:12px;">
            <div><span style="color:var(--text-muted)">Ngày mượn: </span>${fmtDate(b.borrowDate)}</div>
            <div><span style="color:var(--text-muted)">Hạn trả: </span><span style="color:${isOverdue ? 'var(--accent-rose)' : 'inherit'}">${fmtDate(b.dueDate)}</span></div>
            <div><span style="color:var(--text-muted)">Tiền phạt: </span><strong style="color:var(--accent-amber)">${isOverdue ? fmtMoney(lateFine) : 'Không có'}</strong></div>
          </div>
          <div style="display:flex;gap:12px;align-items:center;">
            <select class="form-control" id="condition_${b.id}" style="flex:1;max-width:200px;">
              <option value="good">Tình trạng: Tốt</option>
              <option value="damaged">Có hư hại (+50% giá sách)</option>
              <option value="lost">Báo mất (+100% giá sách)</option>
            </select>
            <button class="btn btn-success" onclick="confirmReturn('${b.id}')">✅ Xác nhận trả</button>
          </div>
        </div>
      `;
    }).join('');
  };

  window.confirmReturn = (borrowId) => {
    const borrows = DB.get('borrows');
    const books = DB.get('books');
    const today = new Date().toISOString().split('T')[0];
    const config = DB.getObj('config');
    const condition = document.getElementById('condition_' + borrowId)?.value || 'good';

    const idx = borrows.findIndex(b => b.id === borrowId);
    if (idx < 0) return;

    const borrow = borrows[idx];
    const isOverdue = borrow.dueDate < today;
    const lateDays = isOverdue ? Math.ceil((new Date(today) - new Date(borrow.dueDate)) / 86400000) : 0;
    let fine = lateDays * config.finePerDay;

    if (condition === 'damaged') fine += 50000;
    else if (condition === 'lost') fine += 200000;

    borrows[idx] = { ...borrow, returnDate: today, status: 'returned', fine, note: `Tình trạng: ${condition}` };
    DB.set('borrows', borrows);

    // Update book availability
    borrow.bookIds.forEach(bookId => {
      const bidx = books.findIndex(b => b.id === bookId);
      if (bidx >= 0) {
        if (condition === 'lost') { books[bidx].status = 'lost'; }
        else if (condition === 'damaged') { books[bidx].status = 'damaged'; }
        else { books[bidx].available = Math.min(books[bidx].quantity, books[bidx].available + 1); if (books[bidx].available > 0) books[bidx].status = 'available'; }
      }
    });
    DB.set('books', books);

    const msg = fine > 0 ? `✅ Đã xác nhận trả! Tiền phạt: ${fmtMoney(fine)}` : '✅ Đã xác nhận trả sách thành công!';
    showToast(msg, fine > 0 ? 'warning' : 'success');
    navigateTo('borrows');
  };
}

