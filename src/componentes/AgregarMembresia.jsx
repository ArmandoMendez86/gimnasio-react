import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  styled,
  Input,
} from "@mui/material";
import dayjs from "dayjs";


const AgregarMembresia = ({ agregarMembresia }) => {
  const [registroMembresia, setRegistroMembresia] = useState({
    id_cliente: "",
    id_membresia: "",
    fecha_inicio: "",
    fecha_fin: "",
  });
  const [clientes, setClientes] = useState([]);
  const [tiposMembresia, setTiposMembresia] = useState([]);

  useEffect(() => {
    fetchClientes();
    fetchMembresias();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch(
        "http://192.168.0.7/gimnasio/backend/controladores/ClienteController.php?action=listar"
      );
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const fetchMembresias = async () => {
    try {
      const response = await fetch(
        "http://192.168.0.7/gimnasio/backend/controladores/MembresiaController.php?action=listar"
      );
      const data = await response.json();
      setTiposMembresia(data);
      return data;
    } catch (error) {
      console.error("Error al obtener membresías:", error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Nueva actualización del estado
    let newState = {
      ...registroMembresia,
      [name]: value,
    };

    const membresias = await fetchMembresias();
    const tipoMembresia = membresias.find((tipo) => tipo.id == value);

    // Si el campo cambiado es "id_membresia"
    if (name === "id_membresia") {
      const fechaInicio = dayjs().format("YYYY-MM-DD"); // Fecha actual en formato YYYY-MM-DD

      let fechaFin;
      fechaFin = dayjs()
        .add(tipoMembresia.duracion_dias, "day")
        .format("YYYY-MM-DD");

      // Agregamos las fechas al estado
      newState = {
        ...newState,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
      };
    }

    setRegistroMembresia(newState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarMembresia(registroMembresia);
    fetchMembresias();
  };

  return (
    <Container>
      <Box
        sx={{ p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Asignar Membresía
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Autocomplete para Clientes */}
          <Autocomplete
            fullWidth
            options={clientes}
            getOptionLabel={(option) => option.nombre} 
            onChange={(event, newValue) =>
              handleChange({
                target: {
                  name: "id_cliente",
                  value: newValue ? newValue.id : "",
                },
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cliente"
                margin="normal"
                required
                size="small"
              />
            )}
          />

          {/* Autocomplete para Tipos de Membresía */}
          <Autocomplete
            fullWidth
            options={tiposMembresia}
            getOptionLabel={(option) => option.tipo}
            onChange={(event, newValue) =>
              handleChange({
                target: {
                  name: "id_membresia",
                  value: newValue ? newValue.id : "",
                },
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tipo Membresía"
                margin="normal"
                required
                size="small"
              />
            )}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "5px",
              marginTop:'1.2rem'
            }}
          >
            <Input
              fullWidth
              name="fecha_inicio"
              value={registroMembresia.fecha_inicio}
              onChange={handleChange}
              margin="normal"
              type="date"
              required
              size="small"
              readOnly
              sx={{backgroundColor:'#04671e',  padding:'0.5rem', borderRadius:'0.5rem',  '& input': {textAlign: 'center', color:'white', letterSpacing:'2px'}}}
            />
            <Input
            readOnly
              fullWidth
              name="fecha_fin"
              value={registroMembresia.fecha_fin}
              onChange={handleChange}
              margin="normal"
              type="date"
              required
              size="small"
              sx={{backgroundColor:'#6e1a22',  padding:'0.5rem', borderRadius:'0.5rem',  '& input': {textAlign: 'center', color:'white', letterSpacing:'2px'}}}
            />
          </div>

          <div className="text-end">
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
            >
              Asignar
            </Button>
          </div>
        </form>
      </Box>
    </Container>
  );
};

export default AgregarMembresia;
