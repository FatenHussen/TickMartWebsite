export type Category = {
  id: number;
  name: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  description: string;
};

export type Subcategory = {
  id: number;
  name: string;
  description: string;
  tags: string[];
};

export type Product = {
  id: number;
  name: string;
  store: string;
  price: string;
  rating: number;
  image: string;
  originalPrice?: string;
  badge?: { label: string; className?: string };
  category?: string;
};

export type NestedSubcategory = {
  id: number;
  name: string;
  children?: NestedSubcategory[];
};

export type Store = {
  id: number;
  name: string;
  type: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  status?: "open" | "closed";
  badges?: string[];
  deliveryTime?: string;
  tags?: string[];
};
