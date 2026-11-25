/**
 * Página de edición de datos empresariales.
 *
 * Organiza los formularios mediante pestañas y
 * administra el regreso a la ficha empresarial.
 *
 * @module pages/companies/CompanyDataEditPage
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useCompany } from "../../contexts/companies/companyContext";

import useCompanyData from "../../hooks/companies/useCompanyData";

import CompanyDataTabs from "../../components/companies/data/CompanyDataTabs";
import { COMPANY_DATA_TABS } from "../../config/companyDataTabs";

import CompanyGeneralForm from "../../components/companies/data/forms/CompanyGeneralForm";

import CompanyFiscalForm from "../../components/companies/data/forms/CompanyFiscalForm";
import CompanyAddressesForm from "../../components/companies/data/forms/CompanyAddressesForm";
import CompanyPartnersForm from "../../components/companies/data/forms/CompanyPartnersForm";
import CompanyRepresentativesForm from "../../components/companies/data/forms/CompanyRepresentativesForm";

/**
 * Renderiza la edición de la empresa activa.
 *
 * @returns {import("react").JSX.Element}
 */
export default function CompanyDataEditPage() {
  const navigate = useNavigate();
  const { activeCompany, selectCompany } = useCompany();

  const [activeTab, setActiveTab] = useState("general");

  const {
    company,
    loading,
    saving,
    error,
    success,
    reload,
    save,
  } = useCompanyData(activeCompany?.id);

  /**
 * Guarda la sección activa y avanza a la siguiente
 * pestaña disponible cuando el backend confirma el guardado.
 *
 * @param {Object} payload - Información del formulario.
 * @returns {Promise<boolean>} Resultado del guardado.
 */
  function advance() {
    const currentIndex = COMPANY_DATA_TABS.findIndex((tab) => tab.key === activeTab);
    const nextTab = COMPANY_DATA_TABS[currentIndex + 1];
    if (nextTab) setActiveTab(nextTab.key);
    else navigate("/datos");
  }

  async function handleSave(payload) {
    const saved = await save(payload);

  if (!saved) {
    return false;
  }

  // Actualiza los datos compartidos de la empresa.
  try {
    await selectCompany(activeCompany.id);
  } catch (error) {
    console.error("No fue posible actualizar el contexto:", error);
  }

    advance();

    return true;
  }

  if (loading) {
    return (
      <p role="status" className="p-6">
        Cargando información empresarial...
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
          <p className="text-sm text-slate-500">
            Datos de la empresa
          </p>

          <h1 className="mt-1 text-2xl font-bold">
            Editar información
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {company.name}
          </p>
        </div>

        <Link
          to="/datos"
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
        >
          Volver a la ficha
        </Link>
      </div>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div role="status" className="rounded-xl bg-green-50 p-4 text-green-700">
          {success}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <CompanyDataTabs
          value={activeTab}
          onChange={setActiveTab}
        />

        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
          className="mt-6"
        >
          {activeTab === "general" && (
            <CompanyGeneralForm
              key={company.id}
              company={company}
              onSave={handleSave}
              onCancel={() => navigate("/datos")}
              saving={saving}
            />
          )}

          {activeTab === "fiscal" && (
            <CompanyFiscalForm
              key={company.id}
              company={company}
              onSave={handleSave}
              onCancel={() => navigate("/datos")}
              saving={saving}
            />
          )}

          {activeTab === "domicilios" && (
            <CompanyAddressesForm
              companyId={company.id}
              onComplete={advance}
              onCancel={() => navigate("/datos")}
            />
          )}

          {activeTab === "socios" && (
            <CompanyPartnersForm
              companyId={company.id}
              onComplete={advance}
              onCancel={() => navigate("/datos")}
            />
          )}

          {activeTab === "representantes" && (
            <CompanyRepresentativesForm
              companyId={company.id}
              onComplete={advance}
              onCancel={() => navigate("/datos")}
            />
          )}
        </div>
      </section>
    </div>
  );
}
