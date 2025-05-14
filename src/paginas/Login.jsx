import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí va tu lógica de autenticación
    console.log("Iniciando sesión con", form);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            backgroundColor: "#1e1e1e",
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{ color: "white", mb: 3, fontWeight: "bold" }}
          >
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo electrónico"
              variant="outlined"
              name="email"
              value={form.email}
              onChange={handleChange}
              sx={{
                mb: 2,
                input: { color: "white" },
                label: { color: "#888" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#00715D",
                  },
                  "&:hover fieldset": {
                    borderColor: "#00a37a",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00a37a",
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              variant="outlined"
              name="password"
              value={form.password}
              onChange={handleChange}
              sx={{
                mb: 3,
                input: { color: "white" },
                label: { color: "#888" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#00715D",
                  },
                  "&:hover fieldset": {
                    borderColor: "#00a37a",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#00a37a",
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#00715D",
                "&:hover": {
                  backgroundColor: "#00a37a",
                },
              }}
            >
              Entrar
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
