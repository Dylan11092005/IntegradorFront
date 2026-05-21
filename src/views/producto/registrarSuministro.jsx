import React, { useState } from 'react';
import useRegistrarSuministro from '../../hooks/Producto/useRegistrarSuministro.js';
import FormContainer from '../../components/FormComponents/FormContainer.jsx';
import InputField from '../../components/FormComponents/InputField.jsx';
import SelectField from '../../components/FormComponents/SelectField.jsx';
import SubmitButton from '../../components/FormComponents/SubmitButton.jsx';
import CustomToast from '../../components/globalComponents/CustomToaster.jsx';
import SearchAutocompleteInput from '../../components/FormComponents/SearchAutocompleteInput';


const categorias = [
  { value: 1, nombre: "Mobiliario" },
  { value: 2, nombre: "Ropa" },
  { value: 3, nombre: "Herramientas" },
  { value: 4, nombre: "Papelería" },
  { value: 5, nombre: "Electrónicos" },
  { value: 6, nombre: "Juguetes" },
];

const unidades = [
  { value: 1, nombre: "Mililitros" },
  { value: 2, nombre: "Gramos" },
  { value: 3, nombre: "Unidades" },
  { value: 4, nombre: "Metros" },
  { value: 5, nombre: "Kilos" },
];

const RegistrarSuministro = () => {
  const {
    form,
    handleChange,
    handleSubmit,
    mensaje,
    error,
    mostrarAlertaMensaje,
    mostrarAlertaError,
    setMostrarAlertaMensaje,
    setMostrarAlertaError,
    loading,
    albergues,
  } = useRegistrarSuministro();

  // Estado para controlar el texto de búsqueda y mostrar sugerencias del autocomplete
  const [busquedaAlbergue, setBusquedaAlbergue] = useState('');
  const [showSugerenciasAlbergue, setShowSugerenciasAlbergue] = useState(false);

  // Actualizar el formulario y el texto visible cuando se selecciona un albergue
  const onSelectAlbergue = (albergue) => {
    handleChange({ target: { name: 'idAlbergue', value: albergue.id } });
    setBusquedaAlbergue(`${albergue.idAlbergue} - ${albergue.nombre}`);
    setShowSugerenciasAlbergue(false);
  };

  // Sincronizar el texto visible si el idAlbergue cambia por otro medio (ejemplo edición)
  React.useEffect(() => {
    if (form.idAlbergue) {
      const albergueSel = albergues.find(a => a.id === form.idAlbergue);
      if (albergueSel) {
        setBusquedaAlbergue(`${albergueSel.idAlbergue} - ${albergueSel.nombre}`);
      }
    } else {
      setBusquedaAlbergue('');
    }
  }, [form.idAlbergue, albergues]);

  return (
    <>
      <FormContainer title="Registrar Suministros" onSubmit={handleSubmit} size="md">
        {mostrarAlertaMensaje && (
          <Alerta
            mensaje={mensaje}
            tipo="exito"
            duracion={4000}
            onClose={() => setMostrarAlertaMensaje(false)}
          />
        )}
        {mostrarAlertaError && (
          <Alerta
            mensaje={error}
            tipo="error"
            duracion={4000}
            onClose={() => setMostrarAlertaError(false)}
          />
        )}

        <fieldset className="w-full">
          <div className="flex flex-col md:flex-row md:gap-6 gap-4">
            <div className="flex-1">
              <InputField
                label="Código de Producto"
                name="codigo"
                value={form.codigo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Descripción"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:gap-6 gap-4 mt-4">
            <div className="flex-1">
              <InputField
                label="Nombre del Producto"
                name="producto"
                value={form.producto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Cantidad"
                name="cantidad"
                type="number"
                min="0"
                value={form.cantidad}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:gap-6 gap-4 mt-4">
            <div className="flex-1">
              <SelectField
                label="Categoría"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                options={categorias}
                optionLabel="nombre"
                optionValue="value"
                required
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Unidad"
                name="unidad"
                value={form.unidad}
                onChange={handleChange}
                options={unidades}
                optionLabel="nombre"
                optionValue="value"
                required
              />
            </div>
          </div>

          {/* Aquí el SearchAutocompleteInput para albergues */}
          <div className="flex flex-col gap-4 mt-4">
            <SearchAutocompleteInput
              label="Seleccionar Albergue"
              busqueda={busquedaAlbergue}
              setBusqueda={setBusquedaAlbergue}
              showSugerencias={showSugerenciasAlbergue}
              setShowSugerencias={setShowSugerenciasAlbergue}
              resultados={albergues}
              onSelect={onSelectAlbergue}
              optionLabelKeys={["idAlbergue", "nombre"]}
              placeholder="Buscar albergue..."
              sx={{ width: '100%' }}
              disabled={loading}
            />
          </div>
        </fieldset>

        <div className="flex justify-center mt-8">
          <SubmitButton width="w-full" color="text-black" loading={loading}>
            Agregar
          </SubmitButton>
        </div>
      </FormContainer>
      <CustomToast />
    </>
  );
};

export default RegistrarSuministro;
