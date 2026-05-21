import { createContext, useState, useEffect } from 'react';
import { showCustomToast } from '../components/globalComponents/CustomToaster.jsx';
// eslint-disable-next-line react-refresh/only-export-components
export const contextoAbastecimiento = createContext();

export const AbastecimientoProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [datosFormulario, setDatosFormulario] = useState(() => {
    const datosGuardados = localStorage.getItem('datosFormulario');
    return datosGuardados ? JSON.parse(datosGuardados) : {};
  });

  useEffect(() => {
    const itemsGuardados = localStorage.getItem('items');
    if (itemsGuardados) {
      setItems(JSON.parse(itemsGuardados));
    }
  }, []);

  const guardarItemsEnLocalStorage = (nuevosItems) => {
    setItems(nuevosItems);
    localStorage.setItem('items', JSON.stringify(nuevosItems));
  };

  const agregarItem = (nuevoItem) => {
    const yaExiste = items.some(item =>
      item.tipo === nuevoItem.tipo &&
      item.unidad === nuevoItem.unidad &&
      item.seccion === nuevoItem.seccion
    );

    if (yaExiste) {
      showCustomToast("Advertencia", "Producto ya agregado.");
      return;
    }

    const nuevosItems = [...items, nuevoItem];
    guardarItemsEnLocalStorage(nuevosItems);
    showCustomToast("Exito", "Producto agregado correctamente.");
  };

  const eliminarItem = (index) => {
    const nuevosItems = items.filter((_, i) => i !== index);
    guardarItemsEnLocalStorage(nuevosItems);
    showCustomToast("Exito", "Producto eliminado correctamente.");
  };

  const editarItem = (index, nuevoItem) => {
    const nuevosItems = [...items];
    nuevosItems[index] = nuevoItem;
    guardarItemsEnLocalStorage(nuevosItems);
    showCustomToast("Exito", "Producto editado correctamente.");
  };

  const limpiarItems = () => {
    setItems([]);
    localStorage.removeItem('items');
  };

  const guardarDatosFormulario = (datos) => {
    setDatosFormulario(datos);
    localStorage.setItem('datosFormulario', JSON.stringify(datos));
  };

  return (
    <contextoAbastecimiento.Provider value={{
      items,
      agregarItem,
      eliminarItem,
      editarItem,
      limpiarItems,
      guardarDatosFormulario,
      datosFormulario,
    }}>
      {children}
    </contextoAbastecimiento.Provider>
  );
};
