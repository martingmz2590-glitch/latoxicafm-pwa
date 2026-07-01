document.addEventListener("DOMContentLoaded", () => {

    const adminBtn = document.getElementById("adminBtn");
    const adminModal = document.getElementById("adminModal");
    const closeAdmin = document.getElementById("closeAdmin");
    const loginBtn = document.getElementById("adminLogin");

    // Abrir modal
    if (adminBtn) {

        adminBtn.addEventListener("click", function (e) {

            e.preventDefault();
            adminModal.style.display = "flex";

        });

    }

    // Cerrar modal
    if (closeAdmin) {

        closeAdmin.addEventListener("click", function () {

            adminModal.style.display = "none";

        });

    }

    // Iniciar sesión
    if (loginBtn) {

        loginBtn.addEventListener("click", function () {

            const usuario = document.getElementById("adminUser").value.trim();
            const password = document.getElementById("adminPass").value.trim();

            if (usuario === "admintox26" && password === "2700988xx") {

                window.location.href = "admin/dashboard.html";

            } else {

                alert("Usuario o contraseña incorrectos.");

            }

        });

    }

});