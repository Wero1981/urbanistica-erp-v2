/**
 * Menú lateral principal de Urbanística ERP V2.
 *
 * Presenta los módulos disponibles según el rol global
 * y los organiza por espacio de trabajo y administración.
 *
 * @module components/navigation/Sidebar
 */

import { NavLink } from "react-router-dom";
import { Building2, X } from "lucide-react";

import { navigation } from "../../config/navigation";
import { canAccess } from "../../config/roles";
import { useAuth } from "../../contexts/authContext";

/**
 * Renderiza un grupo de navegación.
 *
 * @param {Object} props
 * @param {string} props.title - Título del grupo.
 * @param {Array<Object>} props.items - Módulos del grupo.
 * @param {Function} props.onClose - Cierra el menú móvil.
 *
 * @returns {import("react").JSX.Element|null}
 */
function NavigationGroup({ title, items, onClose }) {
  if (!items.length) return null;

  return (
    <div className="mb-6">
      <p className="px-3 py-3 text-xs font-semibold text-text-muted">
        {title}
      </p>

      <div className="space-y-1">
        {items.map(({ key, label, icon: Icon }) => (
          <NavLink
            key={key}
            to={`/${key}`}
            onClick={onClose}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-3 py-3",
                "text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-soft text-primary"
                  : "text-text-muted hover:bg-surface-muted",
              ].join(" ")
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

/**
 * Renderiza el menú lateral del ERP.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Estado del menú móvil.
 * @param {Function} props.onClose - Acción para cerrar el menú.
 *
 * @returns {import("react").JSX.Element}
 */
export default function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth();

  const accessibleModules = navigation.filter((item) =>
    canAccess(role, item.key)
  );

  const workspaceModules = accessibleModules.filter(
    (item) => item.group === "workspace"
  );

  const administrationModules = accessibleModules.filter(
    (item) => item.group === "administration"
  );

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        aria-label="Navegación principal"
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-68 flex-col
          border-r border-border bg-surface
          ${isOpen
            ? "translate-x-0"
            : "-translate-x-full invisible lg:visible"}
          lg:translate-x-0
        `}
      >
        <div className="flex h-20 shrink-0 items-center gap-3 border-b border-border px-6">
          <Building2
            className="text-primary"
            size={30}
          />

          <div>
            <h2 className="font-bold">Urbanística</h2>
            <p className="text-xs text-text-muted">
              ERP INMOBILIARIO · V2
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="ml-auto lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <NavigationGroup
            title="ESPACIO DE TRABAJO"
            items={workspaceModules}
            onClose={onClose}
          />

          <NavigationGroup
            title="ADMINISTRACIÓN"
            items={administrationModules}
            onClose={onClose}
          />
        </nav>

        <p className="border-t border-border p-6 text-xs text-text-muted">
          Gestión inmobiliaria
        </p>
      </aside>
    </>
  );
}