export interface LegalDocumentData {
 key: string;
 title: string;
 content: string;
}

export interface LegalDocumentResponse {
 status: boolean;
 message: string;
 data: LegalDocumentData;
}

export type LegalDocumentKey ="privacy_policy"|"terms_conditions";
