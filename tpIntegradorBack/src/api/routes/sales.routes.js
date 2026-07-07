import { Router } from 'express';
import { createSale } from '../controllers/sales.controllers.js';

const router = Router();
router.post("/", createSale);

export default router;