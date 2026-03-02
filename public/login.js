document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("loginForm");
    const mensaje = document.getElementById("mensaje");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    // Mostrar / Ocultar contraseña
    togglePassword.addEventListener("click", function () {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
        } else {
            passwordInput.type = "password";
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
        }

    });

    // LOGIN
    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = passwordInput.value;

        try {

            const respuesta = await fetch("/login", {
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
                localStorage.setItem("token", data.token);
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