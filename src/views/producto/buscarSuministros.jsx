import React from "react";
import FormContainer from "../../components/FormComponents/FormContainer.jsx";
import SearchAutocompleteInput from "../../components/FormComponents/SearchAutocompleteInput.jsx";
import SubmitButton from "../../components/FormComponents/SubmitButton.jsx";
import CustomToaster from "../../components/globalComponents/CustomToaster.jsx";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable.jsx";
import { useBusquedaSuministro } from "../../hooks/Producto/useBusquedaSuministro.js";

const BuscarSuministros = () => {
  const {
    familias,
    busquedaFamilia,
    setBusquedaFamilia,
    showSugerencias,
    setShowSugerencias,
    handleFamiliaSelect,
    resultados,
    loading,
    handleSubmit,
  } = useBusquedaSuministro();

  const columns = [
    { name: "Código Producto", selector: (row) => row.codigoProducto, sortable: true },
    { name: "Nombre Producto", selector: (row) => row.nombreProducto },
    { name: "Descripción", selector: (row) => row.descripcion },
    { name: "Cantidad Asignada", selector: (row) => row.cantidadAsignada },
    { name: "Persona Asignada", selector: (row) => row.personaAsignada },
    { name: "Código Familia", selector: (row) => row.codigoFamilia },
  ];

  return (
    <>
      <FormContainer title="Búsqueda de Suministro" onSubmit={handleSubmit} size="md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <SearchAutocompleteInput
              label="Familia"
              busqueda={busquedaFamilia}
              setBusqueda={setBusquedaFamilia}
              showSugerencias={showSugerencias}
              setShowSugerencias={setShowSugerencias}
              resultados={familias}
              onSelect={handleFamiliaSelect}
              optionLabelKeys={["codigoFamilia"]}
              placeholder="Seleccione una familia"
              disabled={loading || !(familias?.length > 0)}
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
            Ingrese un código y presione Buscar para ver resultados.
          </p>
        )}
      </FormContainer>

      <CustomToaster />
    </>
  );
};

export default BuscarSuministros;
