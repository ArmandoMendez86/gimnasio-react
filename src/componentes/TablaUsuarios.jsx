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
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Add";
import { formatearCantidad } from "../Utileria";

const TablaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [tipoUsuario, setTipoUsuario] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL_LOCAL
        }/backend/controladores/LoginController.php?action=listar`
      );
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleAbrirDialog = (usuario = null) => {
    if (usuario) {
      usuario.password = "";
      setTipoUsuario(usuario);
      setNuevoUsuario(false);
    } else {
      setTipoUsuario(usuario);
      setNuevoUsuario(true);
    }
    setOpenDialog(true);
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (confirmar) {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL_LOCAL
          }/backend/controladores/LoginController.php?action=eliminar`,
          {
            method: "POST",
            body: JSON.stringify(id),
          }
        );
        const data = await response.json();
        if (data.success) {
          alert("Usuario eliminado!");
          fetchUsuarios();
        }
      } catch (error) {
        console.error("Error al guardar cliente:", error);
      }
    }
  };

  const handleGuardarUsuario = async () => {
    if (nuevoUsuario) {
      if (tipoUsuario === null) return;

      if (
        !tipoUsuario.nombre ||
        tipoUsuario.nombre.trim() === "" ||
        !tipoUsuario.apellido ||
        tipoUsuario.apellido.trim() === "" ||
        !tipoUsuario.password ||
        tipoUsuario.password.trim() === "" ||
        !tipoUsuario.email ||
        tipoUsuario.email.trim() === ""
      ) {
        alert(
          "El nombre, apellido, email y contraseña no pueden estar vacíos."
        );
        return;
      }

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL_LOCAL
          }/backend/controladores/LoginController.php?action=guardar`,
          {
            method: "POST",
            body: JSON.stringify(tipoUsuario),
          }
        );
        const data = await response.json();

        fetchUsuarios();
      } catch (error) {
        console.error("Error al guardar usuario:", error);
      }
    } else {
      if (
        !tipoUsuario.nombre ||
        tipoUsuario.nombre.trim() === "" ||
        !tipoUsuario.apellido ||
        tipoUsuario.apellido.trim() === "" ||
        !tipoUsuario.email ||
        tipoUsuario.email.trim() === ""
      ) {
        alert(
          "El nombre, apellido, email y contraseña no pueden estar vacíos."
        );
        return;
      }
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL_LOCAL
          }/backend/controladores/LoginController.php?action=editar`,
          {
            method: "POST",
            body: JSON.stringify(tipoUsuario),
          }
        );
        const data = await response.json();

        fetchUsuarios();
      } catch (error) {
        console.error("Error al guardar usuario:", error);
      }
    }

    setOpenDialog(false);
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "apellido",
      header: "Apellido",
    },
    {
      accessorKey: "email",
      header: "Correo",
    },
    {
      accessorKey: "perfil",
      header: "Perfil",
    },

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
        color="warning"
        sx={{ marginBottom: 2 }}
        onClick={() => handleAbrirDialog()}
        startIcon={<SaveIcon />}
      >
        Usuario
      </Button>

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
          data={usuarios}
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
              ...(column.id === "precio" && {
                color: "#ff6600",
                fontWeight: "bold",
                textAlign: "center",
              }),
              ...(column.id === "tipo" && {
                textAlign: "center",
              }),
              ...(column.id === "duracion_dias" && {
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
        />
      </div>

      {/* 📝 Modal de Edición o Creación */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {nuevoUsuario ? "Registrar Usuario" : "Editar Usuario"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={tipoUsuario?.nombre || ""}
            onChange={(e) =>
              setTipoUsuario({ ...tipoUsuario, nombre: e.target.value })
            }
          />
          <TextField
            label="Apellido"
            fullWidth
            margin="dense"
            value={tipoUsuario?.apellido || ""}
            onChange={(e) =>
              setTipoUsuario({ ...tipoUsuario, apellido: e.target.value })
            }
          />
          <TextField
            label="Correo"
            fullWidth
            margin="dense"
            value={tipoUsuario?.email || ""}
            onChange={(e) =>
              setTipoUsuario({
                ...tipoUsuario,
                email: e.target.value,
              })
            }
          />
          <InputLabel id="perfil-label">Perfil</InputLabel>
          <Select
            fullWidth
            labelId="perfil-label"
            value={tipoUsuario?.perfil || ""}
            label="Perfil"
            onChange={(e) =>
              setTipoUsuario({
                ...tipoUsuario,
                perfil: e.target.value,
              })
            }
          >
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="vendedor">Vendedor</MenuItem>
          </Select>
          <TextField
            label="Contraseña"
            fullWidth
            margin="dense"
            type="password"
            value={tipoUsuario?.password || ""}
            onChange={(e) =>
              setTipoUsuario({
                ...tipoUsuario,
                password: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setOpenDialog(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleGuardarUsuario}
            variant="contained"
            color="warning"
          >
            {nuevoUsuario ? "Crear" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TablaUsuarios;
