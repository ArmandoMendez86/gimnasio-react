<?php
require_once '../../config/Conexion.php';

class Login
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }

    public function loguearse($usuario)
    {

        $sql = "SELECT * FROM usuarios WHERE usuario = '$usuario'";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerTodos()
    {
        $query = "SELECT * FROM usuarios ORDER BY fecha_registro DESC";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($id, $usuario, $password)
    {
        $query = "INSERT INTO usuarios (id, usuario, password) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id, $usuario, $password]);
    }

    public function editar($id, $nombre, $apellido, $telefono, $email, $direccion)
    {
        $query = "UPDATE usuarios SET nombre = ?, apellido = ?, telefono = ?, email = ?, direccion = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$nombre, $apellido, $telefono, $email, $direccion, $id]);
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM usuarios WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
