// pdf-viewer.js (versión scroll continuo)

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.7.570/pdf.worker.min.js";

function initPDFViewer(pdfUrl, containerId) {
  const container = document.getElementById(containerId);

  pdfjsLib.getDocument(pdfUrl).promise.then(function (pdfDoc) {
    // Renderizar todas las páginas en orden
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      pdfDoc.getPage(pageNum).then(function (page) {
        const scale = 1.3;
        const viewport = page.getViewport({ scale: scale });

        // Crear un canvas por página
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.display = "block";
        canvas.style.margin = "20px auto";

        container.appendChild(canvas);

        // Renderizar página en el canvas
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        page.render(renderContext);
      });
    }
  });
}
