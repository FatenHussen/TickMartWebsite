import StoreBadge, { type BadgeVariant } from"./StoreBadge";

type StoreHeroProps = {
 heroImage: string | null;
 storeName: string;
 tags: Array<{ label: string; variant?: BadgeVariant }>;
};

export default function StoreHero({
 heroImage,
 storeName,
 tags,
}: StoreHeroProps) {
 const initials = storeName
 .split(" ")
 .map((word) => word[0])
 .join("")
 .slice(0, 2)
 .toUpperCase();

 return (
 <div className="relative h-[220px] md:h-[260px]">
 {heroImage ? (
 <img
 src={heroImage}
 alt={storeName}
 className="h-full w-full object-cover"
 />
 ) : (
 <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-primary-light/35 via-primary-light/15 to-primary/25">
 <span className="text-5xl font-black tracking-widest text-custom-primary/30 md:text-6xl">
 {initials}
 </span>
 </div>
 )}
 <div className="absolute inset-0 bg-linear-to-r from-white/70 via-white/30 to-white/10"/>
 <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
 {tags.map((tag) => (
 <StoreBadge key={tag.label} {...tag} />
 ))}
 </div>
 </div>
 );
}

