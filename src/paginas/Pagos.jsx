import TablaPagos from "../componentes/TablaPagos";

function Pagos(){
    return (
        <div className="p-3">
          <h1 className="mt-5 display-6 text-center">Membresías Clientes</h1>
          <TablaPagos />
        </div>
      );
}

export default Pagos