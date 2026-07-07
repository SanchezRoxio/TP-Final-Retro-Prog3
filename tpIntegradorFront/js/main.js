/*==============================================
    main.js - Lógica del tótem de autoservicio
    Retro-Arcade Zone
================================================*/

// Recuperamos el nombre de usuario guardado en sessionStorage (desde index.html)
let nombreUsuario = sessionStorage.getItem("nombreUsuario");

// Si el usuario no ingresó su nombre y está en productos.html, lo redirigimos al inicio
if(!nombreUsuario && window.location.pathname.includes("productos.html")){
    window.location.href = "index.html";
}

/* ============ Variables globales ============ */
let productos = [];  // Array que almacena los productos cargados desde la API
let objetosCarrito = document.getElementById("cart-items");    // Lista del carrito en el DOM
let precioCarrito = document.getElementById("total-price");    // Elemento que muestra el precio total
let contadorCarrito = document.getElementById("cart-count");   // Badge con la cantidad de ítems
let boton_imprimir = document.getElementById("btn-imprimir");  // Botón para generar el ticket PDF

// Recuperamos el carrito guardado en localStorage (persiste aunque se recargue la página)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

/* ============ Obtener productos desde la API ============ */
const url = "http://localhost:3000/api/products"; 

/**
 * obtenerProductos - Hace un fetch a la API del backend y carga los productos.
 * Una vez obtenidos, llama a mostrarProductos() y mostrarCarrito() para renderizar.
 */
async function obtenerProductos() {
    try {
        let respuesta = await fetch(url);
        let data = await respuesta.json();
        productos = data.payload; // Guardamos los productos en la variable global
        mostrarProductos(productos);
        // Mostrar carrito una vez que tenemos los productos cargados
        mostrarCarrito();
    } catch(error) {
        console.error("Error al obtener productos:", error);
    }
}

/* ============ Mostrar productos en el DOM ============ */
/**
 * mostrarProductos - Genera dinámicamente las tarjetas de productos en la grilla.
 * @param {Array} array - Lista de objetos producto con { id, name, price, image }
 */
function mostrarProductos(array) {
    const contenedor = document.getElementById("contenedor-productos");
    if (!contenedor) return; // Si no existe el contenedor, salimos (estamos en index.html)
    
    let htmlProductos = "";

    // Si no hay productos en la base de datos, mostramos un mensaje informativo
    if (array.length === 0) {
        contenedor.innerHTML = "<p>No hay fichines disponibles.</p>";
        return;
    }

    // Construimos el HTML de cada tarjeta de producto
    array.forEach(producto => {
        htmlProductos += `
            <div class="card-producto">
                <img src="${producto.image}" alt="${producto.name}">
                <h4>${producto.name}</h4>
                <p>Id: ${producto.id}</p>
                <p class="precio">$${producto.price}</p>
                <button class="btn-success add-to-cart" onclick="agregarCarrito(${producto.id})">Agregar</button>
            </div>
        `;
    });
    contenedor.innerHTML = htmlProductos;
}

/* ============ Saludo al usuario ============ */
/**
 * saludarUsuario - Muestra un mensaje de bienvenida personalizado con el nombre del usuario.
 */
function saludarUsuario() {
    let saludoUsuario = document.getElementById("saludo-usuario");
    if(saludoUsuario) {
        saludoUsuario.innerHTML = `Bienvenidx ${nombreUsuario}!`;
    }
}

/* ============ Lógica del carrito ============ */

/**
 * mostrarCarrito - Renderiza el carrito actual en el DOM.
 * Actualiza la lista de ítems, el precio total, el contador del header
 * y la visibilidad de los botones de vaciar e imprimir.
 */
function mostrarCarrito() {
    // Si no existen los elementos en la página actual (ej: index.html), salimos
    if (!objetosCarrito) return;

    let carritoCompra = "";
    let precioTotal = 0;

    // Recorremos el carrito y generamos el HTML de cada ítem con su botón de eliminar
    carrito.forEach((producto, indice) => {
        carritoCompra += `
            <li class="item-block">
                <p class="item-name">${producto.name} - $${producto.price}</p>
                <button class="btn-danger" onclick="eliminarProducto(${indice})">Eliminar</button>
            </li>
        `;
        precioTotal += parseInt(producto.price, 10);
    });

    // Actualizamos el DOM con el contenido del carrito
    objetosCarrito.innerHTML = carritoCompra || `<p class="info-carrito">No hay productos en el carrito.</p>`;
    precioCarrito.innerHTML = `$${precioTotal}`;
    contadorCarrito.innerHTML = carrito.length;

    // Mostramos u ocultamos los botones según si el carrito tiene ítems
    const btnEmpty = document.getElementById("empty-cart");
    const btnPrint = document.getElementById("btn-imprimir");

    if(btnEmpty && btnPrint) {
        if(carrito.length > 0) {
            btnEmpty.classList.remove("hidden");
            btnPrint.classList.remove("hidden");
        } else {
            btnEmpty.classList.add("hidden");
            btnPrint.classList.add("hidden");
        }
    }
}

