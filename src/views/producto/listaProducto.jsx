import React from 'react';
import FormContainer from '../../components/FormComponents/FormContainer.jsx';
import InputField from '../../components/FormComponents/InputField.jsx';
import SelectField from '../../components/FormComponents/SelectField.jsx';
import SubmitButton from '../../components/FormComponents/SubmitButton.jsx';
import CustomToaster from '../../components/globalComponents/CustomToaster.jsx';
import SearchAutocompleteInput from '../../components/FormComponents/SearchAutocompleteInput.jsx';
import GlobalDataTable from '../../components/globalComponents/GlobalDataTable.jsx';
import { useListaSuministro } from '../../hooks/Producto/useListaProducto.js';

const categorias = [
  { nombre: "Carne", value: "1" },
  { nombre: "Proteína", value: "2" },
  { nombre: "Verdura", value: "3" },
  { nombre: "Reperte", value: "4" },
  { nombre: "Olores", value: "5" },
  { nombre: "Abarrotes", value: "6" },
  { nombre: "Limpieza", value: "7" },
  { nombre: "Mobiliario", value: "8" },
];

const unidades = [
  { nombre: "Mililitros", value: "1" },
  { nombre: "Gramos", value: "2" },
  { nombre: "Unidades", value: "3" },
];

const ListaProducto = () => {

  const {
    productos,
    busquedaProducto,
    setBusquedaProducto,
    showSugerencias,
    setShowSugerencias,
    form,
    handleChange,
    handleSelectProducto,
    actualizarProducto,
    eliminarProducto,
    loading,
    columns,
  } = useListaSuministro();

  return (
    <FormContainer title="Actualizar Suministros" size="md" onSubmit={actualizarProducto}>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <SearchAutocompleteInput
            label="Buscar Suministro"
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
      </div>

      {/* Tabla: si hay búsqueda, muestra solo el producto buscado; si no, muestra los últimos 20 */}
      <div className="mt-8">
        <GlobalDataTable
          columns={columns}
          data={
            form.id
              ? [form] // Si hay producto seleccionado, muestra solo ese
              : productos // Si no, muestra los últimos 20
          }
          pagination={false}
          loading={loading}
        />
      </div>

      {form.id && (
        <>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-1">
              <InputField label="Código del Producto" name="codigoProducto" value={form.codigoProducto || ''} readOnly />
            </div>
            <div className="flex-1">
              <InputField label="Nombre" name="nombre" value={form.nombre || ''} readOnly />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-1">
              <InputField label="Descripción" name="descripcion" value={form.descripcion || ''} onChange={handleChange} required />
            </div>
            <div className="flex-1">
              <InputField label="Cantidad" name="cantidad" type="number" min="0" value={form.cantidad ?? ''} readOnly disabled />
            </div>
            <div className="flex-1">
              <SelectField label="Categoría" name="categoria" value={form.categoria || ''} options={categorias} optionLabel="nombre" optionValue="value" onChange={handleChange} />
            </div>
            <div className="flex-1">
              <SelectField label="Unidad de Medida" name="unidadMedida" value={form.unidadMedida || ''} options={unidades} optionLabel="nombre" optionValue="value" onChange={handleChange} />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 mt-8">
            <div className="flex-1 flex gap-4">
              <SubmitButton type="submit" width="w-full" loading={loading} color="text-black">Actualizar</SubmitButton>
              <SubmitButton type="button" width="w-full" color="text-black bg-red-600 hover:bg-red-700" onClick={eliminarProducto} disabled={loading}>Eliminar</SubmitButton>
            </div>
          </div>
        </>
      )}

      <CustomToaster />
    </FormContainer>
  )
};

export default ListaProducto;
