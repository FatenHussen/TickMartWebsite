import { useCallback, useEffect, useState } from "react";
import type { PaymentMethodOption } from "@/features/cart/types";
import { useCheckoutStore } from "@/store/checkout";
import { PAYMENT_METHOD_STORAGE_KEY } from "../constants";

interface UsePaymentMethodPreferenceResult {
    selectedMethodId: string;
    defaultMethodId: string | undefined;
    selectMethod: (methodId: string) => void;
}

/**
 * Keeps account payment preference in sync with checkout store + localStorage,
 * and falls back to the first available method when the saved id is invalid.
 */
export function usePaymentMethodPreference(
    methods: PaymentMethodOption[],
): UsePaymentMethodPreferenceResult {
    const { paymentMethodId: checkoutPaymentMethodId, setPaymentMethodId } =
        useCheckoutStore();

    const [selectedMethodId, setSelectedMethodId] = useState(
        () =>
            checkoutPaymentMethodId ||
            localStorage.getItem(PAYMENT_METHOD_STORAGE_KEY) ||
            "",
    );

    useEffect(() => {
        if (methods.length === 0) {
            return;
        }

        const savedId = localStorage.getItem(PAYMENT_METHOD_STORAGE_KEY);
        const savedIdIsValid =
            Boolean(savedId) &&
            methods.some((method) => method.id === savedId);

        if (savedIdIsValid) {
            return;
        }

        const fallbackId = methods[0].id;
        setSelectedMethodId(fallbackId);
        setPaymentMethodId(fallbackId);
        localStorage.setItem(PAYMENT_METHOD_STORAGE_KEY, fallbackId);
    }, [methods, setPaymentMethodId]);

    const selectMethod = useCallback(
        (methodId: string) => {
            setSelectedMethodId(methodId);
            setPaymentMethodId(methodId);
            localStorage.setItem(PAYMENT_METHOD_STORAGE_KEY, methodId);
        },
        [setPaymentMethodId],
    );

    const defaultMethodId = methods[0]?.id;

    return {
        selectedMethodId,
        defaultMethodId,
        selectMethod,
    };
}
