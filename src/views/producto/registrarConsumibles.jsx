import React from "react";
import { useRegistroConsumibles } from "../../hooks/Producto/useRegistroConsumibles.js";
import FormContainer from "../../components/FormComponents/FormContainer.jsx";
import InputField from "../../components/FormComponents/InputField.jsx";
import SelectField from "../../components/FormComponents/SelectField.jsx";
import SubmitButton from "../../components/FormComponents/SubmitButton.jsx";
import CustomToaster from "../../components/globalComponents/CustomToaster.jsx";

const categorias = [
  { nombre: "Carnes" },
  { nombre: "Proteina" },
  { nombre: "Verduras" },
  { nombre: "Olores y otros" },
  { nombre: "Abarrotes" },
  { nombre: "Productos de limpieza" },
  
];

const unidades = [
  { nombre: "Gramos" },
  { nombre: "Mililitros" },
  { nombre: "Unidades" },
];

const RegistroConsumibles = () => {
  const { form, loading, handleChange, handleSubmit } = useRegistroConsumibles();

  return (
    <>
      <FormContainer title="Registro de Consumibles" onSubmit={handleSubmit} size="md">
        <fieldset className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <InputField
                label="Nombre del Producto"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Ingrese el nombre"
                required
              />
            </div>
            <div className="flex-1">
              <InputField
                label="Cantidad por Persona"
                name="cantidad"
                type="number"
                min="0"
                value={form.cantidad}
                onChange={handleChange}
                placeholder="Ingrese la cantidad"
                required
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 mt-4">
            <div className="flex-1">
              <SelectField
                label="Unidad de Medida"
                name="unidadMedida"
                value={form.unidadMedida}
                onChange={handleChange}
                options={unidades}
                optionLabel="nombre"
                optionValue="nombre"
                required
              />
            </div>
            <div className="flex-1">
              <SelectField
                label="Categoría del Producto"
                name="categoriaProducto"
                value={form.categoriaProducto}
                onChange={handleChange}
                options={categorias}
                optionLabel="nombre"
                optionValue="nombre"
                required
              />
            </div>
          </div>
        </fieldset>
        <div className="flex justify-center mt-8">
          <SubmitButton width="w-full" loading={loading} color="text-black">
            Registrar
          </SubmitButton>
        </div>
      </FormContainer>
      <CustomToaster />
    </>
  );
};

export default RegistroConsumibles;