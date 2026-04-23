"use client";

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
  clone.style.width = "794px";
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  document.body.appendChild(clone);

  const ctaButtons = clone.querySelectorAll("[data-cta-buttons]");
  ctaButtons.forEach((el) => {
    el.innerHTML = `
      <div style="text-align:center;color:white;font-family:Cabin,sans-serif;">
        <p style="font-weight:700;font-size:18px;margin-bottom:12px;">Engage Covert Today</p>
        <p style="font-size:14px;margin-bottom:4px;">Jesse Lisson — Vice President, Covert</p>
        <p style="font-size:14px;margin-bottom:4px;">(602) 315-3842</p>
        <p style="font-size:14px;margin-bottom:4px;">jlisson@cleverbenefits.com</p>
        <p style="font-size:14px;">www.covertplan.com</p>
      </div>
    `;
  });

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;
    let page = 1;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    addPageFooter(pdf, page, pdfWidth, pdfHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = -(pdfHeight * page);
      pdf.addPage();
      page++;
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      addPageFooter(pdf, page, pdfWidth, pdfHeight);
      heightLeft -= pdfHeight;
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
  pdf.setFillColor(243, 244, 246);
  pdf.rect(0, height - 10, width, 10, "F");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(109, 116, 130);
  pdf.text(
    `Covert  |  Page ${page}  |  © 2026 Clever Ventures, LLC — www.covertplan.com`,
    width / 2,
    height - 4,
    { align: "center" },
  );
}
