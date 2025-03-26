import { useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";

const AgregarCliente = ({ agregarCliente }) => {
  const [cliente, setCliente] = useState({
    nombre: "",
    telefono: "",
    email: "",
  });

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cliente.nombre || !cliente.telefono || !cliente.email) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const respuesta = agregarCliente(cliente);

    if (respuesta) {
      alert('Cliente registrado')
      setCliente({
        nombre: "",
        telefono: "",
        email: "",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{ mt: 2, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Agregar Cliente
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Agregar Cliente
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AgregarCliente;
