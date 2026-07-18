import { state } from '../../core/state.js';
import { showToast } from '../../core/toast.js';
import { navigateTo } from '../../core/router.js';
import { fmtDate, fmtMoney } from '../../shared/helpers.js';

export async function renderReturnProcess() {
  document.getElementById('pageContent').innerHTML = `
    <div class="mb-4">
      <h3 class="text-light fw-bold mb-1"><i class="bi bi-journal-arrow-up text-primary me-2"></i>Trả Sách</h3>
      <p class="text-muted small mb-0">Xử lý trả sách, báo mất hỏng và thu phí phạt từng cuốn sách</p>
    </div>

    <div class="card bg-dark border-secondary p-4 mx-auto" style="max-width: 800px;">
      <div class="mb-4">
        <label class="form-label text-light">🔍 Tìm phiếu mượn hoạt động</label>
        <div class="input-group">
          <span class="input-group-text bg-dark-subtle border-secondary text-secondary"><i class="bi bi-search"></i></span>
          <input class="form-control bg-dark-subtle border-secondary text-white" type="text" id="returnSearchInline" placeholder="Nhập mã phiếu mượn (vd: 1) hoặc tên thành viên..." oninput="window.searchReturnBorrowInline(this.value)" />
        </div>
      </div>
      
      <div id="returnResultsInline" class="d-flex flex-column gap-3"></div>
    </div>
  `;

  try {
    const res = await fetch('/borrows');
    if (!res.ok) throw new Error('Không thể tải danh sách phiếu mượn');
    
    // Filter borrows with active borrowing books OR unpaid fine amounts
    window._activeBorrows = (await res.json()).filter(b => 
      b.borrow.status === 'BORROWING' || 
      b.details.some(d => d.fineAmount > 0 && d.isPaid === false)
    );
  } catch (error) {
    showToast('Lỗi khi tải danh sách phiếu mượn: ' + error.message, 'error');
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
      container.innerHTML = `
        <div class="text-center py-4 text-muted">
          <i class="bi bi-search fs-3 d-block mb-2"></i>
          <span>Không tìm thấy phiếu mượn đang hoạt động khớp với từ khóa</span>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(w => {
      const b = w.borrow;
      const details = w.details;
      const isOverdue = b.dueDate < today && b.status === 'BORROWING';
      const lateDays = isOverdue ? Math.ceil((new Date(today) - new Date(b.dueDate)) / 86400000) : 0;

      const detailsHtml = details.map(d => {
        if (d.status !== 'BORROWING') {
          const fineUI = (d.fineAmount > 0 && d.isPaid === false)
            ? `<button class="btn btn-warning btn-sm fw-bold px-3 py-1" onclick="window.payFine('${d.id}')"><i class="bi bi-cash-coin me-1"></i> Thu phạt: ${fmtMoney(d.fineAmount)}</button>`
            : (d.fineAmount > 0 ? `<span class="badge bg-success-subtle border border-success text-success px-3 py-2"><i class="bi bi-check2-all me-1"></i> Đã thu phạt (${fmtMoney(d.fineAmount)})</span>` : '');
          
          let bookStatusLabel = `<span class="badge bg-success-subtle border border-success text-success px-2 py-1">${d.status}</span>`;
          if (d.status === 'LOST') bookStatusLabel = `<span class="badge bg-danger-subtle border border-danger text-danger px-2 py-1">${d.status}</span>`;
          else if (d.status === 'DAMAGED') bookStatusLabel = `<span class="badge bg-warning-subtle border border-warning text-warning px-2 py-1">${d.status}</span>`;

          return `
            <div class="d-flex align-items-center justify-content-between p-3 bg-dark-subtle rounded border border-secondary mb-2">
              <div class="d-flex align-items-center gap-2">
                <span class="text-light-emphasis small fw-medium">📘 ${d.book.title}</span>
                ${bookStatusLabel}
              </div>
              <div>${fineUI}</div>
            </div>
          `;
        }
        
        return `
          <div class="p-3 bg-dark-subtle rounded border border-secondary mb-2">
            <div class="fw-semibold text-light mb-3">📘 ${d.book.title}</div>
            <div class="row g-2 align-items-center">
              <div class="col-md-7 col-sm-6">
                <select class="form-select bg-dark border-secondary text-white form-select-sm" id="condition_${d.id}">
                  <option value="good">Tình trạng sách: Tốt (Bình thường)</option>
                  <option value="damaged">Có hư hại / Rách nát (Phạt 50%)</option>
                  <option value="lost">Báo mất sách (Phạt 100% trị giá)</option>
                </select>
              </div>
              <div class="col-md-5 col-sm-6 text-end">
                <button class="btn btn-success btn-sm w-100 fw-semibold" onclick="window.confirmReturn('${d.id}')"><i class="bi bi-arrow-return-left me-1"></i> Xác nhận trả</button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="card bg-dark-subtle border-secondary p-3">
          <div class="d-flex justify-content-between align-items-start border-bottom border-secondary pb-2 mb-3">
            <div>
              <code class="text-primary font-monospace fw-semibold fs-7">BR${b.id}</code>
              <h6 class="text-light fw-bold mb-0 mt-1">${b.member?.account?.fullname || '?'}</h6>
            </div>
            ${isOverdue 
              ? `<span class="badge bg-danger"><i class="bi bi-clock-fill me-1"></i> Quá hạn ${lateDays} ngày</span>` 
              : `<span class="badge bg-primary"><i class="bi bi-book me-1"></i> Đang mượn</span>`
            }
          </div>
          <div class="row g-2 mb-3 small text-muted">
            <div class="col-sm-6"><i class="bi bi-calendar-event me-1"></i>Ngày mượn: <strong class="text-secondary">${fmtDate(b.borrowDate)}</strong></div>
            <div class="col-sm-6"><i class="bi bi-calendar-check me-1"></i>Hạn trả: <strong class="${isOverdue ? 'text-danger fw-bold' : 'text-success'}">${fmtDate(b.dueDate)}</strong></div>
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
      const res = await fetch(`/borrows/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ detailId: parseInt(detailId), condition: condition })
      });
      
      if (!res.ok) {
        let errText = await res.text();
        try { const errObj = JSON.parse(errText); if (errObj.error) errText = errObj.error; } catch(e) {}
        throw new Error(errText);
      }
      const updated = await res.json();
      
      // Find the updated detail to show fee warnings
      const updatedDetail = updated.details.find(d => d.id == detailId);
      const msg = updatedDetail.fineAmount > 0 
        ? `Xử lý trả sách hoàn tất! Phát sinh phí phạt: ${fmtMoney(updatedDetail.fineAmount)}`
        : 'Đã trả sách thành công!';
      
      showToast(msg, updatedDetail.fineAmount > 0 ? 'warning' : 'success');
      navigateTo('return-process'); // Reload layout
    } catch(error) {
      showToast('Lỗi: ' + error.message, 'error');
    }
  };

  window.payFine = async (detailId) => {
    try {
      const res = await fetch(`/borrows/details/${detailId}/pay-fine`, {
        method: 'PUT'
      });
      
      if (!res.ok) {
        let errText = await res.text();
        try { const errObj = JSON.parse(errText); if (errObj.error) errText = errObj.error; } catch(e) {}
        throw new Error(errText);
      }
      showToast('Đã thu tiền phạt và cập nhật trạng thái hóa đơn thành công!', 'success');
      navigateTo('return-process'); // Reload layout
    } catch(error) {
      showToast('Lỗi: ' + error.message, 'error');
    }
  };
}
