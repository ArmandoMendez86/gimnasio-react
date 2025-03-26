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
        $query = "SELECT id, nombre, telefono, email FROM clientes";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($nombre, $telefono, $email)
    {
        $query = "INSERT INTO clientes (nombre, telefono, email) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$nombre, $telefono, $email]);
        return $this->db->lastInsertId();
    }

    public function editar($id, $nombre, $telefono, $email)
    {
        $query = "UPDATE clientes SET nombre = ?, telefono = ?, email = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$nombre, $telefono, $email, $id]);
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM clientes WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
