/**
 * Botón reutilizable del Design System del ERP.
 */

const variants = {
  primary:
    "bg-primary text-text-inverse hover:bg-primary-hover",

  secondary:
    "border border-border bg-surface text-text hover:bg-surface-muted",

  danger:
    "bg-danger text-white hover:opacity-90",

  ghost:
    "bg-transparent text-text hover:bg-surface-muted",
};


export default function Button({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  ...props
}) {
  const variantClasses =
    variants[variant] ?? variants.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      className={`
        inline-flex
        min-h-11
        items-center
        justify-center
        gap-2
        rounded-xl
        px-4
        text-sm
        font-semibold
        transition
        duration-200
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variantClasses}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}