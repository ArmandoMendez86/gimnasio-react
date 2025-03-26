import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navegacion from "./componentes/Navegacion";
import Inicio from "./paginas/Inicio";
import Clientes from "./paginas/Clientes";
import Membresias from "./paginas/Membresias";
import Pagos from "./paginas/Pagos";
import RegistroCliente from "./paginas/RegistroCliente";

function App() {
  return (
    <Router>
      <div>
        <Navegacion />

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/membresias" element={<Membresias />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/registro" element={<RegistroCliente />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
