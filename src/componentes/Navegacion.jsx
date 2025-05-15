import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import BtnCerrarSesion from "./BtnCerrarSesion";
import { verificarUsuarioLogueado } from "../Utileria";

function Navegacion({ config, usuarioLogueado }) {
  const location = useLocation();

  const getLinkClass = (path) => {
    return `nav-link text-white ${location.pathname === path ? "active" : ""}`;
  };

  return (
    <nav
      className="navbar navbar-expand-lg p-2"
      style={{ backgroundColor: "#343A40" }}
    >
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <Link className="navbar-brand" to="/clientes">
            <img
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
              src={
                config
                  ? config.img
                    ? `/backend/img_clientes/${config.img}`
                    : "/backend/img_clientes/logo_ejemplo.png"
                  : "/backend/img_clientes/logo_ejemplo.png"
              }
              alt=""
            />
          </Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
            <li className="nav-item">
              <Link className={getLinkClass("/clientes")} to="/clientes">
                Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/venta")} to="/venta">
                Venta
              </Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClass("/pagos")} to="/pagos">
                Membresías
              </Link>
            </li>
            {usuarioLogueado.perfil === "admin" && (
              <li className="nav-item">
                <Link
                  className={getLinkClass("/configuracion")}
                  to="/configuracion"
                >
                  Administración
                </Link>
              </li>
            )}
          </ul>
          {usuarioLogueado && <BtnCerrarSesion />}
        </div>
      </div>
    </nav>
  );
}

export default Navegacion;
