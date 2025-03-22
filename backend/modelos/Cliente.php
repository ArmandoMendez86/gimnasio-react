<?php
require_once '../config/Conexion.php';

class Cliente
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }

    public function obtenerTodos()
    {
        $query = "SELECT * FROM cliente";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($nombre, $telefono, $email)
    {
        $query = "INSERT INTO cliente (nombre, telefono, email) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$nombre, $telefono, $email]);
        return $this->db->lastInsertId();
    }

    public function editar($id, $nombre, $telefono, $email)
    {
        $query = "UPDATE cliente SET nombre = ?, telefono = ?, email = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$nombre, $telefono, $email, $id]);
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM cliente WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
