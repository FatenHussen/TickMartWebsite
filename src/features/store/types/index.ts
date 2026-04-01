// Component Types
export type SearchFilterState = {
 category: string;
 subcategories: string[];
 sizes: string[];
 colors: string[];
 minPrice: string;
 maxPrice: string;
 ratings: number[];
 offers: string[];
};

export type BadgeVariant ="primary"|"success"|"outline"|"warning";

export type ContactType ="call"|"mobile"|"email"|"accepting";

export type StoreContactItem = {
 type: ContactType;
 label: string;
 value?: string;
  onClick?: () => void;
};
