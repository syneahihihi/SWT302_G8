// ==================== BOOKS ====================
let bookFilter = { search: '', category: '', status: '' };

function renderBooks() {
  const canEdit = currentUser.role === 'Admin' || currentUser.role === 'Librarian';
  const isStudent = currentUser.role === 'Member';
  const categories = DB.get('categories');

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">${isStudent ? '🔍 Tìm kiếm Sách' : '📚 Quản lý Sách'}</div>
        <div class="section-subtitle">${isStudent ? 'Tìm và xem thông tin sách trong thư viện' : 'Thêm, sửa, quản lý kho sách'}</div>
      </div>
      ${canEdit ? `<button class="btn btn-primary" onclick="openBookModal()">+ Thêm sách mới</button>` : ''}
    </div>

    <div class="filters-bar">
      <div class="search-input-group" style="flex:2;min-width:200px;">
        <span class="search-icon">🔍</span>
        <input class="form-control" type="text" id="bookSearchInput" placeholder="Tìm theo tên sách, ISBN, tác giả..." oninput="filterBooks()" value="${bookFilter.search}" />
      </div>
      <select class="form-control" id="bookCatFilter" onchange="filterBooks()" style="flex:1;min-width:150px;max-width:200px;">
        <option value="">Tất cả danh mục</option>
        ${categories.map(c => `<option value="${c.id}" ${bookFilter.category === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
      </select>
      ${!isStudent ? `
        <select class="form-control" id="bookStatusFilter" onchange="filterBooks()" style="flex:1;min-width:130px;max-width:180px;">
          <option value="">Tất cả trạng thái</option>
          <option value="available" ${bookFilter.status === 'available' ? 'selected' : ''}>Có sẵn</option>
          <option value="borrowed" ${bookFilter.status === 'borrowed' ? 'selected' : ''}>Đang mượn</option>
          <option value="damaged" ${bookFilter.status === 'damaged' ? 'selected' : ''}>Hỏng</option>
          <option value="lost" ${bookFilter.status === 'lost' ? 'selected' : ''}>Mất</option>
        </select>
      ` : ''}
    </div>

    <div id="booksDisplay"></div>
  `;

  filterBooks();
}

function filterBooks() {
  const search = (document.getElementById('bookSearchInput')?.value || '').toLowerCase();
  const category = document.getElementById('bookCatFilter')?.value || '';
  const status = document.getElementById('bookStatusFilter')?.value || '';
  bookFilter = { search, category, status };

  const books = DB.get('books');
  const authors = DB.get('authors');
  const categories = DB.get('categories');
  const isStudent = currentUser.role === 'Member';

  let filtered = books.filter(b => {
    const author = authors.find(a => a.id === b.authorId);
    const matchSearch = !search ||
      b.title.toLowerCase().includes(search) ||
      b.isbn.toLowerCase().includes(search) ||
      (author?.name.toLowerCase().includes(search));
    const matchCat = !category || b.categoryId === category;
    const matchStatus = !status || b.status === status;
    return matchSearch && matchCat && matchStatus;
  });

  const display = document.getElementById('booksDisplay');
  if (!display) return;

  if (filtered.length === 0) {
    display.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><h3>Không tìm thấy sách</h3><p>Thử thay đổi từ khóa hoặc bộ lọc</p></div>`;
    return;
  }

  if (isStudent) {
    display.innerHTML = `<div class="book-grid">${filtered.map((b, i) => {
      const author = authors.find(a => a.id === b.authorId);
      const cat = categories.find(c => c.id === b.categoryId);
      const coverClass = 'book-cover-' + ((i % 6) + 1);
      const badgeClass = b.available > 0 ? 'badge-available' : 'badge-borrowed';
      const badgeText = b.available > 0 ? '✅ Có sẵn' : '❌ Hết';
      return `
        <div class="book-card" onclick="showBookDetail('${b.id}')">
          <div class="book-cover ${coverClass}">
            📗
            <span class="book-status-badge badge ${badgeClass}" style="font-size:9px;padding:2px 6px;">${badgeText}</span>
          </div>
          <div class="book-info">
            <div class="book-title">${b.title}</div>
            <div class="book-author">${author?.name || '—'}</div>
            <div class="book-category">${cat?.name || '—'}</div>
          </div>
        </div>
      `;
    }).join('')}</div>`;
  } else {
    const canEdit = currentUser.role === 'Admin' || currentUser.role === 'Librarian';
    display.innerHTML = `
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ISBN</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>Danh mục</th>
              <th>Năm</th>
              <th>SL</th>
              <th>Có sẵn</th>
              <th>Trạng thái</th>
              ${canEdit ? '<th>Hành động</th>' : ''}
            </tr>
          </thead>
          <tbody>
            ${filtered.map(b => {
      const author = authors.find(a => a.id === b.authorId);
      const cat = categories.find(c => c.id === b.categoryId);
      const badgeMap = { available: 'badge-available', borrowed: 'badge-borrowed', damaged: 'badge-damaged', lost: 'badge-lost' };
      const labelMap = { available: '✅ Có sẵn', borrowed: '📖 Đang mượn', damaged: '🔧 Hỏng', lost: '❌ Mất' };
      return `
                <tr>
                  <td><code style="font-family:var(--mono);font-size:11px;color:var(--text-muted)">${b.isbn}</code></td>
                  <td><strong style="cursor:pointer;color:var(--accent-blue);" onclick="showBookDetail('${b.id}')">${b.title}</strong></td>
                  <td>${author?.name || '—'}</td>
                  <td>${cat?.name || '—'}</td>
                  <td>${b.year || '—'}</td>
                  <td>${b.quantity || 1}</td>
                  <td><strong style="color:${b.available > 0 ? 'var(--accent-green)' : 'var(--accent-rose)'}">${b.available}</strong></td>
                  <td><span class="badge ${badgeMap[b.status] || 'badge-available'}">${labelMap[b.status] || b.status}</span></td>
                  ${canEdit ? `
                    <td>
                      <div style="display:flex;gap:6px;">
                        <button class="btn btn-secondary btn-sm" onclick="openBookModal('${b.id}')">✏️</button>
                        <button class="btn btn-danger btn-sm" onclick="confirmDeleteBook('${b.id}')">🗑️</button>
                      </div>
                    </td>
                  ` : ''}
                </tr>
              `;
    }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

function openBookModal(bookId = null) {
  const modal = document.getElementById('modalBook');
  const authors = DB.get('authors');
  const categories = DB.get('categories');

  document.getElementById('bookAuthor').innerHTML = authors.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  document.getElementById('bookCategory').innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  if (bookId) {
    const book = DB.get('books').find(b => b.id === bookId);
    if (!book) return;
    document.getElementById('modalBookTitle').textContent = '✏️ Chỉnh sửa sách';
    document.getElementById('bookISBN').value = book.isbn;
    document.getElementById('bookTitle').value = book.title;
    document.getElementById('bookAuthor').value = book.authorId;
    document.getElementById('bookCategory').value = book.categoryId;
    document.getElementById('bookYear').value = book.year || '';
    document.getElementById('bookQuantity').value = book.quantity || 1;
    document.getElementById('bookDescription').value = book.description || '';
    document.getElementById('bookStatus').value = book.status || 'available';
    document.getElementById('bookEditId').value = bookId;
    document.getElementById('bookStatusGroup').style.display = '';
  } else {
    document.getElementById('modalBookTitle').textContent = '+ Thêm sách mới';
    document.getElementById('formBook').reset();
    document.getElementById('bookEditId').value = '';
    document.getElementById('bookStatusGroup').style.display = 'none';
  }

  openModal('modalBook');
}

function saveBook(e) {
  e.preventDefault();
  const books = DB.get('books');
  const editId = document.getElementById('bookEditId').value;
  const qty = parseInt(document.getElementById('bookQuantity').value) || 1;

  const data = {
    isbn: document.getElementById('bookISBN').value.trim(),
    title: document.getElementById('bookTitle').value.trim(),
    authorId: document.getElementById('bookAuthor').value,
    categoryId: document.getElementById('bookCategory').value,
    year: parseInt(document.getElementById('bookYear').value) || null,
    quantity: qty,
    description: document.getElementById('bookDescription').value.trim(),
  };

  if (editId) {
    const idx = books.findIndex(b => b.id === editId);
    if (idx >= 0) {
      const oldBook = books[idx];
      const diff = qty - oldBook.quantity;
      books[idx] = { ...oldBook, ...data, available: Math.max(0, (oldBook.available || 0) + diff), status: document.getElementById('bookStatus').value };
    }
    showToast('Đã cập nhật sách thành công', 'success');
  } else {
    data.id = 'b' + Date.now();
    data.available = qty;
    data.status = 'available';
    books.push(data);
    showToast('Đã thêm sách thành công', 'success');
  }

  DB.set('books', books);
  closeModal('modalBook');
  renderBooks();
}

function confirmDeleteBook(bookId) {
  const book = DB.get('books').find(b => b.id === bookId);
  showConfirm(`Bạn có chắc muốn xóa sách "${book?.title}"?`, () => {
    const books = DB.get('books').filter(b => b.id !== bookId);
    DB.set('books', books);
    showToast('Đã xóa sách', 'success');
    renderBooks();
  });
}

function showBookDetail(bookId) {
  const book = DB.get('books').find(b => b.id === bookId);
  if (!book) return;
  const author = DB.get('authors').find(a => a.id === book.authorId);
  const cat = DB.get('categories').find(c => c.id === book.categoryId);
  const borrows = DB.get('borrows').filter(b => b.bookIds.includes(bookId));
  const badgeMap = { available: 'badge-available', borrowed: 'badge-borrowed', damaged: 'badge-damaged', lost: 'badge-lost' };
  const labelMap = { available: '✅ Có sẵn', borrowed: '📖 Đang mượn', damaged: '🔧 Hỏng', lost: '❌ Mất' };

  document.getElementById('bookDetailContent').innerHTML = `
    <div style="display:flex;gap:24px;margin-bottom:24px;flex-wrap:wrap;">
      <div style="width:120px;height:160px;border-radius:12px;background:linear-gradient(135deg,#1e3a5f,#2d6a9f);display:flex;align-items:center;justify-content:center;font-size:52px;flex-shrink:0;">📗</div>
      <div style="flex:1;min-width:200px;">
        <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">${book.title}</h2>
        <div style="margin-bottom:16px;">
          <span class="badge ${badgeMap[book.status]}">${labelMap[book.status]}</span>
        </div>
        <div class="info-row"><span class="info-label">ISBN</span><span class="info-value" style="font-family:monospace;">${book.isbn}</span></div>
        <div class="info-row"><span class="info-label">Tác giả</span><span class="info-value">${author?.name || '—'}</span></div>
        <div class="info-row"><span class="info-label">Danh mục</span><span class="info-value">${cat?.name || '—'}</span></div>
        <div class="info-row"><span class="info-label">Năm xuất bản</span><span class="info-value">${book.year || '—'}</span></div>
        <div class="info-row"><span class="info-label">Số lượng</span><span class="info-value">${book.quantity}</span></div>
        <div class="info-row"><span class="info-label">Còn lại</span><span class="info-value" style="color:${book.available > 0 ? 'var(--accent-green)' : 'var(--accent-rose)'};font-weight:700;">${book.available}</span></div>
      </div>
    </div>
    ${book.description ? `<div class="divider"></div><p style="color:var(--text-secondary);font-size:13px;line-height:1.7;">${book.description}</p>` : ''}
    <div class="divider"></div>
    <div style="font-size:13px;color:var(--text-secondary);">Đã được mượn: <strong style="color:var(--text-primary)">${borrows.length} lần</strong></div>
  `;
  openModal('modalBookDetail');
}

