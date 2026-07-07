/*==============================================
    environments.js - Variables de entorno
================================================*/

// Cargamos dotenv para procesar las variables del archivo .env
import dotenv from "dotenv";

// Inyectamos las variables del .env en process.env
dotenv.config();

/*
    Exportamos un objeto centralizado con todas las configuraciones del entorno.
    Si una variable de entorno no está definida en .env, usamos valores por defecto
    para que la aplicación pueda correr en desarrollo sin configuración extra.
*/
export default {
    // Puerto del servidor (por defecto 3000 si no se define PORT en .env)
    port: process.env.PORT || 3000,
    
    // Clave secreta para firmar las cookies de sesión
    session_key: process.env.SESSION_KEY || "una_clave_secreta_muy_larga_y_segura",
    
    // Credenciales de la base de datos MySQL
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
};