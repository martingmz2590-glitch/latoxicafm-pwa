document.addEventListener("DOMContentLoaded", () => {

    console.log("LOGIN CARGADO");

    const form = document.getElementById("loginForm");

    form.addEventListener("submit", function(e){

        e.preventDefault();

        console.log("BOTÓN PRESIONADO");

        window.location.href = "dashboard.html";

    });

});