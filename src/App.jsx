import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navegacion from "./componentes/Navegacion";
import Inicio from "./paginas/Inicio";
import Clientes from "./paginas/Clientes";
import Membresias from "./paginas/Membresias";
import Pagos from "./paginas/Pagos";
import RegistroCliente from "./paginas/RegistroCliente";
import { useEffect, useState } from "react";

import VistaConfiguracion from "./paginas/VistaConfiguracion";

function App() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const datos = await verificarConfig();
      setConfig(datos);
    };

    fetchData();
  }, []);

  const verificarConfig = async () => {
    const response = await fetch(
      "http://192.168.0.7/gimnasio/backend/controladores/ConfiguracionController.php?action=listar"
    );
    const respuesta = await response.json();
    const datos = respuesta[respuesta.length - 1];
    return datos;
  };

  return (
    <Router>
      <div>
        <Navegacion config={config} />

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/clientes" element={<Clientes config={config} />} />
          <Route path="/membresias" element={<Membresias />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/registro" element={<RegistroCliente />} />
          <Route path="/configuracion" element={<VistaConfiguracion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
