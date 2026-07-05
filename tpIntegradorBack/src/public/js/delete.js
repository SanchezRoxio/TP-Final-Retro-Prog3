document.addEventListener("DOMContentLoaded", () => {
    const contenedorProductos = document.getElementById("contenedor-productos");
    const getProductForm = document.getElementById("deleteProduct-form");
    const urlBase = "http://localhost:3000/api/products";

    if (!getProductForm) return;

    getProductForm.addEventListener("submit", async event => {
        event.preventDefault();

        const idProd = document.getElementById("idProdDelete").value.trim();
        if (!idProd) {
            mostrarError("Ingresá un id válido");
            return;
        }

        try {
            const response = await fetch(`${urlBase}/${idProd}`);
            const datos = await response.json();

            if (!response.ok) {
                mostrarError(datos.message || "Producto no encontrado");
                return;
            }

            renderizarProducto(datos.payload);
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            mostrarError("Ocurrió un error al buscar el producto");
        }
    });

    function mostrarError(mensaje) {
        if (contenedorProductos) {
            contenedorProductos.innerHTML = `<p class="mensaje mensaje-error">${mensaje}</p>`;
        }
    }

    function mostrarExito(mensaje) {
        if (contenedorProductos) {
            contenedorProductos.innerHTML = `<p class="mensaje mensaje-exito">${mensaje}</p>`;
        }
    }

    function renderizarProducto(producto) {
        if (!contenedorProductos) return;
        contenedorProductos.innerHTML = `
        <div class="card-producto">
            <img src="${producto.image}" alt="${producto.name}">
            <h4>${producto.name}</h4>
            <p class="precio">Precio: $${producto.price}</p>
            <p>ID: ${producto.id}</p>
            <!-- Usamos un botón con estilo de Danger (rojo) -->
            <button type="button" id="deleteProduct-button" class="btn-danger" data-id="${producto.id}" 
                style="background-color: var(--btn-danger); color: #fff; border: none; padding: 10px; border-radius: 8px; cursor: pointer; margin-top: 10px; width: 100%;">
                Eliminar Producto
            </button>
        </div>
        `;
    }

    // escuchamos en el contenedor para capturar el click del botón
    if (contenedorProductos) {
        contenedorProductos.addEventListener("click", (event) => {
            if (event.target && event.target.id === "deleteProduct-button") {
                const id = event.target.getAttribute("data-id");
                if (confirm("¿Querés eliminar este producto?")) {
                    eliminarProducto(id);
                }
            }
        });
    }

    async function eliminarProducto(id) {
        try {
            const response = await fetch(`${urlBase}/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (response.ok) {
                mostrarExito(result.message);
            } else {
                console.error("Error: ", result.message);
                mostrarError("No se pudo eliminar el producto");
            }
        } catch (error) {
            console.error("Error en la solicitud DELETE: ", error);
            mostrarError("Ocurrió un error al eliminar el producto");
        }
    }
});