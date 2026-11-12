/**
 * Configuración central de navegación de Urbanística ERP V2.
 *
 * Los módulos se organizan en dos grupos:
 * - workspace: operaciones de la empresa activa.
 * - administration: administración global del ERP.
 *
 * @module config/navigation
 */

import {
  LayoutDashboard,
  Building2,
  House,
  BriefcaseBusiness,
  Wallet,
  ChartNoAxesCombined,
  Users,
  ShieldCheck,
} from "lucide-react";

/**
 * Catálogo de módulos del sistema.
 *
 * @type {Array<{
 *   key: string,
 *   label: string,
 *   icon: import("react").ComponentType,
 *   group: string,
 *   description: string
 * }>}
 */
export const navigation = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    group: "workspace",
    description: "Resumen general de la empresa.",
  },
  {
    key: "datos",
    label: "Datos",
    icon: Building2,
    group: "workspace",
    description: "Información general, fiscal y jurídica de la empresa.",
  },
  {
    key: "propiedades",
    label: "Propiedades",
    icon: House,
    group: "workspace",
    description: "Inmuebles, unidades, propietarios y ubicaciones.",
  },
  {
    key: "negocios",
    label: "Negocios",
    icon: BriefcaseBusiness,
    group: "workspace",
    description: "Clientes, arrendamientos, compraventas y contratos.",
  },
  {
    key: "finanzas",
    label: "Finanzas",
    icon: Wallet,
    group: "workspace",
    description: "Ingresos, gastos, pagos y cobros.",
  },
  {
    key: "reportes",
    label: "Reportes",
    icon: ChartNoAxesCombined,
    group: "workspace",
    description: "Indicadores, resultados y rentabilidad.",
  },
  {
    key: "usuarios",
    label: "Usuarios",
    icon: Users,
    group: "administration",
    description: "Administración de usuarios del sistema.",
  },
  {
    key: "roles",
    label: "Roles globales",
    icon: ShieldCheck,
    group: "administration",
    description: "Administración de roles y permisos globales.",
  },
];