/** Página de alta y edición de un inmueble. */

import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useCompany } from "../../contexts/companies/companyContext";
import PropertyForm from "../../components/properties/PropertyForm";
import { propertyApiError, propertyService } from "../../services/properties/propertyService";

/** Carga catálogos, consulta el registro y persiste el formulario. */
export default function PropertyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeCompany } = useCompany();
  const companyId = activeCompany?.id;
  const [property, setProperty] = useState(null);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const editing = Boolean(id);

  const load = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError("");
    try {
      const [typeRows, current] = await Promise.all([
        propertyService.listTypes(companyId),
        editing ? propertyService.get(companyId, id) : Promise.resolve(null),
      ]);
      setTypes(typeRows);
      setProperty(current);
    } catch (requestError) {
      setError(propertyApiError(requestError));
    } finally {
      setLoading(false);
    }
  }, [companyId, editing, id]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  async function save(payload) {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const saved = editing
        ? await propertyService.update(companyId, id, payload)
        : await propertyService.create(companyId, payload);
      setProperty(saved);
      setSuccess(editing
        ? "El inmueble se actualizó correctamente."
        : `Inmueble registrado con código ${saved.asset.code}.`);
      if (!editing) {
        navigate(`/propiedades/inmuebles/${saved.id}/editar`, { replace: true });
      }
    } catch (requestError) {
      setError(propertyApiError(requestError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p role="status" className="p-6">Cargando inmueble...</p>;

  return (
    <div className="space-y-6">
      <button type="button" onClick={() => navigate("/propiedades/inmuebles")} className="text-sm text-slate-600 hover:text-slate-900">
        ← Volver a inmuebles
      </button>
      {success && <p role="status" className="rounded-xl bg-green-50 p-4 text-green-700">{success}</p>}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <PropertyForm
          key={property?.id ?? "new"}
          property={property}
          types={types}
          saving={saving}
          error={error}
          onSave={save}
          onCancel={() => navigate("/propiedades/inmuebles")}
        />
      </section>
    </div>
  );
}
