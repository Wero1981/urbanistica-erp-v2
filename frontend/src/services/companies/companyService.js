/**
 * Servicio de administracion de empresas.
 * 
 * Centraliza las peticiones HTTP relacionadas con 
 * el registro, cosulta y actulización de empresas.
 * 
 * @module services/companies/companyService
 * @author Urbanística
 * @license MIT
 */

import { apiClient } from '../../api/apiClient';

/**
 * 
 * Obtiene la lista de empresas activas disponibles para el usuario.
 * 
 * @returns {Promise<{companies: Array}>} Un objeto con la lista de empresas activas.
 * @throws {Error} Si ocurre un error en la petición o la respuesta es inválida. 
 */
export async function getCompanies() {
  const companies = [];
  let page = 1;
  let next;
  do {
    const { data } = await apiClient.get('/companies/', { params: { page } });
    const rows = Array.isArray(data) ? data : data.results;
    if (!Array.isArray(rows)) throw new Error('Respuesta de empresas inválida.');
    companies.push(...rows.filter((company) => company.is_active !== false));
    next = data.next;
    page += 1;
    if (next && page > 100) throw new Error('El catálogo excede el límite de páginas. Contacte al administrador.');
  } while (next);
  return { companies };

}

/**
 * Obtiene la información de una empresa específica por su ID.
 * @param {string|number} id - El ID de la empresa a consultar.
 * @returns {Promise<Object>} Un objeto con la información de la empresa.
 * @throws {Error} Si ocurre un error en la petición o la empresa no está disponible.
 */
export async function getCompany(id) {
  const { data } = await apiClient.get(`/companies/${encodeURIComponent(id)}/`);
  if (data.id == null || String(data.id) !== String(id) || data.is_active === false) throw new Error('La empresa no está disponible.');
  return data;
}

/**
 * Registra una nueva empresa en Urbanística ERP V2.
 *
 * La empresa se crea con información mínima.
 * Los datos fiscales, domicilios y demás información
 * se completarán posteriormente desde el módulo Datos.
 *
 * @async
 * @param {Object} payload - Información inicial de la empresa.
 * @param {string} payload.name - Razón social o nombre completo.
 * @param {"moral"|"fisica"} payload.company_type - Tipo de contribuyente.
 * @param {string} [payload.trade_name] - Nombre comercial opcional.
 * @returns {Promise<Object>} Empresa creada por el backend.
 * @throws {Error} Si la API rechaza la solicitud.
 */
export async function createCompany(payload) {
  const { data } = await apiClient.post(
    "/companies/",
    payload
  );

  return data;
}

/**
 * 
 * Actuliza parcialmente la informacion de una empresa.
 * 
 * utiliza PATCH para modificar unicamente los campos 
 * proporcionado, conservando el rsto de la informacion
 * 
 * @async
 * @param {string|number} id - El ID de la empresa a actualizar.
 * @param {Object} payload - Información a actualizar de la empresa.
 * @returns {Promise<Object>} Empresa actualizada por el backend.
 * @throws {Error} Si la API rechaza la solicitud o la empresa no está disponible.
 * 
 */

export async function updateCompany(id, payload) {
  const { data } = await apiClient.patch(
    `/companies/${encodeURIComponent(id)}/`,
    payload
  );

  if (data.id == null || String(data.id) !== String(id) || data.is_active === false) throw new Error('La empresa no está disponible.');

  return data;
}