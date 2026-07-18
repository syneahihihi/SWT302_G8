import { showToast } from '../../core/toast.js';
import { fmtMoney } from '../../shared/helpers.js';

export async function renderReports() {
  try {
    const [booksRes, borrowsRes, accountsRes] = await Promise.all([
      fetch('/books'),
      fetch('/borrows'),
      fetch('/accounts')
    ]);

    if (!booksRes.ok || !borrowsRes.ok || !accountsRes.ok) {
      throw new Error('Lỗi fetch dữ liệu API');
    }

    const books = await booksRes.json();
    const borrowsList = await borrowsRes.json();
    const accounts = await accountsRes.json();

    let totalFinePaid = 0;
    let totalFineUnpaid = 0;
    
    borrowsList.forEach(w => {
      if (w.details) {
        w.details.forEach(d => {
          if (d.fineAmount > 0) {
            if (d.isPaid) totalFinePaid += d.fineAmount;
            else totalFineUnpaid += d.fineAmount;
          }
        });
      }
    });

    const borrowingDetailsCount = borrowsList.reduce((sum, w) => sum + (w.details ? w.details.filter(d => d.status === 'BORROWING').length : 0), 0);
    const totalQty = books.reduce((sum, b) => sum + (b.quantity || 0), 0);
    const availQty = books.reduce((sum, b) => sum + (b.available || 0), 0);
    const availRate = totalQty > 0 ? Math.round((availQty / totalQty) * 100) : 100;

    document.getElementById('pageContent').innerHTML = `
      <div class="mb-4">
        <h3 class="text-light fw-bold mb-1"><i class="bi bi-graph-up-arrow text-primary me-2"></i>Báo cáo Thống kê</h3>
        <p class="text-muted small mb-0">Thống kê hoạt động, tổng hợp doanh thu tiền phạt và lưu lượng sách</p>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-6 col-lg-3">
          <div class="card bg-dark border-secondary p-3 text-white h-100">
            <span class="text-muted small text-uppercase fw-bold">Tổng doanh thu phạt</span>
            <h3 class="mt-2 mb-0 fw-bold text-success">${fmtMoney(totalFinePaid)}</h3>
            <div class="mt-2 small text-muted">Đã thu ngân sách thực tế</div>
          </div>
        </div>
        
        <div class="col-md-6 col-lg-3">
          <div class="card bg-dark border-secondary p-3 text-white h-100">
            <span class="text-muted small text-uppercase fw-bold">Nợ phạt chưa thu</span>
            <h3 class="mt-2 mb-0 fw-bold text-warning">${fmtMoney(totalFineUnpaid)}</h3>
            <div class="mt-2 small text-muted">Đang chờ xử lý thu hồi</div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card bg-dark border-secondary p-3 text-white h-100">
            <span class="text-muted small text-uppercase fw-bold">Sách đang lưu thông</span>
            <h3 class="mt-2 mb-0 fw-bold text-primary">${borrowingDetailsCount} cuốn</h3>
            <div class="mt-2 small text-muted">Đang nằm ngoài kho lưu trữ</div>
          </div>
        </div>

        <div class="col-md-6 col-lg-3">
          <div class="card bg-dark border-secondary p-3 text-white h-100">
            <span class="text-muted small text-uppercase fw-bold">Tỉ lệ khả dụng kho</span>
            <h3 class="mt-2 mb-0 fw-bold text-info">${availRate}%</h3>
            <div class="mt-2 small text-muted">Số sách sẵn sàng mượn</div>
          </div>
        </div>
      </div>

      <div class="card bg-dark border-secondary p-4">
        <h5 class="text-light fw-bold mb-3"><i class="bi bi-info-circle text-primary me-2"></i>Chi tiết vận hành hệ thống</h5>
        <div class="row g-3">
          <div class="col-sm-6">
            <div class="p-3 bg-dark-subtle rounded border border-secondary-subtle">
              <div class="text-muted small">Tổng số đầu sách lưu kho</div>
              <div class="fs-4 fw-bold text-light">${books.length}</div>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="p-3 bg-dark-subtle rounded border border-secondary-subtle">
              <div class="text-muted small">Tổng số phiếu mượn được lập</div>
              <div class="fs-4 fw-bold text-light">${borrowsList.length}</div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    showToast('Lỗi tải báo cáo thống kê: ' + error.message, 'error');
  }
}
