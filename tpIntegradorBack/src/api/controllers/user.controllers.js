/*===================================
    Controladores de usuario
===================================*/

import connection from "../database/db.js";
import bcrypt from "bcrypt";

/**
 * createAdminUser - Crea un nuevo usuario administrador en la base de datos.
 * 
 * Valida que se reciban todos los campos, hashea la contraseña con bcrypt
 * antes de guardarla para no almacenar texto plano.
 * 
 * @route POST /api/users
 */
export const createAdminUser = async (req, res) => {
    try {
        // Extraemos los datos del cuerpo de la solicitud
        const { nameUser, surnameUser, emailUser, passwordUser } = req.body;

        // Validación: todos los campos son obligatorios
        if (!nameUser || !surnameUser || !emailUser || !passwordUser) {
            return res.status(400).json({
                message: "Datos inválidos, faltan campos."
            });
        }

        // Hasheamos la contraseña con 10 rondas de salt para mayor seguridad
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordUser, saltRounds);

        // Insertamos el nuevo usuario con la contraseña ya hasheada
        const sql = "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)";
        await connection.query(sql, [nameUser, surnameUser, emailUser, hashedPassword]);

        res.status(201).json({
            message: "Usuario admin creado con éxito."
        });

    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({
            message: "Error interno del servidor al crear usuario."
        });
    }
};