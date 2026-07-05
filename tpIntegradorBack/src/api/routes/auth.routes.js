/*===========================
    Rutas de autenticación
============================*/

import { Router } from "express";
import { destroySession, getAdminUser, loginView } from "../controllers/auth.controllers.js";

const router = Router();

// Vista login
// Cuando alguien entra a /login, se muestra el formulario
router.get("/", loginView);

// Obtener usuarios admin (Login)
// Cuando alguien envía el formulario de login
router.post("/", getAdminUser);

////////////////////
// Cerrar sesión
// Ruta para cerrar sesión
router.post("/destroy", destroySession);
export default router;