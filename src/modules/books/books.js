import { state } from '../../core/state.js';
import { showToast } from '../../core/toast.js';
import { openModal, closeModal, showConfirm } from '../../core/modal.js';
import { fmtMoney } from '../../shared/helpers.js';

let allBooks = [];
let allCategories = [];
let allAuthors = [];

export async function renderBooks() {
  try {
    const [booksRes, catRes, authRes] = await Promise.all([
      fetch('/books'),
      fetch('/categories'),
      fetch('/authors')
    ]);
    
    allBooks = await booksRes.json();
    allCategories = await catRes.json();
    allAuthors = await authRes.json();
    
    const isLibrarianOrAdmin = state.currentUser.role !== 'Member';

    document.getElementById('pageContent').innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="text-light fw-bold mb-1"><i class="bi bi-book-fill text-primary me-2"></i>Quản lý Sách</h3>
          <p class="text-muted small mb-0">Xem và tìm kiếm tất cả các đầu sách trong hệ thống thư viện</p>
        </div>
        ${isLibrarianOrAdmin ? `<button class="btn btn-primary" onclick="window.openBookModal()"><i class="bi bi-plus-lg me-1"></i> Thêm sách mới</button>` : ''}
      </div>

      <div class="card bg-dark border-secondary mb-4">
        <div class="card-body p-3">
          <div class="row g-3">
            <div class="col-md-6">
              <div class="input-group">
                <span class="input-group-text bg-dark-subtle border-secondary text-secondary"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control bg-dark-subtle border-secondary text-white" id="bookSearchInput" placeholder="Tìm tên sách hoặc ISBN..." oninput="window.filterBooks()">
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select bg-dark-subtle border-secondary text-white" id="bookCategoryFilter" onchange="window.filterBooks()">
                <option value="">Tất cả danh mục</option>
                ${allCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="col-md-3">
              <select class="form-select bg-dark-subtle border-secondary text-white" id="bookAuthorFilter" onchange="window.filterBooks()">
                <option value="">Tất cả tác giả</option>
                ${allAuthors.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div id="booksGrid" class="row g-4"></div>
    `;

    // Perform initial filter to render grid
    filterBooks();

  } catch (e) {
    showToast('Lỗi khi tải dữ liệu sách: ' + e.message, 'error');
  }
}

export function filterBooks() {
  const searchVal = document.getElementById('bookSearchInput')?.value.toLowerCase().trim() || '';
  const categoryFilter = document.getElementById('bookCategoryFilter')?.value || '';
  const authorFilter = document.getElementById('bookAuthorFilter')?.value || '';

  const filtered = allBooks.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchVal) || b.isbn.includes(searchVal);
    const matchesCategory = !categoryFilter || (b.categories && b.categories.some(c => c.id == categoryFilter));
    const matchesAuthor = !authorFilter || (b.authors && b.authors.some(a => a.id == authorFilter));
    return matchesSearch && matchesCategory && matchesAuthor;
  });

  const grid = document.getElementById('booksGrid');
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-journal-x fs-1 text-muted"></i>
        <h5 class="text-muted mt-3">Không tìm thấy sách nào khớp với bộ lọc</h5>
      </div>
    `;
    return;
  }

  const isLibrarianOrAdmin = state.currentUser.role !== 'Member';

  grid.innerHTML = filtered.map(b => {
    const authNames = b.authors ? b.authors.map(a => a.name).join(', ') : 'Chưa rõ';
    const catNames = b.categories ? b.categories.map(c => c.name).join(', ') : 'Chưa phân loại';
    return `
      <div class="col-md-6 col-lg-4 col-xl-3">
        <div class="card card-premium bg-dark border-secondary h-100 d-flex flex-column text-light">
          <div class="card-body d-flex flex-column p-3">
            <div class="text-primary small fw-semibold mb-1">ISBN: ${b.isbn}</div>
            <h6 class="card-title text-light fw-bold mb-2 text-truncate-2" title="${b.title}">${b.title}</h6>
            <div class="small text-muted mb-1"><i class="bi bi-pen me-1"></i>${authNames}</div>
            <div class="small text-muted mb-3"><i class="bi bi-tag me-1"></i>${catNames}</div>
            <div class="mt-auto pt-3 border-top border-secondary d-flex justify-content-between align-items-center">
              <div>
                <span class="small text-muted">Còn:</span> 
                <span class="badge ${b.available > 0 ? 'bg-success' : 'bg-danger'}">${b.available}/${b.quantity}</span>
              </div>
              ${isLibrarianOrAdmin ? `
                <div class="btn-group">
                  <button class="btn btn-outline-secondary btn-sm" onclick="window.openBookModal('${b.id}')" title="Sửa"><i class="bi bi-pencil-fill"></i></button>
                  <button class="btn btn-outline-danger btn-sm" onclick="window.confirmDeleteBook('${b.id}')" title="Xóa"><i class="bi bi-trash-fill"></i></button>
                </div>
              ` : `
                <button class="btn btn-primary btn-sm px-3" onclick="window.showBookDetail('${b.id}')">Chi tiết</button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export async function openBookModal(bookId = null) {
  try {
    const [authRes, catRes] = await Promise.all([
      fetch('/authors'),
      fetch('/categories')
    ]);
    const authors = await authRes.json();
    const categories = await catRes.json();
    
    const authorSelect = document.getElementById('bookAuthor');
    const categorySelect = document.getElementById('bookCategory');
    if (authorSelect) authorSelect.innerHTML = authors.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
    if (categorySelect) categorySelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    if (bookId) {
      const response = await fetch(`/books/${bookId}`);
      if (!response.ok) throw new Error('Không tìm thấy sách');
      const b = await response.json();
      
      document.getElementById('modalBookTitle').textContent = '✏️ Sửa thông tin sách';
      document.getElementById('bookISBN').value = b.isbn;
      document.getElementById('bookTitle').value = b.title;
      document.getElementById('bookYear').value = b.year || '';
      document.getElementById('bookQuantity').value = b.quantity || 1;
      document.getElementById('bookPrice').value = b.price || 100000;
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
    showToast('Lỗi khi tải dữ liệu form: ' + error.message, 'error');
  }
}

export async function saveBook(e) {
  e.preventDefault();
  const editId = document.getElementById('bookEditId').value;
  const data = {
    isbn: document.getElementById('bookISBN').value.trim(),
    title: document.getElementById('bookTitle').value.trim(),
    year: parseInt(document.getElementById('bookYear').value) || null,
    quantity: parseInt(document.getElementById('bookQuantity').value) || 1,
    price: parseFloat(document.getElementById('bookPrice').value) || 0,
    description: document.getElementById('bookDescription').value.trim(),
    authors: [{ id: parseInt(document.getElementById('bookAuthor').value) }],
    categories: [{ id: parseInt(document.getElementById('bookCategory').value) }]
  };

  try {
    const url = editId ? `/books/${editId}` : '/books';
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
    showToast(editId ? 'Đã cập nhật sách thành công' : 'Đã thêm sách mới thành công', 'success');
    closeModal('modalBook');
    renderBooks();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

export function confirmDeleteBook(id) {
  showConfirm(`Bạn có chắc muốn xóa sách này?`, async () => {
    try {
      const response = await fetch(`/books/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Không thể xóa sách');
      showToast('Đã xóa sách thành công', 'success');
      renderBooks();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}

export async function showBookDetail(bookId) {
  try {
    const res = await fetch(`/books/${bookId}`);
    if (!res.ok) throw new Error('Không thể tải chi tiết sách');
    const b = await res.json();
    
    const authNames = b.authors ? b.authors.map(a => a.name).join(', ') : 'Chưa rõ';
    const catNames = b.categories ? b.categories.map(c => c.name).join(', ') : 'Chưa phân loại';
    
    document.getElementById('bookDetailContent').innerHTML = `
      <div class="row g-4">
        <div class="col-md-4 text-center">
          <div class="p-4 bg-dark rounded border border-secondary d-flex align-items-center justify-content-center h-100" style="min-height: 200px;">
            <i class="bi bi-book text-primary" style="font-size: 5rem;"></i>
          </div>
        </div>
        <div class="col-md-8 text-light">
          <h4 class="fw-bold mb-1">${b.title}</h4>
          <p class="text-primary small mb-3">ISBN: ${b.isbn}</p>
          
          <div class="mb-3">
            <div class="mb-2"><i class="bi bi-pen me-2 text-secondary"></i>Tác giả: <strong>${authNames}</strong></div>
            <div class="mb-2"><i class="bi bi-tag me-2 text-secondary"></i>Danh mục: <strong>${catNames}</strong></div>
            <div class="mb-2"><i class="bi bi-calendar me-2 text-secondary"></i>Năm xuất bản: <strong>${b.year || 'N/A'}</strong></div>
            <div class="mb-2"><i class="bi bi-wallet2 me-2 text-secondary"></i>Giá sách: <strong class="text-warning">${fmtMoney(b.price)}</strong></div>
          </div>
          
          <hr class="border-secondary">
          
          <h6 class="mb-2 text-light-emphasis">Mô tả sách:</h6>
          <p class="text-muted small">${b.description || 'Chưa có mô tả chi tiết cho cuốn sách này.'}</p>
          
          <div class="mt-4 p-3 bg-dark-subtle rounded border border-secondary d-flex justify-content-between align-items-center">
            <div>Tổng số lượng trong kho: <span class="badge bg-secondary fs-7">${b.quantity}</span></div>
            <div>Sẵn sàng cho mượn: <span class="badge bg-success fs-7">${b.available}</span></div>
          </div>
        </div>
      </div>
    `;
    openModal('modalBookDetail');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

// Expose filterBooks to window object to link search and selects
window.filterBooks = filterBooks;
