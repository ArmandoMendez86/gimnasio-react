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
  Input, // Importamos Input para el input de archivo
  IconButton, // Importamos IconButton para el botón de eliminar imagen
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ClearIcon from "@mui/icons-material/Clear"; // Importamos ClearIcon
import { QRCodeCanvas } from "qrcode.react";
import { verificarCorreo } from "../Utileria";
import Resizer from "react-image-file-resizer"; // Importamos Resizer
import InfoCliente from "./InfoCliente";
import AgregarCliente from "./AgregarCliente";

const baseUrl = "http://192.168.0.7:5173";
const path = "/registro";

const TablaClientes = ({ config }) => {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [clienteEditando, setClienteEditando] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openQr, setOpenQr] = useState(false);
  const [openDetalles, setOpenDetalles] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState(false);
  const [imagenVistaPrevia, setImagenVistaPrevia] = useState(null);
  const [imagenArchivo, setImagenArchivo] = useState(null);

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
      setClienteEditando({ ...cliente, imagen: cliente.imagen || null });
      setImagenVistaPrevia(cliente.imagen || null);
      setNuevoCliente(false);
      setImagenArchivo(null); // Reset archivo
    } else {
      setClienteEditando({ nombre: "", telefono: "", email: "", imagen: null });
      setImagenVistaPrevia(null);
      setNuevoCliente(true);
      setImagenArchivo(null); // Reset archivo
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
        if (data.error) {
          alert(data.error); // Mostrar mensaje de error al usuario
        } else {
          fetchClientes(); // Recargar la lista de clientes si la eliminación fue exitosa
        }
      } catch (error) {
        console.error("Error al guardar cliente:", error);
      }
    }
  };

  const manejarCambioArchivo = (evento) => {
    const archivo = evento.target.files[0];

    if (archivo) {
      Resizer.imageFileResizer(
        archivo,
        500,
        500,
        "JPEG",
        80,
        0,
        (uri) => {
          setImagenVistaPrevia(uri);
          // Convertir la URI base64 a un objeto File
          const archivoRedimensionado = base64ToFile(uri, archivo.name);
          setImagenArchivo(archivoRedimensionado);
        },
        "base64"
      );
    }
  };

  // Función para convertir URI base64 a objeto File
  const base64ToFile = (base64String, filename) => {
    let arr = base64String.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
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

      const checarCorreo = await verificarCorreo(clienteEditando.email);

      if (checarCorreo.length > 0) {
        alert("El correo ya existe!");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("nombre", clienteEditando.nombre);
        formData.append("telefono", clienteEditando.telefono);
        formData.append("email", clienteEditando.email);
        formData.append("imagen", imagenArchivo); // Enviar el archivo de imagen

        const response = await fetch(
          "http://192.168.0.7/gimnasio/backend/controladores/ClienteController.php?action=guardar",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        console.log(data);
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
        const formData = new FormData();
        formData.append("id", clienteEditando.id); // Incluir el ID del cliente
        formData.append("nombre", clienteEditando.nombre);
        formData.append("telefono", clienteEditando.telefono);
        formData.append("email", clienteEditando.email);
        if (imagenArchivo) {
          formData.append("imagen", imagenArchivo); // Enviar el archivo de imagen si se seleccionó
        }

        const response = await fetch(
          "http://192.168.0.7/gimnasio/backend/controladores/ClienteController.php?action=editar",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        console.log(data);
        fetchClientes();
      } catch (error) {
        console.error("Error al editar cliente:", error);
      }
    }

    setOpenDialog(false);
  };

  const detalleCliente = (cliente) => {
    setClienteEditando(cliente);
    setOpenDetalles(true);
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: { sx: { textTransform: "upperCase" } },
    },
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
        sx: { textTransform: "upperCase", textAlign: "center" },
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
      accessorKey: "img",
      header: "Imagen",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        sx: { textTransform: "upperCase", textAlign: "center" },
      },
    },

    {
      header: "Acciones",
      muiTableHeadCellProps: {
        align: "center",
      },
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
          <Button
            variant="contained"
            color="white"
            size="small"
            onClick={() => detalleCliente(row.original)}
          >
            <VisibilityOutlinedIcon />
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
        sx={{ marginBottom: 2, marginRight: 2 }}
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
          columnVisibility: { id: false, img: false },
        }}
        enablePagination={true}
        enableColumnFilters={true}
        enableGlobalFilter={true}
        state={{ globalFilter: filtro }}
        onGlobalFilterChange={setFiltro}
        localization={MRT_Localization_ES}
      />

      {/* 📝 Modal de Edición o Creación de clientes */}
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
          <Input type="file" accept="image/*" onChange={manejarCambioArchivo} />
          {imagenVistaPrevia && (
            <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
              <img
                src={imagenVistaPrevia}
                alt="Vista previa de la imagen"
                style={{ maxWidth: "400px", marginRight: 1 }}
              />
              <IconButton onClick={() => setImagenVistaPrevia(null)}>
                <ClearIcon />
              </IconButton>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleGuardarCliente} color="primary">
            {nuevoCliente ? "Crear" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Ventana para QR */}
      <Dialog open={openQr} onClose={() => setOpenQr(false)}>
        <DialogTitle sx={{ textAlign: "center" }}>NUEVO CLIENTE</DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
          <QRCodeCanvas value={`${baseUrl}${path}`} size={200} />
        </DialogContent>
      </Dialog>
      {/* Ventana para detalles de cliente */}
      <Dialog open={openDetalles} onClose={() => setOpenDetalles(false)}>
        <DialogContent>
          <InfoCliente cliente={clienteEditando} config={config} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TablaClientes;
