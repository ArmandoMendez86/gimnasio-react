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
        `http://${IP}/gimnasio/backend/controladores/MembresiaClienteController.php?action=listar`
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
        `http://${IP}/gimnasio/backend/controladores/ClienteController.php?action=guardar`,
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
        `http://${IP}/gimnasio/backend/controladores/MembresiaClienteController.php?action=guardar`,
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
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
    },
    {
      accessorKey: "email",
      header: "Correo",
    },
    {
      accessorKey: "tipo",
      header: "Membresía",
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
        muiTableProps={{
          size: "small",
        }}
        muiTableBodyCellProps={{
          sx: {
            padding: "0.3rem",
            textAlign: "center",
          },
        }}
        muiTableHeadCellProps={{
          align:"center",
          sx: {
            textTransform: "uppercase",
          },
        }}
      />

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
        maxWidth="sm"
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
