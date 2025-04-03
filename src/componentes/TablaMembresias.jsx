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
        "http://192.168.0.7/gimnasio/backend/controladores/MembresiaController.php?action=listar"
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
          "http://192.168.0.7/gimnasio/backend/controladores/MembresiaController.php?action=eliminar",
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
          "http://192.168.0.7/gimnasio/backend/controladores/MembresiaController.php?action=guardar",
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
          "http://192.168.0.7/gimnasio/backend/controladores/MembresiaController.php?action=editar",
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
      muiTableHeadCellProps: {
        align: "center", // Centrar el encabezado
      },
      muiTableBodyCellProps: {
        sx: {
          textAlign: "center",
          textTransform: "upperCase",
        },
      },
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
      muiTableHeadCellProps: {
        align: "center", // Centrar el encabezado
      },
      muiTableBodyCellProps: {
        sx: {
          textAlign: "center",
          textTransform: "upperCase",
        },
      },
    },
    {
      accessorKey: "precio",
      header: "Precio",
      muiTableHeadCellProps: {
        align: "center", // Centrar el encabezado
      },
      muiTableBodyCellProps: {
        sx: {
          textAlign: "center",
          textTransform: "upperCase",
        },
      },
      Cell: ({ cell }) =>
        new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(cell.getValue()),
    },
    {
      accessorKey: "duracion_dias",
      header: "Duración/Días",
      muiTableHeadCellProps: {
        align: "center", // Centrar el encabezado
      },
      muiTableBodyCellProps: {
        sx: {
          textAlign: "center",
          textTransform: "upperCase",
        },
      },
    },

    {
      header: "Acciones",
      muiTableHeadCellProps: {
        align: "center", // Centrar el encabezado
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
        sx={{ marginBottom: 2 }}
        onClick={() => handleAbrirDialog()}
        startIcon={<SaveIcon />}
      >
        Nueva
      </Button>

      {/* 📋 Tabla con paginación y filtros */}
      <MaterialReactTable
        columns={columns}
        data={membresias}
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
        muiTableHeadCellProps={{
          sx: {
            textTransform: "uppercase",
            fontWeight: "bold",
          },
        }}
      />

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
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleGuardarMembresia} color="primary">
            {nuevaMembresia ? "Crear" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TablaMembresias;
