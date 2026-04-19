import {
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type RefObject,
} from "react";
import { useTranslation } from "react-i18next";
import { stripHtmlTags } from "@/shared/lib/stripHtmlTags";
import { cn } from "@/shared/lib/utils";

function lineClampStyle(lines: number, active: boolean): CSSProperties | undefined {
    if (!active) return undefined;
    return {
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: lines,
        overflow: "hidden",
        wordBreak: "break-word",
        overflowWrap: "anywhere",
    };
}

type Heights = { collapsed: number; full: number };

function useHtmlBlockHeights(
    html: string,
    lines: number
): { ref: RefObject<HTMLDivElement | null>; heights: Heights | null } {
    const ref = useRef<HTMLDivElement>(null);
    const [heights, setHeights] = useState<Heights | null>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const measure = () => {
            const full = el.scrollHeight;
            const cs = getComputedStyle(el);
            const lh = parseFloat(cs.lineHeight);
            const fontSize = parseFloat(cs.fontSize) || 16;
            const lineHeight = Number.isFinite(lh) && lh > 0 ? lh : fontSize * 1.5;
            const collapsed = Math.ceil(lineHeight * lines);
            setHeights({ collapsed: Math.min(collapsed, full), full });
        };

        measure();
        if (typeof ResizeObserver === "undefined") return;
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [html, lines]);

    return { ref, heights };
}

function usePlainLineHeights(
    text: string,
    lines: number,
    enabled: boolean
): { ref: RefObject<HTMLParagraphElement | null>; heights: Heights | null } {
    const ref = useRef<HTMLParagraphElement>(null);
    const [heights, setHeights] = useState<Heights | null>(null);

    useLayoutEffect(() => {
        if (!enabled) return;
        const el = ref.current;
        if (!el) return;

        const measure = () => {
            const full = el.scrollHeight;
            const cs = getComputedStyle(el);
            const lh = parseFloat(cs.lineHeight);
            const fontSize = parseFloat(cs.fontSize) || 16;
            const lineHeight = Number.isFinite(lh) && lh > 0 ? lh : fontSize * 1.5;
            const collapsed = Math.ceil(lineHeight * lines);
            setHeights({ collapsed: Math.min(collapsed, full), full });
        };

        measure();
        if (typeof ResizeObserver === "undefined") return;
        const ro = new ResizeObserver(measure);
        ro.observe(el);
        return () => ro.disconnect();
    }, [text, lines, enabled]);

    return { ref, heights };
}

export type ExpandableTextProps = {
    /** Plain text when `mode` is `"plain"`. */
    text?: string | null;
    /** Raw HTML when `mode` is `"html"` (trusted content). */
    content?: string | null;
    mode?: "plain" | "html";
    /** Line clamp when `maxLength` is not set. Default 4. */
    lines?: number;
    /** Plain text only: truncate by characters instead of lines. */
    maxLength?: number;
    /** Strip tags when `mode` is `plain` but input may contain HTML. */
    stripHtml?: boolean;
    className?: string;
    contentClassName?: string;
    toggleClassName?: string;
    readMoreLabel?: string;
    readLessLabel?: string;
    /** Animate expand/collapse using max-height (smoother for blocks of text). */
    animate?: boolean;
};

/**
 * Plain text or trusted HTML with read more / less.
 *
 * @example
 * ```tsx
 * <ExpandableText text={description} lines={3} mode="plain" />
 * <ExpandableText content={htmlFromApi} lines={4} mode="html" />
 * <ExpandableText text={longNote} maxLength={220} mode="plain" />
 * ```
 */
export function ExpandableText({
    text,
    content,
    mode = "plain",
    lines = 4,
    maxLength,
    stripHtml: strip = false,
    className,
    contentClassName,
    toggleClassName,
    readMoreLabel,
    readLessLabel,
    animate = false,
}: ExpandableTextProps) {
    if (mode === "html") {
        return (
            <ExpandableHtmlContent
                html={content ?? ""}
                lines={lines}
                className={className}
                contentClassName={contentClassName}
                toggleClassName={toggleClassName}
                readMoreLabel={readMoreLabel}
                readLessLabel={readLessLabel}
                animate={animate}
            />
        );
    }

    return (
        <ExpandablePlainText
            text={text}
            lines={lines}
            maxLength={maxLength}
            stripHtml={strip}
            className={className}
            contentClassName={contentClassName}
            toggleClassName={toggleClassName}
            readMoreLabel={readMoreLabel}
            readLessLabel={readLessLabel}
            animate={animate}
        />
    );
}

type ExpandablePlainTextProps = Omit<ExpandableTextProps, "mode" | "content">;

