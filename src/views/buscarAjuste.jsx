// BuscarAjustesInventario.jsx
import React from "react";
import FormContainer from "../components/FormComponents/FormContainer.jsx";
import SearchAutocompleteInput from "../components/FormComponents/SearchAutocompleteInput.jsx";
import SubmitButton from "../components/FormComponents/SubmitButton.jsx";
import CustomToaster from "../components/globalComponents/CustomToaster.jsx";
import GlobalDataTable from "../components/globalComponents/GlobalDataTable.jsx";
import ExportPdfButton from "../components/otros/ExportPdfButton.jsx";
import { useBusquedaAjuste } from "../hooks/useBusquedaAjuste.js";

const BuscarAjustesInventario = () => {
  const {
    productosFiltrados,           // <--- sugerencias filtradas
    busquedaProducto,
    setBusquedaProducto,
    showSugerencias,
    setShowSugerencias,
    handleProductoSelect,
    resultados,
    loading,
    handleSubmit,
  } = useBusquedaAjuste();

  const columns = [
    { name: "Producto", selector: (row) => row.nombreProducto },
    { name: "Cantidad Original", selector: (row) => row.cantidadOriginal },
    { name: "Cantidad Ajustada", selector: (row) => row.cantidadAjustada },
    { name: "Justificación", selector: (row) => row.justificacion },
    { name: "Fecha creacion", selector: (row) => row.fechaCreacion },
  ];

  const exportHeaders = [
    { label: "Producto", key: "nombreProducto" },
    { label: "Cantidad Original", key: "cantidadOriginal" },
    { label: "Cantidad Ajustada", key: "cantidadAjustada" },
    { label: "Justificación", key: "justificacion" },
    { label: "Fecha creacion", key: "fechaCreacion" },
  ];

  return (
    <>
      <FormContainer title="Ajustes de Inventario" onSubmit={handleSubmit} size="md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <SearchAutocompleteInput
              label="Nombre del Producto"
              busqueda={busquedaProducto}
              setBusqueda={setBusquedaProducto}
              showSugerencias={showSugerencias}
              setShowSugerencias={setShowSugerencias}
              resultados={productosFiltrados}
              onSelect={handleProductoSelect}
              optionLabelKeys={["codigoProducto", "nombre"]} // Muestra código y nombre en sugerencias
              placeholder="Seleccione un producto"
             disabled={loading}
            />
          </div>

          <div className="flex-1 flex items-end">
            <SubmitButton width="w-full" loading={loading} color="text-black">
              Buscar
            </SubmitButton>
          </div>
        </div>

        {resultados.length > 0 ? (
          <>
            <div className="mt-8">
              <GlobalDataTable
                columns={columns}
                data={resultados}
                loading={loading}
                rowsPerPage={5}
              />
            </div>

            <div className="flex justify-center mt-4">
              <ExportPdfButton
                data={resultados}
                headers={exportHeaders}
                fileName="ajustes_inventario.pdf"
                title="Reporte de Ajustes de Inventario"
                className="px-4 py-2 text-sm w-auto"
              />
            </div>
          </>
        ) : (
          !loading && (
            <p className="mt-6 text-center text-gray-500">
              Ingrese un nombre de producto y presione Buscar para ver los ajustes.
            </p>
          )
        )}
      </FormContainer>

      <CustomToaster />
    </>
  );
};

export default BuscarAjustesInventario;
