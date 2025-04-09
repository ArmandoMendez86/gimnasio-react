const verificarCorreo = async (correo) => {
  try {
    const response = await fetch(
      `http://${IP}/gimnasio/backend/controladores/ClienteController.php?action=checarcorreo`,
      {
        method: "POST",
        body: JSON.stringify({ email: correo }),
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el correo:", error);
  }
};

// ip config
const IP = "192.168.10.17";

export { verificarCorreo, IP };
