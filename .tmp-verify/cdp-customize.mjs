import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const chromePath =
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const catalogUrl = process.argv[2] ?? "http://localhost:5175/schedules";
const out = process.argv[3] ?? ".tmp-verify/customize-mobile.png";
const width = Number(process.argv[4] ?? 390);
const height = Number(process.argv[5] ?? 980);
const port = Number(process.argv[6] ?? 9340);

const chrome = spawn(
    chromePath,
    [
        `--remote-debugging-port=${port}`,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        `--window-size=${width},${height}`,
        `--user-data-dir=${process.env.TEMP}\\tikmool-cdp-${port}`,
        "about:blank",
    ],
    { stdio: "ignore" },
);

async function getPageWsUrl(tries = 40) {
    for (let i = 0; i < tries; i++) {
        try {
            const res = await fetch(`http://127.0.0.1:${port}/json/list`);
            const targets = await res.json();
            const page = targets.find(
                (t) => t.type === "page" && t.webSocketDebuggerUrl,
            );
            if (page) return page.webSocketDebuggerUrl;
        } catch {
            /* chrome still starting */
        }
        await delay(150);
    }
    throw new Error("Chrome page target not ready");
}

function send(ws, id, method, params = {}) {
    return new Promise((resolve, reject) => {
        const onMessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.id === id) {
                ws.removeEventListener("message", onMessage);
                if (msg.error) reject(new Error(JSON.stringify(msg.error)));
                else resolve(msg.result);
            }
        };
        ws.addEventListener("message", onMessage);
        ws.send(JSON.stringify({ id, method, params }));
    });
}

function waitEvent(ws, method, timeoutMs = 20000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            ws.removeEventListener("message", onMessage);
            reject(new Error(`Timed out waiting for ${method}`));
        }, timeoutMs);
        const onMessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.method === method) {
                clearTimeout(timer);
                ws.removeEventListener("message", onMessage);
                resolve(msg.params);
            }
        };
        ws.addEventListener("message", onMessage);
    });
}

try {
    const wsUrl = await getPageWsUrl();
    const ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
        ws.addEventListener("open", resolve);
        ws.addEventListener("error", reject);
    });

    await send(ws, 1, "Runtime.enable");
    await send(ws, 2, "Page.enable");
    await send(ws, 3, "Emulation.setDeviceMetricsOverride", {
        width,
        height,
        deviceScaleFactor: 2,
        mobile: width < 800,
    });

    const loaded = waitEvent(ws, "Page.loadEventFired");
    await send(ws, 4, "Page.navigate", { url: catalogUrl });
    await loaded;

    await send(ws, 5, "Runtime.evaluate", {
        expression: `Promise.race([
          (async () => {
            const start = Date.now();
            while (Date.now() - start < 25000) {
              const closer = document.querySelector('[aria-label="Close"]');
              if (closer instanceof HTMLElement) closer.click();
              const text = document.body?.innerText ?? "";
              const ready = text.includes("Build this basket")
                || text.includes("ابنِ هالسلة");
              const overlayOpen = Boolean(document.querySelector('[aria-label="Close"]'));
              if (ready && !overlayOpen) return true;
              await new Promise((r) => setTimeout(r, 250));
            }
            return false;
          })(),
        ])`,
        awaitPromise: true,
    });

    await send(ws, 6, "Runtime.evaluate", {
        expression: `(() => {
          const btn = [...document.querySelectorAll("button")]
            .find((el) => /Build this basket|ابنِ هالسلة/.test(el.textContent || ""));
          if (btn) { btn.click(); return true; }
          const card = document.querySelector('button[class*="rounded-2xl"]');
          if (card) { card.click(); return true; }
          return false;
        })()`,
    });

    await send(ws, 7, "Runtime.evaluate", {
        expression: `Promise.race([
          (async () => {
            const start = Date.now();
            while (Date.now() - start < 25000) {
              const closer = document.querySelector('[aria-label="Close"]');
              if (closer instanceof HTMLElement) closer.click();
              const text = document.body?.innerText ?? "";
              const ready =
                (text.includes("tap one to add it") || text.includes("اضغط للإضافة"))
                && (text.includes("Fashion") || text.includes("Nike") || text.includes("Adidas"));
              if (ready) return true;
              await new Promise((r) => setTimeout(r, 250));
            }
            return false;
          })(),
        ])`,
        awaitPromise: true,
    });

    await delay(600);
    const shot = await send(ws, 8, "Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
    });
    await writeFile(out, Buffer.from(shot.data, "base64"));
    console.log(`wrote ${out}`);
    ws.close();
} finally {
    chrome.kill();
}
