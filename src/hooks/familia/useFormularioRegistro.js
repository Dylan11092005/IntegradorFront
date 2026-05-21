import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { alberguesAPI, amenazasAPI, familiasAPI } from "../../helpers/api";
import obtenerTodos from "../../helpers/obtenerUbicaciones";
import customAxios from "../../helpers/customAxios";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

const useFormularioRegistro = () => {
  const [integrantes, setIntegrantes] = useState("");
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [cantonSeleccionado, setCantonSeleccionado] = useState("");
  const [albergueSeleccionado, setAlbergueSeleccionado] = useState("");
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");
  const [direccion, setDireccion] = useState("");
  const [codigoFamilia, setCodigoFamilia] = useState("");
  const [nombreProvincia, setNombreProvincia] = useState("");
  const [nombreCanton, setNombreCanton] = useState("");
  const [nombreDistrito, setNombreDistrito] = useState("");
  const [idDistritoSeleccionado, setIdDistritoSeleccionado] = useState(""); // ✅ agregado

  const [albergues, setAlbergues] = useState([]);
  const [peligros, setPeligros] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);

  const [busquedaAlbergue, setBusquedaAlbergue] = useState("");
  const [showSugerenciasAlbergue, setShowSugerenciasAlbergue] = useState(false);

  const navigate = useNavigate();

  // Cargar peligros (antes amenazas)
  useEffect(() => {
    const cargarPeligros = async () => {
      const datos = await obtenerTodos("https://api-geo-cr.vercel.app/provincias");
      setProvincias(datos);
    };
    cargarPeligros();
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      const idUsuario = localStorage.getItem("idUsuario");
      if (!idUsuario) {
        showCustomToast("Error", "Usuario no identificado.", "error");
        return;
      }

      try {
        const [resAlbergues, resAmenazas] = await Promise.all([
          alberguesAPI.getByUsuario(idUsuario),
          amenazasAPI.getAll(),
        ]);
        setAlbergues(resAlbergues?.data || []);
        // Extraer peligros únicos
        const peligrosUnicos = Array.from(
          new Set((resAmenazas?.data || []).map((a) => a.peligro))
        )
          .filter(Boolean)
          .map((peligro) => ({ id: peligro, nombre: peligro }));
        console.log("Datos crudos de amenazas:", resAmenazas?.data);
        console.log("Peligros únicos extraídos:", peligrosUnicos);
        setPeligros(peligrosUnicos);
      } catch {
        showCustomToast("Error", "Error al cargar datos internos", "error");
      }
    };
    cargarDatos();
  }, []);

  // Cargar provincias
  useEffect(() => {
    const cargarProvincias = async () => {
      const datos = await obtenerTodos("https://api-geo-cr.vercel.app/provincias");
      setProvincias(datos);
    };
    cargarProvincias();
  }, []);

  // Cargar cantones al cambiar provincia
  useEffect(() => {
    if (!provinciaSeleccionada) {
      setCantones([]);
      setCantonSeleccionado("");
      return;
    }
    const cargarCantones = async () => {
      const datos = await obtenerTodos(
        `https://api-geo-cr.vercel.app/provincias/${provinciaSeleccionada}/cantones`
      );
      setCantones(datos);
    };
    cargarCantones();
  }, [provinciaSeleccionada]);

  // Cargar distritos al cambiar cantón
  useEffect(() => {
    if (!cantonSeleccionado) {
      setDistritos([]);
      return;
    }
    const cargarDistritos = async () => {
      const datos = await obtenerTodos(
        `https://api-geo-cr.vercel.app/cantones/${cantonSeleccionado}/distritos`
      );
      setDistritos(datos);
    };
    cargarDistritos();
  }, [cantonSeleccionado]);

  // Generar código de familia
  useEffect(() => {
    const generarIdentificador = async () => {
      if (nombreProvincia && nombreCanton && integrantes) {
        try {
          const numeroFamilia = await familiasAPI.getNextNumero(nombreCanton);
          const year = new Date().getFullYear();
          const nuevoCodigo = `${year}-${nombreProvincia}-${nombreCanton}-${numeroFamilia}`;
          setCodigoFamilia(nuevoCodigo);
        } catch {
          setCodigoFamilia("");
          showCustomToast("Error", "No se pudo generar el código de familia.", "error");
        }
      } else {
        setCodigoFamilia("");
      }
    };

    generarIdentificador();
  }, [nombreProvincia, nombreCanton, integrantes]);

  // Crear familia
  const crearFamilia = async (e) => {
    e.preventDefault();
    const idUsuario = localStorage.getItem("idUsuario");

    if (
      !albergueSeleccionado ||
      !codigoFamilia ||
      !integrantes ||
      !eventoSeleccionado ||
      !nombreProvincia ||
      !nombreCanton ||
      !nombreDistrito ||
      !direccion ||
      !idUsuario
    ) {
      showCustomToast("Campos incompletos", "Complete todos los campos obligatorios.", "error");
      return;
    }

    const datos = {
      provincia: nombreProvincia,
      canton: nombreCanton,
      distrito: nombreDistrito,
      direccion,
      codigoFamilia,
      cantidadPersonas: parseInt(integrantes),
      idAlbergue: parseInt(albergueSeleccionado),
      idAmenaza: parseInt(eventoSeleccionado),
      idUsuarioCreacion: parseInt(idUsuario),
    };

    try {
      const res = await customAxios.post("/familias", datos);
      const idFamilia = res.data.idFamilia;
      console.log("Respuesta backend crear familia:", res.data);
      if (!idFamilia) {
        showCustomToast("Error", "El backend no devolvió el id de la familia. No se podrá registrar integrantes.", "error");
        return;
      }
      localStorage.setItem("idFamilia", idFamilia);
      localStorage.setItem("codigoFamilia", codigoFamilia);
      showCustomToast("Éxito", "Familia registrada correctamente.", "success");
    } catch {
      showCustomToast("Error", "No se pudo registrar la familia.", "error");
    }

    localStorage.setItem("cantidadIntegrantes", integrantes);
    navigate("/familiaFormulario.jsx");
  };

  return {
    albergues,
    peligros,
    provincias,
    cantones,
    distritos,
    integrantes,
    setIntegrantes,
    provinciaSeleccionada,
    setProvinciaSeleccionada,
    cantonSeleccionado,
    setCantonSeleccionado,
    albergueSeleccionado,
    setAlbergueSeleccionado,
    eventoSeleccionado,
    setEventoSeleccionado,
    direccion,
    setDireccion,
    codigoFamilia,
    setCodigoFamilia,
    nombreProvincia,
    setNombreProvincia,
    nombreCanton,
    setNombreCanton,
    nombreDistrito,
    setNombreDistrito,
    idDistritoSeleccionado,
    setIdDistritoSeleccionado, 
    busquedaAlbergue,
    setBusquedaAlbergue,
    showSugerenciasAlbergue,
    setShowSugerenciasAlbergue,
    crearFamilia,
  };
};

export default useFormularioRegistro;
