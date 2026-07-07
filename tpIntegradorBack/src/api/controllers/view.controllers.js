/*===============================
    Controladores de vistas
================================*/

// Importamos el modelo de los productos para poder comunicarlos con la BBDD
import ProductModels from "../models/product.models.js";

/**
 * indexView - Renderiza la vista principal del dashboard.
 * Obtiene todos los productos activos y los pasa a la plantilla EJS.
 * @route GET /dashboard/index
 */
export const indexView = async (req, res) => {
    try {
        // Consultamos todos los productos para mostrarlos en la tabla del dashboard
        const [rows] = await ProductModels.selectAllProducts();

        res.render("index", {
            title: "Inicio",
            about: "Nuestros productos:",
            productsArray: rows
        });
    } catch (error) {
        console.log("Error al cargar la vista index:", error);
        res.status(500).send("Error al cargar la página de inicio.");
    }
};

/**
 * getView - Renderiza la vista para consultar un producto por id.
 * @route GET /dashboard/get
 */
export const getView = (req, res) => {
    res.render("get", {
        title: "Consultar",
        about: "Consultar producto por id"
    });
};

/**
 * createView - Renderiza la vista para crear un nuevo producto.
 * @route GET /dashboard/post
 */
export const createView = (req, res) => {
    res.render("post", {
        title: "Crear",
        about: "Crear producto"
    });
};

/**
 * updateView - Renderiza la vista para modificar un producto existente.
 * @route GET /dashboard/put
 */
export const updateView = (req, res) => {
    res.render("put", {
        title: "Modificar",
        about: "Consultar producto por id"
    });
};

/**
 * deleteView - Renderiza la vista para eliminar un producto.
 * @route GET /dashboard/delete
 */
export const deleteView = (req, res) => {
    res.render("delete", {
        title: "Eliminar",
        about: "Consultar producto por id"
    });
};