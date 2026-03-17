const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/renta_manteleria_cristaleria_db');

// ============================
// REGISTRO
// ============================

const registro = async (req, res) => {

    const { nombre, email, password, telefono } = req.body;

    if (!nombre || !email || !password || !telefono) {
        return res.status(400).json({
            mensaje: "Todos los campos son obligatorios"
        });
    }

    try {

        // Verificar si el correo ya existe
        const [correoExiste] = await db.query(
            "SELECT id_usuario FROM usuarios WHERE email = ?",
            [email]
        );

        if (correoExiste.length > 0) {
            return res.status(400).json({
                mensaje: "Correo ya registrado"
            });
        }

        // Verificar si el teléfono ya existe
        const [telefonoExiste] = await db.query(
            "SELECT id_usuario FROM usuarios WHERE telefono = ?",
            [telefono]
        );

        if (telefonoExiste.length > 0) {
            return res.status(400).json({
                mensaje: "Número de teléfono ya registrado"
            });
        }

        // Encriptar contraseña
        const hash = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO usuarios
            (id_rol, nombre, email, password, telefono, estado, created_at, imagen)
            VALUES (3, ?, ?, ?, ?, 'activo', NOW(), NULL)
        `;

        await db.query(sql, [nombre, email, hash, telefono]);

        res.json({
            mensaje: "Usuario registrado correctamente"
        });

    } catch (error) {
        console.log("ERROR REGISTRO:", error);
        res.status(500).json({
            mensaje: "Error al registrar usuario"
        });
    }
};


// ============================
// LOGIN
// ============================

const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            mensaje: "Email y contraseña son obligatorios"
        });
    }

    try {

        const sql = `
            SELECT id_usuario, id_rol, nombre, email, password, estado, imagen
            FROM usuarios
            WHERE email = ?
        `;

        const [result] = await db.query(sql, [email]);

        if (result.length === 0) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const usuario = result[0];

        if (usuario.estado !== "activo") {
            return res.status(403).json({
                mensaje: `Usuario ${usuario.estado}`
            });
        }

        const valido = await bcrypt.compare(password, usuario.password);

        if (!valido) {
            return res.status(401).json({
                mensaje: "Credenciales incorrectas"
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                rol: usuario.id_rol
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            mensaje: "Login correcto",
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.id_rol,
                imagen: usuario.imagen
            }
        });

    } catch (error) {
        console.log("ERROR LOGIN:", error);
        res.status(500).json({
            mensaje: "Error en el servidor"
        });
    }
};

module.exports = {
    registro,
    login
};