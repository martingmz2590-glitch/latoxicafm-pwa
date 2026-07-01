/*=========================================
    HERO ROTATION
=========================================*/

const banners = document.querySelectorAll(".hero-image");

let current = 0;

function rotateHero() {

    banners[current].classList.remove("active");

    current++;

    if (current >= banners.length) {
        current = 0;
    }

    banners[current].classList.add("active");

}

// Cambia cada 6 segundos
setInterval(rotateHero, 6000);