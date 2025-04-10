import React, { useState, useEffect, useCallback } from "react";
import { IP } from "../Utileria";
import dayjs from "dayjs";

function PuntoDeVenta() {
  const [productos, setProductos] = useState([]); // Datos de la base de datos
  const [carrito, setCarrito] = useState([]);
  const [totalPagar, setTotalPagar] = useState(0);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    try {
      const response = await fetch(
        `http://${IP}/gimnasio/backend/controladores/StockController.php?action=listar`
      );
      const data = await response.json();
      setProductos(data);
      setProductosFiltrados(data);
    } catch (error) {
      console.error("Error al obtener el stock:", error);
    }
  };
  useEffect(() => {
    setTotalPagar(nuevoTotal);
  }, [carrito]);

  const nuevoTotal = carrito.reduce(
    (sum, item) =>
      sum + item.precio_unitario * item.cantidad * (1 - (item.descuento || 0)),
    0
  );

  const agregarAlCarrito = (producto) => {
    const existeEnCarrito = carrito.find((item) => item.id === producto.id);
    if (existeEnCarrito) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1, descuento: 0 }]);
    }
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad >= 0) {
      setCarrito(
        carrito.map((item) =>
          item.id === id
            ? { ...item, cantidad: parseInt(nuevaCantidad, 10) || 0 }
            : item
        )
      );
    }
  };

  const actualizarDescuento = (id, nuevoDescuento) => {
    if (nuevoDescuento >= 0 && nuevoDescuento <= 1) {
      setCarrito(
        carrito.map((item) =>
          item.id === id
            ? { ...item, descuento: parseFloat(nuevoDescuento) || 0 }
            : item
        )
      );
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const handleSearch = useCallback(
    (event) => {
      const term = event.target.value.toLowerCase();
      setSearchTerm(term);

      if (term) {
        const resultados = productos.filter((producto) =>
          producto.nombre_producto.toLowerCase().includes(term)
        );
        setProductosFiltrados(resultados);
      } else {
        // Si el campo de búsqueda está vacío, restaurar los productos originales
        setProductosFiltrados(productos);
      }
    },
    [productos]
  );

  const realizarVenta = async () => {
    const productos = carrito.map((producto) => {
      return {
        id_producto: producto.id,
        cantidad: producto.cantidad,
        descuento: producto.descuento,
      };
    });

    try {
      const response = await fetch(
        `http://${IP}/gimnasio/backend/controladores/VentaController.php?action=guardar`,
        {
          method: "POST",
          body: JSON.stringify({
            productos: productos,
            fecha_venta: dayjs().format("YYYY-MM-DD"),
            total: nuevoTotal,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Venta realizada!");
        setCarrito([]);
      }
    } catch (error) {
      console.error("Error al guardar venta:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Columna izquierda (8 columnas) - Lista de productos */}
        <div className="col-md-8">
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {productosFiltrados.map((producto) => (
              <div className="col" key={producto.id}>
                <div className="card shadow-sm h-100">
                  <img
                    src={
                      producto.img !== null
                        ? `./backend/img_productos/${producto.img}`
                        : "./backend/img_productos/no-product.png"
                    }
                    alt={producto.nombre_producto}
                    className="card-img-top p-2"
                    style={{ maxHeight: "150px", objectFit: "contain" }}
                  />

                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{producto.nombre_producto}</h5>
                    <p className="card-text">${producto.precio_unitario}</p>
                    <div className="mt-auto d-flex justify-content-end">
                      <button
                        onClick={() => agregarAlCarrito(producto)}
                        className="btn btn-primary btn-sm"
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {productosFiltrados.length === 0 && searchTerm && (
            <div className="col-12 mt-5">
              <p className="text-muted text-center">
                No se encontraron productos con el término "{searchTerm}".
              </p>
            </div>
          )}
        </div>

        {/* Columna derecha (4 columnas) - Carrito de compras */}
        <div className="col-md-4 mt-5">
          <ul className="list-group">
            {carrito.map((item) => (
              <li className="list-group-item d-flex flex-column" key={item.id}>
                <div className="d-flex align-items-center mb-2">
                  <img
                    src={
                      item.img !== null
                        ? `./backend/img_productos/${item.img}`
                        : "./backend/img_productos/no-product.png"
                    }
                    alt={item.nombre_producto}
                    className="rounded me-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                    }}
                  />

                  <div>
                    <h6 className="mb-0">{item.nombre_producto}</h6>
                    <small className="text-muted">
                      Precio: ${item.precio_unitario}
                    </small>
                  </div>
                  <div className="ms-auto">
                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <label
                      htmlFor={`cantidad-${item.id}`}
                      className="form-label-sm"
                    >
                      Cant:
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      id={`cantidad-${item.id}`}
                      value={item.cantidad}
                      onChange={(e) =>
                        actualizarCantidad(item.id, e.target.value)
                      }
                      style={{ width: "60px" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`descuento-${item.id}`}
                      className="form-label-sm text-danger"
                    >
                      Desc (%):
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      id={`descuento-${item.id}`}
                      value={(item.descuento * 100).toFixed(0)}
                      onChange={(e) =>
                        actualizarDescuento(
                          item.id,
                          parseFloat(e.target.value) / 100
                        )
                      }
                      min="0"
                      max="100"
                      style={{ width: "70px" }}
                    />
                  </div>
                  <div className="ms-auto fw-bold">
                    Total: $
                    {(
                      item.precio_unitario *
                      item.cantidad *
                      (1 - (item.descuento || 0))
                    ).toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
            {carrito.length > 0 && (
              <li className="list-group-item fw-bold text-end">
                Total a pagar:
                <span className="text-success"> ${totalPagar.toFixed(2)}</span>
              </li>
            )}
            {carrito.length === 0 && (
              <li className="list-group-item text-center">
                El carrito está vacío
              </li>
            )}
          </ul>
          {/* Botón "Realizar Venta" */}
          <div className="text-center">
            <button
              onClick={realizarVenta}
              className="btn btn-success w-75 mt-2"
              disabled={carrito.length === 0}
            >
              Realizar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PuntoDeVenta;
