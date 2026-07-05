/*===================================
    Controladores de usuario
===================================*/

import connection from "../database/db.js";
import bcrypt from "bcrypt";

export const createAdminUser = async (req, res) => {
    try {
        const { nameUser, surnameUser, emailUser, passwordUser } = req.body;

        if (!nameUser || !surnameUser || !emailUser || !passwordUser) {
            return res.status(400).json({
                message: "Datos inválidos, faltan campos."
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(passwordUser, saltRounds);

        const sql = "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)";
        await connection.query(sql, [nameUser,surnameUser, emailUser, hashedPassword]);

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