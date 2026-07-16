// ==================== BORROW PROCESS ====================
function renderBorrowProcess() {
  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">📖 Mượn Sách</div>
        <div class="section-subtitle">Tạo phiếu mượn sách mới cho thành viên</div>
      </div>
    </div>
    <div class="card" style="max-width:700px;margin:0 auto;">
      <div class="card-header" style="margin-bottom:8px;">
        <div class="card-title">📝 Thông tin phiếu mượn</div>
      </div>
      <div style="color:var(--text-secondary);font-size:13px;margin-bottom:20px;">Điền thông tin bên dưới để tạo phiếu mượn sách mới.</div>
      <form onsubmit="processBorrowInline(event)">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Thành viên *</label>
            <select class="form-control" id="borrowMemberInline" required>
              <option value="">-- Chọn thành viên --</option>
              ${DB.get('members').filter(m => m.status === 'active').map(m => `<option value="${m.id}">${m.name} (${m.code})</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Ngày hết hạn</label>
            <input class="form-control" type="date" id="borrowDueDateInline" value="${getDefaultDueDate()}" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Tìm & chọn sách *</label>
          <input class="form-control" type="text" id="borrowBookSearchInline" placeholder="Nhập tên sách hoặc ISBN..." oninput="searchBorrowBooksInline(this.value)" />
        </div>
        <div id="borrowBookListInline" style="max-height:220px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:16px;display:none;"></div>
        <div id="selectedBooksInline" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;"></div>
        <div id="borrowWarningInline"></div>
        <div style="display:flex;gap:12px;justify-content:flex-end;">
          <button type="button" class="btn btn-secondary" onclick="navigateTo('dashboard')">Hủy</button>
          <button type="submit" class="btn btn-success">✅ Xác nhận mượn</button>
        </div>
      </form>
    </div>
  `;

  window._selectedBorrowBooksInline = [];

  window.searchBorrowBooksInline = (val) => {
    const list = document.getElementById('borrowBookListInline');
    if (!val.trim()) { list.style.display = 'none'; return; }
    const books = DB.get('books').filter(b => b.available > 0 && (b.title.toLowerCase().includes(val.toLowerCase()) || b.isbn.includes(val)));
    if (books.length === 0) { list.innerHTML = '<div style="padding:12px;color:var(--text-muted);text-align:center;">Không tìm thấy sách có sẵn</div>'; list.style.display = ''; return; }
    list.style.display = '';
    list.innerHTML = books.map(b => `
      <div style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;transition:background 0.15s;" onmouseenter="this.style.background='rgba(79,142,247,0.05)'" onmouseleave="this.style.background=''" onclick="addBorrowBookInline('${b.id}')">
        <div>
          <div style="font-size:13px;font-weight:500;">${b.title}</div>
          <div style="font-size:11px;color:var(--text-muted);">ISBN: ${b.isbn} · Còn: ${b.available}</div>
        </div>
        <button type="button" class="btn btn-primary btn-sm">+ Chọn</button>
      </div>
    `).join('');
  };

  window.addBorrowBookInline = (bookId) => {
    const config = DB.getObj('config');
    if (window._selectedBorrowBooksInline.includes(bookId)) { showToast('Sách đã được chọn', 'warning'); return; }
    if (window._selectedBorrowBooksInline.length >= config.maxBooksPerMember) {
      showToast(`Tối đa ${config.maxBooksPerMember} sách mỗi lần mượn`, 'warning'); return;
    }
    window._selectedBorrowBooksInline.push(bookId);
    renderSelectedBooksInline();
    document.getElementById('borrowBookSearchInline').value = '';
    document.getElementById('borrowBookListInline').style.display = 'none';
  };

  window.removeBorrowBookInline = (bookId) => {
    window._selectedBorrowBooksInline = window._selectedBorrowBooksInline.filter(id => id !== bookId);
    renderSelectedBooksInline();
  };

  window.renderSelectedBooksInline = () => {
    const container = document.getElementById('selectedBooksInline');
    const books = DB.get('books');
    if (window._selectedBorrowBooksInline.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = window._selectedBorrowBooksInline.map(id => {
      const b = books.find(x => x.id === id);
      return `<div style="display:flex;align-items:center;gap:8px;background:rgba(79,142,247,0.1);border:1px solid rgba(79,142,247,0.2);border-radius:20px;padding:4px 12px;font-size:12px;">
        📗 ${b?.title || '?'}
        <span style="cursor:pointer;color:var(--accent-rose);font-weight:700;" onclick="removeBorrowBookInline('${id}')">×</span>
      </div>`;
    }).join('');
  };

  window.processBorrowInline = (e) => {
    e.preventDefault();
    const memberId = document.getElementById('borrowMemberInline').value;
    const dueDate = document.getElementById('borrowDueDateInline').value;
    if (!memberId) { showToast('Vui lòng chọn thành viên', 'error'); return; }
    if (window._selectedBorrowBooksInline.length === 0) { showToast('Vui lòng chọn ít nhất 1 sách', 'error'); return; }

    const books = DB.get('books');
    const borrows = DB.get('borrows');
    const config = DB.getObj('config');

    // Check member's current borrows
    const memberCurrentBorrows = borrows.filter(b => b.memberId === memberId && !b.returnDate);
    if (memberCurrentBorrows.length + window._selectedBorrowBooksInline.length > config.maxBooksPerMember) {
      showToast(`Thành viên đã mượn quá số lượng cho phép (${config.maxBooksPerMember} sách)`, 'error'); return;
    }

    // Create borrow
    const newBorrow = {
      id: 'br' + Date.now(),
      memberId,
      librarianId: currentUser.librarianId || 'lib1',
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || getDefaultDueDate(),
      returnDate: null,
      status: 'borrowing',
      note: '',
      fine: 0,
      bookIds: window._selectedBorrowBooksInline,
    };

    borrows.push(newBorrow);
    DB.set('borrows', borrows);

    // Update book availability
    window._selectedBorrowBooksInline.forEach(bookId => {
      const idx = books.findIndex(b => b.id === bookId);
      if (idx >= 0) {
        books[idx].available = Math.max(0, books[idx].available - 1);
        if (books[idx].available === 0) books[idx].status = 'borrowed';
      }
    });
    DB.set('books', books);

    showToast(`✅ Đã tạo phiếu mượn thành công! Mã: ${newBorrow.id}`, 'success');
    window._selectedBorrowBooksInline = [];
    navigateTo('borrows');
  };
}

