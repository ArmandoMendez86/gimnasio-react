<?php
require_once '../config/Ip.php';
$allowedOrigins = [
    'http://localhost:5173',
    'http://' . IP . ':5173',


];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../modelos/Venta.php';

class VentaController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Venta();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerTodos());
    }

    public function ventaProductos()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $fecha = $data['fecha'];
        echo json_encode($this->modelo->ventaProductos($fecha));
    }

    public function guardar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->agregar(
            $data['productos'],
            $data['fecha_venta'],
            $data['total'],
        );
        echo json_encode(["success" => $resultado]);
    }

    public function suministrar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->suministrar(
            $data['productos'],
            $data['fecha_venta'],
            $data['total'],
        );
        echo json_encode(["success" => $resultado]);
    }

    public function editar()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $resultado = $this->modelo->editar(
            $data['id'],
            $data['tipo'],
            $data['precio'],
            $data['duracion_dias'],
        );
        echo json_encode(["success" => $resultado]);
    }

    public function eliminar()
    {
        $id = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->eliminar($id);

        if (is_array($resultado) && isset($resultado['error'])) {
            echo json_encode($resultado);
        } else {
            echo json_encode(['success' => true]);
        }
    }
}

// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new VentaController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "ventaproductos") {
    $controller->ventaProductos();
} elseif ($action == "guardar") {
    $controller->guardar();
} elseif ($action == "suministrar") {
    $controller->suministrar();
} elseif ($action == "editar") {
    $controller->editar();
} elseif ($action == "eliminar") {
    $controller->eliminar();
}