function ExpandablePlainText({
    text,
    lines = 4,
    maxLength,
    stripHtml: strip = false,
    className,
    contentClassName,
    toggleClassName,
    readMoreLabel,
    readLessLabel,
    animate = false,
}: ExpandablePlainTextProps) {
    const { t } = useTranslation();
    const more = readMoreLabel ?? t("legal.readMore");
    const less = readLessLabel ?? t("legal.readLess");
    const [expanded, setExpanded] = useState(false);

    const displayPlain = useMemo(() => {
        let s = text ?? "";
        if (strip) s = stripHtmlTags(s);
        return s;
    }, [text, strip]);

    const isEmpty = !displayPlain.trim();
    const maxLenMode =
        !isEmpty &&
        maxLength != null &&
        maxLength > 0 &&
        displayPlain.length > maxLength;
    const useAnim = Boolean(animate && !maxLenMode && !isEmpty);

    const { ref: measureRef, heights } = usePlainLineHeights(displayPlain, lines, useAnim);
    const clampRef = useRef<HTMLParagraphElement>(null);
    const [overflowsCollapsed, setOverflowsCollapsed] = useState(false);

    useLayoutEffect(() => {
        if (useAnim || maxLenMode || isEmpty) return;
        const el = clampRef.current;
        if (!el) return;
        const check = () => {
            if (expanded) return;
            setOverflowsCollapsed(el.scrollHeight > el.clientHeight + 1);
        };
        check();
        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
    }, [displayPlain, lines, expanded, useAnim, maxLenMode, isEmpty]);

    const canExpandAnimated =
        useAnim && heights != null && heights.full > heights.collapsed + 2;

    if (isEmpty) return null;

    if (maxLenMode && maxLength != null) {
        const truncated = displayPlain.slice(0, maxLength).trimEnd() + "…";
        return (
            <div className={className}>
                <p
                    className={cn(
                        "whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
                        contentClassName
                    )}
                >
                    {expanded ? displayPlain : truncated}
                </p>
                <button
                    type="button"
                    className={cn(
                        "mt-1 text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded",
                        toggleClassName
                    )}
                    onClick={() => setExpanded((e) => !e)}
                    aria-expanded={expanded}
                >
                    {expanded ? less : more}
                </button>
            </div>
        );
    }

    if (useAnim) {
        const motionStyle: CSSProperties | undefined = heights
            ? {
                  maxHeight: expanded ? heights.full : heights.collapsed,
                  overflow: "hidden",
                  transition: "max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }
            : { ...lineClampStyle(lines, true), overflow: "hidden" };

        return (
            <div className={className}>
                <div style={motionStyle}>
                    <p
                        ref={measureRef}
                        className={cn(
                            "whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
                            contentClassName
                        )}
                    >
                        {displayPlain}
                    </p>
                </div>
                {canExpandAnimated && (
                    <button
                        type="button"
                        className={cn(
                            "mt-1 text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded",
                            toggleClassName
                        )}
                        onClick={() => setExpanded((e) => !e)}
                        aria-expanded={expanded}
                    >
                        {expanded ? less : more}
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={className}>
            <p
                ref={clampRef}
                className={cn(
                    "whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
                    !expanded && lineClampStyle(lines, true),
                    contentClassName
                )}
            >
                {displayPlain}
            </p>
            {(expanded || overflowsCollapsed) && (
                <button
                    type="button"
                    className={cn(
                        "mt-1 text-sm font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded",
                        toggleClassName
                    )}
                    onClick={() => setExpanded((e) => !e)}
                    aria-expanded={expanded}
                >
                    {expanded ? less : more}
                </button>
            )}
        </div>
    );
}

export type ExpandableHtmlContentProps = {
    html: string;
    lines?: number;
    className?: string;
    contentClassName?: string;
    toggleClassName?: string;
    readMoreLabel?: string;
    readLessLabel?: string;
    animate?: boolean;
};

/**
 * Trusted HTML (e.g. CMS / API). Pair with memoized HTML from parents to avoid extra work.
 *
 * **Performance:** For very large strings, memoize the HTML in the parent (`useMemo`), avoid
 * passing new object literals each render, and consider splitting content server-side if the
 * payload is megabytes.
 */
export function ExpandableHtmlContent({
    html,
    lines = 4,
    className,
    contentClassName,
    toggleClassName,
    readMoreLabel,
    readLessLabel,
    animate = false,
}: ExpandableHtmlContentProps) {
    const { t } = useTranslation();
    const more = readMoreLabel ?? t("legal.readMore");
    const less = readLessLabel ?? t("legal.readLess");
    const [expanded, setExpanded] = useState(false);

    const trimmed = html?.trim() ?? "";
    const { ref, heights } = useHtmlBlockHeights(trimmed, lines);

    if (!trimmed) return null;
    const canExpand = heights != null && heights.full > heights.collapsed + 2;

    const wrapperStyle: CSSProperties | undefined =
        animate && heights
            ? {
                  maxHeight: expanded ? heights.full : heights.collapsed,
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }
            : animate && !heights
              ? { ...lineClampStyle(lines, true), overflow: "hidden" }
              : !animate && !expanded
                ? lineClampStyle(lines, true)
                : undefined;

    return (
        <div className={cn("min-w-0", className)}>
            <div style={wrapperStyle}>
                <div
                    ref={ref}
                    className={cn(
                        "break-words [overflow-wrap:anywhere] [&_img]:max-w-full [&_pre]:overflow-x-auto",
                        contentClassName
                    )}
                    dangerouslySetInnerHTML={{ __html: trimmed }}
                />
            </div>
            {canExpand && (
                <button
                    type="button"
                    className={cn(
                        "mt-4 text-sm font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded",
                        toggleClassName
                    )}
                    onClick={() => setExpanded((e) => !e)}
                    aria-expanded={expanded}
                >
                    {expanded ? less : more}
                </button>
            )}
        </div>
    );
}
