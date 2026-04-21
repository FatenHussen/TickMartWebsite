import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HiStar, HiPlus, HiInformationCircle, HiGift } from "react-icons/hi";
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
                    ? t("account.myReviews.ratingForm.subtitle", "Share your experience to help other customers and improve our marketplace.") +
                    " " +
                    t("account.myReviews.ratingForm.disclaimer", "You can rate only products you have purchased.")
                    : undefined
            }
            icon={
                mode === "create" ? (
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-800/20 border border-amber-200/60 dark:border-amber-600/40 shadow-sm">
                        <HiStar className="w-8 h-8 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" aria-hidden />
                    </div>
                ) : undefined
            }
            maxWidth="md"
            className="bg-white dark:bg-[#1a2332]"
            contentClassName="text-start"
        >
            <div className="text-start space-y-5">
                {showProductCard && (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50/80 dark:bg-slate-800/50 p-4 flex items-center gap-4">
                        {productImageUrl ? (
                            <img
                                src={productImageUrl}
                                alt=""
                                className="w-16 h-16 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 object-contain shrink-0"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0 flex items-center justify-center">
                                <HiGift className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="font-semibold text-custom-primary text-sm line-clamp-2">
                                {productName}
                            </p>
                            {productAttributes && (
                                <p className="text-xs text-custom-secondary mt-1">
                                    {productAttributes}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Star rating */}
                    <div>
                        <label className="block text-sm font-medium text-custom-primary mb-2">
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
                                    className="p-0.5 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400"
                                >
                                    <HiStar
                                        className={cn(
                                            "w-8 h-8 transition-colors",
                                            star <= selectedRating
                                                ? "text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400"
                                                : "text-slate-300 dark:text-slate-600"
                                        )}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-custom-primary font-medium">
                                {selectedRating}
                            </span>
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-custom-primary mb-1">
                            {t("account.myReviews.ratingForm.writeReview", "Write your review (optional)")}
                        </label>
                        <div className="relative">
                            <textarea
                                {...register("comment", { maxLength: MAX_COMMENT_LENGTH })}
                                placeholder={t("account.myReviews.ratingForm.reviewPlaceholder", "Tell us what you liked or what could be better...")}
                                rows={4}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700/50 text-custom-primary px-3 py-2.5 pr-14 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            />
                            <span className="absolute bottom-2 right-2 text-xs text-slate-400 dark:text-slate-500">
                                {commentLength}/{MAX_COMMENT_LENGTH}
                            </span>
                        </div>
                        <p className="text-xs text-custom-secondary mt-1">
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
                        <label className="block text-sm font-medium text-custom-primary mb-1">
                            {t("account.myReviews.ratingForm.addPhotos", "Add photos (optional)")}
                        </label>
                        <p className="text-xs text-custom-secondary mb-2">
                            {t("account.myReviews.ratingForm.photosSubtitle", "You can upload up to 3 photos of the product in real life.")}
                        </p>
                        <div className="flex items-start gap-3 flex-wrap">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex flex-col items-center justify-center gap-2 w-32 h-32 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 text-custom-secondary hover:text-custom-primary transition-colors"
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
                                        alt={t("account.myReviews.ratingForm.imagePreviewAlt")}
                                        className="w-20 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
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
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-sky-50 dark:bg-sky-900/25 border border-sky-200 dark:border-sky-800">
                        <HiInformationCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-sky-700 dark:text-sky-300">
                            {t("account.myReviews.ratingForm.infoBanner", "Product ratings are available only for items you have purchased and received.")}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            isLoading={isPending}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 dark:from-cyan-600 dark:to-blue-600 dark:hover:from-cyan-500 dark:hover:to-blue-500 text-white font-medium py-3 rounded-xl border-0 shadow-md"
                        >
                            {mode === "create"
                                ? t("account.myReviews.ratingForm.submitReview", "Submit review")
                                : t("common.save", "Save")}
                        </Button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="shrink-0 text-center text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium"
                        >
                            {t("account.myReviews.ratingForm.maybeLater", "Maybe later")}
                        </button>
                    </div>
                </form>
            </div>
        </BasePopup>
    );
}
