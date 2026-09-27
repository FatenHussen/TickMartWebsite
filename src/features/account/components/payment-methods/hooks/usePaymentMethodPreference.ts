import { useCallback, useEffect, useState } from "react";
import type { PaymentMethodOption } from "@/features/cart/types";
import {
    isPaymentMethodEnabled,
    resolveSelectablePaymentMethodId,
} from "@/features/cart/utils/paymentMethods";
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
        const nextId = resolveSelectablePaymentMethodId(methods, savedId);

        if (!nextId || nextId === savedId) {
            return;
        }

        setSelectedMethodId(nextId);
        setPaymentMethodId(nextId);
        localStorage.setItem(PAYMENT_METHOD_STORAGE_KEY, nextId);
    }, [methods, setPaymentMethodId]);

    const selectMethod = useCallback(
        (methodId: string) => {
            const method = methods.find((item) => item.id === methodId);
            if (!method || !isPaymentMethodEnabled(method)) return;

            setSelectedMethodId(methodId);
            setPaymentMethodId(methodId);
            localStorage.setItem(PAYMENT_METHOD_STORAGE_KEY, methodId);
        },
        [methods, setPaymentMethodId],
    );

    const defaultMethodId = resolveSelectablePaymentMethodId(methods) || methods[0]?.id;

    return {
        selectedMethodId,
        defaultMethodId,
        selectMethod,
    };
}
