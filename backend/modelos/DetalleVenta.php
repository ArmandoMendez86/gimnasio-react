<?php
date_default_timezone_set('America/Mexico_City');

require_once '../config/Conexion.php';

class DetalleVenta
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }


    public function obtenerTodos()
    {
        $fecha = date('Y-m-d');
        $query = "SELECT vd.id, vd.id_venta AS codigo, stock.id AS id_producto, stock.nombre_producto AS producto, vd.cantidad, stock.precio_unitario, vd.descuento, ROUND(stock.precio_unitario * vd.cantidad * (1 - vd.descuento), 2) AS precio_neto, ventas.fecha_venta FROM ventas_detalles AS vd
        INNER JOIN stock ON vd.id_producto = stock.id
        INNER JOIN ventas ON ventas.id = vd.id_venta 
        WHERE DATE(ventas.fecha_venta) = '$fecha'
        ORDER BY ventas.fecha_venta DESC";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function eliminar($datos)
    {
        try {
            // Iniciar transacción
            $this->db->beginTransaction();

            $id_detalle = $datos['id'];
            $id_venta = $datos['codigo'];
            $id_producto = $datos['id_producto'];
            $cantidad = $datos['cantidad'];
            $fecha_venta = $datos['fecha_venta'];

            // Obtener la cantidad EXISTENTE ANTES de la salida
            $queryCantidadExistia = "SELECT cantidad FROM stock WHERE id = ?";
            $stmtCantidadExistia = $this->db->prepare($queryCantidadExistia);
            $stmtCantidadExistia->execute([$id_producto]);
            $resultadoCantidadExistia = $stmtCantidadExistia->fetch(PDO::FETCH_ASSOC);
            $cantidadExistia = $resultadoCantidadExistia ? $resultadoCantidadExistia['cantidad'] : 0;

            // 1. Restaurar el stock
            $queryStock = "UPDATE stock SET cantidad = cantidad + ? WHERE id = ?";
            $stmtStock = $this->db->prepare($queryStock);
            $stmtStock->execute([$cantidad, $id_producto]);

            // Obtener la cantidad EXISTE DESPUÉS de la salida
            $queryCantidadExiste = "SELECT cantidad FROM stock WHERE id = ?";
            $stmtCantidadExiste = $this->db->prepare($queryCantidadExiste);
            $stmtCantidadExiste->execute([$id_producto]);
            $resultadoCantidadExiste = $stmtCantidadExiste->fetch(PDO::FETCH_ASSOC);
            $cantidadExiste = $resultadoCantidadExiste ? $resultadoCantidadExiste['cantidad'] : 0;

            // b) Insertar el movimiento en la tabla movimiento_stock CON ambas cantidades
            $queryMovimiento = "INSERT INTO movimiento_stock (id_producto, tipo_movimiento, cantidad, fecha_movimiento, id_venta, existia, existe) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmtMovimiento = $this->db->prepare($queryMovimiento);
            $stmtMovimiento->execute([$id_producto, 'cancelacion', $cantidad, $fecha_venta, $id_venta, $cantidadExistia, $cantidadExiste]);

            // 2. Eliminar el detalle de venta
            $queryDelete = "DELETE FROM ventas_detalles WHERE id = ?";
            $stmtDelete = $this->db->prepare($queryDelete);
            $stmtDelete->execute([$id_detalle]);

            // 2. Eliminar la venta
            $queryDelete = "DELETE FROM ventas WHERE id = ?";
            $stmtDelete = $this->db->prepare($queryDelete);
            $stmtDelete->execute([$id_venta]);

            // Confirmar todo
            $this->db->commit();
            return true;
        } catch (PDOException $e) {
            $this->db->rollBack();
            if ($e->getCode() == '23000') {
                return ['error' => 'No se puede cancelar la venta porque tiene restricciones de integridad.'];
            } else {
                return ['error' => 'Error al cancelar la venta: ' . $e->getMessage()];
            }
        }
    }
}
