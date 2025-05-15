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


require_once '../modelos/Login.php';
Conexion::init($env);

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

            session_set_cookie_params([
                'lifetime' => 0,
                'path' => '/',
                'domain' => 'localhost', // o 192.168.10.6
                'secure' => false,
                'httponly' => true,
                'samesite' => 'Lax',
            ]);

            session_start();
            $_SESSION["iniciarSesion"] = "ok";
            $_SESSION["id"] = $respuesta[0]["id"];
            $_SESSION["nombre"] = $respuesta[0]["nombre"];
            $_SESSION["email"] = $respuesta[0]["email"];
            $_SESSION["perfil"] = $respuesta[0]["perfil"];


            if ($respuesta[0]['perfil'] == 'admin') {
                echo json_encode(['success' => 'ok', 'redirect' => '/configuracion']);
            } elseif ($respuesta[0]['perfil'] == 'vendedor') {
                echo json_encode(['success' => 'ok', 'redirect' => '/clientes']);
            }
        } else {
            echo json_encode(['success' => 'not', 'redirect' => 'login']);
        }
    }

    public function sesion()
    {
        session_start();
        if (isset($_SESSION["iniciarSesion"]) && $_SESSION["iniciarSesion"] === "ok") {
            echo json_encode([
                'loggedIn' => true,
                'id' => $_SESSION["id"],
                'nombre' => $_SESSION["nombre"],
                'perfil' => $_SESSION["perfil"]
            ]);
        } else {
            echo json_encode(['loggedIn' => false]);
        }
    }
}

// Manejo de peticiones
$action = $_GET['action'] ?? '';
$controller = new LoginController();

if ($action == "ingresar") {
    $controller->ingresar();
}
if ($action == "sesion") {
    $controller->sesion();
}
