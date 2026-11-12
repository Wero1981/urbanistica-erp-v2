/**
 * Pantalla principal de selección de empresas.
 *
 * Coordina la consulta, búsqueda, selección y creación
 * de empresas en Urbanística ERP V2.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/authContext";
import { useCompany } from "../../contexts/companies/companyContext";

import { apiError } from "../../api/apiClient";
import { roles } from "../../config/roles";

import useCompanies from "../../hooks/companies/useCompanies";

import CompanyGrid from "../../components/companies/CompanyGrid";
import CompanySearch from "../../components/companies/CompanySearch";

import Button from "../../components/ui/Button";

/**
 * Coordina el selector de empresas.
 *
 * @returns {import("react").JSX.Element}
 */
export default function SelectCompanyPage() {
  const navigate = useNavigate();

  const { role, signOut } = useAuth();
  const { selectCompany, clearCompany } = useCompany();

  const {
    companies,
    filteredCompanies,
    loading,
    error,
    search,
    setSearch,
    retry,
  } = useCompanies();

  const [selecting, setSelecting] = useState(null);
  const [selectionError, setSelectionError] = useState("");

  const canCreate = ["administrador", "capturista"].includes(role);

  /**
   * Selecciona una empresa y abre su Dashboard.
   *
   * @param {number|string} id - Identificador de la empresa.
   * @returns {Promise<void>}
   */
  async function handleSelect(id) {
    setSelecting(id);
    setSelectionError("");

    try {
      await selectCompany(id);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setSelectionError(apiError(err));
    } finally {
      setSelecting(null);
    }
  }

  /**
   * Cierra la sesión actual.
   *
   * @returns {void}
   */
  function handleLogout() {
    clearCompany();
    signOut();
    navigate("/login", { replace: true });
  }

  return (
    <main className="min-h-screen bg-background px-5 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">

        <header className="mb-12 flex items-center justify-between">
          <h1 className="text-xl font-semibold">
            Urbanística ERP V2
          </h1>

          <Button variant="ghost" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </header>

        <p className="mb-3 text-sm text-primary">
          Rol global: {roles[role] || role}
        </p>

        <h2 className="mb-4 text-3xl font-semibold">
          Seleccione su espacio de trabajo
        </h2>

        <CompanySearch
          value={search}
          onChange={setSearch}
          canCreate={canCreate}
          onCreate={() => navigate("/crear-empresa")}
        />

        {(error || selectionError) && (
          <div role="alert" className="mb-6 rounded-xl bg-danger-soft p-4 text-danger">
            {error || selectionError}

            {error && (
              <Button variant="secondary" onClick={retry}>
                Reintentar
              </Button>
            )}
          </div>
        )}

        {loading ? (
          <p role="status">Cargando empresas...</p>
        ) : (
          <>
            {!error && companies.length === 0 && (
              <p>No hay empresas registradas.</p>
            )}

            {!error && companies.length > 0 && filteredCompanies.length === 0 && (
              <p>No se encontraron empresas.</p>
            )}

            {!error && (
              <CompanyGrid
                companies={filteredCompanies}
                onSelect={handleSelect}
                selecting={selecting}
              />
            )}
          </>
        )}

      </div>
    </main>
  );
}