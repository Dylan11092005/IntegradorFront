import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { personasAPI, inventarioAPI, alberguesAPI } from "../helpers/api";

const opcionesReporte = [
  { label: "Resumen de personas por albergue", value: "personas_por_albergue", campos: [{ label: "Nombre del albergue", name: "nombreAlbergue" }] },
  { label: "Resumen de personas por sexo", value: "personas_por_sexo", campos: [
    { label: "Sexo", name: "sexo" },
    { label: "Nombre del albergue", name: "nombreAlbergue" }
  ] },
  { label: "Resumen de personas por edad", value: "personas_por_edad", campos: [
    { label: "Edad mínima", name: "edadMin" },
    { label: "Edad máxima", name: "edadMax" },
    { label: "Nombre del albergue", name: "nombreAlbergue" }
  ] },
  { label: "Resumen de personas con discapacidad", value: "personas_discapacidad", campos: [{ label: "Nombre del albergue", name: "nombreAlbergue" }] },
  { label: "Resumen de suministros en albergues", value: "suministros_albergue", campos: [{ label: "Nombre del albergue", name: "nombreAlbergue" }] },
  { label: "Resumen de albergues por color de alerta", value: "albergues_por_color", campos: [{ label: "Color del albergue", name: "color" }] },
  { label: "Resumen de antecedentes médicos por albergue", value: "condiciones_especiales", campos: [] },
];

