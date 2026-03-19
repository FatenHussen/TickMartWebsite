import StoreBadge, { type BadgeVariant } from"./StoreBadge";

type StoreHeroProps = {
 heroImage: string;
 storeName: string;
 tags: Array<{ label: string; variant?: BadgeVariant }>;
};

export default function StoreHero({
 heroImage,
 storeName,
 tags,
}: StoreHeroProps) {
 return (
 <div className="relative h-[220px] md:h-[260px]">
 <img
 src={heroImage}
 alt={storeName}
 className="h-full w-full object-cover"
 />
 <div className="absolute inset-0 bg-linear-to-r from-white/70 via-white/30 to-white/10"/>
 <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
 {tags.map((tag) => (
 <StoreBadge key={tag.label} {...tag} />
 ))}
 </div>
 </div>
 );
}

