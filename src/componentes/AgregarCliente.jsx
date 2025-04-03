import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import Resizer from "react-image-file-resizer";
import { verificarCorreo } from "../Utileria";

const AgregarCliente = () => {
  const [cliente, setCliente] = useState({
    nombre: "",
    telefono: "",
    email: "",
    imagen: null, // Agregamos el estado para la imagen
  });
  const [imagenVistaPrevia, setImagenVistaPrevia] = useState(null);
  const [imagenArchivo, setImagenArchivo] = useState(null);

  const handleChange = (e) => {
    setCliente({
      ...cliente,
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

  async function registrarCliente(cliente) {
    try {
      const formData = new FormData();
      formData.append("nombre", cliente.nombre);
      formData.append("telefono", cliente.telefono);
      formData.append("email", cliente.email);
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
    } catch (error) {
      console.error("Error al guardar cliente:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cliente.nombre || !cliente.telefono || !cliente.email) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const checarCorreo = await verificarCorreo(cliente.email);

    if (checarCorreo.length > 0) {
      alert("El correo ya existe!");
      return;
    }

    const respuesta = registrarCliente(cliente);

    if (respuesta) {
      alert("Cliente registrado");
      setCliente({
        nombre: "",
        telefono: "",
        email: "",
      });
      setImagenVistaPrevia(null);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{ mt: 2, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}
      >
        <Typography variant="h5" sx={{ mb: 2, textAlign:'center' }}>
          Registrar Datos
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            value={cliente.nombre}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Teléfono"
            name="telefono"
            value={cliente.telefono}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Correo Electrónico"
            name="email"
            value={cliente.email}
            onChange={handleChange}
            margin="normal"
            type="email"
            required
          />
          <input type="file" accept="image/*" onChange={manejarCambioArchivo} />
          {imagenVistaPrevia && (
            <img
              src={imagenVistaPrevia}
              alt="Vista previa de la imagen"
              style={{ maxWidth: "300px" }}
            />
          )}
          <div className="text-center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
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

export default AgregarCliente;
