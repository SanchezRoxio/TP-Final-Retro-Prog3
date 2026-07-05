/*============================================================
    Lógica para trabajar con archivos y rutas del proyecto
==============================================================*/

// Convierte una URL de archivo (file://) a una ruta del sistema de archivos
import { fileURLToPath } from "url"; 

// dirname resuelve el directorio padre de una ruta
// join une segmentos de ruta de forma segura
import { dirname, join } from "path";

// Vamos a obtener el nombre del archivo actual
const __filename = fileURLToPath(import.meta.url); 

// Obtenemos el directorio del archivo actual y retrocedemos al nivel de la raíz
// Si este archivo está en src/api/utils/, subimos 3 niveles para llegar a la raíz (tplIntegradorBack)
const __dirname = join(dirname(__filename), "../../../");

// Gracias a esto, podremos construir rutas relativas desde la raíz de nuestro servidor
export {
    __dirname,
    join
}