import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { login, getCurrentUser } from '../services/authService';
import { getToken, clearSession } from '../services/sessionStore';
import { getRole } from '../config/roles';
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    const expire = () => { setUser(null); };
    window.addEventListener('session-expired', expire);
    async function restore() {
      try { if (getToken()) { const user = await getCurrentUser(); if (active) setUser(user); } }
      catch { clearSession(); }
      finally { if (active) setLoading(false); }
    }
    restore();
    return () => { active = false; window.removeEventListener('session-expired', expire); };
  }, []);
  async function signIn(username, password) {
    setLoading(true);
    try { const user = await login(username, password); setUser(user); }
    finally { setLoading(false); }
  }
  function signOut() { clearSession(); setUser(null); }
  return <AuthContext.Provider value={{ user, role: getRole(user), isLoading, signIn, signOut }}>{children}</AuthContext.Provider>;
}
