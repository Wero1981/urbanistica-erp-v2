import { useEffect, useState } from 'react';
import { CompanyContext } from './companyContext';
import { getCompany } from '../../services/companies/companyService';
const key = 'urbanistica-v2.company';
export default function CompanyProvider({ children }) {
  const [activeCompany, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    async function restore() {
      try { const id = sessionStorage.getItem(key); if (id) { const company = await getCompany(id); if (active) setCompany(company); } }
      catch { sessionStorage.removeItem(key); }
      finally { if (active) setLoading(false); }
    }
    restore();
    return () => { active = false; };
  }, []);
  async function selectCompany(id) {
    const company = await getCompany(id);
    sessionStorage.setItem(key, String(company.id)); setCompany(company);
  }
  function clearCompany() { sessionStorage.removeItem(key); setCompany(null); }
  return <CompanyContext.Provider value={{ activeCompany, loading, selectCompany, clearCompany }}>{children}</CompanyContext.Provider>;
}
