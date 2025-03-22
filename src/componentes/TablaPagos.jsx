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

const TablaPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [filtro, setFiltro] = useState("");

  

  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    try {
      const response = await fetch(
        "http://localhost/gimnasio/backend/controladores/PagoController.php?action=listar"
      );
      const data = await response.json();
      
      setPagos(data);
    } catch (error) {
      console.error("Error al obtener pagos:", error);
    }
  };

  const columns = [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "telefono", header: "Teléfono" },
    { accessorKey: "email", header: "Correo" },
    { accessorKey: "tipo", header: "Membresía" },
    { accessorKey: "fecha_inicio", header: "Inicia" },
    { accessorKey: "fecha_fin", header: "Termina" },
    { accessorKey: "fecha_pago", header: "Pagó" },
    { accessorKey: "metodo_pago", header: "Modo" },
    { accessorKey: "estatus", header: "Estatus" },
  ];

  return (
    <Box sx={{ padding: 2, textAlign: "right" }}>
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
    </Box>
  );
};

export default TablaPagos;
