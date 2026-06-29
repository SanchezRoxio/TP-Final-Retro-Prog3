let nombreUsuario = sessionStorage.getItem("nombreUsuario");

if(!nombreUsuario && window.location.pathname.includes("productos.html")){
    window.location.href = "index.html";
}

// Variables //
let productos = []; 
let objetosCarrito = document.getElementById("cart-items");
let precioCarrito = document.getElementById("total-price");
let contadorCarrito = document.getElementById("cart-count");
let boton_imprimir = document.getElementById("btn-imprimir");
let carrito = [];

// Obtener productos //
const url = "http://localhost:3000/api/products"; 

async function obtenerProductos() {
    try {
        let respuesta = await fetch(url);
        let data = await respuesta.json();
        productos = data.payload; 
        mostrarProductos(productos);
    } catch(error) {
        console.error("Error al obtener productos:", error);
    }
}

// Mostrar productos //
function mostrarProductos(array) {
    let htmlProductos = "";
    const contenedor = document.getElementById("contenedor-productos");
    
    if (array.length === 0) {
        contenedor.innerHTML = "<p>No hay fichines disponibles.</p>";
        return;
    }

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

// Saludar usuario //
function saludarUsuario() {
    let saludoUsuario = document.getElementById("saludo-usuario");
    if(saludoUsuario) {
        saludoUsuario.innerHTML = `Bienvenidx ${nombreUsuario}!`;
    }
}

// Carrito //
function mostrarCarrito() {
    let carritoCompra = "";
    let precioTotal = 0;
    carrito.forEach((producto, indice) => {
        carritoCompra += `
            <li class="item-block">
                <p class="item-name">${producto.name} - $${producto.price}</p>
                <button class="btn-danger" onclick="eliminarProducto(${indice})">Eliminar</button>
            </li>
        `;
        precioTotal += parseInt(producto.price, 10);
    });

    objetosCarrito.innerHTML = carritoCompra || `<p class="info-carrito">No hay productos en el carrito.</p>`;
    precioCarrito.innerHTML = `$${precioTotal}`;
    contadorCarrito.innerHTML = carrito.length;

    const btnEmpty = document.getElementById("empty-cart");
    const btnPrint = document.getElementById("btn-imprimir");

    if(carrito.length > 0) {
        btnEmpty.classList.remove("hidden");
        btnPrint.classList.remove("hidden");
    } else {
        btnEmpty.classList.add("hidden");
        btnPrint.classList.add("hidden");
    }
}

function agregarCarrito(id) {
    let productoSeleccionado = productos.find(p => p.id === id);
    carrito.push(productoSeleccionado);
    mostrarCarrito();
}

function eliminarProducto(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    mostrarCarrito();
}

function imprimirTicket() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ format: [80, 150], unit: 'mm' });

    doc.setFont("courier", "bold");
    doc.setFontSize(14);
    doc.text("RETRO ARCADE", 40, 10, { align: "center" });
    
    doc.setFontSize(9);
    doc.setFont("courier", "normal");
    doc.text("Arcade-Ticket de compra", 40, 16, { align: "center" });
    
    // Línea discontinua
    doc.setLineDash([1, 1], 0);
    doc.line(10, 22, 70, 22);

    // --- LISTA DE PRODUCTOS ---
    let y = 30;
    doc.setFontSize(10);
    carrito.forEach(producto => {
        doc.text(`${producto.name}`, 10, y);
        doc.text(`$${producto.price}`, 70, y, { align: "right" });
        y += 8;
    });

    // --- ESTILO ---
    doc.line(10, y + 2, 70, y + 2);
    y += 12;
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    const total = carrito.reduce((sum, p) => sum + parseInt(p.price), 0);
    doc.text("TOTAL:", 10, y);
    doc.text(`$${total}`, 70, y, { align: "right" });

    doc.setFontSize(8);
    doc.setFont("courier", "normal");
    doc.text("¡Gracias por tu compra!", 40, y + 15, { align: "center" });

    doc.save(`ticket_${new Date().getTime()}.pdf`);

    registrarVenta(total, carrito.map(p => p.id));
}

// Registro de Ventas //
async function registrarVenta(precioTotal, idProductos) {
    try {
        const fechaFormato = new Date().toISOString().slice(0, 19).replace("T", " ");
        const data = { nombreUsuario, precioTotal, fechaEmision: fechaFormato, productos: idProductos };

        const response = await fetch("http://localhost:3000/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if(response.ok) {
            alert("Venta registrada con éxito");
            sessionStorage.removeItem("nombreUsuario");
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Error al enviar los datos", error);
    }
}

// Tema //
function inicializarTema() {
    const temaGuardado = localStorage.getItem("temaArcade") || "dark";
    document.documentElement.setAttribute("data-theme", temaGuardado);
    
    const btn = document.getElementById("btn-tema");
    if(btn) {
        btn.innerText = temaGuardado === "dark" ? "🌙" : "☀️";
    }
}

function alternarTema() {
    const nuevoTema = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nuevoTema);
    localStorage.setItem("temaArcade", nuevoTema);
}
document.addEventListener("DOMContentLoaded", inicializarTema);

// Inicializacion //
function init() {
    obtenerProductos();
    saludarUsuario();
    if(boton_imprimir) boton_imprimir.addEventListener("click", imprimirTicket);
    const temaGuardado = localStorage.getItem("temaArcade") || "dark";
    document.documentElement.setAttribute("data-theme", temaGuardado);
}
init(); 