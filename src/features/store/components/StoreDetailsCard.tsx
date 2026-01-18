import {
  StoreHero,
  StoreHeader,
  StoreContacts,
  StorePerks,
  StoreSchedule,
} from "./index";
import type { StoreMeta } from "../data/mockData";

type ContactType = "call" | "mobile" | "email" | "accepting";

export type StoreContactItem = {
  type: ContactType;
  label: string;
  value?: string;
};

export type StoreDetailsCardProps = {
  store: StoreMeta;
  contacts?: StoreContactItem[]; // optional override
};

export default function StoreDetailsCard({
  store,
  contacts,
}: StoreDetailsCardProps) {
  const defaultContacts: StoreContactItem[] = [
    { type: "call", label: "Call", value: store.phone },
    { type: "mobile", label: "Mobile", value: store.mobile },
    { type: "email", label: "Email", value: store.email },
    { type: "accepting", label: "Accepting orders" },
  ];

  const finalContacts = contacts ?? defaultContacts;

  return (
    <div className="rounded-3xl overflow-hidden bg-white shadow-sm border border-custom-primary">
      <StoreHero
        heroImage={store.heroImage}
        storeName={store.name}
        tags={store.tags}
      />

      <div className="p-6 md:p-8 space-y-6 relative bg-blue-off">
        <StoreHeader
          logo={store.logo}
          name={store.name}
          category={store.category}
          rating={store.rating}
          city={store.city}
          address={store.address}
        />

        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <StoreContacts contacts={finalContacts} />
          </div>

          <StoreSchedule schedule={store.schedule} status={store.status} />
        </div>

        <StorePerks perks={store.perks} />
      </div>
    </div>
  );
}
