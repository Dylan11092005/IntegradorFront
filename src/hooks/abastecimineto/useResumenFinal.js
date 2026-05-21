import { useState, useEffect, useContext } from "react";
import { pedidoConsumiblesAPI, detallePedidoConsumiblesAPI } from "../../helpers/api.js";
import { showCustomToast } from '../../components/globalComponents/CustomToaster.jsx';
import { useNavigate } from "react-router-dom";
import { contextoAbastecimiento } from '../../context/contextoAbastecimiento.jsx';

const useResumenFinal = () => {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { items, datosFormulario } = useContext(contextoAbastecimiento);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const data = await pedidoConsumiblesAPI.getAll();

      if (data && data.data && Array.isArray(data.data)) {
        const pedidosValidos = data.data.filter(
          item =>
            item.tipoComida &&
            item.tipoComida.trim() !== "" &&
            item.cantidadPersonas > 0 &&
            item.idAlbergue
        );

        const mapeado = pedidosValidos.map(item => ({
          id: item.id,
          seccion: "Pedido",
          tipo: item.tipoComida,
          unidad: "personas",
          cantidad: item.cantidadPersonas,
          fecha: item.fechaCreacion ? new Date(item.fechaCreacion).toLocaleDateString() : "-",
          albergue: `Albergue #${item.idAlbergue}`,
          idAlbergue: item.idAlbergue,
          idUsuarioCreacion: item.idUsuarioCreacion,
        }));

        setPedidos(mapeado);
      } else {
        setPedidos([]);
      }
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setError(err.message);
      showCustomToast("Error", `Error al cargar pedidos: ${err.message}`);
    }
  };

  const validarPedido = (pedido) => {
    if (!pedido.tipo || typeof pedido.tipo !== 'string' || pedido.tipo.trim() === "") {
      return "El campo 'tipoComida' es obligatorio y debe ser un texto válido.";
    }
    if (!pedido.cantidad || isNaN(pedido.cantidad) || Number(pedido.cantidad) <= 0) {
      return "El campo 'cantidadPersonas' es obligatorio y debe ser mayor que cero.";
    }
    if (!pedido.idAlbergue || isNaN(pedido.idAlbergue) || Number(pedido.idAlbergue) <= 0) {
      return "El campo 'idAlbergue' es obligatorio y debe ser un número válido.";
    }
    if (!pedido.idUsuarioCreacion || isNaN(pedido.idUsuarioCreacion) || Number(pedido.idUsuarioCreacion) <= 0) {
      return "El campo 'idUsuarioCreacion' es obligatorio y debe ser un número válido.";
    }
    return null;
  };

  const editarItem = async (index, nuevoItem) => {
    try {
      const id = pedidos[index]?.id;
      if (!id) throw new Error("ID inválido para editar");

      const errorValidacion = validarPedido(nuevoItem);
      if (errorValidacion) {
        showCustomToast("Error", errorValidacion);
        return;
      }

      const payload = {
        tipoComida: nuevoItem.tipo.trim(),
        cantidadPersonas: Number(nuevoItem.cantidad),
        idAlbergue: Number(nuevoItem.idAlbergue),
        idUsuarioCreacion: Number(nuevoItem.idUsuarioCreacion),
      };

      await pedidoConsumiblesAPI.update(id, payload);
      showCustomToast("Éxito", "Pedido actualizado exitosamente");
      await cargarPedidos();
    } catch (err) {
      setError(err.message);
      showCustomToast("Error", `Error al actualizar pedido: ${err.message}`);
    }
  };

  const eliminarItem = async (index) => {
    try {
      const id = pedidos[index]?.id;
      if (!id) throw new Error("ID inválido para eliminar");

      await pedidoConsumiblesAPI.remove(id);
      showCustomToast("Éxito", "Pedido eliminado exitosamente");
      await cargarPedidos();
    } catch (err) {
      setError(err.message);
      showCustomToast("Error", `Error al eliminar pedido: ${err.message}`);
    }
  };

  const descargarResumen = () => {
    const todosLosDatos = [];

    if (datosFormulario) {
      todosLosDatos.push({
        seccion: "Formulario Actual",
        tipo: datosFormulario.tipo && datosFormulario.tipo.trim() !== "" ? datosFormulario.tipo : "-",
        unidad: "personas",
        cantidad: datosFormulario.cantidad && datosFormulario.cantidad > 0 ? datosFormulario.cantidad : "-",
        fecha: datosFormulario.fecha || "-",
        albergue: datosFormulario.albergue?.nombre || "-",
      });
    }

    if (items && items.length > 0) {
      items.forEach(item => {
        todosLosDatos.push({
          seccion: item.seccion || "Producto",
          tipo: item.tipo || "-",
          unidad: item.unidad || "-",
          cantidad: item.cantidad && item.cantidad > 0 ? item.cantidad : "-",
          fecha: datosFormulario?.fecha || "-",
          albergue: datosFormulario?.albergue?.nombre || "-",
        });
      });
    }

    pedidos.forEach(pedido => {
      todosLosDatos.push({
        seccion: pedido.seccion || "-",
        tipo: pedido.tipo && pedido.tipo.trim() !== "" ? pedido.tipo : "-",
        unidad: pedido.unidad || "-",
        cantidad: pedido.cantidad && pedido.cantidad > 0 ? pedido.cantidad : "-",
        fecha: pedido.fecha || "-",
        albergue: pedido.albergue || "-",
      });
    });


    const datosFiltrados = todosLosDatos.filter(item => {
      const tipoValido = item.tipo && item.tipo !== "-";
      const cantidadValida = item.cantidad && item.cantidad !== "-";
      return tipoValido && cantidadValida;
    });

    if (!datosFiltrados.length) {
      showCustomToast("Warning", "No hay datos válidos para descargar.");
      return;
    }

    const encabezado = ["Sección", "Tipo", "Unidad", "Cantidad", "Fecha", "Albergue"].join(",");
    const cuerpo = datosFiltrados
      .map(i => `${i.seccion},${i.tipo},${i.unidad},${i.cantidad},${i.fecha},${i.albergue}`)
      .join("\n");

    const textoConBOM = '\uFEFF' + `${encabezado}\n${cuerpo}`;
    const blob = new Blob([textoConBOM], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resumen_abastecimiento_completo.csv";
    a.click();
    URL.revokeObjectURL(url);

    showCustomToast("Éxito", "Descarga completada exitosamente.");
  };

  const guardarDetallePedido = async (idPedido, items) => {
    try {
      for (const item of items) {
        await detallePedidoConsumiblesAPI.create({
          idPedido,
          idConsumible: item.idConsumible,
          cantidad: item.cantidad,
        });
      }
      showCustomToast("Éxito", "Detalle del pedido guardado correctamente");
    } catch (err) {
      setError(err.message);
      showCustomToast("Error", `Error al guardar detalle: ${err.message}`);
    }
  };

  const guardarPedidoYDetalle = async () => {
    try {
      const idUsuario = Number(localStorage.getItem("idUsuario")) || 42;

      const pedidoPayload = {
        tipoComida: datosFormulario.tipo,
        cantidadPersonas: datosFormulario.cantidad,
        idAlbergue: datosFormulario.albergue?.id || datosFormulario.idAlbergue,
        idUsuarioCreacion: idUsuario,
      };

      const pedidoRes = await pedidoConsumiblesAPI.create(pedidoPayload);
      const idPedido = pedidoRes.id || pedidoRes.data?.id;

      if (!idPedido) throw new Error("No se pudo obtener el id del pedido creado");

      if (!items || items.length === 0) {
        showCustomToast("Warning", "No hay productos para guardar en el detalle");
        return;
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const detallePayload = {
          idPedido,
          idConsumible: item.idConsumible,
          cantidad: item.cantidad,
        };
        try {
          await detallePedidoConsumiblesAPI.create(detallePayload);
        } catch (detalleError) {
          throw new Error(`Error guardando producto ${i + 1}: ${detalleError.message}`);
        }
      }

      showCustomToast("Éxito", "Pedido y detalle guardados correctamente");
      descargarResumen();

    } catch (err) {
      setError(err.message);
      showCustomToast("Error", `Error al guardar pedido: ${err.message}`);
    }
  };

  return {
    items,
    pedidos,
    datosFormulario,
    error,
    descargarResumen,
    eliminarItem,
    editarItem,
    navigate,
    guardarDetallePedido,
    guardarPedidoYDetalle,
  };
};

export default useResumenFinal;
