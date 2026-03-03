const express = require('express');
const router = express.Router();

const verificarRol = require('../middlewares/verificarRol');
const verificarToken = require('../middlewares/verificarToken');

// Solo CLIENTE (rol 3)
router.use(verificarToken, verificarRol([3]));

// Ver perfil
router.get('/perfil', (req, res) => {
    res.json({ mensaje: "Perfil del cliente", usuario: req.usuario });
});

// Ver pedidos propios
router.get('/mis-pedidos', (req, res) => {
    res.json({ mensaje: "Pedidos del cliente" });
});

module.exports = router;