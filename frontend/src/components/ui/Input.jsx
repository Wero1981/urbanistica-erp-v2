/**
 * Campo de entrada reutilizable del Design System.
 */

export default function Input({
  id,
  label,
  error,
  helperText,
  className = "",
  ...props
}) {
  const descriptionId = error || helperText
    ? `${id}-description`
    : undefined;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-text"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={`
          min-h-11
          w-full
          rounded-xl
          border
          bg-surface
          px-3.5
          text-sm
          text-text
          outline-none
          transition
          placeholder:text-text-muted
          ${
            error
              ? "border-danger focus:ring-danger"
              : "border-border focus:border-primary focus:ring-primary"
          }
          focus:ring-2
          
          disabled:cursor-not-allowed
          disabled:bg-surface-muted
          ${className}
        `}
        {...props}
      />

      {(error || helperText) && (
        <p
          id={descriptionId}
          className={`text-xs ${
            error
              ? "text-danger"
              : "text-text-muted"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}