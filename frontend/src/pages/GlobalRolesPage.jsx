import PageHeader from '../components/layout/PageHeader';
import DataTable from '../components/tables/DataTable';
import StatusBadge from '../components/ui/StatusBadge';
import { roles, canWrite } from '../config/roles';
const columns = [
  { key: 'name', header: 'Rol global' },
  { key: 'scope', header: 'Alcance' },
  { key: 'write', header: 'Captura', render: (row) => <StatusBadge variant={row.write ? 'success' : 'neutral'}>{row.write ? 'Permitida' : 'Solo consulta'}</StatusBadge> },
  { key: 'admin', header: 'Usuarios y roles', render: (row) => row.admin ? 'Administración' : 'Sin acceso' },
];
const data = Object.entries(roles).map(([id, name]) => ({ id, name, scope: 'Todas las empresas', write: canWrite(id), admin: id === 'administrador' }));
export default function GlobalRolesPage() {
  return <div className="space-y-7">
    <PageHeader title="Roles globales" description="El rol del usuario se conserva al cambiar de empresa." />
    <DataTable caption="Permisos de los roles globales" columns={columns} data={data} />
  </div>;
}
