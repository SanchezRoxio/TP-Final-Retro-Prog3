import express from "express"; 
import environments from "./src/api/config/environments.js";
import connection from "./src/api/database/db.js";
import cors from "cors";

// Config
const app = express();
const PORT = environments.port;

// Middlewares
app.use(cors()); 

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next(); 
});

app.use(express.json());

const validateId = (req, res, next) => {
    const { id } = req.params;

    if(!/^\d+$/.test(id)) {
        return res.status(400).json({
            error: "El ID debe ser un numero entero positivo"
        });
    }

    // Convertimos el string a numero entero entero base 10
    const parsedId = parseInt(id, 10);

    if(parsedId === 0) {
        return res.status(400).json({
            error: "El id debe ser mayor a 0"
        });
    }

    req.id = parsedId;
    next(); 
}

// Endpoints
app.get("/", (req, res) => {
    res.send("Servidor Retro-Arcade Zone corriendo con éxito");
});

// GET all 
app.get("/api/products", async (req, res) => {
    try {
        const sql = "SELECT id, name, price, image FROM products";

        const [rows] = await connection.query(sql); 

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No hay fichines cargados en el catálogo."
            })
        }

        res.status(200).json({
            total: rows.length,
            payload: rows
        });

    } catch (error) {
        console.error("Error obteniendo productos: ", error.message);
        res.status(500).json({
            message: "Error interno al obtener productos"
        })
    }
});

// GET 
app.get("/api/products/:id", validateId, async (req, res) => {
    try {
        const sql = "SELECT id, name, price, image, category, active FROM products WHERE id = ?";
        const [rows] = await connection.query(sql, [req.id]);

        if(rows.length === 0) {
            return res.status(404).json({
                error: `No se encontro producto con id ${req.id}`
            });
        }

        res.status(200).json({
            payload: rows[0]
        });

    } catch (error) {
        console.error("Error obteniendo producto con id: ", error.message);
        res.status(500).json({
            error: "Error interno al obtener un producto con id"
        })
    }
});

// POST
app.post("/api/products", async (req, res) => {
    try {
        const { name, image, category, price } = req.body;
        const sql = "INSERT INTO products (name, image, category, price) VALUES (?, ?, ?, ?)";

        await connection.query(sql, [name, image, category, price]);

        res.status(200).json({
            message: "¡Fichín creado con éxito!"
        });

    } catch (error) {
        console.error("Error al crear producto: ", error.message);
        res.status(500).json({
            error: "Error interno del servidor al crear producto"
        });
    }
});

// UPDATE
app.put("/api/products", async (req, res) => {
    try {
        const { id, name, image, category, price, active } = req.body;
        const sql = "UPDATE products SET name = ?, image = ?, category = ?, price = ?, active = ? WHERE id = ?";

        await connection.query(sql, [name, image, category, price, active, id]);

        return res.status(200).json({
            message: "¡Producto actualizado correctamente en MySQL!"
        });

    } catch (error) {
        console.error("Error al actualizar producto: ", error.message);
        res.status(500).json({
            error: "Error interno al intentar modificar el producto"
        });
    }
});

// DELETE
app.delete("/api/products/:id", validateId, async (req, res) => {
    try {
        const sql = "DELETE FROM products WHERE id = ?";
        const [result] = await connection.query(sql, [req.id]);

        res.status(200).json({
            message: `Fichín con ID ${req.id} eliminado del sistema correctamente.`
        });
    } catch (error) {
        console.error("Error al eliminar producto: ", error.message);
        res.status(500).json({
            error: "Error interno al intentar eliminar el producto"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo con éxito en el puerto ${PORT}`);
});