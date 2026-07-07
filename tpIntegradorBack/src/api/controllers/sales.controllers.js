import connection from '../database/db.js';

export const createSale = async (req, res) => {
    // Recibimos los datos
    const { nombreUsuario, precioTotal, fechaEmision, productos } = req.body;

    try {
        const sqlSale = "INSERT INTO sales (total_price, user_name, date) VALUES (?, ?, ?)";
        const [result] = await connection.query(sqlSale, [precioTotal, nombreUsuario, fechaEmision]);
        const saleId = result.insertId; 

        if (productos && productos.length > 0) {
            const sqlProducts = "INSERT INTO product_sales (sale_id, product_id) VALUES ?";
            const values = productos.map(prodId => [saleId, prodId]);
            await connection.query(sqlProducts, [values]);
        }

        res.status(201).json({ message: "Venta registrada con éxito." });
    } catch (error) {
        console.error("Error al guardar venta:", error);
        res.status(500).json({ message: "Error al guardar venta." });
    }
};