// ==================== BORROWS (API) ====================
async function renderBorrows() {
  try {
    const res = await fetch('http://localhost:8080/api/borrows');
    const borrows = await res.json();
    const today = new Date().toISOString().split('T')[0];

    const renderBorrowTable = (list) => {
      if (list.length === 0) return `<div class="empty-state"><div class="empty-icon">📋</div><h3>Không có phiếu mượn</h3></div>`;
      return `
        <div class="table-container">
          <table>
            <thead><tr><th>Mã phiếu</th><th>Người mượn</th><th>Chi tiết Sách</th><th>Mượn - Hạn trả</th><th>Trạng thái</th></tr></thead>
            <tbody>
              ${list.map(wrapper => {
                const b = wrapper.borrow;
                const details = wrapper.details;
                const bookTitles = details.map(d => `<span style="display:block;font-size:11px;margin-bottom:2px;">• ${d.book?.title || '?'} 
                  <b style="color:${d.status === 'BORROWING' ? 'var(--accent-blue)' : (d.status === 'RETURNED' ? 'var(--accent-emerald)' : 'var(--accent-rose)')}">(${d.status})</b></span>`).join('');
                
                const isOverdue = b.status === 'BORROWING' && b.dueDate < today;
                const statusMap = {
                  BORROWING: '<span class="badge badge-borrowed">📖 Đang mượn</span>',
                  RETURNED: '<span class="badge badge-available">✅ Đã trả</span>',
                };
                const statusHtml = isOverdue ? '<span class="badge badge-overdue">⚠️ Quá hạn</span>' : (statusMap[b.status] || statusMap['BORROWING']);
                
                return `
                  <tr style="${isOverdue ? 'background:rgba(244,63,94,0.03);' : ''}">
                    <td><code style="font-size:12px;color:var(--accent-blue)">BR${b.id}</code></td>
                    <td><strong>${b.member?.account?.fullname || '?'}</strong><br><small style="color:var(--text-muted)">${b.member?.code || ''}</small></td>
                    <td>${bookTitles}</td>
                    <td>
                      <div>M: ${fmtDate(b.borrowDate)}</div>
                      <div style="color:${isOverdue ? 'var(--accent-rose)' : 'inherit'};font-weight:${isOverdue ? '700' : '400'}">H: ${fmtDate(b.dueDate)}</div>
                    </td>
                    <td>${statusHtml}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    };

    document.getElementById('pageContent').innerHTML = `
      <div class="section-header">
        <div>
          <div class="section-title">📋 Danh sách Phiếu mượn</div>
        </div>
        ${currentUser.role !== 'Member' ? `<button class="btn btn-primary" onclick="navigateTo('borrow-process')">+ Tạo phiếu mượn</button>` : ''}
      </div>
      <div id="borrowTableContainer">${renderBorrowTable(borrows)}</div>
    `;
  } catch (error) {
    showToast('Lỗi khi tải phiếu mượn', 'error');
  }
}
