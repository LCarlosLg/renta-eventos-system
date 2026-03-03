const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensaje: "Token requerido"
        });
    }

    // Formato esperado: Bearer TOKEN
    const partes = authHeader.split(' ');

    if (partes.length !== 2 || partes[0] !== "Bearer") {
        return res.status(400).json({
            mensaje: "Formato de token inválido"
        });
    }

    const token = partes[1];

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Guardamos los datos del token en la request
        req.usuario = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            mensaje: "Token inválido o expirado"
        });

    }
};

module.exports = verificarToken;