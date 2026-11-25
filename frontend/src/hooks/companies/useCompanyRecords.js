/** Hook reutilizable para colecciones relacionadas con una empresa. */

import { useCallback, useEffect, useState } from "react";

import { apiError } from "../../api/apiClient";

/**
 * Administra carga y baja de registros empresariales.
 *
 * @param {number|string} companyId - Empresa activa.
 * @param {Object} service - Servicio CRUD.
 */
export default function useCompanyRecords(companyId, service) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (companyId == null) return;
    setLoading(true);
    setError("");
    try {
      setRecords(await service.list(companyId));
    } catch (requestError) {
      setError(apiError(requestError));
    } finally {
      setLoading(false);
    }
  }, [companyId, service]);

  useEffect(() => {
    const timer = setTimeout(() => void reload(), 0);
    return () => clearTimeout(timer);
  }, [reload]);

  return { records, loading, error, setError, reload };
}
