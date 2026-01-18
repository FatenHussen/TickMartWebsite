import { Link } from "react-router-dom";
import { HiStar, HiShoppingBag, HiCube } from "react-icons/hi";

type BrandHeaderProps = {
  brand: {
    id: number | string;
    name: string;
    logo: string;
    rating: number;
    storeCount: number;
    productCount: number;
    description?: string;
  };
  onViewDetails?: () => void;
};

export default function BrandHeader({
  brand,
  onViewDetails,
}: BrandHeaderProps) {
  return (
    <div className="bg-blue-off/50 rounded-2xl border border-custom-secondary shadow-sm p-6">
      <div className="flex items-start justify-between gap-6">
        {/* Left: Logo and Brand Info */}
        <div className="flex items-start gap-4 flex-1">
          {/* Brand Logo */}
          <div className="w-16 h-16 rounded-lg bg-custom-primary border border-custom-secondary flex items-center justify-center shrink-0">
            <img
              src={brand.logo}
              alt={brand.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Brand Details */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-custom-primary mb-1">
              {brand.name}
            </h1>
            {brand.description && (
              <p className="text-sm text-custom-secondary mb-4">
                {brand.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 flex-wrap">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <HiStar className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-semibold text-custom-primary">
                  {brand.rating}
                </span>
              </div>

              {/* Store Count */}
              <div className="flex items-center gap-2">
                <HiShoppingBag className="w-5 h-5 text-custom-secondary" />
                <span className="text-sm text-custom-secondary">
                  {brand.storeCount}{" "}
                  {brand.storeCount === 1 ? "store" : "stores"}
                </span>
              </div>

              {/* Product Count */}
              <div className="flex items-center gap-2">
                <HiCube className="w-5 h-5 text-custom-secondary" />
                <span className="text-sm text-custom-secondary">
                  {brand.productCount.toLocaleString()} products
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: View Details Link */}
        <div className="shrink-0">
          <Link
            to={`/brand/${brand.id}`}
            onClick={onViewDetails}
            className="text-sm font-medium text-custom-accent hover:underline"
          >
            View brand details
          </Link>
        </div>
      </div>
    </div>
  );
}
