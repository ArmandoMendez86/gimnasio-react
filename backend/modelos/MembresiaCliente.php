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
        $query = "SELECT 
        cm.id, 
        c.nombre, 
        c.telefono, 
        m.tipo, 
        m.precio, 
        cm.descuento, 
        ROUND(m.precio - (m.precio * (cm.descuento / 100)), 2) AS precio_neto,
        cm.fecha_inicio, 
        cm.fecha_fin, 
        cm.status 
        FROM clientes_membresias AS cm
        INNER JOIN clientes AS c ON c.id = cm.id_cliente
        INNER JOIN membresias AS m ON m.id = cm.id_membresia 
        ORDER BY cm.id DESC";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function ventaServicios($fecha)
    {
        $query = "SELECT 
        ROUND(SUM(m.precio * (1 - (cm.descuento / 100))), 2) AS total_servicios
        FROM clientes_membresias AS cm
        INNER JOIN membresias AS m ON m.id = cm.id_membresia
        WHERE fecha_inicio = '$fecha'";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($id_cliente, $id_membresia, $fecha_inicio, $fecha_fin, $descuento)
    {
        $query = "INSERT INTO clientes_membresias (id_cliente, id_membresia, fecha_inicio, fecha_fin, descuento) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$id_cliente, $id_membresia, $fecha_inicio, $fecha_fin, $descuento]);
        return $this->db->lastInsertId();
    }

    public function actualizarPago($id, $status)
    {
        $query = "UPDATE clientes_membresias SET `status` = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$status,  $id]);
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM clientes_membresias WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
