/**
 * Página de administración de datos empresariales.
 *
 * @module pages/companies/CompanyDataPage
 */

import PageHeader from "../../components/layout/PageHeader";

import CompanyGeneralForm from "../../components/companies/data/forms/CompanyGeneralForm";

import { useCompany } from "../../contexts/companies/companyContext";
import { useAuth } from "../../contexts/authContext";

import { canWrite } from "../../config/roles";

import useCompanyData from "../../hooks/companies/useCompanyData";

/**
 * Renderiza la información de la empresa activa.
 *
 * @returns {import("react").JSX.Element}
 */
export default function CompanyDataPage() {
  const { activeCompany } = useCompany();
  const { role } = useAuth();

  const {
    company,
    loading,
    saving,
    error,
    success,
    reload,
    save,
  } = useCompanyData(activeCompany?.id);

  const readOnly = !canWrite(role);

  return (
    <div className="space-y-7">

      <PageHeader
        title="Datos de la empresa"
        description={
          activeCompany?.trade_name ||
          activeCompany?.name ||
          "Empresa"
        }
      />

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-danger-soft p-4 text-danger"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-border bg-surface p-4"
        >
          {success}
        </div>
      )}

      {loading ? (
        <p role="status">Cargando información...</p>
      ) : company ? (
        <section className="rounded-2xl border border-border bg-surface p-7">

          <CompanyGeneralForm
            key={company.id}
            company={company}
            onSave={save}
            saving={saving}
            readOnly={readOnly}
          />

        </section>
      ) : (
        <div className="rounded-xl border border-border bg-surface p-6">
          <p>No fue posible obtener la información de la empresa.</p>

          <button
            type="button"
            onClick={reload}
            className="mt-4 text-primary hover:underline"
          >
            Reintentar
          </button>
        </div>
      )}

    </div>
  );
}