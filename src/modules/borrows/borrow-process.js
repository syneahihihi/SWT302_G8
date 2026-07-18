import { state } from '../../core/state.js';
import { showToast } from '../../core/toast.js';
import { navigateTo } from '../../core/router.js';

export async function renderBorrowProcess() {
  try {
    const [membersRes, booksRes, libRes] = await Promise.all([
      fetch('/members'),
      fetch('/books'),
      fetch('/librarians')
    ]);
    
    const members = await membersRes.json();
    window._availableBooks = await booksRes.json();
    window._librarians = await libRes.json();

    document.getElementById('pageContent').innerHTML = `
      <div class="mb-4">
        <h3 class="text-light fw-bold mb-1"><i class="bi bi-journal-arrow-down text-primary me-2"></i>Mượn Sách</h3>
        <p class="text-muted small mb-0">Tạo phiếu mượn sách mới cho thành viên thư viện</p>
      </div>

      <div class="card bg-dark border-secondary p-4 mx-auto" style="max-width: 800px;">
        <form onsubmit="window.processBorrowInline(event)">
          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label text-light">Thành viên *</label>
              <select class="form-select bg-dark-subtle border-secondary text-white" id="borrowMemberInline" required>
                <option value="">-- Chọn thành viên --</option>
                ${members.map(m => `<option value="${m.id}">${m.account?.fullname || '?'} (${m.code})</option>`).join('')}
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label text-light">Ghi chú</label>
              <input class="form-control bg-dark-subtle border-secondary text-white" type="text" id="borrowNoteInline" placeholder="Ghi chú thêm (tùy chọn)" />
            </div>
          </div>
          
          <div class="mb-4">
            <label class="form-label text-light">Tìm & chọn sách *</label>
            <div class="input-group">
              <span class="input-group-text bg-dark-subtle border-secondary text-secondary"><i class="bi bi-search"></i></span>
              <input class="form-control bg-dark-subtle border-secondary text-white" type="text" id="borrowBookSearchInline" placeholder="Nhập tên sách hoặc mã ISBN để tìm..." oninput="window.searchBorrowBooksInline(this.value)" />
            </div>
            
            <div id="borrowBookListInline" class="list-group bg-dark border border-secondary mt-1 overflow-auto" style="max-height: 220px; display: none;"></div>
          </div>

          <div class="mb-4 d-none" id="selectedBooksWrapper">
            <label class="form-label text-light d-block">Sách đã chọn:</label>
            <div id="selectedBooksInline" class="d-flex flex-wrap gap-2"></div>
          </div>

          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary px-4" onclick="window.navigateTo('borrows')">Hủy</button>
            <button type="submit" class="btn btn-success px-4"><i class="bi bi-check-circle me-1"></i> Xác nhận mượn</button>
          </div>
        </form>
      </div>
    `;

    window._selectedBorrowBooksInline = [];

    window.searchBorrowBooksInline = (val) => {
      const list = document.getElementById('borrowBookListInline');
      if (!val.trim()) { list.style.display = 'none'; return; }
      
      const books = window._availableBooks.filter(b => b.available > 0 && (b.title.toLowerCase().includes(val.toLowerCase()) || b.isbn.includes(val)));
      
      if (books.length === 0) {
        list.innerHTML = '<div class="list-group-item bg-dark border-secondary text-center text-muted py-3">Không tìm thấy sách có sẵn trong kho</div>';
        list.style.display = 'block';
        return;
      }
      
      list.style.display = 'block';
      list.innerHTML = books.map(b => `
        <div class="list-group-item list-group-item-action bg-dark border-secondary text-light d-flex justify-content-between align-items-center py-2 px-3" onclick="window.addBorrowBookInline('${b.id}')" style="cursor: pointer;">
          <div>
            <div class="fw-semibold text-light fs-7">${b.title}</div>
            <div class="text-muted fs-8">ISBN: ${b.isbn} · Số lượng khả dụng: <span class="text-success">${b.available}</span></div>
          </div>
          <button type="button" class="btn btn-primary btn-sm px-2 py-0"><i class="bi bi-plus"></i></button>
        </div>
      `).join('');
    };

    window.addBorrowBookInline = (bookId) => {
      const idNum = parseInt(bookId);
      if (window._selectedBorrowBooksInline.includes(idNum)) return;
      window._selectedBorrowBooksInline.push(idNum);
      
      const wrapper = document.getElementById('selectedBooksWrapper');
      if (wrapper) wrapper.classList.remove('d-none');
      
      window.renderSelectedBooksInline();
      document.getElementById('borrowBookSearchInline').value = '';
      document.getElementById('borrowBookListInline').style.display = 'none';
    };

    window.removeBorrowBookInline = (bookId) => {
      window._selectedBorrowBooksInline = window._selectedBorrowBooksInline.filter(id => id != bookId);
      if (window._selectedBorrowBooksInline.length === 0) {
        const wrapper = document.getElementById('selectedBooksWrapper');
        if (wrapper) wrapper.classList.add('d-none');
      }
      window.renderSelectedBooksInline();
    };

    window.renderSelectedBooksInline = () => {
      const container = document.getElementById('selectedBooksInline');
      container.innerHTML = window._selectedBorrowBooksInline.map(id => {
        const b = window._availableBooks.find(x => x.id == id);
        return `
          <div class="badge bg-secondary-subtle border border-secondary text-light rounded-pill px-3 py-2 d-flex align-items-center gap-2">
            <span>📗 ${b?.title || 'Sách'}</span>
            <button type="button" class="btn-close btn-close-white" style="font-size: 0.65rem;" onclick="window.removeBorrowBookInline('${id}')" aria-label="Xóa"></button>
          </div>
        `;
      }).join('');
    };

    window.processBorrowInline = async (e) => {
      e.preventDefault();
      const memberId = document.getElementById('borrowMemberInline').value;
      if (!memberId || window._selectedBorrowBooksInline.length === 0) {
        showToast('Vui lòng chọn thành viên và ít nhất 1 cuốn sách để mượn', 'error');
        return;
      }

      // Determine correct librarian ID based on current user ID
      let currentLib = window._librarians.find(l => l.account && l.account.id === state.currentUser.id);
      let libId = currentLib ? currentLib.id : (window._librarians.length > 0 ? window._librarians[0].id : 1);

      const payload = {
        memberId: parseInt(memberId),
        librarianId: libId,
        note: document.getElementById('borrowNoteInline').value,
        bookIds: window._selectedBorrowBooksInline
      };

      try {
        const res = await fetch('/borrows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          let errText = await res.text();
          try {
            const errObj = JSON.parse(errText);
            if (errObj.error) errText = errObj.error;
          } catch(e) {}
          throw new Error(errText);
        }
        showToast('Tạo phiếu mượn sách thành công!', 'success');
        navigateTo('borrows');
      } catch (error) {
        showToast('Lỗi: ' + error.message, 'error');
      }
    };
  } catch(e) {
    showToast('Lỗi tải dữ liệu mượn sách: ' + e.message, 'error');
  }
}
