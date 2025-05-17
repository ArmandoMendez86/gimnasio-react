import React, { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";

const TablaMovimientoStock = ({ recargar, setRecargar }) => {
  const [movimientos, setMovimientos] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetchMovimientosStock();
    setRecargar(false);
  }, [recargar]);

  const fetchMovimientosStock = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_LOCAL}/backend/controladores/StockController.php?action=movimientostock`
      );
      const data = await response.json();
      setMovimientos(data);
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
    }
  };

  const columns = [
    {
      accessorKey: "nombre_producto",
      header: "Producto",
    },
    {
      accessorKey: "tipo_movimiento",
      header: "Movimiento",
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      size: 1,
    },
    {
      accessorKey: "existia",
      header: "Había",
      size: 1,
    },
    {
      accessorKey: "existe",
      header: "Hay",
      size: 1,
    },
    {
      accessorKey: "fecha_movimiento",
      header: "Fecha",
      Cell: ({ cell }) =>
        dayjs(cell.getValue()).locale("es").format("DD/MMM/YYYY"),
    },
    {
      accessorKey: "img",
      header: "Imagen",
      Cell: ({ cell }) => (
        <img
          src={
            cell.getValue() !== null
              ? `./backend/img_productos/${cell.getValue()}`
              : "./backend/img_productos/no-product.png"
          }
          alt={`Imagen de ${cell.row.original.name}`}
          style={{ width: "70px", height: "70px", objectFit: "cover" }}
        />
      ),
    },
  ];

  return (
    <Box>
      {/* 📋 Tabla con paginación y filtros */}
      <div
        style={{
          backgroundColor: "#343a40",
          padding: "0.7rem",
          borderRadius: "10px",
        }}
      >
        <MaterialReactTable
          columns={columns}
          data={movimientos}
          initialState={{
            pagination: { pageSize: 5 },
          }}
          enablePagination={true}
          enableColumnFilters={true}
          localization={MRT_Localization_ES}
          muiTableBodyCellProps={({ column, cell }) => {
            return {
              sx: {
                padding: "4px 8px",
                fontSize: "14px",
                ...(column.id === "existe" && {
                  textAlign: "center",
                  fontWeight: "bold",
                  color:'#07874c'
                }),
                ...(column.id === "fecha_movimiento" && {
                  textAlign: "center",
                }),
                ...(column.id === "tipo_movimiento" && {
                  textAlign: "center",
                  fontWeight: "bold",
                }),
                ...(column.id === "img" && {
                  textAlign: "center",
                }),
                ...(column.id === "cantidad" && {
                  textAlign: "center",
                }),
                ...(column.id === "existia" && {
                  textAlign: "center",
                }),
                backgroundColor: "#d8dfe6",
              },
            };
          }}
          muiTableHeadCellProps={{
            align: "center",
            sx: {
              padding: "4px 8px",
              textTransform: "uppercase",
              fontSize: "13px",
              fontWeight: "bold",
              color:'white',
              backgroundColor: "#343a40",
            },
          }}
        />
      </div>
    </Box>
  );
};

export default TablaMovimientoStock;
