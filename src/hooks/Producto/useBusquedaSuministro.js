import { useEffect, useState } from "react";
import { familiasAPI, productosAPI } from "../../helpers/api.js";
import toast from "react-hot-toast";

export const useBusquedaSuministro = () => {
  // Autocomplete familias
  const [familias, setFamilias] = useState([]);
  const [busquedaFamilia, setBusquedaFamilia] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [selectedFamilia, setSelectedFamilia] = useState(null);

  // Resultados y loading
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar familias para autocomplete
  const fetchFamilias = async () => {
    try {
      const res = await familiasAPI.getAll(); // Cambia según tu API
      const lista = Array.isArray(res?.data?.[0]) ? res.data[0] : res.data || [];
      setFamilias(lista);
    } catch {
      toast.error("Error al cargar familias.");
      setFamilias([]);
    }
  };

  useEffect(() => {
    fetchFamilias();
  }, []);

  // Selección familia autocomplete
  const handleFamiliaSelect = (familia) => {
    setSelectedFamilia(familia);
    setBusquedaFamilia(familia.codigoFamilia);
    setShowSugerencias(false);
  };

  // Submit buscando productos por familia seleccionada o texto escrito
  const handleSubmit = async (e) => {
    e.preventDefault();

    const codigoBusqueda = selectedFamilia ? selectedFamilia.codigoFamilia : busquedaFamilia;

    if (!codigoBusqueda.trim()) {
      toast.error("Debe ingresar o seleccionar un código de familia.");
      return;
    }

    setLoading(true);
    setResultados([]);

    try {
      const data = await productosAPI.getByFamilia(codigoBusqueda);
      setResultados(data.data);

      if (!data.data || data.data.length === 0) {
        toast.error("No se encontraron productos para esta familia.");
      }
    } catch (error) {
      toast.error(error.message || "Error al buscar productos.");
    } finally {
      setLoading(false);
    }
  };

  return {
    familias,
    busquedaFamilia,
    setBusquedaFamilia,
    showSugerencias,
    setShowSugerencias,
    selectedFamilia,
    handleFamiliaSelect,
    resultados,
    loading,
    handleSubmit,
  };
};
