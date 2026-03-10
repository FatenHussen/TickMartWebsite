import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HiStar, HiPlus, HiInformationCircle } from "react-icons/hi";
import { cn } from "@/shared/lib/utils";
import BasePopup from "@/shared/component/BasePopup";
import Button from "@/shared/ui/Button";
import { useCreateRating, useUpdateRating } from "../hooks/useRatings";

const MAX_IMAGE_SIZE_MB = 2;
const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const MAX_COMMENT_LENGTH = 500;

export type RatingFormModalMode = "create" | "edit";

type RatingFormValues = {
  rating: number;
  comment: string;
};

type RatingFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  mode: RatingFormModalMode;
  /** For create: type and id of entity being rated */
  rateableType?: string;
  rateableId?: number;
  orderId?: number;
  /** For edit: existing rating id and initial values */
  ratingId?: number;
  initialRating?: number;
  initialComment?: string;
  initialImageUrl?: string | null;
  /** Optional product info for display in the modal */
  productName?: string;
  productImageUrl?: string | null;
  productAttributes?: string;
};

export default function RatingFormModal({
  isOpen,
  onClose,
  onSuccess,
  mode,
  rateableType,
  rateableId,
  orderId,
  ratingId,
  initialRating = 5,
  initialComment = "",
  initialImageUrl,
  productName,
  productImageUrl,
  productAttributes,
}: RatingFormModalProps) {
  const { t } = useTranslation();
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createRating = useCreateRating();
  const updateRating = useUpdateRating();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<RatingFormValues>({
    defaultValues: {
      rating: initialRating,
      comment: initialComment,
    },
  });

  const commentValue = watch("comment", initialComment);
  const commentLength = (commentValue ?? "").length;

  useEffect(() => {
    if (isOpen) {
      setSelectedRating(initialRating);
      setValue("rating", initialRating);
      setValue("comment", initialComment);
      setImagePreview(mode === "edit" ? initialImageUrl ?? null : null);
      setImageFile(null);
    }
  }, [isOpen, mode, initialRating, initialComment, initialImageUrl, setValue]);

  const handleClose = () => {
    setSelectedRating(5);
    setImageFile(null);
    setImagePreview(initialImageUrl ?? null);
    setValue("rating", 5);
    setValue("comment", "");
    reset({ rating: 5, comment: "" });
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      return; // TODO: toast error max 2MB
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(mode === "edit" ? initialImageUrl ?? null : null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (data: RatingFormValues) => {
    const rating = selectedRating;
    const commentText = data.comment?.trim() ?? "";

    if (mode === "create" && rateableType && rateableId != null) {
      createRating.mutate(
        {
          type: rateableType,
          rateable_id: rateableId,
          rating,
          comment: commentText || undefined,
          order_id: orderId,
          image: imageFile ?? undefined,
        },
        {
          onSuccess: () => {
            onSuccess?.();
            handleClose();
          },
        }
      );
      return;
    }

    if (mode === "edit" && ratingId != null) {
      updateRating.mutate(
        {
          id: ratingId,
          payload: {
            rating,
            comment: commentText,
            image: imageFile ?? undefined,
          },
        },
        {
          onSuccess: () => {
            onSuccess?.();
            handleClose();
          },
        }
      );
    }
  };

  const isPending = createRating.isPending || updateRating.isPending;
  const title =
    mode === "create"
      ? t("account.myReviews.rateProduct", "Rate this product")
      : t("account.myReviews.editRating", "Edit rating");

  const showProductCard = Boolean(productName || productImageUrl);

  return (
    <BasePopup
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      description={
        mode === "create"
          ? t("account.myReviews.ratingForm.subtitle", "Share your experience to help other customers and improve our marketplace.")
          : undefined
      }
      icon={
        mode === "create" ? (
          <HiStar className="w-6 h-6 text-amber-400 fill-amber-400" />
        ) : undefined
      }
      maxWidth="md"
      className="dark:bg-gray-800"
      contentClassName=""
    >
      <div className="text-start space-y-5">
        {mode === "create" && (
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center -mt-2">
            {t("account.myReviews.ratingForm.disclaimer", "You can rate only products you have purchased.")}
          </p>
        )}

        {showProductCard && (
          <div className="bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-3">
            {productImageUrl && (
              <img
                src={productImageUrl}
                alt=""
                className="w-14 h-14 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 object-contain shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-800 dark:text-gray-200 text-sm line-clamp-2">
                {productName}
              </p>
              {productAttributes && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {productAttributes}
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Star rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("account.myReviews.ratingForm.yourRating", "Your rating")} *
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setSelectedRating(star);
                    setValue("rating", star);
                  }}
                  className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <HiStar
                    className={cn(
                      "w-8 h-8 transition-colors",
                      star <= selectedRating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300 dark:text-gray-500"
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-gray-800 dark:text-gray-200 font-normal">
                {selectedRating}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("account.myReviews.ratingForm.writeReview", "Write your review (optional)")}
            </label>
            <div className="relative">
              <textarea
                {...register("comment", { maxLength: MAX_COMMENT_LENGTH })}
                placeholder={t("account.myReviews.ratingForm.reviewPlaceholder", "Tell us what you liked or what could be better...")}
                rows={4}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2.5 pr-14 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
              />
              <span className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                {commentLength}/{MAX_COMMENT_LENGTH}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t("account.myReviews.ratingForm.reviewHint", "Be specific and honest. Do not include personal information.")}
            </p>
            {errors.comment && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                {errors.comment.message}
              </p>
            )}
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("account.myReviews.ratingForm.addPhotos", "Add photos (optional)")}
            </label>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
              {t("account.myReviews.ratingForm.photosSubtitle", "You can upload up to 3 photos of the product in real life.")}
            </p>
            <div className="flex items-start gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <HiPlus className="w-8 h-8" />
                <span className="text-sm font-medium">
                  {t("account.myReviews.ratingForm.addPhoto", "Add photo")}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview && (
                <div className="relative shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <HiInformationCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t("account.myReviews.ratingForm.infoBanner", "Product ratings are available only for items you have purchased and received.")}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isPending}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 rounded-xl border-0"
            >
              {mode === "create"
                ? t("account.myReviews.ratingForm.submitReview", "Submit review")
                : t("common.save", "Save")}
            </Button>
            <button
              type="button"
              onClick={handleClose}
              className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              {t("account.myReviews.ratingForm.maybeLater", "Maybe later")}
            </button>
          </div>
        </form>
      </div>
    </BasePopup>
  );
}
