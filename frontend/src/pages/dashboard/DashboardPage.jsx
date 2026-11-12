/**
 * Dashboard principal de Urbanística ERP V2.
 *
 * Presenta la empresa activa y los accesos
 * a los módulos empresariales disponibles.
 *
 * @module pages/dashboard/DashboardPage
 */

import { Link } from "react-router-dom";

import PageHeader from "../../components/layout/PageHeader";

import { useCompany } from "../../contexts/companies/companyContext";
import { useAuth } from "../../contexts/authContext";

import { navigation } from "../../config/navigation";
import { canAccess, canWrite, roles } from "../../config/roles";

/**
 * Renderiza el Dashboard de la empresa seleccionada.
 *
 * @returns {import("react").JSX.Element}
 */
export default function DashboardPage() {
  const { activeCompany } = useCompany();
  const { role } = useAuth();

  const companyName =
    activeCompany?.trade_name || activeCompany?.name || "Empresa";

  const modules = navigation.filter(
    (item) =>
      item.group === "workspace" &&
      item.key !== "dashboard" &&
      canAccess(role, item.key)
  );

  return (
    <div className="space-y-7">
      <PageHeader
        title="Dashboard"
        description={companyName}
      />

      {/* Resumen del espacio de trabajo */}
      <section className="rounded-2xl bg-primary p-7 text-white">
        <h2 className="text-xl font-semibold">
          Bienvenido a su espacio de trabajo
        </h2>

        <p className="mt-3">
          {companyName}
        </p>

        <p className="mt-2 text-sm text-white/80">
          {roles[role] || role}
          {" · "}
          {canWrite(role)
            ? "Perfil con permisos de captura"
            : "Perfil de solo consulta"}
        </p>
      </section>

      {/* Encabezado de módulos */}
      <div>
        <h2 className="text-xl font-semibold">
          Módulos de la empresa
        </h2>

        <p className="mt-2 text-sm text-text-muted">
          Administre la información y las operaciones
          de su empresa desde un solo lugar.
        </p>
      </div>

      {/* Accesos a módulos */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map(
          ({ key, label, icon: Icon, description }) => (
            <Link
              key={key}
              to={`/${key}`}
              className="
                rounded-2xl border border-border
                bg-surface p-6 shadow-sm
                transition hover:border-primary
                hover:shadow-md
              "
            >
              <Icon
                size={28}
                className="mb-4 text-secondary"
              />

              <h3 className="font-semibold">
                {label}
              </h3>

              <p className="mt-2 text-sm text-text-muted">
                {description}
              </p>

              <p className="mt-5 text-sm font-medium text-primary">
                Abrir módulo →
              </p>
            </Link>
          )
        )}
      </div>
    </div>
  );
}