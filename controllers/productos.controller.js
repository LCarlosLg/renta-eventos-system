const db = require('../db/renta_manteleria_cristaleria_db');


// =====================================
// OBTENER TODO EL CATALOGO
// =====================================

exports.obtenerProductos = async (req, res) => {

    const { categoria, estado, q } = req.query;

    // Por defecto solo mostramos productos disponibles en el catálogo público.
    const estadoFiltro = estado || 'disponible';

    const filtros = [];
    const params = [];

    if (estadoFiltro && estadoFiltro !== 'all') {
        filtros.push("estado = ?");
        params.push(estadoFiltro);
    }

    if (q) {
        filtros.push("nombre LIKE ?");
        params.push(`%${q}%`);
    }

    const where = filtros.length > 0 ? `AND ${filtros.join(' AND ')}` : '';

    try {

        let cristaleria = [];
        let manteleria = [];

        if (!categoria || categoria === 'cristaleria') {
            const [rows] = await db.query(`
                SELECT
                    id_cristaleria AS id,
                    codigo_sku,
                    nombre,
                    tipo,
                    material,
                    precio_dia,
                    cantidad_disponible,
                    imagen,
                    estado,
                    'cristaleria' AS categoria
                FROM cristaleria
                WHERE 1=1 ${where}
            `, params);
            cristaleria = rows;
        }

        if (!categoria || categoria === 'manteleria') {
            const [rows] = await db.query(`
                SELECT
                    id_manteleria AS id,
                    codigo_sku,
                    nombre,
                    medida,
                    color,
                    material,
                    tipo_tela,
                    precio_dia,
                    cantidad_total,
                    cantidad_disponible,
                    imagen,
                    estado,
                    'manteleria' AS categoria
                FROM manteleria
                WHERE 1=1 ${where}
            `, params);
            manteleria = rows;
        }

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
// ACTUALIZAR PRODUCTO (ADMIN)
// =====================================

exports.actualizarProducto = async (req, res) => {

    const { id, categoria } = req.params;
    const datos = req.body;

    const validStates = ['disponible', 'rentado', 'en_limpieza', 'en_reparacion'];

    try {

        let query;
        const params = [];

        if (categoria === "cristaleria") {
            const campos = [];
            const allowed = ['codigo_sku', 'nombre', 'tipo', 'material', 'precio_dia', 'cantidad_disponible', 'estado'];
            allowed.forEach((field) => {
                if (datos[field] !== undefined) {
                    if (field === 'estado' && !validStates.includes(datos[field])) return;
                    campos.push(`${field}=?`);
                    params.push(datos[field]);
                }
            });

            if (campos.length === 0) {
                return res.status(400).json({ mensaje: "No hay campos válidos para actualizar" });
            }

            query = `UPDATE cristaleria SET ${campos.join(', ')} WHERE id_cristaleria=?`;
            params.push(id);

        } else if (categoria === "manteleria") {
            const campos = [];
            const allowed = ['codigo_sku', 'nombre', 'medida', 'color', 'material', 'tipo_tela', 'precio_dia', 'cantidad_total', 'cantidad_disponible', 'estado'];
            allowed.forEach((field) => {
                if (datos[field] !== undefined) {
                    if (field === 'estado' && !validStates.includes(datos[field])) return;
                    campos.push(`${field}=?`);
                    params.push(datos[field]);
                }
            });

            if (campos.length === 0) {
                return res.status(400).json({ mensaje: "No hay campos válidos para actualizar" });
            }

            query = `UPDATE manteleria SET ${campos.join(', ')} WHERE id_manteleria=?`;
            params.push(id);

        } else {
            return res.status(400).json({ mensaje: "Categoría inválida" });
        }

        await db.query(query, params);

        res.json({ mensaje: "Producto actualizado" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error al actualizar producto" });
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