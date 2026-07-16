// ==================== AUTHORS (API) ====================
const AUTHOR_API_URL = 'http://localhost:8080/api/authors';

async function renderAuthors() {
  try {
    const response = await fetch(AUTHOR_API_URL);
    const authors = await response.json();

    document.getElementById('pageContent').innerHTML = `
      <div class="section-header">
        <div>
          <div class="section-title">✍️ Tác giả</div>
          <div class="section-subtitle">Quản lý danh sách tác giả</div>
        </div>
        <button class="btn btn-primary" onclick="openAuthorModal()">+ Thêm tác giả</button>
      </div>
      <div class="table-container">
        <table>
          <thead><tr><th>#</th><th>Tên tác giả</th><th>Quốc tịch</th><th>Tiểu sử</th><th>Hành động</th></tr></thead>
          <tbody>
            ${authors.length === 0 ? '<tr><td colspan="5" style="text-align:center">Chưa có tác giả nào</td></tr>' : ''}
            ${authors.map((a, i) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${a.name}</strong></td>
                <td>${a.nationality || '—'}</td>
                <td style="color:var(--text-secondary);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a.bio || '—'}</td>
                <td>
                  <div style="display:flex;gap:6px;">
                    <button class="btn btn-secondary btn-sm" onclick="openAuthorModal('${a.id}')">✏️ Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDeleteAuthor('${a.id}')">🗑️ Xóa</button>
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

async function openAuthorModal(authorId = null) {
  if (authorId) {
    try {
      const response = await fetch(`${AUTHOR_API_URL}/${authorId}`);
      if (!response.ok) throw new Error('Không tìm thấy tác giả');
      const a = await response.json();
      
      document.getElementById('modalAuthorTitle').textContent = '✏️ Sửa tác giả';
      document.getElementById('authorName').value = a.name;
      document.getElementById('authorNationality').value = a.nationality || '';
      document.getElementById('authorBio').value = a.bio || '';
      document.getElementById('authorEditId').value = a.id;
    } catch (error) {
      showToast('Lỗi khi tải dữ liệu', 'error');
      return;
    }
  } else {
    document.getElementById('modalAuthorTitle').textContent = '+ Thêm tác giả';
    document.getElementById('formAuthor').reset();
    document.getElementById('authorEditId').value = '';
  }
  openModal('modalAuthor');
}

async function saveAuthor(e) {
  e.preventDefault();
  const editId = document.getElementById('authorEditId').value;
  const data = { 
    name: document.getElementById('authorName').value.trim(), 
    nationality: document.getElementById('authorNationality').value.trim(), 
    bio: document.getElementById('authorBio').value.trim() 
  };

  try {
    const url = editId ? `${AUTHOR_API_URL}/${editId}` : AUTHOR_API_URL;
    const method = editId ? 'PUT' : 'POST';
    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || 'Lỗi lưu dữ liệu');
    }
    showToast(editId ? 'Đã cập nhật tác giả' : 'Đã thêm tác giả', 'success');
    closeModal('modalAuthor');
    renderAuthors();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

function confirmDeleteAuthor(id) {
  showConfirm(`Bạn có chắc muốn xóa tác giả này?`, async () => {
    try {
      const response = await fetch(`${AUTHOR_API_URL}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Không thể xóa tác giả');
      showToast('Đã xóa tác giả', 'success');
      renderAuthors();
    } catch (error) {
      showToast(error.message, 'error');
    }
  });
}
