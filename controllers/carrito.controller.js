const db = require('../db/renta_manteleria_cristaleria_db');

// Ver carrito del cliente
exports.obtenerCarrito = async (req, res) => {

    const usuarioId = req.usuario.id;

    try {

        const [carrito] = await db.query(`
            SELECT c.id_carrito,p.nombre,p.precio,c.cantidad
            FROM carrito c
            JOIN productos p ON c.id_producto=p.id_producto
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
    const { producto_id, cantidad } = req.body;

    try {

        await db.query(`
            INSERT INTO carrito
            (id_usuario,id_producto,cantidad)
            VALUES(?,?,?)
        `, [usuarioId, producto_id, cantidad]);

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