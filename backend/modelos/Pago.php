<?php
require_once '../config/Conexion.php';

class Pago
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }


    public function obtenerTodos()
    {
        $query = "SELECT c.nombre, c.telefono, c.email, m.tipo, cm.fecha_inicio, cm.fecha_fin, p.fecha_pago, p.metodo_pago FROM pagos AS p
        INNER JOIN clientes_membresias AS cm ON p.id_cliente_membresia = cm.id 
        INNER JOIN clientes AS c ON c.id = cm.id_cliente
        INNER JOIN membresias AS m ON m.id = cm.id_membresia";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }
}
