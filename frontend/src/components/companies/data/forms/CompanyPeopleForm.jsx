/** Formulario reutilizable para socios y representantes legales. */

import { useMemo, useState } from "react";

import { apiError } from "../../../../api/apiClient";
import { useAuth } from "../../../../contexts/authContext";
import useCompanyRecords from "../../../../hooks/companies/useCompanyRecords";
import DataTable from "../../../tables/DataTable";
import Form from "../../../ui/Forms";
import FormField from "../../../ui/FormField";
import Input from "../../../ui/Input";
import Select from "../../../ui/Select";
import Textarea from "../../../ui/Textarea";

const EMPTY_PERSON = {
  person_type: "fisica", first_name: "", last_name: "", business_name: "",
  rfc: "", curp: "", email: "", phone: "", nationality: "Mexicana", notes: "",
};

/** Devuelve el estado inicial según el tipo de relación. */
function emptyRecord(kind) {
  return kind === "partner"
    ? { person: EMPTY_PERSON, ownership_percentage: "", contribution_amount: "", start_date: "", end_date: "", notes: "" }
    : { person: EMPTY_PERSON, position: "Representante legal", powers_description: "", power_deed_number: "", start_date: "", end_date: "", notes: "" };
}

/** Obtiene el nombre visible de una persona física o moral. */
function personName(person) {
  return person.person_type === "moral"
    ? person.business_name
    : `${person.first_name} ${person.last_name}`.trim();
}

/**
 * Administra múltiples socios o representantes de una empresa.
 *
 * @param {Object} props
 * @param {"partner"|"representative"} props.kind - Tipo de relación.
 * @param {number|string} props.companyId - Empresa activa.
 * @param {Object} props.service - Servicio CRUD.
 * @param {() => void} props.onComplete - Avanza después de guardar.
 * @param {() => void} props.onCancel - Cancela la captura.
 */
