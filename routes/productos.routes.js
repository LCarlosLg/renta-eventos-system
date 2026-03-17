const express = require('express');
const router = express.Router();

const productosController = require('../controllers/productos.controller');

const verificarToken = require('../middlewares/verificarToken');
const verificarRol = require('../middlewares/verificarRol');
const verificarCategoria = require('../middlewares/verificarCategoria');


// =====================================
// PUBLICO
// =====================================

// Ver todo el catálogo
router.get('/', productosController.obtenerProductos);


// Ver producto específico
router.get(
    '/:categoria/:id',
    verificarCategoria,
    productosController.obtenerProducto
);

// Actualizar producto (ADMIN)
router.put(
    '/:categoria/:id',
    verificarToken,
    verificarRol([1]),
    verificarCategoria,
    productosController.actualizarProducto
);

// =====================================
// ADMIN
// =====================================

// Crear cristalería
router.post(
    '/cristaleria',
    verificarToken,
    verificarRol([1]),
    productosController.crearCristaleria
);


// Crear mantelería
router.post(
    '/manteleria',
    verificarToken,
    verificarRol([1]),
    productosController.crearManteleria
);


// Eliminar producto
router.delete(
    '/:categoria/:id',
    verificarToken,
    verificarRol([1]),
    verificarCategoria,
    productosController.eliminarProducto
);


module.exports = router;