import React from "react";
import { useListaUsuarios } from "../../hooks/Usuario/useListaUsuarios.js";
import FormContainer from "../../components/FormComponents/FormContainer.jsx";
import InputField from "../../components/FormComponents/InputField.jsx";
import SubmitButton from "../../components/FormComponents/SubmitButton.jsx";
import CustomToaster from "../../components/globalComponents/CustomToaster.jsx";
import GlobalDataTable from "../../components/globalComponents/GlobalDataTable.jsx";

const ListaUsuarios = () => {
  const {
    usuarios,
    loading,
    busqueda,
    setBusqueda,
    buscarUsuario,
    eliminarUsuario,
  } = useListaUsuarios();

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombreUsuario,
      style: { minWidth: "190px", whiteSpace: "normal", textAlign: "left" },
      headerStyle: { textAlign: "right" }
    },
    {
      name: "Correo",
      selector: (row) => row.correo,
      style: { minWidth: "290px", maxWidth: "350px", whiteSpace: "normal", textAlign: "right" },
      headerStyle: { textAlign: "right" }
    },
    {
      name: "Rol",
      selector: (row) => row.rol,
      style: { minWidth: "240px", textAlign: "left", paddingRight: "10px" },
      headerStyle: { textAlign: "right" }
    },
    {
      name: "Estado",
      selector: (row) => (row.activo ? "Activo" : "Inactivo"),
      style: { minWidth: "240px", textAlign: "left", paddingRight: "10px" },
      headerStyle: { textAlign: "right" }
    },
    {
      name: "Identificación",
      selector: (row) => row.identificacion,
      style: { minWidth: "290px", textAlign: "right" },
      headerStyle: { textAlign: "right" }
    },
    {
      name: "Municipalidad",
      selector: (row) =>
        row.nombreMunicipalidad ||
        (row.municipalidad.nombre) ||
        row.municipalidad,
      style: { minWidth: "0px", whiteSpace: "left", textAlign: "left" },
      headerStyle: { textAlign: "center" }
    },
    {
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      style: { textAlign: "left" },
      headerStyle: { textAlign: "center" }
    },
  ];

  return (
    <>
      <FormContainer title="Lista de Usuarios" onSubmit={buscarUsuario} size="md">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <InputField
              label="Buscar por nombre"
              name="busqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Ej: Juan Pérez"
              maxLength={50}
            />
          </div>
          <div className="flex-1 flex items-end">
            <SubmitButton width="w-full" loading={loading} color="text-black">
              Buscar
            </SubmitButton>
          </div>
        </div>

        <div className="mt-8">
          <GlobalDataTable
            columns={columns}
            data={usuarios}
            loading={loading}
            rowsPerPage={5}
            pagination
            noDataComponent={
              <div className="p-4 text-center text-gray-500">
                {loading ? "Cargando usuarios..." : "No se encontraron usuarios"}
              </div>
            }
          />
        </div>

        {usuarios.length === 1 && (
          <div className="mt-4 flex justify-end">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => {
                eliminarUsuario(usuarios[0].id);
                setBusqueda("");
              }}
            >
              Cambiar estado a Inactivo
            </button>
          </div>
        )}
      </FormContainer>
      <CustomToaster />
    </>
  );
};

export default ListaUsuarios;
