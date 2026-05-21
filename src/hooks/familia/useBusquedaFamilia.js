import { useState } from "react";
import { familiasAPI } from "../../helpers/api.js";
import { showCustomToast } from "../../components/globalComponents/CustomToaster.jsx";

const useBusquedaFamilia = () => {
  const [identificacion, setIdentificacion] = useState("");
  const [familia, setFamilia] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFamilia(null);

    if (!identificacion.trim()) {
      showCustomToast(
        "Campo requerido",
        "Por favor ingrese un número de identificación.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const id = identificacion.trim();
      const res = await familiasAPI.getById(id);

      if (res && Array.isArray(res.data) && res.data.length > 0) {
        setFamilia(res.data);
        showCustomToast("Éxito", "Familia encontrada correctamente.", "success");
      } else {
        showCustomToast(
          "No encontrada",
          "No se encontró una familia con ese número.",
          "info" 
        );
      }
    } catch (err) {
      const status = err.response?.status;
      

      if (status === 404) {
        showCustomToast(
          "No encontrado",
          "No se encontró un jefe de hogar con ese número de identificación.",
          "info" 
        );
      } else {
        showCustomToast(
          "Error",
          "Error al buscar la familia.",
          "error"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    identificacion,
    setIdentificacion,
    familia,
    loading,
    handleSubmit,
  };
};

export default useBusquedaFamilia;
