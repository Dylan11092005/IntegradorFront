import { useState, useEffect } from 'react';
import { municipalidadAPI, usuariosAPI } from '../../helpers/api.js';
import { showCustomToast } from '../../components/globalComponents/CustomToaster.jsx';

const roles = [
  { nombre: "Administrador", value: "admin" },
  { nombre: "Editor", value: "editor" },
];

const estados = [
  { nombre: "Activo", value: "activo" },
  { nombre: "Inactivo", value: "inactivo" },
];

export const useRegistroUsuario = () => {
  const [municipalidades, setMunicipalidades] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    rol: '',
    activo: '',
    municipalidad: '',
    identificacion: ''
  });

  useEffect(() => {
    const fetchMunicipalidades = async () => {
      try {
        const data = await municipalidadAPI.getAll();
        const lista = Array.isArray(data) ? data : data.data ?? [];
        setMunicipalidades(lista || []);
      } catch {
        showCustomToast('Error', 'Error al cargar municipalidades.', 'error');
        setMunicipalidades([]);
      }
    };
    fetchMunicipalidades();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const { nombre, correo, contrasena, rol, activo, municipalidad, identificacion } = form;

    if (!nombre || !correo || !contrasena || !rol || !activo || !municipalidad || !identificacion) {
      showCustomToast('Error', 'Por favor complete todos los campos.', 'error');
      return;
    }

    const payload = {
      nombreUsuario: nombre.trim(),
      correo: correo.trim(),
      contrasenaHash: contrasena.trim(),
      rol: rol.trim(),
      activo: activo === 'activo',
      idMunicipalidad: parseInt(municipalidad),
      identificacion: identificacion.trim()
    };

    try {
      await usuariosAPI.create(payload);
      showCustomToast('Éxito', 'Usuario registrado correctamente.', 'success');
      setForm({
        nombre: '', correo: '', contrasena: '',
        rol: '', activo: '', municipalidad: '', identificacion: ''
      });
    } catch (error) {
      if (error.response) {
        showCustomToast('Error', 'Error del servidor: ' + JSON.stringify(error.response.data), 'error');
      } else {
        showCustomToast('Error', 'Error al conectar con el servidor.', 'error');
      }
    }
  };

  return {
    municipalidades,
    form,
    roles,
    estados,
    handleChange,
    handleSubmit
  };
};