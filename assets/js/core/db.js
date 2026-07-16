// ==================== DATA STORE ====================
const DB = {
  get(key) { try { return JSON.parse(localStorage.getItem('lms_' + key)) || []; } catch { return []; } },
  set(key, val) { localStorage.setItem('lms_' + key, JSON.stringify(val)); },
  getObj(key) { try { return JSON.parse(localStorage.getItem('lms_' + key)) || {}; } catch { return {}; } },
  setObj(key, val) { localStorage.setItem('lms_' + key, JSON.stringify(val)); }
};

