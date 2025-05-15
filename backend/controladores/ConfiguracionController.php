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

require_once '../modelos/Configuracion.php';
Conexion::init($env);

class ConfiguracionController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Configuracion();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerTodos());
    }



    public function guardar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {

            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
                $nombreArchivo = uniqid('img_') . '.' . $extension;
                $rutaArchivo = '../img_clientes/' . $nombreArchivo;

                if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaArchivo)) {

                    $nombreImagen = $nombreArchivo;
                } else {
                    echo json_encode(['error' => 'Error al subir la imagen']);
                    return;
                }
            } else {
                $nombreImagen = null;
            }
            $razon = $_POST['razon'];

            if (empty($razon)) {
                echo json_encode(['error' => 'Datos incompletos']);
                return;
            }
            $resultado = $this->modelo->agregar(
                $razon,
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
            // Manejar la subida de la imagen (si se proporciona)
            if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
                $extension = pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
                $nombreArchivo = uniqid('img_') . '.' . $extension;
                $rutaArchivo = '../img_clientes/' . $nombreArchivo;

                if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaArchivo)) {
                    $nombreImagen = $nombreArchivo;
                } else {
                    echo json_encode(['error' => 'Error al subir la imagen']);
                    return;
                }
            } else {
                $nombreImagen = null; // No se subió imagen o hubo un error
            }

            // Manejar los datos de texto
            $id = $_POST['id'];
            $nombre = $_POST['nombre'];
            $telefono = $_POST['telefono'];
            $email = $_POST['email'];

            // Validar los datos
            if (empty($id) || empty($nombre) || empty($telefono) || empty($email)) {
                echo json_encode(['error' => 'Datos incompletos']);
                return;
            }

            // Llamar al modelo para editar los datos y la imagen
            $resultado = $this->modelo->editar(
                $id,
                $nombre,
                $telefono,
                $email,
                $nombreImagen // Pasar el nombre de la imagen al modelo
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

$action = $_GET['action'] ?? '';
$controller = new ConfiguracionController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "guardar") {
    $controller->guardar();
} elseif ($action == "editar") {
    $controller->editar();
} elseif ($action == "eliminar") {
    $controller->eliminar();
}
