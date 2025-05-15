// ... importaciones ...

import { useEffect, useState } from "react";
import GraficoVentas from "./GraficoVentas";
import { IP } from "../Utileria";
import dayjs from "dayjs";
import { formatearCantidad } from "../Utileria";

const VentasDiarias = ({recargar}) => {
  const [ventasTotalesDiarias, setVentasTotalesDiarias] = useState(null);
  const [totalProductos, setTotalProductos] = useState(0);
  const [totalServicios, setTotalServicios] = useState(0);

  useEffect(() => {
    const obtenerDatosVentasCombinados = async () => {
      const productosData = await ventaProductos();
      const serviciosData = await ventaServicios();

      if (
        productosData &&
        productosData[0]?.total_productos !== undefined &&
        serviciosData &&
        serviciosData[0]?.total_servicios !== undefined
      ) {
        setVentasTotalesDiarias({
          labels: ["Ventas Diarias"],
          datasets: [
            {
              label: "Productos",
              data: [parseFloat(productosData[0].total_productos)],
              backgroundColor: "rgb(235, 139, 54)",
            },
            {
              label: "Servicios",
              data: [parseFloat(serviciosData[0].total_servicios)],
              backgroundColor: "rgb(10, 105, 104)",
            },
          ],
        });
        // Seteando los valores de venta
        setTotalProductos(Number(productosData[0].total_productos) || 0);
        setTotalServicios(Number(serviciosData[0].total_servicios) || 0);
      } else if (
        productosData &&
        productosData[0]?.total_productos !== undefined
      ) {
        setVentasTotalesDiarias({
          labels: ["Ventas Diarias"],
          datasets: [
            {
              label: "Productos",
              data: [parseFloat(productosData[0].total_productos)],
              backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
          ],
        });
      } else if (
        serviciosData &&
        serviciosData[0]?.total_servicios !== undefined
      ) {
        setVentasTotalesDiarias({
          labels: ["Ventas Diarias"],
          datasets: [
            {
              label: "Servicios",
              data: [parseFloat(serviciosData[0].total_servicios)],
              backgroundColor: "rgba(255, 99, 132, 0.6)",
            },
          ],
        });
      } else {
        setVentasTotalesDiarias(null);
      }
    };

    obtenerDatosVentasCombinados();
  }, [recargar]);

  const ventaProductos = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_LOCAL}/backend/controladores/VentaController.php?action=ventaproductos`,
        {
          method: "POST",
          body: JSON.stringify({ fecha: dayjs().format("YYYY-MM-DD") }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener venta de productos:", error);
      return null;
    }
  };

  const ventaServicios = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_LOCAL}/backend/controladores/MembresiaClienteController.php?action=ventaservicios`,
        {
          method: "POST",
          body: JSON.stringify({ fecha: dayjs().format("YYYY-MM-DD") }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener venta de servicios:", error);
      return null;
    }
  };

  const calcularTotal = (productos, servicios) => {
    const cantidad = `${parseFloat(productos) + parseFloat(servicios)}`;
    return formatearCantidad(cantidad);
  };

  return (
    <div >
      <div className="text-end">
        <button
          className="btn btn-warning text-success fw-bold fs-2"
          style={{ width: "fit-content", padding: "0.5rem 1.5rem" }}
        >
          {calcularTotal(totalProductos, totalServicios)}
        </button>
      </div>

      <div className="w-75 mx-auto">
        {ventasTotalesDiarias && (
          <GraficoVentas
            data={ventasTotalesDiarias}
            title="Total de Ventas Diarias"
            barThickness={100}
            maxBarThickness={150}
          />
        )}
      </div>
      {!ventasTotalesDiarias && <p>Cargando datos...</p>}
    </div>
  );
};

export default VentasDiarias;
