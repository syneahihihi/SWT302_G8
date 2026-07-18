export async function renderConfig() {
  document.getElementById('pageContent').innerHTML = `
    <div class="mb-4">
      <h3 class="text-light fw-bold mb-1"><i class="bi bi-gear-fill text-primary me-2"></i>Cấu hình Hệ thống</h3>
      <p class="text-muted small mb-0">Quản lý các cài đặt chung và tham số vận hành thư viện</p>
    </div>
    
    <div class="card bg-dark border-secondary p-4 text-center text-muted">
      <i class="bi bi-gear-wide-connected fs-1 mb-3"></i>
      <h5 class="text-light">Tính năng đang cập nhật</h5>
      <p class="mb-0">Phần cấu hình hệ thống đang được phát triển để tương thích với Backend mới.</p>
    </div>
  `;
}
