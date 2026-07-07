/*=========================
    Archivo de barril
==========================*/

// Importa todas las rutas, las centraliza aca y las exporta
import productRoutes from "./product.routes.js";
import viewRoutes from "./view.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import salesRoutes from "./sales.routes.js";

export {
    productRoutes,
    viewRoutes,
    authRoutes,
    userRoutes,
    salesRoutes
};