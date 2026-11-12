/**
 * Hook para consultar y actualizar los datos de una empresa.
 *
 * @module hooks/companies/useCompanyData
 */

import { useCallback, useEffect, useState } from "react";

import {
  getCompany,
  updateCompany,
} from "../../services/companies/companyService";

import { apiError } from "../../api/apiClient";

/**
 * Administra la información de una empresa.
 *
 * @param {number|string} companyId - Identificador de empresa.
 * @returns {Object} Datos, estados y operaciones.
 */
export default function useCompanyData(companyId) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /**
   * Consulta la información actual de la empresa.
   *
   * @returns {Promise<void>}
   */
  const reload = useCallback(async () => {
    if (companyId == null) {
      setCompany(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getCompany(companyId);
      setCompany(data);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    reload();
  }, [reload]);

  /**
   * Guarda cambios parciales de la empresa.
   *
   * @param {Object} payload - Información modificada.
   * @returns {Promise<boolean>} Resultado de la operación.
   */
  async function save(payload) {
    if (companyId == null || saving) {
      return false;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateCompany(companyId, payload);

      setCompany(updated);
      setSuccess("Los datos se guardaron correctamente.");

      return true;
    } catch (err) {
      setError(apiError(err));
      return false;
    } finally {
      setSaving(false);
    }
  }

  return {
    company,
    loading,
    saving,
    error,
    success,
    reload,
    save,
  };
}