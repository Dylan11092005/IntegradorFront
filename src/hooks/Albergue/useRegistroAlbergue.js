import { useEffect, useState } from 'react';
import {
  alberguesAPI,
  municipalidadAPI
} from '../../helpers/api';
import { showCustomToast } from '../../components/globalComponents/CustomToaster.jsx';
import { useUbicaciones } from '../useUbicaciones';

export function useRegistroAlbergue() {
  const [form, setForm] = useState({});
  const [municipalidades, setMunicipalidades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Usar el hook de ubicaciones
  const {
    provincias,
    cantones,
    distritos,
    setProvinciaId,
    setCantonId
  } = useUbicaciones();

  // Cargar municipalidades al inicializar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const muniRes = await municipalidadAPI.getAll();
        const lista = Array.isArray(muniRes) ? muniRes : muniRes.data ?? [];
        setMunicipalidades(lista);
      } catch {
        setMunicipalidades([]);
      }
    };
    cargarDatos();
  }, []);

  // Manejar cambio de provincia
  const handleProvinciaChange = (provinciaId, provinciaNombre) => {
    console.log('Provincia seleccionada:', { provinciaId, provinciaNombre });
    setForm(prev => ({ 
      ...prev, 
      provincia: provinciaNombre, 
      canton: '', 
      distrito: '' 
    }));
    setProvinciaId(provinciaId);
    setCantonId(''); // Limpiar cantón seleccionado
  };

  // Manejar cambio de cantón
  const handleCantonChange = (cantonId, cantonNombre) => {
    setForm(prev => ({ 
      ...prev, 
      canton: cantonNombre, 
      distrito: '' 
    }));
    setCantonId(cantonId);
  };

  // Manejar cambio de distrito
  const handleDistritoChange = (distritoNombre) => {
    setForm(prev => ({ 
      ...prev, 
      distrito: distritoNombre 
    }));
  };

  // Manejar cambios generales del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Validar campos requeridos según el esquema de la API
  const validarFormulario = () => {
    const camposRequeridos = [
      'idAlbergue',
      'nombre',
      'region',
      'provincia',
      'canton',
      'distrito',
      'direccion',
      'tipoEstablecimiento',
      'administrador',
      'telefono',
      'capacidadPersonas',
      'ocupacion',
      'cocina',
      'duchas',
      'serviciosSanitarios',
      'bodega',
      'menajeMobiliario',
      'tanqueAgua',
      'areaTotalM2',
      'idMunicipalidad'
    ];

    const faltantes = camposRequeridos.filter(campo => {
      const valor = form[campo];
      return valor === undefined || valor === '' || valor === null;
    });
    
    return faltantes;
  };

  // Preparar payload según el esquema exacto de la API
  const prepararPayload = () => {
     const idUsuarioCreacion = localStorage.getItem("idUsuario"); // <-- Integrado aquí
    return {
      // Campos requeridos
      idAlbergue: form.idAlbergue || "",
      nombre: form.nombre || "",
      region: form.region || "",
      provincia: form.provincia || "",
      canton: form.canton || "",
      distrito: form.distrito || "",
      direccion: form.direccion || "",
      tipoEstablecimiento: form.tipoEstablecimiento || "",
      administrador: form.administrador || "",
      telefono: form.telefono || "",
      capacidadPersonas: parseInt(form.capacidadPersonas, 10) || 0,
      ocupacion: parseInt(form.ocupacion, 10) || 0,
      cocina: form.cocina === "true" || form.cocina === true,
      duchas: form.duchas === "true" || form.duchas === true,
      serviciosSanitarios: form.serviciosSanitarios === "true" || form.serviciosSanitarios === true,
      bodega: form.bodega === "true" || form.bodega === true,
      menajeMobiliario: form.menajeMobiliario === "true" || form.menajeMobiliario === true,
      tanqueAgua: form.tanqueAgua === "true" || form.tanqueAgua === true,
      areaTotalM2: parseFloat(form.areaTotalM2) || 0,
      idMunicipalidad: parseInt(form.idMunicipalidad, 10) || 0,
      
      // Campos opcionales (nullable)
      capacidadColectiva: form.capacidadColectiva ? parseInt(form.capacidadColectiva, 10) : null,
      cantidadFamilias: form.cantidadFamilias ? parseInt(form.cantidadFamilias, 10) : null,
      egresos: form.egresos ? parseInt(form.egresos, 10) : null,
      sospechososSanos: form.sospechososSanos ? parseInt(form.sospechososSanos, 10) : null,
      otros: form.otros || null,
      coordenadaX: form.coordenadaX ? parseFloat(form.coordenadaX) : null,
      coordenadaY: form.coordenadaY ? parseFloat(form.coordenadaY) : null,
      tipoAlbergue: form.tipoAlbergue || null,
      condicionAlbergue: form.condicionAlbergue || null,
      especificacion: form.especificacion || null,
      detalleCondicion: form.detalleCondicion || null,
      seccion: form.seccion || null,
      requerimientosTecnicos: form.requerimientosTecnicos || null,
      costoRequerimientosTecnicos: form.costoRequerimientosTecnicos ? parseFloat(form.costoRequerimientosTecnicos) : null,
      color: form.color || null,
      idPedidoAbarrote: null,
      idUsuarioCreacion: idUsuarioCreacion ? parseInt(idUsuarioCreacion, 10) : null
    };
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validación de campos requeridos
      const faltantes = validarFormulario();
      if (faltantes.length > 0) {
        console.log('Campos faltantes:', faltantes);
        showCustomToast("Error", `Faltan campos requeridos: ${faltantes.join(', ')}`, "error");
        setLoading(false);
        return;
      }

      const payload = prepararPayload();
      console.log('Payload a enviar:', JSON.stringify(payload, null, 2));

      // Crear el albergue usando la API
      const response = await alberguesAPI.create(payload);
      console.log('Respuesta de la API:', response);
      
      showCustomToast("Éxito", "Albergue registrado correctamente.", "success");
      resetForm();
      
    } catch (error) {
      console.error('Error al registrar albergue:', error);
      const errorMessage = error.message || "Error al registrar albergue.";
      showCustomToast("Error", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setForm({});
    setProvinciaId('');
    setCantonId('');
  };

  // Opciones para los selects actualizadas
  const getSelectOptions = () => {
    const tipoAlbergueOpts = [
      "Centro Educativo", 
      "Salón Comunal", 
      "Iglesia", 
      "Redondel", 
      "Gimnasio", 
      "Casa de Acogida", 
      "Zona de Refugio Temporal"
    ].map(nombre => ({ nombre }));

    const tipoEstablecimientoOpts = [
      "Albergue temporal o de emergencia"
    ].map(nombre => ({ nombre }));

    const condicionAlbergueOpts = [
      "Abierto", 
      "Cerrado",
    ].map(nombre => ({ nombre }));

    const regionOpts = [
      "Región Central", 
      "Región Chorotega", 
      "Región Brunca", 
      "Región Huetar Caribe", 
      "Región Huetar Norte", 
      "Región Pacífico Central"
    ].map(nombre => ({ nombre }));

    const booleanOpts = [
      { nombre: "Sí", value: "true" },
      { nombre: "No", value: "false" }
    ];

    return {
      tipoAlbergueOpts,
      tipoEstablecimientoOpts,
      condicionAlbergueOpts,
      regionOpts,
      booleanOpts
    };
  };

  return {
    // Estado
    form,
    loading,
    provincias,
    cantones,
    distritos,
    municipalidades,

    // Funciones
    handleChange,
    handleProvinciaChange,
    handleCantonChange,
    handleDistritoChange,
    handleSubmit,
    resetForm,
    
    // Opciones
    ...getSelectOptions()
  };
}