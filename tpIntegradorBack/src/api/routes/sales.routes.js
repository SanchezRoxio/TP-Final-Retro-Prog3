/*=========================
    Rutas de ventas
==========================*/

import { Router } from 'express';
import { createSale } from '../controllers/sales.controllers.js';

const router = Router();

// POST /api/sales - Recibe los datos de una venta y la registra en la base de datos
router.post("/", createSale);

export default router;