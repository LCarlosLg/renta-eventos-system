const form = document.getElementById('loginForm');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e)=>{

    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{

        const respuesta = await fetch('/login',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                email:email,
                password:password
            })
        });

        const data = await respuesta.json();

        if(respuesta.ok){

            mensaje.style.color="green";
            mensaje.innerText="Login correcto";

            // Guardar token 
            localStorage.setItem('token',data.token);

            console.log("Usuario:",data.usuario);


        }else{

            mensaje.style.color="red";
            mensaje.innerText=data.mensaje;

        }

    }catch(error){

        mensaje.style.color="red";
        mensaje.innerText="Error al conectar con el servidor";

    }

});
