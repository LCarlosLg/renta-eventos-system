async function cargarHistorial() {
    const token = localStorage.getItem('token');

    const res = await fetch('/api/clientes/historial', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        return;
    }

    const data = await res.json();
    const tabla = document.getElementById('historial');

    tabla.innerHTML = '';

    data.forEach(item => {
        tabla.innerHTML += `
            <tr>
                <td>${item.id_pedido}</td>
                <td>${new Date(item.fecha).toLocaleString()}</td>
                <td>${item.estado}</td>
                <td>${item.nombre_producto || item.id_producto}</td>
                <td>${item.cantidad}</td>
                <td>$${item.precio_unitario}</td>
            </tr>
        `;
    });
}

cargarHistorial();
