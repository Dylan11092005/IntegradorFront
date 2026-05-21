import React, { useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import crMap from './img/cr-02.jpg';

const MapaOficinas = () => {
  const [selectedLocation, setSelectedLocation] = useState('SAN JOSE');

  const ubicaciones = [
    'SAN JOSE',
    'ALAJUELA',
    'CARTAGO',
    'HEREDIA',
    'PUNTARENAS',
    'GUANACASTE',
    'LIMON'
  ];

  const coordenadas = {
    'SAN JOSE': { x: 470, y: 299 },
    'ALAJUELA': { x: 370, y: 160 },
    'CARTAGO': { x: 515, y: 260 },
    'HEREDIA': { x: 460, y: 160 },
    'PUNTARENAS': { x: 590, y: 390 },
    'GUANACASTE': { x: 220, y: 150 },
    'LIMON': { x: 590, y: 230 }
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 3 }, 
      maxWidth: '1200px', 
      margin: '0 auto',
      width: '100%'
    }}>
      <Typography variant="h4" gutterBottom sx={{ 
        mb: 3, 
        textAlign: 'center', 
        color: '#2E7D32', 
        fontWeight: 'bold',
        fontSize: { xs: '1.5rem', md: '2.125rem' }
      }}>
        Seleccione la provincia donde buscar albergues: {selectedLocation}
      </Typography>
      
      <Box sx={{ 
        display: 'flex', 
        gap: { xs: 2, md: 3 }, 
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'flex-start'
      }}>
        {/* Mapa de Costa Rica - Responsive */}
        <Paper elevation={6} sx={{ 
          width: { xs: '100%', md: '700px' },
          height: { xs: '300px', md: '600px' },
          p: 2, 
          position: 'relative', 
          borderRadius: 4,
          flexShrink: 0,
          overflow: 'hidden'
        }}>
          <Box 
            sx={{ 
              width: '100%', 
              height: '100%', 
              backgroundImage: `url(${crMap})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              position: 'relative'
            }}
          >
            {ubicaciones.map((ubicacion) => (
              <Box
                key={ubicacion}
                onClick={() => handleLocationClick(ubicacion)}
                sx={{
                  position: 'absolute',
                  left: `${(coordenadas[ubicacion].x / 800) * 100}%`,
                  top: `${(coordenadas[ubicacion].y / 600) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                <LocationOnIcon 
                  sx={{ 
                    fontSize: { xs: '1.5rem', md: '2.5rem' },
                    color: selectedLocation === ubicacion ? '#2E7D32' : '#FFC107',
                    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                  }} 
                />
                {selectedLocation === ubicacion && (
                  <Typography 
                    sx={{
                      position: 'absolute',
                      top: { xs: '-20px', md: '-30px' },
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bgcolor: 'white',
                      px: 1,
                      borderRadius: 1,
                      fontSize: { xs: '0.6rem', md: '0.8rem' },
                      fontWeight: 'bold',
                      color: '#2E7D32',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {ubicacion}
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Lista de provincias - Responsive */}
        <Paper elevation={6} sx={{ 
          width: { xs: '100%', md: '350px' },
          height: { xs: 'auto', md: '600px' },
          p: 2, 
          borderRadius: 4,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 2,
            flexShrink: 0
          }}>
            <LocationOnIcon sx={{ color: '#2E7D32', fontSize: '2rem' }} />
            <Typography variant="h5" sx={{ 
              color: '#2E7D32', 
              fontWeight: 'bold',
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}>
              Albergues disponibles:
            </Typography>
          </Box>
          
          <Box sx={{ 
            flex: 1,
            overflow: 'hidden',
            minHeight: { xs: '300px', md: 0 }
          }}>
            <List dense sx={{ 
              height: '100%', 
              overflowY: 'auto', 
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '6px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#2E7D32',
                borderRadius: '3px'
              }
            }}>
              {ubicaciones.map((ubicacion, index) => (
                <ListItem 
                  key={index} 
                  button 
                  onClick={() => handleLocationClick(ubicacion)}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: selectedLocation === ubicacion ? '#E8F5E9' : 'transparent',
                    color: selectedLocation === ubicacion ? '#1B5E20' : '#424242',
                    border: selectedLocation === ubicacion ? '2px solid #2E7D32' : '1px solid #e0e0e0',
                    '&:hover': {
                      bgcolor: selectedLocation === ubicacion ? '#C8E6C9' : '#f5f5f5',
                      transform: 'translateX(5px)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                >
                  <ListItemText 
                    primary={ubicacion}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: selectedLocation === ubicacion ? 'bold' : 'medium'
                    }}
                  />
                  {selectedLocation === ubicacion && (
                    <Chip 
                      size="small" 
                      label="Seleccionada" 
                      sx={{ 
                        bgcolor: '#FFC107', 
                        color: '#000',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        ml: 1
                      }} 
                    />
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MapaOficinas;