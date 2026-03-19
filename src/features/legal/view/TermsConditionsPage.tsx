import { useTermsConditions } from"../hooks/useLegalDocument";
import LegalDocumentPage from"./LegalDocumentPage";

const HERO_IMAGE ="/images/privacy/accept-terms.png";

export default function TermsConditionsPage() {
 const { data, isLoading, error } = useTermsConditions();

 return (
 <LegalDocumentPage
 data={data ?? null}
 isLoading={isLoading}
 error={error ?? null}
 heroImageSrc={HERO_IMAGE}
 />
 );
}
