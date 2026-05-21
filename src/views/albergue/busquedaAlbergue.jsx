import React, { useEffect } from "react";
import { useUbicaciones } from "../../hooks/useUbicaciones";
import { useBusquedaAlbergue } from "../../hooks/Albergue/useBusquedaAlbergue.js";
import FormContainer from "../../components/FormComponents/FormContainer.jsx";
import InputField from "../../components/FormComponents/InputField.jsx";
import SelectField from "../../components/FormComponents/SelectField.jsx";
import SubmitButton from "../../components/FormComponents/SubmitButton.jsx";
import CustomToaster, { showCustomToast } from "../../components/globalComponents/CustomToaster.jsx";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable.jsx";

const BusquedaAlbergue = () => {
  const { provincias, cantones, distritos, setProvinciaId, setCantonId } = useUbicaciones();

  const {
    idAlbergue,
    setIdAlbergue,
    nombre,
    setNombre,
    resultados,
    error,
    provinciaSeleccionada,
    cantonSeleccionado,
    distritoSeleccionado,
    loading,
    handleSubmit,
    handleProvinciaChange,
    handleCantonChange,
    handleDistritoChange,
  } = useBusquedaAlbergue({ provincias, cantones, distritos, setProvinciaId, setCantonId });

  useEffect(() => {
    if (error) {
      showCustomToast(error, null, "error"); 
    }
  }, [error]);

  // Define columnas para la tabla
  const columns = [
    { name: "ID", selector: row => row.IdAlbergue},
    { name: "Nombre", selector: row => row.Nombre },
    { name: "Región", selector: row => row.Region },
    { name: "Provincia", selector: row => row.provincia },
    { name: "Cantón", selector: row => row.canton },
    { name: "Distrito", selector: row => row.distrito },
    { name: "Dirección", selector: row => row.direccion },
    { name: "Tipo Establecimiento", selector: row => row.tipoEstablecimiento },
    { name: "Tipo Albergue", selector: row => row.tipoAlbergue },
    { name: "Condición", selector: row => row.condicionAlbergue },
    { name: "Administrador", selector: row => row.administrador },
    { name: "Teléfono", selector: row => row.telefono },
    { name: "Capacidad Personas", selector: row => row.capacidadPersonas },
    { name: "Capacidad Colectiva", selector: row => row.capacidadColectiva },
    { name: "Cantidad Familias", selector: row => row.cantidadFamilias },
    { name: "Ocupación", selector: row => row.ocupacion },
    { name: "Cocina", selector: row => (row.cocina ? "Sí" : "No") },
    { name: "Duchas", selector: row => (row.duchas ? "Sí" : "No") },
    { name: "Servicios Sanitarios", selector: row => (row.serviciosSanitarios ? "Sí" : "No") },
    { name: "Bodega", selector: row => (row.bodega ? "Sí" : "No") },
    { name: "Menaje Mobiliario", selector: row => (row.menajeMobiliario ? "Sí" : "No") },
    { name: "Tanque Agua", selector: row => (row.tanqueAgua ? "Sí" : "No") },
    { name: "Área Total (m²)", selector: row => row.areaTotalM2 },
    { name: "Municipalidad", selector: row => row.municipalidad },
    {
      name: "Color",
      selector: row => row.color,
      cell: row => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border"
            style={{ backgroundColor: row.color }}
          ></div>
          <span>{row.color}</span>
        </div>
      ),
    },
  ];

  return (
    <>
      <FormContainer title="Búsqueda de Albergue" onSubmit={handleSubmit} size="md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <InputField
              label="Código Albergue"
              name="idAlbergue"
              value={idAlbergue}
              onChange={(e) => setIdAlbergue(e.target.value)}
              placeholder="Código Albergue"
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Provincia"
              name="provincia"
              value={provincias.find(p => p.descripcion === provinciaSeleccionada)?.idProvincia || ""}
              onChange={handleProvinciaChange}
              options={provincias.map(p => ({ nombre: p.descripcion, value: p.idProvincia }))}
              optionLabel="nombre"
              optionValue="value"
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Cantón"
              name="canton"
              value={cantones.find(c => c.descripcion === cantonSeleccionado)?.idCanton || ""}
              onChange={handleCantonChange}
              options={cantones.map(c => ({ nombre: c.descripcion, value: c.idCanton }))}
              optionLabel="nombre"
              optionValue="value"
            />
          </div>
          <div className="flex-1">
            <SelectField
              label="Distrito"
              name="distrito"
              value={distritos.find(d => d.descripcion === distritoSeleccionado)?.idDistrito || ""}
              onChange={handleDistritoChange}
              options={distritos.map(d => ({ nombre: d.descripcion, value: d.idDistrito }))}
              optionLabel="nombre"
              optionValue="value"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-1">
            <InputField
              label="Nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del albergue"
            />
          </div>
          <div className="flex-1 flex items-end">
            <SubmitButton width="w-full" loading={loading} color="text-black">
              Buscar
            </SubmitButton>
          </div>
        </div>

        {!error && resultados.length === 0 && (
          <p className="mt-6 text-center text-gray-500">
            Ingrese un criterio y presione Buscar para ver resultados.
          </p>
        )}

        {resultados.length > 0 && (
          <div className="mt-8">
            <GlobalDataTable
              columns={columns}
              data={resultados}
              loading={loading}
              rowsPerPage={5}
            />
          </div>
        )}

        {error && (
          <div className="mt-6">
            <span className="block text-red-600 text-center font-semibold">{error}</span>
          </div>
        )}
      </FormContainer>

      <CustomToaster />
    </>
  );
};

export default BusquedaAlbergue;
