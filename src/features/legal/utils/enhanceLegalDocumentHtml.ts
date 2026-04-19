/**
 * Improves readability when the API returns a single long paragraph ("wall of text"):
 * splits on sentence boundaries into separate <p class="legal-doc-sentence"> blocks.
 * Structured HTML (lists, multiple headings, links inside body) is left unchanged.
 */

const MIN_CHARS_TO_SPLIT = 400;
const MIN_SENTENCES = 4;

/** Split on sentence-ending punctuation + space; keep "1. List item" intact. */
function splitIntoSentences(text: string): string[] {
    const normalized = text.replace(/\s+/g, " ").trim();
    if (!normalized) return [];

    const raw = normalized
        .split(/(?<=[.!?؟۔])\s+/u)
        .map((s) => s.trim())
        .filter(Boolean);

    const merged: string[] = [];
    let i = 0;
    while (i < raw.length) {
        const s = raw[i];
        // Avoid splitting ordered-list markers: "1." + "Rest of clause…"
        if (/^\d{1,3}\.$/.test(s) && raw[i + 1]) {
            merged.push(`${s} ${raw[i + 1]}`);
            i += 2;
            continue;
        }
        merged.push(s);
        i += 1;
    }

    return merged;
}

function isSimpleTextOnly(el: Element): boolean {
    return !el.querySelector("a, strong, em, b, i, u, code, pre, br, ul, ol, table, img");
}

export function enhanceLegalDocumentHtml(html: string): string {
    if (typeof window === "undefined" || typeof DOMParser === "undefined") {
        return html;
    }

    const trimmed = html.trim();
    if (!trimmed || trimmed.length < MIN_CHARS_TO_SPLIT) {
        return html;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmed, "text/html");
    const body = doc.body;

    const paragraphs = body.querySelectorAll("p");
    const headings = body.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const lists = body.querySelectorAll("ul, ol");

    // Already structured: several blocks or lists — don't rewrite
    if (lists.length > 0 || headings.length > 1) {
        return html;
    }

    if (paragraphs.length > 2) {
        return html;
    }

    const candidate =
        paragraphs.length === 1
            ? paragraphs[0]
            : body.children.length === 1 && body.firstElementChild?.tagName === "DIV"
              ? body.firstElementChild
              : null;

    if (!candidate || !isSimpleTextOnly(candidate)) {
        return html;
    }

    const text = candidate.textContent ?? "";
    if (text.length < MIN_CHARS_TO_SPLIT) {
        return html;
    }

    const sentences = splitIntoSentences(text);
    if (sentences.length < MIN_SENTENCES) {
        return html;
    }

    candidate.remove();
    for (const sentence of sentences) {
        const p = doc.createElement("p");
        p.className = "legal-doc-sentence";
        p.textContent = sentence;
        body.appendChild(p);
    }

    return body.innerHTML;
}
