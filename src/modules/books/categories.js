import { showToast } from '../../core/toast.js';
import { openModal, closeModal, showConfirm } from '../../core/modal.js';

export async function renderCategories() {
  try {
    const response = await fetch('/categories');
    const categories = await response.json();

    document.getElementById('pageContent').innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="text-light fw-bold mb-1"><i class="bi bi-tags-fill text-primary me-2"></i>Danh mục Sách</h3>
          <p class="text-muted small mb-0">Quản lý các danh mục phân loại sách trong hệ thống</p>
        </div>
        <button class="btn btn-primary" onclick="window.openCategoryModal()"><i class="bi bi-plus-lg me-1"></i> Thêm danh mục</button>
      </div>

      <div class="card bg-dark border-secondary">
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th style="width: 80px;">#</th>
                <th style="width: 250px;">Tên danh mục</th>
                <th>Mô tả</th>
                <th style="width: 150px; text-align: center;">Hành động</th>
              </tr>
            </thead>
            <tbody>
              ${categories.length === 0 ? '<tr><td colspan="4" class="text-center py-4 text-muted">Chưa có danh mục nào</td></tr>' : ''}
              ${categories.map((c, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><strong class="text-light">${c.name}</strong></td>
                  <td class="text-muted">${c.description || '—'}</td>
                  <td class="text-center">
                    <div class="btn-group">
                      <button class="btn btn-outline-secondary btn-sm" onclick="window.openCategoryModal('${c.id}')" title="Sửa"><i class="bi bi-pencil-fill"></i></button>
                      <button class="btn btn-outline-danger btn-sm" onclick="window.confirmDeleteCategory('${c.id}')" title="Xóa"><i class="bi bi-trash-fill"></i></button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (error) {
    showToast('Lỗi khi tải dữ liệu danh mục: ' + error.message, 'error');
  }
}

export async function openCategoryModal(catId = null) {
  if (catId) {
    try {
      const response = await fetch(`/categories/${catId}`);
      if (!response.ok) throw new Error('Không tìm thấy danh mục');
      const cat = await response.json();
      
      document.getElementById('modalCategoryTitle').textContent = '✏️ Sửa danh mục';
      document.getElementById('categoryName').value = cat.name;
      document.getElementById('categoryDesc').value = cat.description || '';
      document.getElementById('categoryEditId').value = cat.id;
    } catch (error) {
      showToast('Lỗi khi tải dữ liệu danh mục: ' + error.message, 'error');
      return;
    }
  } else {
    document.getElementById('modalCategoryTitle').textContent = '+ Thêm danh mục';
    document.getElementById('formCategory').reset();
    document.getElementById('categoryEditId').value = '';
  }
  openModal('modalCategory');
}

export async function saveCategory(e) {
  e.preventDefault();
  const editId = document.getElementById('categoryEditId').value;
  const data = { 
    name: document.getElementById('categoryName').value.trim(), 
    description: document.getElementById('categoryDesc').value.trim() 
  };

  try {
    const url = editId ? `/categories/${editId}` : '/categories';
    const method = editId ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Lỗi lưu dữ liệu danh mục');
    showToast(editId ? 'Đã cập nhật danh mục thành công' : 'Đã thêm danh mục mới thành công', 'success');
    closeModal('modalCategory');
    renderCategories();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

export function confirmDeleteCategory(id) {
  showConfirm(`Bạn có chắc muốn xóa danh mục này?`, async () => {
    try {
      const response = await fetch(`/categories/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Không thể xóa danh mục');
      showToast('Đã xóa danh mục thành công', 'success');
      renderCategories();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
