import { Navigate } from "react-router-dom";

const RutaPrivada = ({ children, usuarioLogueado, loading }) => {
  if (loading) return null; // o un spinner si quieres

  if (!usuarioLogueado?.id) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaPrivada;
