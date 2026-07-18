import { state } from '../../core/state.js';
import { showToast } from '../../core/toast.js';
import { fmtDate, fmtMoney } from '../../shared/helpers.js';

export async function renderMyBorrows() {
  try {
    const res = await fetch('/borrows/my');
    if (!res.ok) throw new Error('Không thể tải lịch sử mượn sách');
    const myBorrows = await res.json();
    const today = new Date().toISOString().split('T')[0];

    document.getElementById('pageContent').innerHTML = `
      <div class="mb-4">
        <h3 class="text-light fw-bold mb-1"><i class="bi bi-clock-history text-primary me-2"></i>Lịch sử Mượn sách</h3>
        <p class="text-muted small mb-0">Theo dõi toàn bộ lịch sử và tình trạng các cuốn sách đã và đang mượn</p>
      </div>

      ${myBorrows.length === 0 ? `
        <div class="card bg-dark border-secondary p-5 text-center text-muted">
          <i class="bi bi-journal-x fs-1 mb-3"></i>
          <h5>Bạn chưa thực hiện phiếu mượn nào trong hệ thống</h5>
        </div>
      ` : `
        <div class="d-flex flex-column gap-3">
          ${myBorrows.slice().reverse().map(w => {
            const b = w.borrow;
            const details = w.details;
            const isOverdue = b.status === 'BORROWING' && b.dueDate < today;
            
            let statusLabel, badgeClass;
            if (b.status === 'RETURNED') { 
              statusLabel = 'Đã trả hết'; 
              badgeClass = 'bg-success'; 
            } else if (isOverdue) { 
              statusLabel = 'Quá hạn'; 
              badgeClass = 'bg-danger'; 
            } else { 
              statusLabel = 'Đang mượn'; 
              badgeClass = 'bg-primary'; 
            }
            
            const totalFine = details.reduce((sum, d) => sum + (d.fineAmount || 0), 0);

            return `
              <div class="card bg-dark border-secondary p-3" style="${isOverdue ? 'border-color: rgba(244,63,94,0.4) !important;' : ''}">
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary">
                  <div>
                    <code class="text-primary font-monospace fw-semibold fs-7">BR${b.id}</code>
                    <span class="badge ${badgeClass} text-uppercase font-monospace fs-8 ms-2">${statusLabel}</span>
                  </div>
                  ${totalFine > 0 
                    ? `<strong class="text-warning small"><i class="bi bi-cash-coin me-1"></i>Phí phạt phát sinh: ${fmtMoney(totalFine)}</strong>` 
                    : ''
                  }
                </div>
                
                <div class="d-flex flex-column gap-2 mb-3">
                  ${details.map(d => {
                    let dBadgeColor = 'bg-primary';
                    if (d.status === 'RETURNED') dBadgeColor = 'bg-success';
                    else if (d.status === 'LOST') dBadgeColor = 'bg-danger';
                    else if (d.status === 'DAMAGED') dBadgeColor = 'bg-warning';
                    
                    return `
                      <div class="d-flex justify-content-between align-items-center p-2 bg-dark-subtle rounded border border-secondary-subtle">
                        <span class="text-light-emphasis small fw-medium">📗 ${d.book.title}</span>
                        <span class="badge ${dBadgeColor} font-monospace fs-8">${d.status === 'BORROWING' ? 'Đang mượn' : d.status}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
                
                <div class="d-flex gap-4 small text-muted">
                  <div><i class="bi bi-calendar-event me-1"></i>Ngày mượn: <strong class="text-secondary">${fmtDate(b.borrowDate)}</strong></div>
                  <div><i class="bi bi-calendar-check me-1"></i>Hạn trả: <strong class="${isOverdue ? 'text-danger fw-bold' : 'text-success'}">${fmtDate(b.dueDate)}</strong></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  } catch(e) {
    showToast('Lỗi tải lịch sử mượn sách: ' + e.message, 'error');
  }
}
