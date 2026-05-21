import { useState } from "react";
import { alberguesAPI } from "../../helpers/api.js";

export function useBusquedaAlbergue({ provincias, cantones, distritos, setProvinciaId, setCantonId }) {
  const [idAlbergue, setIdAlbergue] = useState("");
  const [nombre, setNombre] = useState("");
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [cantonSeleccionado, setCantonSeleccionado] = useState("");
  const [distritoSeleccionado, setDistritoSeleccionado] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProvinciaChange = (e) => {
    const idSeleccionado = parseInt(e.target.value, 10);
    setProvinciaId(idSeleccionado);
    const provincia = provincias.find((p) => p.idProvincia === idSeleccionado);
    setProvinciaSeleccionada(provincia?.descripcion || "");

    setCantonSeleccionado("");
    setDistritoSeleccionado("");
    setCantonId(null);
  };

  const handleCantonChange = (e) => {
    const idSeleccionado = parseInt(e.target.value, 10);
    setCantonId(idSeleccionado);
    const canton = cantones.find((c) => c.idCanton === idSeleccionado);
    setCantonSeleccionado(canton?.descripcion || "");

    setDistritoSeleccionado("");
  };

  const handleDistritoChange = (e) => {
    const idSeleccionado = parseInt(e.target.value, 10);
    const distrito = distritos.find((d) => d.idDistrito === idSeleccionado);
    setDistritoSeleccionado(distrito?.descripcion || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultados([]);
    setLoading(true);

    try {
      if (idAlbergue.trim() !== "") {
        console.log("Buscando por ID:", `"${idAlbergue.trim()}"`);
        const res = await alberguesAPI.getById(idAlbergue.trim());
        console.log("Resultado API ID:", res);
        if (res?.data?.length > 0) setResultados(res.data);
        else setError("No se encontró albergue con ese ID.");
      } else if (nombre.trim() !== "") {
        console.log("Buscando por nombre:", `"${nombre.trim()}"`);
        const res = await alberguesAPI.getByNombre(nombre.trim());
        console.log("Resultado API nombre:", res);
        if (res?.data?.length > 0) setResultados(res.data);
        else setError("No se encontró albergue con ese nombre.");
      } else if (distritoSeleccionado) {
        console.log("Buscando por distrito:", `"${distritoSeleccionado}"`);
        const res = await alberguesAPI.getByDistrito(distritoSeleccionado.trim());
        console.log("Resultado API distrito:", res);
        if (res?.data?.length > 0) setResultados(res.data);
        else setError("No se encontró albergue en ese distrito.");
      } else if (cantonSeleccionado) {
        console.log("Buscando por cantón:", `"${cantonSeleccionado}"`);
        const res = await alberguesAPI.getByCanton(cantonSeleccionado.trim());
        console.log("Resultado API cantón:", res);

        if (res?.data?.length > 0) {
          const resultadosReales = Array.isArray(res.data[0]) ? res.data[0] : res.data;
          setResultados(resultadosReales);
        } else {
          setError("No se encontró albergue en ese cantón.");
        }
      } else if (provinciaSeleccionada) {
        console.log("Buscando por provincia:", `"${provinciaSeleccionada}"`);
        const res = await alberguesAPI.getByProvincia(provinciaSeleccionada.trim());
        console.log("Resultado API provincia:", res);
        if (res?.data?.length > 0) setResultados(res.data);
        else setError("No se encontró albergue en esa provincia.");
      } else {
        setError("Por favor ingrese ID, Nombre o seleccione una ubicación.");
      }
    } catch (err) {
      console.error("Error en búsqueda:", err);
      if (err.response?.status === 404 || (err.message && err.message.includes("Albergue no encontrado"))) {
        setError("No se encontró un albergue con esos datos.");
      } else {
        setError(String(err) || "Error al buscar albergue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    idAlbergue,
    setIdAlbergue,
    nombre,
    setNombre,
    resultados,
    error,
    provinciaSeleccionada,
    cantonSeleccionado,
    distritoSeleccionado,
    loading,
    handleSubmit,
    handleProvinciaChange,
    handleCantonChange,
    handleDistritoChange,
  };
}
