/** Sección CRUD de socios empresariales. */

import { companyPartnerService } from "../../../../services/companies/companyDataService";
import CompanyPeopleForm from "./CompanyPeopleForm";

/** Renderiza la captura de múltiples socios. */
export default function CompanyPartnersForm(props) {
  return <CompanyPeopleForm {...props} kind="partner" service={companyPartnerService} />;
}
