import React from "react";

const paises = [
  "Belice",
  "Costa Rica",
  "El Salvador",
  "Guatemala",
  "Honduras",
  "Nicaragua",
  "Panamá",
  "Argentina",
  "Venezuela",
  "Colombia",
];

const gruposIndigenasCR = [
  "Bribri",
  "Cabécar",
  "Maleku",
  "Guaymí (Ngäbe)",
  "Boruca",
  "Térraba",
  "Chorotega",
];

const FamiliaCaracteristicasPoblacionales = ({ datos = {}, setDatos }) => {
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const nuevoValor = type === "checkbox" ? checked : value;
    setDatos({ ...datos, [name]: nuevoValor });
  };

  return (
    <details open>
      <summary><strong>Características Poblacionales</strong></summary>
<fieldset className="mt-2">
 
  <div className="checkbox-group">
    <input 
      type="checkbox"
      name="indigena"
      checked={datos.indigena || false}
      onChange={handleChange}
      className="form-check-input"
    />
    <label htmlFor="checkbox1">Población Indígena</label>
  </div>



  {datos.indigena && (
    <>
      <br />
      <label>¿A qué pueblo indígena pertenece?:</label>
      <select
        name="grupoIndigena"
        value={datos.grupoIndigena || ""}
        onChange={handleChange}
        className="form-select mb-2"
      >
        <option value="">Seleccione un grupo indígena</option>
        {gruposIndigenasCR.map((grupo) => (
          <option key={grupo} value={grupo}>
            {grupo}
          </option>
        ))}
      </select>
    </>
  )}


<label className="form-label mt-3">
  ¿Cómo se autoidentifica según su origen e identidad cultural?
</label>
<select
  name="autoidentificacionCultural"
  value={datos.autoidentificacionCultural || ""}
  onChange={handleChange}
  className="form-select mb-2"
>
  <option value="">Seleccione una opción</option>
  <option value="china">China</option>
  <option value="indígena">Indígena</option>
  <option value="afrodescendiente">Negra o afrodescendiente</option>
  <option value="mestiza">Mestiza</option>
  <option value="blanca">Blanca</option>
  <option value="otra">OTRA</option>
  <option value="NS/NR">NS/NR</option>
</select>
  <br />

  <label>País de origen:</label>
  <select
    name="paises"
    value={datos.paises || ""}
    onChange={handleChange}
    className="form-select mb-2"
  >
    <option value="">Seleccione uno de los países</option>
    {paises.map((pais) => (
      <option key={pais} value={pais}>
        {pais}
      </option>
    ))}
  </select>
</fieldset>

    </details>
  );
};

export default FamiliaCaracteristicasPoblacionales;
