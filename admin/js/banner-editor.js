document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("bannerForm");

    const parametros = new URLSearchParams(window.location.search);

    const id = parametros.get("id");

    // ============================================
    // SI ES EDICIÓN
    // ============================================

    if (id) {

        cargarBanner(id);

    }

    // ============================================
    // GUARDAR
    // ============================================

    formulario.addEventListener("submit", async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append(
            "titulo",
            document.getElementById("titulo").value
        );

        formData.append(
            "descripcion",
            document.getElementById("descripcion").value
        );

        formData.append(
            "enlace",
            document.getElementById("enlace").value
        );

        formData.append(
            "activo",
            document.getElementById("activo").checked
        );

      

const imagen = document.getElementById("imagen").files[0];

if (imagen) {

    formData.append(
        "imagen",
        imagen
    );

}

const imagenMobile = document.getElementById("imagenMobile").files[0];

if (imagenMobile) {

    formData.append(
        "imagenMobile",
        imagenMobile
    );

}










        try {

            let url = "http://localhost:3000/api/banners";

            let metodo = "POST";

            if (id) {

                url += "/" + id;

                metodo = "PUT";

            }

            const respuesta = await fetch(url, {

                method: metodo,

                body: formData

            });

            const datos = await respuesta.json();

            console.log(datos);

            if (!datos.ok) {

                alert("Ocurrió un error.");

                return;

            }

            alert(

                id
                    ? "Banner actualizado correctamente."
                    : "Banner creado correctamente."

            );

            window.location.href = "index.html";

        }

        catch (error) {

            console.error(error);

            alert("No fue posible conectar con el servidor.");

        }

    });

});

//======================================================
// CARGAR BANNER
//======================================================

async function cargarBanner(id) {

    try {

        const respuesta = await fetch(

            "http://localhost:3000/api/banners/" + id

        );

        const datos = await respuesta.json();

        if (!datos.ok) {

            alert("No se encontró el banner.");

            window.location.href = "index.html";

            return;

        }

        const banner = datos.banner;

        document.getElementById("titulo").value =
            banner.titulo;

        document.getElementById("descripcion").value =
            banner.descripcion;

        document.getElementById("enlace").value =
            banner.enlace;

        document.getElementById("activo").checked =
            banner.activo;

    }

    catch (error) {

        console.error(error);

        alert("Error al cargar el banner.");

    }

}