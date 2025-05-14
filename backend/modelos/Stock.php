<?php
require_once '../config/Conexion.php';

class Stock
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }


    public function obtenerTodos()
    {
        $query = "SELECT * FROM stock";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function movimientoStock()
    {
        $query = "SELECT p.nombre_producto, me.tipo_movimiento, me.cantidad, me.existia, me.existe, me.fecha_movimiento, p.img FROM movimiento_stock AS me
        INNER JOIN stock AS p ON me.id_producto = p.id ORDER BY me.fecha_movimiento DESC";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($nombre, $descripcion, $cantidad, $precio, $imagen)
    {
        $query = "INSERT INTO stock (nombre_producto, descripcion, cantidad, precio_unitario, img) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$nombre, $descripcion, $cantidad, $precio, $imagen]);
    }

    public function editar($id, $nombre, $descripcion, $cantidad, $precio, $imagen)
    {
        if ($imagen !== null) {

            $query = "UPDATE stock SET nombre_producto = ?, descripcion = ?, cantidad = ?, precio_unitario = ?, img = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            return $stmt->execute([$nombre, $descripcion, $cantidad, $precio, $imagen, $id]);
        } else {

            $query = "UPDATE stock SET nombre_producto = ?, descripcion = ?, cantidad = ?, precio_unitario = ? WHERE id = ?";
            $stmt = $this->db->prepare($query);
            return $stmt->execute([$nombre, $descripcion, $cantidad, $precio, $id]);
        }
    }

    public function eliminar($id)
    {
        try {
            $query = "DELETE FROM stock WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$id]);
            return true;
        } catch (PDOException $e) {
            return ['error' => 'No se puede eliminar el producto .'];
        }
    }
}
