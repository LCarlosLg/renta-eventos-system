const express = require('express');
const router = express.Router();

const carritoController = require('../controllers/carrito.controller');

const verificarToken = require('../middlewares/verificarToken');
const verificarRol = require('../middlewares/verificarRol');

// ============================
// CLIENTE
// ============================

// Ver carrito
router.get(
    '/',
    verificarToken,
    verificarRol([3]),
    carritoController.obtenerCarrito
);

// Agregar producto
router.post(
    '/',
    verificarToken,
    verificarRol([3]),
    carritoController.agregarCarrito
);

// Eliminar producto del carrito
router.delete(
    '/:id',
    verificarToken,
    verificarRol([3]),
    carritoController.eliminarCarrito
);

module.exports = router;