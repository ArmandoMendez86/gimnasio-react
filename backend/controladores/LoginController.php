<?php
require_once '../modelos/Login.php';

class LoginController
{
    private $modelo;

    public function __construct()
    {
        $this->modelo = new Login();
    }


    public function ingresar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $respuesta = $this->modelo->loguearse($data['usuario']);
        if ($respuesta && password_verify($data['password'], $respuesta[0]["password"])) {

            session_start();
            $_SESSION["iniciarSesion"] = "ok";
            $_SESSION["id"] = $respuesta[0]["id"];
            $_SESSION["usuario"] = $respuesta[0]["usuario"];
            $_SESSION["perfil"] = $respuesta[0]["perfil"];

            if ($respuesta[0]['perfil'] == 'admin') {
                echo json_encode(['success' => 'ok', 'redirect' => 'app/vistas/pagos.php']);
            }
            if ($respuesta[0]['perfil'] == 'vendedor') {
                echo json_encode(['success' => 'ok', 'redirect' => 'app/vistas/pacientes.php']);
            }
        } else {
            echo json_encode(['success' => 'not', 'redirect' => 'index.php']);
        }
    }
}

// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new LoginController();

if ($action == "ingresar") {
    $controller->ingresar();
}
