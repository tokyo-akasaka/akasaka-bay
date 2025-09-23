// pdf-viewer.js (scroll continuo adaptado a móviles)

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.7.570/pdf.worker.min.js";

function initPDFViewer(pdfUrl, containerId) {
  const container = document.getElementById(containerId);

  pdfjsLib.getDocument(pdfUrl).promise.then(function (pdfDoc) {
    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      pdfDoc.getPage(pageNum).then(function (page) {
        // Escalar al ancho del contenedor
        const desiredWidth = container.clientWidth;
        const viewport = page.getViewport({ scale: 1 });
        const scale = desiredWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale: scale });

        // Crear canvas ajustado
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;
        canvas.style.display = "block";
        canvas.style.margin = "20px auto";

        container.appendChild(canvas);

        // Renderizar página
        const renderContext = {
          canvasContext: ctx,
          viewport: scaledViewport,
        };
        page.render(renderContext);
      });
    }
  });
}
