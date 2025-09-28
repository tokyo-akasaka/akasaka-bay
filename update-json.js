async function loadMenuBebidas() {
  const res = await fetch("menu-bebidas.json");
  const data = await res.json();
  const root = document.getElementById("menu-bebidas");

  data.sections.forEach(function renderSection(sec) {
    const wrap = document.createElement("section");
    wrap.className = "menu-section";

    // Añadir chino al título si existe
    wrap.innerHTML =
      "<h3>" +
      sec.title_es +
      ' · <span class="muted">' +
      sec.title_en +
      (sec.title_cn ? ' · <span class="cn">' + sec.title_cn + "</span>" : "") +
      "</span></h3>";

    sec.items.forEach(function renderItem(it) {
      let price = "";
      if (it.price_by_glass && it.price_by_bottle) {
        price =
          "🍷 " +
          it.price_by_glass +
          "€ <br/>" +
          "🍾 " +
          it.price_by_bottle +
          "€";
      } else if (it.price_by_glass) {
        price = "🍷 " + it.price_by_glass + "€";
      } else if (it.price_by_bottle) {
        price = "🍾 " + it.price_by_bottle + "€";
      } else {
        price = it.price + "€";
      }

      const row = document.createElement("div");
      row.className = "menu-item";

      row.innerHTML =
        '<div class="item-info">' +
        (it.code ? '<div class="code">' + it.code + "</div>" : "") +
        '<div class="es">' +
        it.name_es +
        "</div>" +
        '<div class="en muted">' +
        (it.name_en || "") +
        "</div>" +
        (it.name_cn ? '<div class="cn muted">' + it.name_cn + "</div>" : "") +
        "</div>" +
        '<div class="item-price">' +
        price +
        "</div>";

      wrap.appendChild(row);
    });

    root.appendChild(wrap);
  });
}

async function loadMenuComida() {
  const res = await fetch("menu-comida.json");
  const data = await res.json();
  const root = document.getElementById("menu-comida");

  data.sections.forEach(function renderSection(sec) {
    const wrap = document.createElement("section");
    wrap.className = "menu-section";

    wrap.innerHTML =
      "<h3>" +
      sec.title_es +
      "<br/>" +
      ' · <span class="muted">' +
      sec.title_en +
      (sec.title_cn ? ' <span class="cn"> · ' + sec.title_cn + "</span>" : "") +
      "</span></h3>";

    sec.items.forEach(function renderItem(it) {
      // 👉 construimos contenedor del precio
      let priceBlock = "";
      if (it.price) {
        priceBlock =
          '<div class="price-container">' +
          '<div class="price-main">' +
          it.price +
          "€</div>" +
          (it.price_descript
            ? '<div class="price-descript">' + it.price_descript + "</div>"
            : "") +
          "</div>";
      }

      const row = document.createElement("div");
      row.className = "menu-item";

      row.innerHTML =
        '<div class="item-info">' +
        (it.code ? '<div class="code">' + it.code + "</div>" : "") +
        '<div class="es">' +
        it.name_es +
        "</div>" +
        '<div class="en muted">' +
        (it.name_en || "") +
        "</div>" +
        (it.name_cn ? '<div class="cn muted">' + it.name_cn + "</div>" : "") +
        "</div>" +
        // 👉 aquí insertamos el nuevo bloque de precio
        priceBlock;

      wrap.appendChild(row);
    });

    root.appendChild(wrap);
  });
}

// Cargar ambos menús
loadMenuBebidas();
loadMenuComida();
