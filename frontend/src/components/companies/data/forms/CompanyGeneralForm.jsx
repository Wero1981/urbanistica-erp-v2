/**
 * Formulario de información general de empresas.
 *
 * Utiliza componentes reutilizables del ERP.
 *
 * @module components/companies/data/forms/CompanyGeneralForm
 */

import { useState } from "react";

import Form from "../../../ui/Forms";
import FormField from "../../../ui/FormField";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";
import Textarea from "../../../ui/Textarea";

/**
 * @typedef {Object} CompanyGeneralFormProps
 * @property {Object} company - Empresa.
 * @property {(payload: Object) => Promise<boolean>} onSave - Guarda los datos.
 * @property {() => void} onCancel - Cancela la edición.
 * @property {boolean} [saving] - Estado de guardado.
 */

/**
 * Renderiza los datos generales editables.
 *
 * @param {CompanyGeneralFormProps} props
 * @returns {import("react").JSX.Element}
 */
export default function CompanyGeneralForm({
  company,
  onSave,
  onCancel,
  saving = false,
}) {
  const [form, setForm] = useState(() => ({
    company_type: company.company_type || "moral",
    name: company.name || "",
    trade_name: company.trade_name || "",
    economic_activity: company.economic_activity || "",
  }));

  const [errors, setErrors] = useState({});

  /**
   * Actualiza los valores del formulario.
   *
   * @param {import("react").ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} event
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  /**
   * Valida los datos antes de enviarlos.
   *
   * @returns {Object} Errores encontrados.
   */
  function validate() {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "La razón social o nombre completo es obligatorio.";
    }

    if (form.name.trim().length > 200) {
      nextErrors.name = "El nombre no puede superar 200 caracteres.";
    }

    return nextErrors;
  }

  /**
   * Envía los datos validados al componente padre.
   *
   * @returns {Promise<void>}
   */
  async function handleSave() {
    const nextErrors = validate();

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    await onSave({
      company_type: form.company_type,
      name: form.name.trim(),
      trade_name: form.trade_name.trim(),
      economic_activity: form.economic_activity.trim(),
    });
  }

  return (
    <Form
      title="Información general"
      description="Actualice los datos principales de la empresa."
      onSubmit={handleSave}
      onCancel={onCancel}
      saving={saving}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          id="company-type"
          label="Tipo de contribuyente"
          required
        >
          <Select
            id="company-type"
            name="company_type"
            value={form.company_type}
            onChange={handleChange}
            disabled={saving}
            required
            options={[
              { value: "moral", label: "Persona moral" },
              { value: "fisica", label: "Persona física" },
            ]}
          />
        </FormField>

        <FormField
          id="company-name"
          label="Razón social o nombre completo"
          required
          error={errors.name}
        >
          <Input
            id="company-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={saving}
            maxLength={200}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={
              errors.name ? "company-name-error" : undefined
            }
          />
        </FormField>

        <FormField
          id="company-trade-name"
          label="Nombre comercial"
        >
          <Input
            id="company-trade-name"
            name="trade_name"
            value={form.trade_name}
            onChange={handleChange}
            disabled={saving}
            maxLength={200}
          />
        </FormField>

        <FormField
          id="company-economic-activity"
          label="Actividad económica"
        >
          <Textarea
            id="company-economic-activity"
            name="economic_activity"
            value={form.economic_activity}
            onChange={handleChange}
            disabled={saving}
            rows={3}
          />
        </FormField>
      </div>
    </Form>
  );
}
