import Configuracion from "../componentes/Configuracion";
import Suministro from "../componentes/Suministro";
import TablaMembresias from "../componentes/TablaMembresias";
import TablaStock from "../componentes/TablaStock";

function VistaConfiguracion() {
  return (
    <div className="container">
     <div className="text-center">
        <span className="badge text-bg-dark fs-6">Configuración</span>
      </div>

      <ul className="nav nav-tabs mt-5" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home-tab-pane"
            type="button"
            role="tab"
            aria-controls="home-tab-pane"
            aria-selected="true"
          >
            Datos / Negocio
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="profile-tab"
            data-bs-toggle="tab"
            data-bs-target="#profile-tab-pane"
            type="button"
            role="tab"
            aria-controls="profile-tab-pane"
            aria-selected="false"
          >
            Membresías
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="productos-tab"
            data-bs-toggle="tab"
            data-bs-target="#productos-tab-pane"
            type="button"
            role="tab"
            aria-controls="productos-tab-pane"
            aria-selected="false"
          >
            Stock Productos
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="suministros-tab"
            data-bs-toggle="tab"
            data-bs-target="#suministros-tab-pane"
            type="button"
            role="tab"
            aria-controls="suministros-tab-pane"
            aria-selected="false"
          >
            Suministros
          </button>
        </li>
      </ul>
      <div className="tab-content p-3" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="home-tab-pane"
          role="tabpanel"
          aria-labelledby="home-tab"
          tabIndex="0"
        >
          <Configuracion />
        </div>
        <div
          className="tab-pane fade"
          id="profile-tab-pane"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex="0"
        >
          <TablaMembresias />
        </div>
        <div
          className="tab-pane fade"
          id="productos-tab-pane"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex="0"
        >
          <TablaStock />
        </div>
        <div
          className="tab-pane fade"
          id="suministros-tab-pane"
          role="tabpanel"
          aria-labelledby="suministros-tab"
          tabIndex="0"
        >
          <Suministro />
        </div>
      </div>
    </div>
  );
}

export default VistaConfiguracion;
