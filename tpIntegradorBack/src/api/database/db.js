//importamos mysql2 en modo promesas para poder usar async / await
import mysql from "mysql2/promise";
import environments from "../config/environments.js";

const { database } = environments;

//creamos el Pool de conexiones
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