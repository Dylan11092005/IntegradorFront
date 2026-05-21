import React from "react";
import useRegistroMascotas from "../hooks/useRegistroMascotas";
import FormContainer from "../components/FormComponents/FormContainer";
import SearchAutocompleteInput from "../components/FormComponents/SearchAutocompleteInput";
import InputField from "../components/FormComponents/InputField";
import SelectField from "../components/FormComponents/SelectField";
import SubmitButton from "../components/FormComponents/SubmitButton";
import CustomToaster from "../components/globalComponents/CustomToaster";

export default function RegistroMascotas() {
  const {
    familias,
    busquedaFamilia,
    setBusquedaFamilia,
    showSugerencias,
    setShowSugerencias,
    handleFamiliaSelect,
    tipo,
    setTipo,
    tamano,
    setTamano,
    nombreMascota,
    setNombreMascota,
    loading,
    handleRegistro,
    tiposMascota,
    tamanosMascota,
  } = useRegistroMascotas();

  return (
    <div>
      <CustomToaster />
      <FormContainer title="Registro de Mascotas" size="md" onSubmit={handleRegistro}>
        <div className="space-y-6">
          <div className="w-full">
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
              disabled={loading || familias.length === 0}
            />
          </div>

          <div className="w-full">
            <InputField
              label="Nombre de la Mascota"
              name="nombreMascota"
              value={nombreMascota}
              onChange={(e) => {
                const valor = e.target.value;
                if (valor.length <= 50) {
                  setNombreMascota(valor);
                }
              }}
              maxLength={50}
              placeholder="Ingrese el nombre de la mascota"
              disabled={loading}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              label="Tipo"
              name="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              options={tiposMascota}
              disabled={loading}
              required
            />

            <SelectField
              label="Tamaño"
              name="tamano"
              value={tamano}
              onChange={(e) => setTamano(e.target.value)}
              options={tamanosMascota}
              disabled={loading}
              required
            />
          </div>

          <div className="flex justify-center pt-4">
            <SubmitButton color="text-black" loading={loading}>
              Registrar Mascota
            </SubmitButton>
          </div>
        </div>
      </FormContainer>
    </div>
  );
}