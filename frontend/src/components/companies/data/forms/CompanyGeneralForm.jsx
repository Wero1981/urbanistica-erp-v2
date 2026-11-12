/**
 * Formulario de información general de una empresa.
 *
 * Permite consultar y modificar los datos generales
 * de la empresa seleccionada.
 *
 * @module components/companies/data/forms/CompanyGeneralForm
 */

import { useState } from "react";

import Button from "../../../ui/Button";

/**
 * Renderiza el formulario de datos generales.
 *
 * @param {Object} props
 * @param {Object} props.company - Información de la empresa.
 * @param {Function} props.onSave - Guarda los cambios.
 * @param {boolean} props.saving - Indica si está guardando.
 * @param {boolean} props.readOnly - Activa modo consulta.
 *
 * @returns {import("react").JSX.Element}
 */
export default function CompanyGeneralForm({
  company,
  onSave,
  saving = false,
  readOnly = false,
}) {
  // La página monta el formulario cuando termina de cargar la empresa.
  // Las siguientes renderizaciones conservan el borrador del usuario.
  const [form, setForm] = useState(() => ({
    company_type: company.company_type || "moral",
    name: company.name || "",
    trade_name: company.trade_name || "",
    economic_activity: company.economic_activity || "",
  }));

  /**
   * Actualiza un campo del formulario.
   *
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} event
   * @returns {void}
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  /**
   * Envía la información para su actualización.
   *
   * @param {React.FormEvent<HTMLFormElement>} event
   * @returns {Promise<void>}
   */
  async function handleSubmit(event) {
    event.preventDefault();

    if (readOnly || saving) return;

    const payload = {
      ...form,
      name: form.name.trim(),
      trade_name: form.trade_name.trim(),
      economic_activity: form.economic_activity.trim(),
    };

    if (await onSave(payload)) {
      setForm(payload);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-surface px-4 py-3 " +
    "text-text outline-none transition focus:border-primary " +
    "disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <h2 className="text-xl font-semibold">
          Información general
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          Capture los datos principales de la empresa.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label
            htmlFor="company_type"
            className="mb-2 block text-sm font-medium"
          >
            Tipo de contribuyente
          </label>

          <select
            id="company_type"
            name="company_type"
            value={form.company_type}
            onChange={handleChange}
            disabled={readOnly || saving}
            className={inputClass}
          >
            <option value="moral">Persona moral</option>
            <option value="fisica">Persona física</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium"
          >
            Razón social o nombre completo *
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            maxLength={200}
            required
            disabled={readOnly || saving}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="trade_name"
            className="mb-2 block text-sm font-medium"
          >
            Nombre comercial
          </label>

          <input
            id="trade_name"
            name="trade_name"
            type="text"
            value={form.trade_name}
            onChange={handleChange}
            maxLength={200}
            disabled={readOnly || saving}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="economic_activity"
            className="mb-2 block text-sm font-medium"
          >
            Actividad económica
          </label>

          <textarea
            id="economic_activity"
            name="economic_activity"
            value={form.economic_activity}
            onChange={handleChange}
            rows={3}
            disabled={readOnly || saving}
            className={inputClass}
          />
        </div>

      </div>

      {!readOnly && (
        <div className="flex justify-end border-t border-border pt-6">
          <Button
            type="submit"
            disabled={saving || !form.name.trim()}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      )}

    </form>
  );
}