/** Sección CRUD de representantes legales. */

import { companyRepresentativeService } from "../../../../services/companies/companyDataService";
import CompanyPeopleForm from "./CompanyPeopleForm";

/** Renderiza la captura de múltiples representantes. */
export default function CompanyRepresentativesForm(props) {
  return <CompanyPeopleForm {...props} kind="representative" service={companyRepresentativeService} />;
}
