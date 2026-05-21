// useBusquedaReferencia.js
import { useEffect, useState } from "react";
import { referenciasAPI, familiasAPI } from "../helpers/api.js";
import toast from "react-hot-toast";

export const useBusquedaReferencia = () => {
  // Lista familias para autocomplete
  const [familias, setFamilias] = useState([]);
  const [codigoFamilia, setCodigoFamilia] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [selectedFamilia, setSelectedFamilia] = useState(null);

  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState([]);

  // Cargar familias
  const fetchFamilias = async () => {
    try {
      const res = await familiasAPI.getAll();
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

  // Selección familia del autocomplete
  const handleFamiliaSelect = (familia) => {
    setSelectedFamilia(familia);
    setCodigoFamilia(familia.codigoFamilia);
    setShowSugerencias(false);
  };

  // Submit buscar referencias
  const handleSubmit = async (e) => {
    e.preventDefault();

    const codigoBusqueda = selectedFamilia ? selectedFamilia.codigoFamilia : codigoFamilia;

    if (!codigoBusqueda.trim()) {
      toast.error("Debe ingresar o seleccionar un código de familia.");
      return;
    }

    setLoading(true);
    setResultados([]);

    try {
      const data = await referenciasAPI.getByCodigoFamilia(codigoBusqueda);
      setResultados(data.data || []);

      if (!data.data || data.data.length === 0) {
        toast.error("No se encontraron referencias para esta familia.");
      }
    } catch (error) {
      toast.error(error.message || "Error al buscar referencias.");
    } finally {
      setLoading(false);
    }
  };

  return {
    familias,
    codigoFamilia,
    setCodigoFamilia,
    showSugerencias,
    setShowSugerencias,
    selectedFamilia,
    handleFamiliaSelect,
    resultados,
    loading,
    handleSubmit,
  };
};
