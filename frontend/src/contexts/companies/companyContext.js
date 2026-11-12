import { createContext, useContext } from 'react';
export const CompanyContext = createContext(null);
export const useCompany = () => useContext(CompanyContext);
