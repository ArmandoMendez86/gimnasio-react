import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import Resizer from "react-image-file-resizer";
import { IP } from "../Utileria";

const AgregarProducto = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    cantidad: 0,
    precio: 0,
  });

  const [imagenVistaPrevia, setImagenVistaPrevia] = useState(null);
  const [imagenArchivo, setImagenArchivo] = useState(null);

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
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

  async function registrarProducto(producto) {
    try {
      const formData = new FormData();
      formData.append("nombre", producto.nombre);
      formData.append("descripcion", producto.descripcion);
      formData.append("cantidad", producto.cantidad);
      formData.append("precio", producto.precio);
      formData.append("imagen", imagenArchivo);

      const response = await fetch(
        `http://${IP}/gimnasio/backend/controladores/StockController.php?action=guardar`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log(data);
      return data.success;
    } catch (error) {
      console.error("Error al guardar producto:", error);
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!producto.nombre || !producto.descripcion) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const respuesta = await registrarProducto(producto);

    if (respuesta) {
      alert("Producto registrado");

      setProducto({
        nombre: "",
        descripcion: "",
        cantidad: 0,
        precio: 0,
      });
      setImagenVistaPrevia(null);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
      <Box
        sx={{
          mt: 2,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "white",
          width: "400px",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Registrar Datos
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Producto"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Cantidad"
            name="cantidad"
            value={producto.cantidad}
            onChange={handleChange}
            margin="normal"
            type="number"
            required
          />
          <TextField
            fullWidth
            label="Precio"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            margin="normal"
            type="number"
            required
          />
          <input type="file" accept="image/*" onChange={manejarCambioArchivo} />
          <div className="text-center mt-3">
            {imagenVistaPrevia && (
              <img
                src={imagenVistaPrevia}
                alt="Vista previa de la imagen"
                style={{ maxWidth: "100px" }}
              />
            )}
          </div>
          <div className="text-end">
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
            >
              Guardar
            </Button>
          </div>
        </form>
      </Box>
    </Container>
  );
};

export default AgregarProducto;
