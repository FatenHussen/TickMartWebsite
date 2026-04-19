import { useCallback, useState } from "react";

export function useFaqPanelState(initialCategoryId = "orders") {
    const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);

    const toggleFaq = useCallback((id: number) => {
        setOpenFaqId((prev) => (prev === id ? null : id));
    }, []);

    return {
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
        openFaqId,
        toggleFaq,
    };
}
