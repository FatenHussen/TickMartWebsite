import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/shared/lib/utils";
import type { PaymentMethodOption } from "../types";

import mtn from "/images/checkout/mtn.png";
import syriatel from "/images/checkout/syriatel.png";
import cash from "/images/checkout/cash.png";

type CheckoutPaymentSectionProps = {
  paymentMethods: PaymentMethodOption[];
  selectedPaymentMethodId: string;
  onPaymentMethodSelect: (methodId: string) => void;
};

// Payment method icons as SVG components
// const CashOnDeliveryIcon = () => (
//   <svg
//     width="60"
//     height="40"
//     viewBox="0 0 60 40"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     {/* Delivery truck */}
//     <rect
//       x="5"
//       y="12"
//       width="30"
//       height="20"
//       rx="2"
//       fill="#E8F4FD"
//       stroke="#4DA6FF"
//       strokeWidth="1.5"
//     />
//     <rect
//       x="35"
//       y="18"
//       width="18"
//       height="14"
//       rx="2"
//       fill="#E8F4FD"
//       stroke="#4DA6FF"
//       strokeWidth="1.5"
//     />
//     <circle cx="15" cy="34" r="4" fill="#4DA6FF" />
//     <circle cx="45" cy="34" r="4" fill="#4DA6FF" />
//     <rect
//       x="38"
//       y="22"
//       width="8"
//       height="6"
//       rx="1"
//       fill="#4DA6FF"
//       fillOpacity="0.3"
//     />
//     {/* Dollar sign */}
//     <text x="20" y="26" fontSize="12" fontWeight="bold" fill="#4DA6FF">
//       $
//     </text>
//   </svg>
// );

// const SyriatelCashIcon = () => (
//   <svg
//     width="60"
//     height="40"
//     viewBox="0 0 60 40"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     {/* Syriatel style icon - red themed */}
//     <rect
//       x="8"
//       y="8"
//       width="44"
//       height="24"
//       rx="4"
//       fill="#FEE2E2"
//       stroke="#EF4444"
//       strokeWidth="1.5"
//     />
//     <text x="16" y="24" fontSize="10" fontWeight="bold" fill="#EF4444">
//       سيريتل
//     </text>
//   </svg>
// );

// const MTNCashIcon = () => (
//   <svg
//     width="60"
//     height="40"
//     viewBox="0 0 60 40"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     {/* MTN style icon - yellow themed */}
//     <rect
//       x="8"
//       y="8"
//       width="44"
//       height="24"
//       rx="4"
//       fill="#FEF3C7"
//       stroke="#F59E0B"
//       strokeWidth="1.5"
//     />
//     <text x="18" y="24" fontSize="11" fontWeight="bold" fill="#F59E0B">
//       MTN
//     </text>
//   </svg>
// );

const getPaymentIcon = (type: PaymentMethodOption["type"]) => {
  switch (type) {
    case "cash_on_delivery":
      return cash;
    case "syriatel_cash":
      return syriatel;
    case "mtn_cash":
      return mtn;
    default:
      return cash;
  }
};

export default function CheckoutPaymentSection({
  paymentMethods,
  selectedPaymentMethodId,
  onPaymentMethodSelect,
}: CheckoutPaymentSectionProps) {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className="mb-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <h2 className="text-lg font-bold mb-4 text-custom-primary">
        {t("checkout.paymentMethod")}
      </h2>

      {/* Credit Card Illustration */}
      <div className="flex justify-start mb-6">
        <div className="relative w-72 h-48">
          {/* Yellow circle - top right */}
          <div className="absolute -top-4 right-0 w-32 h-32 rounded-full bg-secondary"></div>

          {/* Blue circle - bottom left */}
          <div className="absolute bottom-0 -left-4 w-24 h-24 rounded-full bg-primary-light"></div>

          {/* Credit Card */}
          <div className="absolute top-8 left-4 w-56 h-36 rounded-2xl bg-gradient-to-br from-white/90 to-secondary/40 backdrop-blur-sm shadow-lg border border-white/50 p-4">
            {/* Card header with Maestro logo */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                {/* Maestro circles */}
                <div className="flex">
                  <div className="w-5 h-5 rounded-full bg-red-500"></div>
                  <div className="w-5 h-5 rounded-full bg-blue-600 -ml-2"></div>
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  Meastro
                </span>
              </div>
              {/* Contactless icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
              >
                <path
                  d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6"
                  strokeLinecap="round"
                />
                <path d="M14.5 18.5a5.5 5.5 0 000-11" strokeLinecap="round" />
              </svg>
            </div>

            {/* Card holder name */}
            <div className="mb-1">
              <p className="text-xs text-gray-500">Florian Kuiper</p>
            </div>

            {/* Card number */}
            <div className="mb-3">
              <p className="text-sm font-bold text-gray-700 tracking-wide">
                2453-2138-9372-4375
              </p>
            </div>

            {/* Expiry date */}
            <div>
              <p className="text-[10px] text-gray-400">Geldig tot</p>
              <p className="text-xs font-bold text-gray-700">12-2023</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Options - Horizontal cards */}
      <div className="grid grid-cols-3 gap-3">
        {paymentMethods.map((method) => {
          const isSelected = method.id === selectedPaymentMethodId;
          const IconComponent = getPaymentIcon(method.type);

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onPaymentMethodSelect(method.id)}
              className={cn(
                "flex flex-col items-center p-4 rounded-xl border-2 transition-all text-center",
                isSelected
                  ? "border-primary-light bg-blue-off"
                  : "border-gray-200 bg-white hover:border-primary-light/50",
              )}
            >
              {/* Icon */}
              <div className="mb-3">
                {/* <IconComponent /> */}
                <img src={IconComponent} alt="" />
              </div>
              {/* Name */}
              <div className="font-semibold text-sm text-custom-primary mb-1">
                {method.name}
              </div>
              {/* Description */}
              <div className="text-xs text-custom-secondary">
                {method.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
