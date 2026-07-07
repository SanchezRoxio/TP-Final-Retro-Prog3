// Importaciones
import express from "express"; 
import environments from "./src/api/config/environments.js";
import cors from "cors";
import session from "express-session";

// Importamos nuestras rutas, middlewares y utilidades desde el barril
import { loggerURL } from "./src/api/middlewares/middlewares.js";
import { authRoutes, productRoutes, userRoutes, viewRoutes, salesRoutes } from "./src/api/routes/index.js";
import { join, __dirname } from "./src/api/utils/index.js";

// Config
const { port, session_key } = environments;
const app = express();
const PORT = port;

// Motor de plantillas EJS
app.set("view engine", "ejs"); 
app.set("views", join(__dirname, "src/views")); 

// Middlewares
app.use(cors()); 
app.use(loggerURL); // Usamos el logger centralizado
app.use(express.json()); // Parsea JSON
app.use(express.urlencoded({ extended: true })); // Parsea formularios HTML
app.use(express.static(join(__dirname, "src/public"))); // Sirve archivos estáticos

// Sesión
app.use(session({
    secret: session_key,
    resave: false,
    saveUninitialized: true
}));

// Rutas
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/dashboard", viewRoutes);
app.use("/login", authRoutes);
app.use("/", viewRoutes);
app.use("/api/sales", salesRoutes); 

// Ruta raíz 
app.get("/", (req, res) => {
    res.redirect("/login");
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});