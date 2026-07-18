// ==================== GLOBAL APP STATE ====================

export const state = {
  currentUser: null,
  currentPage: 'dashboard',
  selectedBorrowBooks: [],
  currentReturnBorrow: null
};

export function setCurrentUser(user) {
  state.currentUser = user;
  if (user) {
    localStorage.setItem('lms_session', JSON.stringify(user));
  } else {
    localStorage.removeItem('lms_session');
  }
}

export function getCurrentUser() {
  if (!state.currentUser) {
    const sessionStr = localStorage.getItem('lms_session');
    if (sessionStr) {
      try {
        state.currentUser = JSON.parse(sessionStr);
      } catch (e) {
        localStorage.removeItem('lms_session');
      }
    }
  }
  return state.currentUser;
}
