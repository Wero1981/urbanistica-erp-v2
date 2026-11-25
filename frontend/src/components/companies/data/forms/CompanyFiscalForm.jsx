/**
 * Formulario de información fiscal empresarial.
 *
 * @module components/companies/data/forms/CompanyFiscalForm
 */

import { useState } from "react";

import Form from "../../../ui/Forms";
import FormField from "../../../ui/FormField";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";

/**
 * Catálogo de regímenes fiscales disponibles actualmente
 * en el modelo Company de Django.
 *
 * Debe mantenerse sincronizado con las opciones del backend.
 */
const TAX_REGIMES = [
  { value: "", label: "Seleccione un régimen fiscal" },
  { value: "601", label: "601 - General de Ley Personas Morales" },
  { value: "626", label: "626 - Régimen Simplificado de Confianza" },
  { value: "612", label: "612 - Personas Físicas con Actividades Empresariales" },
  { value: "606", label: "606 - Arrendamiento" },
  { value: "otro", label: "Otro" },
];

/**
 * Valida la estructura básica de un RFC mexicano.
 *
 * La validación definitiva corresponde al backend.
 *
 * @param {string} rfc - RFC que se desea validar.
 * @param {"moral"|"fisica"} companyType - Tipo de contribuyente.
 * @returns {boolean}
 */
function isValidRFC(rfc, companyType) {
  const pattern =
    companyType === "fisica"
      ? /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/
      : /^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/;

  return pattern.test(rfc);
}

/**
 * Renderiza el formulario fiscal de la empresa.
 *
 * @param {Object} props
 * @param {Object} props.company - Información de la empresa.
 * @param {(payload: Object) => Promise<boolean>} props.onSave
 * @param {() => void} props.onCancel
 * @param {boolean} [props.saving]
 * @returns {import("react").JSX.Element}
 */
export default function CompanyFiscalForm({
  company,
  onSave,
  onCancel,
  saving = false,
}) {
  const [form, setForm] = useState(() => ({
    rfc: company.rfc || "",
    tax_regime: company.tax_regime || "",
  }));

  const [errors, setErrors] = useState({});

  /**
   * Actualiza los campos y limpia sus errores.
   *
   * @param {import("react").ChangeEvent<HTMLInputElement|HTMLSelectElement>} event
   * @returns {void}
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "rfc" ? value.toUpperCase() : value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  /**
   * Valida la información fiscal.
   *
   * @returns {Object<string, string>}
   */
  function validate() {
    const nextErrors = {};
    const rfc = form.rfc.trim();

    if (!rfc) {
      nextErrors.rfc = "El RFC es obligatorio.";
    } else if (!isValidRFC(rfc, company.company_type)) {
      nextErrors.rfc = "El RFC no corresponde al formato esperado.";
    }

    if (!form.tax_regime) {
      nextErrors.tax_regime = "Seleccione un régimen fiscal.";
    }

    return nextErrors;
  }

  /**
   * Envía los datos fiscales validados.
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
      rfc: form.rfc.trim(),
      tax_regime: form.tax_regime,
    });
  }

  return (
    <Form
      title="Información fiscal"
      description="Registre los datos fiscales de la empresa."
      onSubmit={handleSave}
      onCancel={onCancel}
      saving={saving}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          id="company-rfc"
          label="RFC"
          required
          error={errors.rfc}
        >
          <Input
            id="company-rfc"
            name="rfc"
            value={form.rfc}
            onChange={handleChange}
            maxLength={13}
            autoComplete="off"
            disabled={saving}
            required
            aria-invalid={Boolean(errors.rfc)}
            aria-describedby={
              errors.rfc ? "company-rfc-error" : undefined
            }
            className="uppercase"
            placeholder="RFC de la empresa"
          />
        </FormField>

        <FormField
          id="company-tax-regime"
          label="Régimen fiscal"
          required
          error={errors.tax_regime}
        >
          <Select
            id="company-tax-regime"
            name="tax_regime"
            value={form.tax_regime}
            onChange={handleChange}
            options={TAX_REGIMES}
            disabled={saving}
            required
            invalid={Boolean(errors.tax_regime)}
            ariaDescribedBy={
              errors.tax_regime
                ? "company-tax-regime-error"
                : undefined
            }
          />
        </FormField>
      </div>
    </Form>
  );
}
