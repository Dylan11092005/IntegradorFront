import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import Inventory from "@mui/icons-material/Inventory2";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PetsIcon from "@mui/icons-material/Pets";
import ReportIcon from "@mui/icons-material/Report";
import BusinessIcon from "@mui/icons-material/Business";
import ListIcon from "@mui/icons-material/List";
import SearchIcon from "@mui/icons-material/Search";

import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import LocalShipping from "@mui/icons-material/LocalShipping";
import AssignmentReturned from "@mui/icons-material/AssignmentReturned";
import Shelves from "@mui/icons-material/Shelves";
import DatasetLinked from "@mui/icons-material/DatasetLinked";
import QuickReferenceAll from "@mui/icons-material/AssignmentLate";

import MapIcon from "@mui/icons-material/AddBusiness";










import { Link, useLocation } from "react-router-dom";

const drawerWidth = 270;
const bgColor = "#00897B";
const accentColor = "#F8B701";
const selectedBg = "#00675B";
const dividerColor = "#F8B701";
const textColor = "#fff";
const mutedText = "#e0e0e0";




const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 80,
  position: "relative",
  padding: theme.spacing(0, 1),
  flexDirection: "column", // Cambiamos a columna para mostrar usuario abajo
  textAlign: "center",
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    background: bgColor,
    color: textColor,
    border: "none",
    boxShadow: "2px 0 12px #0004",
    width: open ? drawerWidth : 64,
    transition: theme.transitions.create(["width", "background", "color"], {
      easing: theme.transitions.easing.easeInOut,
      duration: 500,
    }),
    overflowX: "hidden",
    // Solo aplicar posición fija en desktop
    [theme.breakpoints.up("sm")]: {
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      zIndex: 1300,
    },
    [theme.breakpoints.down("sm")]: {
      width: drawerWidth,
      position: "relative",
    },
  },
}));

const routeGroups = [
  {
    label: "Familia",
    icon: <GroupIcon />,
    routes: [
      { to: "/preFormulario.jsx", label: "Registrar", icon: <GroupIcon /> },
      { to: "/BusquedaFamilia.jsx", label: "Buscar", icon: <SearchIcon /> },
    ],
  },
  {
    label: "Albergue",
    icon: <BusinessIcon />,
    routes: [
      { to: "/registroAlbergue.jsx", label: "Registrar", icon: <MapIcon /> },
      { to: "/actualizarAlbergue.jsx", label: "Actualizar", icon: <BusinessIcon /> },
      { to: "/busquedaAlbergue.jsx", label: "Buscar", icon: <SearchIcon /> },
    ],
  },
  {
    label: "Mascotas",
    icon: <PetsIcon />,
    routes: [
      { to: "/registroMascota.jsx", label: "Registrar", icon: <PetsIcon /> },
      { to: "/busquedaMascotas.jsx", label: "Buscar", icon: <SearchIcon /> },
    ],
  },
  {
    label: "Inventarios",
    icon: <Inventory />,
    routes: [
      { to: "/registroSuministros.jsx", label: "Registrar Suministros", icon: <Shelves /> },
      { to: "/listaProducto.jsx", label: "Actualizar Suministro", icon: <ListIcon /> },
      { to: "/ajusteInventario.jsx", label: "Ajuste Inventario", icon: <Inventory /> },
      { to: "/buscarAjuste.jsx", label: "Lista de Ajustes", icon: <SearchIcon /> },
    ],
  },
  {
    label: "Alimentación",
    icon: <LocalDiningIcon />,
    routes: [
      { to: "/registrarConsumibles.jsx", label: "Registrar", icon: <LocalDiningIcon /> },
      { to: "/abarrotesMenuPrincipal", label: "Crear Menú", icon: <LocalShipping /> },
    ],
  },
  {
    label: "Asignaciones",
    icon: <AssignmentReturned />,
    routes: [
      { to: "/asignacionRecursos.jsx", label: "Registrar", icon: <AssignmentReturned /> },
      { to: "/buscarAsignaciones.jsx", label: "Buscar", icon: <SearchIcon /> },
    ],
  },
  {
    label: "Referencias",
    icon: <DatasetLinked />,
    routes: [
      { to: "/ayudaForm.jsx", label: "Registrar", icon: <DatasetLinked /> },
      { to: "/buscarReferencia.jsx", label: "Buscar", icon: <SearchIcon /> },
    ],
  },
  {
    label: "Amenazas",
    icon: <ReportIcon />,
    routes: [
      { to: "/registroAmenazas.jsx", label: "Registrar", icon: <ReportIcon /> },
      { to: "/buscarAmenaza.jsx", label: "Buscar", icon: <SearchIcon /> },
    ],
  },
  {
    label: "Reportes",
    icon: <QuickReferenceAll />,
    routes: [
      { to: "/reportes.jsx", label: "Reportes", icon: <QuickReferenceAll /> },
    ],
  },
  {
    label: "Oficinas",
    icon: <BusinessIcon />,
    routes: [
      { to: "/registroMunicipalidad.jsx", label: "Registrar Municipalidad", icon: <MapIcon /> },
    ],
  },
  {
    label: "Usuario",
    icon: <PersonAddIcon />,
    routes: [
      { to: "/registroUsuario.jsx", label: "Registrar Usuario", icon: <PersonAddIcon /> },
      { to: "/listaUsuarios.jsx", label: "Lista Usuarios", icon: <ListIcon /> },
    ],
  },
];

