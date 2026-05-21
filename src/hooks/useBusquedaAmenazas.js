import { useEffect, useState } from "react";
import { amenazasAPI } from "../helpers/api.js";
import toast from "react-hot-toast";

export const useBusquedaAmenazas = () => {
  const [amenazas, setAmenazas] = useState([]);
  const [codigoAmenaza, setCodigoAmenaza] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [selectedAmenaza, setSelectedAmenaza] = useState(null);

  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);

  // Cargar amenazas para el autocomplete y la tabla (solo últimas 10)
  const fetchAmenazas = async () => {
    try {
      const res = await amenazasAPI.getAll();
      const lista = Array.isArray(res?.data) ? res.data : res.data?.data || [];
      // Filtra peligros únicos para el autocomplete
      const peligrosUnicos = lista.filter(
        (item, idx, arr) => arr.findIndex(x => x.peligro === item.peligro) === idx
      );
      setAmenazas(peligrosUnicos);

      // Ordena por fecha de creación descendente y toma las últimas 10
      const ultimas = lista
        .sort((a, b) => new Date(a.fechaCreacion || a.createdAt || 0) - new Date(b.fechaCreacion || b.createdAt || 0))
        .slice(-10); // Toma las últimas 10 (más viejas a más nuevas)

      setResultados(ultimas);
    } catch {
      toast.error("Error al cargar amenazas.");
      setAmenazas([]);
      setResultados([]);
    }
  };

  useEffect(() => {
    fetchAmenazas();
  }, []);

  useEffect(() => {
    if (codigoAmenaza === "") {
      fetchAmenazas();
    }
  }, [codigoAmenaza]);

  // Selección amenaza del autocomplete
  const handleAmenazaSelect = (amenaza) => {
    setSelectedAmenaza(amenaza);
    setCodigoAmenaza(amenaza.codigoAmenaza || amenaza.id || "");
    setShowSugerencias(false);
  };

  // Submit buscar amenazas por peligro
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Usa el valor del input directamente si no hay selección
    const peligroBusqueda = selectedAmenaza?.peligro || codigoAmenaza;
    console.log("Buscando peligro:", peligroBusqueda);

    if (!peligroBusqueda.trim()) {
      toast.error("Debe ingresar o seleccionar un peligro.");
      return;
    }

    setLoading(true);
    setResultados([]);

    try {
      const apiResponse = await amenazasAPI.getByPeligro(peligroBusqueda);
      // Extrae el array de la propiedad 'data'
      const amenazasData = Array.isArray(apiResponse?.data) ? apiResponse.data : [];
      setResultados(amenazasData);

      if (!amenazasData || amenazasData.length === 0) {
        toast.error("No se encontraron amenazas para ese peligro.");
      }
    } catch (error) {
      toast.error(error.message || "Error al buscar amenazas.");
    } finally {
      setLoading(false);
    }
  };

  return {
    amenazas,
    codigoAmenaza,
    setCodigoAmenaza,
    showSugerencias,
    setShowSugerencias,
    selectedAmenaza,
    handleAmenazaSelect,
    resultados,
    setResultados,
    loading,
    handleSubmit,
  };
};