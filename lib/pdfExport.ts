"use client";

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

export async function generatePDF(clientName: string): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const proposalEl = document.getElementById("proposal-output");
  if (!proposalEl) return;

  const tickerElements = proposalEl.querySelectorAll("[data-ticker]");
  tickerElements.forEach((el) => el.setAttribute("data-paused", "true"));

  const clone = proposalEl.cloneNode(true) as HTMLElement;
  clone.setAttribute("data-pdf-export", "true");
  clone.style.width = "794px";
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.backgroundColor = "#FFFFFF";

  const styleEl = document.createElement("style");
  styleEl.textContent = LIGHT_OVERRIDES_CSS;
  clone.insertBefore(styleEl, clone.firstChild);

  document.body.appendChild(clone);

  lightenForPdf(clone);

  // Replace CTA buttons with print-friendly contact card
  const ctaButtons = clone.querySelectorAll("[data-cta-buttons]");
  ctaButtons.forEach((el) => {
    el.innerHTML = `
      <div style="text-align:center;color:#0F172A;font-family:Satoshi,sans-serif;background-color:#F8FAFC;border:1px solid #E5E7EB;border-radius:12px;padding:20px 24px;">
        <p style="font-weight:700;font-size:18px;margin-bottom:12px;color:#0F172A;">Engage Covert Today</p>
        <p style="font-size:14px;margin-bottom:4px;color:#0F172A;">Jesse Lisson — Vice President, Covert</p>
        <p style="font-size:14px;margin-bottom:4px;color:#0F172A;">(602) 315-3842</p>
        <p style="font-size:14px;margin-bottom:4px;color:#0F172A;">jlisson@cleverbenefits.com</p>
        <p style="font-size:14px;color:#14B8A6;font-weight:600;">www.covertplan.com</p>
      </div>
    `;
  });

  try {
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const footerReservedMm = 14;
    const pageTopMm = 0;
    const usablePageMm = pdfHeight - footerReservedMm - pageTopMm;

    // Render each section to its own canvas, then pack onto pages.
    const sections = Array.from(
      clone.querySelectorAll("section, footer"),
    ) as HTMLElement[];

    type SectionImage = {
      dataUrl: string;
      mmHeight: number;
    };

    const sectionImages: SectionImage[] = [];
    for (const section of sections) {
      const canvas = await html2canvas(section, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 794,
        backgroundColor: "#FFFFFF",
      });
      const mmHeight = (canvas.height * pdfWidth) / canvas.width;
      sectionImages.push({
        dataUrl: canvas.toDataURL("image/jpeg", 0.95),
        mmHeight,
      });
    }

    // Pack sections onto pages. Each section is placed in full —
    // a section never gets split across a page boundary.
    let pageNumber = 1;
    let cursorMm = pageTopMm;
    addPageFooter(pdf, 1, pdfWidth, pdfHeight);

    for (const img of sectionImages) {
      // Clamp absurdly tall sections to a single page (shouldn't happen
      // with current section heights ~< 265mm, but be defensive)
      const drawHeight = Math.min(img.mmHeight, usablePageMm);
      const fitsOnCurrentPage =
        cursorMm + drawHeight <= usablePageMm + pageTopMm + 0.5;

      if (!fitsOnCurrentPage) {
        pageNumber++;
        pdf.addPage();
        cursorMm = pageTopMm;
        addPageFooter(pdf, pageNumber, pdfWidth, pdfHeight);
      }

      pdf.addImage(img.dataUrl, "JPEG", 0, cursorMm, pdfWidth, drawHeight);
      cursorMm += drawHeight;
    }

    const safeName = clientName.replace(/[^a-zA-Z0-9]/g, "_");
    pdf.save(`Covert_Proposal_${safeName}.pdf`);
  } finally {
    document.body.removeChild(clone);
    tickerElements.forEach((el) => el.removeAttribute("data-paused"));
  }
}

function addPageFooter(
  pdf: import("jspdf").jsPDF,
  page: number,
  width: number,
  height: number,
) {
  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, height - 10, width, 10, "F");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  pdf.text(
    `Covert  |  Page ${page}  |  © 2026 Clever Ventures, LLC — www.covertplan.com`,
    width / 2,
    height - 4,
    { align: "center" },
  );
}
