import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export function elementToPdf(elementId, filename) {
    let input = document.getElementById(elementId);

    html2canvas(input).then((canvas) => {
        const img = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
            orientation: "landscape",
        });
        const imgProps = pdf.getImageProperties(img);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(filename);
    });
}
