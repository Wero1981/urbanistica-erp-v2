/**
 * Selector reutilizable del ERP.
 *
 * @module components/ui/Select
 */

/**
 * @typedef {Object} SelectOption
 * @property {string|number} value - Valor.
 * @property {string} label - Texto visible.
 * @property {boolean} [disabled] - Opción deshabilitada.
 */

/**
 * @param {Object} props
 * @param {string} props.id
 * @param {string} props.name
 * @param {string|number} props.value
 * @param {(event: import("react").ChangeEvent<HTMLSelectElement>) => void} props.onChange
 * @param {SelectOption[]} props.options
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.required]
 * @param {boolean} [props.invalid]
 * @param {string} [props.ariaDescribedBy]
 * @returns {import("react").JSX.Element}
 */
export default function Select({
  id,
  name,
  value,
  onChange,
  options = [],
  disabled = false,
  required = false,
  invalid = false,
  ariaDescribedBy,
}) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
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
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}