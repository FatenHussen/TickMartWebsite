import { useEffect, useMemo, useRef, useState } from "react";
import { CloudUpload, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/lib/utils";
import {
  MAX_CUSTOM_ORDER_IMAGES,
  mergeCustomOrderImages,
} from "../utils/customOrderHelpers";

type CustomOrderImagePickerProps = {
  files: File[];
  onChange: (files: File[]) => void;
  disabled?: boolean;
};

export default function CustomOrderImagePicker({
  files,
  onChange,
  disabled,
}: CustomOrderImagePickerProps) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropActive, setDropActive] = useState(false);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const addFiles = (list: FileList | null) => {
    onChange(mergeCustomOrderImages(files, list));
  };

  const removeAt = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  const canAddMore = files.length < MAX_CUSTOM_ORDER_IMAGES && !disabled;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-custom-primary">
        {t("customOrder.images")}
        <span className="ms-1 text-xs font-normal text-custom-secondary">
          ({t("customOrder.imagesHint", { max: MAX_CUSTOM_ORDER_IMAGES })})
        </span>
      </label>

      {canAddMore && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDropActive(true);
          }}
          onDragLeave={() => setDropActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDropActive(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "cursor-pointer rounded-xl border border-dashed border-custom-primary/40 bg-custom-tertiary/30 p-6 text-center transition-colors",
            dropActive && "border-primary bg-primary/5"
          )}
        >
          <CloudUpload className="mx-auto mb-2 h-10 w-10 text-custom-tertiary" aria-hidden />
          <p className="text-sm font-medium text-custom-primary">
            {t("customOrder.dropImages")}
          </p>
          <p className="mt-1 text-xs text-custom-secondary">{t("customOrder.uploadHint")}</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg,image/webp"
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {previews.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-3">
          {previews.map((preview, index) => (
            <li
              key={`${preview.file.name}-${index}`}
              className="relative h-24 w-24 overflow-hidden rounded-xl border border-custom-primary/20 bg-custom-card"
            >
              <img
                src={preview.url}
                alt=""
                className="h-full w-full object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  aria-label={t("common.removeImage", "Remove image")}
                  className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
