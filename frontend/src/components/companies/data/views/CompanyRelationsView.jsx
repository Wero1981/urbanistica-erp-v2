/** Vista de consulta de domicilios, socios y representantes. */

import useCompanyRecords from "../../../../hooks/companies/useCompanyRecords";
import {
  companyAddressService,
  companyPartnerService,
  companyRepresentativeService,
} from "../../../../services/companies/companyDataService";

function personName(person) {
  return person.person_type === "moral"
    ? person.business_name
    : `${person.first_name} ${person.last_name}`.trim();
}

/** Muestra las relaciones capturadas para la empresa activa. */
export default function CompanyRelationsView({ companyId }) {
  const addresses = useCompanyRecords(companyId, companyAddressService);
  const partners = useCompanyRecords(companyId, companyPartnerService);
  const representatives = useCompanyRecords(companyId, companyRepresentativeService);
  const errors = [addresses.error, partners.error, representatives.error].filter(Boolean);

  return (
    <>
      {errors.length > 0 && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{errors[0]}</p>}

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Domicilios</h2>
        {addresses.loading && <p className="mt-4 text-sm text-slate-500">Cargando...</p>}
        {!addresses.loading && addresses.records.length === 0 && <p className="mt-4 text-sm font-medium text-amber-600">Pendiente de captura</p>}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {addresses.records.map((address) => (
            <article key={address.id} className="rounded-xl border border-slate-200 p-4">
              <p className="font-medium capitalize">{address.address_type}{address.is_primary ? " · Principal" : ""}</p>
              <p className="mt-1 text-sm text-slate-600">{address.street} {address.exterior_number}{address.interior_number ? ` Int. ${address.interior_number}` : ""}</p>
              <p className="text-sm text-slate-600">{address.neighborhood}, C.P. {address.postal_code}</p>
              <p className="text-sm text-slate-600">{address.municipality}, {address.state}, {address.country}</p>
              {address.references && <p className="mt-2 text-sm text-slate-500">{address.references}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Socios</h2>
        {partners.loading && <p className="mt-4 text-sm text-slate-500">Cargando...</p>}
        {!partners.loading && partners.records.length === 0 && <p className="mt-4 text-sm font-medium text-amber-600">Pendiente de captura</p>}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {partners.records.map((partner) => (
            <article key={partner.id} className="rounded-xl border border-slate-200 p-4">
              <p className="font-medium">{personName(partner.person)}</p>
              <p className="text-sm text-slate-600">Participación: {partner.ownership_percentage}%</p>
              {partner.contribution_amount != null && <p className="text-sm text-slate-600">Aportación: ${Number(partner.contribution_amount).toLocaleString("es-MX")}</p>}
              {partner.person.rfc && <p className="text-sm text-slate-600">RFC: {partner.person.rfc}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold">Representantes legales</h2>
        {representatives.loading && <p className="mt-4 text-sm text-slate-500">Cargando...</p>}
        {!representatives.loading && representatives.records.length === 0 && <p className="mt-4 text-sm font-medium text-amber-600">Pendiente de captura</p>}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {representatives.records.map((representative) => (
            <article key={representative.id} className="rounded-xl border border-slate-200 p-4">
              <p className="font-medium">{personName(representative.person)}</p>
              <p className="text-sm text-slate-600">{representative.position}</p>
              {representative.power_deed_number && <p className="text-sm text-slate-600">Escritura: {representative.power_deed_number}</p>}
              {representative.powers_description && <p className="mt-2 text-sm text-slate-500">{representative.powers_description}</p>}
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
