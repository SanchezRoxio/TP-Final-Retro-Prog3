/*=========================
    Rutas producto
==========================*/

import { Router } from "express"; 
import { validateId, validateProduct } from "../middlewares/middlewares.js";
import { 
    createProduct, 
    getAllProducts, 
    getProductById, 
    modifyProduct, 
    removeProduct 
} from "../controllers/product.controllers.js";

const router = Router(); 

// GET all products
router.get("/", getAllProducts);

// GET product by id
// Antes de ejecutar el controlador, el middleware 'validateId' verifica que el ID sea correcto
router.get("/:id", validateId, getProductById);

// POST product
// 'validateProduct' asegura que los datos enviados cumplan con las reglas de negocio
router.post("/", validateProduct, createProduct);

// UPDATE product
router.put("/", modifyProduct);

// DELETE product
// Nuevamente usamos 'validateId' para asegurar que estamos borrando un ID válido
router.delete("/:id", validateId, removeProduct);

export default router;