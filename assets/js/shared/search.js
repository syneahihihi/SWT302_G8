// ==================== GLOBAL SEARCH ====================
function globalSearchHandler(val) {
  if (!val.trim()) return;
  if (currentPage !== 'books') {
    navigateTo('books');
    setTimeout(() => {
      const inp = document.getElementById('bookSearchInput');
      if (inp) { inp.value = val; bookFilter.search = val.toLowerCase(); filterBooks(); }
    }, 100);
  } else {
    const inp = document.getElementById('bookSearchInput');
    if (inp) { inp.value = val; filterBooks(); }
  }
}

function toggleNotifications() {
  const borrows = DB.get('borrows');
  const today = new Date().toISOString().split('T')[0];
  const overdue = borrows.filter(b => !b.returnDate && b.dueDate < today);
  if (overdue.length > 0) {
    showToast(`⚠️ Có ${overdue.length} phiếu mượn quá hạn cần xử lý!`, 'warning');
    if (currentUser.role !== 'Member') navigateTo('violations');
  } else {
    showToast('✅ Không có thông báo mới', 'info');
  }
}

