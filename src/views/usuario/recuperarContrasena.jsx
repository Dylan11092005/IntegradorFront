import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useRecuperarContrasena from '../../hooks/Usuario/useRecuperarContrasena.js';
import CustomToaster from '../../components/globalComponents/CustomToaster';
import { toast } from 'react-hot-toast';

const RecuperarContrasena = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    correo,
    setCorreo,
    pin,
    setPin,
    nuevaContrasena,
    setNuevaContrasena,
    confirmarContrasena,
    setConfirmarContrasena,
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
    setMostrarAlertaError,
  } = useRecuperarContrasena();

  // Mostrar mensajes con toast
  useEffect(() => {
    if (mostrarAlertaMensaje && mensaje) {
      toast.success(mensaje);
      setMostrarAlertaMensaje(false);
    }
    if (mostrarAlertaError && error) {
      toast.error(error);
      setMostrarAlertaError(false);
    }
  }, [mostrarAlertaMensaje, mensaje, mostrarAlertaError, error]);

  const renderStep1 = () => (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="bg-yellow-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1l-12 22h24l-12-22zm-1 8h2v7h-2v-7zm1 11.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Ingresa tu Correo Electrónico</h3>
        <p className="text-sm text-gray-600">Para recibir un código de verificación</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); validarCorreo(); }} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
          <input
            type="email"
            placeholder="correo@ejemplo.com"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !correo}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            isLoading || !correo
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );

  const renderStep2 = () => (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="bg-yellow-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.41 3.59-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.41-3.59 8-8 8z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Verifica tu Correo</h3>
        <p className="text-sm text-gray-600">Ingresa el código de 4 dígitos enviado a</p>
        <p className="text-sm font-medium text-gray-800">{correo}</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); verificarPin(); }} className="space-y-5">
        <div>
          <div className="flex justify-center space-x-2 mb-4">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={pin[index] || ''}
                onChange={(e) => {
                  const newPin = pin.split('');
                  newPin[index] = e.target.value;
                  setPin(newPin.join(''));
                  
                  // Auto-focus next input
                  if (e.target.value && index < 3) {
                    const nextInput = e.target.parentNode.children[index + 1];
                    if (nextInput) nextInput.focus();
                  }
                }}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            className="text-yellow-600 text-sm hover:underline"
            onClick={validarCorreo}
            disabled={isLoading}
          >
            Reenviar Código
          </button>
        </div>

        <button
          type="submit"
          disabled={pin.length !== 4}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            pin.length !== 4
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
        >
          Verificar
        </button>
      </form>
    </div>
  );

  const renderStep3 = () => (
    <div className="p-8">
      <div className="text-center mb-6">
        <div className="bg-yellow-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Crear Nueva Contraseña</h3>
        <p className="text-sm text-gray-600">Tu nueva contraseña debe ser diferente de la anterior</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); cambiarContrasena(); }} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
          <input
            type="password"
            placeholder="••••••••••••"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
          <input
            type="password"
            placeholder="••••••••••••"
            value={confirmarContrasena}
            onChange={(e) => setConfirmarContrasena(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="button"
            className="text-yellow-600 text-sm hover:underline"
            onClick={resetForm}
          >
            Cambiar Contraseña
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || !nuevaContrasena || !confirmarContrasena}
          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
            isLoading || !nuevaContrasena || !confirmarContrasena
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-yellow-500 hover:bg-yellow-600'
          }`}
        >
          {isLoading ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Olvidé mi Contraseña';
      case 2: return 'Verificar tu Correo';
      case 3: return 'Crear Nueva Contraseña';
      default: return 'Recuperar Contraseña';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <CustomToaster />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 py-6 px-6">
          <div className="flex items-center justify-between">
            {currentStep > 1 && (
              <button
                onClick={goBackStep}
                className="text-white hover:text-yellow-100 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h2 className="text-xl font-bold text-white text-center flex-1">
              {getStepTitle()}
            </h2>
            {currentStep > 1 && <div className="w-6"></div>}
          </div>
        </div>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="px-8 pb-6">
          <button
            type="button"
            className="w-full py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
            onClick={() => navigate('/')}
            disabled={isLoading}
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;
