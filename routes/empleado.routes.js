const express = require('express');
const router = express.Router();

const verificarRol = require('../middlewares/verificarRol');
const verificarToken = require('../middlewares/verificarToken');

// Solo EMPLEADO (rol 2)
router.use(verificarToken, verificarRol([2]));

// Ver pedidos de clientes
router.get('/pedidos', (req, res) => {
    res.json({ mensaje: "Lista de pedidos" });
});

// Actualizar estado de pedido
router.put('/pedidos/:id', (req, res) => {
    res.json({ mensaje: "Pedido actualizado" });
});

module.exports = router;