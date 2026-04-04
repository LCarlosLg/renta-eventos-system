const form = document.getElementById('perfilForm');
const preview = document.getElementById('preview');
const inputImagen = document.getElementById('imagen');

/* Cargar perfil */
async function cargarPerfil(){
    const token = localStorage.getItem('token');

    if(!token){
        Swal.fire({
            icon: 'warning',
            title: 'Sesión expirada',
            text: 'Inicia sesión nuevamente'
        });
        return;
    }

    try{
        const res = await fetch('/api/clientes/perfil', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!res.ok) return;

        let data = {};
        try{
            data = await res.json();
        }catch{}

        document.getElementById('nombre').value = data.nombre || '';
        document.getElementById('telefono').value = data.telefono || '';
        document.getElementById('direccion').value = data.direccion || '';
        document.getElementById('notas').value = data.notas || '';
        document.getElementById('preferencias').value = data.preferencias || '';

        // Mostrar imagen sin cache
        if(data.imagen){
            preview.src = `/uploads/${data.imagen}?t=${Date.now()}`;
        }

    }catch(err){
        console.error("Error al cargar perfil:", err);
    }
}

/* Vista previa de la imagen */
inputImagen?.addEventListener('change', () => {
    const file = inputImagen.files[0];

    if(file){
        preview.src = URL.createObjectURL(file);
    }
});

/* Actualizacion del perfil */
async function actualizarPerfil(e){
    e.preventDefault();

    const token = localStorage.getItem('token');

    if(!token){
        Swal.fire({
            icon: 'warning',
            title: 'Sesión expirada',
            text: 'Inicia sesión nuevamente'
        });
        return;
    }

    const formData = new FormData();

    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('telefono', document.getElementById('telefono').value);
    formData.append('direccion', document.getElementById('direccion').value);
    formData.append('notas', document.getElementById('notas').value);
    formData.append('preferencias', document.getElementById('preferencias').value);

    // Validación de la imagen 
    const file = inputImagen.files[0];

    if(file){
        const tipos = ['image/jpeg','image/png','image/jpg'];

        if(!tipos.includes(file.type)){
            Swal.fire({
                icon: 'warning',
                title: 'Formato inválido',
                text: 'Solo imágenes JPG o PNG'
            });
            return;
        }

        if(file.size > 2 * 1024 * 1024){
            Swal.fire({
                icon: 'warning',
                title: 'Archivo muy grande',
                text: 'Máximo 2MB'
            });
            return;
        }

        formData.append('imagen', file);
    }

    //  Cargar
    Swal.fire({
        title: 'Guardando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try{
        const res = await fetch('/api/clientes/perfil', {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        let data = {};
        try{
            data = await res.json();
        }catch{}

        if(res.ok){
            Swal.fire({
                icon: 'success',
                title: '¡Perfil actualizado!',
                text: 'Información de usuario actualizada correctamente',
                confirmButtonColor: '#8a2be2'
            });

            //  Recargar datos 
            cargarPerfil();

        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: data.mensaje || 'No se pudo actualizar',
            });
        }

    }catch(err){
        console.error("Error:", err);

        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'No se pudo conectar con el servidor',
        });
    }
}

/* Eventos */
form?.addEventListener('submit', actualizarPerfil);

/* INIT */
cargarPerfil();