import React, { useState, useEffect } from "react";


const FamiliaDatosPersonales = ({ datos = {}, setDatos }) => {
  const [edad, setEdad] = useState("");

  const calcularEdad = (fecha) => {
    if (!fecha) return setEdad("");
    const nacimiento = new Date(fecha);
    if (isNaN(nacimiento.getTime())) return setEdad("");

    const hoy = new Date();
    let edadCalc = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edadCalc--;
    }
    setEdad(edadCalc);
    return edadCalc;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === "checkbox" ? checked : value;
    let nuevosDatos = { ...datos, [name]: nuevoValor };

    if (name === "fechaNacimiento") {
      const edadCalc = calcularEdad(value);
      nuevosDatos = { ...nuevosDatos, edad: edadCalc };
    }

    setDatos(nuevosDatos);
  };

  useEffect(() => {
    if (datos.edad !== undefined && datos.edad !== edad) {
      setEdad(datos.edad);
    }
  }, [datos.edad, edad]);

  useEffect(() => {
    if (!datos.tipoIdentificacion) {
      setDatos((prev) => ({ ...prev, tipoIdentificacion: "Cédula" }));
    }
  }, []);

  return (
    <div className="ficha-persona">
      <details open>
        <summary><strong>Información Personal</strong></summary>
        <fieldset>
          <label htmlFor="idFamilia">ID Familia:</label>
          <input
            id="idFamilia"
            name="idFamilia"
            type="text"
            onChange={handleChange}
            value={datos.idFamilia || ""}
            className="form-control"
          />

          <label htmlFor="nombre">Nombre:</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={datos.nombre || ""}
            onChange={handleChange}
            className="form-control"
          />

          <label htmlFor="primerApellido">Apellido 1:</label>
          <input
            id="primerApellido"
            name="primerApellido"
            type="text"
            value={datos.primerApellido || ""}
            onChange={handleChange}
            className="form-control"
          />

          <label htmlFor="segundoApellido">Apellido 2:</label>
          <input
            id="segundoApellido"
            name="segundoApellido"
            type="text"
            value={datos.segundoApellido || ""}
            onChange={handleChange}
            className="form-control"
          />

          <label htmlFor="tipoIdentificacion">Tipo de Identificación:</label>
          <select
            id="tipoIdentificacion"
            name="tipoIdentificacion"
            value={datos.tipoIdentificacion || "Cédula"}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Cédula">Cédula</option>
            <option value="DIMEX">DIMEX</option>
            <option value="Permiso laboral">Permiso laboral</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="No presenta">No presenta</option>
          </select>

          <label htmlFor="numeroIdentificacion">Número de Identificación:</label>
          <input
            id="numeroIdentificacion"
            name="numeroIdentificacion"
            type="text"
            value={datos.numeroIdentificacion || ""}
            onChange={handleChange}
            className="form-control"
          />

          <label htmlFor="nacionalidad">Nacionalidad:</label>
          <input
            id="nacionalidad"
            name="nacionalidad"
            type="text"
            value={datos.nacionalidad || ""}
            onChange={handleChange}
            className="form-control"
          />

          <label htmlFor="parentesco">Parentesco:</label>
          <select
            id="parentesco"
            name="parentesco"
            value={datos.parentesco || "Padre"}
            onChange={handleChange}
            className="form-select"
          >
            <option>Padre</option>
            <option>Madre</option>
            <option>Hijo</option>
            <option>Hija</option>
          </select>

          <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
          <input
            id="fechaNacimiento"
            name="fechaNacimiento"
            type="date"
            value={datos.fechaNacimiento || ""}
            onChange={handleChange}
            className="form-control"
          />

          <label htmlFor="edad">Edad:</label>
          <input
            id="edad"
            type="text"
            value={edad}
            readOnly
            className="form-control"
          />

          <label htmlFor="sexo">Sexo:</label>
          <select
            id="sexo"
            name="sexo"
            value={datos.sexo || "Masculino"}
            onChange={handleChange}
            className="form-select"
          >
            <option>Masculino</option>
            <option>Femenino</option>
            <option>Otro</option>
          </select>

          <label htmlFor="genero">Género:</label>
          <select
            id="genero"
            name="genero"
            value={datos.genero || "Otro"}
            onChange={handleChange}
            className="form-select"
          >
            <option>Hombre</option>
            <option>Mujer</option>
            <option>Hombre trans/Transmasculino</option>
            <option>Mujer trans/Transfemenina</option>
            <option>No se identifica con ninguna de las anteriores</option>
            <option>Prefiere no decir</option>
            <option>Otro</option>
          </select>

          <label htmlFor="telefono">Teléfono:</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            value={datos.telefono || ""}
            onChange={handleChange}
            className="form-control"
            placeholder="1234-5678"
          />

          <label htmlFor="contactoEmergencia">Contacto de Emergencia:</label>
          <input
            id="contactoEmergencia"
            name="contactoEmergencia"
            type="tel"
            value={datos.contactoEmergencia || ""}
            onChange={handleChange}
            className="form-control"
            placeholder="1234-5678"
          />

          <div className="checkbox-group">
            <input
              id="esJefeFamilia"
              type="checkbox"
              name="esJefeFamilia"
              checked={datos.esJefeFamilia || false}
              onChange={handleChange}
              className="form-check-input"
            />
            <label htmlFor="esJefeFamilia">¿Es jefe de familia?</label>
          </div>

          <div className="checkbox-group">
            <input
              id="estaACargoMenor"
              type="checkbox"
              name="estaACargoMenor"
              checked={datos.estaACargoMenor || false}
              onChange={handleChange}
              className="form-check-input"
            />
            <label htmlFor="estaACargoMenor">¿Está a cargo de un menor?</label>
          </div>

          <label htmlFor="observaciones">Observaciones:</label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={datos.observaciones || ""}
            onChange={handleChange}
            className="form-control"
          />
        </fieldset>
      </details>
    </div>
  );
};

export default FamiliaDatosPersonales;
