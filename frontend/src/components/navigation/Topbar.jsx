/**
 * Barra superior del ERP inmobiliario.
 */

import { roles } from "../../config/roles";
import { useNavigate } from "react-router-dom";

import {
  Building2,
  ChevronDown,
  LogOut,
  Menu,
  UserRound,
} from "lucide-react";

import { useAuth } from "../../contexts/authContext";
import { useCompany } from "../../contexts/companies/companyContext";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();

  const { user, role, signOut } = useAuth();

  const {
    activeCompany,
    clearCompany,
  } = useCompany();

  const company = activeCompany;

  async function handleLogout() {
    clearCompany();

    try {
      await signOut();
    } finally {
      navigate("/login", { replace: true });
    }
  }

  function handleChangeCompany() {
    clearCompany();

    navigate("/seleccionar-empresa");
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b border-border bg-surface px-5 lg:px-8">
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Abrir menú"
          className="rounded-xl p-2 text-text hover:bg-surface-muted lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <p className="text-xs text-text-muted">
            Espacio de trabajo
          </p>

          <button
            type="button"
            onClick={handleChangeCompany}
            className="mt-1 flex max-w-56 items-center gap-2 rounded-lg text-left text-sm font-semibold text-text hover:text-primary sm:max-w-80"
            title="Cambiar empresa"
          >
            <Building2
              size={17}
              className="shrink-0 text-secondary"
            />

            <span className="truncate">
              {company?.trade_name ||
                company?.name ||
                "Empresa activa"}
            </span>

            <ChevronDown
              size={15}
              className="shrink-0 text-text-muted"
            />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-text">
            {user?.full_name ||
              [user?.first_name, user?.last_name]
                .filter(Boolean)
                .join(" ") ||
              user?.username}
          </p>

          <p className="text-xs text-text-muted">
            {roles[role]}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
          <UserRound size={19} />
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          className="rounded-xl p-2.5 text-text-muted transition hover:bg-danger-soft hover:text-danger"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}