/**
 * Hook para consultar y filtrar empresas.
 *
 * @module hooks/useCompanies
 */

import { useEffect, useMemo, useState } from "react";

import { getCompanies } from "../../services/companies/companyService";
import { apiError } from "../../api/apiClient";

/**
 * Administra el catálogo de empresas.
 *
 * @returns {Object} Estado y acciones del catálogo.
 */
export default function useCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    /**
     * Recupera las empresas activas desde Django.
     *
     * @async
     * @returns {Promise<void>}
     */
    async function loadCompanies() {
      try {
        const response = await getCompanies();

        if (active) {
          setCompanies(response.companies);
          setError("");
        }
      } catch (err) {
        if (active) {
          setCompanies([]);
          setError(apiError(err));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCompanies();

    return () => {
      active = false;
    };
  }, [attempt]);

  /**
   * Filtra las empresas por razón social,
   * nombre comercial o RFC.
   */
  const filteredCompanies = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return companies;

    return companies.filter((company) => {
      const values = [
        company.name,
        company.trade_name,
        company.rfc,
      ];

      return values
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [companies, search]);

  /**
   * Reintenta la consulta de empresas.
   *
   * @returns {void}
   */
  function retry() {
    setLoading(true);
    setAttempt((current) => current + 1);
  }

  return {
    companies,
    filteredCompanies,
    loading,
    error,
    search,
    setSearch,
    retry,
  };
}