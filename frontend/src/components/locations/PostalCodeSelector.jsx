/** Selector de domicilio respaldado por el catálogo SEPOMEX. */

import { useEffect, useRef, useState } from "react";

import FormField from "../ui/FormField";
import Input from "../ui/Input";
import Select from "../ui/Select";
import { locationService } from "../../services/locationsService";

const normalize = (value) => String(value ?? "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();

/**
 * Completa estado, municipio y colonia a partir del código postal.
 *
 * @param {Object} props
 * @param {Object} props.value - Domicilio actual.
 * @param {(value: Object) => void} props.onChange - Actualiza el domicilio.
 * @param {boolean} [props.disabled] - Deshabilita los controles.
 */
export default function PostalCodeSelector({ value, onChange, disabled = false }) {
  const postalCode = value.postal_code ?? "";
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const valueRef = useRef(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    valueRef.current = value;
    onChangeRef.current = onChange;
  }, [value, onChange]);

  useEffect(() => {
    if (!/^\d{5}$/.test(postalCode)) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await locationService.getByPostalCode(postalCode, {
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        const options = Array.isArray(data.settlements) ? data.settlements : [];
        setSettlements(options);
        const current = valueRef.current;
        const found = options.find(
          (item) => normalize(item.name) === normalize(current.neighborhood),
        );
        onChangeRef.current({
          ...current,
          state: data.state ?? "",
          municipality: data.municipality ?? "",
          neighborhood: found?.name ?? (options.length === 1 ? options[0].name : ""),
        });
      } catch (requestError) {
        if (controller.signal.aborted || requestError.code === "ERR_CANCELED") return;
        setSettlements([]);
        setError(requestError.response?.status === 404
          ? "Código postal no encontrado."
          : "No fue posible consultar el código postal.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [postalCode]);

  function changePostalCode(event) {
    const code = event.target.value.replace(/\D/g, "").slice(0, 5);
    setSettlements([]);
    setError("");
    onChange({
      ...value,
      postal_code: code,
      state: "",
      municipality: "",
      neighborhood: "",
    });
  }

  const options = [{ value: "", label: loading ? "Consultando..." : "Seleccione una colonia" }];
  if (value.neighborhood && !settlements.some((item) => item.name === value.neighborhood)) {
    options.push({ value: value.neighborhood, label: `${value.neighborhood} (guardada)` });
  }
  options.push(...settlements.map((item) => ({
    value: item.name,
    label: item.type ? `${item.name} (${item.type})` : item.name,
  })));

  return (
    <>
      <FormField id="address-postal-code" label="Código postal" required error={error}>
        <Input
          id="address-postal-code"
          name="postal_code"
          value={postalCode}
          onChange={changePostalCode}
          inputMode="numeric"
          maxLength={5}
          disabled={disabled}
          required
        />
      </FormField>
      <FormField id="address-state" label="Estado" required>
        <Input id="address-state" name="state" value={value.state ?? ""} readOnly required />
      </FormField>
      <FormField id="address-municipality" label="Municipio" required>
        <Input id="address-municipality" name="municipality" value={value.municipality ?? ""} readOnly required />
      </FormField>
      <FormField id="address-neighborhood" label="Colonia / asentamiento" required>
        <Select
          id="address-neighborhood"
          name="neighborhood"
          value={value.neighborhood ?? ""}
          onChange={(event) => onChange({ ...value, neighborhood: event.target.value })}
          options={options}
          disabled={disabled || loading || settlements.length === 0}
          required
        />
      </FormField>
    </>
  );
}
