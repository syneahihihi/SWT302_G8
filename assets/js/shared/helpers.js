// ==================== HELPERS ====================
function getDefaultDueDate() {
  const config = DB.getObj('config');
  const d = new Date();
  d.setDate(d.getDate() + (config.maxBorrowDays || 14));
  return d.toISOString().split('T')[0];
}

function fmtDate(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return dateStr; }
}

function fmtMoney(amount) {
  if (!amount) return '0đ';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function getLast7MonthBorrows(borrows) {
  const months = [];
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

function renderBorrowChart(data, containerId = 'borrowChart') {
  const container = document.getElementById(containerId);
  if (!container) return;
  const max = Math.max(...data.map(d => d.count), 1);
  container.innerHTML = data.map(d => `
    <div class="chart-bar-wrapper">
      <div style="font-size:11px;font-weight:600;color:${d.count > 0 ? 'var(--accent-blue)' : 'var(--text-muted)'};margin-bottom:4px;">${d.count || ''}</div>
      <div class="chart-bar" style="height:${Math.max(4, Math.round((d.count / max) * 100))}px;"></div>
      <div class="chart-bar-label">${d.label}</div>
    </div>
  `).join('');
}

function getTopBorrowedBooks(borrows, limit = 5) {
  const bookBorrowCount = {};
  borrows.forEach(b => b.bookIds.forEach(id => { bookBorrowCount[id] = (bookBorrowCount[id] || 0) + 1; }));
  const top = Object.entries(bookBorrowCount).sort((a, b) => b[1] - a[1]).slice(0, limit);
  const books = DB.get('books');
  if (top.length === 0) return '<div class="empty-state" style="padding:20px;"><div class="empty-icon">📚</div><div>Chưa có dữ liệu</div></div>';
  return top.map(([bookId, count], i) => {
    const book = books.find(b => b.id === bookId);
    const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-other';
    return `<div class="report-row"><div class="report-rank ${rankClass}">${i + 1}</div><div style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;">${book?.title || '?'}</div><div style="font-weight:700;color:var(--accent-blue);font-size:13px;">${count}</div></div>`;
  }).join('');
}

function renderOverdueList(overdue) {
  if (overdue.length === 0) return '<div class="empty-state" style="padding:20px;"><div class="empty-icon">✅</div><div style="font-size:13px;">Không có phiếu quá hạn</div></div>';
  const members = DB.get('members');
  const today = new Date().toISOString().split('T')[0];
  return overdue.slice(0, 5).map(b => {
    const m = members.find(x => x.id === b.memberId);
    const lateDays = Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000);
    return `<div class="activity-item"><div class="activity-icon" style="background:rgba(244,63,94,0.1);">⚠️</div><div class="activity-text"><div class="activity-title">${m?.name || '?'}</div><div class="activity-subtitle">Quá hạn ${lateDays} ngày</div></div></div>`;
  }).join('');
}


function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

function showConfirm(message, callback) {
  document.getElementById('confirmMessage').textContent = message;
  const btn = document.getElementById('confirmBtn');
  btn.onclick = () => { closeModal('modalConfirm'); callback(); };
  openModal('modalConfirm');
}

// Close modals on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

