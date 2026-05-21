import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const Inicio = () => {
  const [setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const testimonials = [
    {
      text: "Este sistema ha revolucionado la gestión de emergencias en nuestra región. La rapidez y eficiencia son incomparables.",
      author: "Dra. María González",
      role: "Directora de Protección Civil"
    },
    {
      text: "La facilidad para registrar familias y coordinar recursos ha mejorado significativamente nuestros tiempos de respuesta.",
      author: "Ing. Carlos Ruiz",
      role: "Coordinador de Emergencias"
    },
    {
      text: "Una herramienta indispensable para cualquier organización que maneje situaciones de crisis.",
      author: "Lic. Ana Torres",
      role: "Administradora de Albergues"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section con animación */}
      <div className="min-h-screen bg-gray-50 pt-16 relative overflow-hidden">
        {/* Elementos decorativos animados */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-50 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-teal-700 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-50 rounded-full opacity-25 animate-bounce delay-1000"></div>

        {/* Header principal */}
        <div className={`={container mx-auto px-4 py-12 transition-all duration-1000 ${isVisible ?  'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
            <div className="cursor-pointer font-bold py-6 px-6 select-none bg-teal-700 text-white hover:bg-teal-800 transition-colors duration-200 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-700 rounded-full mb-6 shadow-2xl animate-pulse">
                <span className="material-icons text-white text-5xl">home_work</span>
              </div>
              
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-100 rounded-full opacity-50 animate-pulse"></div>
                <div className="absolute -top-20 right-0 w-24 h-24 bg-yellow-200 rounded-full opacity-40 animate-bounce"></div>
                <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-yellow-300 rounded-full opacity-30 animate-pulse delay-1000"></div>
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">
                  <span className="text-white">Sistema de Gestión de</span>
                  <span className="block text-yellow-400">Albergues</span>
                </h1>
              </div>
              
              <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relajadas mb-2 text-white">
                Solución integral para <strong className="text-yellow-400">agilizar y eficientizar</strong> el registro de familias, suministros y albergues en situaciones de emergencia.
              </p>
            </div>
          </div>

          {/* Características principales mejoradas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="group bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-all duration-200 border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-50 to-yellow-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg">
                  <span className="material-icons text-teal-700 text-3xl">groups</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Registro de Familias</h3>
                <p className="text-gray-600 leading-relaxed">Sistema rápido y seguro para el registro de familias afectadas con validación en tiempo real</p>
                <div className="mt-4 flex items-center text-yellow-700 font-semibold cursor-pointer"
                     onClick={() => navigate("/preFormulario.jsx")}
                >
                  <span className="text-sm">Ver más</span>
                  <span className="material-icons ml-1 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-all duration-200 border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-700 to-teal-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg">
                  <span className="material-icons text-white text-3xl">inventory_2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Control de Suministros</h3>
                <p className="text-gray-600 leading-relaxed">Gestión eficiente del inventario y distribución de recursos con alertas automáticas</p>
                <div className="mt-4 flex items-center text-teal-700 font-semibold cursor-pointer"
                     onClick={() => navigate("/registroSuministros.jsx")}
                >
                  <span className="text-sm">Ver más</span>
                  <span className="material-icons ml-1 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-all duration-200 border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-50 to-yellow-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg">
                  <span className="material-icons text-white text-3xl">hotel</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Gestión de Albergues</h3>
                <p className="text-gray-600 leading-relajadas">Administración centralizada de espacios y capacidades con monitoreo en vivo</p>
                <div
                  className="mt-4 flex items-center text-yellow-700 font-semibold cursor-pointer"
                  onClick={() => navigate("/registroAlbergue.jsx")}
                >
                  <span className="text-sm">Ver más</span>
                  <span className="material-icons ml-1 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </div>

            <div className="group bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-all duration-200 border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-700 to-teal-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-lg">
                  <span className="material-icons text-white text-3xl">flash_on</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Respuesta Rápida</h3>
                <p className="text-gray-600 leading-relajadas">Coordinación ágil y efectiva ante situaciones de emergencia con notificaciones push</p>
                <div className="mt-4 flex items-center text-teal-700 font-semibold cursor-pointer"
                     onClick={() => navigate("/reportes.jsx")}
                >
                  <span className="text-sm">Ver más</span>
                  <span className="material-icons ml-1 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nueva sección: Flujo de trabajo */}
          <div className="bg-white rounded-3xl p-12 shadow-xl mb-20 border border-gray-100">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
              ¿Cómo Funciona?
            </h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
              Proceso simplificado en 4 pasos para una gestión eficiente
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br  from-teal-700 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                  1
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Registro</h4>
                <p className="text-gray-600 text-sm">Registra familias y recursos de manera rápida y segura</p>
              </div>
              
              <div className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br  from-teal-700 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                  2
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Organización</h4>
                <p className="text-gray-600 text-sm">Clasifica y organiza la información automáticamente</p>
              </div>
              
              <div className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br  from-teal-700 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                  3
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Distribución</h4>
                <p className="text-gray-600 text-sm">Asigna recursos y espacios de manera eficiente</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br  from-teal-700 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg">
                  4
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Monitoreo</h4>
                <p className="text-gray-600 text-sm">Supervisa y actualiza en tiempo real</p>
              </div>
            </div>
          </div>

          {/* Sección de estadísticas mejorada */}
          <div className="bg-gradient-to-r from-teal-700 to-yellow-400 rounded-lg p-12 shadow-md mb-20 text-white">
            <h2 className="text-4xl font-bold text-center mb-4">
              Impacto del Sistema
            </h2>
            <p className="text-center mb-12 text-xl opacity-90">
              Resultados que marcan la diferencia
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">24/7</div>
                <p className="text-lg opacity-90">Disponibilidad continua</p>
                <span className="material-icons text-4xl mt-2 opacity-70">schedule</span>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">100%</div>
                <p className="text-lg opacity-90">Datos seguros</p>
                <span className="material-icons text-4xl mt-2 opacity-70">security</span>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">50%</div>
                <p className="text-lg opacity-90">Reducción de tiempo</p>
                <span className="material-icons text-4xl mt-2 opacity-70">speed</span>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">99.9%</div>
                <p className="text-lg opacity-90">Uptime garantizado</p>
                <span className="material-icons text-4xl mt-2 opacity-70">cloud_done</span>
              </div>
            </div>
          </div>

        
        </div>
    </div>
    </>
  );
};
export default Inicio;

