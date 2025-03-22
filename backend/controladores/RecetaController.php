<?php
require_once '../modelos/Receta.php';

class RecetaController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Receta();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerTodas());
    }

    public function listarPorPaciente()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($this->modelo->obtenerPorPaciente($data['paciente_id']));
    }

    public function guardar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->guardar(
            $data['id'],
            $data['paciente_id'],
            $data['medico_id'],
            $data['fecha'],
            $data['medicamentos'],
            $data['dosis'],
            $data['indicaciones'],
            $data['historial_id'],
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
$controller = new RecetaController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "listarPorPaciente") {
    $controller->listarPorPaciente();
} elseif ($action == "guardar") {
    $controller->guardar();
}elseif ($action == "eliminar") {
    $controller->eliminar();
}
