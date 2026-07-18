// ==================== TOAST NOTIFICATIONS ====================

export function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '1080';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'bi-check-circle-fill text-success',
    error: 'bi-x-circle-fill text-danger',
    warning: 'bi-exclamation-triangle-fill text-warning',
    info: 'bi-info-circle-fill text-info'
  };

  const borderClasses = {
    success: 'border-success',
    error: 'border-danger',
    warning: 'border-warning',
    info: 'border-info'
  };

  const toastEl = document.createElement('div');
  toastEl.className = `toast align-items-center text-white bg-dark border ${borderClasses[type] || 'border-secondary'} show`;
  toastEl.role = 'alert';
  toastEl.ariaLive = 'assertive';
  toastEl.ariaAtomic = 'true';

  toastEl.innerHTML = `
    <div class="d-flex">
      <div class="toast-body d-flex align-items-center">
        <i class="bi ${icons[type] || 'bi-info-circle-fill'} fs-5 me-2"></i>
        <span>${message}</span>
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  container.appendChild(toastEl);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toastEl.classList.remove('show');
    toastEl.classList.add('hide');
    setTimeout(() => toastEl.remove(), 500);
  }, 4000);

  const closeBtn = toastEl.querySelector('.btn-close');
  if (closeBtn) {
    closeBtn.onclick = () => {
      toastEl.remove();
    };
  }
}
