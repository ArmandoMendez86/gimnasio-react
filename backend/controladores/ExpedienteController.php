<?php
require_once '../modelos/Expediente.php';

class ExpedienteController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Expediente();
    }

    public function listarPorPaciente()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($this->modelo->obtenerPorPaciente($data['paciente_id']));
    }

    public function guardar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->guardar($data['paciente_id'], $data['observaciones']);
        echo json_encode(["success" => $resultado]);
    }
    

}

// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new ExpedienteController();

if ($action == "listarPorPaciente") {
    $controller->listarPorPaciente();
}
if ($action == "guardar") {
    $controller->guardar();
}

