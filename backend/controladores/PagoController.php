<?php
require_once '../modelos/Pago.php';

class PagoController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Pago();
    }

    public function listar()
    {
        echo json_encode($this->modelo->obtenerTodos());
    }

    public function guardar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->agregar(
            $data['idPago'],
            $data['cita_id'],
            $data['monto'],
            $data['fecha_pago'],
            $data['metodo_pago'],
        );
        echo json_encode(["success" => $resultado]);
    }

    /*  public function editar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->editar(
            $data['idCita'],
            $data['fechaHora'],
            $data['estado'],
            $data['id_historial'],
        );
        echo json_encode(["success" => $resultado]);
    } */

    public function eliminar()
    {
        $id = json_decode(file_get_contents("php://input"), true);
        $resultado = $this->modelo->eliminar($id);
        echo json_encode(["success" => $resultado]);
    }
}

// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new PagoController();

if ($action == "listar") {
    $controller->listar();
} elseif ($action == "guardar") {
    $controller->guardar();
} elseif ($action == "eliminar") {
    $controller->eliminar();
}
