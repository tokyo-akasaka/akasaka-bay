// src/App.jsx
import TestTokenQR from "./components/TestTokenQR";
import TestValidTokenQR from "./components/TestValidTokenQR";

export default function App() {
  return (
    <div className="container">
      <main>
        <h1 className="logo">
          <img src="/akasaka-bay-logo.png" alt="Logo del restaurante" />
        </h1>
        <section className="menus">
          <h2>Bienvenido a nuestra carta digital</h2>
          <TestTokenQR />
          <TestValidTokenQR />
        </section>
      </main>
    </div>
  );
}
