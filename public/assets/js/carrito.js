const lista = document.getElementById("carrito")

async function cargarCarrito(){

    const token = localStorage.getItem("token")

    const res = await fetch("/api/carrito",{
        headers:{
            "Authorization":`Bearer ${token}`
        }
    })

    const data = await res.json()

    lista.innerHTML=""

    let total = 0

    data.forEach(item => {

        total += item.precio_dia * item.cantidad

        lista.innerHTML += `
        <tr>
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio_dia}</td>
        </tr>
        `
    })

    document.getElementById("total").innerText = total
}

cargarCarrito()