/*===============================
    Controladores productos
================================*/

import ProductModels from "../models/product.models.js";

/**
 * getAllProducts - Retorna todos los productos activos de la base de datos.
 * @route GET /api/products
 */
export const getAllProducts = async (req, res) => {
    try {
        const [rows] = await ProductModels.selectAllProducts();
        
        // Si no hay productos en la base de datos, devolvemos un 404
        if (rows.length === 0) {
            return res.status(404).json({
                message: "No se encontraron productos."
            });
        }
        
        // Devolvemos el total y el array de productos (payload)
        res.status(200).json({
            total: rows.length,
            payload: rows
        });

    } catch (error) {
        console.log("Error obteniendo productos: ", error.message);
        res.status(500).json({
            message: "Error interno al obtener productos."
        });
    }
};

/**
 * getProductById - Retorna un único producto según su id.
 * El id ya viene validado y parseado por el middleware validateId (req.id).
 * @route GET /api/products/:id
 */
export const getProductById = async (req, res) => {
    try {
        // Asume que un middleware previo validó y asignó el id a req.id
        const [rows] = await ProductModels.selectProductById(req.id);

        if(rows.length === 0) {
            return res.status(404).json({
                message: `No se encontró producto con id ${req.id}`
            });
        }

        // Devolvemos el primer (y único) resultado
        res.status(200).json({
            payload: rows[0]
        });

    } catch (error) {
        console.log("Error obteniendo producto con id: ", error.message);
        res.status(500).json({
            message: `Error interno al obtener un producto con id ${req.id}`
        });
    }
};

/**
 * createProduct - Crea un nuevo producto en la base de datos.
 * Valida que todos los campos requeridos estén presentes antes de insertar.
 * @route POST /api/products
 */
export const createProduct = async (req, res) => {
    try {
        const { name, image, category, price } = req.body;

        // Validación de campos requeridos
        if (!name || !image || !category || !price) {
            return res.status(400).json({
                message: "Datos inválidos, asegúrate de incluir todas las categorías."
            });
        }

        // Limpiamos espacios extra del nombre antes de guardar
        const cleanName = name.trim();
        const [rows] = await ProductModels.insertProduct(cleanName, image, category, price);

        // Devolvemos el id del producto recién creado
        res.status(201).json({
            message: `Producto creado con éxito con id ${rows.insertId}`,
            productId: rows.insertId
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno del servidor."
        });
    }
};

/**
 * modifyProduct - Actualiza los datos de un producto existente.
 * Verifica que al menos una fila fue afectada para confirmar que el producto existe.
 * @route PUT /api/products
 */
export const modifyProduct = async (req, res) => {
    try {
        const { id, name, image, category, price, active } = req.body;

        // Todos los campos son obligatorios para la actualización
        if (!name || !image || !price || !category) {
            return res.status(400).json({
                message: "Todos los campos son requeridos (name, image, price, category)"
            });
        }

        const [result] = await ProductModels.updateProduct(name, image, category, price, active, id);

        // Si affectedRows es 0, el producto con ese id no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "No se actualizó el producto."
            });
        }

        return res.status(200).json({
            message: `Producto con id ${id} actualizado correctamente.`
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error interno al actualizar el producto."
        });
    }
};

/**
 * removeProduct - Elimina un producto de la base de datos por su id.
 * El id ya viene validado por el middleware validateId (req.id).
 * @route DELETE /api/products/:id
 */
export const removeProduct = async (req, res) => {
    try {
        await ProductModels.deleteProduct(req.id);
        res.status(200).json({
            message: `Producto con id ${req.id} eliminado exitosamente.`
        });
    } catch (error) {
        console.log("Error en petición DELETE: ", error);
        res.status(500).json({
            message: "Error interno del servidor."
        });
    }
};