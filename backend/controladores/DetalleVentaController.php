<?php
$env = include __DIR__ . '/../../.env.php';
$allowedOrigins = [
    $env['URL_LOCAL'],
    $env['URL_EXT_LOCAL'],

];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../modelos/DetalleVenta.php';
  $env = include __DIR__ . '/../../.env.php';
    Conexion::init($env);

class DetalleVentaController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new DetalleVenta();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerTodos());
    }


    public function eliminar()
    {
        $datos = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->eliminar($datos);

        if (is_array($resultado) && isset($resultado['error'])) {
            echo json_encode($resultado);
        } else {
            echo json_encode(['success' => true]);
        }
    }
}

// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new DetalleVentaController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "eliminar") {
    $controller->eliminar();
}
