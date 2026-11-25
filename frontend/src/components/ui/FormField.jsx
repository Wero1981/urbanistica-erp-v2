/**
 * Campo contenedor reutilizable para formularios.
 *
 * Centraliza etiquetas, errores y textos de ayuda.
 *
 * @module components/ui/FormField
 */

/**
 * @typedef {Object} FormFieldProps
 * @property {string} id - Identificador del control.
 * @property {string} label - Etiqueta visible.
 * @property {import("react").ReactNode} children - Control del campo.
 * @property {boolean} [required] - Indica obligatoriedad.
 * @property {string} [error] - Mensaje de validación.
 * @property {string} [helpText] - Texto de ayuda.
 */

/**
 * Renderiza la estructura visual de un campo.
 *
 * @param {FormFieldProps} props
 * @returns {import("react").JSX.Element}
 */
export default function FormField({
  id,
  label,
  children,
  required = false,
  error = "",
  helpText = "",
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {children}

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-sm text-red-600"
        >
          {error}
        </p>
      ) : helpText ? (
        <p
          id={`${id}-help`}
          className="text-sm text-slate-500"
        >
          {helpText}
        </p>
      ) : null}
    </div>
  );
}