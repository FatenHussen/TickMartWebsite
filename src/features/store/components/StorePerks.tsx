import StoreBadge, { type BadgeVariant } from"./StoreBadge";

type StorePerksProps = {
 perks: Array<{ label: string; variant?: BadgeVariant }>;
};

export default function StorePerks({ perks }: StorePerksProps) {
 return (
 <div className="flex flex-wrap items-center gap-2">
 {perks.map((perk) => (
 <StoreBadge key={perk.label} {...perk} />
 ))}
 </div>
 );
}

