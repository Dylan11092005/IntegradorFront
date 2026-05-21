import useBusquedaFamiliaExtendida from "../../hooks/familia/useBusquedaFamiliaExtendida.js";
import FormContainer from "../../components/FormComponents/FormContainer";
import InputField from "../../components/FormComponents/InputField";
import SubmitButton from "../../components/FormComponents/SubmitButton";
import CustomToaster from "../../components/globalComponents/CustomToaster";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable";
import SearchAutocompleteInput from "../../components/FormComponents/SearchAutocompleteInput";

const BusquedaFamilia = () => {
  const {
    
    setIdentificacion,
    busquedaCedula,
    setBusquedaCedula,
    showSugerenciasCedula,
    setShowSugerenciasCedula,
    cedulasDisponibles,
    busquedaAlbergue,
    setBusquedaAlbergue,
    showSugerenciasAlbergue,
    setShowSugerenciasAlbergue,
    familia,
    loading,
    albergues,
    familiasPorAlbergue,
    albergueSeleccionado,
    familiaSeleccionada,
    vistaActual,
    loadingAlbergues,
    loadingFamilias,
    handleSubmit,
    handleSeleccionarAlbergue,
    handleSeleccionarFamilia,
    irAAlbergues,
    volverABusqueda,
    volverAFamilias,
    handleEgresarFamilia,
    familiasRecientes,
  } = useBusquedaFamiliaExtendida();

  // Vista de búsqueda principal
  const renderVistaBusqueda = () => (
    <FormContainer title="Buscar Familia" onSubmit={handleSubmit} size="xs">
      <div className="flex flex-col gap-4">
        {/* Nuevo: Autocompletar cédula */}
        <SearchAutocompleteInput
          label="Buscar por Identificación"
          busqueda={busquedaCedula.slice(0, 20)} // <-- fuerza el valor a 20 caracteres
          setBusqueda={(value) => {
            const max20 = value.slice(0, 20);
            setBusquedaCedula(max20);
            setIdentificacion(max20);
          }}
          showSugerencias={showSugerenciasCedula}
          setShowSugerencias={setShowSugerenciasCedula}
          resultados={cedulasDisponibles}
          onSelect={(item) => {
            const max20 = (item.cedula || "").slice(0, 20);
            setBusquedaCedula(max20);
            setIdentificacion(max20);
          }}
          optionLabelKeys={["cedula"]}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <SubmitButton color="text-black" width="flex-1" loading={loading}>
            Buscar
          </SubmitButton>
          <SubmitButton type="button" onClick={irAAlbergues} width="flex-1">
            Ver por Albergue
          </SubmitButton>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Últimas 10 familias registradas</h2>
        <GlobalDataTable
          columns={[
            { name: "#", selector: (row, i) => i + 1, width: "60px" },
            { name: "Código Familia", selector: (row) => row.codigoFamilia || "" },
            { name: "Jefe de Familia", selector: (row) => row.nombreCompletoJefe || row.nombreJefe || "" },
            { name: "Fecha de Registro", selector: (row) => (row.fechaCreacion || row.createdAt || "").split("T")[0] },
            {
              name: "Acciones",
              cell: (row) => (
                <button
                  type="button"
                  className="bg-[#FFC107] text-black py-1 px-3 rounded-md hover:bg-[#FFB300] transition-colors text-sm font-medium"
                  onClick={() => handleSeleccionarFamilia(row, true)}
                >
                  Ver detalles
                </button>
              ),
              ignoreRowClick: true,
            },
          ]}
          data={familiasRecientes}
          pagination={false}
          highlightOnHover
          dense
        />
      </div>
    </FormContainer>
  );

  // Vista de lista de albergues
  const renderVistaAlbergues = () => (
    <FormContainer title="Seleccionar Albergue" size="lg">
      <div className="mb-4 flex flex-col gap-4">
        <SubmitButton type="button" onClick={volverABusqueda}>
          Volver a Búsqueda
        </SubmitButton>

        {/* Nuevo: Autocompletar albergue */}
        <SearchAutocompleteInput
          label="Buscar albergue"
          busqueda={busquedaAlbergue}
          setBusqueda={setBusquedaAlbergue}
          showSugerencias={showSugerenciasAlbergue}
          setShowSugerencias={setShowSugerenciasAlbergue}
          resultados={albergues}
          onSelect={(albergue) => handleSeleccionarAlbergue(albergue)}
          optionLabelKeys={["nombre"]}
        />
      </div>

      {loadingAlbergues ? (
        <div className="text-center py-8">Cargando albergues...</div>
      ) : (
        <GlobalDataTable
          columns={[
            { name: "#", selector: (row, i) => i + 1, width: "60px" },
            { name: "Nombre", selector: (row) => row.nombre || "" },
            { name: "Región", selector: (row) => row.region || "" },
            { name: "Condición", selector: (row) => row.condicionAlbergue || "" },
            {
              name: "Acciones",
              cell: (row) => (
                <button
                  onClick={() => handleSeleccionarAlbergue(row)}
                  className="bg-[#FFC107] text-black py-1 px-3 rounded-md hover:bg-[#FFB300] transition-colors text-sm font-medium"
                >
                  Ver Familias
                </button>
              ),
              ignoreRowClick: true,
            },
          ]}
          data={albergues}
          pagination
          rowsPerPage={10}
          highlightOnHover
          dense
        />
      )}
    </FormContainer>
  );

  // Vista de familias por albergue
  const renderVistaFamilias = () => (
    <FormContainer title={`Familias en ${albergueSeleccionado?.nombre}`} size="lg">
      <div className="mb-4 flex gap-4">
        <SubmitButton type="button" onClick={volverABusqueda}>
          Volver a Búsqueda
        </SubmitButton>
        <SubmitButton type="button" onClick={irAAlbergues}>
          Volver a Albergues
        </SubmitButton>
      </div>

      {loadingFamilias ? (
        <div className="text-center py-8">Cargando familias...</div>
      ) : familiasPorAlbergue.length > 0 ? (
        <GlobalDataTable
          columns={[
            { name: "#", selector: (row, i) => i + 1, width: "60px" },
            { name: "Código Familia", selector: (row) => row.codigoFamilia || "" },
            { name: "Jefe de Familia", selector: (row) => row.nombreJefe || "" },
            { name: "Cantidad Personas", selector: (row) => row.cantidadPersonas || "" },
            {
              name: "Acciones",
              cell: (row) => (
                <button
                  type="button"
                  className="bg-[#FFC107] text-black py-1 px-3 rounded-md hover:bg-[#FFB300] transition-colors text-sm font-medium"
                  onClick={() => handleSeleccionarFamilia(row, true)}
                >
                  Ver detalles
                </button>
              ),
              ignoreRowClick: true,
            },
          ]}
          data={familiasPorAlbergue}
          pagination
          rowsPerPage={10}
          highlightOnHover
          dense
        />
      ) : (
        <div className="text-center py-8 text-gray-500">
          No hay familias registradas en este albergue.
        </div>
      )}
    </FormContainer>
  );

  // Vista de detalles de familia (no cambia)
  const renderVistaDetalle = () => {
    const familiaData = familia || familiaSeleccionada;
    if (!familiaData || familiaData.length === 0) return null;

    return (
      <FormContainer
        title="Buscar Familia"
        onSubmit={(e) => e.preventDefault()}
        size={familiaData?.length > 0 ? "md" : "xs"}
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <SubmitButton type="button" onClick={volverABusqueda} width="flex-1">
                Nueva Búsqueda
              </SubmitButton>
              {familiaSeleccionada && (
                <SubmitButton type="button" onClick={volverAFamilias} width="flex-1">
                  Volver a Familias
                </SubmitButton>
              )}
            </div>
          </div>
        </div>

        {/* Información General */}
        <div className="mt-8 mb-4">
          <h2 className="text-xl font-bold text-[#00897B] mb-4">Detalles de la Familia</h2>
          <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
            <InputField label="Código de Familia" value={familiaData[0].codigoFamilia || ""} readOnly />
            <InputField label="Jefe de Familia" value={familiaData[0].nombreCompletoJefe || ""} readOnly />
            <InputField
              label="Ubicación"
              value={`${familiaData[0].provincia || ""}, ${familiaData[0].canton || ""}, ${familiaData[0].distrito || ""}`}
              readOnly
            />
            <InputField label="Dirección Exacta" value={familiaData[0].direccionExacta || ""} readOnly />
            <InputField label="Albergue" value={familiaData[0].nombreAlbergue || ""} readOnly />
            <InputField label="N° Personas" value={familiaData.length} readOnly />
          </div>

          <div className="mt-4">
            <SubmitButton
              type="button"
              onClick={() => {
                if (familiaData[0]?.codigoFamilia) {
                  handleEgresarFamilia(familiaData[0]);
                } else {
                  alert("Código de familia no disponible para egreso");
                }
              }}
            >
              Egresar Familia
            </SubmitButton>
          </div>

          <div className="mt-4">
            <GlobalDataTable
              columns={[
                { name: "#", selector: (row, i) => i + 1, width: "60px" },
                { name: "Nombre Completo", selector: (row) => row.nombreCompletoIntegrante || "" },
                { name: "Tipo Identificación", selector: (row) => row.tipoIdentificacion || "" },
                { name: "Número Identificación", selector: (row) => row.numeroIdentificacion || "" },
                { name: "Fecha Nacimiento", selector: (row) => row.fechaNacimiento?.split("T")[0] || "" },
                { name: "Nacionalidad", selector: (row) => row.nacionalidad || "" },
                { name: "Parentesco", selector: (row) => row.parentesco || "" },
                { name: "Sexo", selector: (row) => row.sexo || "" },
                { name: "Género", selector: (row) => row.genero || "" },
                { name: "Condición de Salud", selector: (row) => (row.tieneCondicionSalud === 1 ? "Sí" : "No") },
                { name: "Discapacidad", selector: (row) => (row.discapacidad === 1 ? "Sí" : "No") },
                { name: "Tipo Discapacidad", selector: (row) => (row.discapacidad === 1 ? row.tipoDiscapacidad || "" : "-") },
                { name: "Subtipo Discapacidad", selector: (row) => (row.discapacidad === 1 ? row.subtipoDiscapacidad || "" : "-") },
                { name: "Tipo Condición Poblacional", selector: (row) => row.tipoCondicionPoblacional || "" },
                { name: "Contacto de Emergencia", selector: (row) => row.contactoEmergencia || "" },
                { name: "Egresado", selector: (row) => (row.egresado ? "Sí" : "No") },
                {
                  name: "Fecha de Egreso",
                  selector: (row) => (row.fechaEgreso ? row.fechaEgreso.split("T")[0] : "No disponible"),
                },
              ]}
              data={familiaData}
              pagination
              rowsPerPage={10}
              highlightOnHover
              dense
            />
          </div>
        </div>
      </FormContainer>
    );
  };

  // Render según vista
  const renderVistaActual = () => {
    switch (vistaActual) {
      case "albergues":
        return renderVistaAlbergues();
      case "familias":
        return renderVistaFamilias();
      case "detalle":
        return renderVistaDetalle();
      default:
        return renderVistaBusqueda();
    }
  };

  return (
    <>
      {renderVistaActual()}
      <CustomToaster />
    </>
  );
};

export default BusquedaFamilia;
