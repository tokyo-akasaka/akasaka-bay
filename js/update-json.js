async function loadMenuBebidas() {
  const res = await fetch("json/menu-bebidas.json");
  const data = await res.json();
  const root = document.getElementById("menu-bebidas");

  data.sections.forEach(function renderSection(sec) {
    const wrap = document.createElement("section");
    wrap.className = "menu-section";

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
        price = `🍷 ${it.price_by_glass}€ <br/> 🍾 ${it.price_by_bottle}€`;
      } else if (it.price_by_glass) {
        price = `🍷 ${it.price_by_glass}€`;
      } else if (it.price_by_bottle) {
        price = `🍾 ${it.price_by_bottle}€`;
      } else {
        price = it.price + "€";
      }

      const row = document.createElement("div");
      row.className = "menu-item";

      row.innerHTML =
        '<div class="item-info">' +
        (it.code ? `<div class="code">${it.code}</div>` : "") +
        `<div class="es">${it.name_es}</div>` +
        `<div class="en muted">${it.name_en || ""}</div>` +
        (it.name_cn ? `<div class="cn muted">${it.name_cn}</div>` : "") +
        "</div>" +
        `<div class="item-price">${price}</div>`;

      wrap.appendChild(row);
    });

    root.appendChild(wrap);
  });
}

async function loadMenuComida() {
  const res = await fetch("json/menu-comida.json");
  const data = await res.json();

  const resRel = await fetch("json/menu-alergenos.json");
  const relData = await resRel.json();

  const resAll = await fetch("json/alergenos.json");
  const allergens = await resAll.json();

  const root = document.getElementById("menu-comida");
  const allergenPopup = document.getElementById("allergen-popup");
  const overlay = document.getElementById("allergen-overlay");

  // 👉 Función para mostrar alérgenos
  function showAllergensForRow(row, codes) {
    if (!codes || codes.length === 0) {
      allergenPopup.innerHTML =
        "<p>✅ No contiene alérgenos </br>✅ No allergens declared </br>✅ 不含过敏原</p>";
    } else {
      allergenPopup.innerHTML = codes
        .map((id) => {
          const al = allergens.allergens.find((a) => a.id === id);
          return `<div class="allergen">
                    <img src="${al.slug}" alt="${al.es}">
                    <span>${al.es}</span>
                  </div>`;
        })
        .join("");
    }

    const rect = row.getBoundingClientRect();
    allergenPopup.style.top = rect.bottom + window.scrollY + "px";
    allergenPopup.style.left = rect.left + "px";

    allergenPopup.style.display = "flex";
    overlay.style.display = "block";
    document.body.style.overflow = "hidden"; // bloquea scroll
  }

  // 👉 Renderizado de secciones
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
      const row = document.createElement("div");
      row.className = "menu-item";

      // 👉 Lógica avanzada de precios
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

      // 👉 Render del row
      row.innerHTML =
        '<div class="item-info">' +
        (it.code ? `<div class="code">${it.code}</div>` : "") +
        `<div class="es">${it.name_es}</div>` +
        `<div class="en muted">${it.name_en || ""}</div>` +
        (it.name_cn ? `<div class="cn muted">${it.name_cn}</div>` : "") +
        "</div>" +
        priceBlock;

      // 👉 Evento de click para popup
      row.addEventListener("click", () => {
        showAllergensForRow(row, relData[it.code]);
      });

      wrap.appendChild(row);
    });

    root.appendChild(wrap);
  });

  // 👉 Cerrar cuando se pinche el overlay
  overlay.addEventListener("click", () => {
    allergenPopup.style.display = "none";
    overlay.style.display = "none";
    document.body.style.overflow = ""; // libera scroll
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Crear contenedor fijo
  const fixed = document.getElementsByClassName("fixed-bottom")[0];

  // Eliminar automáticamente después de 10 segundos
  setTimeout(() => fixed.remove(), 10000);
});

// 👉 Llamadas de carga (fuera de las funciones)
loadMenuBebidas();
loadMenuComida();
