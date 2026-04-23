const contenedor = document.getElementById('historial');

// =======================
// 👤 AVATAR NAVBAR
// =======================
async function cargarAvatarNavbar(){

    const token = localStorage.getItem("token");
    if(!token) return;

    try{
        const res = await fetch('/api/clientes/perfil', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if(!res.ok) return;

        const data = await res.json();

        if(data.imagen){
            const avatar = document.getElementById("avatarNavbar");

            if(avatar){
                avatar.src = `/uploads/${data.imagen}?t=${Date.now()}`;
            }
        }

    }catch(err){
        console.error("Error avatar:", err);
    }
}

async function cargarHistorial(){
    const token = localStorage.getItem('token');

    const res = await fetch('/api/clientes/historial',{
        headers:{ Authorization:`Bearer ${token}` }
    });

    const data = await res.json();
    contenedor.innerHTML = "";

    if(data.length === 0){
        contenedor.innerHTML = "<p>No tienes pedidos</p>";
        return;
    }

    // Agrupación de pedidos, para evitar repetir información y mostrar todo ordenado
    const pedidos = {};

    data.forEach(item => {
        if(!pedidos[item.id_pedido]){
            pedidos[item.id_pedido] = {
                fecha: item.fecha,
                estado: item.estado,
                productos: []
            };
        }

        pedidos[item.id_pedido].productos.push(item);
    });

    // Renderiazdo de pedidos
    Object.keys(pedidos).forEach(id => {

        const pedido = pedidos[id];

        let total = 0;

        let productosHTML = pedido.productos.map(p => {
            total += p.precio_unitario * p.cantidad;

            return `
                <div class="producto-item">
                    ${p.nombre_producto} x${p.cantidad} - $${p.precio_unitario}
                </div>
            `;
        }).join("");

        contenedor.innerHTML += `
        <div class="col-md-4">
            <div class="card card-historial">

                <div class="card-header">
                    Pedido #${id}
                </div>

                <div class="card-body">

                    <p>${new Date(pedido.fecha).toLocaleDateString()}</p>
                    <p><span class="estado ${pedido.estado}">${pedido.estado}</span></p>

                    ${productosHTML}

                    <p class="total">Total: $${total}</p>

                    <button class="btn btn-detalle w-100"
                        onclick='verDetalle(${JSON.stringify(pedido)})'>
                        Ver detalle
                    </button>

                </div>

            </div>
        </div>
        `;
    });
}

// Modal
function verDetalle(pedido){
    const cont = document.getElementById("detalleContenido");

    let productos = pedido.productos.map(p => `
        <li>${p.nombre_producto} x${p.cantidad} - $${p.precio_unitario}</li>
    `).join("");

    cont.innerHTML = `
        <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleString()}</p>
        <p><strong>Estado:</strong> ${pedido.estado}</p>
        <ul>${productos}</ul>
    `;

    new bootstrap.Modal(document.getElementById('modalDetalle')).show();
}

// Logica para que el boton de cerrar sesión funcione en las pantallas correspondientes
function cerrarSesion(){

    Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro de que quieres salir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#7b2ff7',
        cancelButtonColor: '#aaa'
    }).then((result) => {

        if(result.isConfirmed){

            // Limpia datos de sesión (ajusta si usas otra cosa)
            localStorage.removeItem("usuario");

            //  Redirigir al login
            window.location.href = "../auth/login.html";
        }

    });
}

cargarHistorial();
cargarAvatarNavbar();