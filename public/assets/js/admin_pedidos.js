async function cargarPedidos() {
    const token = localStorage.getItem('token');

    const res = await fetch('/api/pedidos', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) return;

    const data = await res.json();
    const tbody = document.getElementById('pedidos');

    tbody.innerHTML = '';

    data.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>${p.id_pedido}</td>
                <td>${p.nombre}</td>
                <td>${p.estado}</td>
                <td>${new Date(p.fecha).toLocaleString()}</td>
                <td>
                    <button onclick="actualizarEstado(${p.id_pedido}, 'confirmado')">Confirmar</button>
                    <button onclick="actualizarEstado(${p.id_pedido}, 'entregado')">Entregado</button>
                    <button onclick="actualizarEstado(${p.id_pedido}, 'cancelado')">Cancelar</button>
                </td>
            </tr>
        `;
    });
}

async function actualizarEstado(id, estado) {
    const token = localStorage.getItem('token');

    await fetch(`/api/pedidos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado })
    });

    cargarPedidos();
}

cargarPedidos();
