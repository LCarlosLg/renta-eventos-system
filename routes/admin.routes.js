const express = require('express');
const router = express.Router();

const verificarRol = require('../middlewares/verificarRol');
const verificarToken = require('../middlewares/verificarToken');

// Solo ADMIN (rol 1)
router.use(verificarToken, verificarRol([1]));

// Gestionar usuarios
router.get('/usuarios', (req, res) => {
    res.json({ mensaje: "Lista de usuarios" });
});

router.delete('/usuarios/:id', (req, res) => {
    res.json({ mensaje: "Usuario eliminado" });
});

// Gestionar productos
router.post('/productos', (req, res) => {
    res.json({ mensaje: "Producto creado" });
});

router.delete('/productos/:id', (req, res) => {
    res.json({ mensaje: "Producto eliminado" });
});

module.exports = router;