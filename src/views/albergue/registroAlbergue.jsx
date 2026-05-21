import React from 'react';
import FormContainer from '../../components/FormComponents/FormContainer.jsx';
import InputField from '../../components/FormComponents/InputField.jsx';
import SelectField from '../../components/FormComponents/SelectField.jsx';
import SubmitButton from '../../components/FormComponents/SubmitButton.jsx';
import CustomToaster from '../../components/globalComponents/CustomToaster.jsx';
import { useRegistroAlbergue } from '../../hooks/Albergue/useRegistroAlbergue';

export default function RegistroAlbergue() {
  const {
    // Estado
    form,
    loading,
    provincias,
    cantones,
    distritos,
    municipalidades,

    // Funciones
    handleChange,
    handleProvinciaChange,
    handleCantonChange,
    handleDistritoChange,
    handleSubmit,

    // Opciones
    tipoAlbergueOpts,
    tipoEstablecimientoOpts,
    condicionAlbergueOpts,
    regionOpts,
    booleanOpts
  } = useRegistroAlbergue();

  return (
    <>
      <FormContainer
        title="Registro de Albergue"
        onSubmit={handleSubmit}
        size="lg"
      >
        {/* Identificación */}
        <fieldset>
          <legend className="font-bold text-lg mb-4 text-[#00897B]">Identificación del Albergue</legend>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <InputField
                label="ID del Albergue"
                name="idAlbergue"
                value={form.idAlbergue || ''}
                onChange={handleChange}
                required
                placeholder="Ej: ALB001"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Nombre del Albergue"
                name="nombre"
                value={form.nombre || ''}
                onChange={handleChange}
                required
                placeholder="Ej: Escuela Juan Mora Fernández"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Especificación"
                name="especificacion"
                value={form.especificacion || ''}
                onChange={handleChange}
                placeholder="Detalles adicionales (opcional)"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-1">
              <SelectField
                label="Tipo de Albergue"
                name="tipoAlbergue"
                value={form.tipoAlbergue || ''}
                onChange={handleChange}
                options={tipoAlbergueOpts}
                optionLabel="nombre"
                optionValue="nombre"
                required
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Tipo de Establecimiento"
                name="tipoEstablecimiento"
                value={form.tipoEstablecimiento || ''}
                onChange={handleChange}
                options={tipoEstablecimientoOpts}
                optionLabel="nombre"
                optionValue="nombre"
                required
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Estado del Albergue"
                name="condicionAlbergue"
                value={form.condicionAlbergue || ''}
                onChange={handleChange}
                options={condicionAlbergueOpts}
                optionLabel="nombre"
                optionValue="nombre"
                placeholder="Selecciona el estado (opcional)"
              />
            </div>
          </div>
        </fieldset>

        {/* Ubicación */}
        <fieldset className="mt-8">
          <legend className="font-bold text-lg mb-4 text-[#00897B]">Ubicación Geográfica</legend>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <SelectField
                label="Región"
                name="region"
                value={form.region || ''}
                onChange={handleChange}
                options={regionOpts}
                optionLabel="nombre"
                optionValue="nombre"
                required
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Provincia"
                name="provincia"
                value={form.provincia || ''}
                onChange={(e) => {
                  const selectedProvincia = provincias.find(p => p.descripcion === e.target.value);
                  if (selectedProvincia) {
                    handleProvinciaChange(selectedProvincia.idProvincia, selectedProvincia.descripcion);
                  }
                }}
                options={provincias.map(p => ({ nombre: p.descripcion }))}
                optionLabel="nombre"
                optionValue="nombre"
                required
                disabled={!provincias.length}
                placeholder={provincias.length === 0 ? "Cargando provincias..." : "Selecciona una provincia"}
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Cantón"
                name="canton"
                value={form.canton || ''}
                onChange={(e) => {
                  const selectedCanton = cantones.find(c => (c.descripcion || c.nombre) === e.target.value);
                  if (selectedCanton) {
                    handleCantonChange(selectedCanton.idCanton || selectedCanton.id, selectedCanton.descripcion || selectedCanton.nombre);
                  }
                }}
                options={cantones.map(c => ({ nombre: c.descripcion || c.nombre }))}
                optionLabel="nombre"
                optionValue="nombre"
                required
                disabled={!cantones.length || !form.provincia}
                placeholder={
                  !form.provincia
                    ? "Selecciona una provincia primero"
                    : cantones.length === 0
                      ? "Cargando cantones..."
                      : "Selecciona un cantón"
                }
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Distrito"
                name="distrito"
                value={form.distrito || ''}
                onChange={(e) => handleDistritoChange(e.target.value)}
                options={distritos.map(d => ({ nombre: d.descripcion || d.nombre }))}
                optionLabel="nombre"
                optionValue="nombre"
                required
                disabled={!distritos.length || !form.canton}
                placeholder={
                  !form.canton
                    ? "Selecciona un cantón primero"
                    : distritos.length === 0
                      ? "Cargando distritos..."
                      : "Selecciona un distrito"
                }
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-1">
              <InputField
                label="Dirección"
                name="direccion"
                value={form.direccion || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Coordenada X"
                name="coordenadaX"
                type="number"
                step="any"
                value={form.coordenadaX || ''}
                onChange={handleChange}
                placeholder="Ej: -84.083333 (opcional)"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Coordenada Y"
                name="coordenadaY"
                type="number"
                step="any"
                value={form.coordenadaY || ''}
                onChange={handleChange}
                placeholder="Ej: 9.933333 (opcional)"
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Municipalidad"
                name="idMunicipalidad"
                value={form.idMunicipalidad || ''}
                onChange={handleChange}
                options={municipalidades.map(m => ({
                  nombre: m.nombre || m.Nombre || 'Sin nombre',
                  id: m.id || m.ID
                }))}
                optionLabel="nombre"
                optionValue="id"
                required
              />
            </div>
          </div>
        </fieldset>

        {/* Capacidad y Ocupación */}
        <fieldset className="mt-8">
          <legend className="font-bold text-lg mb-4 text-[#00897B]">Capacidad y Ocupación</legend>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <InputField
                label="Capacidad Total de Personas"
                name="capacidadPersonas"
                type="number"
                min="0"
                value={form.capacidadPersonas || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Capacidad Colectiva"
                name="capacidadColectiva"
                type="number"
                min="0"
                value={form.capacidadColectiva || ''}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Ocupación"
                name="ocupacion"
                type="number"
                min="0"
                value={form.ocupacion || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Egresos"
                name="egresos"
                type="number"
                min="0"
                value={form.egresos || ''}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-1">
              <InputField
                label="Sospechosos Sanos"
                name="sospechososSanos"
                type="number"
                min="0"
                value={form.sospechososSanos || ''}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Otros (observaciones)"
                name="otros"
                value={form.otros || ''}
                onChange={handleChange}
                placeholder="Observaciones adicionales"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Cantidad de Familias"
                name="cantidadFamilias"
                type="number"
                min="0"
                value={form.cantidadFamilias || ''}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Área Total (m²)"
                name="areaTotalM2"
                type="number"
                min="0"
                step="0.01"
                value={form.areaTotalM2 || ''}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        
      </fieldset>

      {/* Condición y Requerimientos Técnicos */}
      <fieldset className="mt-8">
        <legend className="font-bold text-lg mb-4 text-[#00897B]">Condición y Requerimientos Técnicos</legend>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <InputField
              label="Detalle de Condición"
              name="detalleCondicion"
              value={form.detalleCondicion || ''}
              onChange={handleChange}
              placeholder="Detalles sobre la condición (opcional)"
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Sección"
              name="seccion"
              value={form.seccion || ''}
              onChange={handleChange}
              placeholder="Sección del albergue (opcional)"
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Requerimientos Técnicos"
              name="requerimientosTecnicos"
              value={form.requerimientosTecnicos || ''}
              onChange={handleChange}
              placeholder="Requerimientos necesarios (opcional)"
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Costo Requerimientos Técnicos"
              name="costoRequerimientosTecnicos"
              type="number"
              step="0.01"
              min="0"
              value={form.costoRequerimientosTecnicos || ''}
              onChange={handleChange}
              placeholder="Costo en colones (opcional)"
            />
          </div>
        </div>
      </fieldset>

      {/* Infraestructura */}
      <fieldset className="mt-8">
        <legend className="font-bold text-lg mb-4 text-[#00897B]">Infraestructura</legend>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <SelectField
              label="Cocina"
              name="cocina"
              value={form.cocina || ''}
              onChange={handleChange}
              options={booleanOpts}
              optionLabel="nombre"
              optionValue="value"
              required
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Duchas"
              name="duchas"
              value={form.duchas || ''}
              onChange={handleChange}
              options={booleanOpts}
              optionLabel="nombre"
              optionValue="value"
              required
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Servicios Sanitarios"
              name="serviciosSanitarios"
              value={form.serviciosSanitarios || ''}
              onChange={handleChange}
              options={booleanOpts}
              optionLabel="nombre"
              optionValue="value"
              required
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-1">
            <SelectField
              label="Bodega"
              name="bodega"
              value={form.bodega || ''}
              onChange={handleChange}
              options={booleanOpts}
              optionLabel="nombre"
              optionValue="value"
              required
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Menaje y Mobiliario"
              name="menajeMobiliario"
              value={form.menajeMobiliario || ''}
              onChange={handleChange}
              options={booleanOpts}
              optionLabel="nombre"
              optionValue="value"
              required
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Tanque de Agua"
              name="tanqueAgua"
              value={form.tanqueAgua || ''}
              onChange={handleChange}
              options={booleanOpts}
              optionLabel="nombre"
              optionValue="value"
              required
            />
          </div>
        </div>
      </fieldset>

      {/* Administrador y Contacto */}
      <fieldset className="mt-8">
        <legend className="font-bold text-lg mb-4 text-[#00897B]">Administrador y Contacto</legend>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <InputField
              label="Administrador"
              name="administrador"
              value={form.administrador || ''}
              onChange={handleChange}
              required
              placeholder="Nombre del administrador"
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Teléfono"
              name="telefono"
              type="tel"
              value={form.telefono || ''}
              onChange={handleChange}
              required
              placeholder="Ej: 2222-3333"
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Color de Identificación"
              name="color"
              value={form.color || ''}
              onChange={handleChange}
              placeholder="Color para mapas (opcional)"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex justify-center mt-8">
        <SubmitButton width="w-full" loading={loading}>
          Registrar Albergue
        </SubmitButton>
      </div>
    </FormContainer >
      <CustomToaster />
    </>
  );
}