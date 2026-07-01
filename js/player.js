const radio = document.getElementById("radio");

const playBtn = document.getElementById("playBtn");



let playing = false;

/* URL DEL STREAM */

radio.src = "https://stream.zeno.fm/hxyirbncefqtv";

playBtn.addEventListener("click", () => {

    if (!playing) {

        radio.play();

        radioLogo.classList.add("logo-spinning");

        playBtn.innerHTML =
            '<i class="fa-solid fa-pause"></i>';

        playing = true;

    } else {

        radio.pause();

        radioLogo.classList.remove("logo-spinning");

        playBtn.innerHTML =
            '<i class="fa-solid fa-play"></i>';

        playing = false;

    }

});