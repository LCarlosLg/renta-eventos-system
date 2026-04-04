const contenedor = document.getElementById("productos");

// Obtener categoría desde URL
const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo");

//  Elementos de búsqueda
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('btnBuscar');

// Cargar productos
async function cargarProductos(busqueda = '') {
    try {
        const query = busqueda ? `?q=${encodeURIComponent(busqueda)}` : '';
        const res = await fetch(`/api/productos${query}`);
        const data = await res.json();

        contenedor.innerHTML = "";

        const filtrados = data.filter(p => {
            const coincideCategoria = tipo ? p.categoria === tipo : true;
            const coincideBusqueda = busqueda
                ? p.nombre.toLowerCase().includes(busqueda.toLowerCase())
                : true;

            return coincideCategoria && coincideBusqueda;
        });

        if (filtrados.length === 0) {
            contenedor.innerHTML = `<p class="text-center">No se encontraron productos</p>`;
            return;
        }

        filtrados.forEach(producto => {
            contenedor.innerHTML += `
            <div class="col-md-4">
                <div class="card mb-4">
                    <img src="/assets/img/${producto.imagen}" alt="${producto.nombre}">
                    <div class="p-3 text-center">
                        <h3>${producto.nombre}</h3>
                        <p>$${producto.precio_dia} por día</p>

                        <!-- CAMBIO AQUÍ -->
                        <button onclick="confirmarAgregar('${producto.categoria}', ${producto.id})">
                            Agregar
                        </button>
                    </div>
                </div>
            </div>
            `;
        });

    } catch (error) {
        console.error("Error cargando productos:", error);
        contenedor.innerHTML = `<p class="text-danger text-center">Error al cargar productos</p>`;
    }
}

// Alerta de confirmación antes de agregar al carrito

function confirmarAgregar(categoria, id){

    Swal.fire({
        title: '¿Agregar producto?',
        text: '¿Estás seguro de agregar este producto al carrito?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            agregarCarrito(categoria, id);
        }
    });
}


// Agregar al carrito


async function agregarCarrito(categoria, id) {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Inicia sesión',
                text: 'Debes iniciar sesión para agregar productos'
            });
            return;
        }

        const res = await fetch("/api/carrito", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                categoria,
                producto_id: id,
                cantidad: 1
            })
        });

        if (!res.ok) throw new Error("Error al agregar");

        // Mostrar alerta de agregado
        Swal.fire({
            icon: 'success',
            title: 'Agregado',
            text: 'Producto agregado correctamente al carrito',
            timer: 1500,
            showConfirmButton: false
        });

    } catch (error) {
        console.error(error);

        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo agregar el producto'
        });
    }
}


// Búsqueda


searchBtn?.addEventListener('click', () => {
    cargarProductos(searchInput.value.trim());
});

searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        cargarProductos(searchInput.value.trim());
    }
});

// Inicio
cargarProductos();