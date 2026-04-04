const express = require('express');
const router = express.Router();

const verificarRol = require('../middlewares/verificarRol');
const verificarToken = require('../middlewares/verificarToken');
const clientesController = require('../controllers/clientes.controller');

// Middlewares globales
router.use(verificarToken, verificarRol([3]));

// Rutas
router.get('/perfil', clientesController.obtenerPerfil);
router.put('/perfil', clientesController.actualizarPerfil);
router.get('/historial', clientesController.historialRentas);

module.exports = router;