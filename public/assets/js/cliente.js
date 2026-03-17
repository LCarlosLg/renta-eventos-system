const contenedor = document.getElementById("productos")

async function cargarProductos(busqueda = ''){

    const query = busqueda ? `?q=${encodeURIComponent(busqueda)}` : '';
    const res = await fetch(`/api/productos${query}`);
    const data = await res.json();

    contenedor.innerHTML=""

    data.forEach(producto => {

        contenedor.innerHTML += `
        <div class="card">
            <img src="/assets/img/${producto.imagen}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio_dia} por día</p>

            <button onclick="agregarCarrito('${producto.categoria}', ${producto.id})">
                Agregar
            </button>
        </div>
        `
    })
}

async function agregarCarrito(categoria, id){

    const token = localStorage.getItem("token")

    await fetch("/api/carrito",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
        },
        body:JSON.stringify({
            categoria,
            producto_id:id,
            cantidad:1
        })
    })

    alert("Producto agregado")
}

cargarProductos();

const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('btnBuscar');

searchBtn?.addEventListener('click', () => {
    cargarProductos(searchInput.value.trim());
});

searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        cargarProductos(searchInput.value.trim());
    }
});