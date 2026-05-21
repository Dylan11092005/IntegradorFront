import { Modal, Box, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ResumenFinal from "./resumenFinal.jsx";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable.jsx";
import GlobalModal from "../../components/globalComponents/GlobalModal.jsx";
import FormContainer from "../../components/FormComponents/FormContainer.jsx";
import SubmitButton from "../../components/FormComponents/SubmitButton.jsx";
import SelectField from "../../components/FormComponents/SelectField.jsx";
import { useFormularioAbarrotes } from "../../hooks/abastecimineto/useFormularioAbarrotes.js";
import CustomToaster from "../../components/globalComponents/CustomToaster.jsx";
import { useEffect } from "react";

const FormularioAbastecimiento = () => {
  const {
    openResumenFinal,
    tipoCarne,
    tipoProteina,
    tipoVerdura,
    seccionAbierta,
    
    personas,
    carnesProductos,
    proteinaProductos, 
    verdurasProductos,
    categorias,
    items,
    setTipoCarne,
    setTipoProteina,
    setTipoVerdura,
    handleOpenResumenFinal,
    handleCloseResumenFinal,
    toggleSeccion,
    handleAgregarCarne,
    handleAgregarProteina,
    handleAgregarVerdura,
    handleToggleProducto,
    eliminarItem,
    resetFormulario,
  } = useFormularioAbarrotes();

  
  useEffect(() => {
    resetFormulario();
  
  }, []);

  const createColumns = (tipoColumna = "default") => [
    {
      name: tipoColumna === "carnes" ? "Tipo" : "Producto",
      selector: (row) => row.tipo,
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-900">{row.tipo}</span>
      ),
    },
    {
      name: "Unidad",
      selector: (row) => row.unidad,
      sortable: true,
      cell: (row) => <span className="text-gray-600">{row.unidad}</span>,
    },
    {
      name: (
        <span style={{ minWidth: 90, display: "inline-block" }}>Cantidad</span>
      ),
      selector: (row) => row.cantidad,
      sortable: true,
      cell: (row) => (
        <span className="font-semibold text-gray-900">{row.cantidad}</span>
      ),
    },
    {
      name: "Acción",
      cell: (row) => {
        const realIndex = items.findIndex(
          (item) =>
            item.tipo === row.tipo &&
            item.unidad === row.unidad &&
            item.cantidad === row.cantidad
        );
        return (
          <button
            onClick={() => eliminarItem(realIndex)}
            className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors duration-200 flex items-center justify-center"
            title="Eliminar item"
          >
            <DeleteIcon sx={{ fontSize: 18, color: "#dc2626" }} />
          </button>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <>
      <FormContainer
        title="Formulario de Abastecimiento"
        size="md"
        onSubmit={(e) => e.preventDefault()}
      >
        <p className="text-gray-600 mb-6 text-center">
          Seleccione los productos necesarios para {personas} personas
        </p>
        {/* Sección Carnes */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <div
            onClick={() => toggleSeccion("Carnes")}
            className="cursor-pointer font-bold py-3 px-6 select-none bg-teal-700 text-white hover:bg-teal-800 transition-colors duration-200"
          >
            <div className="flex justify-between items-center">
              <span>Carnes</span>
              <span className="text-xl">
                {seccionAbierta === "Carnes" ? "▲" : "▼"}
              </span>
            </div>
          </div>
          {seccionAbierta === "Carnes" && (
            <div className="p-6 bg-gray-50">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-700 text-sm font-medium">
                  Se calculan automáticamente 120 gramos por persona
                </p>
              </div>
              <div className="space-y-4">
                <SelectField
                  label="Tipo de carne"
                  name="tipoCarne"
                  value={tipoCarne}
                  onChange={(e) => setTipoCarne(e.target.value)}
                  options={carnesProductos}
                  optionLabel="nombre"
                  optionValue="nombre"
                />
                <SubmitButton
                  type="button"
                  onClick={handleAgregarCarne}
                  width="w-full"
                  className="text-black"
                >
                  Agregar Carne
                </SubmitButton>
              </div>

              {items.filter((i) => i.seccion === "Carnes").length > 0 && (
                <div className="mt-6">
                  <div className="w-full">
                    <h4 className="text-lg font-semibold text-gray-800 text-center mb-4">
                      Resumen Carnes
                    </h4>
                    <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
                      <GlobalDataTable
                        columns={createColumns("carnes")}
                        data={items.filter((i) => i.seccion === "Carnes")}
                        pagination={false}
                        noDataComponent={
                          <div className="px-6 py-4 text-center text-sm text-gray-500">
                            No hay carnes seleccionadas
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <CustomToaster />

        {/* Sección Proteínas */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <div
            onClick={() => toggleSeccion("Proteina")}
            className="cursor-pointer font-bold py-3 px-6 select-none bg-teal-700 text-white hover:bg-teal-800 transition-colors duration-200"
          >
            <div className="flex justify-between items-center">
              <span>Proteínas</span>
              <span className="text-xl">
                {seccionAbierta === "Proteina" ? "▲" : "▼"}
              </span>
            </div>
          </div>
          {seccionAbierta === "Proteina" && (
            <div className="p-6 bg-gray-50">
              <div className="space-y-4">
                <SelectField
                  label="Seleccione una proteína"
                  name="tipoProteina"
                  value={tipoProteina}
                  onChange={(e) => setTipoProteina(e.target.value)}
                  options={proteinaProductos} 
                  optionLabel="nombre"
                  optionValue="nombre"
                />
                <SubmitButton
                  type="button"
                  onClick={handleAgregarProteina}
                  width="w-full"
                  className="bg-yellow-500 "
                >
                  Agregar Proteína
                </SubmitButton>
              </div>

              {items.filter((i) => i.seccion === "Proteina").length > 0 && (
                <div className="mt-6">
                  <div className="w-full">
                    <h4 className="text-lg font-semibold text-gray-800 text-center mb-4">
                      Resumen Proteínas
                    </h4>
                    <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
                      <GlobalDataTable
                        columns={createColumns("proteina")}
                        data={items.filter((i) => i.seccion === "Proteina")}
                        pagination={false}
                        noDataComponent={
                          <div className="px-6 py-4 text-center text-sm text-gray-500">
                            No hay proteínas seleccionadas
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <CustomToaster />

        {/* Sección Verduras */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <div
            onClick={() => toggleSeccion("Verduras")}
            className="cursor-pointer font-bold py-3 px-6 select-none bg-teal-700 text-white hover:bg-teal-800 transition-colors duration-200"
          >
            <div className="flex justify-between items-center">
              <span>Verduras</span>
              <span className="text-xl">
                {seccionAbierta === "Verduras" ? "▲" : "▼"}
              </span>
            </div>
          </div>
          {seccionAbierta === "Verduras" && (
            <div className="p-6 bg-gray-50">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <p className="text-yellow-700 text-sm font-medium">
                  Máximo 2 tipos de verdura - 120g por persona cada una
                </p>
              </div>
              <div className="space-y-4">
                <SelectField
                  label="Seleccione una verdura"
                  name="tipoVerdura"
                  value={tipoVerdura}
                  onChange={(e) => setTipoVerdura(e.target.value)}
                  options={verdurasProductos}
                  optionLabel="nombre"
                  optionValue="nombre"
                />
                <SubmitButton
                  type="button"
                  onClick={handleAgregarVerdura}
                  width="w-full"
                  className="bg-yellow-500 "
                >
                  Agregar Verdura
                </SubmitButton>
              </div>

              {items.filter((i) => i.seccion === "Verduras").length > 0 && (
                <div className="mt-6">
                  <div className="w-full">
                    <h4 className="text-lg font-semibold text-gray-800 text-center mb-4">
                      Resumen Verduras
                    </h4>
                    <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
                      <GlobalDataTable
                        columns={createColumns("verduras")}
                        data={items.filter((i) => i.seccion === "Verduras")}
                        pagination={false}
                        noDataComponent={
                          <div className="px-6 py-4 text-center text-sm text-gray-500">
                            No hay verduras seleccionadas
                          </div>
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <CustomToaster />

        {/* Otras Categorías con checkboxes */}
        {Object.entries(categorias).map(([categoria, productos]) => {
          if (["Carnes", "Proteina", "Verduras"].includes(categoria))
            return null;

          return (
            <div
              key={categoria}
              className="bg-white rounded-lg shadow-md mb-4 overflow-hidden"
            >
              <div
                onClick={() => toggleSeccion(categoria)}
                className="cursor-pointer font-bold py-3 px-6 select-none bg-teal-700 text-white hover:bg-teal-800 transition-colors duration-200"
              >
                <div className="flex justify-between items-center">
                  <span>{categoria}</span>
                  <span className="text-xl">
                    {seccionAbierta === categoria ? "▲" : "▼"}
                  </span>
                </div>
              </div>
              {seccionAbierta === categoria && (
                <div className="p-6 bg-gray-50">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <p className="text-yellow-700 text-sm font-medium">
                      Seleccione los productos necesarios marcando las casillas
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {productos.map((producto) => {
                      const yaAgregado = items.some(
                        (i) =>
                          i.seccion === categoria && i.tipo === producto.nombre
                      );
                      if (yaAgregado) return null;
                      return (
                        <div
                          key={producto.nombre}
                          className="bg-white border border-gray-200 rounded-lg p-3 hover:border-teal-300 hover:shadow-sm transition-all duration-200"
                        >
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              onChange={() =>
                                handleToggleProducto(categoria, producto)
                              }
                              className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
                            />
                            <span className="text-sm font-medium text-gray-700 select-none">
                              {producto.nombre}
                            </span>
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  {items.filter((i) => i.seccion === categoria).length > 0 && (
                    <div className="mt-6">
                      <div className="w-full">
                        <h4 className="text-lg font-semibold text-gray-800 text-center mb-4">
                          Resumen {categoria}
                        </h4>
                        <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
                          <GlobalDataTable
                            columns={createColumns("otros")}
                            data={items.filter((i) => i.seccion === categoria)}
                            pagination={false}
                            noDataComponent={
                              <div className="px-6 py-4 text-center text-sm text-gray-500">
                                No hay productos de {categoria.toLowerCase()}{" "}
                                seleccionados
                              </div>
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <CustomToaster />
        
        {/* Botones para abrir modales resumen*/}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h3 className="text-center text-lg font-semibold text-gray-800">
              Resúmen del Pedido
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <SubmitButton
              type="button"
              onClick={handleOpenResumenFinal}
              width="flex-1"
              color="text-black"
              className="bg-yellow-500"
            >
              Ver Resumen Final
            </SubmitButton>
          </div>
        </div>
      </FormContainer>
      {}
      <GlobalModal
        open={openResumenFinal}
        onClose={handleCloseResumenFinal}
        title="Resumen Final del Pedido"
        maxWidth="md"
      >
        <ResumenFinal />
      </GlobalModal>
    </>
  );
};
export default FormularioAbastecimiento;