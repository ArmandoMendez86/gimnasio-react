<?php
require_once '../config/Conexion.php';

class MembresiaCliente
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }


    public function obtenerTodos()
    {
        $query = "SELECT c.nombre, c.telefono, c.email, m.tipo, cm.fecha_inicio, cm.fecha_fin FROM clientes_membresias AS cm
        INNER JOIN clientes AS c ON c.id = cm.id_cliente
        INNER JOIN membresias AS m ON m.id = cm.id_membresia ORDER BY cm.fecha_inicio DESC";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($id_cliente, $id_membresia, $fecha_inicio, $fecha_fin)
    {
        $query = "INSERT INTO clientes_membresias (id_cliente, id_membresia, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$id_cliente, $id_membresia, $fecha_inicio, $fecha_fin]);
        return $this->db->lastInsertId();

        
    }

    public function editar($id, $tipo, $precio, $duracion_dias)
    {

        $query = "UPDATE clientes_membresias SET  tipo = ?, precio = ?, duracion_dias = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$tipo, $precio, $duracion_dias,  $id]);
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM clientes_membresias WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