export default function CompanyPeopleForm({ kind, companyId, service, onComplete, onCancel }) {
  const { role } = useAuth();
  const { records, loading, error, setError, reload } = useCompanyRecords(companyId, service);
  const [form, setForm] = useState(() => emptyRecord(kind));
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const partner = kind === "partner";
  const [showForm, setShowForm] = useState(!partner);
  const [search, setSearch] = useState("");
  const [partnerSaved, setPartnerSaved] = useState(false);
  const plural = partner ? "Socios" : "Representantes";
  const singular = partner ? "socio" : "representante";

  function change(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function changePerson(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      person: { ...current.person, [name]: name === "rfc" || name === "curp" ? value.toUpperCase() : value },
    }));
  }

  function reset() {
    setForm(emptyRecord(kind));
    setEditingId(null);
    setError("");
    if (partner) setShowForm(false);
  }

  function edit(record) {
    setForm({ ...emptyRecord(kind), ...record, person: { ...EMPTY_PERSON, ...record.person } });
    setEditingId(record.id);
    setError("");
    setShowForm(true);
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, person: { ...form.person } };
      for (const key of ["id", "company", "created_at", "updated_at", "is_active"]) delete payload[key];
      delete payload.person.id;
      for (const key of ["contribution_amount", "start_date", "end_date"]) {
        if (key in payload && payload[key] === "") payload[key] = null;
      }
      if (editingId) await service.update(companyId, editingId, payload);
      else await service.create(companyId, payload);
      await reload();
      reset();
      if (partner) setPartnerSaved(true);
      else onComplete();
    } catch (requestError) {
      setError(apiError(requestError));
    } finally {
      setSaving(false);
    }
  }

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es-MX");
    if (!query) return records;
    return records.filter((record) => (
      personName(record.person).toLocaleLowerCase("es-MX").includes(query)
      || String(record.person.rfc ?? "").toLocaleLowerCase("es-MX").includes(query)
    ));
  }, [records, search]);

  const partnerColumns = [
    {
      key: "name",
      header: "Nombre/Razón social",
      render: (record) => personName(record.person),
    },
    {
      key: "rfc",
      header: "RFC",
      render: (record) => record.person.rfc || "—",
    },
    {
      key: "ownership_percentage",
      header: "Participación (%)",
    },
    {
      key: "actions",
      header: "Acciones",
      render: (record) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => edit(record)} className="rounded-lg border px-3 py-1.5 text-sm">
            Editar
          </button>
          <button
            type="button"
            onClick={() => remove(record.id)}
            disabled={role !== "administrador"}
            title={role !== "administrador" ? "Sólo el administrador puede eliminar socios." : undefined}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  async function remove(id) {
    if (!window.confirm(`¿Desea eliminar este ${singular}?`)) return;
    try {
      await service.remove(companyId, id);
      if (editingId === id) reset();
      await reload();
    } catch (requestError) {
      setError(apiError(requestError));
    }
  }

  return (
    <div className="space-y-8">
      {partner ? (
        <DataTable
          columns={partnerColumns}
          data={filteredRecords}
          caption="Socios registrados"
          loading={loading}
          error={error}
          emptyTitle={search ? "No se encontraron socios" : "No hay socios registrados"}
          emptyDescription={search ? "Pruebe con otro nombre o RFC." : "Use Agregar socio para capturar el primero."}
          toolbar={(
            <>
              <Input
                id="partner-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre o RFC"
                className="sm:max-w-sm"
              />
              <button
                type="button"
                onClick={() => {
                  reset();
                  setShowForm(true);
                }}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white"
              >
                {partnerSaved ? "Agregar otro socio" : "Agregar socio"}
              </button>
            </>
          )}
        />
      ) : (
        <section>
          <h2 className="text-lg font-semibold">{plural} registrados</h2>
          {loading && <p className="mt-3 text-sm text-slate-500">Cargando registros...</p>}
          {!loading && records.length === 0 && <p className="mt-3 text-sm text-slate-500">No hay registros capturados.</p>}
          <div className="mt-4 grid gap-3">
            {records.map((record) => (
              <article key={record.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{personName(record.person)}</p>
                    <p className="text-sm text-slate-600">{record.position}</p>
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
      )}

      {!partner && error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}

      {showForm && <Form
        title={`${editingId ? "Editar" : "Agregar"} ${singular}`}
        description="Capture los datos personales y los detalles de la relación empresarial."
        onSubmit={save}
        onCancel={partner || editingId ? reset : onCancel}
        saving={saving}
        submitLabel={partner ? (editingId ? "Guardar socio" : "Agregar socio") : `${editingId ? "Guardar" : "Agregar"} y continuar`}
      >
        <div className="grid gap-6 md:grid-cols-2">
          <FormField id={`${kind}-person-type`} label="Tipo de persona" required>
            <Select id={`${kind}-person-type`} name="person_type" value={form.person.person_type} onChange={changePerson} disabled={saving} required options={[
              { value: "fisica", label: "Persona física" },
              { value: "moral", label: "Persona moral" },
            ]} />
          </FormField>
          {form.person.person_type === "fisica" ? (
            <>
              <FormField id={`${kind}-first-name`} label="Nombre(s)" required>
                <Input id={`${kind}-first-name`} name="first_name" value={form.person.first_name} onChange={changePerson} disabled={saving} required />
              </FormField>
              <FormField id={`${kind}-last-name`} label="Apellidos" required>
                <Input id={`${kind}-last-name`} name="last_name" value={form.person.last_name} onChange={changePerson} disabled={saving} required />
              </FormField>
              <FormField id={`${kind}-curp`} label="CURP">
                <Input id={`${kind}-curp`} name="curp" value={form.person.curp} onChange={changePerson} disabled={saving} maxLength={18} />
              </FormField>
            </>
          ) : (
            <FormField id={`${kind}-business-name`} label="Razón social" required>
              <Input id={`${kind}-business-name`} name="business_name" value={form.person.business_name} onChange={changePerson} disabled={saving} required />
            </FormField>
          )}
          <FormField id={`${kind}-rfc`} label="RFC">
            <Input id={`${kind}-rfc`} name="rfc" value={form.person.rfc} onChange={changePerson} disabled={saving} maxLength={13} />
          </FormField>
          <FormField id={`${kind}-nationality`} label="Nacionalidad">
            <Input id={`${kind}-nationality`} name="nationality" value={form.person.nationality} onChange={changePerson} disabled={saving} />
          </FormField>
          <FormField id={`${kind}-email`} label="Correo electrónico">
            <Input id={`${kind}-email`} name="email" type="email" value={form.person.email} onChange={changePerson} disabled={saving} />
          </FormField>
          <FormField id={`${kind}-phone`} label="Teléfono">
            <Input id={`${kind}-phone`} name="phone" value={form.person.phone} onChange={changePerson} disabled={saving} />
          </FormField>

          {partner ? (
            <>
              <FormField id="partner-percentage" label="Participación (%)" required>
                <Input id="partner-percentage" name="ownership_percentage" type="number" min="0.01" max="100" step="0.01" value={form.ownership_percentage} onChange={change} disabled={saving} required />
              </FormField>
              <FormField id="partner-contribution" label="Aportación de capital">
                <Input id="partner-contribution" name="contribution_amount" type="number" min="0" step="0.01" value={form.contribution_amount} onChange={change} disabled={saving} />
              </FormField>
            </>
          ) : (
            <>
              <FormField id="representative-position" label="Cargo" required>
                <Input id="representative-position" name="position" value={form.position} onChange={change} disabled={saving} required />
              </FormField>
              <FormField id="representative-deed" label="Escritura del poder">
                <Input id="representative-deed" name="power_deed_number" value={form.power_deed_number} onChange={change} disabled={saving} />
              </FormField>
              <div className="md:col-span-2">
                <FormField id="representative-powers" label="Facultades otorgadas">
                  <Textarea id="representative-powers" name="powers_description" value={form.powers_description} onChange={change} disabled={saving} rows={3} />
                </FormField>
              </div>
            </>
          )}

          <FormField id={`${kind}-start-date`} label="Fecha de inicio">
            <Input id={`${kind}-start-date`} name="start_date" type="date" value={form.start_date ?? ""} onChange={change} disabled={saving} />
          </FormField>
          <FormField id={`${kind}-end-date`} label="Fecha de término">
            <Input id={`${kind}-end-date`} name="end_date" type="date" value={form.end_date ?? ""} onChange={change} disabled={saving} />
          </FormField>
          <div className="md:col-span-2">
            <FormField id={`${kind}-notes`} label="Notas">
              <Textarea id={`${kind}-notes`} name="notes" value={form.notes} onChange={change} disabled={saving} rows={3} />
            </FormField>
          </div>
        </div>
      </Form>}

      {partner && (
        <div className="flex justify-end border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={onComplete}
            disabled={saving}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            Guardar y continuar
          </button>
        </div>
      )}
    </div>
  );
}
