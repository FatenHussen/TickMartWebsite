import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export type CountryDialOption = {
    id: string;
    label: string;
};

type CountryDialSelectProps = {
    value: string;
    options: CountryDialOption[];
    onChange: (id: string) => void;
    onListScroll?: (event: React.UIEvent<HTMLElement>) => void;
    disabled?: boolean;
    ariaLabel: string;
    isLoadingMore?: boolean;
    loadingLabel?: string;
    onBlur?: () => void;
};

/**
 * Custom country menu — Windows native `<select>` keeps cream text on a white
 * OS popup, so option CSS cannot fix login country names.
 */
export function CountryDialSelect({
    value,
    options,
    onChange,
    onListScroll,
    disabled,
    ariaLabel,
    isLoadingMore,
    loadingLabel,
    onBlur,
}: CountryDialSelectProps) {
    const [open, setOpen] = useState(false);
    const [menuRect, setMenuRect] = useState<{
        top: number;
        left: number;
        width: number;
    } | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    const listId = useId();
    const selected =
        options.find((option) => option.id === value) ??
        options.find((option) => /syria|سوريا|\+963/i.test(option.label)) ??
        options[0];

    const updateMenuRect = () => {
        const rect = buttonRef.current?.getBoundingClientRect();
        if (!rect) return;
        setMenuRect({
            top: rect.bottom + 4,
            left: rect.left,
            width: Math.max(rect.width, 224),
        });
    };

    useLayoutEffect(() => {
        if (!open) return;
        updateMenuRect();
        window.addEventListener("resize", updateMenuRect);
        window.addEventListener("scroll", updateMenuRect, true);
        return () => {
            window.removeEventListener("resize", updateMenuRect);
            window.removeEventListener("scroll", updateMenuRect, true);
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (event: MouseEvent) => {
            const target = event.target as Node;
            if (rootRef.current?.contains(target)) return;
            if (menuRef.current?.contains(target)) return;
            setOpen(false);
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div ref={rootRef} className="relative min-w-[7.5rem] shrink-0 self-stretch">
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={ariaLabel}
                aria-controls={listId}
                onClick={() => setOpen((current) => !current)}
                onBlur={onBlur}
                className={cn(
                    "flex h-full min-h-[2.75rem] w-full min-w-[7.5rem] items-center justify-between gap-1 rounded-s-[0.7rem] border-e border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-800",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff9f00]/35",
                    "dark:border-white/10 dark:bg-[#2A2622] dark:text-[#F3EFE8]",
                    disabled && "cursor-not-allowed opacity-60",
                )}
            >
                <span className="truncate">{selected?.label ?? ""}</span>
                <ChevronDown
                    className={cn("h-3.5 w-3.5 shrink-0 opacity-70", open && "rotate-180")}
                    aria-hidden
                />
            </button>
            {open && menuRect
                ? createPortal(
                      <ul
                          ref={menuRef}
                          id={listId}
                          role="listbox"
                          aria-label={ariaLabel}
                          onScroll={onListScroll}
                          className="fixed z-[200] max-h-60 overflow-auto rounded-lg border border-stone-200 bg-white py-1 text-sm text-[#1c1917] shadow-lg"
                          style={{
                              top: menuRect.top,
                              left: menuRect.left,
                              width: menuRect.width,
                          }}
                      >
                          {options.map((option) => {
                              const isSelected = option.id === value;
                              return (
                                  <li key={option.id} role="presentation">
                                      <button
                                          type="button"
                                          role="option"
                                          aria-selected={isSelected}
                                          className={cn(
                                              "flex w-full px-3 py-2 text-start text-[#1c1917]",
                                              isSelected
                                                  ? "bg-[#f6efe4] font-semibold"
                                                  : "hover:bg-stone-100",
                                          )}
                                          onClick={() => {
                                              onChange(option.id);
                                              setOpen(false);
                                          }}
                                      >
                                          {option.label}
                                      </button>
                                  </li>
                              );
                          })}
                          {isLoadingMore ? (
                              <li className="px-3 py-2 text-stone-500" aria-hidden>
                                  {loadingLabel}
                              </li>
                          ) : null}
                      </ul>,
                      document.body,
                  )
                : null}
        </div>
    );
}
