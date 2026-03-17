const db = require('../db/renta_manteleria_cristaleria_db');

// Ver carrito del cliente
exports.obtenerCarrito = async (req, res) => {

    const usuarioId = req.usuario.id;

    try {

        const [carrito] = await db.query(`
            SELECT
                c.id_carrito,
                c.categoria,
                c.id_producto,
                c.cantidad,
                COALESCE(cr.nombre, m.nombre) AS nombre,
                COALESCE(cr.precio_dia, m.precio_dia) AS precio_dia
            FROM carrito c
            LEFT JOIN cristaleria cr ON c.categoria='cristaleria' AND c.id_producto=cr.id_cristaleria
            LEFT JOIN manteleria m ON c.categoria='manteleria' AND c.id_producto=m.id_manteleria
            WHERE c.id_usuario=?
        `, [usuarioId]);

        res.json(carrito);

    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener carrito" });
    }
};

// Agregar producto al carrito
exports.agregarCarrito = async (req, res) => {

    const usuarioId = req.usuario.id;
    const { categoria, producto_id, cantidad } = req.body;

    if (!['cristaleria', 'manteleria'].includes(categoria)) {
        return res.status(400).json({ mensaje: "Categoría inválida" });
    }

    try {

        await db.query(`
            INSERT INTO carrito
            (id_usuario,categoria,id_producto,cantidad)
            VALUES(?,?,?,?)
        `, [usuarioId, categoria, producto_id, cantidad]);

        res.json({ mensaje: "Producto agregado al carrito" });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al agregar al carrito" });
    }
};

// Eliminar producto del carrito
exports.eliminarCarrito = async (req, res) => {

    const { id } = req.params;

    try {

        await db.query(
            "DELETE FROM carrito WHERE id_carrito=?",
            [id]
        );

        res.json({ mensaje: "Producto eliminado del carrito" });

    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar producto" });
    }
};