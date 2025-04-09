import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

function Navegacion({ config }) {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#343A40" }}
    >
      <div className="container-fluid">
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
          <a className="navbar-brand" href="#">
            <img
              style={{
                width: "80px",
                height: "80px",
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
          </a>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* <li className="nav-item">
              <Link
                className="nav-link active text-white"
                aria-current="page"
                to="/"
              >
                Inicio
              </Link>
            </li> */}
            <li className="nav-item">
              <Link className="nav-link text-white" to="/clientes">
                Clientes
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/venta">
                Venta
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/pagos">
                Clientes/Membresías
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" to="/configuracion">
                Configuración
              </Link>
            </li>
          </ul>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              data-bs-toggle="tooltip"
              title="Salir del sistema"
              className="btn btn-danger"
              type="submit"
            >
              <LogoutIcon />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navegacion;
