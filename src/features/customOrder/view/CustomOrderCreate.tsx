import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Zap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { paths } from "@/app/routes/path/paths";
import Button from "@/shared/ui/Button";
import { getApiErrorMessage, getApiSuccessMessage } from "@/shared/lib/apiMessage";
import { useAddresses } from "@/features/account/hooks/useAddress";
import CheckoutAddressSection from "@/features/cart/components/CheckoutAddressSection";
import CheckoutPaymentSection from "@/features/cart/components/CheckoutPaymentSection";
import { usePaymentMethods } from "@/features/cart/hooks/usePaymentMethods";
import type { DeliveryAddress } from "@/features/cart/types";
import type { Address } from "@/features/account/types";
import { useCreateCustomOrder } from "../hooks/useCustomOrders";
import CustomOrderImagePicker from "../components/CustomOrderImagePicker";
import {
  MIN_CUSTOM_ORDER_DESCRIPTION,
} from "../utils/customOrderHelpers";

const PAYMENT_STORAGE_KEY = "tikmool_payment_method_id";

function mapAddressToDeliveryAddress(addr: Address): DeliveryAddress {
  const parts = [
    addr.street_name,
    addr.building_number,
    addr.floor_apartment,
    addr.nearest_landmark,
  ].filter(Boolean);

  let areaName: string | undefined;
  if (addr.area?.name) {
    if (typeof addr.area.name === "string") {
      areaName = addr.area.name;
    } else {
      areaName = addr.area.name.en || addr.area.name.ar;
    }
  }

  return {
    id: addr.id,
    fullName: addr.label,
    phoneNumber: addr.contact_phone,
    address: [...parts, areaName].filter(Boolean).join(","),
    tags: [addr.label, addr.is_default ? "Default" : null].filter(
      (x): x is string => x != null
    ),
    isDefault: addr.is_default,
  };
}

export default function CustomOrderCreate() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const createMutation = useCreateCustomOrder();

  const { data: addressesData = [] } = useAddresses();
  const { methods: paymentMethods } = usePaymentMethods();

  const addresses = useMemo(
    () => addressesData.map(mapAddressToDeliveryAddress),
    [addressesData]
  );

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
  const [addressId, setAddressId] = useState<number | string>("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [description, setDescription] = useState("");
  const [expectedAt, setExpectedAt] = useState("");
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (!addressId && defaultAddress) {
      setAddressId(defaultAddress.id);
    }
  }, [addressId, defaultAddress]);

  useEffect(() => {
    if (paymentMethodId) return;
    const stored = localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (stored && paymentMethods.some((m) => m.id === stored)) {
      setPaymentMethodId(stored);
      return;
    }
    if (paymentMethods[0]) {
      setPaymentMethodId(paymentMethods[0].id);
    }
  }, [paymentMethodId, paymentMethods]);

  const trimmedDescription = description.trim();
  const descriptionValid = trimmedDescription.length >= MIN_CUSTOM_ORDER_DESCRIPTION;
  const canSubmit =
    descriptionValid && Boolean(addressId) && !createMutation.isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!descriptionValid) {
      toast.error(
        t("customOrder.descriptionMin", { min: MIN_CUSTOM_ORDER_DESCRIPTION })
      );
      return;
    }
    if (!addressId) {
      toast.error(t("customOrder.addressRequired"));
      return;
    }

    createMutation.mutate(
      {
        description: trimmedDescription,
        address_id: addressId,
        payment_method_id: paymentMethodId || null,
        expected_at: expectedAt ? new Date(expectedAt).toISOString() : null,
        images,
      },
      {
        onSuccess: (res) => {
          toast.success(
            getApiSuccessMessage(res, t("customOrder.createSuccess"))
          );
          if (paymentMethodId) {
            localStorage.setItem(PAYMENT_STORAGE_KEY, paymentMethodId);
          }
          navigate(paths.client.customOrderDetails(res.data.id));
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, t("customOrder.createFailed")));
        },
      }
    );
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-custom-primary sm:text-3xl">
          <Zap className="h-7 w-7 text-primary" aria-hidden />
          {t("customOrder.newRequest")}
        </h1>
        <p className="mt-1 text-sm text-custom-secondary">{t("customOrder.createDescription")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <label
            htmlFor="custom-order-description"
            className="mb-1.5 block text-sm font-medium text-custom-primary"
          >
            {t("customOrder.description")}{" "}
            <span className="text-[var(--color-ui-red-500)]">*</span>
          </label>
          <textarea
            id="custom-order-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={MIN_CUSTOM_ORDER_DESCRIPTION}
            rows={5}
            placeholder={t("customOrder.descriptionPlaceholder")}
            className="w-full resize-y rounded-xl border border-custom-primary/20 bg-custom-card px-4 py-3 text-sm text-custom-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <p
            className={`mt-1 text-xs ${
              descriptionValid ? "text-custom-secondary" : "text-[var(--color-ui-red-500)]"
            }`}
          >
            {t("customOrder.descriptionMin", { min: MIN_CUSTOM_ORDER_DESCRIPTION })}{" "}
            ({trimmedDescription.length})
          </p>
        </section>

        <CustomOrderImagePicker files={images} onChange={setImages} />

        <CheckoutAddressSection
          addresses={addresses}
          selectedAddressId={addressId}
          onAddressSelect={setAddressId}
          onAddNewAddress={() => navigate(paths.account.addAddress)}
        />

        {paymentMethods.length > 0 && (
          <div>
            <CheckoutPaymentSection
              paymentMethods={paymentMethods}
              selectedPaymentMethodId={paymentMethodId}
              onPaymentMethodSelect={setPaymentMethodId}
            />
            <p className="mt-2 text-xs text-custom-secondary">
              {t("customOrder.paymentIntentNote")}
            </p>
          </div>
        )}

        <section>
          <label
            htmlFor="custom-order-expected-at"
            className="mb-1.5 block text-sm font-medium text-custom-primary"
          >
            {t("customOrder.expectedAt")}{" "}
            <span className="text-xs font-normal text-custom-secondary">
              ({t("customOrder.optional")})
            </span>
          </label>
          <input
            id="custom-order-expected-at"
            type="datetime-local"
            value={expectedAt}
            onChange={(e) => setExpectedAt(e.target.value)}
            className="w-full rounded-xl border border-custom-primary/20 bg-custom-card px-4 py-3 text-sm text-custom-primary outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:max-w-xs"
          />
        </section>

        <div className="flex flex-wrap gap-3 border-t border-custom-primary/10 pt-6">
          <Button
            type="submit"
            variant="primary"
            isLoading={createMutation.isPending}
            disabled={!canSubmit}
            className="min-h-11 rounded-xl px-6"
          >
            {t("customOrder.submit")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(paths.client.customOrders)}
            className="min-h-11 rounded-xl px-6"
          >
            {t("common.cancel", "Cancel")}
          </Button>
        </div>
      </form>
    </div>
  );
}
