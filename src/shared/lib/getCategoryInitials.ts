/** Arabic tatweel + harakat, stripped before picking a glyph. */
const ARABIC_NOISE = /[ـً-ْٰۖ-ۭ]/g;
/** Latin + Arabic word separators (comma, question mark, dash, pipe, slash…). */
const WORD_SEPARATORS = /[\s،؛؟\-_.·|/\\]+/;

/** Arabic definite article — dropped so "الأطعمة" and "الملابس" don't both read "ا". */
function stripDefiniteArticle(word: string): string {
    if (word.startsWith("ال") && Array.from(word).length > 3) {
        return word.slice(2);
    }
    return word;
}

function firstGlyph(word: string): string {
    // `Array.from` so emoji / surrogate pairs are never split in half.
    return Array.from(word)[0] ?? "";
}

/**
 * Initials avatar text for a category with no icon.
 * Works for Arabic and Latin names: "الأطعمة الطازجة" → "أط", "Home Decor" → "HD",
 * "Fashion" → "FA".
 */
export function getCategoryInitials(name: string, max = 2): string {
    const cleaned = (name ?? "").replace(ARABIC_NOISE, "").trim();
    if (!cleaned) return "";

    const words = cleaned
        .split(WORD_SEPARATORS)
        .map(stripDefiniteArticle)
        .filter(Boolean);

    if (words.length === 0) return "";

    const glyphs =
        words.length > 1
            ? [firstGlyph(words[0]), firstGlyph(words[words.length - 1])]
            : // A single glyph at 96px reads as a rendering bug — take two.
              Array.from(words[0]).slice(0, max);

    // Slice the glyph array, never the joined string — that would split a pair.
    return glyphs.slice(0, max).join("").toLocaleUpperCase();
}
