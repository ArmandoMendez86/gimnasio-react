<?php

// Carga de entorno una sola vez, al inicio
$env = include __DIR__ . '/../../.env.php';

class Conexion
{
    private static $host;
    private static $dbname;
    private static $usuario;
    private static $password;

    private static $conexion = null;

    // Llamar este método al iniciar para pasar las variables
    public static function init($env)
    {
        self::$host = $env['DB_HOST'];
        self::$dbname = $env['DB_NAME'];
        self::$usuario = $env['DB_USER'];
        self::$password = $env['DB_PASS'];
    }

    public static function getConexion()
    {
        if (self::$conexion === null) {
            try {
                self::$conexion = new PDO(
                    "mysql:host=" . self::$host . ";dbname=" . self::$dbname . ";charset=utf8",
                    self::$usuario,
                    self::$password
                );
                self::$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Error en la conexión: " . $e->getMessage());
            }
        }
        return self::$conexion;
    }
}
