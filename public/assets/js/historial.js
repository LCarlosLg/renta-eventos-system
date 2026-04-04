const contenedor = document.getElementById('historial');

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

cargarHistorial();