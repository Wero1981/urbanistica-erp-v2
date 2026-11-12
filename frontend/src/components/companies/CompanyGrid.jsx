/**
 * Cuadrícula de empresas disponibles.
 *
 * @module components/companies/CompanyGrid
 */

import CompanyCard from "./CompanyCard";

/**
 * Renderiza el catálogo de empresas.
 *
 * @param {Object} props
 * @param {Array<Object>} props.companies - Empresas disponibles.
 * @param {Function} props.onSelect - Acción de selección.
 * @param {number|string|null} props.selecting - Empresa en proceso.
 *
 * @returns {import("react").JSX.Element}
 */
export default function CompanyGrid({
  companies,
  onSelect,
  selecting,
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onSelect={onSelect}
          loading={selecting === company.id}
          disabled={selecting !== null}
        />
      ))}
    </div>
  );
}