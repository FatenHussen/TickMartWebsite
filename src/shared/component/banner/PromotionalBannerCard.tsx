import { useNavigate } from "react-router-dom";
import Button from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";
import type { SectionItemBase } from "@/features/home/types";

type PromotionalBannerCardProps = {
  item: SectionItemBase;
  link?: string;
  onClick?: () => void;
  className?: string;
};

export default function PromotionalBannerCard({
  item,
  link,
  onClick,
  className,
}: PromotionalBannerCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      navigate(link);
    }
  };

  const title = item.title || "";
  const description = item.desc || "";
  const image = item.image || "";
  const buttonText = "Shop Now";

  return (
    <div
      className={cn(
        "relative overflow-hidden cursor-pointer transition-shadow hover:shadow-xl w-full rounded-2xl",
        className,
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
      style={{
        background: "linear-gradient(135deg, #E8DFD0 0%, #D4C9B8 100%)",
      }}
    >
      {/* Large Overlay Text - Semi-transparent (Fashion / Sale) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <span
          className="absolute text-[120px] md:text-[180px] lg:text-[220px] font-bold italic tracking-wider opacity-[0.08] whitespace-nowrap"
          style={{
            top: "5%",
            right: "-5%",
            color: "#8B7355",
            transform: "rotate(-5deg)",
          }}
        >
          Fashion
        </span>
        <span
          className="absolute text-[100px] md:text-[150px] lg:text-[180px] font-bold italic tracking-wider opacity-[0.08] whitespace-nowrap"
          style={{
            bottom: "10%",
            right: "10%",
            color: "#8B7355",
            transform: "rotate(-5deg)",
          }}
        >
          Sale
        </span>
      </div>

      {/* Content Container */}
      <div className="relative z-10 py-10 md:py-14 lg:py-16 px-6 md:px-8 lg:px-12">
        <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2 items-center">
          {/* Left Side - Text Content */}
          <div className="flex flex-col justify-center gap-3 md:gap-4">
            <h2 className="text-2xl font-bold text-slate-800 md:text-3xl lg:text-4xl">
              {title || "Spring Collection 2024"}
            </h2>
            {description && (
              <p className="text-sm text-slate-600 md:text-base lg:text-lg max-w-sm">
                {description}
              </p>
            )}
            <div className="mt-3">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-md hover:bg-gray-50 transition-all hover:shadow-lg border border-gray-200"
              >
                {buttonText}
              </Button>
            </div>
          </div>

          {/* Right Side - Illustration Image */}
          <div className="flex items-center justify-center md:justify-end">
            {image ? (
              <img
                src={image}
                alt={title}
                className="h-auto max-h-[280px] md:max-h-80 lg:max-h-[380px] w-full object-contain drop-shadow-lg"
                loading="lazy"
              />
            ) : (
              <div className="h-56 w-full max-w-sm rounded-lg bg-white/20 md:h-72" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
