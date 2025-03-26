import AgregarCliente from "../componentes/AgregarCliente";


async function agregarCliente(cliente) {
    try {
      const response = await fetch(
        "http://192.168.0.7/gimnasio/backend/controladores/ClienteController.php?action=guardar",
        {
          method: "POST",
          body: JSON.stringify(cliente),
        }
      );
      const data = await response.json();

      if (data.success) {
       return true
      }
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  }

function RegistroCliente() {
  return (
    <div className="text-center">
      <h1>Ingresa tu datos!</h1>
      <AgregarCliente agregarCliente={agregarCliente} />
    </div>
  );
}

export default RegistroCliente;
