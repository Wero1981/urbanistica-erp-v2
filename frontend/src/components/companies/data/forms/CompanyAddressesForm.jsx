/** CRUD de domicilios empresariales con consulta SEPOMEX. */

import { useState } from "react";

import { useAuth } from "../../../../contexts/authContext";
import { apiError } from "../../../../api/apiClient";
import useCompanyRecords from "../../../../hooks/companies/useCompanyRecords";
import { companyAddressService } from "../../../../services/companies/companyDataService";
import PostalCodeSelector from "../../../locations/PostalCodeSelector";
import Form from "../../../ui/Forms";
import FormField from "../../../ui/FormField";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";
import Textarea from "../../../ui/Textarea";

const EMPTY_ADDRESS = {
  address_type: "fiscal", street: "", exterior_number: "", interior_number: "",
  neighborhood: "", postal_code: "", municipality: "", state: "",
  country: "México", references: "", is_primary: false,
};

/** Formulario con listado editable de domicilios de una empresa. */
export default function CompanyAddressesForm({ companyId, onComplete, onCancel }) {
  const { role } = useAuth();
  const { records, loading, error, setError, reload } = useCompanyRecords(
    companyId,
    companyAddressService,
  );
  const [form, setForm] = useState(EMPTY_ADDRESS);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  function change(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  }

  function edit(record) {
    setEditingId(record.id);
    setForm({ ...EMPTY_ADDRESS, ...record });
    setError("");
  }

  function reset() {
    setEditingId(null);
    setForm(EMPTY_ADDRESS);
    setError("");
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      delete payload.id;
      delete payload.company;
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.is_active;
      if (editingId) await companyAddressService.update(companyId, editingId, payload);
      else await companyAddressService.create(companyId, payload);
      await reload();
      reset();
      onComplete();
    } catch (requestError) {
      setError(apiError(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id) {
    if (!window.confirm("¿Desea eliminar este domicilio?")) return;
    try {
      await companyAddressService.remove(companyId, id);
      if (editingId === id) reset();
      await reload();
    } catch (requestError) {
      setError(apiError(requestError));
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold">Domicilios registrados</h2>
        {loading && <p className="mt-3 text-sm text-slate-500">Cargando domicilios...</p>}
        {!loading && records.length === 0 && <p className="mt-3 text-sm text-slate-500">No hay domicilios capturados.</p>}
        <div className="mt-4 grid gap-3">
          {records.map((record) => (
            <article key={record.id} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium capitalize">{record.address_type}</p>
                  <p className="text-sm text-slate-600">
                    {record.street} {record.exterior_number}{record.interior_number ? ` Int. ${record.interior_number}` : ""}, {record.neighborhood}, C.P. {record.postal_code}, {record.municipality}, {record.state}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => edit(record)} className="rounded-lg border px-3 py-1.5 text-sm">Editar</button>
                  {role === "administrador" && <button type="button" onClick={() => remove(record.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700">Eliminar</button>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}

      <Form
        title={editingId ? "Editar domicilio" : "Agregar domicilio"}
        description="Capture el domicilio sin coordenadas ni geolocalización."
        onSubmit={save}
        onCancel={editingId ? reset : onCancel}
        saving={saving}
        submitLabel={editingId ? "Guardar y continuar" : "Agregar y continuar"}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField id="address-type" label="Tipo de domicilio" required>
            <Select id="address-type" name="address_type" value={form.address_type} onChange={change} disabled={saving} required options={[
              { value: "fiscal", label: "Fiscal" },
              { value: "administrativo", label: "Administrativo" },
              { value: "correspondencia", label: "Correspondencia" },
              { value: "otro", label: "Otro" },
            ]} />
          </FormField>
          <PostalCodeSelector value={form} onChange={setForm} disabled={saving} />
          <FormField id="address-street" label="Calle" required>
            <Input id="address-street" name="street" value={form.street} onChange={change} disabled={saving} required />
          </FormField>
          <FormField id="address-exterior" label="Número exterior" required>
            <Input id="address-exterior" name="exterior_number" value={form.exterior_number} onChange={change} disabled={saving} required />
          </FormField>
          <FormField id="address-interior" label="Número interior">
            <Input id="address-interior" name="interior_number" value={form.interior_number} onChange={change} disabled={saving} />
          </FormField>
          <FormField id="address-country" label="País" required>
            <Input id="address-country" name="country" value={form.country} onChange={change} disabled={saving} required />
          </FormField>
          <div className="md:col-span-2">
            <FormField id="address-references" label="Referencias">
              <Textarea id="address-references" name="references" value={form.references} onChange={change} disabled={saving} rows={3} />
            </FormField>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_primary" checked={form.is_primary} onChange={change} disabled={saving} /> Domicilio principal
          </label>
        </div>
      </Form>
    </div>
  );
}
