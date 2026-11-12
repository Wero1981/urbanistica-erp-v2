/**
 * Controles de búsqueda y creación de empresas.
 *
 * @module components/companies/CompanySearch
 */

import { Search, Plus } from "lucide-react";

import Button from "../ui/Button";

/**
 * Muestra el buscador y la acción de creación.
 *
 * @param {Object} props
 * @param {string} props.value - Texto de búsqueda.
 * @param {Function} props.onChange - Actualiza la búsqueda.
 * @param {boolean} props.canCreate - Permiso de creación.
 * @param {Function} props.onCreate - Abre el formulario.
 *
 * @returns {import("react").JSX.Element}
 */
export default function CompanySearch({
  value,
  onChange,
  canCreate,
  onCreate,
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      <div className="relative w-full sm:max-w-md">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        />

        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Buscar empresa por nombre o RFC..."
          aria-label="Buscar empresas"
          className="w-full rounded-xl border border-border bg-surface py-3 pl-12 pr-4 text-text outline-none transition focus:border-primary"
        />
      </div>

      {canCreate && (
        <Button
          type="button"
          onClick={onCreate}
        >
          <Plus size={18} />
          Crear empresa
        </Button>
      )}

    </div>
  );
}