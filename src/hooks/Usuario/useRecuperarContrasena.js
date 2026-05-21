import { useState, useEffect } from 'react';
import { usuariosAPI } from '../../helpers/api';
import axios from 'axios';

const useRecuperarContrasena = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [correo, setCorreo] = useState('');
  const [pin, setPin] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [correoValido, setCorreoValido] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [mostrarAlertaMensaje, setMostrarAlertaMensaje] = useState(false);
  const [mostrarAlertaError, setMostrarAlertaError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (mensaje) setMostrarAlertaMensaje(true);
  }, [mensaje]);

  useEffect(() => {
    if (error) setMostrarAlertaError(true);
  }, [error]);

  const enviarPinConBrevo = async (correo, pin) => {
    const data = {
      to: [{ email: correo }],
      templateId: 1,
      params: { pin },
      headers: { "X-Mailin-custom": "recuperacion_contrasena" }
    };
    const keyParts = [
      'xkeysib-1bf96d0f0cd54ad6',
      '77d5cd85cdbfb327cfde',
      '6db10663b8d28586994d',
      '4d4abcbb-gDzvWqKnB7eLNfOQ'
    ];
    const apiKey = keyParts.join('');
    await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
    });
  };

  const validarCorreo = async () => {
    if (!correo) {
      setError("Por favor ingrese su correo.");
      return;
    }
    
    setIsLoading(true);
    try {
      const { existe } = await usuariosAPI.validarCorreo(correo);
      if (existe) {
        const pinInfo = JSON.parse(localStorage.getItem('pinInfo') || '{}');
        const ahora = Date.now();
        if (pinInfo.correo === correo && pinInfo.expira > ahora) {
          setMensaje("PIN ya enviado recientemente. Revisa tu correo.");
        } else {
          const nuevoPin = Math.floor(1000 + Math.random() * 9000).toString();
          const expira = ahora + 10 * 60 * 1000;
          localStorage.setItem('pinInfo', JSON.stringify({ pin: nuevoPin, expira, correo }));
          await enviarPinConBrevo(correo, nuevoPin);
          setMensaje("Código de verificación enviado a tu correo.");
        }
        setCorreoValido(true);
        setCurrentStep(2);
        setError('');
      } else {
        setError("El correo no está registrado.");
      }
    } catch (err) {
      setError(err.message || "Error al validar el correo.");
    } finally {
      setIsLoading(false);
    }
  };

  const verificarPin = () => {
    const pinInfo = JSON.parse(localStorage.getItem('pinInfo') || '{}');
    const ahora = Date.now();
    
    if (pinInfo.correo !== correo || pinInfo.pin !== pin || ahora > pinInfo.expira) {
      setError("El código es incorrecto o ha expirado.");
      return;
    }
    
    setMensaje("Código verificado correctamente.");
    setCurrentStep(3);
    setError('');
  };

  const cambiarContrasena = async () => {
    if (!nuevaContrasena || !confirmarContrasena) {
      setError("Debe completar ambos campos de contraseña.");
      return;
    }
    
    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    
    if (nuevaContrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    
    setIsLoading(true);
    try {
      await usuariosAPI.updateContrasena(correo, nuevaContrasena);
      setMensaje("Contraseña actualizada exitosamente.");
      localStorage.removeItem('pinInfo');
      // Resetear formulario después de un tiempo
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch {
      setError("No se pudo actualizar la contraseña. Intenta más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setCorreo('');
    setPin('');
    setNuevaContrasena('');
    setConfirmarContrasena('');
    setCorreoValido(false);
    setMensaje('');
    setError('');
  };

  const goBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
      setMensaje('');
    }
  };

  return {
    currentStep,
    correo,
    setCorreo,
    pin,
    setPin,
    nuevaContrasena,
    setNuevaContrasena,
    confirmarContrasena,
    setConfirmarContrasena,
    correoValido,
    mensaje,
    error,
    mostrarAlertaMensaje,
    mostrarAlertaError,
    isLoading,
    validarCorreo,
    verificarPin,
    cambiarContrasena,
    goBackStep,
    resetForm,
    setMostrarAlertaMensaje,
    setMostrarAlertaError
  };
};

export default useRecuperarContrasena;
