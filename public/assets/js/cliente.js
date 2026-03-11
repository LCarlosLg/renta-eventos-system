const contenedor = document.getElementById("productos")

async function cargarProductos(){

    const res = await fetch("/api/productos")
    const data = await res.json()

    contenedor.innerHTML=""

    data.forEach(producto => {

        contenedor.innerHTML += `
        <div class="card">
            <img src="/assets/img/${producto.imagen}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio_dia} por día</p>

            <button onclick="agregarCarrito(${producto.id})">
                Agregar
            </button>
        </div>
        `
    })
}

async function agregarCarrito(id){

    const token = localStorage.getItem("token")

    await fetch("/api/carrito",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
        },
        body:JSON.stringify({
            producto_id:id,
            cantidad:1
        })
    })

    alert("Producto agregado")
}

cargarProductos()