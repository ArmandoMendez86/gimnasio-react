<?php
require_once '../config/Conexion.php';

class Membresia
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }


    public function obtenerTodos()
    {
        $query = "SELECT * FROM membresias";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($tipo, $precio, $duracion_dias)
    {
        $query = "INSERT INTO membresias (tipo, precio, duracion_dias) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$tipo, $precio, $duracion_dias]);
    }

    public function editar($id, $tipo, $precio, $duracion_dias)
    {

        $query = "UPDATE membresias SET  tipo = ?, precio = ?, duracion_dias = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$tipo, $precio, $duracion_dias,  $id]);
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM membresias WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
