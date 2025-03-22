<?php
require_once '../../config/Conexion.php';

class Medico
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }

    public function obtenerTodos()
    {
        $query = "SELECT * FROM doctores ORDER BY creado_en DESC";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($id, $nombre, $correo, $telefono, $especialidad)
    {
        $query = "INSERT INTO doctores (id, nombre, correo, telefono, especialidad) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id, $nombre, $correo, $telefono, $especialidad]);
    }

    public function editar($id, $nombre, $correo, $telefono, $especialidad)
    {
        $query = "UPDATE doctores SET nombre = ?, correo = ?, telefono = ?, especialidad = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$nombre, $correo, $telefono, $especialidad, $id]);
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM doctores WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
