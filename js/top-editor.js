const form = document.getElementById("formTop");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const datos = {

        posicion: document.getElementById("posicion").value,

        titulo: document.getElementById("titulo").value,

        artista: document.getElementById("artista").value,

        youtube: document.getElementById("youtube").value,

        activo: document.getElementById("activo").checked

    };

    try {

        const respuesta = await fetch("http://localhost:3000/api/top", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(datos)

        });

        const resultado = await respuesta.json();

        if (resultado.ok) {

            alert("✅ Canción guardada correctamente.");

            form.reset();

        }

        else {

            alert("Error: " + resultado.error);

        }

    }

    catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");

    }

});