import TablaClientes from "../componentes/TablaClientes";

function Clientes({ config }) {
  return (
    <div className="p-3">
      <div className="alert alert-info  mt-4 text-center" role="alert">
        <p className="fs-5">Listado Clientes</p>
      </div>

      <TablaClientes config={config} />
    </div>
  );
}

export default Clientes;
