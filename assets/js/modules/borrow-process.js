// ==================== BORROW PROCESS (API) ====================
async function renderBorrowProcess() {
  try {
    const [membersRes, booksRes, libRes] = await Promise.all([
      fetch('http://localhost:8080/api/members'),
      fetch('http://localhost:8080/api/books'),
      fetch('http://localhost:8080/api/librarians')
    ]);
    const members = await membersRes.json();
    window._availableBooks = await booksRes.json();
    window._librarians = await libRes.json();

    document.getElementById('pageContent').innerHTML = `
      <div class="section-header">
        <div>
          <div class="section-title">📖 Mượn Sách</div>
          <div class="section-subtitle">Tạo phiếu mượn sách mới cho thành viên</div>
        </div>
      </div>
      <div class="card" style="max-width:700px;margin:0 auto;">
        <form onsubmit="processBorrowInline(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Thành viên *</label>
              <select class="form-control" id="borrowMemberInline" required>
                <option value="">-- Chọn thành viên --</option>
                ${members.filter(m => m.status === 'active').map(m => `<option value="${m.id}">${m.account?.fullname || '?'} (${m.code})</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Ghi chú</label>
              <input class="form-control" type="text" id="borrowNoteInline" placeholder="Ghi chú (tùy chọn)" />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Tìm & chọn sách *</label>
            <input class="form-control" type="text" id="borrowBookSearchInline" placeholder="Nhập tên sách hoặc ISBN..." oninput="searchBorrowBooksInline(this.value)" />
          </div>
          <div id="borrowBookListInline" style="max-height:220px;overflow-y:auto;border:1px solid var(--border);margin-bottom:16px;display:none;"></div>
          <div id="selectedBooksInline" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px;"></div>
          <div style="display:flex;gap:12px;justify-content:flex-end;">
            <button type="button" class="btn btn-secondary" onclick="navigateTo('borrows')">Hủy</button>
            <button type="submit" class="btn btn-success">✅ Xác nhận mượn</button>
          </div>
        </form>
      </div>
    `;

    window._selectedBorrowBooksInline = [];

    window.searchBorrowBooksInline = (val) => {
      const list = document.getElementById('borrowBookListInline');
      if (!val.trim()) { list.style.display = 'none'; return; }
      const books = window._availableBooks.filter(b => b.available > 0 && (b.title.toLowerCase().includes(val.toLowerCase()) || b.isbn.includes(val)));
      if (books.length === 0) { list.innerHTML = '<div style="padding:12px;text-align:center;">Không tìm thấy sách có sẵn</div>'; list.style.display = ''; return; }
      list.style.display = '';
      list.innerHTML = books.map(b => `
        <div style="padding:10px 14px;cursor:pointer;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;" onclick="addBorrowBookInline('${b.id}')">
          <div>
            <div style="font-size:13px;font-weight:500;">${b.title}</div>
            <div style="font-size:11px;color:var(--text-muted);">ISBN: ${b.isbn} · Còn: ${b.available}</div>
          </div>
          <button type="button" class="btn btn-primary btn-sm">+ Chọn</button>
        </div>
      `).join('');
    };

    window.addBorrowBookInline = (bookId) => {
      if (window._selectedBorrowBooksInline.includes(parseInt(bookId))) return;
      window._selectedBorrowBooksInline.push(parseInt(bookId));
      renderSelectedBooksInline();
      document.getElementById('borrowBookSearchInline').value = '';
      document.getElementById('borrowBookListInline').style.display = 'none';
    };

    window.removeBorrowBookInline = (bookId) => {
      window._selectedBorrowBooksInline = window._selectedBorrowBooksInline.filter(id => id != bookId);
      renderSelectedBooksInline();
    };

    window.renderSelectedBooksInline = () => {
      const container = document.getElementById('selectedBooksInline');
      container.innerHTML = window._selectedBorrowBooksInline.map(id => {
        const b = window._availableBooks.find(x => x.id == id);
        return `<div style="display:flex;gap:8px;background:rgba(79,142,247,0.1);border-radius:20px;padding:4px 12px;font-size:12px;">
          📗 ${b?.title || '?'}
          <span style="cursor:pointer;color:var(--accent-rose);font-weight:700;" onclick="removeBorrowBookInline('${id}')">×</span>
        </div>`;
      }).join('');
    };

    window.processBorrowInline = async (e) => {
      e.preventDefault();
      const memberId = document.getElementById('borrowMemberInline').value;
      if (!memberId || window._selectedBorrowBooksInline.length === 0) { showToast('Chọn thành viên và ít nhất 1 sách', 'error'); return; }

      // Determine correct librarian ID
      let currentLib = window._librarians.find(l => l.account && l.account.id === currentUser.id);
      let libId = currentLib ? currentLib.id : (window._librarians.length > 0 ? window._librarians[0].id : 1);

      const payload = {
        memberId: parseInt(memberId),
        librarianId: libId,
        note: document.getElementById('borrowNoteInline').value,
        bookIds: window._selectedBorrowBooksInline
      };

      try {
        const res = await fetch('http://localhost:8080/api/borrows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(await res.text());
        showToast(`✅ Tạo phiếu mượn thành công!`, 'success');
        navigateTo('borrows');
      } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
      }
    };
  } catch(e) {
    showToast('Lỗi tải dữ liệu', 'error');
  }
}
