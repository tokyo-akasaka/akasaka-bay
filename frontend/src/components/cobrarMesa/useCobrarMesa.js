// src/components/cobrarMesa/useCobrarMesa.jsx

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export function useCobrarMesa(mesaId) {
  const [mesa, setMesa] = useState(null);
  const [comensales, setComensales] = useState([]);
  const [totalMesa, setTotalMesa] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [pendientes, setPendientes] = useState(0);

  const loadData = async () => {
    console.log("useCobrarMesa.loadData() llamado para mesaId:", mesaId);
    try {
      setCargando(true);

      const { data: mesaData, error: mesaErr } = await supabase
        .from("mesas_con_comensales")
        .select("*, comensales_detalle")
        .eq("id", mesaId)
        .single();

      if (mesaErr) {
        console.error("Error al obtener mesa:", mesaErr);
        setError(mesaErr);
        setMesa(null);
        return;
      }

      console.log("Datos de mesa obtenidos:", mesaData);
      setMesa(mesaData);

      const detalle = mesaData.comensales_detalle || [];
      setComensales(detalle);

      const totalCalc = detalle.reduce((acc, c) => acc + (c.subtotal || 0), 0);
      setTotalMesa(totalCalc);

      let totalPend = 0;
      detalle.forEach((c) => {
        if (c.platos && Array.isArray(c.platos)) {
          totalPend += c.platos.filter((p) => p.estado === "pendiente").length;
        }
      });
      setPendientes(totalPend);
    } catch (err) {
      console.error("Error en loadData:", err);
      setError(err);
    } finally {
      setCargando(false);
    }
  };

  const cobrarYcerrar = async () => {
    if (!mesaId) {
      setError("No hay ID de mesa");
      return { success: false, error: "No mesaId" };
    }
    if (pendientes > 0) {
      setError("Existen platos pendientes, no se puede cerrar.");
      return { success: false, error: "Pendientes > 0" };
    }

    try {
      console.log("Cerrando mesa en tabla mesas, mesaId:", mesaId);

      // 1. Actualizar tabla `mesas` para cerrar la sesión
      const { data: mesaUpdateData, error: mesaErr } = await supabase
        .from("mesas")
        .update({ estado: false })
        .eq("id", mesaId)
        .select("id, numero");

      if (mesaErr) {
        console.error("Error al actualizar mesa:", mesaErr);
        throw mesaErr;
      }

      if (!mesaUpdateData || mesaUpdateData.length === 0) {
        console.error("No se actualizó ninguna fila en mesa.");
        throw new Error("No se actualizó mesa");
      }

      const mesaCerrada = mesaUpdateData[0];
      console.log("Mesa cerrada:", mesaCerrada);

      // 2. Actualizar comensales (marcar como pagado / inactivo)
      const idsCom = comensales.map((c) => c.id);
      console.log("IDs de comensales a actualizar:", idsCom);

      const { data: comUpdateData, error: comErr } = await supabase
        .from("comensales")
        .update({ activo: false, pagado: true })
        .in("id", idsCom)
        .eq("mesa_id", mesaId)
        .select("id");

      if (comErr) {
        console.error("Error al actualizar comensales:", comErr);
        throw comErr;
      }

      console.log("Comensales actualizados:", comUpdateData);

      // 3. Resetear la mesa física (para que aparezca cerrada y disponible)
      if (mesaCerrada.numero !== undefined && mesaCerrada.numero !== null) {
        const { error: fisicaErr } = await supabase
          .from("mesas_fisicas")
          .update({
            esta_abierta: false,
            session_id_activa: null,
            camarero_id: null,
          })
          .eq("numero", mesaCerrada.numero);

        if (fisicaErr) {
          console.error("Error al actualizar mesas_fisicas:", fisicaErr);
          throw fisicaErr;
        }
        console.log("mesas_fisicas actualizada correctamente");
      } else {
        console.warn(
          "No se encontró número de mesa para resetear mesa física."
        );
      }

      // 4. Recargar datos
      await loadData();

      return { success: true };
    } catch (err) {
      console.error("Error al cobrarYcerrar:", err);
      setError(err);
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    if (!mesaId) return;
    loadData();

    const channel = supabase
      .channel(`cobrar-mesa-${mesaId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "lineas_pedido",
          filter: `mesa_id=eq.${mesaId}`,
        },
        loadData
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comensales",
          filter: `mesa_id=eq.${mesaId}`,
        },
        loadData
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mesaId]);

  return {
    mesa,
    comensales,
    totalMesa,
    pendientes,
    cargando,
    error,
    loadData,
    cobrarYcerrar,
  };
}
