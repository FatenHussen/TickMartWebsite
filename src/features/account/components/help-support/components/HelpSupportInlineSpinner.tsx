import { PremiumInlineLoader } from "@/shared/component/loading";

export function HelpSupportInlineSpinner() {
    return (
        <div className="flex justify-center py-12">
            <PremiumInlineLoader size="md" />
        </div>
    );
}
