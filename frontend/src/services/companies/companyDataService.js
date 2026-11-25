/** API de domicilios y personas relacionadas con empresas. */

import { apiClient } from "../../api/apiClient";

/** Normaliza respuestas paginadas de DRF. */
function rows(data) {
  return Array.isArray(data) ? data : (data?.results ?? []);
}

async function list(resource, companyId) {
  const records = [];
  let page = 1;
  let next = true;
  while (next && page <= 100) {
    const { data } = await apiClient.get(`/${resource}/`, {
      params: { company: companyId, page },
      companyId,
    });
    records.push(...rows(data));
    next = Boolean(data?.next);
    page += 1;
  }
  return records;
}

async function create(resource, companyId, payload) {
  const { data } = await apiClient.post(
    `/${resource}/`,
    { ...payload, company: companyId },
    { companyId },
  );
  return data;
}

async function update(resource, companyId, id, payload) {
  const { data } = await apiClient.patch(
    `/${resource}/${encodeURIComponent(id)}/`,
    payload,
    { companyId },
  );
  return data;
}

async function remove(resource, companyId, id) {
  await apiClient.delete(`/${resource}/${encodeURIComponent(id)}/`, { companyId });
}

/** Construye un CRUD acotado a la empresa activa. */
function crud(resource) {
  return {
    list: (companyId) => list(resource, companyId),
    create: (companyId, payload) => create(resource, companyId, payload),
    update: (companyId, id, payload) => update(resource, companyId, id, payload),
    remove: (companyId, id) => remove(resource, companyId, id),
  };
}

export const companyAddressService = crud("company-addresses");
export const companyPartnerService = crud("company-partners");
export const companyRepresentativeService = crud("company-representatives");
