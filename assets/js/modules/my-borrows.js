// ==================== MY BORROWS ====================
async function renderMyBorrows() {
  try {
    const res = await fetch('http://localhost:8080/api/borrows');
    const allBorrows = await res.json();
    
    // currentUser.username corresponds to Account.username
    const myBorrows = allBorrows.filter(w => w.borrow.member?.account?.username === currentUser.username);
    const today = new Date().toISOString().split('T')[0];

    document.getElementById('pageContent').innerHTML = `
      <div class="section-header">
        <div>
          <div class="section-title">📖 Lịch sử Mượn sách</div>
        </div>
      </div>
      ${myBorrows.length === 0 ? `<div class="empty-state"><h3>Bạn chưa mượn sách nào</h3></div>` : `
        <div style="display:flex;flex-direction:column;gap:16px;">
          ${myBorrows.slice().reverse().map(w => {
            const b = w.borrow;
            const details = w.details;
            const isOverdue = b.status === 'BORROWING' && b.dueDate < today;
            
            let statusLabel, statusClass;
            if (b.status === 'RETURNED') { statusLabel = '✅ Đã trả hết'; statusClass = 'badge-available'; }
            else if (isOverdue) { statusLabel = '⚠️ Quá hạn'; statusClass = 'badge-overdue'; }
            else { statusLabel = '📖 Đang mượn'; statusClass = 'badge-borrowed'; }
            
            const totalFine = details.reduce((sum, d) => sum + (d.fineAmount || 0), 0);

            return `
              <div class="card" style="${isOverdue ? 'border-color:rgba(244,63,94,0.3);' : ''}">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                  <div>
                    <code style="color:var(--accent-blue);font-size:12px;">BR${b.id}</code>
                    <span class="badge ${statusClass}">${statusLabel}</span>
                  </div>
                  ${totalFine > 0 ? `<strong style="color:var(--accent-amber)">Phạt: ${fmtMoney(totalFine)}</strong>` : ''}
                </div>
                ${details.map(d => `
                    <div style="font-size:14px;font-weight:500;margin-bottom:4px;padding:8px;background:var(--bg-secondary);border-radius:4px;">
                        📗 ${d.book.title} 
                        <span style="float:right;font-size:12px;color:var(--text-muted)">
                            ${d.status === 'BORROWING' ? 'Đang mượn' : (d.status === 'RETURNED' ? 'Đã trả (' + d.returnDate + ')' : d.status)}
                        </span>
                    </div>
                `).join('')}
                <div style="display:flex;gap:24px;margin-top:12px;font-size:13px;color:var(--text-secondary);">
                  <div>📅 Ngày mượn: <strong>${fmtDate(b.borrowDate)}</strong></div>
                  <div>⏰ Hạn trả: <strong style="color:${isOverdue ? 'var(--accent-rose)' : 'inherit'}">${fmtDate(b.dueDate)}</strong></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  } catch(e) {
    showToast('Lỗi tải dữ liệu', 'error');
  }
}
