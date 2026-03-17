async function cargarPerfil(){
    const token = localStorage.getItem('token');

    const res = await fetch('/api/clientes/perfil', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) return;

    const data = await res.json();

    document.getElementById('nombre').value = data.nombre || '';
    document.getElementById('telefono').value = data.telefono || '';
    document.getElementById('direccion').value = data.direccion || '';
    document.getElementById('notas').value = data.notas || '';
    document.getElementById('preferencias').value = data.preferencias || '';
}

async function actualizarPerfil(e){
    e.preventDefault();

    const token = localStorage.getItem('token');

    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const notas = document.getElementById('notas').value;
    const preferencias = document.getElementById('preferencias').value;

    const res = await fetch('/api/clientes/perfil', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, telefono, direccion, notas, preferencias })
    });

    const data = await res.json();
    const mensaje = document.getElementById('mensaje');

    if (res.ok) {
        mensaje.style.color = 'green';
        mensaje.innerText = data.mensaje;
    } else {
        mensaje.style.color = 'red';
        mensaje.innerText = data.mensaje || 'Error al actualizar perfil';
    }
}

const form = document.getElementById('perfilForm');
form?.addEventListener('submit', actualizarPerfil);

cargarPerfil();
