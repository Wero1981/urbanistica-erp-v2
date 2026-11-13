/** Peticiones del módulo de inmuebles. */

import { apiClient } from "../../api/apiClient";

/** Convierte errores DRF, incluidos errores de campos, en texto visible. */
export function propertyApiError(error) {
  const data = error.response?.data;
  if (typeof data?.detail === "string") return data.detail;
  if (data && typeof data === "object") {
    const messages = [];
    const collect = (value) => {
      if (Array.isArray(value)) value.forEach(collect);
      else if (value && typeof value === "object") Object.values(value).forEach(collect);
      else if (value != null) messages.push(String(value));
    };
    collect(data);
    if (messages.length) return messages.join(" ");
  }
  return error.message || "No fue posible completar la operación.";
}

function rows(data) {
  return Array.isArray(data) ? data : (data?.results ?? []);
}

async function listAll(path, companyId) {
  const records = [];
  let page = 1;
  let next = true;
  while (next && page <= 100) {
    const { data } = await apiClient.get(path, {
      params: { page },
      companyId,
    });
    records.push(...rows(data));
    next = Boolean(data?.next);
    page += 1;
  }
  return records;
}

export const propertyService = {
  list: (companyId) => listAll("/properties/properties/", companyId),
  listTypes: (companyId) => listAll("/properties/types/", companyId),

  async get(companyId, id) {
    const { data } = await apiClient.get(
      `/properties/properties/${encodeURIComponent(id)}/`,
      { companyId },
    );
    return data;
  },

  async create(companyId, payload) {
    const { data } = await apiClient.post(
      "/properties/properties/",
      payload,
      { companyId },
    );
    return data;
  },

  async update(companyId, id, payload) {
    const { data } = await apiClient.patch(
      `/properties/properties/${encodeURIComponent(id)}/`,
      payload,
      { companyId },
    );
    return data;
  },

  async remove(companyId, id) {
    await apiClient.delete(
      `/properties/properties/${encodeURIComponent(id)}/`,
      { companyId },
    );
  },
};
