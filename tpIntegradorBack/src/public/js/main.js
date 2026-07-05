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

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", inicializarTema);