import { state } from '../../core/state.js';
import { showToast } from '../../core/toast.js';
import { navigateTo } from '../../core/router.js';
import { fmtDate } from '../../shared/helpers.js';

export async function renderBorrows() {
  try {
    const res = await fetch('/borrows');
    if (!res.ok) throw new Error('Không thể fetch dữ liệu phiếu mượn');
    const borrows = await res.json();
    const today = new Date().toISOString().split('T')[0];

    const renderBorrowTable = (list) => {
      if (list.length === 0) {
        return `
          <div class="text-center py-5 text-muted">
            <i class="bi bi-clipboard-x fs-1"></i>
            <h5 class="mt-3">Không có phiếu mượn nào trong hệ thống</h5>
          </div>
        `;
      }
      return `
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th style="width: 120px;">Mã phiếu</th>
                <th>Người mượn</th>
                <th>Sách mượn & Trạng thái trả</th>
                <th>Mượn - Hạn trả</th>
                <th style="width: 150px; text-align: center;">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(wrapper => {
                const b = wrapper.borrow;
                const details = wrapper.details;
                
                const bookTitles = details.map(d => {
                  let badgeColor = 'bg-primary';
                  if (d.status === 'RETURNED') badgeColor = 'bg-success';
                  else if (d.status === 'LOST') badgeColor = 'bg-danger';
                  else if (d.status === 'DAMAGED') badgeColor = 'bg-warning';
                  
                  return `
                    <div class="mb-1 text-light small d-flex align-content-center justify-content-between">
                      <span>📙 ${d.book?.title || 'Sách'}</span>
                      <span class="badge ${badgeColor} text-uppercase font-monospace fs-8 ms-2">${d.status}</span>
                    </div>
                  `;
                }).join('');
                
                const isOverdue = b.status === 'BORROWING' && b.dueDate < today;
                
                let statusHtml = '';
                if (isOverdue) {
                  statusHtml = '<span class="badge bg-danger"><i class="bi bi-exclamation-triangle-fill me-1"></i> Quá hạn</span>';
                } else if (b.status === 'RETURNED') {
                  statusHtml = '<span class="badge bg-success"><i class="bi bi-check-circle-fill me-1"></i> Đã trả hết</span>';
                } else {
                  statusHtml = '<span class="badge bg-primary"><i class="bi bi-book-fill me-1"></i> Đang mượn</span>';
                }
                
                return `
                  <tr class="${isOverdue ? 'table-danger-subtle' : ''}">
                    <td><code class="text-primary font-monospace fw-semibold">BR${b.id}</code></td>
                    <td>
                      <strong class="text-light">${b.member?.account?.fullname || 'Thành viên'}</strong>
                      <div class="text-muted small">${b.member?.code || ''}</div>
                    </td>
                    <td>
                      <div class="d-flex flex-column" style="max-width: 350px;">
                        ${bookTitles}
                      </div>
                    </td>
                    <td>
                      <div class="small"><span class="text-muted">Mượn:</span> ${fmtDate(b.borrowDate)}</div>
                      <div class="small fw-semibold ${isOverdue ? 'text-danger' : 'text-success'}">
                        <span class="text-muted">Hạn trả:</span> ${fmtDate(b.dueDate)}
                      </div>
                    </td>
                    <td class="text-center">${statusHtml}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    };

    const isLibrarianOrAdmin = state.currentUser.role !== 'Member';

    document.getElementById('pageContent').innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 class="text-light fw-bold mb-1"><i class="bi bi-journal-bookmark-fill text-primary me-2"></i>Danh sách Phiếu mượn</h3>
          <p class="text-muted small mb-0">Theo dõi toàn bộ lịch sử và tình trạng các phiếu mượn sách</p>
        </div>
        ${isLibrarianOrAdmin ? `<button class="btn btn-primary" onclick="window.navigateTo('borrow-process')"><i class="bi bi-plus-lg me-1"></i> Tạo phiếu mượn</button>` : ''}
      </div>
      
      <div class="card bg-dark border-secondary">
        <div id="borrowTableContainer">${renderBorrowTable(borrows)}</div>
      </div>
    `;
  } catch (error) {
    showToast('Lỗi khi tải phiếu mượn: ' + error.message, 'error');
  }
}
