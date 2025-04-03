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

const TablaPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [dialogCliente, setDialogCliente] = useState(false);
  const [dialogMembresia, setDialogMembresia] = useState(false);

  useEffect(() => {
    fetchMembresiasClientes();
  }, []);

  const fetchMembresiasClientes = async () => {
    try {
      const response = await fetch(
        "http://192.168.0.7/gimnasio/backend/controladores/MembresiaClienteController.php?action=listar"
      );
      const data = await response.json();

      setPagos(data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
    }
  };

  async function agregarCliente(cliente) {
    try {
      const response = await fetch(
        "http://192.168.0.7/gimnasio/backend/controladores/ClienteController.php?action=guardar",
        {
          method: "POST",
          body: JSON.stringify(cliente),
        }
      );
      const data = await response.json();

      if (data.success) {
        setDialogCliente(false);
      }
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  }

  async function agregarMembresia(registroMembresia) {
    try {
      const response = await fetch(
        "http://192.168.0.7/gimnasio/backend/controladores/MembresiaClienteController.php?action=guardar",
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

  const columns = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      muiTableHeadCellProps: {
        align: "center", 
      },
      muiTableBodyCellProps: { sx: { textTransform: "upperCase" } },
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      muiTableHeadCellProps: {
        align: "center", 
      },
      muiTableBodyCellProps: {
        sx: {
          textAlign: "center",
          textTransform: "upperCase",
        },
      },
    },
    {
      accessorKey: "email",
      header: "Correo",
      muiTableHeadCellProps: {
        align: "center", 
      },
      muiTableBodyCellProps: {
        sx: { textTransform: "upperCase", textAlign: "center" },
      },
    },
    {
      accessorKey: "tipo",
      header: "Membresía",
      muiTableHeadCellProps: {
        align: "center", 
      },
      muiTableBodyCellProps: {
        sx: {
          textAlign: "center",
          textTransform: "upperCase",
        },
      },
    },
    {
      accessorKey: "fecha_inicio",
      header: "Inicia",
      muiTableHeadCellProps: {
        align: "center", 
      },
      Cell: ({ cell }) =>
        dayjs(cell.getValue()).locale("es").format("DD/MMM/YYYY"),
      muiTableBodyCellProps: { sx: { textAlign: "center" } },
    },
    {
      accessorKey: "fecha_fin",
      header: "Termina",
      muiTableHeadCellProps: {
        align: "center", 
      },
      Cell: ({ cell }) =>
        dayjs(cell.getValue()).locale("es").format("DD/MMM/YYYY"),
      muiTableBodyCellProps: { sx: { textAlign: "center" } },
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="info"
          sx={{ marginBottom: 2 }}
          onClick={() => setDialogCliente(true)}
          startIcon={<SaveIcon />}
        >
          Nuevo Cliente
        </Button>
        <Button
          variant="contained"
          color="info"
          sx={{ marginBottom: 2, marginLeft: 2 }}
          onClick={() => setDialogMembresia(true)}
          startIcon={<SaveIcon />}
        >
          Nueva Membresía
        </Button>
      </div>

      {/* 📋 Tabla con paginación y filtros */}
      <MaterialReactTable
        columns={columns}
        data={pagos}
        initialState={{ pagination: { pageSize: 5 } }}
        enablePagination={true}
        enableColumnFilters={true}
        enableGlobalFilter={true}
        state={{ globalFilter: filtro }}
        onGlobalFilterChange={setFiltro}
        localization={MRT_Localization_ES}
        muiTableHeadCellProps={{
          sx: {
            textTransform: "uppercase",
            fontWeight: "bold",
          },
        }}
      />

      <Dialog open={dialogCliente} onClose={() => setDialogCliente(false)}>
        <DialogContent>
          <AgregarCliente agregarCliente={agregarCliente} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDialogCliente(false)}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogMembresia} onClose={() => setDialogMembresia(false)}>
        <DialogContent>
          <AgregarMembresia agregarMembresia={agregarMembresia} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDialogMembresia(false)}
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TablaPagos;
