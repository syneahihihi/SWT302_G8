import { state } from '../../core/state.js';
import { showToast } from '../../core/toast.js';
import { fmtDate, fmtMoney } from '../../shared/helpers.js';

export async function renderMyViolations() {
  try {
    const res = await fetch('/borrows/violations/my');
    if (!res.ok) throw new Error('Không thể tải lịch sử vi phạm');
    const violations = await res.json();

    document.getElementById('pageContent').innerHTML = `
      <div class="mb-4">
        <h3 class="text-light fw-bold mb-1"><i class="bi bi-exclamation-triangle-fill text-warning me-2"></i>Lịch sử Vi phạm & Phạt</h3>
        <p class="text-muted small mb-0">Theo dõi thông tin các sách trễ hạn, hỏng hóc hoặc mất mát và tình trạng thanh toán phí phạt</p>
      </div>

      <div class="card bg-dark border-secondary">
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Sách vi phạm</th>
                <th>Lý do phạt</th>
                <th>Phí phạt</th>
                <th style="width: 150px; text-align: center;">Trạng thái đóng</th>
              </tr>
            </thead>
            <tbody>
              ${violations.length === 0 ? '<tr><td colspan="5" class="text-center py-4 text-muted">🎉 Tuyệt vời! Bạn không có lịch sử vi phạm nào</td></tr>' : ''}
              ${violations.map(v => {
                let reason = 'Quá hạn trả';
                if (v.status === 'LOST') reason = 'Báo mất sách';
                else if (v.status === 'DAMAGED') reason = 'Hư hại/Hỏng sách';
                
                return `
                  <tr>
                    <td><code class="text-primary font-monospace fw-semibold fs-7">BR${v.borrowId}</code></td>
                    <td><span class="small text-light-emphasis">📘 ${v.book?.title || 'Sách'}</span></td>
                    <td><span class="badge bg-warning-subtle text-warning border border-warning px-2 py-1">${reason}</span></td>
                    <td><strong class="text-warning">${fmtMoney(v.fineAmount)}</strong></td>
                    <td class="text-center">
                      ${v.isPaid 
                        ? '<span class="badge bg-success px-3 py-1"><i class="bi bi-check2"></i> Đã thanh toán</span>' 
                        : '<span class="badge bg-danger px-3 py-1"><i class="bi bi-x"></i> Chưa thanh toán</span>'
                      }
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch(error) {
    showToast('Lỗi tải lịch sử vi phạm: ' + error.message, 'error');
  }
}
