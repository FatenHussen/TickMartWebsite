import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { setTimeout as delay } from "node:timers/promises";

const chromePath =
    process.env.CHROME_PATH ??
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const url = process.argv[2] ?? "http://localhost:5175/schedules/3";
const port = 9362;

const chrome = spawn(
    chromePath,
    [
        `--remote-debugging-port=${port}`,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1440,1100",
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

const INSPECT = `(() => {
  const closer = document.querySelector('[aria-label="Close"]');
  if (closer instanceof HTMLElement) closer.click();
  const inputs = [...document.querySelectorAll("input")];
  const pageInput = inputs.find((el) => (el.placeholder || "") === "Search products");
  const bar = pageInput?.closest("div.fixed, div.sticky");
  const page = pageInput?.closest(".min-h-screen");
  const nav = document.querySelector(".navbar-elevate");
  const barCs = bar ? getComputedStyle(bar) : null;
  const pageCs = page ? getComputedStyle(page) : null;
  const navRect = nav?.getBoundingClientRect();
  const barRect = bar?.getBoundingClientRect();
  return JSON.stringify({
    path: location.pathname,
    scrollY: Math.round(window.scrollY),
    foundPageInput: Boolean(pageInput),
    barPosition: barCs?.position ?? null,
    barTopCss: barCs?.top ?? null,
    barBg: barCs?.backgroundColor ?? null,
    pageBg: pageCs?.backgroundColor ?? null,
    navBottom: navRect ? Math.round(navRect.bottom) : null,
    navTop: navRect ? Math.round(navRect.top) : null,
    barTop: barRect ? Math.round(barRect.top) : null,
    gap: navRect && barRect ? Math.round(barRect.top - navRect.bottom) : null,
  });
})()`;

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
        width: 1440,
        height: 1100,
        deviceScaleFactor: 1,
        mobile: false,
    });

    const loaded = waitEvent(ws, "Page.loadEventFired");
    await send(ws, 4, "Page.navigate", { url });
    await loaded;

    await send(ws, 5, "Runtime.evaluate", {
        expression: `Promise.race([
          (async () => {
            const start = Date.now();
            while (Date.now() - start < 25000) {
              const closer = document.querySelector('[aria-label="Close"]');
              if (closer instanceof HTMLElement) closer.click();
              const text = document.body?.innerText ?? "";
              const ready =
                [...document.querySelectorAll("input")].some(
                  (el) => (el.placeholder || "") === "Search products",
                ) &&
                (text.includes("Build your") ||
                  text.includes("ابنِ طلب") ||
                  text.includes("Scheduled basket") ||
                  text.includes("سلة مجدولة"));
              if (ready) return true;
              await new Promise((r) => setTimeout(r, 250));
            }
            return false;
          })(),
        ])`,
        awaitPromise: true,
    });
    await delay(1400);

    const top = await send(ws, 6, "Runtime.evaluate", {
        expression: INSPECT,
        returnByValue: true,
    });
    console.log("TOP", top.result?.value);

    const shot1 = await send(ws, 7, "Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
    });
    await writeFile(".tmp-verify/customize-desktop-top.png", Buffer.from(shot1.data, "base64"));

    await send(ws, 8, "Runtime.evaluate", {
        expression: `window.scrollTo(0, 420);`,
    });
    await delay(350);

    const mid = await send(ws, 9, "Runtime.evaluate", {
        expression: INSPECT,
        returnByValue: true,
    });
    console.log("MID", mid.result?.value);

    const shot2 = await send(ws, 10, "Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
    });
    await writeFile(".tmp-verify/customize-desktop-scrolled.png", Buffer.from(shot2.data, "base64"));

    await send(ws, 11, "Emulation.setDeviceMetricsOverride", {
        width: 390,
        height: 980,
        deviceScaleFactor: 2,
        mobile: true,
    });
    await send(ws, 12, "Runtime.evaluate", {
        expression: `window.scrollTo(0, 0);`,
    });
    await delay(400);

    const mobTop = await send(ws, 13, "Runtime.evaluate", {
        expression: INSPECT,
        returnByValue: true,
    });
    console.log("MOBILE TOP", mobTop.result?.value);

    const shot3 = await send(ws, 14, "Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
    });
    await writeFile(".tmp-verify/customize-mobile-top.png", Buffer.from(shot3.data, "base64"));

    await send(ws, 15, "Runtime.evaluate", {
        expression: `window.scrollTo(0, 360);`,
    });
    await delay(350);

    const mobMid = await send(ws, 16, "Runtime.evaluate", {
        expression: INSPECT,
        returnByValue: true,
    });
    console.log("MOBILE MID", mobMid.result?.value);

    const shot4 = await send(ws, 17, "Page.captureScreenshot", {
        format: "png",
        fromSurface: true,
    });
    await writeFile(".tmp-verify/customize-mobile-scrolled.png", Buffer.from(shot4.data, "base64"));

    ws.close();
} finally {
    chrome.kill();
}
