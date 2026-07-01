"use client";

/**
 * PDF export via the browser's native print engine.
 *
 * We build a light-themed *clone* of the report, drop it into the page as a
 * print-only root, and call window.print(). The browser rasterizes nothing —
 * text stays crisp vector and selectable, SVG charts render natively, and page
 * breaks are handled by the print engine. (The previous html2canvas approach
 * produced blank charts, mangled number spacing, and choked on modern CSS
 * color functions.) @media print rules in globals.css hide the live app and
 * page-break the clone.
 */

const LIGHT_OVERRIDES_CSS = `
  [data-pdf-export], [data-pdf-export] * {
    color-scheme: light !important;
  }
  [data-pdf-export] [data-reveal],
  [data-pdf-export] [data-count],
  [data-pdf-export] [data-count] * {
    opacity: 1 !important;
    transform: none !important;
  }
  [data-pdf-export] {
    --covert-black: #FFFFFF;
    --covert-canvas: #FFFFFF;
    --covert-surface-1: #FFFFFF;
    --covert-surface-2: #FFFFFF;
    --covert-bg: #FFFFFF;
    --covert-bg-secondary: #F8FAFC;
    --covert-text-dark: #0F172A;
    --covert-border: #E5E7EB;
    --on-dark-text: #0F172A;
    --on-dark-text-secondary: #475569;
    --on-dark-text-muted: #94A3B8;
    --on-dark-border: #E5E7EB;
    --on-dark-surface: #F8FAFC;
    --on-dark-surface-elevated: #F1F5F9;
    background-color: #FFFFFF;
    color: #0F172A;
  }
  [data-pdf-export] [aria-hidden] {
    background: none !important;
  }
`;

const DARK_BG_HEX = new Set([
  "#0B0B0B",
  "#171717",
  "rgb(11, 11, 11)",
  "rgb(23, 23, 23)",
]);
const WHITE_TEXT_VALUES = new Set([
  "#FFFFFF",
  "#ffffff",
  "rgb(255, 255, 255)",
  "white",
]);

function rgbaWhiteToDark(value: string): string {
  return value.replace(
    /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/gi,
    (_m, alpha) => `rgba(15, 23, 42, ${alpha})`,
  );
}

/**
 * Pale accent hexes (chosen to pop on the dark theme) are near-invisible as
 * text/fill on the white PDF. Remap them to a readable dark amber that keeps
 * the warm identity. Applies to text colour, borders, and SVG fill.
 */
const DARK_AMBER = "#B45309";
const PALE_ACCENT_REMAP: Record<string, string> = {
  // Keyed on both hex and the rgb() form the browser serializes inline
  // styles to when read back via element.style.
  "#fcd34d": DARK_AMBER, // high-tier text
  "rgb(252, 211, 77)": DARK_AMBER,
  "#fde68a": DARK_AMBER, // moderate-tier text
  "rgb(253, 230, 138)": DARK_AMBER,
  "#fef3c7": DARK_AMBER, // medically-emergent tier text + accent
  "rgb(254, 243, 199)": DARK_AMBER,
};
function remapPale(value: string): string | null {
  return PALE_ACCENT_REMAP[value.trim().toLowerCase()] ?? null;
}

