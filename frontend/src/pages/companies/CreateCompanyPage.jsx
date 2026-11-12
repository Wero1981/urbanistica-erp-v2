/**
 * Pantalla de creación inicial de empresas.
 *
 * Permite registrar una empresa con información mínima.
 * Después del registro, establece la empresa como activa
 * y redirige al Dashboard.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowLeft } from "lucide-react";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { createCompany } from "../../services/companies/companyService";
import { useCompany } from "../../contexts/companies/companyContext";
import { apiError } from "../../api/apiClient";

/**
 * Formulario inicial para registrar una empresa.
 *
 * @returns {import("react").JSX.Element} Pantalla de registro.
 */
export default function CreateCompanyPage() {
  const navigate = useNavigate();

  const { selectCompany } = useCompany();

  const [form, setForm] = useState({
    name: "",
    trade_name: "",
    company_type: "moral",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /**
   * Actualiza un campo del formulario.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  /**
   * Registra la empresa y establece su contexto.
   *
   * @async
   * @param {React.FormEvent<HTMLFormElement>} event
   * @returns {Promise<void>}
   */
  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const company = await createCompany({
        name: form.name.trim(),
        trade_name: form.trade_name.trim(),
        company_type: form.company_type,
      });

      await selectCompany(company.id);

      navigate("/dashboard", {
        replace: true,
      });

    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-12">

      <div className="mx-auto max-w-2xl">

        <Button
          variant="ghost"
          onClick={() => navigate("/seleccionar-empresa")}
        >
          <ArrowLeft size={18} />
          Regresar a empresas
        </Button>

        <div className="mt-10 rounded-2xl border border-border bg-surface p-8 shadow-sm">

          <div className="mb-8 flex items-center gap-3">
            <Building2 className="text-primary" size={30} />

            <div>
              <h1 className="text-2xl font-semibold">
                Crear empresa
              </h1>

              <p className="mt-1 text-sm text-text-muted">
                Registre la información inicial de la empresa.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

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
                className="w-full rounded-xl border border-border bg-background px-4 py-3"
              >
                <option value="moral">Persona moral</option>
                <option value="fisica">Persona física</option>
              </select>
            </div>

            <Input
              id="name"
              name="name"
              label={
                form.company_type === "moral"
                  ? "Razón social"
                  : "Nombre completo"
              }
              value={form.name}
              onChange={handleChange}
              required
              maxLength={200}
            />

            <Input
              id="trade_name"
              name="trade_name"
              label="Nombre comercial (opcional)"
              value={form.trade_name}
              onChange={handleChange}
              maxLength={200}
            />

            {error && (
              <div
                role="alert"
                className="rounded-xl bg-danger-soft p-4 text-danger"
              >
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">

              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/seleccionar-empresa")}
              >
                Cancelar
              </Button>

              <Button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Crear empresa"}
              </Button>

            </div>

          </form>
        </div>
      </div>
    </main>
  );
}