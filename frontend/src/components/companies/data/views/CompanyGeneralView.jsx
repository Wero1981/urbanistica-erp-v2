/**
 * Vista de consulta de información general empresarial.
 *
 * @module components/companies/data/views/CompanyGeneralView
 */

import DataField from "../../../ui/DataField";

/**
 * Presenta los datos generales de una empresa.
 *
 * @param {Object} props
 * @param {Object} props.company - Información empresarial.
 * @returns {import("react").JSX.Element}
 */
export default function CompanyGeneralView({ company }) {
  const companyType =
    company.company_type === "fisica"
      ? "Persona física"
      : "Persona moral";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">
        Información general
      </h2>

      <dl className="mt-6 grid gap-6 md:grid-cols-2">
        <DataField
          label="Razón social o nombre completo"
          value={company.name}
        />

        <DataField
          label="Tipo de contribuyente"
          value={companyType}
        />

        <DataField
          label="Nombre comercial"
          value={company.trade_name}
        />

        <DataField
          label="Actividad económica"
          value={company.economic_activity}
        />

        <DataField
          label="Sitio web"
          value={company.website}
        />

        <DataField
          label="Observaciones"
          value={company.notes}
        />
      </dl>
    </section>
  );
}