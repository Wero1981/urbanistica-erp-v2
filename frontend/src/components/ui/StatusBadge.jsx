/**
 * Indicador de estado reutilizable.
 */

const variants = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-surface-muted text-text-muted",
};

export default function StatusBadge({
  children,
  variant = "neutral",
}) {
  const variantClasses =
    variants[variant] ?? variants.neutral;

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-lg
        px-2.5
        py-1
        text-xs
        font-medium
        ${variantClasses}
      `}
    >
      {children}
    </span>
  );
}