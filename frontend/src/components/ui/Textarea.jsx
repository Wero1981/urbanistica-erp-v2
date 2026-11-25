/**
 * Área de texto reutilizable.
 *
 * @module components/ui/Textarea
 */

/**
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.name
 * @param {string} props.value
 * @param {(event: import("react").ChangeEvent<HTMLTextAreaElement>) => void} props.onChange
 * @param {number} [props.rows]
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.required]
 * @param {boolean} [props.invalid]
 * @param {string} [props.ariaDescribedBy]
 * @returns {import("react").JSX.Element}
 */
export default function Textarea({
  id,
  name,
  value,
  onChange,
  rows = 4,
  disabled = false,
  required = false,
  invalid = false,
  ariaDescribedBy,
}) {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      disabled={disabled}
      required={required}
      aria-invalid={invalid}
      aria-describedby={ariaDescribedBy}
      className={[
        "w-full rounded-xl border bg-white px-4 py-3",
        "text-sm text-slate-900 outline-none transition",
        "focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
        invalid
          ? "border-red-500 focus:ring-red-100"
          : "border-slate-300 focus:border-slate-600 focus:ring-slate-100",
      ].join(" ")}
    />
  );
}