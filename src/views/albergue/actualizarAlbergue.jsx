import React, { useRef } from "react";
import { useActualizarAlbergue } from "../../hooks/Albergue/useActualizarAlbergue";
import FormContainer from "../../components/FormComponents/FormContainer.jsx";
import InputField from "../../components/FormComponents/InputField.jsx";
import SelectField from "../../components/FormComponents/SelectField.jsx";
import SubmitButton from "../../components/FormComponents/SubmitButton.jsx";
import CustomToaster, { showCustomToast } from "../../components/globalComponents/CustomToaster.jsx";
import SearchAutocompleteInput from "../../components/FormComponents/SearchAutocompleteInput.jsx";

const siNoOpts = [
  { nombre: "Sí", value: "true" },
  { nombre: "No", value: "false" }
];





function ActualizarAlbergue() {
  const inputRef = useRef();
  const {
    albergues,
    busquedaAlbergue,
    setBusquedaAlbergue,
    showSugerencias,
    setShowSugerencias,
    form,
    setForm,
    loading,
    handleChange,
    handleSelectAlbergue,
    actualizarAlbergue,
    buscarAlbergues,
    actualizando,
  } = useActualizarAlbergue();

  // Cargar la lista de albergues al montar si está vacía
  React.useEffect(() => {
    if (albergues.length === 0) {
      buscarAlbergues();
    }
    // eslint-disable-next-line
  }, []);


  // Cancelar edición y mostrar toast
  const handleCancelar = () => {
    setForm({});
    setBusquedaAlbergue("");
    showCustomToast("Cancelado", "Edición cancelada.", "info");
  };

  // Filtrar albergues en vivo según la búsqueda
  const filteredAlbergues = busquedaAlbergue.trim().length === 0
    ? albergues
    : albergues.filter(a => {
        const search = busquedaAlbergue.toLowerCase();
        return (
          a.nombre && a.nombre.toLowerCase().includes(search)
        );
      });

  // Solo cargar el form al presionar Buscar
  const [albergueSeleccionado, setAlbergueSeleccionado] = React.useState(null);

  const handleSelectNombre = (albergue) => {
    setAlbergueSeleccionado(albergue);
    setBusquedaAlbergue(albergue ? albergue.nombre : "");
  };

  const handleBuscarYMostrar = async () => {
    if (!albergueSeleccionado) {
      showCustomToast("Selecciona un albergue", "Debes seleccionar un albergue antes de continuar.", "info");
      return;
    }
    await handleSelectAlbergue(albergueSeleccionado); // <-- ahora es async
    setShowSugerencias(false);
  };

  return (
    <FormContainer title="Actualizar Albergue" size="md" onSubmit={actualizarAlbergue}>
      { (!form.id && !form.idAlbergue) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
          <div className="flex-1">
            <SearchAutocompleteInput
              label="Buscar Albergue"
              busqueda={busquedaAlbergue}
              setBusqueda={setBusquedaAlbergue}
              showSugerencias={showSugerencias}
              setShowSugerencias={setShowSugerencias}
              resultados={filteredAlbergues}
              onSelect={handleSelectNombre}
              optionLabelKeys={["nombre"]}
              placeholder="Nombre del albergue..."
              loading={loading}
              inputRef={inputRef}
              disabled={albergues.length === 0}
            />
          </div>
          <div>
            <SubmitButton
              type="button"
              loading={loading}
              onClick={async (e) => {
                e.preventDefault();
                await handleBuscarYMostrar();
              }}
              width="w-full"
              color="btn-primary"
            >
              Buscar
            </SubmitButton>
          </div>
        </div>
      )}

      {form.id && (
        <>
          {/* Identificación */}
          <fieldset>
            <legend className="font-bold text-lg mb-4 text-[#00897B]">Identificación del Albergue</legend>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <InputField label="ID del Albergue" name="idAlbergue" value={form.idAlbergue || ''} onChange={e => handleChange('idAlbergue', e.target.value)} required placeholder="Ej: ALB001" readOnly />
              </div>
              <div className="flex-1">
                <InputField label="Nombre del Albergue" name="nombre" value={form.nombre || ''} onChange={e => handleChange('nombre', e.target.value)} required placeholder="Ej: Escuela Juan Mora Fernández" />
              </div>
              <div className="flex-1">
                <InputField label="Especificación" name="especificacion" value={form.especificacion || ''} onChange={e => handleChange('especificacion', e.target.value)} placeholder="Detalles adicionales (opcional)" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 mt-4">
              <div className="flex-1">
                <InputField label="Estado del Albergue" name="condicionAlbergue" value={form.condicionAlbergue || ''} onChange={e => handleChange('condicionAlbergue', e.target.value)} required />
              </div>
            </div>
          </fieldset>

          {/* Capacidad y Ocupación */}
          <fieldset className="mt-8">
            <legend className="font-bold text-lg mb-4 text-[#00897B]">Capacidad y Ocupación</legend>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <InputField label="Capacidad Total de Personas" name="capacidadPersonas" type="number" min="0" value={form.capacidadPersonas || ''} onChange={e => handleChange('capacidadPersonas', e.target.value)} required />
              </div>
              <div className="flex-1">
                <InputField label="Capacidad Colectiva" name="capacidadColectiva" type="number" min="0" value={form.capacidadColectiva || ''} onChange={e => handleChange('capacidadColectiva', e.target.value)} placeholder="Opcional" />
              </div>
              <div className="flex-1">
                <InputField label="Ocupación" name="ocupacion" type="number" min="0" value={form.ocupacion || ''} onChange={e => handleChange('ocupacion', e.target.value)} required />
              </div>
            </div>
          </fieldset>

          {/* Condición y Requerimientos Técnicos */}
          <fieldset className="mt-8">
            <legend className="font-bold text-lg mb-4 text-[#00897B]">Condición y Requerimientos Técnicos</legend>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <InputField label="Detalle de Condición" name="detalleCondicion" value={form.detalleCondicion || ''} onChange={e => handleChange('detalleCondicion', e.target.value)} placeholder="Detalles sobre la condición (opcional)" />
              </div>
            </div>
          </fieldset>

          {/* Infraestructura */}
          <fieldset className="mt-8">
            <legend className="font-bold text-lg mb-4 text-[#00897B]">Infraestructura</legend>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <SelectField label="Cocina" name="cocina" value={form.cocina || ''} onChange={e => handleChange('cocina', e.target.value)} options={siNoOpts} optionLabel="nombre" optionValue="value" required />
              </div>
              <div className="flex-1">
                <SelectField label="Duchas" name="duchas" value={form.duchas || ''} onChange={e => handleChange('duchas', e.target.value)} options={siNoOpts} optionLabel="nombre" optionValue="value" required />
              </div>
              <div className="flex-1">
                <SelectField label="Servicios Sanitarios" name="serviciosSanitarios" value={form.serviciosSanitarios || ''} onChange={e => handleChange('serviciosSanitarios', e.target.value)} options={siNoOpts} optionLabel="nombre" optionValue="value" required />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 mt-4">
              <div className="flex-1">
                <SelectField label="Bodega" name="bodega" value={form.bodega || ''} onChange={e => handleChange('bodega', e.target.value)} options={siNoOpts} optionLabel="nombre" optionValue="value" required />
              </div>
              <div className="flex-1">
                <SelectField label="Menaje y Mobiliario" name="menajeMobiliario" value={form.menajeMobiliario || ''} onChange={e => handleChange('menajeMobiliario', e.target.value)} options={siNoOpts} optionLabel="nombre" optionValue="value" required />
              </div>
              <div className="flex-1">
                <SelectField label="Tanque de Agua" name="tanqueAgua" value={form.tanqueAgua || ''} onChange={e => handleChange('tanqueAgua', e.target.value)} options={siNoOpts} optionLabel="nombre" optionValue="value" required />
              </div>
            </div>
          </fieldset>

          {/* Administrador y Contacto */}
          <fieldset className="mt-8">
            <legend className="font-bold text-lg mb-4 text-[#00897B]">Administrador y Contacto</legend>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <InputField label="Administrador" name="administrador" value={form.administrador || ''} onChange={e => handleChange('administrador', e.target.value)} required placeholder="Nombre del administrador" />
              </div>
              <div className="flex-1">
                <InputField label="Teléfono" name="telefono" type="tel" value={form.telefono || ''} onChange={e => handleChange('telefono', e.target.value)} required placeholder="Ej: 2222-3333" />
              </div>
              <div className="flex-1">
                <InputField label="Color de Identificación" name="color" value={form.color || ''} onChange={e => handleChange('color', e.target.value)} placeholder="Color para mapas (opcional)" />
              </div>
            </div>
          </fieldset>

          <div className="flex gap-4 justify-end mt-6">
            <SubmitButton type="submit" loading={actualizando} color="btn-primary">Actualizar</SubmitButton>
            <button type="button" className="btn btn-secondary" onClick={handleCancelar}>Cancelar</button>
          </div>
        </>
      )}
      <CustomToaster />
    </FormContainer>
  );
}

export default ActualizarAlbergue;


