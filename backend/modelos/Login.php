<?php
require_once '../config/Conexion.php';

class Login
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }

    public function loguearse($usuario)
    {

        $sql = "SELECT * FROM empleados WHERE email = '$usuario'";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerTodos()
    {
        $query = "SELECT * FROM empleados";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($nombre, $apellido, $email, $perfil, $password)
    {
        $query = "INSERT INTO empleados (nombre, apellido, email, perfil, password) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$nombre, $apellido, $email, $perfil, $password]);
    }

    public function editar($id, $nombre, $apellido, $email, $perfil, $password)
    {
        if ($password !== '') {
            $query = "UPDATE empleados SET nombre = ?, apellido = ?, email = ?, perfil = ?, password = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            return $stmt->execute([$nombre, $apellido, $email, $perfil, $password, $id]);
        } else {
            $query = "UPDATE empleados SET nombre = ?, apellido = ?, email = ?, perfil = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            return $stmt->execute([$nombre, $apellido, $email, $perfil, $id]);
        }
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM empleados WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
