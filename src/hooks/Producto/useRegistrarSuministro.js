import { useState, useEffect } from 'react';
import { productosAPI, alberguesAPI } from '../../helpers/api';
import { showCustomToast } from '../../components/globalComponents/CustomToaster';

const useRegistrarSuministro = () => {
  const [form, setForm] = useState({
    codigo: '',
    descripcion: '',
    categoria: '',
    producto: '',
    unidad: '',
    cantidad: '',
    idAlbergue: '', // guardamos el id numérico del albergue seleccionado
  });

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [mostrarAlertaMensaje, setMostrarAlertaMensaje] = useState(false);
  const [mostrarAlertaError, setMostrarAlertaError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [albergues, setAlbergues] = useState([]);

  useEffect(() => {
    const cargarAlbergues = async () => {
      const idUsuario = localStorage.getItem("idUsuario");
      if (!idUsuario) {
        showCustomToast("Error", "Usuario no identificado.", "error");
        setAlbergues([]);
        return;
      }

      try {
        const res = await alberguesAPI.getByUsuario(idUsuario);
        const listaAlbergues = Array.isArray(res) ? res : res.data || [];
        setAlbergues(listaAlbergues);
      } catch (err) {
        console.error("Error cargando albergues:", err);
        showCustomToast("Error", "No se pudieron cargar los albergues", "error");
        setAlbergues([]);
      }
    };

    cargarAlbergues();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "idAlbergue" && value !== "" ? Number(value) : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        codigoProducto: form.codigo,
        nombre: form.producto,
        descripcion: form.descripcion,
        cantidad: parseInt(form.cantidad, 10),
        categoria: parseInt(form.categoria, 10),
        unidadMedida: parseInt(form.unidad, 10),
        idAlbergue: form.idAlbergue,  // Aquí envías el id numérico
      };

      await productosAPI.create(data);
      showCustomToast("Éxito", "Producto registrado correctamente", "success");
      setError('');
      setForm({
        codigo: '',
        descripcion: '',
        categoria: '',
        producto: '',
        unidad: '',
        cantidad: '',
        idAlbergue: '',
      });
    } catch (err) {
      console.error(err);
      showCustomToast("Error", "Hubo un error al registrar el producto. Intente de nuevo.", "error");
      setMensaje('');
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
    mensaje,
    error,
    mostrarAlertaMensaje,
    mostrarAlertaError,
    setMostrarAlertaMensaje,
    setMostrarAlertaError,
    loading,
    albergues,
  };
};

export default useRegistrarSuministro;
