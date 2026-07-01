document.addEventListener("DOMContentLoaded", () => {

    const boton = document.getElementById("nuevoBanner");

    if (boton) {

        boton.addEventListener("click", () => {

            window.location.href = "editor.html";

        });

    }

    cargarBanners();

});

//=====================================================
// CARGAR BANNERS
//=====================================================

async function cargarBanners() {

    const tabla = document.getElementById("tablaBanners");

    tabla.innerHTML = `
        <tr>
            <td colspan="6">
                Cargando...
            </td>
        </tr>
    `;

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/banners"
        );

        if (!respuesta.ok) {

            throw new Error(
                "HTTP " + respuesta.status
            );

        }

        const datos = await respuesta.json();

        tabla.innerHTML = "";

        if (!datos.ok || datos.banners.length === 0) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="6" class="sin-registros">
                        No hay banners registrados.
                    </td>
                </tr>
            `;

            return;

        }

        datos.banners.forEach((banner, index) => {

            const fila = document.createElement("tr");

            fila.innerHTML = `

                <td>${index + 1}</td>

                <td>

                  ${
    banner.imagen || banner.imagenMobile

    ?

    `<img
        src="http://localhost:3000/uploads/banners/${
            banner.imagen || banner.imagenMobile
        }"
        width="120"
        style="border-radius:8px;">`

    :

    "Sin imagen"
}  










                </td>

                <td>${banner.titulo}</td>

                <td>${banner.orden}</td>

                <td>

                    ${banner.activo ? "🟢 Activo" : "🔴 Inactivo"}

                </td>

                <td>

                    <button
                        class="editar"
                        data-id="${banner.id}">
                        Editar
                    </button>

                    <button
                        class="eliminar"
                        data-id="${banner.id}">
                        Eliminar
                    </button>

                </td>

            `;

            tabla.appendChild(fila);

        });

        //=====================================
        // EVENTOS EDITAR
        //=====================================

        document.querySelectorAll(".editar")
            .forEach(boton => {

                boton.addEventListener("click", () => {

                    const id = boton.dataset.id;

                    window.location.href =
                        "editor.html?id=" + id;

                });

            });

        //=====================================
        // EVENTOS ELIMINAR
        //=====================================

        document.querySelectorAll(".eliminar")
            .forEach(boton => {

                boton.addEventListener("click", async () => {

                    const id = boton.dataset.id;

                    const confirmar = confirm(
                        "¿Deseas eliminar este banner?"
                    );

                    if (!confirmar) {

                        return;

                    }

                    try {

                        const respuesta = await fetch(

                            "http://localhost:3000/api/banners/" + id,

                            {
                                method: "DELETE"
                            }

                        );

                        if (!respuesta.ok) {

                            const error = await respuesta.json();

                            alert(
                                error.mensaje ||
                                "No fue posible eliminar."
                            );

                            return;

                        }

                        const datos = await respuesta.json();

                        alert(datos.mensaje);

                        cargarBanners();

                    }

                    catch (error) {

                        console.error(error);

                        alert(
                            "Error al conectar con el servidor."
                        );

                    }

                });

            });

    }

    catch (error) {

        console.error(error);

        tabla.innerHTML = `

            <tr>

                <td colspan="6">

                    Error al conectar con el servidor.

                </td>

            </tr>

        `;

    }

}