const contenedorProductos = document.getElementById("contenedor-productos");
const getProductForm = document.getElementById("getProduct-form");

getProductForm.addEventListener("submit", async event => {
    event.preventDefault(); 

    const idProd = event.target.idProd.value.trim();
    
    try {
        // Usamos ruta relativa /api/... para mejor portabilidad
        const response = await fetch(`/api/products/${idProd}`);
        const datos = await response.json();
        const producto = datos.payload;

        if (!producto) {
            contenedorProductos.innerHTML = `<p style="color: var(--btn-danger); font-weight: bold; text-align: center;">No se encontró ningún fichín con el ID ${idProd}</p>`;
            return;
        }

        renderizarProducto(producto);

    } catch (error) {
        console.error("Error al obtener el producto", error);
        contenedorProductos.innerHTML = `<p style="color: var(--btn-danger); font-weight: bold; text-align: center;">Error de conexión con el servidor.</p>`;
    }
});

function renderizarProducto(producto) {
    let htmlProducto = `
    <div class="card-producto">
        <img src="${producto.image}" alt="${producto.name}">
        <h4>${producto.name}</h4>
        <p>Id: ${producto.id}</p>
        <p class="precio">$${producto.price}</p>
    </div>
    `;

    contenedorProductos.innerHTML = htmlProducto;
}