async function cargarInventario(){

    const res = await fetch("/api/productos")
    const data = await res.json()

    const tabla = document.getElementById("inventario")

    if (!tabla) return;

    tabla.innerHTML=""

    data.forEach(p=>{

        tabla.innerHTML += `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.cantidad_disponible ?? p.cantidad_total ?? '-'}</td>
            <td>$${p.precio_dia}</td>
        </tr>
        `
    })
}

async function cargarDashboard(){
    const res = await fetch('/api/admin/dashboard', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    if (!res.ok) return;

    const data = await res.json();

    document.getElementById('totalUsuarios')?.textContent = data.total_usuarios ?? '--';
    document.getElementById('totalClientes')?.textContent = data.total_clientes ?? '--';
    document.getElementById('totalEmpleados')?.textContent = data.total_empleados ?? '--';
    document.getElementById('totalProductos')?.textContent = data.total_productos ?? '--';
    document.getElementById('productosDisponibles')?.textContent = data.productos_disponibles ?? '--';
    document.getElementById('totalPedidos')?.textContent = data.total_pedidos ?? '--';
}

cargarInventario();
cargarDashboard();