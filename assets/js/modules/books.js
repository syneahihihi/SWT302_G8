// ==================== BOOKS (API) ====================
const BOOK_API_URL = 'http://localhost:8080/api/books';

async function renderBooks() {
  try {
    const res = await fetch(BOOK_API_URL);
    const books = await res.json();
    
    document.getElementById('pageContent').innerHTML = `
      <div class="section-header">
        <div>
          <div class="section-title">📚 Quản lý Sách</div>
          <div class="section-subtitle">Danh mục tất cả sách trong thư viện</div>
        </div>
        ${currentUser.role !== 'Member' ? `<button class="btn btn-primary" onclick="openBookModal()">+ Thêm sách mới</button>` : ''}
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:20px;">
        ${books.map(b => {
          const authNames = b.authors ? b.authors.map(a => a.name).join(', ') : 'Chưa rõ';
          const catNames = b.categories ? b.categories.map(c => c.name).join(', ') : 'Chưa phân loại';
          return `
          <div class="card" style="display:flex;flex-direction:column;">
            <div style="font-size:12px;color:var(--accent-blue);font-weight:600;margin-bottom:4px;">ISBN: ${b.isbn}</div>
            <div style="font-size:16px;font-weight:600;margin-bottom:4px;">${b.title} (${b.year || 'N/A'})</div>
            <div style="font-size:13px;color:var(--text-muted);margin-bottom:4px;">✍️ ${authNames}</div>
            <div style="font-size:12px;color:var(--text-secondary);margin-bottom:12px;">📑 ${catNames}</div>
            <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid var(--border);">
              <div style="font-size:13px;">Còn: <strong style="color:var(--accent-green)">${b.available || 0}</strong>/${b.quantity || 0}</div>
              ${currentUser.role !== 'Member' ? `
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-secondary btn-sm" onclick="openBookModal('${b.id}')">✏️</button>
                  <button class="btn btn-danger btn-sm" onclick="confirmDeleteBook('${b.id}')">🗑️</button>
                </div>
              ` : `
                <button class="btn btn-primary btn-sm" onclick="showBookDetail('${b.id}')">Chi tiết</button>
              `}
            </div>
          </div>
          `;
        }).join('')}
      </div>
    `;
  } catch (e) {
    showToast('Lỗi khi tải dữ liệu sách', 'error');
  }
}

async function openBookModal(bookId = null) {
  try {
    // Fetch Authors and Categories for dropdowns
    const [authRes, catRes] = await Promise.all([
      fetch('http://localhost:8080/api/authors'),
      fetch('http://localhost:8080/api/categories')
    ]);
    const authors = await authRes.json();
    const categories = await catRes.json();
    
    document.getElementById('bookAuthor').innerHTML = authors.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
    document.getElementById('bookCategory').innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    if (bookId) {
      const response = await fetch(`${BOOK_API_URL}/${bookId}`);
      if (!response.ok) throw new Error('Không tìm thấy sách');
      const b = await response.json();
      
      document.getElementById('modalBookTitle').textContent = '✏️ Sửa thông tin sách';
      document.getElementById('bookISBN').value = b.isbn;
      document.getElementById('bookTitle').value = b.title;
      document.getElementById('bookYear').value = b.year || '';
      document.getElementById('bookQuantity').value = b.quantity || 1;
      document.getElementById('bookDescription').value = b.description || '';
      
      if (b.authors && b.authors.length > 0) document.getElementById('bookAuthor').value = b.authors[0].id;
      if (b.categories && b.categories.length > 0) document.getElementById('bookCategory').value = b.categories[0].id;
      
      document.getElementById('bookEditId').value = b.id;
    } else {
      document.getElementById('modalBookTitle').textContent = '+ Thêm sách mới';
      document.getElementById('formBook').reset();
      document.getElementById('bookEditId').value = '';
    }
    openModal('modalBook');
  } catch (error) {
    showToast('Lỗi khi chuẩn bị form', 'error');
  }
}

async function saveBook(e) {
  e.preventDefault();
  const editId = document.getElementById('bookEditId').value;
  const data = {
    isbn: document.getElementById('bookISBN').value.trim(),
    title: document.getElementById('bookTitle').value.trim(),
    year: parseInt(document.getElementById('bookYear').value) || null,
    quantity: parseInt(document.getElementById('bookQuantity').value) || 1,
    description: document.getElementById('bookDescription').value.trim(),
    authors: [{ id: parseInt(document.getElementById('bookAuthor').value) }],
    categories: [{ id: parseInt(document.getElementById('bookCategory').value) }]
  };

  try {
    const url = editId ? `${BOOK_API_URL}/${editId}` : BOOK_API_URL;
    const method = editId ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Lỗi lưu sách');
    }
    showToast(editId ? 'Đã cập nhật sách' : 'Đã thêm sách', 'success');
    closeModal('modalBook');
    renderBooks();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function confirmDeleteBook(id) {
  showConfirm(`Bạn có chắc muốn xóa sách này?`, async () => {
    try {
      const response = await fetch(`${BOOK_API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Không thể xóa sách');
      showToast('Đã xóa sách', 'success');
      renderBooks();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
