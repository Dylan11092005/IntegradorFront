import { useEffect, useState } from "react";
import { personasAPI } from "../../helpers/api.js";
import toast from "react-hot-toast";

export const useBuscarAsignaciones = () => {
  const [personas, setPersonas] = useState([]);
  const [busquedaPersona, setBusquedaPersona] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar personas para el autocomplete
  useEffect(() => {
    const usuarioId = localStorage.getItem("idUsuario");
    if (!usuarioId) return;
    const fetchPersonas = async () => {
      try {
        const data = await personasAPI.getByUsuario(usuarioId);
        const lista = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        // Filtra personas únicas por númeroIdentificacion
        const personasUnicas = lista.filter(
          (item, idx, arr) =>
            arr.findIndex(x => x.numeroIdentificacion === item.numeroIdentificacion) === idx
        );
        setPersonas(personasUnicas);
      } catch {
        toast.error("Error al cargar personas.");
        setPersonas([]);
      }
    };
    fetchPersonas();
  }, []);

  // Selección persona autocomplete
  const handlePersonaSelect = (persona) => {
    setSelectedPersona(persona);
    setBusquedaPersona(
      `${persona.numeroIdentificacion} - ${persona.nombre || ""} ${persona.apellido || ""}`.trim()
    );
    setShowSugerencias(false);
  };

  // Submit buscando asignaciones por persona seleccionada o texto escrito
  const handleSubmit = async (e) => {
    e.preventDefault();

    const idBusqueda = selectedPersona?.id || selectedPersona?.ID;
    if (!idBusqueda) {
      toast.error("Debe seleccionar una persona.");
      return;
    }

    setLoading(true);
    setResultados([]);

    try {
      const data = await personasAPI.getRecursosPorPersona(idBusqueda);
      const lista = Array.isArray(data?.data) ? data.data : [];
      setResultados(lista);

      if (!lista || lista.length === 0) {
        toast.error("No se encontraron asignaciones para esta persona.");
      }
    } catch (error) {
      toast.error(error.message || "Error al buscar asignaciones.");
    } finally {
      setLoading(false);
    }
  };

  return {
    personas,
    busquedaPersona,
    setBusquedaPersona,
    showSugerencias,
    setShowSugerencias,
    selectedPersona,
    handlePersonaSelect,
    resultados,
    loading,
    handleSubmit,
  };
};