document.addEventListener("DOMContentLoaded", () => {

    console.log("La Tóxica FM cargada correctamente");

    cargarBanners();

});

//======================================================
// CARGAR BANNERS EN LA PWA
//======================================================

async function cargarBanners() {

    const contenedor = document.getElementById("heroSlide");

    try {

        const respuesta = await fetch(
            "http://localhost:3000/api/banners"
        );

        const datos = await respuesta.json();

        console.log(datos);

        if (!datos.ok) {

            contenedor.innerHTML = "<p>Error al cargar banners.</p>";

            return;

        }

        const bannersActivos = datos.banners.filter(

            banner => banner.activo

        );

        if (bannersActivos.length === 0) {

            contenedor.innerHTML = "<p>No hay banners activos.</p>";

            return;

        }

        contenedor.innerHTML = "";

       

bannersActivos.forEach((banner, index) => {

    const imagenHero =

        window.innerWidth <= 768 && banner.imagenMobile

            ? banner.imagenMobile

            : banner.imagen;

    contenedor.innerHTML += `

        <img
            src="http://localhost:3000/uploads/banners/${imagenHero}"
            class="hero-image ${index === 0 ? "active" : ""}"
            alt="${banner.titulo}">

    `;

});












        //======================================
        // INICIAR SLIDER
        //======================================

        iniciarSlider();

    }

    catch (error) {

        console.error(error);

        contenedor.innerHTML =
            "<p>Error de conexión con el servidor.</p>";

    }

}

//======================================================
// SLIDER
//======================================================

function iniciarSlider() {

    const banners = document.querySelectorAll(".hero-image");

    if (banners.length <= 1) {

        return;

    }

    let actual = 0;

    setInterval(() => {

        banners[actual].classList.remove("active");

        actual++;

        if (actual >= banners.length) {

            actual = 0;

        }

        banners[actual].classList.add("active");

    }, 5000);

}


//======================================================
// RELOJ HERO
//======================================================

function actualizarHoraHero() {

    const hora = document.getElementById("heroHora");

    if (!hora) return;

    const ahora = new Date();

    hora.textContent = "🕒 " + ahora.toLocaleTimeString("es-MX", {

        hour: "2-digit",
        minute: "2-digit"

    });

}

actualizarHoraHero();

setInterval(actualizarHoraHero, 1000);









//======================================================
// CLIMA COMITÁN DE DOMÍNGUEZ
//======================================================

async function actualizarClimaHero() {

    const clima = document.getElementById("heroClima");

    if (!clima) return;

    try {

        const respuesta = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=16.2471&longitude=-92.1351&current=temperature_2m"
        );

        const datos = await respuesta.json();

        clima.textContent =
            "🌤 " + Math.round(datos.current.temperature_2m) + "°C";

    }

    catch (error) {

        console.error("Error obteniendo clima:", error);

        clima.textContent = "🌤 --°C";

    }

}

actualizarClimaHero();

// actualizar cada 10 minutos
setInterval(actualizarClimaHero, 600000);