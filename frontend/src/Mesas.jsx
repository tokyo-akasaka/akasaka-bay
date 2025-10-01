// frontend/src/Mesas.jsx
import { useEffect, useState } from "react"
import { supabase } from "./lib/supabaseClient"

function Mesas() {
  const [mesas, setMesas] = useState([])

  useEffect(() => {
    async function fetchMesas() {
      const { data, error } = await supabase
        .from("mesas")
        .select("id, numero, estado, num_comensales, num_comensales_activos")

      if (error) {
        console.error("Error cargando mesas:", error)
      } else {
        console.log("Mesas recibidas:", data)
        setMesas(data)
      }
    }

    fetchMesas()

    // Subscripción en tiempo real
    const channel = supabase
      .channel("mesas-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "mesas" },
        (payload) => {
          console.log("Cambio detectado en mesas:", payload)
          fetchMesas()
        }
      )
      .subscribe()

    // Limpieza al desmontar el componente
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div>
      <h2>🍣 Mesas abiertas</h2>
      <ul>
        {mesas.map((m) => (
          <li key={m.id}>
            Mesa {m.numero} — {m.num_comensales_activos}/{m.num_comensales} comensales activos
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Mesas
