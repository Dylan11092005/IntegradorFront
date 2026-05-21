import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AlbergueLista = () => {
  const [albergues, setAlbergues] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [albergue, setAlbergue] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://api.integrador.dev/api/albergues/all')
      .then(res => setAlbergues(res.data.data || []))
      .catch(err => console.error('Error cargando albergues:', err));
  }, []);

  useEffect(() => {
    const selected = albergues.find(a => a.id === selectedId);
    setAlbergue(selected || null);
  }, [selectedId, albergues]);

  const handleActualizar = async () => {
    try {
      await axios.put(
        `https://api.integrador.dev/api/albergues/id/${albergue.id}`,
        albergue
      );
      alert('Albergue actualizado con éxito.');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar el albergue.');
    }
  };

  const handleEliminar = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este albergue?')) return;
    try {
      await axios.delete(
        `https://api.integrador.dev/api/albergues/id/${albergue.id}`
      );
      alert('Albergue eliminado.');
      window.location.reload();
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('No se pudo eliminar el albergue.');
    }
  };

  const handleChange = (e) => {
    setAlbergue({ ...albergue, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">
      <h2>
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary"
          style={{ position: 'absolute', right: '1cm', top: '50%', transform: 'translateY(-50%)', minWidth: '40px', padding: '8px' }}
        >
          <span className="material-icons" style={{ fontSize: '24px' }}>arrow_back</span>
        </button>
        Lista de Albergues
      </h2>

      <form>
        <details open>
          <summary><strong>Albergues</strong></summary>
          <fieldset className="mt-2">
            <label>Seleccionar albergue:</label>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="form-control mb-2">
              <option value="">Seleccione un albergue</option>
              {albergues.map(a => (
                <option key={a.id} value={a.id}>{`${a.idAlbergue} - ${a.nombre}`}</option>
              ))}
            </select>

            {albergue && (
              <fieldset>
                {Object.entries(albergue).map(([key, value]) => (
                  <div key={key}>
                    <label htmlFor={key}>{key}:</label>
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="form-control mb-2"
                      readOnly={key === 'id'}
                    />
                  </div>
                ))}

                <div className="mt-3">
                  <button type="button" className="btn btn-success me-2" onClick={handleActualizar}>
                    Actualizar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleEliminar}>
                    Eliminar
                  </button>
                </div>
              </fieldset>
            )}
          </fieldset>
        </details>
      </form>
    </div>
  );
};

export default AlbergueLista;