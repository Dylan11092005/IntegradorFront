// BuscarReferencias.jsx
import React from "react";
import FormContainer from "../components/FormComponents/FormContainer.jsx";
import SearchAutocompleteInput from "../components/FormComponents/SearchAutocompleteInput.jsx";
import SubmitButton from "../components/FormComponents/SubmitButton.jsx";
import CustomToaster from "../components/globalComponents/CustomToaster.jsx";
import GlobalDataTable from "../components/globalComponents/GlobalDataTable.jsx";
import { useBusquedaReferencia } from "../hooks/useBusquedaReferencia.js";

const BuscarReferencias = () => {
  const {
    familias,
    codigoFamilia,
    setCodigoFamilia,
    showSugerencias,
    setShowSugerencias,
    handleFamiliaSelect,
    resultados,
    loading,
    handleSubmit,
  } = useBusquedaReferencia();

  const columns = [
  { name: "Tipo de Ayuda", selector: (row) => row.tipoAyuda },
  { name: "Descripción", selector: (row) => row.descripcion },
  { 
    name: "Fecha de Entrega", 
    selector: (row) => {
      if (!row.fechaEntrega) return "";
      const fecha = new Date(row.fechaEntrega);
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const anio = fecha.getFullYear();
      return `${dia}-${mes}-${anio}`;
    }
  },
  { name: "Responsable", selector: (row) => row.responsable },
];
  return (
    <>
      <FormContainer title="Búsqueda de Referencia" onSubmit={handleSubmit} size="md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <SearchAutocompleteInput
              label="Código Familia"
              busqueda={codigoFamilia}
              setBusqueda={setCodigoFamilia}
              showSugerencias={showSugerencias}
              setShowSugerencias={setShowSugerencias}
              resultados={familias}
              onSelect={handleFamiliaSelect}
              optionLabelKeys={["codigoFamilia"]}
              placeholder="Seleccione un código de familia"
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

export default BuscarReferencias;
