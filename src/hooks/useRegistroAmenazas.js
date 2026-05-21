import { useState } from "react";
import { amenazasAPI } from "../helpers/api"; 
import { showCustomToast } from "../components/globalComponents/CustomToaster";

export default function useRegistroAmenazas() {
  const [familia, setFamilia] = useState("");
  const [evento, setEvento] = useState("");
  const [peligro, setPeligro] = useState("");
  const [eventoEspecifico, setEventoEspecifico] = useState("");
  const [loading, setLoading] = useState(false);
  const [alerta, setAlerta] = useState({ mensaje: "", tipo: "" });

  const handleRegistro = async (e) => {
    e.preventDefault();

    if (!familia || !evento || !peligro || !eventoEspecifico) {
      setAlerta({ mensaje: "Completa todos los campos.", tipo: "error" });
      return;
    }

    try {
      setLoading(true);

      const amenazaData = {
        familia,
        evento,
        peligro,
        eventoEspecifico,
      };

      await amenazasAPI.create(amenazaData);

      showCustomToast(
        "Registro exitoso",
        "La amenaza ha sido registrada correctamente.",
        "success"
      );

      // Reset campos
      setFamilia("");
      setEvento("");
      setPeligro("");
      setEventoEspecifico("");

    } catch (error) {
      console.error("Error al registrar amenaza:", error);
      setAlerta({
        mensaje:
          error.response?.data?.message ||
          error.message ||
          "Error al registrar la amenaza",
        tipo: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    familia,
    setFamilia,
    evento,
    setEvento,
    peligro,
    setPeligro,
    eventoEspecifico,
    setEventoEspecifico,
    loading,
    handleRegistro,
    alerta,
  };
}
