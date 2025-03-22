<?php
require_once '../../config/Conexion.php';

class OdontogramaController
{
    public function cargar()
    {
        $idPaciente = $_GET["idPaciente"];
        $db = Conexion::getConexion();
        $query = $db->prepare("SELECT dientes FROM odontogramas WHERE id_paciente = ?");
        $query->execute([$idPaciente]);

        if ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            echo json_encode(["success" => true, "dientes" => json_decode($row["dientes"])]);
        } else {
            echo json_encode(["success" => false, "dientes" => []]);
        }
    }

    public function guardar()
    {
        $data = json_decode(file_get_contents("php://input"), true);
        $idPaciente = $data["idPaciente"];
        $dientes = json_encode($data["dientes"]);

        $db = Conexion::getConexion();

        // Verificar si el paciente ya tiene un odontograma registrado
        $query = $db->prepare("SELECT COUNT(*) FROM odontogramas WHERE id_paciente = ?");
        $query->execute([$idPaciente]);
        $existe = $query->fetchColumn();

        if ($existe) {
            // Si ya existe, actualizar el odontograma
            $query = $db->prepare("UPDATE odontogramas SET dientes = ? WHERE id_paciente = ?");
            $query->execute([$dientes, $idPaciente]);
        } else {
            // Si no existe, insertar un nuevo odontograma
            $query = $db->prepare("INSERT INTO odontogramas (id_paciente, dientes) VALUES (?, ?)");
            $query->execute([$idPaciente, $dientes]);
        }

        echo json_encode(["success" => true]);
    }
}

if (isset($_GET["action"])) {
    $controller = new OdontogramaController();
    if ($_GET["action"] === "cargar") $controller->cargar();
    if ($_GET["action"] === "guardar") $controller->guardar();
}
