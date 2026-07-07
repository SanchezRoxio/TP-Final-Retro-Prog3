/*==============================================
    index.js - Punto de entrada del servidor
    Retro-Arcade Zone - Backend
================================================*/

/* ============ Importaciones ============ */
import express from "express"; 
import environments from "./src/api/config/environments.js";
import cors from "cors";
import session from "express-session";

// Importamos nuestras rutas, middlewares y utilidades desde el barril
import { loggerURL } from "./src/api/middlewares/middlewares.js";
import { authRoutes, productRoutes, userRoutes, viewRoutes, salesRoutes } from "./src/api/routes/index.js";
import { join, __dirname } from "./src/api/utils/index.js";

/* ============ Configuración inicial ============ */
const { port, session_key } = environments;
const app = express();
const PORT = port;

/* ============ Motor de plantillas ============ */
// Usamos EJS para renderizar las vistas del dashboard (panel de administración)
app.set("view engine", "ejs"); 
app.set("views", join(__dirname, "src/views")); 

/* ============ Middlewares globales ============ */
app.use(cors());                                                    // Habilita CORS para las peticiones del frontend
app.use(loggerURL);                                                 // Registra por consola cada solicitud entrante
app.use(express.json());                                            // Parsea el body en formato JSON
app.use(express.urlencoded({ extended: true }));                    // Parsea formularios HTML (application/x-www-form-urlencoded)
app.use(express.static(join(__dirname, "src/public")));             // Sirve archivos estáticos (CSS, JS, imágenes del dashboard)

/* ============ Configuración de sesiones ============ */
// Las sesiones se usan para proteger las rutas del dashboard (requireLogin)
app.use(session({
    secret: session_key,         // Clave secreta para firmar la cookie de sesión
    resave: false,               // No vuelve a guardar la sesión si no hubo cambios
    saveUninitialized: true      // Guarda la sesión aunque esté vacía
}));

/* ============ Rutas de la API ============ */
app.use("/api/products", productRoutes);  // CRUD de productos
app.use("/api/users", userRoutes);        // Creación de usuarios administradores
app.use("/api/sales", salesRoutes);       // Registro de ventas

/* ============ Rutas de vistas (Dashboard) ============ */
app.use("/dashboard", viewRoutes);        // Panel de administración (protegido con sesión)
app.use("/login", authRoutes);            // Autenticación
app.use("/", viewRoutes);                 // Ruta raíz también maneja vistas

/* ============ Inicio del servidor ============ */
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});