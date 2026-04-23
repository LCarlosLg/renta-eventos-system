// =======================
// ELEMENTOS
// =======================
const contenedor = document.getElementById("productos");
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('btnBuscar');

const params = new URLSearchParams(window.location.search);
const tipo = params.get("tipo");

// =======================
// 🔒 SANITIZAR TEXTO
// =======================
function escapeHTML(texto = ""){
    return texto
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

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

// =======================
// 🔥 ESTADO PRODUCTO
// =======================
function obtenerEstado(estado){
    switch(estado){
        case "disponible": return {color:"green", texto:"Disponible"};
        case "rentado": return {color:"red", texto:"Rentado"};
        case "en_limpieza": return {color:"gold", texto:"En limpieza"};
        case "en_reparacion": return {color:"orange", texto:"En reparación"};
        default: return {color:"gray", texto:"Desconocido"};
    }
}

// =======================
// 📦 PRODUCTOS
// =======================
async function cargarProductos(busqueda = '') {

    if(!contenedor) return;

    try {
        const query = busqueda ? `?q=${encodeURIComponent(busqueda)}` : '';
        const res = await fetch(`/api/productos${query}`);

        if(!res.ok) throw new Error("Error API");

        const data = await res.json();
        contenedor.innerHTML = "";

        const filtrados = data.filter(p =>
            (!tipo || p.categoria === tipo) &&
            (!busqueda || p.nombre?.toLowerCase().includes(busqueda.toLowerCase()))
        );

        if (!filtrados.length) {
            contenedor.innerHTML = `<p class="text-center">No se encontraron productos</p>`;
            return;
        }

        filtrados.forEach(producto => {

            const estado = obtenerEstado(producto.estado);

            let infoExtra = "";

            if(producto.categoria === "cristaleria"){
                infoExtra = `
                    <p><b>Tipo:</b> ${escapeHTML(producto.tipo)}</p>
                    <p><b>Material:</b> ${escapeHTML(producto.material)}</p>
                    <p><b>Disponibles:</b> ${producto.cantidad_disponible ?? 0}</p>
                `;
            }

            if(producto.categoria === "manteleria"){
                infoExtra = `
                    <p><b>Medida:</b> ${escapeHTML(producto.medida)}</p>
                    <p><b>Color:</b> ${escapeHTML(producto.color)}</p>
                    <p><b>Tela:</b> ${escapeHTML(producto.tipo_tela)}</p>
                    <p><b>Disponibles:</b> ${producto.cantidad_disponible ?? 0}</p>
                `;
            }

            const imagen = producto.imagen 
                ? `/assets/img/${producto.imagen}` 
                : `/assets/img/default.jpg`;

            contenedor.innerHTML += `
            <div class="col-md-4">
                <div class="card mb-4">

                    <div class="img-container">
                        <img src="${imagen}" alt="${escapeHTML(producto.nombre)}">
                        <span class="estado-circle" style="background:${estado.color};"></span>
                    </div>

                    <div class="p-3 text-center">
                        <h3>${escapeHTML(producto.nombre)}</h3>
                        <p class="sku">SKU: ${escapeHTML(producto.codigo_sku)}</p>
                        <p class="categoria">${escapeHTML(producto.categoria)}</p>

                        ${infoExtra}

                        <p><b>$${escapeHTML(producto.precio_dia)}</b> por día</p>
                        <p class="estado-texto">${estado.texto}</p>

                        <button onclick="confirmarAgregar('${producto.categoria}', ${producto.id})">
                            Agregar
                        </button>
                    </div>

                </div>
            </div>
            `;
        });

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = `<p class="text-danger text-center">Error al cargar productos</p>`;
    }
}

// =======================
// 🛒 CARRITO
// =======================
function confirmarAgregar(categoria, id){
    Swal.fire({
        title: '¿Agregar producto?',
        text: '¿Deseas agregarlo al carrito?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#8a2be2'
    }).then((result) => {
        if (result.isConfirmed) agregarCarrito(categoria, id);
    });
}

async function agregarCarrito(categoria, id) {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            return Swal.fire('Atención','Inicia sesión primero','warning');
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

        if (!res.ok) throw new Error();

        Swal.fire({
            icon: 'success',
            title: 'Agregado',
            timer: 1200,
            showConfirmButton: false
        });

    } catch {
        Swal.fire('Error','No se pudo agregar','error');
    }
}

// =======================
// 🔍 BÚSQUEDA
// =======================
searchBtn?.addEventListener('click', () => {
    cargarProductos(searchInput.value.trim());
});

searchInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        cargarProductos(searchInput.value.trim());
    }
});

// =======================
// ⭐ RECOMENDADOS
// =======================
async function cargarRecomendados(){
    try{
        const res = await fetch('/api/productos');
        if(!res.ok) throw new Error();

        const data = await res.json();
        const cont = document.getElementById('recomendados');

        if(!cont) return;

        cont.innerHTML = '';

        data.slice(0,3).forEach(p=>{
            cont.innerHTML += `
            <div class="col-md-4">
                <div class="card">
                    <img src="/assets/img/${p.imagen || 'default.jpg'}">
                    <div class="p-3 text-center">
                        <h3>${escapeHTML(p.nombre)}</h3>
                        <p>$${escapeHTML(p.precio_dia)}</p>
                    </div>
                </div>
            </div>
            `;
        });

    }catch(err){
        console.error(err);
    }
}

// =======================
// 🎠 FIX CARRUSEL (🔥 AQUÍ ESTÁ)
// =======================
document.addEventListener("DOMContentLoaded", function () {

    const carouselElement = document.querySelector('#carouselEventos');

    if (carouselElement) {
        new bootstrap.Carousel(carouselElement, {
            interval: 5000,
            ride: 'carousel',
            pause: false,
            wrap: true
        });
    }

});

// =======================
// 📏 GUÍA
// =======================
function verGuia(){
    Swal.fire({
        title: 'Guía de medidas',
        html: `
            <h4>Mesas redondas</h4>
            <p>1.20m → mantel 2.4m</p>
            <p>1.50m → mantel 3m</p>

            <hr>

            <h4>Rectangulares</h4>
            <p>1.5m → mantel 2.5m</p>
            <p>2m → mantel 3m</p>

            <hr>

            <h4>Altura estándar</h4>
            <p>75 cm</p>
        `,
        icon: 'info',
        confirmButtonColor: '#8a2be2'
    });
}

// =======================
// 💬 CHAT
// =======================
function toggleChat(){
    const chat = document.getElementById('chatBox');
    if(!chat) return;

    chat.style.display = (chat.style.display === 'flex') ? 'none' : 'flex';
}

async function enviarMensaje(){
    const input = document.getElementById('chatInput');
    const chat = document.getElementById('chatMessages');

    if(!input || !chat) return;

    const mensaje = input.value.trim();
    if(!mensaje) return;

    chat.innerHTML += `<div style="text-align:right;"><b>Tú:</b> ${mensaje}</div>`;
    input.value = "";

    chat.scrollTop = chat.scrollHeight;

    try{
        await fetch('/api/soporte',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({mensaje})
        });

        setTimeout(()=>{
            chat.innerHTML += `<div><b>Soporte:</b> Te responderemos pronto 📩</div>`;
            chat.scrollTop = chat.scrollHeight;
        }, 700);

    }catch{
        chat.innerHTML += `<div style="color:red;">Error al enviar</div>`;
        chat.scrollTop = chat.scrollHeight;
    }
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

// =======================
// 🚀 INICIO
// =======================
cargarProductos();
cargarRecomendados();
cargarAvatarNavbar();