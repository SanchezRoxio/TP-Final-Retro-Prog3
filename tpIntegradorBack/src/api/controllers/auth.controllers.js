/*===============================
    Controladores de autenticacion
===================================*/

import connection from "../database/db.js";
import bcrypt from "bcrypt";

/**
 * loginView - Renderiza la vista del formulario de login.
 * @route GET /login
 */
export const loginView = (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Introducí tus credenciales 🔑"
    });
};

/**
 * getAdminUser - Maneja el inicio de sesión de un administrador.
 * 
 * Busca al usuario por email en la base de datos y luego
 * compara la contraseña ingresada con el hash guardado usando bcrypt.
 * Si las credenciales son correctas, crea la sesión y redirige al dashboard.
 * 
 * @route POST /login
 */
export const getAdminUser = async (req, res) => {
    console.log("--- LOGIN ---");
    try {
        const { email, password } = req.body;

        // Validación: ambos campos son obligatorios
        if (!email || !password) {
            return res.render("login", {
                title: "Login",
                about: "Introducí tus credenciales 🔑",
                error: "Todos los campos son obligatorios."
            });
        }

        // Buscamos al usuario por email (usamos ? para evitar inyección SQL)
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await connection.query(sql, [email]);
        
        console.log("Usuario encontrado en DB:", rows.length > 0 ? "SI" : "NO");

        // Si no existe ningún usuario con ese email, informamos el error
        if (rows.length === 0) {
            return res.render("login", {
                title: "Login",
                about: "Introducí tus credenciales 🔑",
                error: "Credenciales incorrectas"
            });
        }
        
        const user = rows[0];
        
        // Comparación segura: bcrypt verifica la contraseña contra el hash almacenado
        const match = await bcrypt.compare(password, user.password);
        
        console.log("Resultado del match:", match);
        
        if (match) {
            // Guardamos los datos del usuario en la sesión para las rutas protegidas
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

/**
 * destroySession - Cierra la sesión del usuario y redirige al login.
 * @route POST /login/destroy
 */
export const destroySession = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error al destruir la sesion: ", err);
            return res.status(500).json({
                message: "Error al cerrar sesion."
            });
        }
        // Sesión eliminada correctamente, redirigimos a la pantalla de login
        res.redirect("/login");
    });
};