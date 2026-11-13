/**
 * Configuración principal de rutas de Urbanística ERP V2.
 *
 * Define la navegación entre:
 * - Autenticación.
 * - Selección de empresas.
 * - Creación de empresas.
 * - Dashboard.
 * - Módulos empresariales.
 *
 * Las rutas están protegidas según:
 * 1. La autenticación del usuario.
 * 2. La selección de una empresa activa.
 * 3. Los permisos del rol global.
 *
 * @module routes/AppRouter
 */

import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "../contexts/authContext";
import { useCompany } from "../contexts/companies/companyContext";

import CompanyProvider from "../contexts/companies/CompanyContext";

import AppLayout from "../layouts/AppLayout";

import LoginPage from "../pages/auth/LoginPage";

import SelectCompanyPage from "../pages/companies/SelectCompanyPage";
import CreateCompanyPage from "../pages/companies/CreateCompanyPage";

import DashboardPage from "../pages/dashboard/DashboardPage";
import GlobalRolesPage from "../pages/GlobalRolesPage";
import ModulePlaceholder from "../pages/ModulePlaceholder";

import { navigation } from "../config/navigation";
import { canAccess, canWrite } from "../config/roles";

import CompanyDataPage from "../pages/companies/CompanyDataPage";
import CompanyDataEditPage from "../pages/companies/CompanyDataEditPage";

/*import para propiedades*/
import PropertiesPage from "../pages/properties/PropertiesPage";
import PropertyListPage from "../pages/properties/PropertyListPage";
import PropertyFormPage from "../pages/properties/PropertyFormPage";

/**
 * Protege las rutas que requieren autenticación.
 *
 * Si existe una sesión válida, proporciona el contexto
 * de empresas a las rutas descendientes.
 *
 * Si el usuario no está autenticado, lo redirige al login.
 *
 * @returns {import("react").JSX.Element}
 */
function SessionRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <p role="status" className="p-8">
        Validando sesión...
      </p>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <CompanyProvider key={user.id}>
      <Outlet />
    </CompanyProvider>
  );
}

/**
 * Protege las rutas que requieren una empresa activa.
 *
 * La empresa seleccionada determina el contexto
 * de información de los módulos empresariales.
 *
 * @returns {import("react").JSX.Element}
 */
function CompanyRoute() {
  const { activeCompany, loading } = useCompany();

  if (loading) {
    return (
      <p role="status" className="p-8">
        Validando empresa...
      </p>
    );
  }

  if (!activeCompany) {
    return <Navigate to="/seleccionar-empresa" replace />;
  }

  return <AppLayout key={activeCompany.id} />;
}

/**
 * Valida el acceso a un módulo según el rol global.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.item - Configuración del módulo.
 * @param {string} props.item.key - Identificador del módulo.
 * @param {string} props.item.label - Nombre visible del módulo.
 *
 * @returns {import("react").JSX.Element}
 */
function ModuleRoute({ item }) {
  const { role } = useAuth();

  if (!canAccess(role, item.key)) {
    return (
      <section role="alert" className="p-8">
        <h1 className="text-2xl font-semibold">
          Acceso no autorizado
        </h1>

        <p className="mt-3">
          Su rol global no permite acceder a este módulo.
        </p>
      </section>
    );
  }

  if (item.key === "roles") {
    return <GlobalRolesPage />;
  }

  if (item.key === "datos") {
    return <CompanyDataPage />;
  }

  if (item.key === "propiedades") {
    return <PropertiesPage />;
  }

  return <ModulePlaceholder title={item.label} />;
}

/**
 * Muestra el selector de empresas.
 *
 * Espera a que CompanyProvider termine de recuperar
 * la información de la empresa activa.
 *
 * @returns {import("react").JSX.Element}
 */
function SelectCompanyRoute() {
  const { loading } = useCompany();

  if (loading) {
    return (
      <p role="status" className="p-8">
        Validando empresa...
      </p>
    );
  }

  return <SelectCompanyPage />;
}

