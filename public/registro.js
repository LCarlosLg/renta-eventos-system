const form = document.getElementById('registroForm');
const mensaje = document.getElementById('mensaje');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

//  Mostrar u ocultar contraseña.
togglePassword.addEventListener('click',()=>{

    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        togglePassword.textContent = "🙈";
    }else{
        passwordInput.type = "password";
        togglePassword.textContent = "👁️";
    }

});

//  Formulario para el registro de usurios (clientes)

form.addEventListener('submit', async e=>{

    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const password = passwordInput.value.trim();

    // validación básica frontend
    if(!nombre || !email || !telefono || !password){
        mensaje.style.color="red";
        mensaje.innerText="Todos los campos son obligatorios";
        return;
    }

    try{

        const res = await fetch('http://localhost:5000/registro',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                nombre,
                email,
                telefono,
                password
            })
        });

        const data = await res.json();

        if(res.ok){

            mensaje.style.color="green";
            mensaje.innerText="Usuario registrado correctamente";

            form.reset();
            togglePassword.textContent="👁️";

            setTimeout(()=>{
                window.location.href="login.html";
            },1500);

        }else{

            mensaje.style.color="red";
            mensaje.innerText=data.mensaje || "Error al registrar";

        }

    }catch(err){

        console.error(err);
        mensaje.style.color="red";
        mensaje.innerText="Error de conexión con el servidor";

    }

});
