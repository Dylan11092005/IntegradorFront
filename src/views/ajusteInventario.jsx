import useAjusteInventario from "../hooks/Producto/useAjusteInventario";
import FormContainer from "../components/FormComponents/FormContainer.jsx";
import InputField from "../components/FormComponents/InputField.jsx";
import SubmitButton from "../components/FormComponents/SubmitButton.jsx";
import SearchAutocompleteInput from "../components/FormComponents/SearchAutocompleteInput.jsx";
import CustomToaster from "../components/globalComponents/CustomToaster.jsx";

export default function AjusteInventario() {
  const {
    productos,
    busquedaProducto,
    setBusquedaProducto,
    showSugerencias,
    setShowSugerencias,
    motivo,
    cantidadOriginal,
    cantidadReal,
    loading,
    handleSelectProducto,
    handleAjuste,
    setMotivo,
    setCantidadReal,
  } = useAjusteInventario();

  return (
    <>
      <FormContainer title="Ajuste de Inventario" onSubmit={handleAjuste} size="md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <SearchAutocompleteInput
              label="Producto"
              busqueda={busquedaProducto}
              setBusqueda={setBusquedaProducto}
              showSugerencias={showSugerencias}
              setShowSugerencias={setShowSugerencias}
              resultados={productos}
              onSelect={handleSelectProducto}
              optionLabelKeys={["codigoProducto", "nombre"]}
              placeholder="Código o nombre del producto..."
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Motivo"
              name="motivo"
              value={motivo}
              onChange={e => setMotivo(e.target.value)}
              placeholder="Motivo del ajuste"
              required
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-1">
            <InputField
              label="Cantidad registrada"
              name="cantidadOriginal"
              type="number"
              value={cantidadOriginal}
              readOnly
              placeholder="Cantidad registrada"
              required
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Cantidad real"
              name="cantidadReal"
              type="number"
              value={cantidadReal}
              onChange={e => setCantidadReal(e.target.value)}
              placeholder="Cantidad real"
              required
            />
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <SubmitButton color="text-black" width="w-full" loading={loading}>
            Registrar Ajuste
          </SubmitButton>
        </div>
      </FormContainer>
      <CustomToaster />
    </>
  );
}
