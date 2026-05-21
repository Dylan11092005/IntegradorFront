import { useState } from "react";
import { consumiblesAPI } from "../../helpers/api.js";
import { showCustomToast } from "../../components/globalComponents/CustomToaster.jsx";

export const useRegistroConsumibles = () => {
  const [form, setForm] = useState({
    nombre: "",
    categoriaProducto: "",
    unidadMedida: "",
    cantidad: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const camposIncompletos = Object.values(form).some((val) => val === "");
    if (camposIncompletos) {
      showCustomToast("Error", "Por favor complete todos los campos.", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nombre: form.nombre,
        unidadMedidaNombre: form.unidadMedida,
        categoriaNombre: form.categoriaProducto,
        cantidad: parseInt(form.cantidad),
      };

      await consumiblesAPI.create(payload);
      showCustomToast("Éxito", "Consumible registrado correctamente.", "success");
      setForm({
        nombre: "",
        categoriaProducto: "",
        unidadMedida: "",
        cantidad: "",
      });
    } catch {
      showCustomToast("Error", "Error al registrar consumible.", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    handleChange,
    handleSubmit,
  };
};