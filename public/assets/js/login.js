document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");
    const mensaje = document.getElementById("mensaje");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    // Mostrar / Ocultar contraseña
    togglePassword.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            passwordInput.type = "password";
            togglePassword.classList.replace("fa-eye-slash", "fa-eye");
        }
    });

    // LOGIN
    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = passwordInput.value;

        try {

            const respuesta = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {

                mensaje.style.color = "green";
                mensaje.innerText = "Login correcto";

                // Guardamos token
                localStorage.setItem("token", data.token);

                // 🔥 Redirección por rol
                if (data.usuario.id_rol === 3) {
                    window.location.href = "/cliente/dashboard.html";
                } else {
                    window.location.href = "/admin/dashboard.html";
                }

            } else {
                mensaje.style.color = "red";
                mensaje.innerText = data.mensaje;
            }

        } catch (error) {
            mensaje.style.color = "red";
            mensaje.innerText = "Error al conectar con el servidor";
        }

    });

});