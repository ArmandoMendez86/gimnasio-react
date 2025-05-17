import { useCallback, useEffect, useState } from "react";
import Configuracion from "../componentes/Configuracion";
import Suministro from "../componentes/Suministro";
import TablaMembresias from "../componentes/TablaMembresias";
import TablaMovimientoStock from "../componentes/TablaMovimientoStock";
import TablaStock from "../componentes/TablaStock";
import VentasDiarias from "../componentes/VentasDiarias";
import TablaDetalleVentas from "../componentes/TablaDetalleVentas";
import TablaUsuarios from "../componentes/TablaUsuarios";

function VistaConfiguracion() {
  const [recargar, setRecargar] = useState(false);

  return (
    <div className="container">
      <div className="text-center">
        <span className="badge text-bg-dark fs-6 p-3">Configuración</span>
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
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="movimientos-tab"
            data-bs-toggle="tab"
            data-bs-target="#movimientos-tab-pane"
            type="button"
            role="tab"
            aria-controls="movimientos-tab-pane"
            aria-selected="false"
          >
            Movimiento Stock
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="ventas-tab"
            data-bs-toggle="tab"
            data-bs-target="#ventas-tab-pane"
            type="button"
            role="tab"
            aria-controls="ventas-tab-pane"
            aria-selected="false"
          >
            Grafico Ventas
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="detalle-tab"
            data-bs-toggle="tab"
            data-bs-target="#detalle-tab-pane"
            type="button"
            role="tab"
            aria-controls="detalle-tab-pane"
            aria-selected="false"
          >
            Ventas
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="usuarios-tab"
            data-bs-toggle="tab"
            data-bs-target="#usuarios-tab-pane"
            type="button"
            role="tab"
            aria-controls="usuarios-tab-pane"
            aria-selected="false"
          >
            Usuarios
          </button>
        </li>
      </ul>
      <div className="tab-content p-3" id="myTabContent">
        <div
          className="tab-pane fade show active border border-0"
          id="home-tab-pane"
          role="tabpanel"
          aria-labelledby="home-tab"
          tabIndex="0"
        >
          <Configuracion />
        </div>
        <div
          className="tab-pane fade border border-0"
          id="profile-tab-pane"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex="0"
        >
          <TablaMembresias />
        </div>
        <div
          className="tab-pane fade border border-0"
          id="productos-tab-pane"
          role="tabpanel"
          aria-labelledby="profile-tab"
          tabIndex="0"
        >
          <TablaStock recargar={recargar} />
        </div>
        <div
          className="tab-pane fade border border-0"
          id="suministros-tab-pane"
          role="tabpanel"
          aria-labelledby="suministros-tab"
          tabIndex="0"
        >
          <Suministro setRecargar={setRecargar} />
        </div>
        <div
          className="tab-pane fade border border-0"
          id="movimientos-tab-pane"
          role="tabpanel"
          aria-labelledby="movimientos-tab"
          tabIndex="0"
        >
          <TablaMovimientoStock recargar={recargar} setRecargar={setRecargar} />
        </div>
        <div
          className="tab-pane fade border border-0"
          id="ventas-tab-pane"
          role="tabpanel"
          aria-labelledby="ventas-tab"
          tabIndex="0"
        >
          <VentasDiarias recargar={recargar} />
        </div>
        <div
          className="tab-pane fade border border-0"
          id="detalle-tab-pane"
          role="tabpanel"
          aria-labelledby="detalle-tab"
          tabIndex="0"
        >
          <TablaDetalleVentas recargar={recargar} setRecargar={setRecargar} />
        </div>
        <div
          className="tab-pane fade border border-0"
          id="usuarios-tab-pane"
          role="tabpanel"
          aria-labelledby="usuarios-tab"
          tabIndex="0"
        >
          <TablaUsuarios />
        </div>
      </div>
    </div>
  );
}

export default VistaConfiguracion;
