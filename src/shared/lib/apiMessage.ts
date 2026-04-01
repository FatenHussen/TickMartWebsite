type ApiPayload = {
    message?: string;
    error?: string;
    success?: boolean;
    status?: boolean;
    data?: {
        message?: string;
        error?: string;
        errors?: Record<string, string[] | string>;
    } | Record<string, unknown>;
    errors?: Record<string, string[] | string>;
    [key: string]: unknown;
};

type ApiLikeError = {
    message?: string;
    __toastHandled?: boolean;
    response?: {
        data?: ApiPayload;
        status?: number;
    };
};

type ApiMessageContainer = {
    message?: string;
    error?: string;
    errors?: Record<string, string[] | string>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function getMessageContainer(value: unknown): ApiMessageContainer | undefined {
    if (!isRecord(value)) return undefined;

    const message = typeof value.message === "string" ? value.message : undefined;
    const error = typeof value.error === "string" ? value.error : undefined;
    const errors = isRecord(value.errors)
        ? (value.errors as Record<string, string[] | string>)
        : undefined;

    if (!message && !error && !errors) return undefined;

    return { message, error, errors };
}

function getFirstErrorFromBag(
    errors?: Record<string, string[] | string>,
): string | undefined {
    if (!errors) return undefined;

    for (const value of Object.values(errors)) {
        if (Array.isArray(value) && value.length > 0) {
            return value[0];
        }

        if (typeof value === "string" && value.trim()) {
            return value;
        }
    }

    return undefined;
}

export function getApiSuccessMessage(
    payload: unknown,
    fallback?: string,
): string {
    const apiPayload = payload as ApiPayload | undefined;
    const nestedData = getMessageContainer(apiPayload?.data);

    return (
        apiPayload?.message ||
        apiPayload?.error ||
        nestedData?.message ||
        nestedData?.error ||
        getFirstErrorFromBag(apiPayload?.errors) ||
        getFirstErrorFromBag(nestedData?.errors) ||
        fallback ||
        "Operation completed successfully."
    );
}

export function getApiErrorMessage(
    error: unknown,
    fallback?: string,
): string {
    const apiError = error as ApiLikeError;
    const nestedData = getMessageContainer(apiError?.response?.data?.data);

    return (
        apiError?.response?.data?.message ||
        apiError?.response?.data?.error ||
        nestedData?.message ||
        nestedData?.error ||
        getFirstErrorFromBag(apiError?.response?.data?.errors) ||
        getFirstErrorFromBag(nestedData?.errors) ||
        apiError?.message ||
        fallback ||
        "Something went wrong."
    );
}

export function isApiToastHandled(error: unknown): boolean {
    return Boolean((error as ApiLikeError | undefined)?.__toastHandled);
}
