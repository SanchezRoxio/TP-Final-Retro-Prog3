/*===============================
    Controladores productos
================================*/

import ProductModels from "../models/product.models.js";

// GET all products
export const getAllProducts = async (req, res) => {
    try {
        const [rows] = await ProductModels.selectAllProducts();
        
        if (rows.length === 0) {
            return res.status(404).json({
                message: "No se encontraron productos."
            });
        }
        
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

//////////////////////
// GET product by id
export const getProductById = async (req, res) => {
    try {
        // Asume que un middleware previo validó y asignó el id a req.id
        const [rows] = await ProductModels.selectProductById(req.id);

        if(rows.length === 0) {
            return res.status(404).json({
                message: `No se encontró producto con id ${req.id}`
            });
        }

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

//////////////////
// POST product
export const createProduct = async (req, res) => {
    try {
        const { name, image, category, price } = req.body;

        if (!name || !image || !category || !price) {
            return res.status(400).json({
                message: "Datos inválidos, asegúrate de incluir todas las categorías."
            });
        }

        const cleanName = name.trim();
        const [rows] = await ProductModels.insertProduct(cleanName, image, category, price);

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

//////////////////
// PUT product
export const modifyProduct = async (req, res) => {
    try {
        const { id, name, image, category, price, active } = req.body;

        if (!name || !image || !price || !category) {
            return res.status(400).json({
                message: "Todos los campos son requeridos (name, image, price, category)"
            });
        }

        const [result] = await ProductModels.updateProduct(name, image, category, price, active, id);

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

// DELETE product
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