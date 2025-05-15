import React, { useState, useEffect } from "react";
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
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Add";
import AgregarCliente from "./AgregarCliente";
import AgregarMembresia from "./AgregarMembresia";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { IP } from "../Utileria";
import { useMemo } from "react";
import { formatearCantidad } from "../Utileria";

const TablaPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [checked, setChecked] = useState(false);
  const [dialogCliente, setDialogCliente] = useState(false);
  const [dialogMembresia, setDialogMembresia] = useState(false);

  useEffect(() => {
    fetchMembresiasClientes();
  }, [checked]);

  const fetchMembresiasClientes = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL_LOCAL
        }/backend/controladores/MembresiaClienteController.php?action=listar`
      );
      const data = await response.json();

      setPagos(data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
    }
  };

  async function agregarMembresia(registroMembresia) {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL_LOCAL
        }/backend/controladores/MembresiaClienteController.php?action=guardar`,
        {
          method: "POST",
          body: JSON.stringify(registroMembresia),
        }
      );
      const data = await response.json();

      if (data.success) {
        setDialogMembresia(false);
        fetchMembresiasClientes();
      }
    } catch (error) {
      console.error("Error al guardar membresía del cliente:", error);
    }
  }

  const actualizarPago = async (datos) => {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL_LOCAL
      }/backend/controladores/MembresiaClienteController.php?action=actualizarpago`,
      {
        method: "POST",
        body: JSON.stringify(datos),
      }
    );

    const data = await response.json();
    fetchMembresiasClientes();
  };

  const confirmarPago = (e, id) => {
    const datos = {
      status: e.target.checked,
      id: id,
    };

    if (confirm("Desea realizar el cobro de la membresía?")) {
      actualizarPago(datos);
    }
  };

  const handleEliminar = async (id) => {
    if (confirm("Deseas eliminar esta membresia?")) {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL_LOCAL
          }/backend/controladores/MembresiaClienteController.php?action=eliminar`,
          {
            method: "POST",
            body: JSON.stringify(id),
          }
        );

        const data = await response.json();
        fetchMembresiasClientes();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
    },
    {
      accessorKey: "tipo",
      header: "Membresía",
      size: 1,
    },
    {
      accessorKey: "precio",
      header: "Precio",
      size: 1,
    },
    {
      accessorKey: "descuento",
      header: "Descuento(%)",
      size: 1,
    },
    {
      accessorKey: "precio_neto",
      header: "Neto",
      size: 1,
    },
    {
      accessorKey: "fecha_inicio",
      header: "Inicia",

      Cell: ({ cell }) =>
        dayjs(cell.getValue()).locale("es").format("DD/MMM/YYYY"),
    },
    {
      accessorKey: "fecha_fin",
      header: "Termina",

      Cell: ({ cell }) =>
        dayjs(cell.getValue()).locale("es").format("DD/MMM/YYYY"),
    },
    {
      accessorKey: "status",
      header: "Pagado",
      Cell: ({ cell, row }) => (
        <input
          type="checkbox"
          checked={row.original.status === 1 || row.original.status === true}
          onClick={(e) => {
            if (row.original.status) {
              e.preventDefault();
            }
          }}
          onChange={(e) => {
            if (!row.original.status) {
              confirmarPago(e, row.original.id);
            }
          }}
          style={{
            width: "18px",
            height: "18px",
            accentColor: "#117c38", // verde claro
            borderRadius: "4px",
            cursor: "pointer",
          }}
        />
      ),
      size: 1,
    },
    {
      header: "Acciones",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            title="Eliminar"
            size="small"
            onClick={() => handleEliminar(row.original.id)}
            sx={{
              color: "red",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            X
          </Button>
        </Box>
      ),
      size: 1,
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="warning"
          sx={{ marginBottom: 2 }}
          onClick={() => setDialogCliente(true)}
          startIcon={<SaveIcon />}
        >
          Cliente
        </Button>
        <Button
          variant="contained"
          color="warning"
          sx={{ marginBottom: 2, marginLeft: 2 }}
          onClick={() => setDialogMembresia(true)}
          startIcon={<SaveIcon />}
        >
          Membresía
        </Button>
      </div>

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
          data={pagos}
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
              ...(column.id === "fecha_inicio" && {
                textAlign: "center",
              }),
              ...(column.id === "fecha_fin" && {
                textAlign: "center",
              }),
              ...(column.id === "status" && {
                textAlign: "center",
              }),
              ...(column.id === "precio" && {
                textAlign: "center",
              }),
              ...(column.id === "descuento" && {
                textAlign: "center",
                color: "red",
              }),
              ...(column.id === "precio_neto" && {
                textAlign: "center",
                color: "green",
                fontWeight: "bold",
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

      <Dialog open={dialogCliente} onClose={() => setDialogCliente(false)}>
        <DialogContent>
          <div className="text-end ">
            <Button
              style={{ color: "red", fontSize: "1.3rem" }}
              onClick={() => setDialogCliente(false)}
            >
              X
            </Button>
          </div>
          <AgregarCliente />
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        open={dialogMembresia}
        onClose={() => setDialogMembresia(false)}
      >
        <DialogContent>
          <div className="text-end">
            <Button
              style={{ color: "red", fontSize: "1.3rem" }}
              onClick={() => setDialogMembresia(false)}
            >
              X
            </Button>
          </div>
          <AgregarMembresia agregarMembresia={agregarMembresia} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TablaPagos;
