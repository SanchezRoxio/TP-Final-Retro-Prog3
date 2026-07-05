/*=========================
    Rutas usuario
==========================*/

import { Router } from "express"; 
import { createAdminUser } from "../controllers/user.controllers.js";

const router = Router(); 

// POST user
// Ruta encargada de recibir los datos para registrar un nuevo administrador
router.post("/", createAdminUser);

export default router;