// Lógica para crear productos
const postProductForm = document.getElementById("postProduct-form");
if (postProductForm) {
    postProductForm.addEventListener("submit", async event => {
        event.preventDefault();

        // Creamos el objeto manualmente para tener control total
        const data = {
            name: document.getElementById("nameProd").value,
            image: document.getElementById("imageProd").value,
            category: document.getElementById("categoryProd").value,
            price: Number(document.getElementById("priceProd").value),
            active: 1
        };

        console.log("Enviando JSON:", data);

        try {
            const response = await fetch("http://localhost:3000/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(result.message);
                postProductForm.reset();
            } else {
                // AQUÍ veremos exactamente qué está rechazando el backend
                console.error("Respuesta del servidor:", result);
                alert("Error: " + (result.errores ? result.errores.join(", ") : result.message));
            }
        } catch (error) {
            console.error("Error al enviar:", error);
        }
    });
}

// Lógica para crear usuarios
const postUserForm = document.getElementById("postUser-form");
postUserForm.addEventListener("submit", async event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        alert(result.message);
        if(response.ok) postUserForm.reset();
    } catch (error) {
        console.error("Error al enviar usuarios: ", error);
    }
});