export function useReportesAlbergue() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [parametros, setParametros] = useState({});
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const [alberguesUsuario, setAlberguesUsuario] = useState([]);
  const [alberguesOptions, setAlberguesOptions] = useState([]);

  const idUsuario = localStorage.getItem("idUsuario");
  const isFetchingRef = useRef(false);

  // =================== Fetch Albergues ===================
  async function fetchAlbergues({ force = false } = {}) {
    if (isFetchingRef.current && !force) return;
    if (!force && alberguesUsuario.length > 0) return;
    isFetchingRef.current = true;
    try {
      let res;
      if (idUsuario) {
        try {
          res = await alberguesAPI.getByUsuario(idUsuario);
        } catch {
          res = await alberguesAPI.getAll();
        }
      } else {
        res = await alberguesAPI.getAll();
      }
      const data = Array.isArray(res?.data) ? res.data : (res?.data ? [res.data] : []);
      setAlberguesUsuario(data);
    } catch (error) {
      console.error("Error consultando albergues:", error);
      setAlberguesUsuario([]);
    } finally {
      isFetchingRef.current = false;
    }
  }

  useEffect(() => {
    fetchAlbergues();
  }, [idUsuario]);

  // =================== Normalizar opciones ===================
  useEffect(() => {
    const opts = alberguesUsuario.map(a => {
      const id = a.id ?? a.ID ?? a._id ?? a.codigo ?? a.idAlbergue ?? null;
      const nombre = a.nombre ?? a.nombreAlbergue ?? a.inmueble ?? "";
      const codigo = a.codigoAlbergue ?? a.codigo ?? id;
      const label = nombre ? `${nombre}${codigo ? ` — ${codigo}` : ""}` : String(codigo ?? "");
      const value = id ?? codigo ?? label;
      return { id, nombre, codigo, label, value, raw: a, idAlbergue: a.idAlbergue ?? a.codigoAlbergue ?? null };
    });
    setAlberguesOptions(opts);
  }, [alberguesUsuario]);

  // =================== Handlers ===================
  const handleReporteChange = (e) => {
    const selected = opcionesReporte.find(o => o.value === e.target.value);
    setReporteSeleccionado(selected);
    setResultados([]);
  };

  const handleChange = (e) => {
    setParametros(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAlbergueSelectFor = (reportValue) => (option) => {
    if (!reportValue) return;
    if (!option) {
      setParametros(prev => {
        const copy = { ...prev };
        copy[`id_${reportValue}`] = null;
        copy[`nombreAlbergue_${reportValue}`] = "";
        copy.id = null;
        copy.nombreAlbergue = "";
        return copy;
      });
      return;
    }
    const selectedId = option.id ?? option.value ?? option.idAlbergue ?? null;
    const selectedName = option.nombre ?? option.label ?? option.nombreAlbergue ?? "";

    setParametros(prev => ({
      ...prev,
      [`id_${reportValue}`]: selectedId,
      [`nombreAlbergue_${reportValue}`]: selectedName,
      id: selectedId,
      nombreAlbergue: selectedName,
    }));
  };

  const getAlbergueValueFor = (reportValue) => {
    if (!reportValue) return null;
    const selectedId = parametros[`id_${reportValue}`] ?? parametros.id ?? null;
    if (!selectedId) return null;
    const found = alberguesOptions.find(o => String(o.id) === String(selectedId) || String(o.idAlbergue) === String(selectedId) || String(o.value) === String(selectedId));
    if (found) return found;
    return { id: selectedId, value: selectedId, label: parametros[`nombreAlbergue_${reportValue}`] ?? parametros.nombreAlbergue ?? String(selectedId) };
  };

  const handleAlbergueFocusFor = async () => {
    await fetchAlbergues({ force: false });
  };

  // =================== Helpers de ID/nombre ===================
  const getIdForCurrentReport = () => {
    if (!reporteSeleccionado) return parametros.id ?? null;
    return parametros[`id_${reporteSeleccionado.value}`] ?? parametros.id ?? null;
  };

  const getNombreForCurrentReport = () => {
    if (!reporteSeleccionado) return parametros.nombreAlbergue ?? "";
    return parametros[`nombreAlbergue_${reporteSeleccionado.value}`] ?? parametros.nombreAlbergue ?? "";
  };

  // =================== Submit ===================
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!reporteSeleccionado) {
      toast.error("Seleccione un tipo de reporte");
      return;
    }
    setLoading(true);
    setResultados([]);

    try {
      const id = getIdForCurrentReport();
      const nombreAlbergue = getNombreForCurrentReport();

      switch (reporteSeleccionado.value) {
        case "personas_por_albergue": {
          if (!id) { toast.error("Debe seleccionar un albergue"); break; }
          const resumen = await personasAPI.getResumenPorAlbergue(id);
          setResultados(Array.isArray(resumen) ? resumen : [resumen]);
          break;
        }
        case "personas_por_sexo": {
          const sexo = parametros.sexo?.trim();
          if (!sexo) { toast.error("Debe completar el campo: Sexo"); break; }
          if (!id) { toast.error("Debe seleccionar un albergue"); break; }
          const resumenSexo = await personasAPI.getResumenPorSexoYAlbergue(sexo, id);
          setResultados(resumenSexo.data ? (Array.isArray(resumenSexo.data) ? resumenSexo.data : [resumenSexo.data]) : []);
          break;
        }
        case "personas_por_edad": {
          const { edadMin, edadMax } = parametros;
          if (!edadMin || !edadMax) { toast.error("Debe completar el rango de edad"); break; }
          if (!id) { toast.error("Debe seleccionar un albergue"); break; }
          const resumenEdad = await personasAPI.getResumenPorEdadYAlbergue(id, edadMin, edadMax);
          setResultados(resumenEdad.data ? (Array.isArray(resumenEdad.data) ? resumenEdad.data : [resumenEdad.data]) : []);
          break;
        }
        case "personas_discapacidad": {
          if (!id) { toast.error("Debe seleccionar un albergue"); break; }
          const discapacidad = await personasAPI.getPorDiscapacidad(id);
          setResultados(Array.isArray(discapacidad.data) ? discapacidad.data : [discapacidad.data || discapacidad]);
          break;
        }
        case "suministros_albergue": {
          if (!id) { toast.error("Debe seleccionar un albergue"); break; }
          let response = await inventarioAPI.getSuministrosPorId(id);
          console.log("Datos crudos de la API:", response.data);

          let data = response?.data;
          if (typeof data === "string") {
            try { data = JSON.parse(data); } catch (err) { console.error("Error al parsear JSON:", err); toast.error("Los datos recibidos no tienen un formato válido"); data = []; }
          }

          let items = [];
          if (Array.isArray(data)) {
            items = data.flat().filter(it => it && typeof it === "object" && Object.keys(it).length > 0)
              .map(it => ({ ...it, codigoAlbergue: id, nombreAlbergue }));
          } else if (data && typeof data === "object") {
            items = [{ ...data, codigoAlbergue: id, nombreAlbergue }];
          }

          console.log("Items procesados:", items);
          if (!items.length) toast("No se encontraron suministros para ese albergue");
          setResultados(items);
          break;
        }
        case "albergues_por_color": {
          let { color } = parametros;
          color = color?.trim().toLowerCase();
          if (!color) { toast.error("Debe completar el campo: Color del albergue"); break; }
          const porColor = await alberguesAPI.getByColor(color);
          setResultados(Array.isArray(porColor.data) ? porColor.data : []);
          break;
        }
        case "condiciones_especiales": {
          if (!id) { toast.error("Debe seleccionar un albergue"); break; }
          const condiciones = await personasAPI.getResumenPorCondiciones(id);
          setResultados(Array.isArray(condiciones.data) ? condiciones.data : [condiciones.data || condiciones]);
          break;
        }
        default:
          toast.error("Tipo de reporte no reconocido");
      }
    } catch (error) {
      console.error("Error generando reporte:", error);
      toast.error("No existen datos con los parámetros seleccionados");
    } finally {
      setLoading(false);
    }
  };

  // =================== Build Columns ===================
  const buildColumns = () => {
    if (!resultados || resultados.length === 0) return [];
    const sample = resultados[0] || {};
    return Object.keys(sample).map(key => ({
      name: key,
      key: key,
      selector: (row) => {
        const val = row[key];
        if (val === null || val === undefined) return "";
        if (typeof val === "object") {
          return val?.nombre || (Array.isArray(val) ? val.join(", ") : JSON.stringify(val));
        }
        return String(val);
      },
      sortable: true,
    }));
  };

  const getExportData = () => resultados;

  return {
    opcionesReporte,
    reporteSeleccionado,
    setReporteSeleccionado,
    parametros,
    setParametros,
    resultados,
    loading,
    handleReporteChange,
    handleChange,
    handleSubmit,
    buildColumns,
    getExportData,

    alberguesUsuario,
    alberguesOptions,
    fetchAlbergues,
    handleAlbergueSelectFor,
    getAlbergueValueFor,
    handleAlbergueFocusFor,
  };
}
