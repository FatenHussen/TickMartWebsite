import axios from "axios";

export type NotFoundResult = { kind: "not-found" };

export function isNotFoundResult(value: unknown): value is NotFoundResult {
    return (
        typeof value === "object" &&
        value !== null &&
        "kind" in value &&
        (value as NotFoundResult).kind === "not-found"
    );
}

/** A hidden category or product is `404`. Store that as data so a previous payload is not kept. */
export async function valueOrNotFound<T>(work: () => Promise<T>): Promise<T | NotFoundResult> {
    try {
        return await work();
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return { kind: "not-found" };
        }
        throw error;
    }
}
