import TablaPagos from "../componentes/TablaPagos";

function Pagos({usuarioLogueado}) {
  return (
    <div className="container">
      <div className="text-center">
        <span className="badge text-bg-dark fs-6 p-3">Membresías Asignadas</span>
      </div>
      <TablaPagos usuarioLogueado={usuarioLogueado} />
    </div>
  );
}

export default Pagos;
