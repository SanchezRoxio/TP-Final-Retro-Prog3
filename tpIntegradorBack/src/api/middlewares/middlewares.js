/*=========================
    Middlewares
=========================*/

// Middleware logger para mostrar todas las solicitudes por consola
const loggerURL = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next(); 
}

// Middleware de ruta para filtrar ids no válidos
const validateId = (req, res, next) => {
    const { id } = req.params;

    // REGEX para aceptar solo dígitos enteros positivos
    if(!/^\d+$/.test(id)) {
        return res.status(400).json({
            message: "El ID debe ser un número entero positivo"
        });
    }

    const parsedId = parseInt(id, 10);

    if(parsedId === 0) {
        return res.status(400).json({
            message: "El id debe ser mayor a 0"
        });
    }

    req.id = parsedId; // Adjuntamos el id limpio al objeto req
    next();
}

// Middleware de ruta para validar los campos de un formulario
const categoriasValidas = ["classic", "fighting", "racing"];
const validateProduct = (req, res, next) => {
    const { name, price, category } = req.body;
    const errores = [];

    if (typeof name !== "string" || name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (typeof price !== "number" || price <= 0) {
        errores.push("El precio debe ser un número mayor a 0");
    }

    if (!categoriasValidas.includes(category)) {
        errores.push("Categoría inválida");
    }

    if (errores.length > 0) {
        return res.status(400).json({
            message: "Datos inválidos", errores
        });
    }

    next();
}

// Middleware de ruta básico para protección de rutas
const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

// Exportamos nuestros middlewares
export {
    loggerURL,
    validateId,
    validateProduct,
    requireLogin
}