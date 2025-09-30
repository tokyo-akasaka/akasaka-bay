# 🍣 Akasaka Bay – Interactive Menu

Bienvenido al repositorio oficial del proyecto **Akasaka Bay**, una aplicación web ligera que transforma la experiencia de mostrar menús en restaurantes.\
El objetivo fue **crear una carta interactiva** con una solución **HTML dinámica**, basada en datos estructurados, accesible, escalable y fácil de mantener.

---

## ✨ Características principales

- **Menú dinámico en JSON**

  - `menu-comida.json` → carta de comida
  - `menu-bebidas.json` → carta de bebidas
  - Cada sección (entrantes, sushi, postres, vinos, etc.) está definida en formato limpio y multilingüe (**ES / EN / 中文**).

- **Gestión de alérgenos**

  - `alergenos.json` → catálogo maestro con 14 alérgenos obligatorios en la UE (nombre, traducciones, icono).
  - `menu-alergenos.json` → relación código de plato ↔ alérgenos.
  - Separar catálogo y relación permite escalar fácilmente sin duplicar datos.

- **UI Interactiva**

  - Cada plato es **clicable**: se muestra un popup flotante con iconos de alérgenos.
  - El popup bloquea el scroll mientras está visible y se cierra al hacer clic fuera.
  - Tooltip inicial animado informa al usuario: _“Haz clic en cada plato para ver alérgenos”_.
  - Responsive con **media queries** y sistema **grid** para buena visualización en móvil.

- **Internacionalización básica**

  - Los menús incluyen **español**, **inglés** y **chino simplificado**.
  - Los títulos de sección y los nombres de platos aparecen con traducciones alineadas.

- **Lógica avanzada de precios**

  - En bebidas: gestión diferenciada de **precio por copa** y **precio por botella**.
  - En comida: posibilidad de **precios con descripción extendida** gracias a la estructura del JSON.

---

## 🛠️ Arquitectura

- **Frontend**:

  - HTML5 + CSS3 (flexbox + grid).
  - JavaScript puro (sin frameworks pesados).
  - Tooltip y popup animados con CSS transitions.

- **Datos**:

  - Menús y alérgenos servidos como **archivos JSON estáticos**.
  - Fácil de versionar y mantener en GitHub.

- **Hosting / Deploy**:

  - Optimizado para **GitHub Pages** o cualquier hosting estático.
  - No requiere backend.

---

## 📂 Estructura del repositorio

```
/json
├── menu-comida.json
├── menu-bebidas.json
├── alergenos.json
└── menu-alergenos.json
/css
├── styles.css
/js
├── menu-comida.js
├── menu-bebidas.js
└── alergenos.js
/index.html
/carta-bebida.html
/carta-comida.html
/menu-degustacion.html
/img
  └── /alergenos
```

---

## 🚀 Instalación y uso

1. Clonar repositorio:

   ```bash
   git clone https://github.com/<tu-usuario>/akasaka-bay.git
   cd akasaka-bay
   ```

2. Abrir `index.html` en el navegador o servir con un servidor estático:

   ```bash
   npx serve .
   ```

3. Disfrutar del menú dinámico 🎉

---

## 📌 Roadmap

Puedes consultar el roadmap del proyecto aquí: [Roadmap – Akasaka Bay](./RoadmapAkasakaBay.html)

---

## 📜 Licencia

Este proyecto se distribuye bajo licencia **MIT**.\
Libre de usar, modificar y desplegar, siempre y cuando se haga mención al creador:\
**Vasil Hristov Gugov**

---

## 🙌 Créditos

Desarrollado como proyecto de apoyo de la carta interactiva del restaurante **#Akasaka-Bay**.\
Especial atención a: accesibilidad, usabilidad y escalabilidad de datos.
