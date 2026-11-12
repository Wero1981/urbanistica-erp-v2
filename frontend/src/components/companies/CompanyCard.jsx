/**
 * Tarjeta de selección de empresa.
 *
 * Presenta la información básica de una empresa
 * y permite seleccionarla como espacio de trabajo.
 *
 * @module components/companies/CompanyCard
 */

import { Building2, ArrowRight } from "lucide-react";

import Button from "../ui/Button";

/**
 * Representa una empresa disponible en el selector.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.company - Empresa obtenida de la API.
 * @param {number|string} props.company.id - Identificador.
 * @param {string} props.company.name - Razón social.
 * @param {string} [props.company.trade_name] - Nombre comercial.
 * @param {string} [props.company.rfc] - RFC.
 * @param {Function} props.onSelect - Función para seleccionar.
 * @param {boolean} props.loading - Indica si se está seleccionando.
 * @param {boolean} props.disabled - Bloquea temporalmente la selección.
 *
 * @returns {import("react").JSX.Element}
 */
export default function CompanyCard({
  company,
  onSelect,
  loading = false,
  disabled = false,
}) {
  return (
    <article className="flex flex-col rounded-2xl border border-border bg-surface p-6 shadow-sm transition hover:border-primary hover:shadow-md">

      <div className="flex items-center justify-between">
        <Building2 size={30} className="text-primary" />

        <span className="rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success">
          Activa
        </span>
      </div>

      <h3 className="mt-6 text-lg font-semibold text-text">
        {company.trade_name || company.name}
      </h3>

      {company.trade_name && (
        <p className="mt-1 text-sm text-text-muted">
          {company.name}
        </p>
      )}

      <p className="mt-3 text-sm text-text-muted">
        RFC: {company.rfc || "Pendiente de captura"}
      </p>

      <div className="mt-auto pt-6">
        <Button
          type="button"
          className="w-full"
          disabled={disabled}
          onClick={() => onSelect(company.id)}
        >
          {loading ? "Ingresando..." : "Ingresar"}

          <ArrowRight size={17} />
        </Button>
      </div>

    </article>
  );
}