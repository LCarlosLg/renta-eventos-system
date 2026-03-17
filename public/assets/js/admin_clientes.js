async function cargarClientes() {
    const token = localStorage.getItem('token');

    const res = await fetch('/api/admin/usuarios', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) return;

    const data = await res.json();
    const tbody = document.getElementById('clientes');

    tbody.innerHTML = '';

    data.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.id_usuario}</td>
                <td>${u.nombre}</td>
                <td>${u.email}</td>
                <td>${u.telefono}</td>
                <td>${u.estado}</td>
                <td>
                    <select onchange="cambiarEstado(${u.id_usuario}, this.value)">
                        <option value="activo" ${u.estado === 'activo' ? 'selected' : ''}>Activo</option>
                        <option value="moroso" ${u.estado === 'moroso' ? 'selected' : ''}>Moroso</option>
                        <option value="bloqueado" ${u.estado === 'bloqueado' ? 'selected' : ''}>Bloqueado</option>
                        <option value="inactivo" ${u.estado === 'inactivo' ? 'selected' : ''}>Inactivo</option>
                    </select>
                </td>
            </tr>
        `;
    });
}

async function cambiarEstado(id, estado) {
    const token = localStorage.getItem('token');

    await fetch(`/api/admin/usuarios/${id}/estado`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ estado })
    });

    cargarClientes();
}

async function exportarClientes() {
    const token = localStorage.getItem('token');

    const res = await fetch('/api/admin/export/clientes', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes_export.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

document.getElementById('exportClientes')?.addEventListener('click', exportarClientes);

cargarClientes();
