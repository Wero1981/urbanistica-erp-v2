/**
 * Ficha empresarial de Urbanística ERP V2.
 *
 * Presenta un resumen de la información de la empresa
 * activa y permite navegar a la pantalla de edición.
 *
 * @module pages/companies/CompanyDataPage
 */

import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/authContext";
import { useCompany } from "../../contexts/companies/companyContext";

import { canWrite } from "../../config/roles";

import useCompanyData from "../../hooks/companies/useCompanyData";

import CompanySummary from "../../components/companies/data/CompanySummary";
import CompanyGeneralView from "../../components/companies/data/views/CompanyGeneralView";
import CompanyRelationsView from "../../components/companies/data/views/CompanyRelationsView";
import DataField from "../../components/ui/DataField";

/**
 * Renderiza la ficha de consulta de la empresa activa.
 *
 * @returns {import("react").JSX.Element}
 */
export default function CompanyDataPage() {
  const { activeCompany } = useCompany();
  const { role } = useAuth();

  const {
    company,
    loading,
    error,
    reload,
  } = useCompanyData(activeCompany?.id);

  if (loading) {
    return (
      <p role="status" className="p-6">
        Cargando ficha empresarial...
      </p>
    );
  }

  if (!company) {
    return (
      <section role="alert" className="space-y-4 p-6">
        <h1 className="text-xl font-semibold">
          No fue posible cargar la empresa
        </h1>

        <p>{error || "No hay información disponible."}</p>

        <button
          type="button"
          onClick={reload}
          className="rounded-lg border px-4 py-2"
        >
          Reintentar
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Datos de la empresa
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Resumen de la información registrada.
          </p>
        </div>

        {canWrite(role) && (
          <Link
            to="/datos/editar"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            Editar información
          </Link>
        )}
      </div>

      <CompanySummary company={company} />

      <CompanyGeneralView company={company} />

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">
          Información fiscal
        </h2>

        <dl className="mt-6 grid gap-6 md:grid-cols-2">
          <DataField label="RFC" value={company.rfc} />

          <DataField
            label="Régimen fiscal"
            value={company.tax_regime}
          />
        </dl>
      </section>

      <CompanyRelationsView companyId={company.id} />
    </div>
  );
}
