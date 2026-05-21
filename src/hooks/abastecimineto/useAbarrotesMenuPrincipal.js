import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { showCustomToast } from '../../components/globalComponents/CustomToaster.jsx';
import { contextoAbastecimiento } from '../../context/contextoAbastecimiento.jsx';
import { pedidoConsumiblesAPI, alberguesAPI } from '../../helpers/api.js';

const opcionesComida = [
  { nombre: "Desayuno", value: "desayuno" },
  { nombre: "Almuerzo", value: "almuerzo" },
  { nombre: "Cena", value: "cena" },
];

export const useAbarrotesMenuPrincipal = () => {
  const navigate = useNavigate();
  const { guardarDatosFormulario } = useContext(contextoAbastecimiento);
  const [busquedaAlbergue, setBusquedaAlbergue] = useState("");
  const [showSugerenciasAlbergue, setShowSugerenciasAlbergue] = useState(false);
  const [resultadosAlbergue, setResultadosAlbergue] = useState([]);

  const [formData, setFormData] = useState({
    fecha: '',
    tipo: '',
    cantidad: '',
    albergue: null, 
  });

  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const cargarAlberguesPorUsuario = async () => {
      try {
        const idUsuario = localStorage.getItem("idUsuario"); 
        if (!idUsuario) {
          showCustomToast("Error", "Usuario no identificado", "error");
          setResultadosAlbergue([]);
          return;
        }
        const res = await alberguesAPI.getByUsuario(idUsuario);
        const listaAlbergues = Array.isArray(res.data) ? res.data : [];
        setResultadosAlbergue(listaAlbergues);
        console.log("Albergues cargados para usuario:", listaAlbergues);
      } catch (error) {
        console.error("Error cargando albergues por usuario:", error);
        showCustomToast("Error", "No se pudieron cargar los albergues para el usuario", "error");
        setResultadosAlbergue([]);
      }
    };

    cargarAlberguesPorUsuario();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectAlbergue = (albergueSeleccionado) => {
    setFormData(prev => ({
      ...prev,
      albergue: albergueSeleccionado,
    }));
    setShowSugerenciasAlbergue(false);
  };

  const handleSiguiente = async () => {
    const { fecha, tipo, cantidad, albergue } = formData;

    if (!fecha || !tipo || !cantidad || !albergue) {
      showCustomToast('Error', 'Complete todos los campos', 'error');
      return;
    }

    try {
      setLoading(true);

      const pedidoData = {
        fechaCreacion: fecha,
        tipoComida: tipo,
        cantidadPersonas: parseInt(cantidad, 10),
        idAlbergue: albergue.id, 
        idUsuarioCreacion: parseInt(localStorage.getItem("idUsuario"), 10) || 1,
      };

      const pedidoCreado = await pedidoConsumiblesAPI.create(pedidoData);

      guardarDatosFormulario({
        ...formData,
        idPedido: pedidoCreado.id,
      });

      showCustomToast('Éxito', 'Formulario guardado correctamente', 'success');

      setTimeout(() => {
        setLoading(false);
        navigate('/formularioAbarrotes.jsx');
      }, 10);
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      showCustomToast('Error', 'No se pudo guardar el formulario.', 'error');
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    today,
    opcionesComida,
    busquedaAlbergue,
    setBusquedaAlbergue,
    showSugerenciasAlbergue,
    setShowSugerenciasAlbergue,
    resultadosAlbergue,
    handleChange,
    handleSelectAlbergue,
    handleSiguiente,
  };
};
