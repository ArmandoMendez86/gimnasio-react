

import TablaClientes from "../componentes/TablaClientes";

function Clientes({config}) {

  return (
    <div className="p-3">
      <h1 className="mt-5 display-6 text-center">Listado Clientes</h1>
      <TablaClientes config={config} />
    </div>
  );
}

export default Clientes;
