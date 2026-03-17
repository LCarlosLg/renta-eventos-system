const db = require('../db/renta_manteleria_cristaleria_db');

// Obtener perfil cliente
exports.obtenerPerfil = async (req, res) => {

    const usuarioId = req.usuario.id;

    try {

        const [usuario] = await db.query(`
            SELECT id_usuario,nombre,email,telefono,direccion,notas,preferencias,estado,imagen
            FROM usuarios
            WHERE id_usuario=?
        `, [usuarioId]);

        res.json(usuario[0]);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener perfil" });
    }
};

// Actualizar perfil
exports.actualizarPerfil = async (req, res) => {

    const usuarioId = req.usuario.id;
    const { nombre, telefono, direccion, notas, preferencias } = req.body;

    try {

        await db.query(`
            UPDATE usuarios
            SET nombre=?,telefono=?,direccion=?,notas=?,preferencias=?
            WHERE id_usuario=?
        `, [nombre, telefono, direccion, notas, preferencias, usuarioId]);

        res.json({ mensaje: "Perfil actualizado" });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar perfil" });
    }
};

// Historial de rentas del cliente
exports.historialRentas = async (req, res) => {

    const usuarioId = req.usuario.id;

    try {

        const [historial] = await db.query(`
            SELECT
                p.id_pedido,
                p.fecha,
                p.estado,
                pd.categoria,
                pd.id_producto,
                pd.cantidad,
                pd.precio_unitario,
                COALESCE(c.nombre, m.nombre) AS nombre_producto
            FROM pedidos p
            JOIN pedido_detalles pd ON p.id_pedido = pd.id_pedido
            LEFT JOIN cristaleria c ON pd.categoria='cristaleria' AND pd.id_producto = c.id_cristaleria
            LEFT JOIN manteleria m ON pd.categoria='manteleria' AND pd.id_producto = m.id_manteleria
            WHERE p.id_usuario = ?
            ORDER BY p.fecha DESC
        `, [usuarioId]);

        res.json(historial);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener historial" });
    }
};

// Ver todos los clientes (admin)
exports.obtenerClientes = async (req, res) => {

    try {

        const [clientes] = await db.query(`
            SELECT id_usuario,nombre,email,telefono
            FROM usuarios
            WHERE id_rol=3
        `);

        res.json(clientes);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener clientes" });
    }
};