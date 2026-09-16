import { Clock, CreditCard, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useAddresses } from "@/features/account/hooks/useAddress";
import { usePaymentMethods } from "@/features/cart/hooks/usePaymentMethods";
import type { CustomOrderRequest } from "../types";
import {
  formatCustomOrderAddress,
  formatCustomOrderDate,
} from "../utils/customOrderHelpers";

type CustomOrderRequestMetaProps = {
  request: CustomOrderRequest;
};

export default function CustomOrderRequestMeta({
  request,
}: CustomOrderRequestMetaProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: addresses = [] } = useAddresses();
  const { methods } = usePaymentMethods();

  const nestedAddress = formatCustomOrderAddress(request.address, language);
  const fallbackAddress = addresses.find((addr) => addr.id === request.address_id);
  const addressLabel =
    nestedAddress ||
    formatCustomOrderAddress(fallbackAddress, language) ||
    fallbackAddress?.label;

  const paymentName =
    request.payment_method?.name ||
    request.payment_method?.title ||
    methods.find(
      (method) =>
        String(method.id) === String(request.payment_method_id ?? "")
    )?.name;

  const expected = formatCustomOrderDate(request.expected_at, language);

  if (!addressLabel && !paymentName && !expected) return null;

  return (
    <section className="mb-6 rounded-2xl border border-custom-primary/12 bg-custom-card p-5">
      <ul className="space-y-3 text-sm">
        {addressLabel && (
          <li className="flex items-start gap-2.5 text-custom-primary">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-main)]" aria-hidden />
            <span>
              <span className="block text-xs font-medium text-custom-secondary">
                {t("checkout.deliveryAddress")}
              </span>
              {addressLabel}
            </span>
          </li>
        )}
        {paymentName && (
          <li className="flex items-start gap-2.5 text-custom-primary">
            <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-main)]" aria-hidden />
            <span>
              <span className="block text-xs font-medium text-custom-secondary">
                {t("checkout.paymentMethod")}
              </span>
              {paymentName}
              <span className="mt-0.5 block text-xs text-custom-secondary">
                {t("customOrder.paymentIntentNote")}
              </span>
            </span>
          </li>
        )}
        {expected && (
          <li className="flex items-start gap-2.5 text-custom-primary">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-main)]" aria-hidden />
            <span>
              <span className="block text-xs font-medium text-custom-secondary">
                {t("customOrder.expectedAt")}
              </span>
              {expected}
            </span>
          </li>
        )}
      </ul>
    </section>
  );
}
