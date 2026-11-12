import PageHeader from '../components/layout/PageHeader';
import StatusBadge from '../components/ui/StatusBadge';
export default function ModulePlaceholder({ title }) {
  return <div className="space-y-7"><PageHeader title={title} description="Urbanística ERP V2" /><section className="rounded-2xl border border-border bg-surface p-8"><StatusBadge variant="warning">Próximamente</StatusBadge><h2 className="mt-5 text-lg font-semibold">Este módulo aún no está disponible</h2><p className="mt-2 text-text-muted">Las operaciones se habilitarán cuando el servicio de V2 esté disponible.</p></section></div>;
}
