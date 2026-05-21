import { useState, useEffect } from "react";
import { municipalidadAPI } from "../helpers/api.js";
import obtenerTodos from "../helpers/obtenerUbicaciones.js";
import { showCustomToast } from "../components/globalComponents/CustomToaster";

const useRegistroMunicipalidad = () => {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    provinciaSeleccionada: "",
    cantonSeleccionado: "",
    distritoSeleccionado: "",
    direccion: "",
  });

  const [loading, setLoading] = useState(false);
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);

  // Nombres legibles para provincia, canton y distrito
  const [nombreProvincia, setNombreProvincia] = useState("");
  const [nombreCanton, setNombreCanton] = useState("");
  const [nombreDistrito, setNombreDistrito] = useState("");

  const idUsuario = localStorage.getItem("idUsuario"); // Cambiar según contexto real

  // Cargar provincias
  useEffect(() => {
    const cargarProvincias = async () => {
      try {
        console.log("Cargando provincias...");
        const datos = await obtenerTodos("https://api-geo-cr.vercel.app/provincias");
        const provinciasStr = datos.map((p) => ({
          id: String(p.idProvincia ?? p.id),
          nombre: p.nombre ?? p.descripcion,
        }));
        setProvincias(provinciasStr);
        console.log("Provincias cargadas:", provinciasStr);
      } catch (error) {
        console.error("Error cargando provincias:", error);
        showCustomToast("Error", "No se pudieron cargar las provincias", "error");
      }
    };
    cargarProvincias();
  }, []);

  // Cargar cantones cuando cambia la provincia
  useEffect(() => {
    if (!form.provinciaSeleccionada) {
      setCantones([]);
      setDistritos([]);
      setNombreProvincia("");
      setNombreCanton("");
      setNombreDistrito("");
      setForm(prev => ({ ...prev, cantonSeleccionado: "", distritoSeleccionado: "" }));
      return;
    }
    const cargarCantones = async () => {
      try {
        console.log(`Cargando cantones para provincia ${form.provinciaSeleccionada}...`);
        const datos = await obtenerTodos(
          `https://api-geo-cr.vercel.app/provincias/${form.provinciaSeleccionada}/cantones`
        );
        const cantonesStr = datos.map((c) => ({
          id: String(c.idCanton ?? c.id),
          nombre: c.nombre ?? c.descripcion,
        }));
        setCantones(cantonesStr);
        console.log("Cantones cargados:", cantonesStr);

        const provObj = provincias.find((p) => p.id === form.provinciaSeleccionada);
        setNombreProvincia(provObj?.nombre || "");

        setNombreCanton("");
        setNombreDistrito("");
        setForm(prev => ({ ...prev, cantonSeleccionado: "", distritoSeleccionado: "" }));
      } catch (error) {
        console.error("Error cargando cantones:", error);
        showCustomToast("Error", "No se pudieron cargar los cantones", "error");
      }
    };
    cargarCantones();
  }, [form.provinciaSeleccionada, provincias]);

  // Cargar distritos cuando cambia el cantón
  useEffect(() => {
    if (!form.cantonSeleccionado) {
      setDistritos([]);
      setNombreCanton("");
      setNombreDistrito("");
      setForm(prev => ({ ...prev, distritoSeleccionado: "" }));
      return;
    }
    const cargarDistritos = async () => {
      try {
        console.log(`Cargando distritos para cantón ${form.cantonSeleccionado}...`);
        const datos = await obtenerTodos(
          `https://api-geo-cr.vercel.app/cantones/${form.cantonSeleccionado}/distritos`
        );
        const distritosStr = datos.map((d) => ({
          id: String(d.idDistrito ?? d.id),
          nombre: d.nombre ?? d.descripcion,
        }));
        setDistritos(distritosStr);
        console.log("Distritos cargados:", distritosStr);

        const cantonObj = cantones.find((c) => c.id === form.cantonSeleccionado);
        setNombreCanton(cantonObj?.nombre || "");

        setNombreDistrito("");
        setForm(prev => ({ ...prev, distritoSeleccionado: "" }));
      } catch (error) {
        console.error("Error cargando distritos:", error);
        showCustomToast("Error", "No se pudieron cargar los distritos", "error");
      }
    };
    cargarDistritos();
  }, [form.cantonSeleccionado, cantones]);

  // Actualizar nombre distrito cuando cambia distrito seleccionado
  useEffect(() => {
    if (!form.distritoSeleccionado) {
      setNombreDistrito("");
      return;
    }
    const distritoObj = distritos.find((d) => d.id === form.distritoSeleccionado);
    setNombreDistrito(distritoObj?.nombre || "");
  }, [form.distritoSeleccionado, distritos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo cambiado: ${name} = ${value}`);
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Validando formulario antes de enviar...", form);

    if (
      !form.nombre ||
      !form.telefono ||
      !form.correo ||
      !form.provinciaSeleccionada ||
      !form.cantonSeleccionado ||
      !form.distritoSeleccionado ||
      !form.direccion
    ) {
      showCustomToast("Error", "Complete todos los campos obligatorios", "error");
      setLoading(false);
      return;
    }

    const datosEnviar = {
      nombre: form.nombre,
      telefono: form.telefono,
      correo: form.correo,
      provincia: nombreProvincia,
      canton: nombreCanton,
      distrito: nombreDistrito,
      direccion: form.direccion,
      idUsuarioCreacion: idUsuario,
    };

    console.log("Enviando datos a la API:", datosEnviar);

    try {
      const res = await municipalidadAPI.create(datosEnviar);
      console.log("Municipalidad registrada:", res);
      showCustomToast("Éxito", "Municipalidad registrada correctamente", "success");

      setForm({
        nombre: "",
        telefono: "",
        correo: "",
        provinciaSeleccionada: "",
        cantonSeleccionado: "",
        distritoSeleccionado: "",
        direccion: "",
      });
      setNombreProvincia("");
      setNombreCanton("");
      setNombreDistrito("");
    } catch (error) {
      console.error("Error registrando municipalidad:", error);
      showCustomToast("Error", "Error al registrar municipalidad", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    handleChange,
    loading,
    provincias,
    cantones,
    distritos,
    handleSubmit,
  };
};

export default useRegistroMunicipalidad;
