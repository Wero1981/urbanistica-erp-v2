/** Listado de inmuebles de la empresa activa. */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { House, Plus } from "lucide-react";

import { useAuth } from "../../contexts/authContext";
import { useCompany } from "../../contexts/companies/companyContext";
import { canWrite } from "../../config/roles";
import DataTable from "../../components/tables/DataTable";
import PageHeader from "../../components/layout/PageHeader";
import Input from "../../components/ui/Input";
import { propertyApiError, propertyService } from "../../services/properties/propertyService";

/** Renderiza búsqueda, tabla y acciones del inventario inmobiliario. */
export default function PropertyListPage() {
  const { role } = useAuth();
  const { activeCompany } = useCompany();
  const companyId = activeCompany?.id;
  const [properties, setProperties] = useState([]);
  const [types, setTypes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setError("");
    try {
      const [propertyRows, typeRows] = await Promise.all([
        propertyService.list(companyId),
        propertyService.listTypes(companyId),
      ]);
      setProperties(propertyRows);
      setTypes(typeRows);
    } catch (requestError) {
      setError(propertyApiError(requestError));
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [load]);

  const typeNames = useMemo(
    () => new Map(types.map((type) => [String(type.id), type.name])),
    [types],
  );
  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("es-MX");
    if (!query) return properties;
    return properties.filter((property) => [
      property.asset.code,
      property.asset.name,
      property.street,
      property.neighborhood,
      property.municipality,
      typeNames.get(String(property.property_type)),
    ].some((value) => String(value ?? "").toLocaleLowerCase("es-MX").includes(query)));
  }, [properties, search, typeNames]);

  async function remove(property) {
    if (!window.confirm(`¿Desea dar de baja ${property.asset.name}?`)) return;
    try {
      await propertyService.remove(companyId, property.id);
      await load();
    } catch (requestError) {
      setError(propertyApiError(requestError));
    }
  }

  const columns = [
    { key: "code", header: "Código", render: (row) => row.asset.code },
    { key: "name", header: "Inmueble", render: (row) => row.asset.name },
    { key: "type", header: "Tipo", render: (row) => typeNames.get(String(row.property_type)) ?? "—" },
    {
      key: "address",
      header: "Ubicación",
      render: (row) => [row.street, row.exterior_number, row.neighborhood, row.municipality]
        .filter(Boolean).join(", ") || "—",
    },
    { key: "land_area", header: "Terreno (m²)", render: (row) => row.land_area ?? "—" },
    {
      key: "actions",
      header: "Acciones",
      render: (row) => (
        <div className="flex gap-2">
          {canWrite(role) && (
            <Link to={`/propiedades/inmuebles/${row.id}/editar`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm">
              Editar
            </Link>
          )}
          {role === "administrador" && (
            <button type="button" onClick={() => remove(row)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-700">
              Dar de baja
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inmuebles"
        description="Inventario inmobiliario de la empresa activa."
        actions={canWrite(role) ? (
          <Link to="/propiedades/inmuebles/nuevo" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white">
            <Plus size={18} /> Nuevo inmueble
          </Link>
        ) : null}
      />

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        error={error}
        caption="Inmuebles registrados"
        emptyIcon={<House size={28} />}
        emptyTitle={search ? "No se encontraron inmuebles" : "No hay inmuebles registrados"}
        emptyDescription={search ? "Pruebe con otro término." : "Registre el primer inmueble de la empresa."}
        toolbar={(
          <Input
            id="property-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por código, nombre, tipo o ubicación"
            className="sm:max-w-md"
          />
        )}
      />
    </div>
  );
}
