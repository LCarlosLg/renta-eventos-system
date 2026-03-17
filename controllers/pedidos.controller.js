const db = require('../db/renta_manteleria_cristaleria_db');

// Crear pedido (toma los items del carrito)
exports.crearPedido = async (req, res) => {

    const usuarioId = req.usuario.id;
    const conn = await db.getConnection();

    try {
        await conn.beginTransaction();

        const [result] = await conn.query(`
            INSERT INTO pedidos
            (id_usuario,fecha,estado)
            VALUES(?,NOW(),'pendiente')
        `, [usuarioId]);

        const pedidoId = result.insertId;

        const [items] = await conn.query(
            `SELECT categoria, id_producto, cantidad FROM carrito WHERE id_usuario = ?`,
            [usuarioId]
        );

        for (const item of items) {
            const { categoria, id_producto, cantidad } = item;
            let precio = 0;
            let updateQuery = '';

            if (categoria === 'cristaleria') {
                const [rows] = await conn.query(
                    `SELECT precio_dia FROM cristaleria WHERE id_cristaleria = ?`,
                    [id_producto]
                );
                precio = rows[0]?.precio_dia || 0;
                updateQuery = `
                    UPDATE cristaleria
                    SET cantidad_disponible = GREATEST(0, cantidad_disponible - ?)
                    WHERE id_cristaleria = ?
                `;
            } else if (categoria === 'manteleria') {
                const [rows] = await conn.query(
                    `SELECT precio_dia FROM manteleria WHERE id_manteleria = ?`,
                    [id_producto]
                );
                precio = rows[0]?.precio_dia || 0;
                updateQuery = `
                    UPDATE manteleria
                    SET cantidad_disponible = GREATEST(0, cantidad_disponible - ?)
                    WHERE id_manteleria = ?
                `;
            }

            await conn.query(
                `INSERT INTO pedido_detalles
                (id_pedido,categoria,id_producto,cantidad,precio_unitario)
                VALUES(?,?,?,?,?)`,
                [pedidoId, categoria, id_producto, cantidad, precio]
            );

            if (updateQuery) {
                await conn.query(updateQuery, [cantidad, id_producto]);
            }
        }

        await conn.query(
            `DELETE FROM carrito WHERE id_usuario = ?`,
            [usuarioId]
        );

        await conn.commit();

        res.json({
            mensaje: "Pedido creado",
            pedido_id: pedidoId
        });

    } catch (error) {
        await conn.rollback();
        res.status(500).json({ mensaje: "Error al crear pedido" });
    } finally {
        conn.release();
    }
};

// Ver pedidos del cliente (con detalle)
exports.misPedidos = async (req, res) => {

    const usuarioId = req.usuario.id;

    try {

        const [pedidos] = await db.query(`
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
            WHERE p.id_usuario=?
            ORDER BY p.fecha DESC
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

// Actualizar estado de pedido (empleado/admin)
exports.actualizarEstadoPedido = async (req, res) => {

    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['pendiente', 'confirmado', 'entregado', 'cancelado'];

    if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ mensaje: "Estado inválido" });
    }

    try {
        await db.query(
            `UPDATE pedidos SET estado = ? WHERE id_pedido = ?`,
            [estado, id]
        );

        res.json({ mensaje: "Estado de pedido actualizado" });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar estado" });
    }
};