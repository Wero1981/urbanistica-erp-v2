/**
 * Formulario reutilizable para Urbanística ERP V2.
 *
 * Proporciona una estructura común para formularios
 * de empresas, inmuebles, clientes y otros módulos.
 *
 * @module components/ui/Form
 */

/**
 * @typedef {Object} FormProps
 * @property {import("react").ReactNode} children - Campos del formulario.
 * @property {(event: import("react").FormEvent<HTMLFormElement>) => void | Promise<void>} onSubmit - Acción de guardado.
 * @property {() => void} [onCancel] - Acción de cancelación.
 * @property {string} [title] - Título del formulario.
 * @property {string} [description] - Descripción opcional.
 * @property {boolean} [saving] - Indica si está guardando.
 * @property {boolean} [disabled] - Deshabilita el guardado.
 * @property {boolean} [readOnly] - Oculta las acciones de edición.
 * @property {string} [submitLabel] - Texto del botón principal.
 * @property {string} [cancelLabel] - Texto del botón cancelar.
 */

/**
 * Renderiza un formulario con acciones estandarizadas.
 *
 * @param {FormProps} props - Propiedades del formulario.
 * @returns {import("react").JSX.Element}
 */
export default function Form({
  children,
  onSubmit,
  onCancel,
  title,
  description,
  saving = false,
  disabled = false,
  readOnly = false,
  submitLabel = "Guardar cambios",
  cancelLabel = "Cancelar",
}) {
  /**
   * Procesa el envío evitando la recarga del navegador.
   *
   * @param {import("react").FormEvent<HTMLFormElement>} event
   * @returns {void}
   */
  function handleSubmit(event) {
    event.preventDefault();

    if (saving || disabled || readOnly) {
      return;
    }

    void onSubmit(event);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(title || description) && (
        <header className="space-y-2">
          {title && (
            <h2 className="text-xl font-semibold text-slate-900">
              {title}
            </h2>
          )}

          {description && (
            <p className="text-sm text-slate-500">
              {description}
            </p>
          )}
        </header>
      )}

      <div className="space-y-6">
        {children}
      </div>

      {!readOnly && (
        <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-6">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {cancelLabel}
            </button>
          )}

          <button
            type="submit"
            disabled={saving || disabled}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Guardando..." : submitLabel}
          </button>
        </footer>
      )}
    </form>
  );
}