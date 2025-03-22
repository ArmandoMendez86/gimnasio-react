<?php
require_once '../../config/Conexion.php';

class Receta
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }

    // Guardar receta
    public function guardar($id, $paciente_id, $doctor_id, $fecha, $medicamentos, $dosis, $indicaciones, $historial_id)
    {
        $query = "INSERT INTO recetas (id, paciente_id, doctor_id, fecha, medicamentos, dosis, indicaciones, historial_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id, $paciente_id, $doctor_id, $fecha, $medicamentos, $dosis, $indicaciones, $historial_id]);
    }

    // Obtener todas las recetas de un paciente
    public function obtenerPorPaciente($paciente_id)
    {
        $query = "SELECT * FROM recetas WHERE paciente_id = ? ORDER BY fecha DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$paciente_id]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Obtener todas las recetas
    public function obtenerTodas()
    {
        $query = "SELECT r.id, p.nombre, p.telefono, d.nombre AS doctor, d.especialidad, r.medicamentos, r.dosis, r.indicaciones, h.diagnostico, r.fecha FROM recetas AS r
        INNER JOIN pacientes AS p ON p.id = r.paciente_id
        INNER JOIN doctores AS d ON d.id = r.doctor_id
        INNER JOIN historial_medico AS h ON h.id = r.historial_id";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function eliminar($id)
    {
        $query = "DELETE FROM recetas WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$id]);
    }
}
