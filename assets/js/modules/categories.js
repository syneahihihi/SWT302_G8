// ==================== CATEGORIES (API) ====================
const CATEGORY_API_URL = 'http://localhost:8080/api/categories';

async function renderCategories() {
  try {
    const response = await fetch(CATEGORY_API_URL);
    const categories = await response.json();

    document.getElementById('pageContent').innerHTML = `
      <div class="section-header">
        <div>
          <div class="section-title">🏷️ Danh mục Sách</div>
          <div class="section-subtitle">Quản lý phân loại sách</div>
        </div>
        <button class="btn btn-primary" onclick="openCategoryModal()">+ Thêm danh mục</button>
      </div>
      <div class="table-container">
        <table>
          <thead><tr><th>#</th><th>Tên danh mục</th><th>Mô tả</th><th>Hành động</th></tr></thead>
          <tbody>
            ${categories.length === 0 ? '<tr><td colspan="4" style="text-align:center">Chưa có danh mục nào</td></tr>' : ''}
            ${categories.map((c, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${c.name}</strong></td>
                <td style="color:var(--text-secondary)">${c.description || '—'}</td>
                <td>
                  <div style="display:flex;gap:6px;">
                    <button class="btn btn-secondary btn-sm" onclick="openCategoryModal('${c.id}')">✏️ Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteCategory('${c.id}')">🗑️ Xóa</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    showToast('Lỗi khi tải dữ liệu', 'error');
  }
}

async function openCategoryModal(catId = null) {
  if (catId) {
    try {
      const response = await fetch(`${CATEGORY_API_URL}/${catId}`);
      if (!response.ok) throw new Error('Không tìm thấy danh mục');
      const cat = await response.json();
      
      document.getElementById('modalCategoryTitle').textContent = '✏️ Sửa danh mục';
      document.getElementById('categoryName').value = cat.name;
      document.getElementById('categoryDesc').value = cat.description || '';
      document.getElementById('categoryEditId').value = cat.id;
    } catch (error) {
      showToast('Lỗi khi tải dữ liệu', 'error');
      return;
    }
  } else {
    document.getElementById('modalCategoryTitle').textContent = '+ Thêm danh mục';
    document.getElementById('formCategory').reset();
    document.getElementById('categoryEditId').value = '';
  }
  openModal('modalCategory');
}

async function saveCategory(e) {
  e.preventDefault();
  const editId = document.getElementById('categoryEditId').value;
  const data = { 
    name: document.getElementById('categoryName').value.trim(), 
    description: document.getElementById('categoryDesc').value.trim() 
  };

  try {
    const url = editId ? `${CATEGORY_API_URL}/${editId}` : CATEGORY_API_URL;
    const method = editId ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Lỗi lưu dữ liệu');
    showToast(editId ? 'Đã cập nhật danh mục' : 'Đã thêm danh mục', 'success');
    closeModal('modalCategory');
    renderCategories();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function confirmDeleteCategory(id) {
  showConfirm(`Bạn có chắc muốn xóa danh mục này?`, async () => {
    try {
      const response = await fetch(`${CATEGORY_API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Không thể xóa danh mục');
      showToast('Đã xóa danh mục', 'success');
      renderCategories();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
