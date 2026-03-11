const db = require('../db/renta_manteleria_cristaleria_db');

// Crear pedido
exports.crearPedido = async (req, res) => {

    const usuarioId = req.usuario.id;

    try {

        const [result] = await db.query(`
            INSERT INTO pedidos
            (id_usuario,fecha,estado)
            VALUES(?,NOW(),'pendiente')
        `, [usuarioId]);

        res.json({
            mensaje: "Pedido creado",
            pedido_id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear pedido" });
    }
};

// Ver pedidos del cliente
exports.misPedidos = async (req, res) => {

    const usuarioId = req.usuario.id;

    try {

        const [pedidos] = await db.query(`
            SELECT * FROM pedidos
            WHERE id_usuario=?
        `, [usuarioId]);

        res.json(pedidos);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener pedidos" });
    }
};

// Ver todos los pedidos (empleado/admin)
exports.obtenerPedidos = async (req, res) => {

    try {

        const [pedidos] = await db.query(`
            SELECT p.id_pedido,u.nombre,p.estado,p.fecha
            FROM pedidos p
            JOIN usuarios u ON p.id_usuario=u.id_usuario
        `);

        res.json(pedidos);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener pedidos" });
    }
};