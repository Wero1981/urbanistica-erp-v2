/** Domicilio reutilizable respaldado por el catálogo SEPOMEX. */

import PostalCodeSelector from "../locations/PostalCodeSelector";
import FormField from "../ui/FormField";
import Input from "../ui/Input";

/**
 * Captura un domicilio sin mapas ni coordenadas.
 *
 * @param {Object} props
 * @param {Object} props.value - Valores actuales.
 * @param {(value: Object) => void} props.onChange - Actualiza el domicilio.
 * @param {boolean} [props.disabled] - Deshabilita la captura.
 */
export default function AddressForm({ value, onChange, disabled = false }) {
  function change(event) {
    const { name, value: fieldValue } = event.target;
    onChange({ ...value, [name]: fieldValue });
  }

  return (
    <section className="space-y-5 rounded-2xl border border-slate-200 p-5">
      <header>
        <h3 className="font-semibold text-slate-900">Domicilio</h3>
        <p className="mt-1 text-sm text-slate-500">
          El código postal completa estado, municipio y colonias disponibles.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <PostalCodeSelector value={value} onChange={onChange} disabled={disabled} />

        <div className="md:col-span-2">
          <FormField id="property-street" label="Calle">
            <Input id="property-street" name="street" value={value.street ?? ""} onChange={change} disabled={disabled} />
          </FormField>
        </div>
        <FormField id="property-exterior-number" label="Número exterior">
          <Input id="property-exterior-number" name="exterior_number" value={value.exterior_number ?? ""} onChange={change} disabled={disabled} />
        </FormField>
        <FormField id="property-interior-number" label="Número interior">
          <Input id="property-interior-number" name="interior_number" value={value.interior_number ?? ""} onChange={change} disabled={disabled} />
        </FormField>
      </div>
    </section>
  );
}
