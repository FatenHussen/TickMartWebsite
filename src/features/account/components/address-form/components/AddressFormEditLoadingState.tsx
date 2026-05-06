import { PremiumInlineLoader } from "@/shared/component/loading";

export function AddressFormEditLoadingState() {
    return (
        <div className="flex items-center justify-center py-12">
            <PremiumInlineLoader size="sm" />
        </div>
    );
}
