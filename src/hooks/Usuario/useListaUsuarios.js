import { useState, useEffect } from "react";
import { usuariosAPI } from "../../helpers/api";
import { showCustomToast } from "../../components/globalComponents/CustomToaster";

export const useListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await usuariosAPI.getAll();
      setUsuarios(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      showCustomToast("Error", "Error al cargar la lista de usuarios.", "error");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const buscarUsuario = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) {
      fetchUsuarios();
      return;
    }
    setLoading(true);
    try {
      const data = await usuariosAPI.getAll();
      const lista = Array.isArray(data) ? data : data.data ?? [];
      const filtrados = lista.filter((u) =>
        u.nombreUsuario?.toLowerCase().includes(busqueda.trim().toLowerCase())
      );
      setUsuarios(filtrados);
      if (filtrados.length === 0) {
        showCustomToast("Error", "Usuario no encontrado.", "error");
      }
    } catch {
      showCustomToast("Error", "Usuario no encontrado.", "error");
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (id) => {
    try {
      await usuariosAPI.delete(id);
      showCustomToast("Éxito", "Cambio de estado correctamente.", "success");
      await fetchUsuarios();
    } catch {
      showCustomToast("Error", "Error al cambiar de estado.", "error");
    }
  };

  const abrirModalEdicion = (usuario) => {
    setUsuarioEditando(usuario);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setUsuarioEditando(null);
    setModalAbierto(false);
  };

  const guardarCambios = async (usuarioActualizado) => {
    try {
      await usuariosAPI.update(usuarioActualizado.id, usuarioActualizado);
      showCustomToast("Éxito", "Usuario actualizado correctamente.", "success");
      fetchUsuarios();
      cerrarModal();
    } catch {
      showCustomToast("Error", "Error al actualizar usuario.", "error");
    }
  };

  return {
    usuarios,
    loading,
    busqueda,
    setBusqueda,
    buscarUsuario,
    eliminarUsuario,
    abrirModalEdicion,
    modalAbierto,
    cerrarModal,
    usuarioEditando,
    guardarCambios,
  };
};
