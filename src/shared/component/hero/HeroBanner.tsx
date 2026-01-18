import Button from "@/shared/ui/Button";

type HeroBannerProps = {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  image: string;
  imagePosition?: "left" | "right" | "center";
  onButtonClick?: () => void;
  className?: string;
};

export default function HeroBanner({
  title,
  subtitle,
  description,
  buttonText = "Shop Now",
  image,
  imagePosition = "right",
  onButtonClick,
  className,
}: HeroBannerProps) {
  const imageOrder = {
    left: "order-1",
    right: "order-2",
    center: "order-1",
  };

  const contentOrder = {
    left: "order-2",
    right: "order-1",
    center: "order-2",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className || ""}`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-8 md:p-12">
        {/* Text Content */}
        <div className={`flex flex-col justify-center gap-4 ${contentOrder[imagePosition]}`}>
          {subtitle && (
            <p className="text-lg text-white/90 font-medium">{subtitle}</p>
          )}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {title}
          </h2>
          {description && (
            <p className="text-base text-white/90">{description}</p>
          )}
          <div>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onButtonClick}
              className="bg-custom-secondary text-custom-primary hover:opacity-90 font-semibold"
            >
              {buttonText}
            </Button>
          </div>
        </div>

        {/* Image/Illustration */}
        {imagePosition !== "center" && (
          <div className={`flex items-center justify-center ${imageOrder[imagePosition]}`}>
            <img
              src={image}
              alt={title}
              className="h-auto max-h-96 w-full object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}

