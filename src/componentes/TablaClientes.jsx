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
import { QRCodeCanvas } from "qrcode.react";

const baseUrl = "http://192.168.0.7:5173";
const path = "/registro";

const TablaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [clienteEditando, setClienteEditando] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openQr, setOpenQr] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState(false);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch(
        "http://192.168.0.7/gimnasio/backend/controladores/ClienteController.php?action=listar"
      );
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const handleAbrirDialog = (cliente = null) => {
    if (cliente) {
      setClienteEditando(cliente);
      setNuevoCliente(false);
    } else {
      setClienteEditando(cliente);
      setNuevoCliente(true);
    }
    setOpenDialog(true);
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este cliente?"
    );
    if (confirmar) {
      try {
        const response = await fetch(
          "http://192.168.0.7/gimnasio/backend/controladores/ClienteController.php?action=eliminar",
          {
            method: "POST",
            body: JSON.stringify(id),
          }
        );
        const data = await response.json();

        fetchClientes();
      } catch (error) {
        console.error("Error al guardar cliente:", error);
      }
    }
  };

  const handleGuardarCliente = async () => {
    if (nuevoCliente) {
      if (clienteEditando === null) return;

      if (
        !clienteEditando.nombre ||
        clienteEditando.nombre.trim() === "" ||
        !clienteEditando.telefono ||
        clienteEditando.telefono.trim() === ""
      ) {
        alert("El nombre y teléfono no pueden estar vacíos.");
        return;
      }

      try {
        const response = await fetch(
          "http://192.168.0.7/gimnasio/backend/controladores/ClienteController.php?action=guardar",
          {
            method: "POST",
            body: JSON.stringify(clienteEditando),
          }
        );
        const data = await response.json();

        fetchClientes();
      } catch (error) {
        console.error("Error al guardar cliente:", error);
      }
    } else {
      if (
        !clienteEditando.nombre ||
        clienteEditando.nombre.trim() === "" ||
        !clienteEditando.telefono ||
        clienteEditando.telefono.trim() === ""
      ) {
        alert("El nombre y teléfono no pueden estar vacíos.");
        return;
      }
      try {
        const response = await fetch(
          "http://192.168.0.7/gimnasio/backend/controladores/ClienteController.php?action=editar",
          {
            method: "POST",
            body: JSON.stringify(clienteEditando),
          }
        );
        const data = await response.json();

        fetchClientes();
      } catch (error) {
        console.error("Error al guardar cliente:", error);
      }
    }

    setOpenDialog(false);
  };

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "telefono", header: "Teléfono" },
    { accessorKey: "email", header: "Correo" },

    {
      header: "Acciones",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="white"
            size="small"
            onClick={() => handleAbrirDialog(row.original)}
          >
            <EditIcon />
          </Button>
          <Button
            variant="contained"
            color="white"
            size="small"
            onClick={() => handleEliminar(row.original.id)}
          >
            <DeleteIcon />
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2, textAlign: "right" }}>
      {/* Botón para crear un nuevo cliente */}
      <Button
        variant="contained"
        color="info"
        sx={{ marginBottom: 2, marginRight:2 }}
        onClick={() => handleAbrirDialog()}
        startIcon={<SaveIcon />}
      >
        Nuevo
      </Button>
      <Button
        variant="contained"
        color="info"
        sx={{ marginBottom: 2 }}
        onClick={() => setOpenQr(true)}
        startIcon={<SaveIcon />}
      >
        QR
      </Button>

      {/* 📋 Tabla con paginación y filtros */}
      <MaterialReactTable
        columns={columns}
        data={clientes}
        initialState={{
          pagination: { pageSize: 5 },
          columnVisibility: { id: false },
        }}
        enablePagination={true}
        enableColumnFilters={true}
        enableGlobalFilter={true}
        state={{ globalFilter: filtro }}
        onGlobalFilterChange={setFiltro}
        localization={MRT_Localization_ES}
      />

      {/* 📝 Modal de Edición o Creación */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {nuevoCliente ? "Registrar Cliente" : "Editar Cliente"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={clienteEditando?.nombre || ""}
            onChange={(e) =>
              setClienteEditando({ ...clienteEditando, nombre: e.target.value })
            }
          />
          <TextField
            label="Teléfono"
            fullWidth
            margin="dense"
            value={clienteEditando?.telefono || ""}
            onChange={(e) =>
              setClienteEditando({
                ...clienteEditando,
                telefono: e.target.value,
              })
            }
          />
          <TextField
            label="Correo"
            fullWidth
            margin="dense"
            value={clienteEditando?.email || ""}
            onChange={(e) =>
              setClienteEditando({ ...clienteEditando, email: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleGuardarCliente} color="primary">
            {nuevoCliente ? "Crear" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openQr} onClose={() => setOpenQr(false)}>
        <DialogTitle sx={{textAlign:'center'}}>NUEVO CLIENTE</DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
          <QRCodeCanvas value={`${baseUrl}${path}`} size={200} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TablaClientes;
