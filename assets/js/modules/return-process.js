// ==================== RETURN PROCESS (API) ====================
async function renderReturnProcess() {
  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">🔄 Trả Sách</div>
        <div class="section-subtitle">Xử lý trả sách và tính phí phạt từng cuốn (nếu có)</div>
      </div>
    </div>
    <div class="card" style="max-width:700px;margin:0 auto;">
      <div class="form-group">
        <label class="form-label">🔍 Tìm phiếu mượn</label>
        <input class="form-control" type="text" id="returnSearchInline" placeholder="Nhập mã phiếu (vd: 1) hoặc tên..." oninput="searchReturnBorrowInline(this.value)" />
      </div>
      <div id="returnResultsInline"></div>
    </div>
  `;

  try {
      const res = await fetch('http://localhost:8080/api/borrows');
      window._activeBorrows = (await res.json()).filter(b => b.borrow.status === 'BORROWING');
  } catch (error) {
      showToast('Lỗi khi tải danh sách phiếu mượn', 'error');
      return;
  }

  window.searchReturnBorrowInline = (val) => {
    const container = document.getElementById('returnResultsInline');
    if (!val.trim()) { container.innerHTML = ''; return; }
    
    const today = new Date().toISOString().split('T')[0];

    const filtered = window._activeBorrows.filter(w => {
      const mName = w.borrow.member?.account?.fullname || '';
      return w.borrow.id.toString().includes(val) || mName.toLowerCase().includes(val.toLowerCase());
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><h3>Không tìm thấy</h3></div>`;
      return;
    }

    container.innerHTML = filtered.map(w => {
      const b = w.borrow;
      const details = w.details;
      const isOverdue = b.dueDate < today;
      const lateDays = isOverdue ? Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000) : 0;

      const detailsHtml = details.map(d => {
        if (d.status !== 'BORROWING') {
            return `<div style="padding:8px;background:var(--bg-secondary);border-radius:6px;margin-bottom:8px;">
                <span class="badge badge-available">${d.book.title} - Đã xử lý (${d.status})</span>
            </div>`;
        }
        return `
            <div style="border:1px dashed var(--border);border-radius:6px;padding:12px;margin-bottom:8px;">
                <div style="font-weight:600;margin-bottom:8px;">📗 ${d.book.title}</div>
                <div style="display:flex;gap:12px;align-items:center;">
                    <select class="form-control" id="condition_${d.id}" style="flex:1;">
                    <option value="good">Tình trạng: Tốt</option>
                    <option value="damaged">Có hư hại</option>
                    <option value="lost">Báo mất</option>
                    </select>
                    <button class="btn btn-success" onclick="confirmReturn('${d.id}')">✅ Xác nhận trả sách này</button>
                </div>
            </div>
        `;
      }).join('');

      return `
        <div style="border:1px solid ${isOverdue ? 'rgba(244,63,94,0.3)' : 'var(--border)'};border-radius:var(--radius-md);padding:16px;margin-bottom:12px;background:${isOverdue ? 'rgba(244,63,94,0.03)' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div>
              <code style="color:var(--accent-blue);font-size:13px;">BR${b.id}</code>
              <div style="font-size:15px;font-weight:600;margin-top:4px;">${b.member?.account?.fullname || '?'}</div>
            </div>
            ${isOverdue ? `<span class="badge badge-overdue">⚠️ Quá hạn ${lateDays} ngày</span>` : '<span class="badge badge-borrowed">📖 Đang mượn</span>'}
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;font-size:12px;">
            <div><span style="color:var(--text-muted)">Ngày mượn: </span>${fmtDate(b.borrowDate)}</div>
            <div><span style="color:var(--text-muted)">Hạn trả: </span><span style="color:${isOverdue ? 'var(--accent-rose)' : 'inherit'}">${fmtDate(b.dueDate)}</span></div>
          </div>
          <div>
            ${detailsHtml}
          </div>
        </div>
      `;
    }).join('');
  };

  window.confirmReturn = async (detailId) => {
    const condition = document.getElementById('condition_' + detailId)?.value || 'good';

    try {
        const res = await fetch(`http://localhost:8080/api/borrows/return`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ detailId: parseInt(detailId), condition: condition })
        });
        
        if (!res.ok) throw new Error(await res.text());
        const updated = await res.json();
        
        // Find the fine for this specific detail
        const updatedDetail = updated.details.find(d => d.id == detailId);
        const msg = updatedDetail.fineAmount > 0 ? `✅ Đã xử lý! Phạt: ${fmtMoney(updatedDetail.fineAmount)}` : '✅ Đã trả sách thành công!';
        showToast(msg, updatedDetail.fineAmount > 0 ? 'warning' : 'success');
        navigateTo('return-process'); // reload UI
    } catch(error) {
        showToast('Lỗi: ' + error.message, 'error');
    }
  };
}