/**
 * agregarCarrito - Busca el producto por id y lo agrega al carrito.
 * Persiste el carrito actualizado en localStorage.
 * @param {number} id - Id del producto a agregar
 */
function agregarCarrito(id) {
    let productoSeleccionado = productos.find(p => p.id === id);
    if(productoSeleccionado) {
        carrito.push(productoSeleccionado);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        mostrarCarrito();
    }
}

/**
 * eliminarProducto - Elimina un producto del carrito según su posición (índice).
 * @param {number} index - Posición del producto en el array carrito
 */
function eliminarProducto(index) {
    carrito.splice(index, 1); // Eliminamos solo el elemento en esa posición
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

/**
 * vaciarCarrito - Limpia completamente el carrito y lo elimina del localStorage.
 */
function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
}

/* ============ Ticket PDF y registro de venta ============ */

/**
 * imprimirTicket - Genera un ticket de compra en formato PDF usando la librería jsPDF.
 * Al finalizar, llama a registrarVenta() para guardar la venta en el backend.
 */
function imprimirTicket() {
    const { jsPDF } = window.jspdf;

    // Creamos un documento PDF con tamaño tipo ticket (80mm x 150mm)
    const doc = new jsPDF({ format: [80, 150], unit: 'mm' });

    // Encabezado del ticket
    doc.setFont("courier", "bold");
    doc.setFontSize(14);
    doc.text("RETRO ARCADE", 40, 10, { align: "center" });
    doc.setFontSize(9);
    doc.text("Arcade-Ticket de compra", 40, 16, { align: "center" });

    // Línea divisoria punteada
    doc.setLineDash([1, 1], 0);
    doc.line(10, 22, 70, 22);

    // Listado de productos comprados
    let y = 30;
    doc.setFontSize(10);
    carrito.forEach(producto => {
        doc.text(`${producto.name}`, 10, y);
        doc.text(`$${producto.price}`, 70, y, { align: "right" });
        y += 8;
    });

    // Línea separadora antes del total
    doc.line(10, y + 2, 70, y + 2);
    y += 12;

    // Total de la compra
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    const total = carrito.reduce((sum, p) => sum + parseInt(p.price), 0);
    doc.text("TOTAL:", 10, y);
    doc.text(`$${total}`, 70, y, { align: "right" });

    // Mensaje de cierre del ticket
    doc.setFontSize(8);
    doc.text("¡Gracias por tu compra!", 40, y + 15, { align: "center" });

    // Guardamos el PDF con un nombre único basado en el timestamp
    doc.save(`ticket_${new Date().getTime()}.pdf`);

    // Registramos la venta en el backend con el total y los ids de los productos
    registrarVenta(total, carrito.map(p => p.id));
}

/**
 * registrarVenta - Envía los datos de la venta al backend vía POST.
 * Una vez confirmada, limpia la sesión/carrito y redirige al inicio.
 * @param {number} precioTotal - Suma total de la venta
 * @param {number[]} idProductos - Array de ids de los productos comprados
 */
async function registrarVenta(precioTotal, idProductos) {
    try {
        // Formateamos la fecha al formato compatible con MySQL (YYYY-MM-DD HH:MM:SS)
        const fechaFormato = new Date().toISOString().slice(0, 19).replace("T", " ");
        const data = { nombreUsuario, precioTotal, fechaEmision: fechaFormato, productos: idProductos };

        const response = await fetch("http://localhost:3000/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if(response.ok) {
            alert("Venta registrada con éxito");
            // Limpiamos los datos de la sesión actual y redirigimos al inicio
            sessionStorage.removeItem("nombreUsuario");
            localStorage.removeItem("carrito"); // Limpiar carrito al finalizar
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error al enviar los datos", error);
    }
}

/* ============ Tema claro / oscuro ============ */

/**
 * inicializarTema - Lee el tema guardado en localStorage y lo aplica al documento.
 * También actualiza el ícono del botón de cambio de tema.
 */
function inicializarTema() {
    const temaGuardado = localStorage.getItem("temaArcade") || "dark";
    document.documentElement.setAttribute("data-theme", temaGuardado);
    const btn = document.getElementById("btn-tema");
    if(btn) {
        btn.innerText = temaGuardado === "dark" ? "🌙" : "☀️";
    }
}

/**
 * alternarTema - Cambia entre el tema oscuro y el claro, y lo persiste en localStorage.
 */
function alternarTema() {
    const nuevoTema = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nuevoTema);
    localStorage.setItem("temaArcade", nuevoTema);
    inicializarTema();
}

// Aplicamos el tema al cargar el DOM para evitar el "flash" de tema incorrecto
document.addEventListener("DOMContentLoaded", inicializarTema);

/* ============ Inicialización ============ */

/**
 * init - Punto de entrada principal. Llama a todas las funciones de arranque.
 */
function init() {
    obtenerProductos();
    saludarUsuario();
    // Solo asignamos el listener si el botón existe en la página actual
    if(boton_imprimir) boton_imprimir.addEventListener("click", imprimirTicket);
}

init();