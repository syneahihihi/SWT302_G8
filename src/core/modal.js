// ==================== MODAL CONTROLLER ====================
import { Modal } from 'bootstrap';

export function openModal(id) {
  const el = document.getElementById(id);
  if (el) {
    let modal = Modal.getInstance(el);
    if (!modal) modal = new Modal(el);
    modal.show();
  }
}

export function closeModal(id) {
  const el = document.getElementById(id);
  if (el) {
    const modal = Modal.getInstance(el);
    if (modal) modal.hide();
  }
}

export function showConfirm(message, callback) {
  document.getElementById('confirmMessage').textContent = message;
  const btn = document.getElementById('confirmBtn');
  btn.onclick = () => {
    closeModal('modalConfirm');
    callback();
  };
  openModal('modalConfirm');
}

// Close modals on escape key (handled globally in main.js, but also here as safe backup)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(el => {
      const modal = Modal.getInstance(el);
      if (modal) modal.hide();
    });
  }
});
