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
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../modelos/MembresiaCliente.php';
  $env = include __DIR__ . '/../../.env.php';
    Conexion::init($env);

class MembresiaClienteController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new MembresiaCliente();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerTodos());
    }

    public function ventaServicios()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $fecha = $data['fecha'];
        echo json_encode($this->modelo->ventaServicios($fecha));
    }

    public function guardar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->agregar(
            $data['id_cliente'],
            $data['id_membresia'],
            $data['fecha_inicio'],
            $data['fecha_fin'],
            $data['descuento'],
        );
        echo json_encode(["success" => $resultado]);
    }

    public function actualizarPago()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $status = $data['status'] ? 1 : 0;

        $resultado = $this->modelo->actualizarPago(
            $data['id'],
            $status
        );
        echo json_encode(["success" => $resultado]);
    }

    public function eliminar()
    {
        $id = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->eliminar($id);
        echo json_encode(["success" => $resultado]);
    }
}

// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new MembresiaClienteController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "ventaservicios") {
    $controller->ventaServicios();
} elseif ($action == "guardar") {
    $controller->guardar();
} elseif ($action == "actualizarpago") {
    $controller->actualizarPago();
} elseif ($action == "eliminar") {
    $controller->eliminar();
}
