import React, { useState, useEffect } from "react";
import FormContainer from "../components/FormComponents/FormContainer.jsx";
import InputField from "../components/FormComponents/InputField.jsx";
import SelectField from "../components/FormComponents/SelectField.jsx";
import SubmitButton from "../components/FormComponents/SubmitButton.jsx";
import GlobalDataTable from "../components/globalComponents/GlobalDataTable.jsx";
import ExportExcelButton from "../components/otros/ExportExcelButton.jsx";
import ExportPdfButton from "../components/otros/ExportPdfButton.jsx";
import SearchAutocompleteInput from "../components/FormComponents/SearchAutocompleteInput.jsx";
import { useReportesAlbergue } from "../hooks/useReportes.js";

const ReportesAlbergue = () => {
  const {
    opcionesReporte,
    reporteSeleccionado,
    parametros,
    setParametros,
    resultados,
    loading,
    handleReporteChange,
    handleChange,
    handleSubmit,
    buildColumns,
    getExportData,
    alberguesUsuario,
    handleAlbergueSelectFor,
    getAlbergueValueFor,
    handleAlbergueFocusFor,
    fetchAlbergues,
  } = useReportesAlbergue();

  const columns = reporteSeleccionado?.value === "suministros_albergue"
    ? buildColumns().filter(
        c =>
          c.key !== "codigoAlbergue" &&
          c.key !== "nombreAlbergue" &&
          c.key !== "estado" &&
          c.key !== "fechaCreacion" &&
          c.key !== "categoria" &&
          c.key !== "unidadProducto" &&
          c.key !== "unidadMedida"
      )
    : buildColumns().filter(
        c =>
          c.key !== "estado" &&
          c.key !== "fechaCreacion" &&
          c.key !== "categoria" &&
          c.key !== "unidadProducto" &&
          c.key !== "unidadMedida"
      );
  const exportHeaders = columns.map(c => ({ label: c.name, key: c.key }));

  const [autocompleteState, setAutocompleteState] = useState({});

  useEffect(() => {
    fetchAlbergues();
  }, []);

  useEffect(() => {
    if (!reporteSeleccionado?.value) return;
    const rv = reporteSeleccionado.value;
    setAutocompleteState(prev => {
      if (prev[rv]) return prev;
      return { ...prev, [rv]: { busqueda: "", showSugerencias: false } };
    });
  }, [reporteSeleccionado]);

  useEffect(() => {
    setParametros({});
    setAutocompleteState({});
  }, [reporteSeleccionado]);

  const setBusquedaFor = (reportValue, value) => {
    const trimmedValue = value.slice(0, 50);
    setAutocompleteState(prev => ({ ...prev, [reportValue]: { ...(prev[reportValue] || {}), busqueda: trimmedValue } }));
  };
  const setShowFor = (reportValue, value) => {
    setAutocompleteState(prev => ({ ...prev, [reportValue]: { ...(prev[reportValue] || {}), showSugerencias: value } }));
  };

  const autocompleteProps = (reportValue) => {
    const state = autocompleteState[reportValue] || { busqueda: "", showSugerencias: false };
    return {
      busqueda: state.busqueda,
      setBusqueda: (val) => setBusquedaFor(reportValue, val),
      showSugerencias: state.showSugerencias,
      setShowSugerencias: (val) => setShowFor(reportValue, val),
      resultados: alberguesUsuario || [],
      onSelect: (albergue) => {
        const handler = handleAlbergueSelectFor(reportValue);
        if (typeof handler === "function") handler(albergue);
        if (albergue) {
          const label = albergue?.label ?? (albergue?.nombre ? `${albergue.nombre}` : String(albergue?.id ?? albergue?.idAlbergue ?? ""));
          setBusquedaFor(reportValue, label.slice(0, 50));
        } else {
          setBusquedaFor(reportValue, "");
        }
        setShowFor(reportValue, false);
      },
      optionLabelKeys: ["idAlbergue", "nombre"],
      onFocus: () => {
        handleAlbergueFocusFor();
        setShowFor(reportValue, true);
      },
      value: getAlbergueValueFor(reportValue),
      placeholder: "Buscar albergue...",
      disabled: loading,
      sx: { width: "100%" },
    };
  };

  function getExportDataLocal() {
    return getExportData();
  }

  const exportHeadersWithAlbergue = [
    ...(
      reporteSeleccionado?.value === "personas_por_albergue"
        ? exportHeaders.filter(h => h.key !== "codigoAlbergue" && h.key !== "nombreAlbergue")
        : exportHeaders
    ),
  ];

  return (
    <FormContainer title="Generación de Reportes" onSubmit={handleSubmit} size="md">
      <div className="flex flex-col gap-4">
        <SelectField
          label="Seleccione un tipo de reporte"
          name="reporte"
          value={reporteSeleccionado?.value || ""}
          onChange={handleReporteChange}
          options={opcionesReporte.map((o) => ({ nombre: o.label, value: o.value }))}
          optionLabel="nombre"
          optionValue="value"
        />

        {reporteSeleccionado?.value === "personas_por_albergue" && (
          <SearchAutocompleteInput
            {...autocompleteProps("personas_por_albergue")}
            label="Seleccionar Albergue"
          />
        )}

        {reporteSeleccionado?.value === "personas_por_sexo" && (
          <>
            <InputField
              label="Sexo"
              name="sexo"
              value={parametros.sexo?.slice(0, 50) || ""}
              onChange={(e) => handleChange({ target: { name: "sexo", value: e.target.value.slice(0, 50) } })}
              placeholder="Ingrese sexo"
            />
            <SearchAutocompleteInput
              {...autocompleteProps("personas_por_sexo")}
              label="Seleccionar Albergue"
            />
          </>
        )}

        {reporteSeleccionado?.value === "personas_por_edad" && (
          <>
            <InputField
              label="Edad mínima"
              name="edadMin"
              value={parametros.edadMin?.slice(0, 50) || ""}
              onChange={(e) => handleChange({ target: { name: "edadMin", value: e.target.value.slice(0, 50) } })}
              placeholder="Ingrese edad mínima"
              type="number"
              min={0}
            />
            <InputField
              label="Edad máxima"
              name="edadMax"
              value={parametros.edadMax?.slice(0, 50) || ""}
              onChange={(e) => handleChange({ target: { name: "edadMax", value: e.target.value.slice(0, 50) } })}
              placeholder="Ingrese edad máxima"
              type="number"
              min={0}
            />
            <SearchAutocompleteInput
              {...autocompleteProps("personas_por_edad")}
              label="Seleccionar Albergue"
            />
          </>
        )}

        {reporteSeleccionado?.value === "personas_discapacidad" && (
          <SearchAutocompleteInput
            {...autocompleteProps("personas_discapacidad")}
            label="Seleccionar Albergue"
          />
        )}

        {reporteSeleccionado?.value === "suministros_albergue" && (
          <SearchAutocompleteInput
            {...autocompleteProps("suministros_albergue")}
            label="Seleccionar Albergue"
            onSelect={(albergue) => {
              const handler = handleAlbergueSelectFor("suministros_albergue");
              if (typeof handler === "function") handler(albergue);
              if (albergue) {
                setParametros(prev => ({ ...prev, idAlbergue: albergue.idAlbergue ?? albergue.id ?? prev.idAlbergue, id: albergue.id ?? prev.id }));
                setBusquedaFor("suministros_albergue", (albergue?.label ?? albergue?.nombre ?? "").slice(0, 50));
              } else {
                setParametros(prev => ({ ...prev, idAlbergue: null }));
                setBusquedaFor("suministros_albergue", "");
              }
              setShowFor("suministros_albergue", false);
            }}
          />
        )}

        {reporteSeleccionado?.value === "condiciones_especiales" && (
          <SearchAutocompleteInput
            {...autocompleteProps("condiciones_especiales")}
            label="Seleccionar Albergue"
          />
        )}

        {(!["personas_por_albergue", "personas_por_sexo", "personas_por_edad", "personas_discapacidad", "suministros_albergue"].includes(reporteSeleccionado?.value) &&
          reporteSeleccionado?.campos || []
        ).map((campo) => (
          <InputField
            key={campo.name}
            label={campo.label}
            name={campo.name}
            value={parametros[campo.name]?.slice(0, 50) || ""}
            onChange={(e) => handleChange({ target: { name: campo.name, value: e.target.value.slice(0, 50) } })}
            placeholder={`Ingrese ${campo.label.toLowerCase()}`}
          />
        ))}

        <SubmitButton width="w-full" loading={loading}>
          Generar Reporte
        </SubmitButton>

        {resultados.length > 0 && (
          <>
            {["personas_por_albergue", "personas_por_sexo", "personas_por_edad", "personas_discapacidad"].includes(reporteSeleccionado?.value) && resultados[0] && (
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <InputField
                    label="Código Albergue"
                    value={(() => {
                      const id = parametros.id ?? resultados[0]?.idAlbergue ?? resultados[0]?.codigoAlbergue;
                      const a = alberguesUsuario?.find(x =>
                        String(x.id) === String(id) || String(x.idAlbergue) === String(id)
                      );
                      return (a?.idAlbergue || resultados[0]?.idAlbergue || resultados[0]?.codigoAlbergue || "").slice(0, 50);
                    })()}
                    readOnly
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    label="Nombre Albergue"
                    value={(() => {
                      const id = parametros.id ?? resultados[0]?.idAlbergue ?? resultados[0]?.codigoAlbergue;
                      const a = alberguesUsuario?.find(x =>
                        String(x.id) === String(id) || String(x.idAlbergue) === String(id)
                      );
                      return (a?.nombre || resultados[0]?.nombreAlbergue || "").slice(0, 50);
                    })()}
                    readOnly
                  />
                </div>
              </div>
            )}

            {reporteSeleccionado?.value === "suministros_albergue" && resultados[0] && (
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <InputField
                    label="Código Albergue"
                    value={(() => {
                      const id = parametros.id ?? resultados[0]?.idAlbergue ?? resultados[0]?.codigoAlbergue;
                      const a = alberguesUsuario?.find(x =>
                        String(x.id) === String(id) || String(x.idAlbergue) === String(id)
                      );
                      return (a?.idAlbergue || resultados[0]?.idAlbergue || resultados[0]?.codigoAlbergue || "").slice(0, 50);
                    })()}
                    readOnly
                  />
                </div>
                <div className="flex-1">
                  <InputField
                    label="Nombre Albergue"
                    value={(() => {
                      const id = parametros.id ?? resultados[0]?.idAlbergue ?? resultados[0]?.codigoAlbergue;
                      const a = alberguesUsuario?.find(x =>
                        String(x.id) === String(id) || String(x.idAlbergue) === String(id)
                      );
                      return (a?.nombre || resultados[0]?.nombreAlbergue || "").slice(0, 50);
                    })()}
                    readOnly
                  />
                </div>
              </div>
            )}

            <div className="mt-6">
              <GlobalDataTable columns={columns} data={resultados} rowsPerPage={10} />
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <ExportExcelButton
                data={getExportDataLocal()}
                headers={exportHeadersWithAlbergue}
                fileName={`${(reporteSeleccionado?.value || "reporte").slice(0, 50)}.xlsx`}
                className="px-4 py-2 text-sm w-auto"
              />
              <ExportPdfButton
                data={getExportDataLocal()}
                headers={exportHeadersWithAlbergue}
                fileName={`${(reporteSeleccionado?.value || "reporte").slice(0, 50)}.pdf`}
                title={
                  reporteSeleccionado?.value === "suministros_albergue"
                    ? `Resumen de suministros — ${(() => {
                        const id = parametros.id ?? resultados[0]?.idAlbergue ?? resultados[0]?.codigoAlbergue;
                        const a = alberguesUsuario?.find(x =>
                          String(x.id) === String(id) || String(x.idAlbergue) === String(id)
                        );
                        return (a?.nombre || resultados[0]?.nombreAlbergue || "").slice(0, 50);
                      })()}`
                    : (reporteSeleccionado?.label || "Reporte").slice(0, 50)
                }
                className="px-4 py-2 text-sm w-auto"
              />
            </div>
          </>
        )}
      </div>
    </FormContainer>
  );
};

export default ReportesAlbergue;