import React from 'react';

const ResultadoAlbergue = ({ resultado }) => {
  return (
    <div className="albergue-resultado espaciado-texto">
      <h2>Resultado</h2>
      <ul>
        {Object.entries(resultado).map(([key, value]) => (
          <li key={key}>
            <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> <span>{value || '—'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResultadoAlbergue;