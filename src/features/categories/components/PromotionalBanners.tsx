
type PromotionalBanner = {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  gradientColors: {
    from: string;
    to: string;
  };
  buttonColor: string;
  buttonHoverColor?: string;
};

type PromotionalBannersProps = {
  banners?: PromotionalBanner[];
  onBannerClick?: (bannerId: number) => void;
};

const defaultBanners: PromotionalBanner[] = [
  {
    id: 1,
    title: "Healthy Fruits",
    subtitle: "Fresh & Nutritious",
    buttonText: "Shop now",
    gradientColors: {
      from: "#22c55e",
      to: "#16a34a",
    },
    buttonColor: "green-600",
    buttonHoverColor: "green-50",
  },
  {
    id: 2,
    title: "Today's Deal",
    subtitle: "Up to 30% Off",
    buttonText: "Shop now",
    gradientColors: {
      from: "#f97316",
      to: "#ef4444",
    },
    buttonColor: "orange-600",
    buttonHoverColor: "orange-50",
  },
];

export default function PromotionalBanners({
  banners = defaultBanners,
  onBannerClick,
}: PromotionalBannersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {banners.map((banner) => (
        <div
          key={banner.id}
          className="rounded-2xl p-8 text-white"
          style={{
            background: `linear-gradient(to right, ${banner.gradientColors.from}, ${banner.gradientColors.to})`,
          }}
        >
          <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
          <p className="text-white/90 mb-4">{banner.subtitle}</p>
          <button
            onClick={() => onBannerClick?.(banner.id)}
            className="bg-white px-6 py-2 rounded-lg font-semibold transition-colors hover:opacity-90"
            style={{
              color:
                banner.buttonColor === "green-600"
                  ? "#16a34a"
                  : banner.buttonColor === "orange-600"
                    ? "#ea580c"
                    : "#000000",
            }}
          >
            {banner.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}

