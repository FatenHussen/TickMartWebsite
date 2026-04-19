import { useQuery } from"@tanstack/react-query";

function normalizePaymentMethod(
 name?: string | null
):"cash_on_delivery"|"credit_card"|"paypal"{
 if (!name) return"cash_on_delivery";
 const lower = name.toLowerCase();
 if (lower.includes("cash") && lower.includes("delivery")) return"cash_on_delivery";
 if (lower.includes("card") || lower.includes("credit")) return"credit_card";
 if (lower.includes("paypal")) return"paypal";
 return"cash_on_delivery";
}

function getPaymentDescription(name?: string | null): string {
 if (!name) return"Pay to courier on arrival";
 const lower = name.toLowerCase();
 if (lower.includes("cash") && lower.includes("delivery"))
 return"Pay to courier on arrival";
 return"Pay securely with your card";
}
import { useNavigate, useParams } from"react-router-dom";
import { queryKeys } from"@/utils/queryKeys";
import { useCurrency } from"@/context/CurrencyContext";
import { _TrackOrderApi } from"@/features/trackOrder/api/trackOrderApi";
import type { TrackOrderApiData } from"@/features/trackOrder/types";
import type { OrderDetails, CartItem, OrderStatusStep } from"../types";
import { paths } from"@/app/routes/path/paths";

function mapApiToOrderDetails(
 raw: TrackOrderApiData,
 formatPrice: (amount: number) => string
): OrderDetails {
 const shopEntries = Object.values(raw.items ?? {});
 const cartItems: CartItem[] = shopEntries.flatMap((shop) =>
 (shop?.items ?? []).map((item) => ({
 id: item.id,
 name: item.product_name,
 category: shop.shop,
 store: shop.shop,
 size:"",
 type:"",
 image:"",
 price: formatPrice(item.price),
 quantity: item.quantity,
 subtotal: formatPrice(item.price * item.quantity),
 storeId: shop.shop,
 hasFreeDelivery: false,
 }))
 );

 const addr = raw.user_address;
 const areaName = typeof addr.area ==="object"&& addr.area !== null
 ? (addr.area as { en?: string; ar?: string }).en ?? (addr.area as { en?: string; ar?: string }).ar ?? String(addr.area)
 : String(addr.area ??"");
 const addressParts = [
 addr.street_name,
 addr.building_number,
 addr.floor_apartment,
 addr.nearest_landmark,
 areaName,
 ].filter(Boolean);

 const deliveryIsFree = raw.delivery_price === 0;
 const status = raw.status as OrderStatusStep;
 const eta = raw.driver?.eta ??"—";

 return {
 id: raw.id,
 orderNumber: raw.order_code ??"",
 status,
 items: cartItems,
 priceSummary: {
 numOfItems: raw.total_quantity,
 subtotal: formatPrice(raw.subtotal),
 shipping: deliveryIsFree ?"Free": formatPrice(raw.delivery_price),
 shippingIsFree: deliveryIsFree,
 storeDiscounts: raw.basket_discount != null && raw.basket_discount > 0
 ? `-${formatPrice(raw.basket_discount)}`
 : formatPrice(0),
 tax:"10%",
 couponDiscount: raw.coupon_discount != null && raw.coupon_discount > 0
 ? `-${formatPrice(raw.coupon_discount)}`
 : formatPrice(0),
 total: formatPrice(raw.total),
 },
 delivery: {
 fullName: raw.user.name,
 phoneNumber: raw.user.phone ?? addr.contact_phone,
 address: addressParts.join(","),
 eta,
 },
 payment: {
 method: normalizePaymentMethod(raw.payment_method?.name),
 name: raw.payment_method?.name ??"Cash on Delivery",
 description: getPaymentDescription(raw.payment_method?.name),
 },
 };
}

export function useOrderDetails() {
 const { orderId } = useParams<{ orderId: string }>();
 const navigate = useNavigate();
 const { formatPrice } = useCurrency();

 const { data: rawData, isLoading, error } = useQuery({
 queryKey: queryKeys.orders.details(orderId ??""),
 queryFn: () => _TrackOrderApi.getOrderById(orderId!),
 enabled: orderId != null && orderId !=="",
 staleTime: 1000 * 60,
 });
 console.log("data", rawData);
 

 const order: OrderDetails | null = rawData
 ? mapApiToOrderDetails(rawData, formatPrice)
 : null;

 const trackOnMap = () => {
 if (orderId)
 navigate(paths.client.trackOrder.replace(":orderId", orderId));
 };

 return {
 order,
 orderId: orderId ?? null,
 isLoading,
 error: error as Error | null,
 trackOnMap,
 };
}
