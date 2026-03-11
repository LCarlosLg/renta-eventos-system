const db = require('../db/renta_manteleria_cristaleria_db');


// =====================================
// OBTENER TODO EL CATALOGO
// =====================================

exports.obtenerProductos = async (req, res) => {

    try {

        const [cristaleria] = await db.query(`
            SELECT
                id_cristaleria AS id,
                codigo_sku,
                nombre,
                tipo,
                material,
                precio_dia,
                cantidad_disponible,
                imagen,
                'cristaleria' AS categoria
            FROM cristaleria
            WHERE estado='disponible'
        `);


        const [manteleria] = await db.query(`
            SELECT
                id_manteleria AS id,
                codigo_sku,
                nombre,
                medida,
                color,
                material,
                tipo_tela,
                precio_dia,
                cantidad_disponible,
                imagen,
                'manteleria' AS categoria
            FROM manteleria
            WHERE estado='disponible'
        `);


        const productos = [...cristaleria, ...manteleria];

        res.json(productos);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al obtener productos"
        });

    }

};


// =====================================
// OBTENER PRODUCTO POR ID
// =====================================

exports.obtenerProducto = async (req, res) => {

    const { id, categoria } = req.params;

    try {

        let query;

        if (categoria === "cristaleria") {

            query = `
                SELECT *
                FROM cristaleria
                WHERE id_cristaleria=?
            `;

        } else if (categoria === "manteleria") {

            query = `
                SELECT *
                FROM manteleria
                WHERE id_manteleria=?
            `;

        } else {

            return res.status(400).json({
                mensaje: "Categoría inválida"
            });

        }


        const [producto] = await db.query(query, [id]);

        if (producto.length === 0) {

            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });

        }

        res.json(producto[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error del servidor"
        });

    }

};


// =====================================
// CREAR CRISTALERIA (ADMIN)
// =====================================

exports.crearCristaleria = async (req, res) => {

    const {
        codigo_sku,
        nombre,
        tipo,
        material,
        precio_dia,
        cantidad_disponible
    } = req.body;

    try {

        await db.query(`
            INSERT INTO cristaleria
            (codigo_sku,nombre,tipo,material,precio_dia,cantidad_disponible,estado)
            VALUES(?,?,?,?,?,?,'disponible')
        `, [
            codigo_sku,
            nombre,
            tipo,
            material,
            precio_dia,
            cantidad_disponible
        ]);

        res.json({
            mensaje: "Cristalería creada correctamente"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al crear cristalería"
        });

    }

};


// =====================================
// CREAR MANTELERIA (ADMIN)
// =====================================

exports.crearManteleria = async (req, res) => {

    const {
        codigo_sku,
        nombre,
        medida,
        color,
        material,
        tipo_tela,
        precio_dia,
        cantidad_total,
        cantidad_disponible
    } = req.body;

    try {

        await db.query(`
            INSERT INTO manteleria
            (codigo_sku,nombre,medida,color,material,tipo_tela,precio_dia,cantidad_total,cantidad_disponible,estado)
            VALUES(?,?,?,?,?,?,?,?,?,'disponible')
        `, [
            codigo_sku,
            nombre,
            medida,
            color,
            material,
            tipo_tela,
            precio_dia,
            cantidad_total,
            cantidad_disponible
        ]);

        res.json({
            mensaje: "Mantelería creada correctamente"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al crear mantelería"
        });

    }

};


// =====================================
// ELIMINAR PRODUCTO
// =====================================

exports.eliminarProducto = async (req, res) => {

    const { id, categoria } = req.params;

    try {

        let query;

        if (categoria === "cristaleria") {

            query = `
                UPDATE cristaleria
                SET estado='en_reparacion'
                WHERE id_cristaleria=?
            `;

        } else if (categoria === "manteleria") {

            query = `
                UPDATE manteleria
                SET estado='en_reparacion'
                WHERE id_manteleria=?
            `;

        }

        await db.query(query, [id]);

        res.json({
            mensaje: "Producto actualizado"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            mensaje: "Error al eliminar producto"
        });

    }

};