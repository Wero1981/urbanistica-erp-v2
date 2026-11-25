/**
 *
 * Configuracion y navegacion de pestañas para empresariales
 *
 * @module components/companies/CompanyDataTabs
 */
import Tabs from "../../../ui/Tabs";
import { COMPANY_DATA_TABS } from "../../../config/companyDataTabs";
/**
 * Sección de pestañas para la ficha empresarial.
 *
 * @param {Object} props
 * @param {import("react").JSX.Element} props.children - Contenido de la pestaña activa.
 * @returns {import("react").JSX.Element}
 */


/**
 * Renderiza las pestañas del módulo Datos.
 *
 * @param {Object} props
 * @param {string} props.value - Pestaña seleccionada.
 * @param {(key: string) => void} props.onChange - Cambio de pestaña.
 * @returns {import("react").JSX.Element}
 */
export default function CompanyDataTabs({ value, onChange }) {
  return (
    <Tabs
      items={COMPANY_DATA_TABS}
      value={value}
      onChange={onChange}
    />
  );
}
