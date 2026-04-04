const db = require('../db/renta_manteleria_cristaleria_db');
const multer = require('multer');
const path = require('path');

// COonfiguración de multer para subir imágenes de perfil

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: (req, file, cb) => {
        const nombre = Date.now() + path.extname(file.originalname);
        cb(null, nombre);
    }
});

const upload = multer({ storage }).single('imagen');


// Obtener perfil del cliente

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
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener perfil" });
    }
};


// Actualizar perfil del cliente (con opción a subir imagen) 

exports.actualizarPerfil = (req, res) => {

    upload(req, res, async (err) => {

        if (err) {
            return res.status(500).json({ mensaje: "Error al subir imagen" });
        }

        const usuarioId = req.usuario.id;
        const { nombre, telefono, direccion, notas, preferencias } = req.body;

        const imagen = req.file ? req.file.filename : null;

        try {

            let query = `
                UPDATE usuarios
                SET nombre=?, telefono=?, direccion=?, notas=?, preferencias=?
            `;

            let params = [nombre, telefono, direccion, notas, preferencias];

            if(imagen){
                query += `, imagen=?`;
                params.push(imagen);
            }

            query += ` WHERE id_usuario=?`;
            params.push(usuarioId);

            await db.query(query, params);

            res.json({ mensaje: "Perfil actualizado correctamente" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: "Error al actualizar perfil" });
        }

    });
};


// Historial de pedidos del cliente (con detalle de productos)

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
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener historial" });
    }
};