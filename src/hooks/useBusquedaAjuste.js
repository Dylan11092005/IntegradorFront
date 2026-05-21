import { useEffect, useState } from "react";
import { ajusteInventarioAPI, productosAPI } from "../helpers/api.js";
import { showCustomToast } from "../components/globalComponents/CustomToaster";

export const useBusquedaAjuste = () => {
  const [productos, setProductos] = useState([]);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [idProducto, setIdProducto] = useState(null);

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProductos = async () => {
    try {
      const res = await productosAPI.getAll();
      setProductos(res.data || []);
    } catch {
      showCustomToast("Error", "Error al cargar productos.", "error");
      setProductos([]);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Cuando cambia idProducto seleccionado, actualiza solo el id y pone el nombre solo en el input
  useEffect(() => {
    if (idProducto !== null) {
      const prod = productos.find((p) => p.id === Number(idProducto));
      if (prod) {
        if (prod.nombre !== busquedaProducto) {
          setBusquedaProducto(prod.nombre); // Solo el nombre para que sea editable
        }
      }
    }
  }, [idProducto, productos]);

  // Filtra productos para sugerencias con texto escrito
  const productosFiltrados = productos.filter((producto) => {
    const texto = busquedaProducto.toLowerCase();
    return (
      producto.nombre.toLowerCase().includes(texto) ||
      producto.codigoProducto.toLowerCase().includes(texto)
    );
  });

  // Cuando el usuario escribe, actualiza texto y limpia selección
  const handleBusquedaChange = (texto) => {
    setBusquedaProducto(texto);
    setShowSugerencias(true);
    if (texto.trim() === "") {
      setIdProducto(null);
    }
  };

  // Cuando selecciona un producto, actualiza id y texto con nombre
  const handleProductoSelect = (producto) => {
    setIdProducto(producto?.id || null);
    setBusquedaProducto(producto?.nombre || "");
    setShowSugerencias(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const textoBusqueda = idProducto
      ? productos.find((p) => p.id === Number(idProducto))?.nombre || ""
      : busquedaProducto;

    if (!textoBusqueda.trim()) {
      showCustomToast("Error", "Debe ingresar o seleccionar un nombre de producto.", "error");
      return;
    }

    setLoading(true);
    setResultados([]);

    try {
      const res = await ajusteInventarioAPI.getByNombreProducto(textoBusqueda);
      setResultados(res.data || []);

      if (!res.data || res.data.length === 0) {
        showCustomToast("Error", "No se encontraron ajustes para este producto.", "error");
      }
    } catch (error) {
      showCustomToast("Error", error.message || "Error al buscar ajustes de inventario.", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    productosFiltrados,
    busquedaProducto,
    setBusquedaProducto: handleBusquedaChange,
    showSugerencias,
    setShowSugerencias,
    idProducto,
    handleProductoSelect,
    resultados,
    loading,
    handleSubmit,
  };
};
