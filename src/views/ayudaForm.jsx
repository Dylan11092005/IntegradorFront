import React from "react";
import useAyudaForm from "../hooks/useAyudaForm";
import FormContainer from "../components/FormComponents/FormContainer";
import InputField from "../components/FormComponents/InputField";
import SelectField from "../components/FormComponents/SelectField";
import SubmitButton from "../components/FormComponents/SubmitButton";
import SearchAutocompleteInput from "../components/FormComponents/SearchAutocompleteInput";
import CustomToaster from "../components/globalComponents/CustomToaster";

const tiposAyuda = [
  { id: "imas", nombre: "IMAS" },
  { id: "cruzroja", nombre: "Cruz Roja" },
  { id: "cne", nombre: "CNE" },
  { id: "refugio", nombre: "Refugio" },
  { id: "otros", nombre: "Otros" },
];

const AyudaForm = () => {
  const {
    form,
    familias,
    busquedaFamilia,
    setBusquedaFamilia,
    showSugerenciasFamilia,
    setShowSugerenciasFamilia,
    handleChange,
    handleSubmit,
    loading,
    onSelectFamilia,
  } = useAyudaForm();

  return (
    <>
      <FormContainer
        title="Registro de Ayuda Entregada"
        onSubmit={handleSubmit}
      >
        <fieldset className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <SearchAutocompleteInput
                label="Código de Familia"
                busqueda={busquedaFamilia}
                setBusqueda={setBusquedaFamilia}
                showSugerencias={showSugerenciasFamilia}
                setShowSugerencias={setShowSugerenciasFamilia}
                resultados={familias}
                onSelect={onSelectFamilia}
                optionLabelKeys={["codigoFamilia", "codigo"]}
                placeholder="Buscar familia..."
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Tipo de Ayuda"
                name="tipoAyuda"
                value={form.tipoAyuda}
                onChange={handleChange}
                options={tiposAyuda}
                optionLabel="nombre"
                optionValue="id"
                required
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-1">
              <InputField
                label="Descripción"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Descripción de la ayuda"
                required
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Funcionario"
                name="responsable"
                value={form.responsable}
                onChange={handleChange}
                placeholder="Nombre del Funcionario"
                required
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Fecha de Entrega"
                name="fechaEntrega"
                type="date"
                value={form.fechaEntrega}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </fieldset>
        <div className="flex justify-center mt-8">
          <SubmitButton color="text-black" width="w-full" loading={loading}>
            Registrar
          </SubmitButton>
        </div>
      </FormContainer>
      <CustomToaster />
    </>
  );
};

export default AyudaForm;
