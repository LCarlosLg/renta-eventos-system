const express = require('express');
const router = express.Router();

const verificarRol = require('../middlewares/verificarRol');
const verificarToken = require('../middlewares/verificarToken');
const pedidosController = require('../controllers/pedidos.controller');

// Solo EMPLEADO (rol 2)
router.use(verificarToken, verificarRol([2]));

// Ver pedidos de clientes
router.get('/pedidos', pedidosController.obtenerPedidos);

// Actualizar estado de pedido
router.put('/pedidos/:id', pedidosController.actualizarEstadoPedido);

module.exports = router;