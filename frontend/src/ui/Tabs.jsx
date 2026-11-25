/**
 * Navegación genérica mediante pestañas.
 *
 * @module components/ui/Tabs
 */

/**
 * Renderiza un conjunto de pestañas accesibles.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Array<{key: string, label: string, disabled?: boolean}>} props.items
 * @param {string} props.value - Identificador de la pestaña activa.
 * @param {(key: string) => void} props.onChange - Cambio de pestaña.
 * @returns {import("react").JSX.Element}
 */
export default function Tabs({ items, value, onChange }) {
  return (
    <nav aria-label="Secciones del formulario">
      <div
        role="tablist"
        aria-label="Secciones de edición"
        className="flex flex-wrap gap-2 border-b border-slate-200 pb-3"
      >
        {items.map((item) => {
          const active = item.key === value;

          return (
            <button
              key={item.key}
              id={`tab-${item.key}`}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`panel-${item.key}`}
              tabIndex={active ? 0 : -1}
              disabled={item.disabled}
              onClick={() => onChange(item.key)}
              className={[
                "rounded-lg px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
                item.disabled
                  ? "cursor-not-allowed opacity-40"
                  : "",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}