function lightenForPdf(el: HTMLElement) {
  const s = el.style;

  if (s) {
    if (s.backgroundColor) {
      if (DARK_BG_HEX.has(s.backgroundColor)) {
        s.backgroundColor = "#FFFFFF";
      } else if (/rgba\(\s*255/i.test(s.backgroundColor)) {
        s.backgroundColor = s.backgroundColor.replace(
          /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([\d.]+)\s*\)/gi,
          (_m, alpha) =>
            `rgba(15, 23, 42, ${Math.min(0.06, Number(alpha) * 0.5)})`,
        );
      }
    }

    if (s.color) {
      if (WHITE_TEXT_VALUES.has(s.color)) {
        s.color = "#0F172A";
      } else if (/rgba\(\s*255/i.test(s.color)) {
        s.color = rgbaWhiteToDark(s.color);
      } else {
        const dark = remapPale(s.color);
        if (dark) s.color = dark;
      }
    }

    if (s.borderColor && /rgba\(\s*255/i.test(s.borderColor)) {
      s.borderColor = rgbaWhiteToDark(s.borderColor);
    }
    if (s.border && /rgba\(\s*255/i.test(s.border)) {
      s.border = rgbaWhiteToDark(s.border);
    }
    if (s.borderTop && /rgba\(\s*255/i.test(s.borderTop)) {
      s.borderTop = rgbaWhiteToDark(s.borderTop);
    }
    if (s.borderLeft && /rgba\(\s*255/i.test(s.borderLeft)) {
      s.borderLeft = rgbaWhiteToDark(s.borderLeft);
    }
    // Pale left-accent on tier cards (borderLeftColor uses the raw hex).
    if (s.borderLeftColor) {
      const dark = remapPale(s.borderLeftColor);
      if (dark) s.borderLeftColor = dark;
    }
    if (s.background && /radial-gradient/i.test(s.background)) {
      s.background = "none";
    }
  }

  const tag = el.tagName?.toLowerCase();
  if (
    tag === "text" ||
    tag === "circle" ||
    tag === "path" ||
    tag === "rect" ||
    tag === "polygon" ||
    tag === "line"
  ) {
    const fill = el.getAttribute("fill");
    if (fill && WHITE_TEXT_VALUES.has(fill)) {
      el.setAttribute("fill", "#0F172A");
    } else if (fill && /rgba\(\s*255/i.test(fill)) {
      el.setAttribute("fill", rgbaWhiteToDark(fill));
    } else if (fill === "var(--covert-black)") {
      el.setAttribute("fill", "#FFFFFF");
    }

    const stroke = el.getAttribute("stroke");
    if (stroke && WHITE_TEXT_VALUES.has(stroke)) {
      el.setAttribute("stroke", "#0F172A");
    } else if (stroke && /rgba\(\s*255/i.test(stroke)) {
      el.setAttribute("stroke", rgbaWhiteToDark(stroke));
    }
  }

  Array.from(el.children).forEach((c) => lightenForPdf(c as HTMLElement));
}

/** Print contact card that replaces the interactive CTA buttons. */
const CONTACT_CARD_HTML = `
  <div style="text-align:center;color:#0F172A;font-family:Satoshi,sans-serif;background-color:#F8FAFC;border:1px solid #E5E7EB;border-radius:12px;padding:20px 24px;">
    <p style="font-weight:700;font-size:18px;margin-bottom:12px;color:#0F172A;">Engage Covert Today</p>
    <p style="font-size:14px;margin-bottom:4px;color:#0F172A;">Jesse Lisson — Vice President, Covert</p>
    <p style="font-size:14px;margin-bottom:4px;color:#0F172A;">(602) 315-3842</p>
    <p style="font-size:14px;margin-bottom:4px;color:#0F172A;">jlisson@cleverbenefits.com</p>
    <p style="font-size:14px;color:#14B8A6;font-weight:600;">www.covertplan.com</p>
  </div>
`;

/**
 * Build the light-themed, print-ready clone of #proposal-output. Hidden on
 * screen (display:none); the @media print stylesheet reveals it and hides the
 * live app. Exported so a preview surface can render it for visual checks.
 */
export function buildPrintClone(): HTMLElement | null {
  const proposalEl = document.getElementById("proposal-output");
  if (!proposalEl) return null;

  const clone = proposalEl.cloneNode(true) as HTMLElement;
  clone.setAttribute("data-pdf-export", "true");
  clone.setAttribute("data-print-root", "true");
  clone.style.display = "none";

  const styleEl = document.createElement("style");
  styleEl.textContent = LIGHT_OVERRIDES_CSS;
  clone.insertBefore(styleEl, clone.firstChild);

  lightenForPdf(clone);

  clone
    .querySelectorAll("[data-cta-buttons]")
    .forEach((el) => (el.innerHTML = CONTACT_CARD_HTML));

  return clone;
}

export async function generatePDF(clientName: string): Promise<void> {
  const clone = buildPrintClone();
  if (!clone) return;

  document.body.appendChild(clone);

  // Wait for fonts so the print engine measures glyphs correctly.
  if (document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch {
      /* non-fatal */
    }
  }

  const prevTitle = document.title;
  const safeName = clientName.replace(/[^a-zA-Z0-9]/g, "_") || "Report";
  // The print dialog seeds the "Save as PDF" filename from document.title.
  document.title = `Covert_Proposal_${safeName}`;

  await new Promise<void>((resolve) => {
    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      window.removeEventListener("afterprint", cleanup);
      document.title = prevTitle;
      if (clone.parentNode) clone.parentNode.removeChild(clone);
      resolve();
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
    // window.print() blocks until the dialog closes in Chromium, so afterprint
    // has already fired by here; this is the fallback for browsers that don't.
    setTimeout(cleanup, 500);
  });
}
