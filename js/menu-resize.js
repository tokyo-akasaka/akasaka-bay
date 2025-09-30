function fitMenuText() {
  const buttons = document.querySelectorAll(".menu-btn");

  buttons.forEach((btn) => {
    let fontSize = 100; // empezamos al 100% (≈16px si root=16px)
    btn.style.fontSize = fontSize + "%";

    // reducir hasta que el texto quepa
    while (btn.scrollWidth > btn.clientWidth && fontSize > 80) {
      fontSize -= 1; // reducimos en 1% cada paso
      btn.style.fontSize = fontSize + "%";
    }
  });
}

window.addEventListener("load", fitMenuText);
window.addEventListener("resize", fitMenuText);
