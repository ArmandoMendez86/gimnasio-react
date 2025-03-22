<?php
require_once '../modelos/HistorialMedico.php';

class HistorialMedicoController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new HistorialMedico();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerHistoriales());
    }

    public function listarPorPaciente()
    {
        $id_paciente = $_GET['id_paciente'] ?? null;
        if ($id_paciente) {
            echo json_encode($this->modelo->obtenerPorPaciente($id_paciente));
        } else {
            echo json_encode(["success" => false, "message" => "ID de paciente requerido"]);
        }
    }

    public function guardar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if ($data) {
            $resultado = $this->modelo->agregar(
                $data['id'],
                $data['id_paciente'],
                $data['motivo'],
                $data['diagnostico'],
                $data['tratamiento'],
                $data['notas']
            );
            echo json_encode(["success" => $resultado]);
        } else {
            echo json_encode(["success" => false, "message" => "Datos inválidos"]);
        }
    }

    public function editar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        if ($data) {
            $resultado = $this->modelo->editar(
                $data['id'],
                $data['motivo'],
                $data['diagnostico'],
                $data['tratamiento'],
                $data['notas'],
            );
            echo json_encode(["success" => $resultado]);
        } else {
            echo json_encode(["success" => false, "message" => "Datos inválidos"]);
        }
    }

    public function eliminar()
    {
        $id = json_decode(file_get_contents("php://input"), true);
        if ($id) {
            $resultado = $this->modelo->eliminar($id);
            echo json_encode(["success" => $resultado]);
        } else {
            echo json_encode(["success" => false, "message" => "ID requerido"]);
        }
    }
}

// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new HistorialMedicoController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "diagnosticopaciente") {
    $controller->listarPorPaciente();
} elseif ($action == "guardar") {
    $controller->guardar();
} elseif ($action == "editar") {
    $controller->editar();
} elseif ($action == "eliminar") {
    $controller->eliminar();
}
