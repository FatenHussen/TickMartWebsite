import { useQuery } from"@tanstack/react-query";
import { queryKeys } from"@/utils/queryKeys";
import { useCurrency } from"@/context/CurrencyContext";
import { _TrackOrderApi } from"../api/trackOrderApi";
import type {
 TrackOrderData,
 TrackOrderApiData,
 TrackOrderStatus,
 Driver,
 OrderItem,
} from"../types";

function mapApiToTrackOrder(
 raw: TrackOrderApiData,
 formatPrice: (amount: number) => string
): TrackOrderData {
 const shopEntries = Object.values(raw.items ?? {});
 const storeName = shopEntries.map((s) => s?.shop).filter(Boolean).join(",");

 const items: OrderItem[] = shopEntries.flatMap((shop) =>
 (shop?.items ?? []).map((item) => ({
 id: item.id,
 name: item.product_name,
 quantity: item.quantity,
 price: formatPrice(item.price),
 }))
 );

 let driver: Driver | undefined;
 if (raw.driver) {
 driver = {
 name: raw.driver.name,
 image: raw.driver.image,
 vehicleType: raw.driver.vehicle_type,
 phoneNumber: raw.driver.phone_number,
 vehicle: raw.driver.vehicle,
 plateNumber: raw.driver.plate_number,
 location: { lat: raw.driver.lat, lng: raw.driver.lng },
 eta: raw.driver.eta,
 };
 }

 const addr = raw.user_address;
 const addressParts = [
 addr.street_name,
 addr.building_number,
 addr.floor_apartment,
 addr.nearest_landmark,
 addr.area,
 ].filter(Boolean);

 const deliveryIsFree = raw.delivery_price === 0;
  const basketDiscount = Number(raw.basket_discount ?? 0);
  const couponDiscount = Number(raw.coupon_discount ?? 0);

 return {
 orderNumber: raw.order_code ?? String(raw.id),
 status: raw.status as TrackOrderStatus,
 store: storeName,
 items,
    totalQuantity: raw.total_quantity,
 paymentMethod: raw.payment_method?.name ??"",
 itemsSubtotal: formatPrice(raw.subtotal),
    ...(basketDiscount > 0 && { basketDiscount: `-${formatPrice(basketDiscount)}` }),
    ...(couponDiscount > 0 && { couponDiscount: `-${formatPrice(couponDiscount)}` }),
 deliveryFee: deliveryIsFree ?"Free delivery": formatPrice(raw.delivery_price),
 deliveryIsFree,
 totalAmount: formatPrice(raw.total),
 driver,
 destination: {
 lat: addr.lat,
 lng: addr.lng,
 address: addressParts.join(","),
 },
 eta: driver?.eta ??"",
 };
}

export function useTrackOrder(orderId: number | string | null) {
 const { formatPrice } = useCurrency();

 const { data: rawData, isLoading, error } = useQuery({
 queryKey: queryKeys.orders.details(orderId ?? 0),
 queryFn: () => _TrackOrderApi.getOrderById(orderId!),
 enabled: orderId != null && orderId !=="",
 staleTime: 1000 * 60,
 });

 const data = rawData ? mapApiToTrackOrder(rawData, formatPrice) : undefined;

 return { data, isLoading, error: error as Error | null };
}
