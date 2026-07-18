import { showToast } from '../../core/toast.js';
import { openModal, closeModal, showConfirm } from '../../core/modal.js';

export async function renderAuthors() {
  try {
    const response = await fetch('/authors');
    const authors = await response.json();

    document.getElementById('pageContent').innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="text-light fw-bold mb-1"><i class="bi bi-pen-fill text-primary me-2"></i>Tác giả</h3>
          <p class="text-muted small mb-0">Quản lý danh sách tác giả sách trong hệ thống</p>
        </div>
        <button class="btn btn-primary" onclick="window.openAuthorModal()"><i class="bi bi-plus-lg me-1"></i> Thêm tác giả</button>
      </div>

      <div class="card bg-dark border-secondary">
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th style="width: 80px;">#</th>
                <th style="width: 250px;">Tên tác giả</th>
                <th style="width: 200px;">Quốc tịch</th>
                <th>Tiểu sử</th>
                <th style="width: 150px; text-align: center;">Hành động</th>
              </tr>
            </thead>
            <tbody>
              ${authors.length === 0 ? '<tr><td colspan="5" class="text-center py-4 text-muted">Chưa có tác giả nào</td></tr>' : ''}
              ${authors.map((a, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><strong class="text-light">${a.name}</strong></td>
                  <td class="text-secondary">${a.nationality || '—'}</td>
                  <td class="text-muted text-truncate-2" style="max-width: 300px;" title="${a.bio || ''}">${a.bio || '—'}</td>
                  <td class="text-center">
                    <div class="btn-group">
                      <button class="btn btn-outline-secondary btn-sm" onclick="window.openAuthorModal('${a.id}')" title="Sửa"><i class="bi bi-pencil-fill"></i></button>
                      <button class="btn btn-outline-danger btn-sm" onclick="window.confirmDeleteAuthor('${a.id}')" title="Xóa"><i class="bi bi-trash-fill"></i></button>
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
    showToast('Lỗi khi tải dữ liệu tác giả: ' + error.message, 'error');
  }
}

export async function openAuthorModal(authorId = null) {
  if (authorId) {
    try {
      const response = await fetch(`/authors/${authorId}`);
      if (!response.ok) throw new Error('Không tìm thấy tác giả');
      const a = await response.json();
      
      document.getElementById('modalAuthorTitle').textContent = '✏️ Sửa tác giả';
      document.getElementById('authorName').value = a.name;
      document.getElementById('authorNationality').value = a.nationality || '';
      document.getElementById('authorBio').value = a.bio || '';
      document.getElementById('authorEditId').value = a.id;
    } catch (error) {
      showToast('Lỗi khi tải dữ liệu tác giả: ' + error.message, 'error');
      return;
    }
  } else {
    document.getElementById('modalAuthorTitle').textContent = '+ Thêm tác giả';
    document.getElementById('formAuthor').reset();
    document.getElementById('authorEditId').value = '';
  }
  openModal('modalAuthor');
}

export async function saveAuthor(e) {
  e.preventDefault();
  const editId = document.getElementById('authorEditId').value;
  const data = { 
    name: document.getElementById('authorName').value.trim(), 
    nationality: document.getElementById('authorNationality').value.trim(), 
    bio: document.getElementById('authorBio').value.trim() 
  };

  try {
    const url = editId ? `/authors/${editId}` : '/authors';
    const method = editId ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Lỗi lưu dữ liệu tác giả');
    }
    showToast(editId ? 'Đã cập nhật tác giả thành công' : 'Đã thêm tác giả mới thành công', 'success');
    closeModal('modalAuthor');
    renderAuthors();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

export function confirmDeleteAuthor(id) {
  showConfirm(`Bạn có chắc muốn xóa tác giả này?`, async () => {
    try {
      const response = await fetch(`/authors/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Không thể xóa tác giả');
      showToast('Đã xóa tác giả thành công', 'success');
      renderAuthors();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
