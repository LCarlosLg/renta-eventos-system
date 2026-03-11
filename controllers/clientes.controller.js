const db = require('../db/renta_manteleria_cristaleria_db');

// Obtener perfil cliente
exports.obtenerPerfil = async (req, res) => {

    const usuarioId = req.usuario.id;

    try {

        const [usuario] = await db.query(`
            SELECT id_usuario,nombre,email,telefono,imagen
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
    const { nombre, telefono } = req.body;

    try {

        await db.query(`
            UPDATE usuarios
            SET nombre=?,telefono=?
            WHERE id_usuario=?
        `, [nombre, telefono, usuarioId]);

        res.json({ mensaje: "Perfil actualizado" });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar perfil" });
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