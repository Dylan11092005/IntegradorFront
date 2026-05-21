import { useEffect, useState } from 'react';
import axios from 'axios';

export function useUbicaciones() {
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [provinciaId, setProvinciaId] = useState('');
  const [cantonId, setCantonId] = useState('');
  
  // Estados de carga
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingCantones, setLoadingCantones] = useState(false);
  const [loadingDistritos, setLoadingDistritos] = useState(false);

  // Función para obtener todos los datos paginados con reintentos
  const fetchAllPages = async (baseUrl, maxRetries = 3) => {
    let allData = [];
    let currentPage = 1;
    let totalPages = 1;

    do {
      let retries = 0;
      let success = false;

      while (retries < maxRetries && !success) {
        try {
          const response = await axios.get(`${baseUrl}?page=${currentPage}`, {
            timeout: 10000 // 10 segundos de timeout
          });
          
          const { data, meta } = response.data;
          
          if (data && Array.isArray(data)) {
            allData = [...allData, ...data];
          }
          
          if (meta && meta.totalPages) {
            totalPages = meta.totalPages;
          }
          
          success = true;
          currentPage++;
        } catch (error) {
          retries++;
          console.warn(`Error fetching page ${currentPage}, attempt ${retries}/${maxRetries}:`, error.message);
          
          if (retries >= maxRetries) {
            console.error(`Failed to fetch page ${currentPage} after ${maxRetries} attempts`);
            break;
          }
          
          // Espera progresiva antes de reintentar (1s, 2s, 3s)
          await new Promise(resolve => setTimeout(resolve, retries * 1000));
        }
      }
      
      if (!success) break;
    } while (currentPage <= totalPages);

    return allData;
  };

  // Cargar todas las provincias
  useEffect(() => {
    const fetchProvincias = async () => {
      setLoadingProvincias(true);
      try {
        const allProvincias = await fetchAllPages('https://api-geo-cr.vercel.app/provincias');
        console.log(`✅ Se cargaron ${allProvincias.length} provincias`);
        setProvincias(allProvincias);
      } catch (error) {
        console.error('❌ Error cargando provincias:', error);
        setProvincias([]);
      } finally {
        setLoadingProvincias(false);
      }
    };
    fetchProvincias();
  }, []);

  // Cargar todos los cantones cuando cambia la provincia
  useEffect(() => {
    if (!provinciaId) {
      setCantones([]);
      setLoadingCantones(false);
      return;
    }
    
    const fetchCantones = async () => {
      setLoadingCantones(true);
      try {
        const allCantones = await fetchAllPages(`https://api-geo-cr.vercel.app/provincias/${provinciaId}/cantones`);
        console.log(`✅ Se cargaron ${allCantones.length} cantones para provincia ID: ${provinciaId}`);
        setCantones(allCantones);
      } catch (error) {
        console.error('❌ Error cargando cantones:', error);
        setCantones([]);
      } finally {
        setLoadingCantones(false);
      }
    };
    fetchCantones();
  }, [provinciaId]);

  // Cargar todos los distritos cuando cambia el cantón
  useEffect(() => {
    if (!cantonId) {
      setDistritos([]);
      setLoadingDistritos(false);
      return;
    }
    
    const fetchDistritos = async () => {
      setLoadingDistritos(true);
      try {
        const allDistritos = await fetchAllPages(`https://api-geo-cr.vercel.app/cantones/${cantonId}/distritos`);
        console.log(`✅ Se cargaron ${allDistritos.length} distritos para cantón ID: ${cantonId}`);
        setDistritos(allDistritos);
      } catch (error) {
        console.error('❌ Error cargando distritos:', error);
        setDistritos([]);
      } finally {
        setLoadingDistritos(false);
      }
    };
    fetchDistritos();
  }, [cantonId]);

  return {
    provincias,
    cantones,
    distritos,
    setProvinciaId,
    setCantonId,
    
    // Estados de carga para mostrar spinners o indicadores
    loadingProvincias,
    loadingCantones,
    loadingDistritos,
    
    // Estado general de si algo está cargando
    isLoading: loadingProvincias || loadingCantones || loadingDistritos
  };
}