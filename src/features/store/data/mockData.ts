import type { BadgeVariant } from "../components";

export type Badge = {
  label: string;
  variant?: BadgeVariant;
};

export type StoreMeta = {
  name: string;
  category: string;
  rating: number;
  city: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  schedule: string;
  status: "open" | "closed";
  tags: Badge[];
  services: Badge[];
  perks: Badge[];
  heroImage: string;
  logo: string;
};

export const store: StoreMeta = {
  name: "Glamour Boutique",
  category: "Clothing store",
  rating: 4.8,
  city: "Cairo, Nasr City",
  address: "15 Abbas El Akkad Street, Building 22",
  phone: "+20 10 1234 5678",
  mobile: "+20 12 3456 7890",
  email: "contact@glamour.com",
  schedule: "9:00 AM – 11:00 PM",
  status: "open",
  tags: [
    { label: "Open", variant: "success" },
    { label: "Price match", variant: "primary" },
    { label: "Ready for orders", variant: "primary" },
    { label: "Recommended by us", variant: "outline" },
  ],
  services: [
    { label: "Delivery", variant: "outline" },
    { label: "In-dine", variant: "outline" },
    { label: "Subscriptions", variant: "outline" },
  ],
  perks: [
    { label: "Free delivery", variant: "success" },
    { label: "Accepting orders", variant: "success" },
    { label: "Price match", variant: "primary" },
  ],
  heroImage:
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
  logo: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=60",
};

