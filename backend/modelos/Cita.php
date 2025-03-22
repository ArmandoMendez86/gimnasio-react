<?php
require_once '../config/Conexion.php';

class Cita
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }

    public function obtenerTodos()
    {
        $query = "SELECT ct.id, p.id AS id_cliente, p.nombre, p.email, p.telefono, ct.fecha_hora, hm.id AS id_historial, hm.motivo, hm.diagnostico, ct.estado FROM citas AS ct
        INNER JOIN pacientes AS p ON p.id = ct.id_paciente
        INNER JOIN historial_medico AS hm ON hm.id = ct.id_historial";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($id, $id_paciente, $fecha_hora, $estado, $id_historial)
    {
        $query = "INSERT INTO citas (id, id_paciente, fecha_hora, estado, id_historial) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id, $id_paciente, $fecha_hora, $estado, $id_historial]);
    }

    public function editar($id, $fechaHora, $estado, $id_historial)
    {
        $query = "UPDATE citas SET fecha_hora = ?, estado = ?, id_historial = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$fechaHora, $estado, $id_historial, $id]);
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM citas WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
