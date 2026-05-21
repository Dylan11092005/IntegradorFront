import { useState, useCallback } from "react";
import axios from "axios";

export const useBusquedaCedula = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarCedula = useCallback(async (cedula) => {
    if (!cedula) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://apis.gometa.org/cedulas/${cedula}`);
      const result = response.data;

      if (!result?.results || result.results.length === 0) {
        throw new Error("La cédula no existe en el registro");
      }

      const persona = result.results[0];

      setData({
        firstname1: persona.firstname1 || "",
        firstname2: persona.firstname2 || "",
        lastname1: persona.lastname1 || "",
        lastname2: persona.lastname2 || "",
      });

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error al consultar la API");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, buscarCedula };
};
