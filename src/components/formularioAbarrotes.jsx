import React, { useState } from 'react';
import Carnes from './carne';
import Proteinas from './Proteinas';
import Verduras from './Verduras';
import Olores from './olores';
import Abarrotes from './abarrotes';
import Limpieza from './limpieza';
import ResumenParcial from './resumenParcial';
import ResumenFinal from './resumenFinal'; // ⬅️ Asegúrate de tener este componente
import '../styles/formAbasteci.css';

const FormularioAbastecimiento = () => {
  const [mostrarResumenParcial, setMostrarResumenParcial] = useState(false);
  const [mostrarResumenFinal, setMostrarResumenFinal] = useState(false);

  const handleIrAResumenParcial = () => {
    setMostrarResumenParcial(true);
  };

  const handleVolverFormulario = () => {
    setMostrarResumenParcial(false);
    setMostrarResumenFinal(false);
  };

  const handleVerResumenFinal = () => {
    setMostrarResumenFinal(true);
  };

  return (
<div className="contenedor-formulario">
  {mostrarResumenParcial ? (
    <>
      <ResumenParcial />
      <div className="botones-formulario">
        <button onClick={handleVolverFormulario} className="btn-volver">
          Volver al Formulario
        </button>
      </div>
    </>
  ) : mostrarResumenFinal ? (
    <>
      <ResumenFinal />
      <div className="botones-formulario">
        <button onClick={handleVolverFormulario} className="btn-volver">
          Volver al Formulario
        </button>
      </div>
    </>
  ) : (
    <>
      <h1 className="titulo-formulario">Formulario de Abastecimiento</h1>
      <div className="form-seccion">
        <Carnes />
        <Proteinas />
        <Verduras />
        <Olores />
        <Abarrotes />
        <Limpieza />
      </div>
      <div className="botones-formulario">
        <button onClick={handleIrAResumenParcial} className="btn-resumen">
          Ver Resumen Parcial
        </button>
        <button onClick={handleVerResumenFinal} className="btn-resumen-final">
          Ver Resumen Final
        </button>

        <button className="btn-enviar">
          Enviar Formulario
        </button>


      </div>
    </>
  )}
</div>
  );
};

export default FormularioAbastecimiento;