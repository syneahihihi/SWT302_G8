// ==================== CATEGORIES ====================
function renderCategories() {
  const categories = DB.get('categories');
  const books = DB.get('books');

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">🏷️ Danh mục Sách</div>
        <div class="section-subtitle">Quản lý phân loại sách trong thư viện</div>
      </div>
      <button class="btn btn-primary" onclick="openCategoryModal()">+ Thêm danh mục</button>
    </div>
    <div class="table-container">
      <table>
        <thead><tr><th>#</th><th>Tên danh mục</th><th>Mô tả</th><th>Số sách</th><th>Hành động</th></tr></thead>
        <tbody>
          ${categories.map((c, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><strong>${c.name}</strong></td>
              <td style="color:var(--text-secondary)">${c.description || '—'}</td>
              <td>${books.filter(b => b.categoryId === c.id).length}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-secondary btn-sm" onclick="openCategoryModal('${c.id}')">✏️ Sửa</button>
                  <button class="btn btn-danger btn-sm" onclick="confirmDeleteCategory('${c.id}')">🗑️</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openCategoryModal(catId = null) {
  if (catId) {
    const cat = DB.get('categories').find(c => c.id === catId);
    document.getElementById('modalCategoryTitle').textContent = '✏️ Sửa danh mục';
    document.getElementById('categoryName').value = cat.name;
    document.getElementById('categoryDesc').value = cat.description || '';
    document.getElementById('categoryEditId').value = catId;
  } else {
    document.getElementById('modalCategoryTitle').textContent = '+ Thêm danh mục';
    document.getElementById('formCategory').reset();
    document.getElementById('categoryEditId').value = '';
  }
  openModal('modalCategory');
}

function saveCategory(e) {
  e.preventDefault();
  const cats = DB.get('categories');
  const editId = document.getElementById('categoryEditId').value;
  const data = { name: document.getElementById('categoryName').value.trim(), description: document.getElementById('categoryDesc').value.trim() };

  if (editId) {
    const idx = cats.findIndex(c => c.id === editId);
    if (idx >= 0) cats[idx] = { ...cats[idx], ...data };
    showToast('Đã cập nhật danh mục', 'success');
  } else {
    cats.push({ id: 'cat' + Date.now(), ...data });
    showToast('Đã thêm danh mục', 'success');
  }
  DB.set('categories', cats);
  closeModal('modalCategory');
  renderCategories();
}

function confirmDeleteCategory(id) {
  const cat = DB.get('categories').find(c => c.id === id);
  showConfirm(`Xóa danh mục "${cat?.name}"?`, () => {
    DB.set('categories', DB.get('categories').filter(c => c.id !== id));
    showToast('Đã xóa danh mục', 'success');
    renderCategories();
  });
}

