/*===============================
    Modelos de productos
================================*/

import connection from "../database/db.js";

///////////////////////////////
// Traer todos los productos
const selectAllProducts = () => {
    // Optimizamos seleccionando solo las columnas necesarias
    const sql = "SELECT id, name, price, image FROM products WHERE active = 1";
    return connection.query(sql); 
}

///////////////////////////////
// Traer productos por id
const selectProductById = (id) => {
    // Usamos "?" para prevenir inyecciones SQL
    const sql = "SELECT id, name, price, image FROM products WHERE id = ?";
    return connection.query(sql, [id]);
}

///////////////////////////////
// Crear nuevo producto
const insertProduct = (name, image, category, price) => {
    const sql = "INSERT INTO products (name, image, category, price) VALUES (?, ?, ?, ?)";
    return connection.query(sql, [name, image, category, price]);
}

///////////////////////////////
// Modificar producto
const updateProduct = (name, image, category, price, active, id) => {
    const sql = "UPDATE products SET name = ?, image = ?, category = ?, price = ?, active = ? WHERE id = ?";
    return connection.query(sql, [name, image, category, price, active, id]);
}

///////////////////////////////
// Eliminar producto
const deleteProduct = (id) => {
    const sql = "DELETE FROM products WHERE id = ?";
    return connection.query(sql, [id]);
}

// Exportamos el objeto para usarlo en los controladores
export default {
    selectAllProducts,
    selectProductById,
    insertProduct,
    updateProduct,
    deleteProduct
}