document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const frame = document.getElementById("pdf-frame");

  if (frame) {
    frame.onload = () => {
      if (loader) loader.style.display = "none";
    };
  }
});
