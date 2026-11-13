/** Formulario de alta y edición de inmuebles patrimoniales. */

import { useState } from "react";

import AddressForm from "../common/AddressForm";
import Form from "../ui/Forms";
import FormField from "../ui/FormField";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Textarea from "../ui/Textarea";

const EMPTY_VALUES = {
  asset: { name: "", description: "" },
  property_type: "",
  postal_code: "", state: "", municipality: "", neighborhood: "",
  street: "", exterior_number: "", interior_number: "",
  land_area: "", construction_area: "", levels: "",
  physical_details: {},
};

function initialValues(property) {
  if (!property) return EMPTY_VALUES;
  return {
    ...EMPTY_VALUES,
    ...property,
    asset: { ...EMPTY_VALUES.asset, ...property.asset },
    property_type: String(property.property_type ?? ""),
    land_area: property.land_area ?? "",
    construction_area: property.construction_area ?? "",
    levels: property.levels ?? "",
    physical_details: property.physical_details ?? {},
  };
}

/** Renderiza los campos admitidos actualmente por la API de propiedades. */
export default function PropertyForm({ property, types, saving, error, onSave, onCancel }) {
  const [values, setValues] = useState(() => initialValues(property));

  function change(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function changeAsset(event) {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      asset: { ...current.asset, [name]: value },
    }));
  }

  function changeAddress(address) {
    setValues((current) => ({ ...current, ...address }));
  }

  function changePhysicalDetail(event) {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      physical_details: {
        ...current.physical_details,
        [name]: value === "" ? "" : Number(value),
      },
    }));
  }

  async function submit() {
    const physicalDetails = Object.fromEntries(
      Object.entries(values.physical_details).filter(([, value]) => value !== ""),
    );
    await onSave({
      asset: {
        name: values.asset.name.trim(),
        description: values.asset.description.trim(),
      },
      property_type: Number(values.property_type),
      postal_code: values.postal_code,
      state: values.state,
      municipality: values.municipality,
      neighborhood: values.neighborhood,
      street: values.street.trim(),
      exterior_number: values.exterior_number.trim(),
      interior_number: values.interior_number.trim(),
      land_area: values.land_area === "" ? null : values.land_area,
      construction_area: values.construction_area === "" ? null : values.construction_area,
      levels: values.levels === "" ? null : Number(values.levels),
      physical_details: physicalDetails,
    });
  }

  return (
    <Form
      title={property ? "Editar inmueble" : "Registrar inmueble"}
      description="Capture los datos generales, domicilio y características físicas."
      onSubmit={submit}
      onCancel={onCancel}
      saving={saving}
      disabled={!values.asset.name.trim() || !values.property_type}
      submitLabel={property ? "Guardar cambios" : "Registrar inmueble"}
    >
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {property?.asset?.code && (
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Código patrimonial</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{property.asset.code}</p>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <FormField id="property-name" label="Nombre del inmueble" required>
          <Input id="property-name" name="name" value={values.asset.name} onChange={changeAsset} disabled={saving} required />
        </FormField>
        <FormField id="property-type" label="Tipo de inmueble" required>
          <Select
            id="property-type"
            name="property_type"
            value={values.property_type}
            onChange={change}
            disabled={saving}
            required
            options={[
              { value: "", label: "Seleccione un tipo" },
              ...types.map((type) => ({ value: String(type.id), label: type.name })),
            ]}
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField id="property-description" label="Descripción">
            <Textarea id="property-description" name="description" value={values.asset.description} onChange={changeAsset} disabled={saving} rows={3} />
          </FormField>
        </div>
      </div>

      <AddressForm value={values} onChange={changeAddress} disabled={saving} />

      <section className="space-y-5 rounded-2xl border border-slate-200 p-5">
        <h3 className="font-semibold text-slate-900">Superficies y características</h3>
        <div className="grid gap-5 md:grid-cols-3">
          <FormField id="property-land-area" label="Superficie de terreno (m²)">
            <Input id="property-land-area" name="land_area" type="number" min="0" step="0.01" value={values.land_area} onChange={change} disabled={saving} />
          </FormField>
          <FormField id="property-construction-area" label="Superficie construida (m²)">
            <Input id="property-construction-area" name="construction_area" type="number" min="0" step="0.01" value={values.construction_area} onChange={change} disabled={saving} />
          </FormField>
          <FormField id="property-levels" label="Niveles">
            <Input id="property-levels" name="levels" type="number" min="0" step="1" value={values.levels} onChange={change} disabled={saving} />
          </FormField>
          <FormField id="property-bedrooms" label="Recámaras">
            <Input id="property-bedrooms" name="bedrooms" type="number" min="0" step="1" value={values.physical_details.bedrooms ?? ""} onChange={changePhysicalDetail} disabled={saving} />
          </FormField>
          <FormField id="property-bathrooms" label="Baños">
            <Input id="property-bathrooms" name="bathrooms" type="number" min="0" step="0.5" value={values.physical_details.bathrooms ?? ""} onChange={changePhysicalDetail} disabled={saving} />
          </FormField>
          <FormField id="property-parking" label="Estacionamientos">
            <Input id="property-parking" name="parking_spaces" type="number" min="0" step="1" value={values.physical_details.parking_spaces ?? ""} onChange={changePhysicalDetail} disabled={saving} />
          </FormField>
        </div>
      </section>
    </Form>
  );
}
