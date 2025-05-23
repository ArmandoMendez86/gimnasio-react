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
import { formatearCantidad } from "../Utileria";

const TablaMembresias = () => {
  const [membresias, setMembresias] = useState([]);
  const [filtro, setFiltro] = useState(""); // Filtro para búsqueda
  const [tipoMembresia, setTipoMembresia] = useState(null); // Cliente que estamos editando o creando
  const [openDialog, setOpenDialog] = useState(false); // Estado para abrir/cerrar el modal
  const [nuevaMembresia, setNuevaMembresia] = useState(false); // Estado para determinar si es nuevo o edición

  useEffect(() => {
    fetchMembresias();
  }, []);

  const fetchMembresias = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL_LOCAL
        }/backend/controladores/MembresiaController.php?action=listar`
      );
      const data = await response.json();
      setMembresias(data);
    } catch (error) {
      console.error("Error al obtener membresías:", error);
    }
  };

  const handleAbrirDialog = (membresia = null) => {
    if (membresia) {
      setTipoMembresia(membresia);
      setNuevaMembresia(false);
    } else {
      setTipoMembresia(membresia);
      setNuevaMembresia(true);
    }
    setOpenDialog(true);
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar esta membresía?"
    );
    if (confirmar) {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL_LOCAL
          }/backend/controladores/MembresiaController.php?action=eliminar`,
          {
            method: "POST",
            body: JSON.stringify(id),
          }
        );
        const data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          fetchMembresias();
        }
      } catch (error) {
        console.error("Error al guardar cliente:", error);
      }
    }
  };

  const handleGuardarMembresia = async () => {
    if (nuevaMembresia) {
      if (tipoMembresia === null) return;

      if (
        !tipoMembresia.tipo ||
        tipoMembresia.tipo.trim() === "" ||
        !tipoMembresia.precio ||
        tipoMembresia.precio.trim() === ""
      ) {
        alert("El tipo y precio no pueden estar vacíos.");
        return;
      }

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL_LOCAL
          }/backend/controladores/MembresiaController.php?action=guardar`,
          {
            method: "POST",
            body: JSON.stringify(tipoMembresia),
          }
        );
        const data = await response.json();

        fetchMembresias();
      } catch (error) {
        console.error("Error al guardar membresía:", error);
      }
    } else {
      if (
        !tipoMembresia.tipo ||
        tipoMembresia.tipo.trim() === "" ||
        !tipoMembresia.precio ||
        tipoMembresia.precio.trim() === ""
      ) {
        alert("El tipo y precio no pueden estar vacíos.");
        return;
      }
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL_LOCAL
          }/backend/controladores/MembresiaController.php?action=editar`,
          {
            method: "POST",
            body: JSON.stringify(tipoMembresia),
          }
        );
        const data = await response.json();

        fetchMembresias();
      } catch (error) {
        console.error("Error al guardar membresía:", error);
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
      accessorKey: "tipo",
      header: "Tipo",
    },
    {
      accessorKey: "precio",
      header: "Precio",

      Cell: ({ cell }) => formatearCantidad(cell.getValue()),
    },
    {
      accessorKey: "duracion_dias",
      header: "Duración/Días",
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
        Nueva
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
          data={membresias}
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
          {nuevaMembresia ? "Registrar Membresía" : "Editar Membresía"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tipo"
            fullWidth
            margin="dense"
            value={tipoMembresia?.tipo || ""}
            onChange={(e) =>
              setTipoMembresia({ ...tipoMembresia, tipo: e.target.value })
            }
          />
          <TextField
            label="Precio"
            fullWidth
            margin="dense"
            type="number"
            value={tipoMembresia?.precio || ""}
            onChange={(e) =>
              setTipoMembresia({ ...tipoMembresia, precio: e.target.value })
            }
          />
          <TextField
            label="Duración/Días"
            fullWidth
            margin="dense"
            value={tipoMembresia?.duracion_dias || ""}
            onChange={(e) =>
              setTipoMembresia({
                ...tipoMembresia,
                duracion_dias: e.target.value,
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
            onClick={handleGuardarMembresia}
            variant="contained"
            color="warning"
          >
            {nuevaMembresia ? "Crear" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TablaMembresias;
