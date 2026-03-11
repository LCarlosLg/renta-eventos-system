async function cargarInventario(){

    const res = await fetch("/api/productos")
    const data = await res.json()

    const tabla = document.getElementById("inventario")

    tabla.innerHTML=""

    data.forEach(p=>{

        tabla.innerHTML += `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.cantidad_disponible}</td>
            <td>$${p.precio_dia}</td>
        </tr>
        `
    })
}

cargarInventario()