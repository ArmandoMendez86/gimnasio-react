<?php
require_once '../config/Conexion.php';

class Venta
{
    private $db;

    public function __construct()
    {
        $this->db = Conexion::getConexion();
    }


    public function obtenerTodos()
    {
        $query = "SELECT * FROM ventas";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($productos, $fecha_venta, $total)
    {
        try {
            $this->db->beginTransaction();
            $productosJSON = json_encode($productos);

            // 1. Insertar la venta
            $queryVenta = "INSERT INTO ventas (productos, fecha_venta, total) VALUES (?, ?, ?)";
            $stmtVenta = $this->db->prepare($queryVenta);
            $stmtVenta->execute([$productosJSON, $fecha_venta, $total]);
            $id_venta = $this->db->lastInsertId();

            // 2. Iterar sobre los productos para actualizar el stock y registrar el movimiento
            foreach ($productos as $producto) {
                $id_producto = $producto['id_producto'];
                $cantidadVendida = $producto['cantidad'];

                // Obtener la cantidad EXISTENTE ANTES de la salida
                $queryCantidadExistia = "SELECT cantidad FROM stock WHERE id = ?";
                $stmtCantidadExistia = $this->db->prepare($queryCantidadExistia);
                $stmtCantidadExistia->execute([$id_producto]);
                $resultadoCantidadExistia = $stmtCantidadExistia->fetch(PDO::FETCH_ASSOC);
                $cantidadExistia = $resultadoCantidadExistia ? $resultadoCantidadExistia['cantidad'] : 0;

                // a) Actualizar la cantidad en la tabla stock
                $queryStock = "UPDATE stock SET cantidad = cantidad - ? WHERE id = ?";
                $stmtStock = $this->db->prepare($queryStock);
                $stmtStock->execute([$cantidadVendida, $id_producto]);

                // Obtener la cantidad EXISTE DESPUÉS de la salida
                $queryCantidadExiste = "SELECT cantidad FROM stock WHERE id = ?";
                $stmtCantidadExiste = $this->db->prepare($queryCantidadExiste);
                $stmtCantidadExiste->execute([$id_producto]);
                $resultadoCantidadExiste = $stmtCantidadExiste->fetch(PDO::FETCH_ASSOC);
                $cantidadExiste = $resultadoCantidadExiste ? $resultadoCantidadExiste['cantidad'] : 0;

                // b) Insertar el movimiento en la tabla movimiento_stock CON ambas cantidades
                $queryMovimiento = "INSERT INTO movimiento_stock (id_producto, tipo_movimiento, cantidad, fecha_movimiento, id_venta, existia, existe) VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmtMovimiento = $this->db->prepare($queryMovimiento);
                $stmtMovimiento->execute([$id_producto, 'salida', $cantidadVendida, $fecha_venta, $id_venta, $cantidadExistia, $cantidadExiste]);
            }

            // Si todas las operaciones fueron exitosas, confirmar la transacción
            $this->db->commit();
            return true;
        } catch (PDOException $e) {
            // Si ocurre algún error, deshacer la transacción
            $this->db->rollBack();
            // Puedes loggear el error o lanzar una excepción personalizada
            error_log("Error en la transacción de agregar venta: " . $e->getMessage());
            return false; // O lanzar una excepción
        }
    }
    public function suministrar($productos, $fecha_venta, $total)
    {
        try {
            $this->db->beginTransaction();
            $productosJSON = json_encode($productos);

            // 1. Insertar la venta
            $queryVenta = "INSERT INTO ventas (productos, fecha_venta, total) VALUES (?, ?, ?)";
            $stmtVenta = $this->db->prepare($queryVenta);
            $stmtVenta->execute([$productosJSON, $fecha_venta, $total]);
            $id_venta = $this->db->lastInsertId();

            // 2. Iterar sobre los productos para actualizar el stock y registrar el movimiento
            foreach ($productos as $producto) {
                $id_producto = $producto['id'];
                $cantidadVendida = $producto['cantidad'];

                // Obtener la cantidad EXISTENTE ANTES de la salida
                $queryCantidadExistia = "SELECT cantidad FROM stock WHERE id = ?";
                $stmtCantidadExistia = $this->db->prepare($queryCantidadExistia);
                $stmtCantidadExistia->execute([$id_producto]);
                $resultadoCantidadExistia = $stmtCantidadExistia->fetch(PDO::FETCH_ASSOC);
                $cantidadExistia = $resultadoCantidadExistia ? $resultadoCantidadExistia['cantidad'] : 0;

                // a) Actualizar la cantidad en la tabla stock
                $queryStock = "UPDATE stock SET cantidad = cantidad + ? WHERE id = ?";
                $stmtStock = $this->db->prepare($queryStock);
                $stmtStock->execute([$cantidadVendida, $id_producto]);

                // Obtener la cantidad EXISTE DESPUÉS de la salida
                $queryCantidadExiste = "SELECT cantidad FROM stock WHERE id = ?";
                $stmtCantidadExiste = $this->db->prepare($queryCantidadExiste);
                $stmtCantidadExiste->execute([$id_producto]);
                $resultadoCantidadExiste = $stmtCantidadExiste->fetch(PDO::FETCH_ASSOC);
                $cantidadExiste = $resultadoCantidadExiste ? $resultadoCantidadExiste['cantidad'] : 0;

                // b) Insertar el movimiento en la tabla movimiento_stock CON ambas cantidades
                $queryMovimiento = "INSERT INTO movimiento_stock (id_producto, tipo_movimiento, cantidad, fecha_movimiento, id_venta, existia, existe) VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmtMovimiento = $this->db->prepare($queryMovimiento);
                $stmtMovimiento->execute([$id_producto, 'entrada', $cantidadVendida, $fecha_venta, $id_venta, $cantidadExistia, $cantidadExiste]);
            }

            // Si todas las operaciones fueron exitosas, confirmar la transacción
            $this->db->commit();
            return true;
        } catch (PDOException $e) {
            // Si ocurre algún error, deshacer la transacción
            $this->db->rollBack();
            // Puedes loggear el error o lanzar una excepción personalizada
            error_log("Error en la transacción de agregar venta: " . $e->getMessage());
            return false; // O lanzar una excepción
        }
    }

    public function editar($id, $tipo, $precio, $duracion_dias)
    {

        $query = "UPDATE ventas SET  tipo = ?, precio = ?, duracion_dias = ? WHERE id = ?";
        $stmt = $this->db->prepare($query);
        return $stmt->execute([$tipo, $precio, $duracion_dias,  $id]);
    }

    public function eliminar($id)
    {
        try {
            $query = "DELETE FROM ventas WHERE id = ?";
            $stmt = $this->db->prepare($query);
            $stmt->execute([$id]);
            return true;
        } catch (PDOException $e) {
            if ($e->getCode() == '23000') { // Código de error para restricciones de integridad
                return ['error' => 'No se puede eliminar la membresía porque tiene clientes asociads.'];
            } else {
                return ['error' => 'Error al eliminar la membresía.'];
            }
        }
    }
}
