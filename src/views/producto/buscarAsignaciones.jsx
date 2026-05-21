import React from "react";
import FormContainer from "../../components/FormComponents/FormContainer.jsx";
import SearchAutocompleteInput from "../../components/FormComponents/SearchAutocompleteInput.jsx";
import SubmitButton from "../../components/FormComponents/SubmitButton.jsx";
import CustomToaster from "../../components/globalComponents/CustomToaster.jsx";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable.jsx";
import { useBuscarAsignaciones } from "../../hooks/Producto/useBuscarAsignaciones.js";

const BuscarAsignaciones = () => {
  const {
    personas,
    busquedaPersona,
    setBusquedaPersona,
    showSugerencias,
    setShowSugerencias,
    handlePersonaSelect,
    resultados,
    loading,
    handleSubmit,
  } = useBuscarAsignaciones();

  const columns = [
    { name: "Nombre Producto", selector: (row) => row.nombreProducto, sortable: true },
    { name: "Cantidad Asignada", selector: (row) => row.cantidadAsignada },
  ];

  return (
    <>
      <FormContainer title="Buscar Asignaciones" onSubmit={handleSubmit} size="md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <SearchAutocompleteInput
              label="Persona (Identificación)"
              busqueda={busquedaPersona}
              setBusqueda={setBusquedaPersona}
              showSugerencias={showSugerencias}
              setShowSugerencias={setShowSugerencias}
              resultados={personas}
              onSelect={handlePersonaSelect}
              optionLabelKeys={["numeroIdentificacion", "nombre", "apellido"]}
              placeholder="Buscar por identificación o nombre..."
              disabled={loading}
            />
          </div>

          <div className="flex-1 flex items-end">
            <SubmitButton width="w-full" loading={loading} color="text-black">
              Buscar
            </SubmitButton>
          </div>
        </div>

        {resultados.length > 0 && (
          <div className="mt-8">
            <GlobalDataTable
              columns={columns}
              data={resultados}
              loading={loading}
              rowsPerPage={5}
              pagination
            />
          </div>
        )}

        {resultados.length === 0 && !loading && (
          <p className="mt-6 text-center text-gray-500">
            Seleccione una persona y presione Buscar para ver asignaciones.
          </p>
        )}
      </FormContainer>

      <CustomToaster />
    </>
  );
};

export default BuscarAsignaciones;