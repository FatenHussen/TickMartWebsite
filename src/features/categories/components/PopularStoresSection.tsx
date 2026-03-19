import { useTranslation } from"react-i18next";
import SliderSection from"@/shared/component/SliderSection";
import StoreCard from"@/shared/component/StoreCard";
import type { Store } from"../types";

export type { Store };

type PopularStoresSectionProps = {
 stores: Store[];
 onStoreClick?: (storeId: number) => void;
};

export default function PopularStoresSection({
 stores,
 onStoreClick,
}: PopularStoresSectionProps) {
 const { t } = useTranslation();

 if (stores.length === 0) return null;

 return (
 <section>
 <h2 className="text-lg sm:text-xl font-bold text-custom-primary mb-5">
 {t("categories.popularStores")}
 </h2>
 <SliderSection
 title=""
 items={stores}
 renderItem={(store) => (
 <StoreCard
 name={store.name}
 type={store.type}
 location={store.location}
 rating={store.rating}
 image={store.image}
 status={store.status ||"open"}
 statusLabel={t("home.open")}
 deliveryFee={
 store.tags?.includes("Free Delivery")
 ? t("home.freeDelivery")
 : undefined
 }
 services={store.tags}
 onClick={() => onStoreClick?.(store.id)}
 t={t}
 />
 )}
 breakpoints={{
 640: { slidesPerView: 2.2 },
 768: { slidesPerView: 3.2 },
 1024: { slidesPerView: 7 },
 }}
 />
 </section>
 );
}
