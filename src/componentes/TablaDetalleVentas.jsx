import { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteTwoTone";
import SaveIcon from "@mui/icons-material/Add";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useMemo } from "react";
import { formatearCantidad } from "../Utileria";

const TablaDetalleVentas = ({ recargar, setRecargar }) => {
  const [ventas, setVentas] = useState([]);

  const [tipoMembresia, setTipoMembresia] = useState(null); // Cliente que estamos editando o creando
  const [openDialog, setOpenDialog] = useState(false); // Estado para abrir/cerrar el modal
  const [nuevaMembresia, setNuevaMembresia] = useState(false); // Estado para determinar si es nuevo o edición

  useEffect(() => {
    fetchDetalleVentas();
  }, [recargar]);

  const fetchDetalleVentas = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL_LOCAL
        }/backend/controladores/DetalleVentaController.php?action=listar`
      );
      const data = await response.json();
      //console.log(data);
      setVentas(data);
    } catch (error) {
      console.error("Error al obtener membresías:", error);
    }
  };

  const handleEliminar = async (datos) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas cancelar esta venta?"
    );
    if (confirmar) {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL_LOCAL
          }/backend/controladores/DetalleVentaController.php?action=eliminar`,
          {
            method: "POST",
            body: JSON.stringify(datos),
          }
        );
        const data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          fetchDetalleVentas();
          setRecargar(true);
        }
      } catch (error) {
        console.error("Error al guardar cliente:", error);
      }
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "codigo",
      header: "Codigo",
      size: 1,
    },
    {
      accessorKey: "producto",
      header: "Producto",
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      size: 1,
    },
    {
      accessorKey: "precio_unitario",
      header: "Precio",
      size: 1,
    },
    {
      accessorKey: "descuento",
      header: "Descuento(%)",
      Cell: ({ cell }) => {
        const valor = cell.getValue();
        return `${(valor * 100).toFixed(0)}%`;
      },
    },
    {
      accessorKey: "precio_neto",
      header: "Neto",
      size: 1,
    },

    {
      accessorKey: "fecha_venta",
      header: "Fecha",
      Cell: ({ cell }) =>
        dayjs(cell.getValue()).locale("es").format("DD/MMM/YYYY"),
    },

    {
      header: "Acciones",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="white"
            size="small"
            onClick={() => handleEliminar(row.original)}
          >
            <DeleteIcon />
          </Button>
        </Box>
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
          data={ventas}
          initialState={{
            pagination: { pageSize: 5 },
            columnVisibility: { id: false },
          }}
          enablePagination={true}
          enableColumnFilters={true}
          localization={MRT_Localization_ES}
          muiTableBodyCellProps={({ column }) => ({
            sx: {
              padding: "4px 8px",
              fontSize: "14px",
              ...(column.id === "descuento" && {
                textAlign: "center",
                color: "red",
                fontWeight: "bold",
              }),
              ...(column.id === "codigo" && {
                textAlign: "center",
              }),
              ...(column.id === "precio_unitario" && {
                textAlign: "center",
              }),
              ...(column.id === "cantidad" && {
                textAlign: "center",
              }),
              ...(column.id === "precio_neto" && {
                textAlign: "center",
                color: "green",
                fontWeight: "bold",
              }),
              ...(column.id === "fecha_venta" && {
                textAlign: "center",
              }),
              backgroundColor: "#d8dfe6",
            },
          })}
          muiTableHeadCellProps={{
            align: "center",
            sx: {
              padding: "4px 8px",
              textTransform: "uppercase",
              fontSize: "13px",
              fontWeight: "bold",
              color: "white",
              backgroundColor: "#343a40",
            },
          }}
          renderBottomToolbarCustomActions={({ table }) => {
            const total = useMemo(() => {
              return table.getFilteredRowModel().rows.reduce((sum, row) => {
                const value = parseFloat(row.getValue("precio_neto"));
                return sum + (isNaN(value) ? 0 : value);
              }, 0);
            }, [table.getFilteredRowModel().rows]);
            return (
              <Box
                sx={{
                  padding: 1,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  backgroundColor: "#212529",
                  color: "white",
                }}
              >
                Total Neto: {formatearCantidad(total)}
              </Box>
            );
          }}
        />
      </div>
    </Box>
  );
};

export default TablaDetalleVentas;
