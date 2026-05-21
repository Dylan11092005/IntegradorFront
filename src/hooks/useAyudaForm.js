// src/hooks/useAyudaForm.js
import { useState, useEffect } from "react";
import { familiasAPI, referenciasAPI } from "../helpers/api";
import { showCustomToast } from "../components/globalComponents/CustomToaster";

const useAyudaForm = () => {
  const idUsuario = localStorage.getItem("idUsuario");
  console.log("🔎 ID del usuario desde localStorage:", idUsuario);

  const [familias, setFamilias] = useState([]);
  const [form, setForm] = useState({
    idFamilia: "",
    tipoAyuda: "",
    descripcion: "",
    fechaEntrega: "",
    responsable: "",
  });

  const [busquedaFamilia, setBusquedaFamilia] = useState("");
  const [showSugerenciasFamilia, setShowSugerenciasFamilia] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFamilias = async () => {
      try {
        if (!idUsuario) {
          console.warn("⚠️ No hay idUsuario disponible");
          return;
        }

        const res = await familiasAPI.getByUsuario(idUsuario);
        console.log("📦 Respuesta de familiasAPI.getByUsuario:", res);

        const lista = Array.isArray(res?.data?.[0]) ? res.data[0] : [];
        console.log("✅ Lista de familias parseada:", lista);

        setFamilias(lista);
      } catch (error) {
        console.error("❌ Error al obtener familias:", error);
        showCustomToast("Error", "Error al cargar familias", "error");
      }
    };

    fetchFamilias();
  }, [idUsuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`✏️ Cambio en el campo "${name}":`, value);

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    if (!form.idFamilia) return "Debe seleccionar una familia";
    if (!form.tipoAyuda) return "Debe seleccionar un tipo de ayuda";
    if (!form.descripcion.trim()) return "Debe ingresar una descripción";
    if (!form.fechaEntrega) return "Debe ingresar la fecha de entrega";
    if (!form.responsable.trim()) return "Debe ingresar el responsable";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validacion = validarFormulario();
    if (validacion) {
      showCustomToast("Error", validacion, "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        idFamilia: Number(form.idFamilia),
        tipoAyuda: form.tipoAyuda,
        descripcion: form.descripcion,
        fechaEntrega: form.fechaEntrega,
        responsable: form.responsable,
        idUsuarioCreacion: Number(idUsuario),
      };

      console.log("📤 Payload enviado:", payload);

      await referenciasAPI.create(payload);

      showCustomToast("Éxito", "Ayuda registrada correctamente", "success");

      setForm({
        idFamilia: "",
        tipoAyuda: "",
        descripcion: "",
        fechaEntrega: "",
        responsable: "",
      });
      setBusquedaFamilia("");
    } catch (error) {
      console.error("❌ Error al enviar el formulario:", error);
      showCustomToast("Error", "No se pudo registrar la ayuda. Inténtelo de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  };

  const onSelectFamilia = (familia) => {
    console.log("👈 Familia seleccionada:", familia);

    setForm((prev) => ({
      ...prev,
      idFamilia: familia.id || familia.ID,
    }));

    setBusquedaFamilia(familia.codigoFamilia || familia.codigo);
  };

  return {
    form,
    familias,
    busquedaFamilia,
    setBusquedaFamilia,
    showSugerenciasFamilia,
    setShowSugerenciasFamilia,
    handleChange,
    handleSubmit,
    loading,
    onSelectFamilia,
  };
};

export default useAyudaForm;
