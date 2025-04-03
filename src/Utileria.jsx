const verificarCorreo = async (correo) => {
    try {
      const response = await fetch(
        "http://192.168.0.7/gimnasio/backend/controladores/ClienteController.php?action=checarcorreo",
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


  export {verificarCorreo}