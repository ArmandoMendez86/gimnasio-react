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
import { IP } from "./Utileria";
import RegistroProducto from "./paginas/RegistroProducto";
import Venta from "./paginas/Venta";
import Reporte from "./paginas/Reporte";
import Login from "./paginas/Login";

// Componente auxiliar para controlar si mostrar la navegación
const Layout = ({ config }) => {
  const location = useLocation();

  return (
    <div>
      {/* Solo muestra la navbar si no estás en /login */}
      {location.pathname !== "/login" && <Navegacion config={config} />}
      <div style={{ marginTop: "50px" }}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/clientes" element={<Clientes config={config} />} />
          <Route path="/venta" element={<Venta />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/registro" element={<RegistroCliente />} />
          <Route path="/registro-producto" element={<RegistroProducto />} />
          <Route path="/configuracion" element={<VistaConfiguracion />} />
          <Route path="/reporte" element={<Reporte />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datos = await verificarConfig();
        setConfig(datos);
      } catch (err) {
        console.error("Error al cargar la configuración:", err);
      }
    };

    fetchData();
  }, []);

  const verificarConfig = async () => {
    const response = await fetch(
      `http://${IP}/gimnasio/backend/controladores/ConfiguracionController.php?action=listar`
    );
    const respuesta = await response.json();
    const datos = respuesta[respuesta.length - 1];
    return datos;
  };

  return (
    <Router>
      <Layout config={config} />
    </Router>
  );
}

export default App;
