import { apiClient } from '../api/apiClient';
import { setToken, clearSession } from './sessionStore';
import { getRole } from '../config/roles';
export async function getCurrentUser() {
  const { data } = await apiClient.get('/auth/me/');
  if (!getRole(data)) throw new Error('El usuario no tiene un rol global válido. Contacte al administrador.');
  return data;
}
export async function login(username, password) {
  try {
    const { data } = await apiClient.post('/auth/login/', { username, password }, { public: true });
    if (typeof data.access !== 'string' || !data.access) throw new Error('Respuesta de autenticación inválida.');
    setToken(data.access);
    return await getCurrentUser();
  } catch (error) { clearSession(); throw error; }
}
