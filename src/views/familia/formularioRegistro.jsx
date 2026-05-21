// views/FormularioRegistro.jsx
import useFormularioRegistro from "../../hooks/familia/useFormularioRegistro";
import FormContainer from "../../components/FormComponents/FormContainer";
import SelectField from "../../components/FormComponents/SelectField";
import InputField from "../../components/FormComponents/InputField";
import SubmitButton from "../../components/FormComponents/SubmitButton";
import SearchAutocompleteInput from "../../components/FormComponents/SearchAutocompleteInput";
import { useState, useMemo } from "react";

const FormularioRegistro = () => {
  const {
    albergues,
    peligros, // antes amenazas
    provincias,
    cantones,
    distritos,
    integrantes,
    setIntegrantes,
    provinciaSeleccionada,
    setProvinciaSeleccionada,
    cantonSeleccionado,
    setCantonSeleccionado,
    // NUEVO ESTADO para distrito
    idDistritoSeleccionado,
    setIdDistritoSeleccionado,
    setEventoSeleccionado,
    direccion,
    setDireccion,
    codigoFamilia,
    setNombreProvincia,
    setNombreCanton,
    // nombreDistrito,
    setNombreDistrito,
    busquedaAlbergue,
    setBusquedaAlbergue,
    showSugerenciasAlbergue,
    setShowSugerenciasAlbergue,
    crearFamilia,
    setAlbergueSeleccionado,
  } = useFormularioRegistro();

  // Estados para búsqueda de eventualidad
  const [busquedaEventualidad, setBusquedaEventualidad] = useState("");
  const [showSugerenciasEventualidad, setShowSugerenciasEventualidad] = useState(false);

  // Filtrar peligros según búsqueda
  const peligrosFiltrados = useMemo(() => {
    if (!busquedaEventualidad) return [];
    return peligros.filter((p) =>
      p.nombre?.toLowerCase().includes(busquedaEventualidad.toLowerCase())
    );
  }, [peligros, busquedaEventualidad]);

  return (
    <FormContainer title="Registro de Familia en Albergue" onSubmit={crearFamilia} size="xl">
      <div className="space-y-8">
        {/* Familia */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1">
              <SearchAutocompleteInput
                label="Albergue"
                busqueda={busquedaAlbergue}
                setBusqueda={setBusquedaAlbergue}
                showSugerencias={showSugerenciasAlbergue}
                setShowSugerencias={setShowSugerenciasAlbergue}
                resultados={albergues}
                onSelect={(albergue) => {
                  setAlbergueSeleccionado(albergue.id);
                  setBusquedaAlbergue(albergue.nombre);
                }}
                optionLabelKeys={["nombre"]}
                placeholder="Buscar albergue..."
              />
            </div>
            <div className="flex-1">
              <SearchAutocompleteInput
                label="Eventualidad"
                busqueda={busquedaEventualidad}
                setBusqueda={(value) => {
                  setBusquedaEventualidad(value);
                  setShowSugerenciasEventualidad(true);
                }}
                showSugerencias={showSugerenciasEventualidad}
                setShowSugerencias={setShowSugerenciasEventualidad}
                resultados={peligrosFiltrados}
                onSelect={(item) => {
                  setEventoSeleccionado(item.nombre);
                  setBusquedaEventualidad(item.nombre);
                  setShowSugerenciasEventualidad(false);
                }}
                optionLabelKeys={["nombre"]}
                placeholder="Buscar eventualidad..."
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1">
              <InputField
                label="Código de Familia"
                value={codigoFamilia}
                readOnly
                placeholder="YYYY-PROV-CANTON-N°FAM"
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Integrantes"
                type="number"
                value={integrantes}
                onChange={(e) => setIntegrantes(e.target.value)}
                placeholder="Cantidad"
                required
              />
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1">
              <SelectField
                label="Provincia"
                value={provinciaSeleccionada}
                onChange={(e) => {
                  const id = e.target.value;
                  setProvinciaSeleccionada(id);
                  const texto = e.target.options[e.target.selectedIndex].text;
                  setNombreProvincia(texto);
                }}
                options={provincias.map((p) => ({ nombre: p.descripcion, id: p.idProvincia }))}
                optionLabel="nombre"
                optionValue="id"
                required
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Cantón"
                value={cantonSeleccionado}
                onChange={(e) => {
                  const id = e.target.value;
                  setCantonSeleccionado(id);
                  const texto = e.target.options[e.target.selectedIndex].text;
                  setNombreCanton(texto);
                }}
                options={cantones.map((c) => ({ nombre: c.descripcion, id: c.idCanton }))}
                optionLabel="nombre"
                optionValue="id"
                required
                disabled={!cantones.length}
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Distrito"
                value={idDistritoSeleccionado}
                onChange={(e) => {
                  const id = e.target.value;
                  setIdDistritoSeleccionado(id);
                  const texto = e.target.options[e.target.selectedIndex].text;
                  setNombreDistrito(texto);
                }}
                options={[
                  ...distritos.map((d) => ({ nombre: d.descripcion, id: d.idDistrito })),
                ]}
                optionLabel="nombre"
                optionValue="id"
                required
                disabled={!distritos.length}
              />
            </div>
          </div>

          <div>
            <InputField
              label="Dirección exacta de procedencia"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej: 100m norte del parque"
              required
            />
          </div>
        </div>

        <SubmitButton color="text-black" width="w-full" >
          Registrar
        </SubmitButton>
      </div>
    </FormContainer>
  );
};

export default FormularioRegistro;
