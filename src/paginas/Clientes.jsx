import TablaClientes from "../componentes/TablaClientes";

function Clientes({ config }) {
  return (
    <div className="container">
      <div className="text-center">
        <span className="badge text-bg-dark fs-6 p-3">Listado Clientes</span>
      </div>

      <TablaClientes config={config} />
    </div>
  );
}

export default Clientes;
