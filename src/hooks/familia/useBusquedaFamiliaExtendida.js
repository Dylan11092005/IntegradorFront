import { useState, useEffect } from "react";
import { familiasAPI, alberguesAPI, personasAPI } from "../../helpers/api.js";
import { showCustomToast } from "../../components/globalComponents/CustomToaster.jsx";

const useBusquedaFamiliaExtendida = (idUsuario) => {
  const [identificacion, setIdentificacion] = useState("");
  const [familia, setFamilia] = useState(null);
  const [loading, setLoading] = useState(false);

  // Albergues
  const [albergues, setAlbergues] = useState([]);
  const [busquedaAlbergue, setBusquedaAlbergue] = useState("");
  const [showSugerenciasAlbergue, setShowSugerenciasAlbergue] = useState(false);

  // Familias y albergue seleccionado
  const [familiasPorAlbergue, setFamiliasPorAlbergue] = useState([]);
  const [albergueSeleccionado, setAlbergueSeleccionado] = useState(null);
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState(null);

  // Vista
  const [vistaActual, setVistaActual] = useState("busqueda");

  // Loaders
  const [loadingAlbergues, setLoadingAlbergues] = useState(false);
  const [loadingFamilias, setLoadingFamilias] = useState(false);

  // Cédulas
  const [cedulasDisponibles, setCedulasDisponibles] = useState([]);
  const [busquedaCedula, setBusquedaCedula] = useState("");
  const [showSugerenciasCedula, setShowSugerenciasCedula] = useState(false);

  // Familias recientes
  const [familiasRecientes, setFamiliasRecientes] = useState([]);

  // Cargar albergues por usuario
  useEffect(() => {
    const idUsuario = localStorage.getItem("idUsuario");
    const cargarAlbergues = async () => {
      if (!idUsuario) {
        console.log("[useBusquedaFamiliaExtendida] No hay idUsuario para cargar albergues.");
        setAlbergues([]);
        return;
      }

      setLoadingAlbergues(true);
      try {
        const res = await alberguesAPI.getByUsuario(idUsuario);
        if (res && Array.isArray(res)) {
          setAlbergues(res);
        } else if (res && res.data) {
          setAlbergues(res.data);
        } else {
          setAlbergues([]);
          console.warn("[useBusquedaFamiliaExtendida] Respuesta inesperada", res);
        }
      } catch (error) {
        console.error("[useBusquedaFamiliaExtendida] Error al cargar albergues:", error);
        showCustomToast("Error", "Error al cargar los albergues.", "error");
        setAlbergues([]);
      } finally {
        setLoadingAlbergues(false);
      }
    };

    cargarAlbergues();
  }, [idUsuario]);

  // Cargar cédulas para autocomplete
  useEffect(() => {
    const cargarCedulas = async () => {
      try {
        const personasRes = await personasAPI.getAll();
        if (personasRes && personasRes.data) {
          const cedulasUnicas = [...new Set(personasRes.data.map((p) => p.numeroIdentificacion))];
          setCedulasDisponibles(cedulasUnicas.map((c) => ({ cedula: c })));
        }
      } catch (err) {
        console.error("[useBusquedaFamiliaExtendida] Error al cargar cédulas:", err);
      }
    };
    cargarCedulas();
  }, []);

  // Cargar familias recientes al inicio
  useEffect(() => {
    const cargarFamiliasRecientes = async () => {
      try {
        const [familiasRes, personasRes] = await Promise.all([
          familiasAPI.getAll(),
          personasAPI.getAll(),
        ]);
        if (familiasRes && familiasRes.data && personasRes && personasRes.data) {
          // Ordenar por fecha de creación descendente
          const ordenadas = [...familiasRes.data].sort((a, b) => {
            const fechaA = new Date(a.fechaCreacion || a.createdAt || 0);
            const fechaB = new Date(b.fechaCreacion || b.createdAt || 0);
            return fechaB - fechaA;
          });

          // Asociar jefe de familia
          const recientesConJefe = ordenadas.slice(0, 10).map((f) => {
            const jefe = personasRes.data.find(
              (p) => p.esJefeFamilia === 1 && p.idFamilia === f.id
            );
            return {
              ...f,
              nombreJefe: jefe
                ? `${jefe.nombre} ${jefe.primerApellido} ${jefe.segundoApellido || ""}`.trim()
                : "No disponible",
              cedulaJefe: jefe ? jefe.numeroIdentificacion : null,
            };
          });
          setFamiliasRecientes(recientesConJefe);
        }
      } catch {
        setFamiliasRecientes([]);
      }
    };
    cargarFamiliasRecientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFamilia(null);

    if (!identificacion.trim()) {
      showCustomToast("Campo requerido", "Por favor ingrese un número de identificación.", "error");
      return;
    }

    setLoading(true);
    try {
      const id = identificacion.trim();
      const res = await familiasAPI.getById(id);

      if (res && Array.isArray(res.data) && res.data.length > 0) {
        setFamilia(res.data);
        setVistaActual("detalle");
        showCustomToast("Éxito", "Familia encontrada correctamente.", "success");
      } else {
        showCustomToast("No encontrada", "No se encontró una familia con ese número.", "info");
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
        showCustomToast("Error", "Error al buscar la familia.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarAlbergue = async (albergue) => {
    setAlbergueSeleccionado(albergue);
    setLoadingFamilias(true);
    setVistaActual("familias");

    try {
      const familiasRes = await familiasAPI.getAll();
      const personasRes = await personasAPI.getAll();

      if (familiasRes && familiasRes.data && personasRes && personasRes.data) {
        const familiasFiltradas = familiasRes.data.filter((f) => f.idAlbergue === albergue.id);

        const familiasConInfo = [];
        const codigosProcesados = new Set();

        for (const f of familiasFiltradas) {
          if (!codigosProcesados.has(f.codigoFamilia)) {
            codigosProcesados.add(f.codigoFamilia);

            const jefeFamilia = personasRes.data.find(
              (p) => p.esJefeFamilia === 1 && p.idFamilia === f.id
            );

            familiasConInfo.push({
              ...f,
              nombreJefe: jefeFamilia
                ? `${jefeFamilia.nombre} ${jefeFamilia.primerApellido} ${jefeFamilia.segundoApellido || ""}`.trim()
                : "No disponible",
              cedulaJefe: jefeFamilia ? jefeFamilia.numeroIdentificacion : null,
              nombreAlbergue: albergue.nombre,
            });
          }
        }

        setFamiliasPorAlbergue(familiasConInfo);

        if (familiasConInfo.length === 0) {
          showCustomToast("Sin familias", "No hay familias registradas en este albergue.", "info");
        }
      }
    } catch (err) {
      showCustomToast("Error", "Error al cargar las familias del albergue.", "error");
      console.error("Error al cargar familias:", err);
    } finally {
      setLoadingFamilias(false);
    }
  };

  const handleSeleccionarFamilia = async (familiaItem, desdeRecientes = false) => {
    setLoadingFamilias(true);
    try {
      if (familiaItem.cedulaJefe) {
        const res = await familiasAPI.getById(familiaItem.cedulaJefe);
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          setFamiliaSeleccionada(res.data);
          setVistaActual("detalle");
          showCustomToast("Éxito", "Familia cargada correctamente.", "success");
          // Si viene de recientes, guarda el contexto
          if (desdeRecientes) {
            setFamiliasPorAlbergue(familiasRecientes);
            setAlbergueSeleccionado({ nombre: "Últimas familias registradas" }); // <--- aquí el cambio
          }
        } else {
          throw new Error("No se encontraron datos completos");
        }
      } else {
        // ...tu código actual para info limitada...
        setFamiliaSeleccionada([
          {
            codigoFamilia: familiaItem.codigoFamilia,
            cantidadPersonas: familiaItem.cantidadPersonas,
            nombreCompletoJefe: familiaItem.nombreJefe,
            nombreCompletoIntegrante: familiaItem.nombreJefe,
            numeroIdentificacion: "No disponible",
            tipoIdentificacion: "No disponible",
            nacionalidad: "No disponible",
            parentesco: "Jefe de familia",
            genero: "No disponible",
            sexo: "No disponible",
            fechaNacimiento: "No disponible",
            discapacidad: "No disponible",
            tipoDiscapacidad: "No disponible",
            subtipoDiscapacidad: "No disponible",
            tieneCondicionSalud: "No disponible",
            tipoCondicionPoblacional: "No disponible",
            contactoEmergencia: "No disponible",
            provincia: "No disponible",
            canton: "No disponible",
            distrito: "No disponible",
            direccionExacta: "No disponible",
            nombreAlbergue: familiaItem.nombreAlbergue,
          },
        ]);
        setVistaActual("detalle");
        if (desdeRecientes) {
          setFamiliasPorAlbergue(familiasRecientes);
          setAlbergueSeleccionado({ nombre: "últimas familias registradas" }); // <--- aquí el cambio
        }
      }
    } catch (err) {
      showCustomToast("Error", "Error al cargar los detalles de la familia.", "error");
      console.error("Error:", err);
    } finally {
      setLoadingFamilias(false);
    }
  };

  const handleEgresarFamilia = async (familiaItem) => {
    try {
      const idUsuarioCreacion = localStorage.getItem("idUsuario");

      if (!familiaItem?.codigoFamilia) {
        showCustomToast("Error", "No se encontró el código de la familia.", "error");
        return;
      }
      if (!idUsuarioCreacion) {
        showCustomToast("Error", "No se encontró el usuario en sesión.", "error");
        return;
      }
      if (isNaN(Number(idUsuarioCreacion))) {
        showCustomToast("Error", "ID de usuario inválido.", "error");
        return;
      }

      const payload = {
        id: familiaItem.codigoFamilia,
        idModificacion: idUsuarioCreacion,
      };

      await familiasAPI.egresar(payload);
      showCustomToast("Éxito", "La familia ha sido egresada correctamente.", "success");

      if (albergueSeleccionado) {
        await handleSeleccionarAlbergue(albergueSeleccionado);
      }
      if (familiaItem.cedulaJefe) {
        const res = await familiasAPI.getById(familiaItem.cedulaJefe);
        setFamiliaSeleccionada(res.data);
      }
    } catch (error) {
      console.error("Error al egresar familia:", error);
      showCustomToast("Error", error.message || "No se pudo egresar la familia", "error");
    }
  };

  const irAAlbergues = () => {
    setVistaActual("albergues");
    setFamiliasPorAlbergue([]);
    setAlbergueSeleccionado(null);
    setFamiliaSeleccionada(null);
  };

  const volverABusqueda = () => {
    setVistaActual("busqueda");
    setFamilia(null);
    setFamiliasPorAlbergue([]);
    setAlbergueSeleccionado(null);
    setFamiliaSeleccionada(null);
    setIdentificacion("");
    setBusquedaCedula("");
  };

  const volverAFamilias = () => {
    setVistaActual("familias");
    setFamiliaSeleccionada(null);
  };

  return {
    identificacion,
    setIdentificacion,
    busquedaCedula,
    setBusquedaCedula,
    showSugerenciasCedula,
    setShowSugerenciasCedula,
    cedulasDisponibles,

    familia,
    loading,

    busquedaAlbergue,
    setBusquedaAlbergue,
    showSugerenciasAlbergue,
    setShowSugerenciasAlbergue,
    albergues,

    familiasPorAlbergue,
    albergueSeleccionado,
    familiaSeleccionada,
    vistaActual,
    loadingAlbergues,
    loadingFamilias,

    familiasRecientes,

    handleSubmit,
    handleSeleccionarAlbergue,
    handleSeleccionarFamilia,
    handleEgresarFamilia,
    irAAlbergues,
    volverABusqueda,
    volverAFamilias,
  };
};

export default useBusquedaFamiliaExtendida;
