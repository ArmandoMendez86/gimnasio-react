// LogoutButton.jsx
import { useNavigate } from "react-router-dom";

const BtnCerrarSesion = () => {
  const navigate = useNavigate();

  const cerrarSesion = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL_LOCAL
        }/backend/controladores/logout.php`,
        {
          method: "GET",
          credentials: "include", // Esto es clave para que se envíen cookies/sesiones
        }
      );

      const data = await response.json();

      if (data.success) {
        navigate("/login");
        //window.location.href = "/login";
      } else {
        alert("Hubo un problema al cerrar la sesión.");
      }
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  };

  return (
    <button className="btn btn-danger btn-sm" onClick={cerrarSesion}>
      Cerrar sesión
    </button>
  );
};

export default BtnCerrarSesion;
