// ==================== API CONFIG & INTERCEPTOR ====================

import { config } from './config.js';

export const API_BASE_URL = config.API_BASE_URL;

export function setupFetchInterceptor() {
  const originalFetch = window.fetch;
  window.fetch = async function(url, options = {}) {
    // Only intercept actual API endpoints, ignore Vite HMR and static resource requests
    const apiPaths = ['/auth/', '/accounts', '/books', '/categories', '/authors', '/members', '/librarians', '/borrows'];
    const isApiRequest = typeof url === 'string' && apiPaths.some(path => url.startsWith(path));

    let finalUrl = url;
    if (isApiRequest) {
      finalUrl = `${API_BASE_URL}${url}`;

      const sessionStr = localStorage.getItem('lms_session');
      if (sessionStr) {
        try {
          const session = JSON.parse(sessionStr);
          if (session && session.token) {
            options.headers = options.headers || {};
            options.headers['Authorization'] = `Bearer ${session.token}`;
          }
        } catch (e) {}
      }
    }
    
    return originalFetch(finalUrl, options);
  };
}
