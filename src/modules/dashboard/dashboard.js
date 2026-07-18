import { state } from '../../core/state.js';
import { showToast } from '../../core/toast.js';
import { getLast7MonthBorrows, renderBorrowChart, getTopBorrowedBooks, renderOverdueList } from '../../shared/helpers.js';

export async function renderDashboard() {
  try {
    const isMember = state.currentUser.role === 'Member';
    const [booksRes, borrowsRes, membersRes] = await Promise.all([
      fetch('/books'),
      fetch(isMember ? '/borrows/my' : '/borrows'),
      isMember ? Promise.resolve(new Response(JSON.stringify([]))) : fetch('/members')
    ]);
    
    if (!booksRes.ok || !borrowsRes.ok || !membersRes.ok) {
      throw new Error('Lỗi khi fetch dữ liệu từ API server');
    }
    
    const books = await booksRes.json();
    const borrowsList = await borrowsRes.json();
    const membersData = await membersRes.json();
    
    const borrows = borrowsList.map(w => w.borrow || w);
    const activeBorrows = borrows.filter(b => b.status === 'BORROWING');
    const membersCount = isMember ? 0 : membersData.length;

    document.getElementById('pageContent').innerHTML = `
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="card card-premium p-3 border-0 bg-gradient text-white" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="text-muted small text-uppercase fw-bold">Tổng đầu sách</span>
                <h2 class="mt-2 mb-0 fw-bold">${books.length}</h2>
              </div>
              <div class="fs-1 text-primary"><i class="bi bi-book"></i></div>
            </div>
            <div class="mt-3 small text-success">
              <i class="bi bi-arrow-up-right"></i> Đang lưu trữ trong hệ thống
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card card-premium p-3 border-0 bg-gradient text-white" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="text-muted small text-uppercase fw-bold">${isMember ? 'Sách đã mượn' : 'Sinh viên'}</span>
                <h2 class="mt-2 mb-0 fw-bold">${isMember ? borrowsList.length : membersCount}</h2>
              </div>
              <div class="fs-1 text-success"><i class="bi ${isMember ? 'bi-journal-check' : 'bi-people'}"></i></div>
            </div>
            <div class="mt-3 small text-success">
              <i class="bi bi-arrow-up-right"></i> ${isMember ? 'Lịch sử phiếu mượn' : 'Tài khoản hoạt động'}
            </div>
          </div>
        </div>
        
        <div class="col-md-4">
          <div class="card card-premium p-3 border-0 bg-gradient text-white" style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <span class="text-muted small text-uppercase fw-bold">Đang mượn</span>
                <h2 class="mt-2 mb-0 fw-bold">${activeBorrows.length}</h2>
              </div>
              <div class="fs-1 text-warning"><i class="bi bi-journal-text"></i></div>
            </div>
            <div class="mt-3 small text-warning">
              <i class="bi bi-clock-history"></i> Phiếu chưa hoàn thành trả sách
            </div>
          </div>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-8">
          <div class="card bg-dark border-secondary p-4 h-100">
            <h5 class="card-title text-light mb-4"><i class="bi bi-bar-chart-line me-2 text-primary"></i>Hoạt động mượn sách 7 tháng gần đây</h5>
            <div id="borrowChart" class="h-100 d-flex align-items-end" style="min-height: 220px;"></div>
          </div>
        </div>
        
        <div class="col-lg-4">
          <div class="row g-4">
            <div class="col-12">
              <div class="card bg-dark border-secondary p-3">
                <h6 class="card-title text-light mb-3"><i class="bi bi-award me-2 text-warning"></i>Sách mượn nhiều nhất</h6>
                <div id="topBooksList"></div>
              </div>
            </div>
            <div class="col-12">
              <div class="card bg-dark border-secondary p-3">
                <h6 class="card-title text-light mb-3"><i class="bi bi-exclamation-circle me-2 text-danger"></i>Cảnh báo quá hạn</h6>
                <div id="overdueList"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Render monthly statistics chart
    const chartData = getLast7MonthBorrows(borrowsList);
    renderBorrowChart(chartData, 'borrowChart');

    // Render top borrowed books
    const topBooksContainer = document.getElementById('topBooksList');
    if (topBooksContainer) {
      topBooksContainer.innerHTML = getTopBorrowedBooks(borrowsList, 4);
    }

    // Render overdue warnings
    const overdueContainer = document.getElementById('overdueList');
    if (overdueContainer) {
      overdueContainer.innerHTML = renderOverdueList(borrowsList);
    }

  } catch (error) {
    showToast('Lỗi khi tải dữ liệu dashboard: ' + error.message, 'error');
  }
}
