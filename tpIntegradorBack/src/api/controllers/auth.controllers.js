/*===================================
    Controladores de autenticacion
===================================*/

import connection from "../database/db.js";
import bcrypt from "bcrypt";

// Vista Login
export const loginView = (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Introducí tus credenciales 🔑"
    });
};

// Obtener usuarios admin (Login)
export const getAdminUser = async (req, res) => {
    console.log("--- LOGIN ---");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render("login", {
                title: "Login",
                about: "Introducí tus credenciales 🔑",
                error: "Todos los campos son obligatorios."
            });
        }

        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await connection.query(sql, [email]);
        
        console.log("Usuario encontrado en DB:", rows.length > 0 ? "SI" : "NO");

        if (rows.length === 0) {
            return res.render("login", {
                title: "Login",
                about: "Introducí tus credenciales 🔑",
                error: "Credenciales incorrectas"
            });
        }
        
        const user = rows[0];
        
        // Comparación segura con bcrypt
        const match = await bcrypt.compare(password, user.password);
        
        console.log("Resultado del match:", match);
        
        if (match) {
            req.session.user = {
                id: user.id,
                nombre: user.name,
                apellido: user.surnameUser,
                email: user.email
            };
            res.redirect("/dashboard/index");
        } else {
            return res.render("login", {
                title: "Login",
                about: "Introducí tus credenciales 🔑",
                error: "Contraseña incorrecta"
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send("Error interno del servidor.");
    }
};

// Destruir sesión
export const destroySession = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesion: ", err);
            return res.status(500).json({
                message: "Error al cerrar sesion."
            });
        }
        res.redirect("/login");
    });
};