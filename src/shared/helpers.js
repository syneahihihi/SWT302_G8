// ==================== SHARED HELPERS ====================

export function fmtDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return dateStr; }
}

export function fmtMoney(amount) {
  if (!amount) return '0 đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function getLast7MonthBorrows(borrowsList) {
  const months = [];
  const borrows = borrowsList.map(w => w.borrow || w);
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `T${d.getMonth() + 1}`;
    const count = borrows.filter(b => b.borrowDate && b.borrowDate.startsWith(key)).length;
    months.push({ label, count });
  }
  return months;
}

export function renderBorrowChart(data, containerId = 'borrowChart') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const max = Math.max(...data.map(d => d.count), 1);
  container.innerHTML = `
    <div class="d-flex align-items-end justify-content-around h-100 w-100 pt-3" style="min-height: 200px;">
      ${data.map(d => `
        <div class="d-flex flex-column align-items-center w-100">
          <span class="small fw-semibold mb-1 text-primary">${d.count || ''}</span>
          <div class="bg-primary bg-gradient rounded-top" style="width: 30px; height: ${Math.max(8, Math.round((d.count / max) * 120))}px; transition: height 0.5s ease;"></div>
          <span class="small text-muted mt-2">${d.label}</span>
        </div>
      `).join('')}
    </div>
  `;
}

export function getTopBorrowedBooks(borrowsList, limit = 5) {
  const bookBorrowCount = {};
  const bookCache = {};
  
  borrowsList.forEach(w => {
    if (w.details) {
      w.details.forEach(d => {
        if (d.book) {
          bookBorrowCount[d.book.id] = (bookBorrowCount[d.book.id] || 0) + 1;
          bookCache[d.book.id] = d.book;
        }
      });
    }
  });
  
  const top = Object.entries(bookBorrowCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
    
  if (top.length === 0) {
    return '<div class="text-center text-muted py-3">Chưa có dữ liệu</div>';
  }
  
  return top.map(([bookId, count], i) => {
    const book = bookCache[bookId];
    const rankColors = ['bg-danger', 'bg-warning', 'bg-info'];
    const badgeColor = rankColors[i] || 'bg-secondary';
    return `
      <div class="d-flex align-items-center justify-content-between py-2 border-bottom border-secondary-subtle">
        <div class="d-flex align-items-center gap-2">
          <span class="badge ${badgeColor} rounded-circle px-2 py-1">${i + 1}</span>
          <span class="text-truncate" style="max-width: 250px;">${book?.title || 'Chưa rõ'}</span>
        </div>
        <span class="fw-bold text-primary">${count} lượt</span>
      </div>
    `;
  }).join('');
}

export function renderOverdueList(borrowsList) {
  const today = new Date().toISOString().split('T')[0];
  const overdue = borrowsList.filter(w => w.borrow && w.borrow.status === 'BORROWING' && w.borrow.dueDate < today);
  
  if (overdue.length === 0) {
    return '<div class="text-center text-muted py-3">Không có phiếu quá hạn</div>';
  }
  
  return overdue.slice(0, 5).map(w => {
    const b = w.borrow;
    const lateDays = Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000);
    return `
      <div class="d-flex align-items-center gap-3 p-2 mb-2 bg-dark-subtle rounded border border-danger-subtle">
        <div class="fs-4 text-danger"><i class="bi bi-exclamation-triangle-fill"></i></div>
        <div>
          <div class="fw-semibold text-light">${b.member?.account?.fullname || 'Thành viên'}</div>
          <div class="text-danger small">Trễ hạn ${lateDays} ngày (Hạn: ${fmtDate(b.dueDate)})</div>
        </div>
      </div>
    `;
  }).join('');
}
