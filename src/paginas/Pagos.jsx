import TablaPagos from "../componentes/TablaPagos";

function Pagos() {
  return (
    <div className="p-3">
      <div className="alert alert-info text-center" role="alert">
        <p className="fs-5">Membresías Asignadas</p>
      </div>
      <TablaPagos />
    </div>
  );
}

export default Pagos;
