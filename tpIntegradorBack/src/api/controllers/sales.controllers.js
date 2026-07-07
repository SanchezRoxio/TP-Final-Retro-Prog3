/*===============================
    Controlador de ventas
================================*/

// Importamos la conexión a la base de datos
import connection from '../database/db.js';

/**
 * createSale - Registra una nueva venta en la base de datos.
 * 
 * Primero inserta la venta principal en la tabla 'sales',
 * luego asocia cada producto vendido en la tabla 'product_sales'.
 * 
 * @param {Object} req.body - { nombreUsuario, precioTotal, fechaEmision, productos[] }
 */
export const createSale = async (req, res) => {
    // Extraemos los datos enviados desde el frontend
    const { nombreUsuario, precioTotal, fechaEmision, productos } = req.body;

    try {
        // 1) Insertamos la venta principal con precio, nombre de usuario y fecha
        const sqlSale = "INSERT INTO sales (total_price, user_name, date) VALUES (?, ?, ?)";
        const [result] = await connection.query(sqlSale, [precioTotal, nombreUsuario, fechaEmision]);
        
        // Obtenemos el id autogenerado de la venta recién creada
        const saleId = result.insertId; 

        // 2) Si la venta incluye productos, los insertamos en la tabla intermedia
        if (productos && productos.length > 0) {
            const sqlProducts = "INSERT INTO product_sales (sale_id, product_id) VALUES ?";
            // Armamos un array de pares [saleId, productoId] para la inserción masiva
            const values = productos.map(prodId => [saleId, prodId]);
            await connection.query(sqlProducts, [values]);
        }

        res.status(201).json({ message: "Venta registrada con éxito." });
    } catch (error) {
        console.error("Error al guardar venta:", error);
        res.status(500).json({ message: "Error al guardar venta." });
    }
};