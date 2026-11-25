/**
 *
 * Encabezado de la ficha empresarial.
 *
 * @module components/companies/data/CompanySummary
 */

/**
 * Muestra la identidad principal de la empresa
 *
 * @param {Object} props
 * @param {Object} props.company - Información empresarial.
 * @returns {import("react").JSX.Element}
 */
export default function CompanySummary({ company }) {
    const typeLabel = company.company_type === "fisica" ? "Persona física" : "Persona moral";

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
            <p className="text-sm text-slate-500">
                Ficha empresarial
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
                {company.name}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
                {typeLabel}
            </p>
            </div>

            <span
            className={
                company.is_active
                ? "rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700"
                : "rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
            }
            >
            {company.is_active ? "Empresa activa" : "Empresa inactiva"}
            </span>
        </div>
        </section>
  );
}


