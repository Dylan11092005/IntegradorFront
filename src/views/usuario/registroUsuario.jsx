import React, { useState } from 'react';
import { useRegistroUsuario } from '../../hooks/Usuario/useRegistroUsuario.js';
import FormContainer from '../../components/FormComponents/FormContainer.jsx';
import InputField from '../../components/FormComponents/InputField.jsx';
import SearchAutocompleteInput from '../../components/FormComponents/SearchAutocompleteInput.jsx';
import SelectField from '../../components/FormComponents/SelectField.jsx';
import SubmitButton from '../../components/FormComponents/SubmitButton.jsx';
import CustomToaster from '../../components/globalComponents/CustomToaster.jsx';

const RegistroUsuario = () => {
  const {
    municipalidades,
    form,
    roles,
    estados,
    handleChange,
    handleSubmit,
  } = useRegistroUsuario();

  const [busquedaMunicipalidad, setBusquedaMunicipalidad] = useState('');
  const [showSugerenciasMunicipalidad, setShowSugerenciasMunicipalidad] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "identificacion") {
      // Allow only numbers by removing non-digit characters
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 50);
      handleChange({ target: { name, value: numericValue } });
    } else {
      handleChange({ target: { name, value: value.slice(0, 50) } });
    }
  };

  return (
    <>
      <FormContainer
        title="Registro de Usuario"
        onSubmit={handleSubmit}
        size="md"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <InputField
              label="Nombre Completo"
              name="nombre"
              value={form.nombre}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex-1">
            <InputField
              label="Identificación"
              name="identificacion"
              value={form.identificacion}
              onChange={handleInputChange}
              required
              type="tel"
              pattern="[0-9]*"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-1">
            <InputField
              label="Correo Electrónico"
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Contraseña"
              name="contrasena"
              type="password"
              value={form.contrasena}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-1">
            <SearchAutocompleteInput
              label="Municipalidad"
              busqueda={busquedaMunicipalidad}
              setBusqueda={(value) => setBusquedaMunicipalidad(value.slice(0, 50))}
              showSugerencias={showSugerenciasMunicipalidad}
              setShowSugerencias={setShowSugerenciasMunicipalidad}
              resultados={municipalidades}
              onSelect={(municipalidad) => {
                handleChange({
                  target: {
                    name: 'municipalidad',
                    value: municipalidad.id || municipalidad.ID,
                  },
                });
                setBusquedaMunicipalidad((municipalidad.nombre || municipalidad.Nombre || "").slice(0, 50));
              }}
              optionLabelKeys={['nombre', 'Nombre']}
              placeholder="Buscar municipalidad..."
            />
          </div>

          <div className="flex-1">
            <SelectField
              label="Rol"
              name="rol"
              value={form.rol}
              onChange={handleInputChange}
              options={roles}
              optionLabel="nombre"
              optionValue="value"
              required
            />
          </div>

          <div className="flex-1">
            <SelectField
              label="Estado"
              name="activo"
              value={form.activo}
              onChange={handleInputChange}
              options={estados}
              optionLabel="nombre"
              optionValue="value"
              required
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <SubmitButton width="w-full" color="text-black">
            Registrar
          </SubmitButton>
        </div>
      </FormContainer>

      <CustomToaster />
    </>
  );
};

export default RegistroUsuario;