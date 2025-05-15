const verificarCorreo = async (correo) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL_LOCAL
      }/backend/controladores/ClienteController.php?action=checarcorreo`,
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

const formatearCantidad = (amount) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

const verificarUsuarioLogueado = async () => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL_LOCAL
      }/backend/controladores/LoginController.php?action=sesion`,
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el usuario logueado:", error);
  }
};

// ip config
const IP = "192.168.10.6";

export { verificarCorreo, IP, formatearCantidad, verificarUsuarioLogueado };
