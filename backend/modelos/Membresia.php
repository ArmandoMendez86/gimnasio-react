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
        $query = "SELECT * FROM membresia";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($tipo, $descripcion, $precio)
    {
        $query = "INSERT INTO membresia (tipo, descripcion, precio) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$tipo, $descripcion, $precio]);
    }

    public function editar($id, $tipo, $descripcion, $precio)
    {

        $query = "UPDATE membresia SET  tipo = ?, descripcion = ?, precio = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$tipo, $descripcion, $precio,  $id]);
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM membresia WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
