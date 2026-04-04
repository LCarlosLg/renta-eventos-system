const lista = document.getElementById("carrito");

let carritoData = [];
let carritoAgrupado = [];

/* Cargar carrito */
async function cargarCarrito(){

    const token = localStorage.getItem("token");

    const res = await fetch("/api/carrito",{
        headers:{
            "Authorization":`Bearer ${token}`
        }
    });

    carritoData = await res.json();

    agruparCarrito();
    renderCarrito();
}

/*Agrupar carrito */
function agruparCarrito(){

    const mapa = {};

    carritoData.forEach(item => {

        const key = item.categoria + "-" + item.id_producto;

        if(!mapa[key]){
            mapa[key] = {
                ...item,
                cantidad: 0,
                ids: []
            };
        }

        mapa[key].cantidad += item.cantidad;
        mapa[key].ids.push(item.id_carrito);
    });

    carritoAgrupado = Object.values(mapa);
}

/* Renderizado del carrito */
function renderCarrito(){

    lista.innerHTML = "";

    if(carritoAgrupado.length === 0){
        lista.innerHTML = `
        <tr>
            <td colspan="5" class="carrito-vacio">🛒 Tu carrito está vacío</td>
        </tr>`;
        actualizarTotales();
        return;
    }

    carritoAgrupado.forEach(item => {

        const subtotal = item.precio_dia * item.cantidad;

        lista.innerHTML += `
        <tr>
            <td><strong>${item.nombre}</strong></td>

            <td>
                <div class="cantidad-box">
                    <button onclick="disminuir('${item.categoria}', ${item.id_producto})">-</button>
                    <span id="cant-${item.id_producto}">${item.cantidad}</span>
                    <button onclick="aumentar('${item.categoria}', ${item.id_producto})">+</button>
                </div>
            </td>

            <td>$${item.precio_dia}</td>

            <td id="sub-${item.id_producto}">
                $${subtotal}
            </td>

            <td>
                <button class="btn-eliminar" onclick="confirmarEliminar('${item.categoria}', ${item.id_producto})">
                    🗑️
                </button>
            </td>
        </tr>
        `;
    });

    actualizarTotales();
}

/* Aumentar */
async function aumentar(categoria, id){

    const token = localStorage.getItem("token");

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
    });

    cargarCarrito();
}

/* Disminuir */
async function disminuir(categoria, id){

    const item = carritoAgrupado.find(p => p.id_producto === id);

    if(item.cantidad <= 1){
        confirmarEliminar(categoria, id);
        return;
    }

    const token = localStorage.getItem("token");

    await fetch(`/api/carrito/${item.ids[0]}`,{
        method:"DELETE",
        headers:{
            "Authorization":`Bearer ${token}`
        }
    });

    cargarCarrito();
}

/* Confirmar antes de eliminar */
function confirmarEliminar(categoria, id){

    Swal.fire({
        title: '¿Eliminar producto?',
        text: 'Se eliminarán todas las unidades',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            eliminarTodo(categoria, id);
        }
    });
}

/* Elimina todos los elementos del carrito */
async function eliminarTodo(categoria, id){

    const item = carritoAgrupado.find(p => p.id_producto === id);
    const token = localStorage.getItem("token");

    for(const idCarrito of item.ids){
        await fetch(`/api/carrito/${idCarrito}`,{
            method:"DELETE",
            headers:{
                "Authorization":`Bearer ${token}`
            }
        });
    }

    Swal.fire({
        icon: 'success',
        title: 'Producto eliminado',
        timer: 1200,
        showConfirmButton: false
    });

    cargarCarrito();
}

/*  Actualizar totales */
function actualizarTotales(){

    let total = 0;
    let totalProductos = 0;

    carritoAgrupado.forEach(item => {
        total += item.precio_dia * item.cantidad;
        totalProductos += item.cantidad;
    });

    document.getElementById("total").innerText = total;
    document.getElementById("totalProductos").innerText = totalProductos;
}

/* Inicio */
cargarCarrito();