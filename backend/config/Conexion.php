<?php
class Conexion
{
    private static $host = "localhost";
    private static $dbname = "gym";
    private static $usuario = "root"; 
    private static $password = "linux"; 



    private static $conexion = null;

    public static function getConexion()
    {
        if (self::$conexion === null) {
            try {
                self::$conexion = new PDO("mysql:host=" . self::$host . ";dbname=" . self::$dbname . ";charset=utf8", self::$usuario, self::$password);
                self::$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                die("Error en la conexión: " . $e->getMessage());
            }
        }
        return self::$conexion;
    }
}
