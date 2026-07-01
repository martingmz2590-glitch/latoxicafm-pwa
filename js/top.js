console.log("===== TOP.JS CARGADO =====");

const tbody = document.getElementById("tablaTop");

async function cargarTop() {

    console.log("Consultando API...");

    try {

        const respuesta = await fetch("http://localhost:3000/api/top");

        console.log("Status:", respuesta.status);

        if (!respuesta.ok) {

            throw new Error("HTTP " + respuesta.status);

        }

        const datos = await respuesta.json();

        console.log("Respuesta:", datos);

        if (!datos.ok) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Error al obtener las canciones.
                    </td>
                </tr>
            `;
            return;

        }

        if (!Array.isArray(datos.canciones) || datos.canciones.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="5">
                        No hay canciones registradas.
                    </td>
                </tr>
            `;
            return;

        }

        tbody.innerHTML = "";

        datos.canciones
            .sort((a, b) => a.posicion - b.posicion)
            .forEach(cancion => {

                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${cancion.posicion}</td>
                    <td>${cancion.titulo}</td>
                    <td>${cancion.artista}</td>
                    <td>${cancion.activo ? "✅ Activa" : "❌ Oculta"}</td>
                    <td>
                        <button onclick="editar(${cancion.id})">
                            ✏️
                        </button>

                        <button onclick="eliminarCancion(${cancion.id})">
                            🗑️
                        </button>
                    </td>
                `;

                tbody.appendChild(fila);

            });

        console.log("Canciones cargadas:", datos.canciones.length);

    }

    catch (err) {

        console.error("ERROR:", err);

        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    Error al conectar con el servidor.
                </td>
            </tr>
        `;

    }

}

function editar(id) {

    location.href = `editor.html?id=${id}`;

}

function eliminarCancion(id) {

    if (!confirm("¿Eliminar esta canción?")) {

        return;

    }

    alert("Pendiente implementar eliminación. ID: " + id);

}

window.addEventListener("DOMContentLoaded", () => {

    cargarTop();

});