import { useEffect, useState } from "react";
import Configuracion from "../componentes/Configuracion";
import VentasDiarias from "../componentes/VentasDiarias";

function Inicio() {
  return (
    <div className="container">
      <h1 className="text-center">Reporte del día</h1>
      <VentasDiarias />
    </div>
  );
}

export default Inicio;
