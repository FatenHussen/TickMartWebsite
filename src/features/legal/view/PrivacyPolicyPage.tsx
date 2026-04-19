import { usePrivacyPolicy } from"../hooks/useLegalDocument";
import LegalDocumentPage from"./LegalDocumentPage";

const HERO_IMAGE ="/images/privacy/privacy-policy.png";

export default function PrivacyPolicyPage() {
 const { data, isLoading, error } = usePrivacyPolicy();

 return (
 <LegalDocumentPage
 variant="privacy"
 data={data ?? null}
 isLoading={isLoading}
 error={error ?? null}
 heroImageSrc={HERO_IMAGE}
 />
 );
}
