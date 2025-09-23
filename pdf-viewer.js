// pdf-viewer.js

// Configurar pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.7.570/pdf.worker.min.js";

function initPDFViewer(
  pdfUrl,
  canvasId,
  prevBtnId,
  nextBtnId,
  pageNumId,
  pageCountId
) {
  let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.3,
    canvas = document.getElementById(canvasId),
    ctx = canvas.getContext("2d");

  function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function (page) {
      const viewport = page.getViewport({ scale: scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
      const renderTask = page.render(renderContext);

      renderTask.promise.then(function () {
        pageRendering = false;
        if (pageNumPending !== null) {
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });

    document.getElementById(pageNumId).textContent = num;
  }

  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
  }

  function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
  }

  document.getElementById(prevBtnId).addEventListener("click", onPrevPage);
  document.getElementById(nextBtnId).addEventListener("click", onNextPage);

  pdfjsLib.getDocument(pdfUrl).promise.then(function (pdf) {
    pdfDoc = pdf;
    document.getElementById(pageCountId).textContent = pdfDoc.numPages;
    renderPage(pageNum);
  });
}
