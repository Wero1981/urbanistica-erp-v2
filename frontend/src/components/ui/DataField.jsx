/**
 * Componente reutilizable para mostrar información
 * en modo consulta.
 *
 * @module components/ui/DataField
 */

/**
 * Muestra la etiqueta y el valor de un campo.
 *
 * @param {Object} props
 * @param {string} props.label - Nombre del campo.
 * @param {string|number|null|undefined} props.value - Valor.
 * @param {string} [props.emptyText] - Texto si no existe información.
 * @returns {import("react").JSX.Element}
 */
export default function DataField({
  label,
  value,
  emptyText = "Pendiente de captura",
}) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

  return (
    <div className="space-y-1">
      <dt className="text-sm text-slate-500">
        {label}
      </dt>

      <dd
        className={
          hasValue
            ? "font-medium text-slate-900"
            : "text-sm font-medium text-amber-600"
        }
      >
        {hasValue ? value : emptyText}
      </dd>
    </div>
  );
}