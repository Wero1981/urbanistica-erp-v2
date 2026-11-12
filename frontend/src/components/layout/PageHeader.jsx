/**
 * Encabezado reutilizable para las páginas del ERP.
 *
 * Mantiene consistentes los títulos, descripciones
 * y acciones principales de cada módulo.
 */

export default function PageHeader({
  title,
  description,
  actions,
}) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-text-muted">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}