import React, { useState, useRef, useEffect } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import Resizer from "react-image-file-resizer";
import { IP, verificarCorreo } from "../Utileria";
import { toJpeg } from "html-to-image";
import { QRCodeCanvas } from "qrcode.react";

const AgregarCliente = () => {
  const [cliente, setCliente] = useState({
    nombre: "",
    telefono: "",
    email: "",
  });

  const [config, setConfig] = useState(null);

  const verificarConfig = async () => {
    const response = await fetch(
      `http://${IP}/gimnasio/backend/controladores/ConfiguracionController.php?action=listar`
    );
    const respuesta = await response.json();
    const datos = respuesta[respuesta.length - 1];
    return datos;
  };

  const [imagenVistaPrevia, setImagenVistaPrevia] = useState(null);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const componentRef = useRef(null);
  const [credencialData, setCredencialData] = useState(null);

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

  async function registrarCliente(cliente) {
    try {
      const formData = new FormData();
      formData.append("nombre", cliente.nombre);
      formData.append("telefono", cliente.telefono);
      formData.append("email", cliente.email);
      formData.append("imagen", imagenArchivo);

      const response = await fetch(
        `http://${IP}/gimnasio/backend/controladores/ClienteController.php?action=guardar`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      return false;
    }
  }

  const descargarCredencial = async () => {
    if (componentRef.current && credencialData) {
      try {
        const dataUrl = await toJpeg(componentRef.current, { quality: 0.95 });
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `credencial-${credencialData.nombre}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error al generar la imagen:", error);
      }
    } else {
      console.log("componentRef no está disponible o credencialData es null"); // <---- AGREGAR ESTO
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cliente.nombre || !cliente.telefono) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const checarCorreo = await verificarCorreo(cliente.email);

    if (checarCorreo.length > 0) {
      alert("El correo ya existe!");
      return;
    }

    const respuesta = await registrarCliente(cliente);
    console.log(respuesta);
    if (respuesta) {
      setCredencialData({ ...cliente });
       setCliente({
        nombre: "",
        telefono: "",
        email: "",
      });
      setImagenVistaPrevia(null);
      setImagenArchivo(null)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const datos = await verificarConfig();
      setConfig(datos);
    };
    if (credencialData && componentRef.current) {
      console.log("useEffect: Intentando descargar credencial");
      descargarCredencial();
    } else {
      console.log(
        "useEffect: credencialData o componentRef aún no están listos"
      );
    }
    fetchData();
  }, [credencialData, componentRef]);

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

      {/* Plantilla de la credencial */}
      {credencialData && (
        <div
          ref={componentRef}
          className="card p-4 text-center border rounded"
          style={{
            width: "300px",
            height: "450px",
            backgroundColor: "#d2dada",
            textTransform: "uppercase",
          }}
        >
          <div className="card-body">
            <h3 className="card-title text-danger">{config?.razon}</h3>
            <div
              className="rounded-circle overflow-hidden border border-3 border-white my-3 mx-auto"
              style={{ width: "150px", height: "150px" }}
            >
              <img
                src={
                  `/backend/img_clientes/${config.img}` ||
                  "/backend/img_clientes/logo_ejemplo.png"
                }
                alt="cliente Profile"
                className="w-100 h-100 object-fit-cover"
              />
            </div>
            <h5 className="card-title">{credencialData.nombre}</h5>
            <p className="card-text text-muted">{credencialData.telefono}</p>
            <div className="mt-4 d-flex justify-content-center">
              <QRCodeCanvas
                value={credencialData.telefono}
                size={70}
                bgColor="#ffffff"
                fgColor="#001256"
                level="Q"
              />
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default AgregarCliente;
