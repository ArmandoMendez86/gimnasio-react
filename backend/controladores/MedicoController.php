<?php
require_once '../modelos/Medico.php';

class MedicoController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Medico();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerTodos());
    }

    public function guardar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->agregar(
            $data['id'],
            $data['nombre'],
            $data['correo'],
            $data['telefono'],
            $data['especialidad'],
        );
        echo json_encode(["success" => $resultado]);
    }

    public function editar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->editar(
            $data['id'],
            $data['nombre'],
            $data['correo'],
            $data['telefono'],
            $data['especialidad'],
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
$controller = new MedicoController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "guardar") {
    $controller->guardar();
} elseif ($action == "editar") {
    $controller->editar();
} elseif ($action == "eliminar") {
    $controller->eliminar();
}
