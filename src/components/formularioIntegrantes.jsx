import React, { useState } from "react";
import FamiliaFormulario from "../views/familia/familiaFormulario.jsx";

const FormularioIntegrantes = () => {
  const cantidad = parseInt(localStorage.getItem("cantidadIntegrantes")) || 0;
  const [indice, setIndice] = useState(0);

  const handleSiguiente = () => {
    if (indice < cantidad - 1) {
      setIndice(indice + 1);
    } else {
      alert("Registro de integrantes completado.");
      // Aquí puedes navegar a otra página si lo deseas
    }
  };

  if (cantidad === 0) {
    return <p>No hay integrantes para registrar.</p>;
  }

  return (
    <div>
      <h4>
        Integrante {indice + 1} de {cantidad}
      </h4>
      <FamiliaFormulario numero={indice + 1} />
      <button
        className="btn-familia-paso"
        onClick={handleSiguiente}
        disabled={indice >= cantidad - 1}
      >
        {indice < cantidad - 1 ? "Siguiente" : "Finalizar"}
      </button>
    </div>
  );
};

export default FormularioIntegrantes;