export default function CustomDrawer({ onLogout, children }) {
  const [open, setOpen] = React.useState(false);
  const [userData, setUserData] = React.useState(null);
  const [openGroups, setOpenGroups] = React.useState(
    routeGroups.map(() => false)
  );
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const location = useLocation();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleGroupToggle = (idx) => {
    setOpen(true);
    setOpenGroups((prev) =>
      prev.map((val, i) => (i === idx ? !prev[idx] : false))
    );
  };

  // Cierra todos los selects cuando el Drawer se cierra
  React.useEffect(() => {
    if (!open) setOpenGroups(routeGroups.map(() => false));
  }, [open]);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Botón hamburguesa fijo arriba solo cuando el drawer está cerrado */}
      {!open && (
        <Box
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1401,
            background: bgColor,
            borderRadius: "50%",
            boxShadow: "0 2px 8px #0003",
            display: "block",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            sx={{
              color: accentColor,
              "&:hover": { background: accentColor, color: bgColor },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}
      <MuiDrawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={() => setOpen(false)}
        ModalProps={{
          keepMounted: true, // Mejora el rendimiento en móviles
        }}
        sx={{
          display: "block",
          "& .MuiDrawer-paper": {
            background: bgColor,
            color: textColor,
            border: "none",
            boxShadow: "2px 0 12px #0004",
            overflowX: "hidden",
            ...(isMobile && {
              width: drawerWidth,
            }),
            ...(!isMobile && {
              width: open ? drawerWidth : 64,
              transition: "width 0.5s ease-in-out",
              position: "fixed",
              top: 0,
              left: 0,
              height: "100vh",
              zIndex: 1300,
            }),
          },
        }}
      >
        <DrawerHeader>
          {open && (
            <>
              <IconButton
                color="inherit"
                aria-label="close drawer"
                onClick={() => setOpen(false)}
                sx={{
                  zIndex: 1,
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: bgColor,
                  color: accentColor,
                  "&:hover": { background: selectedBg, color: "#fff" },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              {/* Mostrar nombre de usuario solo si el Drawer está abierto */}
              {userData && (
                <span style={{ color: accentColor, fontWeight: 'bold', marginTop: 8, fontSize: 18 }}>
                  {userData.nombre || userData.username}
                </span>
              )}
            </>
          )}
        </DrawerHeader>
        <Divider sx={{ background: dividerColor, mx: 2 }} />
        {/* Scroll solo en el área entre el header y el botón de cerrar sesión */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            px: 0,
            mt: 2,
            height: `calc(100vh - 80px - 8px - 80px)`,
            // Scroll personalizado que combina con los colores del drawer
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: bgColor, // #00897B - más oscuro que el fondo
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: bgColor, // #00675B - color dorado del drawer
              borderRadius: "4px",
              "&:hover": {
                background: "#00675B", // Versión más oscura del dorado para hover
              },
            },
            "&::-webkit-scrollbar-thumb:active": {
              background: "#00675B", // Aún más oscuro para cuando está activo
            },
            // Para Firefox
            scrollbarWidth: "thin",
            scrollbarColor: `${selectedBg} ${bgColor}`,
          }}
        >
          <List>
            {/* Botón de Inicio independiente */}
            <ListItem disablePadding sx={{ display: "block", mb: 2 }}>
              <ListItemButton
                component={Link}
                to="/inicio"
                selected={location.pathname === "/inicio"}
                sx={{
                  minHeight: 48,
                  borderRadius: 2,
                  mb: 1,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  color:
                    location.pathname === "/inicio" ? accentColor : textColor,
                  background:
                    location.pathname === "/inicio"
                      ? selectedBg
                      : "transparent",
                  "&:hover": {
                    background: selectedBg,
                    color: accentColor,
                    "& .MuiListItemIcon-root": { color: accentColor },
                  },
                  "&.Mui-selected": {
                    color: accentColor,
                    background: selectedBg,
                  },
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === "/inicio"
                        ? accentColor
                        : accentColor,
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Inicio"
                  sx={{
                    opacity: open ? 1 : 0,
                    fontWeight: 700,
                    fontSize: 18,
                    color:
                      location.pathname === "/inicio" ? accentColor : textColor,
                  }}
                />
              </ListItemButton>
            </ListItem>

            {/* Grupos desplegables */}
            {routeGroups.map((group, idx) => (
              <ListItem disablePadding sx={{ display: "block" }} key={group.label}>
                {group.routes.length === 1 ? (
      // Si solo tiene una ruta, el grupo es un Link directo
      <ListItemButton
        component={Link}
        to={group.routes[0].to}
        selected={location.pathname === group.routes[0].to}
        sx={{
          minHeight: 48,
          borderRadius: 2,
          mb: 1,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
          color:
            location.pathname === group.routes[0].to
              ? accentColor
              : textColor,
          background:
            location.pathname === group.routes[0].to
              ? selectedBg
              : "transparent",
          "&:hover": {
            background: selectedBg,
            color: accentColor,
            "& .MuiListItemIcon-root": { color: accentColor },
          },
          "&.Mui-selected": {
            color: accentColor,
            background: selectedBg,
          },
          transition: "background 0.2s, color 0.2s",
        }}
      >
        <ListItemIcon
          sx={{
            color: accentColor,
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {group.icon}
        </ListItemIcon>
        <ListItemText
          primary={group.label}
          sx={{
            opacity: open ? 1 : 0,
            fontWeight: 700,
            fontSize: 18,
            color: textColor,
          }}
        />
      </ListItemButton>
    ) : (
      <>
        {/* Grupo con submenú */}
        <ListItemButton
          onClick={() => handleGroupToggle(idx)}
          sx={{
            minHeight: 48,
            borderRadius: 2,
            mb: 1,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            color: textColor,
            "&:hover": {
              background: selectedBg,
              color: accentColor,
              "& .MuiListItemIcon-root": { color: accentColor },
            },
            transition: "background 0.2s, color 0.2s",
          }}
        >
          <ListItemIcon
            sx={{
              color: accentColor,
              minWidth: 0,
              mr: open ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            {group.icon}
          </ListItemIcon>
          <ListItemText
            primary={group.label}
            sx={{
              opacity: open ? 1 : 0,
              fontWeight: 700,
              fontSize: 18,
              color: textColor,
            }}
          />
          {open ? (
            openGroups[idx] ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )
          ) : null}
        </ListItemButton>
        <Collapse
          in={openGroups[idx]}
          timeout="auto"
          unmountOnExit
          sx={{
            transition: "max-height 0.3s",
            position: "relative",
          }}
        >
          <List component="div" disablePadding>
            {group.routes.map((route) => (
              <ListItemButton
                key={route.to}
                component={Link}
                to={route.to}
                selected={location.pathname === route.to}
                sx={{
                  pl: open ? 7 : 2.5,
                  color:
                    location.pathname === route.to
                      ? accentColor
                      : mutedText,
                  "&.Mui-selected": {
                    color: accentColor,
                    background: selectedBg,
                  },
                  fontSize: { xs: 14, sm: 16 },
                  py: { xs: 1, sm: 1.2 },
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: accentColor,
                    minWidth: 0,
                    mr: open ? 2 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {route.icon}
                </ListItemIcon>
                <ListItemText
                  primary={route.label}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </>
    )}
  </ListItem>
))}
          </List>
        </Box>
        <Divider sx={{ background: dividerColor, mx: 2 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: 2,
            pb: 3,
          }}
        >
          <Box
            component="button"
            onClick={onLogout}
            sx={{
              background: "",
              color: accentColor,
              border: "none",
              borderRadius: 2,
              px: open ? 3 : 1,
              py: 1.2,
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 2px 8px #0002",
              "&:hover": { background: selectedBg, color: "#fff" },
              width: open ? "auto" : 44,
              textAlign: "center",
              marginTop: 2,
              transition: "background 0.2s, color 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {open ? (
              <>
                <LogoutIcon sx={{ mr: 1 }} />
                Cerrar sesión
              </>
            ) : (
              <LogoutIcon />
            )}
          </Box>
        </Box>
      </MuiDrawer>
      <Box
        sx={{
          flex: 1,
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ml: { xs: 0, sm: open ? `${drawerWidth}px` : 0 },
          transition: "margin-left 0.3s",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          {children}
        </div>
      </Box>
    </Box>
  );
}
