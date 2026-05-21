import React from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../../hooks/Usuario/useLogin';
import CustomToaster from '../../components/globalComponents/CustomToaster';

const Login = () => {
  const {
    form,
    isLoading,
    handleChange,
    handleSubmit,
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <CustomToaster />
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#00897B] py-4 px-6">
          <h2 className="text-2xl font-bold text-center text-white">Iniciar Sesión</h2>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                placeholder="Ingrese su usuario"
                value={form.usuario}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00897B] transition"
              />
            </div>
            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                id="contrasena"
                name="contrasena"
                placeholder="Ingrese su contraseña"
                value={form.contrasena}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00897B] transition"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-lg bg-[#00897B] text-white font-semibold hover:bg-[#00796B] transition ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
            <div className="text-center mt-2">
              <Link to="/recuperarContrasena" className="text-[#00897B] hover:underline text-sm">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;