import { Navigate } from "react-router-dom";

const RutaPublica = ({ usuarioLogueado, children }) => {
  // Si ya está logueado, redirige al inicio
  if (usuarioLogueado && usuarioLogueado.id) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RutaPublica;
