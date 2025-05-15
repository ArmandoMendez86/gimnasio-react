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
  Input,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import { QRCodeCanvas } from "qrcode.react";
import { IP } from "../Utileria";
import Resizer from "react-image-file-resizer";
import AgregarProducto from "./AgregarProducto";

const baseUrl = `${import.meta.env.VITE_BASE_URL_LOCAL}`;
const path = "/registro-producto";

const TablaStock = ({ recargar }) => {
  const [stock, setStock] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [producto, setProducto] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openQr, setOpenQr] = useState(false);
  const [openDetalles, setOpenDetalles] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState(false);
  const [imagenVistaPrevia, setImagenVistaPrevia] = useState(null);
  const [imagenArchivo, setImagenArchivo] = useState(null);

  useEffect(() => {
    fetchStock();
  }, [recargar]);

  const fetchStock = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL_LOCAL}/backend/controladores/StockController.php?action=listar`
      );
      const data = await response.json();
      setStock(data);
    } catch (error) {
      console.error("Error al obtener el stock:", error);
    }
  };

  const handleAbrirDialog = (producto = null) => {
    if (producto) {
      setProducto({ ...producto, img: producto.img || null });
      setImagenVistaPrevia(
        producto.img ? `./backend/img_productos/${producto.img}` : ""
      );
      setNuevoProducto(false);
      setImagenArchivo(null); // Reset archivo
    } else {
      setProducto({
        nombre_producto: "",
        descripcion: "",
        cantidad: null,
        precio_unitario: null,
      });
      setImagenVistaPrevia(null);
      setNuevoProducto(true);
      setImagenArchivo(null);
    }
    setOpenDialog(true);
  };

  const handleEliminar = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );
    if (confirmar) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL_LOCAL}/backend/controladores/StockController.php?action=eliminar`,
          {
            method: "POST",
            body: JSON.stringify(id),
          }
        );
        const data = await response.json();
        if (data.error) {
          alert(data.error);
        } else {
          fetchStock();
        }
      } catch (error) {
        console.error("Error al guardar producto:", error);
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
          const archivoRedimensionado = base64ToFile(uri, archivo.name);
          setImagenArchivo(archivoRedimensionado);
        },
        "base64"
      );
    }
  };

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

  const handleGuardarProducto = async () => {
    if (nuevoProducto) {
      if (producto === null) return;

      if (
        !producto.nombre_producto ||
        producto.nombre_producto.trim() === "" ||
        !producto.descripcion ||
        producto.descripcion.trim() === "" ||
        !producto.cantidad ||
        !producto.precio_unitario
      ) {
        alert("El nombre y descripción no pueden estar vacíos.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("nombre", producto.nombre_producto);
        formData.append("descripcion", producto.descripcion);
        formData.append("cantidad", producto.cantidad);
        formData.append("precio", producto.precio_unitario);
        formData.append("imagen", imagenArchivo);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL_LOCAL}/backend/controladores/StockController.php?action=guardar`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        fetchStock();
      } catch (error) {
        console.error("Error al guardar producto:", error);
      }
    } else {
      if (
        !producto.nombre_producto ||
        producto.nombre_producto.trim() === "" ||
        !producto.descripcion ||
        producto.descripcion.trim() === "" ||
        !producto.cantidad ||
        !producto.precio_unitario
      ) {
        alert("El nombre y descripcion no pueden estar vacíos.");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("id", producto.id);
        formData.append("nombre", producto.nombre_producto);
        formData.append("descripcion", producto.descripcion);
        formData.append("cantidad", producto.cantidad);
        formData.append("precio", producto.precio_unitario);
        if (imagenArchivo) {
          formData.append("imagen", imagenArchivo);
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_URL_LOCAL}/backend/controladores/StockController.php?action=editar`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        fetchStock();
      } catch (error) {
        console.error("Error al editar producto:", error);
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
      accessorKey: "nombre_producto",
      header: "Producto",
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
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
      accessorKey: "img",
      header: "Imagen",
      Cell: ({ cell }) => (
        <img
          src={
            cell.getValue() !== null
              ? `./backend/img_productos/${cell.getValue()}`
              : "./backend/img_productos/no-product.png"
          }
          alt={`Imagen de ${cell.row.original.nombre_producto}`}
          style={{ width: "70px", height: "70px", objectFit: "cover" }}
        />
      ),
    },

    {
      header: "Acciones",

      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Button
            data-bs-toggle="tooltip"
            title="Editar Producto"
            variant="contained"
            color="white"
            size="small"
            onClick={() => handleAbrirDialog(row.original)}
          >
            <EditIcon />
          </Button>
          <Button
            data-bs-toggle="tooltip"
            title="Eliminar Producto"
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
        sx={{ marginBottom: 2, marginRight: 2 }}
        onClick={() => handleAbrirDialog()}
        startIcon={<SaveIcon />}
      >
        Nuevo
      </Button>
      <Button
        variant="contained"
        color="warning"
        sx={{ marginBottom: 2 }}
        onClick={() => setOpenQr(true)}
        startIcon={<SaveIcon />}
      >
        QR
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
          data={stock}
          initialState={{
            pagination: { pageSize: 5 },
            columnVisibility: { id: false },
          }}
          enablePagination={true}
          enableColumnFilters={true}
          localization={MRT_Localization_ES}
          muiTableBodyCellProps={({ column, cell }) => {
            return {
              sx: {
                padding: "4px 8px",
                fontSize: "14px",
                ...(column.id === "cantidad" && {
                  textAlign: "center",
                  fontWeight: "bold",
                  color:'#07874c'
                }),
                ...(column.id === "precio_unitario" && {
                  backgroundColor: "#2c2c2c",
                  color: "#ff6600",
                  fontWeight: "bold",
                  textAlign: "center",
                }),
                ...(column.id === "img" && {
                  textAlign: "center",
                }),
                backgroundColor: "#d8dfe6",
              },
            };
          }}
          muiTableHeadCellProps={{
            align: "center",
            sx: {
              padding: "4px 8px",
              textTransform: "uppercase",
              fontSize: "13px",
              fontWeight: "bold",
              color:'white',  
              backgroundColor: "#343a40",
            },
          }}
        />
      </div>

      {/* 📝 Modal de Edición o Creación de productos */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {nuevoProducto ? "Registrar Producto" : "Editar Producto"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Producto"
            fullWidth
            margin="dense"
            value={producto?.nombre_producto || ""}
            onChange={(e) =>
              setProducto({ ...producto, nombre_producto: e.target.value })
            }
          />
          <TextField
            label="Descripción"
            fullWidth
            margin="dense"
            value={producto?.descripcion || ""}
            onChange={(e) =>
              setProducto({
                ...producto,
                descripcion: e.target.value,
              })
            }
          />
          <TextField
            disabled
            label="Cantidad"
            fullWidth
            type="number"
            margin="dense"
            value={producto?.cantidad || ""}
            onChange={(e) =>
              setProducto({ ...producto, cantidad: e.target.value })
            }
          />
          <TextField
            label="Precio"
            fullWidth
            type="number"
            margin="dense"
            value={producto?.precio_unitario || ""}
            onChange={(e) =>
              setProducto({ ...producto, precio_unitario: e.target.value })
            }
          />
          <Input type="file" accept="image/*" onChange={manejarCambioArchivo} />
          {imagenVistaPrevia && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 1,
              }}
            >
              <img
                src={imagenVistaPrevia}
                alt="Vista previa de la imagen"
                style={{ maxWidth: "200px", marginRight: 1 }}
              />

              <IconButton onClick={() => setImagenVistaPrevia(null)}>
                <ClearIcon />
              </IconButton>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(false)}
            color="warning"
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleGuardarProducto}
            color="warning"
          >
            {nuevoProducto ? "Crear" : "Guardar"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Ventana para QR */}
      <Dialog open={openQr} onClose={() => setOpenQr(false)}>
        <DialogTitle sx={{ textAlign: "center" }}>Escanee el QR</DialogTitle>
        <DialogContent sx={{ display: "flex", justifyContent: "center" }}>
          <QRCodeCanvas value={`${baseUrl}${path}`} size={200} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TablaStock;
