import React, { useEffect, useState } from "react";

import Button from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils";

type AnimatedButtonNote = {
    primary: React.ReactNode;
    secondary: React.ReactNode;
};

export type AnimatedButtonItem = {
    label: React.ReactNode;
    className?: string;
};

type BaseAnimatedButtonProps = Omit<
    React.ComponentProps<typeof Button>,
    "children"
> & {
    heightClassName?: string;
    durationMs?: number;
    pauseRatio?: number;
};

export type AnimatedButtonProps = BaseAnimatedButtonProps &
    (
        | { note: AnimatedButtonNote; items?: never }
        | { items: AnimatedButtonItem[]; note?: never }
    );

function MultiLabelAnimatedButton({
    items,
    heightClassName,
    durationMs = 2500,
    pauseRatio: _pauseRatio,
    className,
    ...buttonProps
}: BaseAnimatedButtonProps & { items: AnimatedButtonItem[] }) {
    const [active, setActive] = useState(0);

    const itemsSignature = items
        .map((it) => `${String(it.label)}::${it.className ?? ""}`)
        .join("|");

    useEffect(() => {
        setActive(0);
    }, [itemsSignature]);

    useEffect(() => {
        if (items.length < 2) return;

        const mq =
            typeof window !== "undefined"
                ? window.matchMedia("(prefers-reduced-motion: reduce)")
                : null;
        if (mq?.matches) return;

        const stepMs = Math.max(500, Math.floor(durationMs / items.length));
        const id = window.setInterval(() => {
            setActive((i) => (i + 1) % items.length);
        }, stepMs);
        return () => clearInterval(id);
    }, [itemsSignature, durationMs, items.length]);

    const prefersReduced =
        typeof window !== "undefined"
            ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
            : false;

    const index = prefersReduced ? 0 : active;
    const n = items.length;
    /** Percent of the track height — matches each equal row without measuring pixels */
    const translateY =
        n > 0 ? `translateY(calc(-${index} * 100% / ${n}))` : "translateY(0)";

    return (
        <Button
            {...buttonProps}
            type={buttonProps.type ?? "button"}
            variant="ghost"
            aria-live="polite"
            className={cn(
                "relative inline-flex w-max max-w-full min-w-0 items-center justify-center overflow-hidden rounded-sm border-0 !bg-transparent !p-0 shadow-none hover:!bg-transparent focus-visible:ring-2 focus-visible:ring-primary/40",
                heightClassName,
                className
            )}
        >
            {/* Sizing layer: width = widest label, height = row height */}
            <span className="invisible pointer-events-none inline-grid w-max">
                {items.map((it, i) => (
                    <span
                        key={i}
                        className={cn(
                            "col-start-1 row-start-1 justify-self-center whitespace-nowrap px-6  ",
                            heightClassName
                        )}
                    >
                        {it.label}
                    </span>
                ))}
            </span>
            <div
                className={cn(
                    "absolute inset-0 overflow-hidden rounded-sm",
                    heightClassName
                )}
            >
                <div
                    className="flex flex-col transition-transform duration-500 ease-out motion-reduce:transition-none"
                    style={{ transform: translateY }}
                >
                    {items.map((it, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex w-full shrink-0 items-center justify-center whitespace-nowrap px-2 text-md font-semibold leading-none",
                                heightClassName,
                                it.className
                            )}
                        >
                            {it.label}
                        </div>
                    ))}
                </div>
            </div>
        </Button>
    );
}

export default function AnimatedButton(props: AnimatedButtonProps) {
    if ("items" in props && props.items?.length) {
        const {
            items,
            className,
            heightClassName = "h-6",
            durationMs = 2500,
            pauseRatio = 0.4,
            /** `size` adds vertical padding and breaks tiny fixed rows (e.g. 18px) */
            size: _omitSize,
            ...buttonProps
        } = props;
        return (
            <MultiLabelAnimatedButton
                {...buttonProps}
                items={items}
                heightClassName={heightClassName}
                durationMs={durationMs}
                pauseRatio={pauseRatio}
                className={className}
            />
        );
    }

    if (!("note" in props) || props.note == null) {
        return null;
    }

    const {
        note,
        className,
        heightClassName = "h-6",
        durationMs = 2500,
        pauseRatio = 0.4,
        ...rest
    } = props;
    const style = {
        ["--ab-duration" as any]: `${durationMs}ms`,
        ["--ab-pause" as any]: `${pauseRatio}`,
    } as React.CSSProperties;

    return (
        <Button
            {...rest}
            style={{ ...(props.style || {}), ...style }}
            className={cn(
                "relative inline-flex items-center justify-center overflow-hidden rounded-full h-6",
                heightClassName,
                className
            )}
        >
            <span className="invisible pointer-events-none grid">
                <span
                    className={cn(
                        "col-start-1 row-start-1 whitespace-nowrap px-2 text-xs font-semibold",
                        heightClassName
                    )}
                >
                    {note.primary}
                </span>
                <span
                    className={cn(
                        "col-start-1 row-start-1 whitespace-nowrap px-2 text-xs font-semibold",
                        heightClassName
                    )}
                >
                    {note.secondary}
                </span>
            </span>
            <span className="ab-track">
                <span className={cn("ab-row", heightClassName)}>
                    {note.primary}
                </span>
                <span className={cn("ab-row", heightClassName)}>
                    {note.secondary}
                </span>
            </span>
        </Button>
    );
}
