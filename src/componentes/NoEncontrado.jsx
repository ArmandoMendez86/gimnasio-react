import { Navigate } from "react-router-dom";

const NoEncontrado = ({ usuarioLogueado }) => {
  if (usuarioLogueado && usuarioLogueado.id) {
    // Si está logueado, puede ver una página 404 personalizada o redirigir al inicio
    if (usuarioLogueado?.perfil === "admin") {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/clientes" replace />;
    }
  } else {
    // Si no está logueado, redirige al login
    return <Navigate to="/login" replace />;
  }
};

export default NoEncontrado;
