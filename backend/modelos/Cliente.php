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
        $query = "SELECT id, nombre, telefono, email, img, fecha_registro FROM clientes ORDER BY fecha_registro DESC";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function verificarCorreo($correo)
    {
        $query = "SELECT email FROM clientes WHERE email = '$correo'";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($nombre, $telefono, $email, $imagen)
    {
        $query = "INSERT INTO clientes (nombre, telefono, email, img) VALUES (?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$nombre, $telefono, $email, $imagen]);
        return $this->db->lastInsertId();
    }

    public function editar($id, $nombre, $telefono, $email, $imagen)
    {
        if ($imagen !== null) {
            // Si se proporciona una nueva imagen, actualizar la columna 'img'
            $query = "UPDATE clientes SET nombre = ?, telefono = ?, email = ?, img = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            return $stmt->execute([$nombre, $telefono, $email, $imagen, $id]);
        } else {
            // Si no se proporciona una nueva imagen, actualizar solo los datos de texto
            $query = "UPDATE clientes SET nombre = ?, telefono = ?, email = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            return $stmt->execute([$nombre, $telefono, $email, $id]);
        }
    }

    public function eliminar($id)
    {
        try {
            $query = "DELETE FROM clientes WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$id]);
            return true;
        } catch (PDOException $e) {
            if ($e->getCode() == '23000') { // Código de error para restricciones de integridad
                return ['error' => 'No se puede eliminar el cliente porque tiene una membresía asociada.'];
            } else {
                return ['error' => 'Error al eliminar el cliente.'];
            }
        }
    }
}
