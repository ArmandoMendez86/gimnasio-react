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

require_once '../modelos/Stock.php';
  $env = include __DIR__ . '/../../.env.php';
    Conexion::init($env);

class StockController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Stock();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerTodos());
    }

    public function listarMovimientoStock()
    {
        echo json_encode($this->modelo->movimientoStock());
    }

    public function guardar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
                $nombreArchivo = uniqid('img_') . '.' . $extension;
                $rutaArchivo = '../img_productos/' . $nombreArchivo;

                if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaArchivo)) {

                    $nombreImagen = $nombreArchivo;
                } else {
                    echo json_encode(['error' => 'Error al subir la imagen']);
                    return;
                }
            } else {
                $nombreImagen = null;
            }
            $nombre = $_POST['nombre'];
            $descripcion = $_POST['descripcion'];
            $cantidad = $_POST['cantidad'];
            $precio = $_POST['precio'];

            if (empty($nombre) || empty($descripcion)) {
                echo json_encode(['error' => 'Datos incompletos']);
                return;
            }
            $resultado = $this->modelo->agregar(
                $nombre,
                $descripcion,
                $cantidad,
                $precio,
                $nombreImagen
            );

            echo json_encode(['success' => $resultado]);
        } else {
            echo json_encode(['error' => 'Método no permitido']);
        }
    }


    public function editar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
                $nombreArchivo = uniqid('img_') . '.' . $extension;
                $rutaArchivo = '../img_productos/' . $nombreArchivo;

                if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaArchivo)) {
                    $nombreImagen = $nombreArchivo;
                } else {
                    echo json_encode(['error' => 'Error al subir la imagen']);
                    return;
                }
            } else {
                $nombreImagen = null;
            }

            $id = $_POST['id'];
            $nombre = $_POST['nombre'];
            $descripcion = $_POST['descripcion'];
            $cantidad = $_POST['cantidad'];
            $precio = $_POST['precio'];


            if (empty($id) || empty($nombre) || empty($descripcion)) {
                echo json_encode(['error' => 'Datos incompletos']);
                return;
            }


            $resultado = $this->modelo->editar(
                $id,
                $nombre,
                $descripcion,
                $cantidad,
                $precio,
                $nombreImagen
            );

            echo json_encode(['success' => $resultado]);
        } else {
            echo json_encode(['error' => 'Método no permitido']);
        }
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
$controller = new StockController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "movimientostock") {
    $controller->listarMovimientoStock();
} elseif ($action == "guardar") {
    $controller->guardar();
} elseif ($action == "editar") {
    $controller->editar();
} elseif ($action == "eliminar") {
    $controller->eliminar();
}
