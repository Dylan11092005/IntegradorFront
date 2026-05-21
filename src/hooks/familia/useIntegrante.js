import { useState, useEffect, useRef } from "react";
import SignaturePad from "signature_pad";

const paises = [
  "Belice", "Costa Rica", "El Salvador", "Guatemala", "Honduras",
  "Nicaragua", "Panamá", "Argentina", "Venezuela", "Colombia"
];

const gruposIndigenasCR = [
  "Bribri", "Cabécar", "Maleku", "Guaymí (Ngäbe)", "Boruca", "Térraba", "Chorotega"
];

const useIntegrante = (datos = {}, setDatos) => {
  const [edad, setEdad] = useState("");
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  // Edad
  const calcularEdad = (fecha) => {
    if (!fecha) return "";
    const nacimiento = new Date(fecha);
    if (isNaN(nacimiento.getTime())) return "";
    const hoy = new Date();
    let edadCalc = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edadCalc--;
    }
    return edadCalc;
  };

  // Handler general para todos los campos
  const handleChange = (e, section = "FamiliaDatosPersonales") => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === "checkbox" ? checked : value;

    setDatos(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: nuevoValor,
        ...(name === "fechaNacimiento"
          ? { edad: calcularEdad(value) }
          : {}),
      },
    }));

    if (section === "FamiliaDatosPersonales" && name === "fechaNacimiento") {
      setEdad(calcularEdad(value));
    }
  };

  // Firma digital
  useEffect(() => {
    if (canvasRef.current) {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
        signaturePadRef.current = null;
      }
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0)",
        penColor: "black",
      });
    }
    return () => {
      if (signaturePadRef.current) {
        signaturePadRef.current.off();
        signaturePadRef.current = null;
      }
    };
  }, [canvasRef.current, datos.FamiliaDatosPersonales?.esJefeFamilia]);

  const guardarFirma = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const imagen = canvas.toDataURL("image/png");
      setDatos(prev => ({
        ...prev,
        FamiliaFirmaDigital: {
          ...prev.FamiliaFirmaDigital,
          imagen,
        },
      }));
    }
  };

  const limpiarFirma = () => {
    signaturePadRef.current?.clear();
    setDatos(prev => ({
      ...prev,
      FamiliaFirmaDigital: {
        ...prev.FamiliaFirmaDigital,
        imagen: null,
      },
    }));
  };

  
  useEffect(() => {
    if (!datos.FamiliaDatosPersonales?.tipoIdentificacion) {
      setDatos(prev => ({
        ...prev,
        FamiliaDatosPersonales: {
          ...prev.FamiliaDatosPersonales,
          tipoIdentificacion: "Cédula",
        },
      }));
    }
  }, []);

  
  const validarIntegrante = (dp) => {
    if (!dp.nombre?.trim()) return "Falta el nombre.";
    if (!dp.numeroIdentificacion?.trim()) return "Falta el número de identificación.";
    if (!dp.tipoIdentificacion?.trim()) return "Falta el tipo de identificación.";
    return null;
  };

  return {
    edad,
    handleChange,
    paises,
    gruposIndigenasCR,
    canvasRef,
    signaturePadRef,
    guardarFirma,
    limpiarFirma,
    calcularEdad,
    validarIntegrante,
  };
};

export default useIntegrante;
