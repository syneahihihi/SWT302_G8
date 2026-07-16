// ==================== CONFIG ====================
function renderConfig() {
  const config = DB.getObj('config');

  document.getElementById('pageContent').innerHTML = `
    <div class="section-header">
      <div>
        <div class="section-title">⚙️ Cấu hình Hệ thống</div>
        <div class="section-subtitle">Thiết lập các tham số hoạt động của thư viện</div>
      </div>
    </div>

    <div class="config-grid">
      <div class="config-item">
        <div class="config-label">📅 Thời hạn mượn tối đa (ngày)</div>
        <input class="form-control" type="number" id="cfg_maxBorrowDays" value="${config.maxBorrowDays}" min="1" max="60" />
      </div>
      <div class="config-item">
        <div class="config-label">📚 Số sách tối đa mỗi lần mượn</div>
        <input class="form-control" type="number" id="cfg_maxBooksPerMember" value="${config.maxBooksPerMember}" min="1" max="10" />
      </div>
      <div class="config-item">
        <div class="config-label">💰 Phí phạt mỗi ngày quá hạn (VND)</div>
        <input class="form-control" type="number" id="cfg_finePerDay" value="${config.finePerDay}" min="0" step="500" />
      </div>
      <div class="config-item">
        <div class="config-label">🔧 Phụ phí sách hỏng (%)</div>
        <input class="form-control" type="number" id="cfg_fineDamagedPercent" value="${config.fineDamagedPercent}" min="0" max="200" />
      </div>
      <div class="config-item">
        <div class="config-label">❌ Phụ phí sách mất (%)</div>
        <input class="form-control" type="number" id="cfg_fineLostPercent" value="${config.fineLostPercent}" min="0" max="300" />
      </div>
      <div class="config-item">
        <div class="config-label">🔔 Nhắc nhở trước hạn (ngày)</div>
        <input class="form-control" type="number" id="cfg_reminderDaysBefore" value="${config.reminderDaysBefore}" min="1" max="14" />
      </div>
    </div>

    <div style="display:flex;gap:12px;margin-top:24px;justify-content:flex-end;">
      <button class="btn btn-secondary" onclick="renderConfig()">↩️ Hủy thay đổi</button>
      <button class="btn btn-primary" onclick="saveConfig()">💾 Lưu cấu hình</button>
    </div>

    <div class="card" style="margin-top:32px;">
      <div class="card-header"><div class="card-title">⚠️ Vùng nguy hiểm</div></div>
      <div style="color:var(--text-secondary);font-size:13px;margin-bottom:16px;">Các thao tác sau không thể hoàn tác. Hãy cân nhắc kỹ trước khi thực hiện.</div>
      <button class="btn btn-danger" onclick="confirmResetData()">🗑️ Reset toàn bộ dữ liệu demo</button>
    </div>
  `;
}

function saveConfig() {
  const config = {
    maxBorrowDays: parseInt(document.getElementById('cfg_maxBorrowDays').value) || 14,
    maxBooksPerMember: parseInt(document.getElementById('cfg_maxBooksPerMember').value) || 3,
    finePerDay: parseInt(document.getElementById('cfg_finePerDay').value) || 2000,
    fineDamagedPercent: parseInt(document.getElementById('cfg_fineDamagedPercent').value) || 50,
    fineLostPercent: parseInt(document.getElementById('cfg_fineLostPercent').value) || 100,
    reminderDaysBefore: parseInt(document.getElementById('cfg_reminderDaysBefore').value) || 2,
  };
  DB.setObj('config', config);
  showToast('✅ Đã lưu cấu hình hệ thống', 'success');
}

function confirmResetData() {
  showConfirm('⚠️ Bạn có chắc muốn reset toàn bộ dữ liệu? Hành động này KHÔNG THỂ hoàn tác!', () => {
    localStorage.removeItem('lms_initialized');
    ['categories', 'authors', 'books', 'members', 'accounts', 'librarians', 'borrows', 'config'].forEach(k => localStorage.removeItem('lms_' + k));
    showToast('Đã reset dữ liệu. Tải lại trang để khởi tạo lại.', 'warning');
    setTimeout(() => location.reload(), 1500);
  });
}

