import { showToast } from '../../core/toast.js';
import { fmtDate, fmtMoney } from '../../shared/helpers.js';

export async function renderViolations() {
  try {
    const res = await fetch('/borrows/violations');
    if (!res.ok) throw new Error('Không thể tải danh sách vi phạm');
    const violators = await res.json();

    document.getElementById('pageContent').innerHTML = `
      <div class="mb-4">
        <h3 class="text-light fw-bold mb-1"><i class="bi bi-exclamation-octagon-fill text-danger me-2"></i>Quản lý Vi phạm</h3>
        <p class="text-muted small mb-0">Theo dõi các trường hợp trả trễ, hỏng hoặc mất sách phát sinh phí phạt</p>
      </div>

      <div class="card bg-dark border-secondary">
        <div class="table-responsive">
          <table class="table table-dark table-striped table-hover mb-0 align-middle">
            <thead>
              <tr>
                <th>Mã phiếu</th>
                <th>Thành viên</th>
                <th>Cuốn sách</th>
                <th>Lý do phạt</th>
                <th>Phí phạt</th>
                <th style="width: 150px; text-align: center;">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${violators.length === 0 ? '<tr><td colspan="6" class="text-center py-4 text-muted">Không có dữ liệu vi phạm nào</td></tr>' : ''}
              ${violators.map(v => {
                let reason = 'Quá hạn trả';
                if (v.status === 'LOST') reason = 'Báo mất sách';
                else if (v.status === 'DAMAGED') reason = 'Hư hại/Hỏng sách';
                
                return `
                  <tr>
                    <td><code class="text-primary font-monospace fw-semibold fs-7">BR${v.borrowId}</code></td>
                    <td>
                      <strong class="text-light">${v.member?.account?.fullname || 'Thành viên'}</strong>
                      <div class="text-muted small">${v.member?.code || ''}</div>
                    </td>
                    <td><span class="small text-light-emphasis">📘 ${v.book?.title || 'Sách'}</span></td>
                    <td><span class="badge bg-warning-subtle text-warning border border-warning px-2 py-1">${reason}</span></td>
                    <td><strong class="text-warning">${fmtMoney(v.fineAmount)}</strong></td>
                    <td class="text-center">
                      ${v.isPaid 
                        ? '<span class="badge bg-success px-3 py-1"><i class="bi bi-check2"></i> Đã thu phạt</span>' 
                        : '<span class="badge bg-danger px-3 py-1"><i class="bi bi-x"></i> Chưa thu</span>'
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
    showToast('Lỗi tải danh sách vi phạm: ' + error.message, 'error');
  }
}
