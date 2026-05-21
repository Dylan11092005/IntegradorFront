import customAxios from "../helpers/customAxios";

const obtenerTodos = async (urlBase) => {
  let pagina = 1;
  let resultados = [];
  let totalPaginas = 1;

  do {
    const res = await customAxios.get(`${urlBase}?page=${pagina}`);
    const data = Array.isArray(res.data.data) ? res.data.data : [];
    resultados = resultados.concat(data);
    totalPaginas = res.data.meta ? res.data.meta.totalPages : 1;
    pagina++;
  } while (pagina <= totalPaginas);

  return resultados;
};

export default obtenerTodos;
