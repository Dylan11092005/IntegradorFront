import { useEffect, useState } from "react";
import { familiasAPI, mascotasAPI } from "../helpers/api";
import toast from "react-hot-toast";

export const useBusquedaMascotas = () => {
  // Autocomplete familias
  const [familias, setFamilias] = useState([]);
  const [busquedaFamilia, setBusquedaFamilia] = useState(""); // texto del input autocomplete
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [selectedFamilia, setSelectedFamilia] = useState(null);

  // Resultados y loading
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carga familias (podrías usar idUsuario si aplica, aquí cargamos todas para ejemplo)
  const fetchFamilias = async () => {
    try {
      const res = await familiasAPI.getAll(); // o getByUsuario si usas idUsuario
      const lista = Array.isArray(res?.data?.[0]) ? res.data[0] : res.data || [];
      setFamilias(lista);
    } catch  {
      toast.error("Error al cargar familias.");
      setFamilias([]);
    }
  };

  useEffect(() => {
    fetchFamilias();
  }, []);

  // Al seleccionar familia en autocomplete
  const handleFamiliaSelect = (familia) => {
    setSelectedFamilia(familia);
    setBusquedaFamilia(familia.codigoFamilia);
    setShowSugerencias(false);
  };

  // Submit búsqueda (prioriza la familia seleccionada)
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
      const response = await mascotasAPI.getByCodigoFamilia(codigoBusqueda);
      setResultados(response.data || []);

      if (!response.data || response.data.length === 0) {
        toast.error("No se encontraron mascotas para esta familia.");
      } else {
        toast.success("Mascotas encontradas exitosamente.");
      }
    } catch (error) {
      toast.error(error.message || "Error al buscar mascotas.");
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
