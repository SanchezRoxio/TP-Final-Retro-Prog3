const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");
const contenedorForm = document.getElementById("contenedor-form");

getProductForm.addEventListener("submit", async event => {
    event.preventDefault(); 

    const idProd = event.target.idProd.value.trim();
    
    try {
        const response = await fetch(`/api/products/${idProd}`);
        const datos = await response.json();
        const producto = datos.payload;

        if (!producto) {
            contenedorProductos.innerHTML = "<p style='color: #ff073a; font-weight: bold;'>Producto no encontrado en la base de datos.</p>";
            contenedorForm.style.display = "none";
            return;
        }

        renderizarProducto(producto);
    } catch (error) {
        console.error("Error al obtener el producto", error);
    }
});

function renderizarProducto(producto) {
    contenedorForm.style.display = "none";

    let htmlProducto = `
    <div class="card-producto">
        <img src="${producto.image}" alt="${producto.name}">
        <h4>${producto.name}</h4>
        <p>Id: ${producto.id}</p>
        <p class="precio">$${producto.price}</p>
        <input type="button" id="updateProduct-button" value="Actualizar Producto" style="background-color: var(--accent-neon); color: #000; font-weight: bold; border-radius: 8px; padding: 10px; width: 100%; cursor: pointer; border: none; margin-top: 10px; text-transform: uppercase;">
    </div>
    `;

    contenedorProductos.innerHTML = htmlProducto;
    document.getElementById("updateProduct-button").addEventListener("click", event => {
        event.stopPropagation();
        formularioPutProducto(event, producto);
    });
}

function formularioPutProducto(event, producto) {
    event.stopPropagation();

    let htmlUpdateForm = `
        <h2>Actualizar producto</h2>
        <form id="updateProduct-form">
            <input type="hidden" id="idProd" name="id" value="${producto.id}">
            <label for="nameProd">Nombre</label>
            <input type="text" name="name" id="nameProd" value="${producto.name}" required>
            <label for="imageProd">Imagen</label>
            <input type="text" name="image" id="imageProd" value="${producto.image}" required>
            <label for="categoryProd">Categoria</label>
            <select name="category" id="categoryProd" required>
                <option value="classic" ${producto.category === 'classic' ? 'selected' : ''}>Clásico Retro (80s)</option>
                <option value="fighting" ${producto.category === 'fighting' ? 'selected' : ''}>Lucha / Pelea (90s)</option>
                <option value="racing" ${producto.category === 'racing' ? 'selected' : ''}>Simulador / Carreras</option>
            </select>
            <label for="priceProd">Precio</label>
            <input type="number" name="price" id="priceProd" value="${producto.price}" required>
            <label for="activeProd">Estado</label>
            <select name="active" id="activeProd" required>
                <option value="1" ${producto.active == 1 ? 'selected' : ''}>Activo</option>
                <option value="0" ${producto.active == 0 ? 'selected' : ''}>Oculto / Inactivo</option>
            </select>
            <div>
                <input type="submit" value="Confirmar Cambios en Servidor">
            </div>
        </form>
    `;

    contenedorForm.innerHTML = htmlUpdateForm;
    contenedorForm.style.display = "block";
    document.getElementById("updateProduct-form").addEventListener("submit", actualizarProducto);
}

async function actualizarProducto(event) {
    event.preventDefault();
    if(!confirm("¿Querés actualizar este producto?")) return;

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch("/api/products", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if(response.ok) {
            alert(result.message);
            location.reload();
        } else {
            alert(`Error del servidor: ${result.message}`);
        }
    } catch (error) {
        alert("Error al conectar con el servidor backend.");
    }
}