/**
 * Protege el formulario de creación de empresas.
 *
 * Solo los roles administrador y capturista
 * pueden acceder a esta pantalla.
 *
 * @returns {import("react").JSX.Element}
 */
function CreateCompanyRoute() {
  const { role } = useAuth();
  const { loading } = useCompany();

  if (loading) {
    return (
      <p role="status" className="p-8">
        Validando empresa...
      </p>
    );
  }

  const allowedRoles = ["administrador", "capturista"];

  if (!allowedRoles.includes(role)) {
    return (
      <section role="alert" className="p-8">
        <h1 className="text-2xl font-semibold">
          Acceso no autorizado
        </h1>

        <p className="mt-3">
          No tiene permisos para registrar empresas.
        </p>
      </section>
    );
  }

  return <CreateCompanyPage />;
}

/**
 * Controla el acceso a la pantalla de login.
 *
 * Si el usuario ya está autenticado, lo envía
 * a la selección de empresas.
 *
 * @returns {import("react").JSX.Element}
 */
function LoginRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <p role="status" className="p-8">
        Validando sesión...
      </p>
    );
  }

  if (user) {
    return <Navigate to="/seleccionar-empresa" replace />;
  }

  return <LoginPage />;
}

/**
 * Protege la ruta de edicion empresarial.
 *
 * @retuns {import("react").JSX.Element}
 */

function CompanyDataEditRoute() {
  const { role } = useAuth();

  if (!canWrite(role)) {
    return <Navigate to="/datos" replace />;
  }

  return <CompanyDataEditPage />;
}

/** Protege el alta y edición de inmuebles para roles de escritura. */
function PropertyWriteRoute() {
  const { role } = useAuth();

  if (!canWrite(role)) {
    return <Navigate to="/propiedades/inmuebles" replace />;
  }

  return <PropertyFormPage />;
}

/**
 * Enrutador principal de Urbanística ERP V2.
 *
 * Flujo:
 *
 * Login
 *   └── Selección de empresas
 *         ├── Crear empresa
 *         └── Seleccionar empresa
 *               └── Dashboard
 *                     └── Módulos empresariales
 *
 * @returns {import("react").JSX.Element}
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Autenticación */}
        <Route
          path="/login"
          element={<LoginRoute />}
        />

        {/* Rutas que requieren sesión */}
        <Route element={<SessionRoute />}>

          {/* Selección de empresas */}
          <Route
            path="/seleccionar-empresa"
            element={<SelectCompanyRoute />}
          />

          {/* Creación de empresas */}
          <Route
            path="/crear-empresa"
            element={<CreateCompanyRoute />}
          />

          {/* Rutas que requieren empresa activa */}
          <Route element={<CompanyRoute />}>

            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />
            {/* Ficha empresarial */}
            <Route
              path="/datos"
              element={<CompanyDataPage />}
            />

            {/* Edición empresarial */}
            <Route
              path="/datos/editar"
              element={<CompanyDataEditRoute />}
            />

            <Route
              path="/propiedades/inmuebles"
              element={<PropertyListPage />}
            />
            <Route
              path="/propiedades/inmuebles/nuevo"
              element={<PropertyWriteRoute />}
            />
            <Route
              path="/propiedades/inmuebles/:id/editar"
              element={<PropertyWriteRoute />}
            />

            {/* Módulos configurados en navigation.js */}
            {navigation
            .filter(
              (item) =>
                item.key !== "dashboard" &&
                item.key !== "datos"
            )
            .map((item) => (
              <Route
                key={item.key}
                path={`/${item.key}`}
                element={<ModuleRoute item={item} />}
              />
  ))}

            {/* Ruta empresarial no encontrada */}
            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />

          </Route>

        </Route>

        {/* Ruta pública no encontrada */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}
