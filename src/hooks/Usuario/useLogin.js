import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authHelper from '../../helpers/sesion';
import { toast } from 'react-hot-toast';

export const useLogin = () => {
  const [form, setForm] = useState({
    usuario: '',
    contrasena: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // Verifica si hay un token válido
  const verificarToken = () => {
    const token = localStorage.getItem('token');
    return token && token.length > 0;
  };

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Valida el formulario
  const validarFormulario = () => {
    if (!form.usuario.trim() || !form.contrasena.trim()) {
      toast.error("Por favor complete todos los campos");
      return false;
    }
    return true;
  };

  // Maneja errores de autenticación
  const manejarError = (error) => {
    let mensajeError = 'Error al iniciar sesión. Verifica tus credenciales.';
    
    if (error.response?.status === 401) {
      mensajeError = 'Usuario o contraseña incorrecta';
    } else if (error.message?.toLowerCase().includes("unauthorized")) {
      mensajeError = 'No autorizado. Verifica tus credenciales.';
    } else if (error.message) {
      mensajeError = error.message;
    }

    toast.error(mensajeError);
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setIsLoading(true);

    try {
      await authHelper.login(form.usuario, form.contrasena);

      // Obtener nombre del usuario desde localStorage
      const nombreUsuario = localStorage.getItem('nombreUsuario') || form.usuario;
      setUserData({ username: form.usuario, nombre: nombreUsuario });
      localStorage.setItem('userData', JSON.stringify({ username: form.usuario, nombre: nombreUsuario }));

      if (verificarToken()) {
        toast.success('Inicio de sesión exitoso');
        navigate('/inicio');
      } else {
        toast.error('Inicio de sesión fallido. Token no generado.');
      }
    } catch (error) {
      manejarError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    userData,
    handleChange,
    handleSubmit
  };
};