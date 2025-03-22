<?php
require_once '../../config/Conexion.php';

class Pago
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }

    public function obtenerTodos()
    {
        $query = "SELECT pg.id, p.nombre, h.diagnostico, h.tratamiento, h.notas, pg.monto, pg.fecha_pago, pg.metodo_pago FROM pagos AS pg
        INNER JOIN citas AS ct ON ct.id = pg.cita_id
        INNER JOIN pacientes AS p ON p.id = ct.id_paciente 
        INNER JOIN historial_medico AS h ON h.id = ct.id_historial ";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($id, $cita_id, $monto, $fecha_pago, $metodo_pago)
    {
        $query = "INSERT INTO pagos (id, cita_id, monto, fecha_pago, metodo_pago) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id, $cita_id, $monto, $fecha_pago, $metodo_pago]);
    }

    /*  public function editar($id, $fechaHora, $estado, $id_historial)
    {
        $query = "UPDATE citas SET fecha_hora = ?, estado = ?, id_historial = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$fechaHora, $estado, $id_historial, $id]);
    } */

    public function eliminar($id)
    {
        $query = "DELETE FROM pagos WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
