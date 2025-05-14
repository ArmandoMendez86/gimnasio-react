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

    public function ventaProductos($fecha)
    {
        $query = "SELECT 
        ROUND(SUM(stock.precio_unitario * vd.cantidad * (1 - vd.descuento)), 2) AS total_productos
        FROM ventas_detalles AS vd
        INNER JOIN stock ON vd.id_producto = stock.id
        INNER JOIN ventas ON ventas.id = vd.id_venta 
        WHERE DATE(ventas.fecha_venta) = '$fecha';
";
        return $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregar($productos, $fecha_venta, $total)
    {
        try {
            $this->db->beginTransaction();

            // 1. Insertar la venta (ahora sin productos)
            $queryVenta = "INSERT INTO ventas (fecha_venta, total) VALUES (?, ?)";
            $stmtVenta = $this->db->prepare($queryVenta);
            $stmtVenta->execute([$fecha_venta, $total]);
            $id_venta = $this->db->lastInsertId();

            // 2. Iterar sobre los productos
            foreach ($productos as $producto) {
                $id_producto = $producto['id_producto'];
                $cantidadVendida = $producto['cantidad'];
                $descuento = $producto['descuento'];

                // 2.1 Insertar en venta_detalles
                $queryDetalle = "INSERT INTO ventas_detalles (id_venta, id_producto, cantidad, descuento) VALUES (?, ?, ?, ?)";
                $stmtDetalle = $this->db->prepare($queryDetalle);
                $stmtDetalle->execute([$id_venta, $id_producto, $cantidadVendida, $descuento]);

                // 2.2 Obtener stock actual (antes de la venta)
                $queryCantidadExistia = "SELECT cantidad FROM stock WHERE id = ?";
                $stmtCantidadExistia = $this->db->prepare($queryCantidadExistia);
                $stmtCantidadExistia->execute([$id_producto]);
                $resultadoCantidadExistia = $stmtCantidadExistia->fetch(PDO::FETCH_ASSOC);
                $cantidadExistia = $resultadoCantidadExistia ? $resultadoCantidadExistia['cantidad'] : 0;

                // 2.3 Actualizar stock
                $queryStock = "UPDATE stock SET cantidad = cantidad - ? WHERE id = ?";
                $stmtStock = $this->db->prepare($queryStock);
                $stmtStock->execute([$cantidadVendida, $id_producto]);

                // 2.4 Obtener stock actual (después de la venta)
                $queryCantidadExiste = "SELECT cantidad FROM stock WHERE id = ?";
                $stmtCantidadExiste = $this->db->prepare($queryCantidadExiste);
                $stmtCantidadExiste->execute([$id_producto]);
                $resultadoCantidadExiste = $stmtCantidadExiste->fetch(PDO::FETCH_ASSOC);
                $cantidadExiste = $resultadoCantidadExiste ? $resultadoCantidadExiste['cantidad'] : 0;

                // 2.5 Insertar movimiento en movimiento_stock
                $queryMovimiento = "INSERT INTO movimiento_stock (id_producto, tipo_movimiento, cantidad, fecha_movimiento, id_venta, existia, existe) VALUES (?, ?, ?, ?, ?, ?, ?)";
                $stmtMovimiento = $this->db->prepare($queryMovimiento);
                $stmtMovimiento->execute([$id_producto, 'salida', $cantidadVendida, $fecha_venta, $id_venta, $cantidadExistia, $cantidadExiste]);
            }

            // Confirmar la transacción
            $this->db->commit();
            return true;
        } catch (PDOException $e) {
            // Revertir si falla algo
            $this->db->rollBack();
            error_log("Error en la transacción de agregar venta: " . $e->getMessage());
            return false;
        }
    }

    public function suministrar($productos, $fecha_venta, $total)
    {
        try {
            $this->db->beginTransaction();

            // 1. Insertar la venta
            $queryVenta = "INSERT INTO ventas (fecha_venta, total) VALUES (?, ?)";
            $stmtVenta = $this->db->prepare($queryVenta);
            $stmtVenta->execute([$fecha_venta, $total]);
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
