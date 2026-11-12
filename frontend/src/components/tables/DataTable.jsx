import { AlertCircle, Loader2 } from "lucide-react";

/**
 * Tabla compartida. La página controla las consultas, filtros y paginación.
 * columns: [{ key, header, render?: (row) => ReactNode, className? }].
 * Cada fila debe tener una clave única: rowKey admite un campo o una función.
 * toolbar permite insertar búsqueda, actualización u otras acciones.
 */
export default function DataTable({
  columns,
  data = [],
  rowKey = "id",
  caption = "Registros",
  loading = false,
  loadingMessage = "Cargando registros...",
  error,
  emptyTitle = "No se encontraron registros",
  emptyDescription,
  emptyIcon,
  toolbar,
  tableClassName = "min-w-160",
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm" aria-busy={loading}>
      {toolbar && (
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          {toolbar}
        </div>
      )}

      {error && (
        <div role="alert" className="m-5 flex items-start gap-3 rounded-xl border border-danger bg-danger-soft p-4 text-sm text-danger">
          <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div role="status" className="flex flex-col items-center justify-center gap-3 px-5 py-16">
          <Loader2 size={30} className="animate-spin text-primary" aria-hidden="true" />
          <p className="text-sm text-text-muted">{loadingMessage}</p>
        </div>
      ) : data.length === 0 ? (
        !error && (
          <div role="status" className="flex flex-col items-center justify-center gap-3 px-5 py-16">
            {emptyIcon && (
              <div className="rounded-2xl bg-primary-soft p-4" aria-hidden="true">
                {emptyIcon}
              </div>
            )}
            <h3 className="font-semibold text-text">{emptyTitle}</h3>
            {emptyDescription && (
              <p className="max-w-sm text-center text-sm text-text-muted">{emptyDescription}</p>
            )}
          </div>
        )
      ) : (
        <div className="overflow-x-auto" role="region" aria-label={caption} tabIndex={0}>
          <table className={`w-full text-left text-sm ${tableClassName}`}>
            <caption className="sr-only">{caption}</caption>
            <thead className="bg-surface-muted text-xs uppercase tracking-wide text-text-muted">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} scope="col" className="px-5 py-4 font-semibold">
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((row) => (
                <tr key={typeof rowKey === "function" ? rowKey(row) : row[rowKey]} className="transition-colors hover:bg-surface-muted">
                  {columns.map((column) => (
                    <td key={column.key} className={`px-5 py-4 ${column.className ?? ""}`}>
                      {column.render ? column.render(row) : (row[column.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
