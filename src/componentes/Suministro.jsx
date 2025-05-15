import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Autocomplete,
} from "@mui/material";
import { IP } from "../Utileria";
import dayjs from "dayjs";

const Suministro = ({ setRecargar }) => {
  const [producto, setProducto] = useState({
    id: null,
    cantidad: 0,
    descuento: 0,
  });
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL_LOCAL
        }/backend/controladores/StockController.php?action=listar`
      );
      const data = await response.json();
      setProductos(data);
      return data;
    } catch (error) {
      console.error("Error al obtener membresías:", error);
    }
  };

  const [imagenVistaPrevia, setImagenVistaPrevia] = useState(null);

  const handleChange = async (e) => {
    const { name, value } = e.target;

    let newState = {
      ...producto,
      [name]: value,
    };

    setProducto(newState);

    const datosProducto = productos.find((p) => p.id === newState.id);
    if (datosProducto?.img == null || datosProducto === undefined) {
      setImagenVistaPrevia(null);
    } else {
      setImagenVistaPrevia(datosProducto.img);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (producto.id == null) {
      alert("Seleccione un producto porfavor!");
      return;
    }

    const respuesta = await suministrarProducto(producto);
    if (respuesta) {
      alert("Suministro registrado!");
      setProducto({
        id: null,
        cantidad: 0,
        descuento: 0,
      });
      setRecargar(true);
    }
  };

  async function suministrarProducto(producto) {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL_LOCAL
        }/backend/controladores/VentaController.php?action=suministrar`,
        {
          method: "POST",
          body: JSON.stringify({
            productos: [producto],
            fecha_venta: dayjs().format("YYYY-MM-DD H:mm:ss"),
            total: 0,
          }),
        }
      );
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Error al suministrar producto:", error);
      return false;
    }
  }

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
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Registrar Suministro
        </Typography>
        <form onSubmit={handleSubmit}>
          <Autocomplete
            fullWidth
            options={productos}
            getOptionLabel={(option) => option.nombre_producto}
            onChange={(event, newValue) =>
              handleChange({
                target: {
                  name: "id",
                  value: newValue ? newValue.id : "",
                },
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Productos" margin="normal" />
            )}
          />
          <div className="d-flex gap-2">
            <TextField
              fullWidth
              label="Cantidad"
              name="cantidad"
              value={producto.cantidad}
              onChange={handleChange}
              margin="normal"
              type="number"
            />
            <TextField
              fullWidth
              label="Descuento"
              name="descuento"
              value={producto.descuento}
              onChange={handleChange}
              margin="normal"
              type="number"
            />
          </div>

          <div className="text-center mt-3">
            {imagenVistaPrevia ? (
              <img
                src={`./backend/img_productos/${imagenVistaPrevia}`}
                alt="Vista previa de la imagen"
                style={{ maxWidth: "90px" }}
              />
            ) : (
              <img
                src="./backend/img_productos/no-product.png"
                alt="Imagen no disponible"
                style={{ maxWidth: "90px" }}
              />
            )}
          </div>
          <div className="text-end">
            <Button
              type="submit"
              variant="contained"
              color="warning"
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

export default Suministro;
