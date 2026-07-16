// ==================== AUTHORS ====================
function renderAuthors() {
  const authors = DB.get('authors');
  const books = DB.get('books');

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
        <thead><tr><th>#</th><th>Tên tác giả</th><th>Quốc tịch</th><th>Tiểu sử</th><th>Số sách</th><th>Hành động</th></tr></thead>
        <tbody>
          ${authors.map((a, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><strong>${a.name}</strong></td>
              <td>${a.nationality || '—'}</td>
              <td style="color:var(--text-secondary);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${a.bio || '—'}</td>
              <td>${books.filter(b => b.authorId === a.id).length}</td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="btn btn-secondary btn-sm" onclick="openAuthorModal('${a.id}')">✏️ Sửa</button>
                  <button class="btn btn-danger btn-sm" onclick="confirmDeleteAuthor('${a.id}')">🗑️</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openAuthorModal(authorId = null) {
  if (authorId) {
    const a = DB.get('authors').find(x => x.id === authorId);
    document.getElementById('modalAuthorTitle').textContent = '✏️ Sửa tác giả';
    document.getElementById('authorName').value = a.name;
    document.getElementById('authorNationality').value = a.nationality || '';
    document.getElementById('authorBio').value = a.bio || '';
    document.getElementById('authorEditId').value = authorId;
  } else {
    document.getElementById('modalAuthorTitle').textContent = '+ Thêm tác giả';
    document.getElementById('formAuthor').reset();
    document.getElementById('authorEditId').value = '';
  }
  openModal('modalAuthor');
}

function saveAuthor(e) {
  e.preventDefault();
  const authors = DB.get('authors');
  const editId = document.getElementById('authorEditId').value;
  const data = { name: document.getElementById('authorName').value.trim(), nationality: document.getElementById('authorNationality').value.trim(), bio: document.getElementById('authorBio').value.trim() };

  if (editId) {
    const idx = authors.findIndex(a => a.id === editId);
    if (idx >= 0) authors[idx] = { ...authors[idx], ...data };
    showToast('Đã cập nhật tác giả', 'success');
  } else {
    authors.push({ id: 'au' + Date.now(), ...data });
    showToast('Đã thêm tác giả', 'success');
  }
  DB.set('authors', authors);
  closeModal('modalAuthor');
  renderAuthors();
}

function confirmDeleteAuthor(id) {
  const a = DB.get('authors').find(x => x.id === id);
  showConfirm(`Xóa tác giả "${a?.name}"?`, () => {
    DB.set('authors', DB.get('authors').filter(x => x.id !== id));
    showToast('Đã xóa tác giả', 'success');
    renderAuthors();
  });
}

