<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); // Reemplaza con la URL de tu frontend
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../modelos/Pago.php';

class PagoController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Pago();
    }

    public function listar()
    {
        $datos = $this->modelo->obtenerTodos();

        // Ajustar zona horaria
        $zonaHoraria = 'America/Mexico_City';
        $fechaActual = new DateTime('now', new DateTimeZone($zonaHoraria));

        // Filtrar solo las fechas que no son menores a fecha_fin
        $datosFiltrados = array_filter($datos, function ($dato) use ($fechaActual, $zonaHoraria) {
            if (!$dato['fecha_fin']) {
                return false; // Si no tiene fecha_fin, lo excluye
            }

            try {
                // Convertir a hora local
                $fechaFin = new DateTime($dato['fecha_fin'], new DateTimeZone('UTC'));
                $fechaFin->setTimezone(new DateTimeZone($zonaHoraria));
                return $fechaFin >= $fechaActual; // Solo incluir si la fecha_fin es mayor o igual a la actual
            } catch (Exception $e) {
                return false;
            }
        });

        // Ajustar fechas y calcular estatus para los datos filtrados
        foreach ($datosFiltrados as &$dato) {
            $dato['fecha_inicio'] = $this->convertirFechaLocal($dato['fecha_inicio'], $zonaHoraria);
            $dato['fecha_fin'] = $this->convertirFechaLocal($dato['fecha_fin'], $zonaHoraria);
            $dato['fecha_pago'] = $this->convertirFechaLocal($dato['fecha_pago'], $zonaHoraria);
            $dato['estatus'] = $this->calcularEstatus($dato['fecha_fin'], $fechaActual);
        }

        echo json_encode(array_values($datosFiltrados));
    }


    private function convertirFechaLocal($fecha, $zonaHoraria)
    {
        if (!$fecha) {
            return null; // Si la fecha es nula, devolver null
        }
        try {
            $date = new DateTime($fecha, new DateTimeZone('UTC'));
            $date->setTimezone(new DateTimeZone($zonaHoraria));
            return $date->format('Y-m-d H:i:s');
        } catch (Exception $e) {
            return null;
        }
    }

    private function calcularEstatus($fechaFin, $fechaActual)
    {
        if (!$fechaFin) {
            return 'Inactiva';
        }
        try {
            $fechaFin = new DateTime($fechaFin, new DateTimeZone('UTC'));
            $fechaFin->setTimezone(new DateTimeZone('America/Mexico_City'));
            return $fechaFin >= $fechaActual ? 'Activa' : 'Inactiva';
        } catch (Exception $e) {
            return 'Inactiva';
        }
    }
}

// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new PagoController();

if ($action == "listar") {
    $controller->listar();
}
