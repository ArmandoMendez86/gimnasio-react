import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navegacion from "./componentes/Navegacion";
import Inicio from "./paginas/Inicio";
import Clientes from "./paginas/Clientes";
import Pagos from "./paginas/Pagos";
import RegistroCliente from "./paginas/RegistroCliente";
import { useEffect, useState } from "react";
import VistaConfiguracion from "./paginas/VistaConfiguracion";
import { verificarUsuarioLogueado } from "./Utileria";
import RegistroProducto from "./paginas/RegistroProducto";
import Venta from "./paginas/Venta";
import Reporte from "./paginas/Reporte";
import Login from "./paginas/Login";
import RutaPrivada from "./componentes/RutaPrivada";
import RutaPublica from "./componentes/RutaPublica";
import NoEncontrado from "./componentes/NoEncontrado";

// Componente auxiliar para controlar si mostrar la navegación
const Layout = ({ config, usuarioLogueado, loading }) => {
  const location = useLocation();

  return (
    <div>
      {/* Solo muestra la navbar si no estás en /login */}
      {location.pathname !== "/login" && (
        <Navegacion config={config} usuarioLogueado={usuarioLogueado} />
      )}
      <div style={{ marginTop: "50px" }}>
        <Routes>
          <Route
            path="/"
            element={
              <RutaPrivada usuarioLogueado={usuarioLogueado} loading={loading}>
                <Inicio />
              </RutaPrivada>
            }
          />
          <Route
            path="/clientes"
            element={
              <RutaPrivada usuarioLogueado={usuarioLogueado} loading={loading}>
                <Clientes config={config} />
              </RutaPrivada>
            }
          />
          <Route
            path="/venta"
            element={
              <RutaPrivada usuarioLogueado={usuarioLogueado} loading={loading}>
                <Venta />
              </RutaPrivada>
            }
          />
          <Route
            path="/pagos"
            element={
              <RutaPrivada usuarioLogueado={usuarioLogueado} loading={loading}>
                <Pagos usuarioLogueado={usuarioLogueado} />
              </RutaPrivada>
            }
          />
          <Route
            path="/registro"
            element={
              <RutaPrivada usuarioLogueado={usuarioLogueado} loading={loading}>
                <RegistroCliente />
              </RutaPrivada>
            }
          />
          <Route
            path="/registro-producto"
            element={
              <RutaPrivada usuarioLogueado={usuarioLogueado} loading={loading}>
                <RegistroProducto />
              </RutaPrivada>
            }
          />
          <Route
            path="/configuracion"
            element={
              <RutaPrivada usuarioLogueado={usuarioLogueado} loading={loading}>
                <VistaConfiguracion/>
              </RutaPrivada>
            }
          />
          <Route
            path="/reporte"
            element={
              <RutaPrivada usuarioLogueado={usuarioLogueado} loading={loading}>
                <Reporte />
              </RutaPrivada>
            }
          />
          <Route
            path="/login"
            element={
              <RutaPublica usuarioLogueado={usuarioLogueado} loading={loading}>
                <Login />
              </RutaPublica>
            }
          />
          {/* Ruta comodín */}
          {/*  <Route
            path="*"
            element={<NoEncontrado usuarioLogueado={usuarioLogueado} />}
          /> */}
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const [config, setConfig] = useState(null);
  const [usuarioLogueado, setUsuarioLogueado] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await verificarConfig();
        const data = await verificarUsuarioLogueado();
        setConfig(datos);
        setUsuarioLogueado(data);
      } catch (err) {
        console.error("Error al cargar la configuración:", err);
      } finally {
        setLoading(false); // <- Muy importante
      }
    };

    fetchData();
  }, []);

  const verificarConfig = async () => {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL_LOCAL
      }/backend/controladores/ConfiguracionController.php?action=listar`
    );
    const respuesta = await response.json();
    const datos = respuesta[respuesta.length - 1];
    return datos;
  };

  return (
    <Router>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <Layout
          config={config}
          usuarioLogueado={usuarioLogueado}
          loading={loading}
        />
      )}
    </Router>
  );
}

export default App;
