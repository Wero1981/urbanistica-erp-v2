/** Servicio de consulta al catálogo SEPOMEX compartido. */

import { apiClient } from "../api/apiClient";

export const locationService = {
  /** Consulta estado, municipio y asentamientos de un código postal. */
  async getByPostalCode(postalCode, options = {}) {
    const code = String(postalCode).trim();
    if (!/^\d{5}$/.test(code)) {
      throw new Error("El código postal debe contener 5 dígitos.");
    }
    const { data } = await apiClient.get(
      `/locations/postal-codes/${code}/`,
      options,
    );
    return data;
  },
};
