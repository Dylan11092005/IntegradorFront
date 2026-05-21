import React, { useState } from "react";
import FormContainer from "../components/FormComponents/FormContainer.jsx";
import InputField from "../components/FormComponents/InputField.jsx";
import SubmitButton from "../components/FormComponents/SubmitButton.jsx";
import CustomToaster, { showCustomToast } from "../components/globalComponents/CustomToaster.jsx";
import { amenazasAPI } from "../helpers/api.js";

export default function RegistroAmenazas() {
  const [familia, setFamilia] = useState("");
  const [evento, setEvento] = useState("");
  const [peligro, setPeligro] = useState("");
  const [causa, setCausa] = useState("");
  const [categoriaEvento, setCategoriaEvento] = useState("");
  const [loading, setLoading] = useState(false);

  const idUsuarioCreacion = parseInt(localStorage.getItem("idUsuario"), 10);

  const resetForm = () => {
    setFamilia("");
    setEvento("");
    setPeligro("");
    setCausa("");
    setCategoriaEvento("");
  };

  const handleRegistro = async (e) => {
    e.preventDefault();

    if (
      !familia.trim() ||
      !evento.trim() ||
      !peligro.trim() ||
      !causa.trim() ||
      !categoriaEvento.trim() ||
      !idUsuarioCreacion
    ) {
      showCustomToast("Error", "Por favor completa todos los campos.", "error");
      return;
    }

    setLoading(true);

    const data = {
      familiaEvento: familia.trim(),
      evento: evento.trim(),
      peligro: peligro.trim(),
      causa: causa.trim(),
      categoriaEvento: categoriaEvento.trim(),
      idUsuarioCreacion,
    };

    console.log("Enviando a la API:", data);

    try {
      await amenazasAPI.create(data);

      showCustomToast("Éxito", "Amenaza registrada correctamente.", "success");
      resetForm();
    } catch (error) {
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error al registrar amenaza";
      showCustomToast("Error", apiMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormContainer title="Registro de Amenazas" onSubmit={handleRegistro} size="md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <InputField
              label="Familia del Evento"
              name="familia"
              value={familia}
              onChange={(e) => {
                if (e.target.value.length <= 50) setFamilia(e.target.value);
              }}
              placeholder="Ej: Hidrológico"
              required
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Evento"
              name="evento"
              value={evento}
              onChange={(e) => {
                if (e.target.value.length <= 50) setEvento(e.target.value);
              }}
              placeholder="Ej: Inundación"
              required
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-1">
            <InputField
              label="Peligro"
              name="peligro"
              value={peligro}
              onChange={(e) => {
                if (e.target.value.length <= 50) setPeligro(e.target.value);
              }}
              placeholder="Ej: Inundación"
              required
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Causa"
              name="causa"
              value={causa}
              onChange={(e) => {
                if (e.target.value.length <= 50) setCausa(e.target.value);
              }}
              placeholder="Ej: Lluvias continuas"
              required
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-1">
            <InputField
              label="Categoría del Evento"
              name="categoriaEvento"
              value={categoriaEvento}
              onChange={(e) => {
                if (e.target.value.length <= 50) setCategoriaEvento(e.target.value);
              }}
              placeholder="Ej: Natural"
              required
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <SubmitButton color="text-black" width="w-full" loading={loading}>
            Registrar
          </SubmitButton>
        </div>
      </FormContainer>
      <CustomToaster />
    </>
  );
}