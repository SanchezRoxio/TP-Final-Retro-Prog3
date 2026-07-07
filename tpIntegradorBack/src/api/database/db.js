/*==============================================
    db.js - Conexión a la base de datos MySQL
================================================*/

// Importamos mysql2 en modo promesas para poder usar async/await en los modelos
import mysql from "mysql2/promise";
import environments from "../config/environments.js";

const { database } = environments;

/*
    Creamos un Pool de conexiones en lugar de una conexión única.
    El Pool reutiliza las conexiones existentes en vez de abrir una nueva
    por cada consulta, lo que mejora el rendimiento de la aplicación.
    
    - waitForConnections: si no hay conexiones libres, la solicitud espera
    - connectionLimit: máximo de conexiones simultáneas abiertas
    - queueLimit: 0 = sin límite de solicitudes en cola
*/
const connection = mysql.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default connection;