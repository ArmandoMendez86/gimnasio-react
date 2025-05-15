<?php
session_start();

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

// Destruir todas las variables de sesión
$_SESSION = [];
session_unset();
session_destroy();

// Borrar la cookie de sesión si existe
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

header('Content-Type: application/json');
echo json_encode(['success' => true, 'message' => 'Sesión cerrada']);
