document.addEventListener("DOMContentLoaded", () => {
    // Referencias a los elementos del DOM que voy a usar
    const contenedorProductos = document.getElementById("contenedor-productos");
    const getProductForm = document.getElementById("deleteProduct-form");
    const urlBase = "http://localhost:3000/api/products";

    // Si no existe el formulario en esta vista, corto acá para que no rompa nada
    if (!getProductForm) return;

    // Escucho el envío del formulario para buscar el producto
    getProductForm.addEventListener("submit", async event => {
        event.preventDefault(); // Evito que la página se recargue

        const idProd = document.getElementById("idProdDelete").value.trim();
        if (!idProd) {
            mostrarError("Ingresá un id válido");
            return;
        }

        try {
            // Hago el GET para traer el producto por ID
            const response = await fetch(`${urlBase}/${idProd}`);
            const datos = await response.json();

            // Si el servidor tira error, muestro el mensaje y corto
            if (!response.ok) {
                mostrarError(datos.message || "Producto no encontrado");
                return;
            }

            // Si todo esta ok, renderizo el producto para mostrarlo
            renderizarProducto(datos.payload);
        } catch (error) {
            console.error("Error al obtener el producto:", error);
            mostrarError("Ocurrió un error al buscar el producto");
        }
    });

    // Funciones para actualizar el HTML según el estado
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

    // Dibujo el producto y agrego el botón de eliminar con el ID guardado
    function renderizarProducto(producto) {
        if (!contenedorProductos) return;
        contenedorProductos.innerHTML = `
        <div class="card-producto">
            <img src="${producto.image}" alt="${producto.name}">
            <h4>${producto.name}</h4>
            <p class="precio">Precio: $${producto.price}</p>
            <p>ID: ${producto.id}</p>
            <button type="button" id="deleteProduct-button" class="btn-danger" data-id="${producto.id}" 
                style="background-color: var(--btn-danger); color: #fff; border: none; padding: 10px; border-radius: 8px; cursor: pointer; margin-top: 10px; width: 100%;">
                Eliminar Producto
            </button>
        </div>
        `;
    }

    // escucho el click para capturar el botón de eliminar
    if (contenedorProductos) {
        contenedorProductos.addEventListener("click", (event) => {
            // Verifico que realmente se hizo click en mi botón
            if (event.target && event.target.id === "deleteProduct-button") {
                const id = event.target.getAttribute("data-id");
                // Pido confirmación antes de borrar
                if (confirm("¿Querés eliminar este producto?")) {
                    eliminarProducto(id);
                }
            }
        });
    }

    // Función para hacer el DELETE al servidor
    async function eliminarProducto(id) {
        try {
            const response = await fetch(`${urlBase}/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            // Si el servidor respondio ok, aviso al usuario
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