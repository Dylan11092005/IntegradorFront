import React, { useState } from "react";
import { alberguesAPI } from "../../helpers/api.js";
import { showCustomToast } from "../../components/globalComponents/CustomToaster.jsx";

export function useActualizarAlbergue() {
  const [albergues, setAlbergues] = useState([]);
  const [busquedaAlbergue, setBusquedaAlbergue] = useState("");
  const [showSugerencias, setShowSugerencias] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actualizando, setActualizando] = useState(false);

  // Buscar albergues por usuario (al presionar botón)
  const buscarAlbergues = async () => {
    setLoading(true);
    setError(null);
    try {
      const idUsuario = localStorage.getItem("idUsuario");
      if (!idUsuario) {
        showCustomToast("Error", "No se encontró el ID del usuario en localStorage.", "error");
        setLoading(false);
        return;
      }
      const data = await alberguesAPI.getByUsuario(idUsuario);
      const lista = Array.isArray(data) ? data : data?.data ?? [];
      setAlbergues(lista);
    } catch (err) {
      setError(err.message);
      setAlbergues([]);
      showCustomToast("Error", "No se pudo cargar la lista de albergues.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Limpiar form si se borra la búsqueda
  React.useEffect(() => {
    if ((busquedaAlbergue || "").trim() === "") {
      setForm({});
    }
  }, [busquedaAlbergue]);

  // Seleccionar albergue del autocompletado
  const handleSelectAlbergue = async (albergue) => {
    setBusquedaAlbergue(albergue ? (albergue.nombre || albergue.idAlbergue || "") : "");
    let id = albergue?.id;
    if (!id && albergue?.idAlbergue) {
      const encontrado = albergues.find(a => a.idAlbergue === albergue.idAlbergue);
      id = encontrado?.id;
    }
    if (!id) {
      setForm({});
      return;
    }
    setLoading(true);
    try {
      console.log("ID enviado a getByIdTony:", id);
      const respuesta = await alberguesAPI.getByIdTony(id); // <-- usa el nuevo método
      const datosCompletos = Array.isArray(respuesta?.data) ? respuesta.data[0] : respuesta?.data;
      console.log("Datos completos del albergue:", datosCompletos);
      setForm(datosCompletos || {});
    } catch {
      setForm({});
      showCustomToast("Error", "No se pudo cargar los datos completos del albergue.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en los campos del formulario
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Actualizar albergue
  const actualizarAlbergue = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setActualizando(true);
    setError(null);
    try {
      const toBool = (val) => val === "true" || val === true;
      const payload = {
        condicionAlbergue: form.condicionAlbergue,
        especificacion: form.especificacion,
        capacidadPersonas: Number(form.capacidadPersonas || form.idCapacidad || 0),
        capacidadColectiva: Number(form.capacidadColectiva) || 0,
        ocupacion: Number(form.ocupacion) || 0,
        detalleCondicion: form.detalleCondicion,
        cocina: toBool(form.cocina),
        duchas: toBool(form.duchas),
        serviciosSanitarios: toBool(form.serviciosSanitarios),
        bodega: toBool(form.bodega),
        menajeMobiliario: toBool(form.menajeMobiliario),
        tanqueAgua: toBool(form.tanqueAgua),
        administrador: form.administrador,
        telefono: form.telefono,
        color: form.color,
        idUsuarioModificacion: Number(localStorage.getItem("idUsuario")) || 0,
      };
      if (!form.id && !form.idAlbergue) {
        showCustomToast("Error", "Selecciona un albergue para actualizar.", "error");
        setActualizando(false);
        return;
      }
      await alberguesAPI.update(form.id || form.idAlbergue, payload);
      showCustomToast("Éxito", "Albergue actualizado correctamente.", "success");
      setForm({});
      setBusquedaAlbergue("");
      await buscarAlbergues(); // refrescar lista
    } catch (err) {
      setError(err.message);
      showCustomToast("Error", "No se pudo actualizar el albergue.", "error");
    } finally {
      setActualizando(false);
    }
  };

  return {
    albergues,
    busquedaAlbergue,
    setBusquedaAlbergue,
    showSugerencias,
    setShowSugerencias,
    form,
    setForm,
    loading,
    error,
    handleChange,
    handleSelectAlbergue,
    actualizarAlbergue,
    buscarAlbergues,
    actualizando,
  };
}
