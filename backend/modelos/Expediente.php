<?php
require_once '../../config/Conexion.php';

class Expediente
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }

    public function obtenerPorPaciente($paciente_id)
    {
        $expediente = [
            "paciente_id" => $paciente_id,
            "fecha_creacion" => "",
            "observaciones" => "",
            "historial" => [],
            "recetas" => [],
            "citas" => []
        ];

        // Obtener información general del expediente
        $stmt = $this->db->prepare("SELECT fecha_creacion, observaciones FROM expediente_clinico WHERE paciente_id = ?");
        $stmt->execute([$paciente_id]);
        if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $expediente["fecha_creacion"] = $row["fecha_creacion"];
            $expediente["observaciones"] = $row["observaciones"];
        }

        // Obtener historial médico
        $stmt = $this->db->prepare("SELECT h.id, h.id_paciente, p.nombre, p.telefono, h.diagnostico, h.tratamiento, h.notas, h.fecha FROM historial_medico AS h
        INNER JOIN pacientes AS p ON p.id = h.id_paciente  WHERE id_paciente = ?");
        $stmt->execute([$paciente_id]);
        $expediente["historial"] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener recetas médicas
        $stmt = $this->db->prepare("SELECT p.nombre, p.telefono, d.nombre AS doctor, d.especialidad, r.medicamentos, r.dosis, r.indicaciones, h.diagnostico, r.fecha FROM recetas AS r
        INNER JOIN pacientes AS p ON p.id = r.paciente_id
        INNER JOIN doctores AS d ON d.id = r.doctor_id
        INNER JOIN historial_medico AS h ON h.id = r.historial_id WHERE paciente_id = ?");
        $stmt->execute([$paciente_id]);
        $expediente["recetas"] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener citas médicas
        $stmt = $this->db->prepare("SELECT ct.id, p.id AS id_cliente, p.nombre, p.email, p.telefono, ct.fecha_hora, ct.estado FROM citas AS ct
        INNER JOIN pacientes AS p ON p.id = ct.id_paciente WHERE p.id = ?");
        $stmt->execute([$paciente_id]);
        $expediente["citas"] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $expediente;
    }

    public function guardar($paciente_id, $observaciones)
    {
        $query = "INSERT INTO expediente_clinico (paciente_id, fecha_creacion, observaciones) VALUES (?, NOW(), ?)";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$paciente_id, $observaciones]);
    }
}
