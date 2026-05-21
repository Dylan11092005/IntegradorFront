export const generarCodigoFamilia = (provincia, canton, numero = 1) => {
  const año = new Date().getFullYear();
  const siglasProvincia = {
    "San José": "SJ",
    "Alajuela": "AL",
    "Cartago": "CA",
    "Heredia": "HE",
    "Guanacaste": "GU",
    "Puntarenas": "PU",
    "Limón": "LI",
  };

  const prov = siglasProvincia[provincia] || provincia.substring(0, 2).toUpperCase();
  const cant = canton.padStart(2, "0");
  const num = numero.toString().padStart(3, "0");

  return `${año}-${prov}-${cant}-${num}`;
};
