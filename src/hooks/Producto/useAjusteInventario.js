import { useEffect, useState } from "react";
import { productosAPI, ajusteInventarioAPI } from "../../helpers/api";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export default function useAjusteInventario() {
  const [productos, setProductos] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [idProducto, setIdProducto] = useState("");
  const [motivo, setMotivo] = useState("");
  const [cantidadOriginal, setCantidadOriginal] = useState("");
  const [cantidadReal, setCantidadReal] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProductos = async () => {
    try {
      const res = await productosAPI.getAll();
      setProductos(res.data || []);
    } catch {
      showCustomToast("Error", "Error al cargar productos.", "error");
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    const productoSeleccionado = productos.find(p => p.id === Number(idProducto));
    setCantidadOriginal(productoSeleccionado?.cantidad ?? "");
    setCantidadReal("");
    setMotivo("");
  }, [idProducto, productos]);

  const handleSelectProducto = (producto) => {
    setIdProducto(producto?.id || "");
    setBusquedaProducto(producto ? `${producto.codigoProducto} - ${producto.nombre}` : "");
  };

  const handleAjuste = async (e) => {
    e.preventDefault();
    if (!idProducto || !motivo || cantidadOriginal === "" || cantidadReal === "") {
      showCustomToast("Error", "Completa todos los campos.", "error");
      return;
    }
    setLoading(true);
    try {
      await ajusteInventarioAPI.create({
        idProducto: Number(idProducto),
        justificacion: motivo,
        cantidadOriginal: Number(cantidadOriginal),
        cantidadAjustada: Number(cantidadReal),
        idUsuarioCreacion: localStorage.getItem("idUsuario"),
      });
      showCustomToast("Éxito", "Ajuste registrado correctamente.", "success");
      setIdProducto("");
      setMotivo("");
      setCantidadOriginal("");
      setCantidadReal("");
      setBusquedaProducto("");
      fetchProductos();
    } catch {
      showCustomToast("Error", "Error al registrar el ajuste.", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    productos,
    busquedaProducto,
    setBusquedaProducto,
    showSugerencias,
    setShowSugerencias,
    idProducto,
    motivo,
    cantidadOriginal,
    cantidadReal,
    loading,
    handleSelectProducto,
    handleAjuste,
    setMotivo,
    setCantidadReal,
  };
}
