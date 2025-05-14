import TablaPagos from "../componentes/TablaPagos";

function Pagos() {
  return (
    <div className="container">
      <div className="text-center">
        <span className="badge text-bg-dark fs-6 p-3">Membresías Asignadas</span>
      </div>
      <TablaPagos />
    </div>
  );
}

export default Pagos;
