import { useRef, useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import Resizer from "react-image-file-resizer";
import Upload from "@mui/icons-material/Upload";

const Configuracion = () => {
  const [config, setConfig] = useState({
    razon: "",
  });
  const [imagenVistaPrevia, setImagenVistaPrevia] = useState(null);
  const [imagenArchivo, setImagenArchivo] = useState(null);
  const archivoInputRef = useRef(null);

  const handleChange = (e) => {
    setConfig({
      ...config,
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

  async function registrarConfig(configuracion) {
    try {
      const formData = new FormData();
      formData.append("razon", configuracion.razon);
      formData.append("imagen", imagenArchivo);

      const response = await fetch(
        "http://192.168.0.7/gimnasio/backend/controladores/ConfiguracionController.php?action=guardar",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar configuracion:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!config.razon) {
      alert("Nombre de gimnasio requerido!");
      return;
    }

    const respuesta = registrarConfig(config);

    if (respuesta) {
      alert("Configuración registrada");
      setConfig({
        razon: "",
      });
      setImagenVistaPrevia(null);
      setImagenArchivo(null);
      archivoInputRef.current.value = "";
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{ mt: 2, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}
      >
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Datos del Negocio
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Razón social"
            name="razon"
            value={config.razon}
            onChange={handleChange}
            margin="normal"
            required
          />

          <div>
            <label
              htmlFor="archivoInput"
              style={{
                display: "inline-block",
                padding: "10px 20px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              <Upload /> Subir Logo
              <input
                type="file"
                accept="image/*"
                onChange={manejarCambioArchivo}
                ref={archivoInputRef}
                id="archivoInput"
                style={{ display: "none" }} // Oculta el input real
              />
            </label>
          </div>
          <div className="text-center mt-4">
            {imagenVistaPrevia && (
              <img
                src={imagenVistaPrevia}
                alt="Vista previa de la imagen"
                style={{ maxWidth: "200px" }}
              />
            )}
          </div>
          <div className="text-end">
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

export default Configuracion;
