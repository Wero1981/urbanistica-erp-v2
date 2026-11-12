import axios from 'axios';
import { getToken, clearSession } from '../services/sessionStore';
export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', timeout: 15000 });
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !config.public) config.headers.Authorization = `Bearer ${token}`;
  // Company scope is explicit: global requests never inherit a stale selection.
  if (config.companyId != null) config.headers['X-Company-ID'] = String(config.companyId);
  return config;
});
apiClient.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && !error.config?.public) {
    clearSession();
    window.dispatchEvent(new Event('session-expired'));
  }
  return Promise.reject(error);
});
export function apiError(error) {
  if (error.response?.status === 404) return 'Este servicio todavía no está disponible en V2.';
  if (error.response?.status === 403) return 'No tiene permiso para realizar esta operación.';
  return error.response?.data?.detail || error.message || 'No fue posible conectar al servidor.';
}
