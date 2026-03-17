const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidos.controller');

const verificarToken = require('../middlewares/verificarToken');
const verificarRol = require('../middlewares/verificarRol');

// ============================
// CLIENTE
// ============================

// Crear pedido
router.post(
    '/',
    verificarToken,
    verificarRol([3]),
    pedidosController.crearPedido
);

// Ver mis pedidos
router.get(
    '/mis-pedidos',
    verificarToken,
    verificarRol([3]),
    pedidosController.misPedidos
);

// ============================
// EMPLEADO / ADMIN
// ============================

// Ver todos los pedidos
router.get(
    '/',
    verificarToken,
    verificarRol([1,2]),
    pedidosController.obtenerPedidos
);

// Actualizar estado de pedido
router.put(
    '/:id',
    verificarToken,
    verificarRol([1,2]),
    pedidosController.actualizarEstadoPedido
);

module.exports = router;