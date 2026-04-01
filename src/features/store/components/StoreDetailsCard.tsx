import {
 StoreHero,
 StoreHeader,
 StoreContacts,
 StorePerks,
 StoreSchedule,
} from"./index";
import type { StoreMeta } from"../data/mockData";
import type { StoreContactItem } from"../types";

export type { StoreContactItem };

export type StoreDetailsCardProps = {
 store: StoreMeta;
 contacts?: StoreContactItem[]; // optional override
  onFavoriteClick?: () => void;
};

export default function StoreDetailsCard({
 store,
 contacts,
  onFavoriteClick,
}: StoreDetailsCardProps) {
 const defaultContacts: StoreContactItem[] = [
    {
      type:"call",
      label:"Call",
      value: store.phone,
      onClick: () => {
        window.location.href = `tel:${store.phone}`;
      },
    },
    {
      type:"mobile",
      label:"Mobile",
      value: store.mobile,
      onClick: () => {
        window.location.href = `tel:${store.mobile}`;
      },
    },
    {
      type:"email",
      label:"Email",
      value: store.email,
      onClick: () => {
        window.location.href = `mailto:${store.email}`;
      },
    },
    { type:"accepting", label:"Accepting orders" },
 ];

 const finalContacts = contacts ?? defaultContacts;

 return (
 <div className="rounded-3xl overflow-hidden bg-custom-card shadow-sm border border-custom-primary">
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
        isFavorite={store.isFavorite}
        onFavoriteClick={onFavoriteClick}
 />

      <div className="flex flex-col gap-6">
        <div className="space-y-4">
 <StoreContacts contacts={finalContacts} />
          <StoreSchedule
            schedule={store.schedule}
            workingHours={store.workingHours}
            status={store.status}
          />
 </div>
 </div>

 <StorePerks perks={store.perks} />
 </div>
 </div>
 );
}
