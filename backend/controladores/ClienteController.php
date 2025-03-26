<?php
$allowedOrigins = [
    'http://localhost:5173',
    'http://192.168.0.7:5173',
   

];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../modelos/Cliente.php';

class ClienteController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Cliente();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerTodos());
    }

    public function guardar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->agregar(
            $data['nombre'],
            $data['telefono'],
            $data['email'],

        );
        echo json_encode(["success" => $resultado]);
    }

    public function editar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->editar(
            $data['id'],
            $data['nombre'],
            $data['telefono'],
            $data['email'],

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

$action = $_GET['action'] ?? '';
$controller = new ClienteController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "guardar") {
    $controller->guardar();
} elseif ($action == "editar") {
    $controller->editar();
} elseif ($action == "eliminar") {
    $controller->eliminar();
}
