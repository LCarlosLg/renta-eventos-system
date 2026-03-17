const express = require('express');
const router = express.Router();

const verificarRol = require('../middlewares/verificarRol');
const verificarToken = require('../middlewares/verificarToken');
const clientesController = require('../controllers/clientes.controller');

// Solo CLIENTE (rol 3)
router.use(verificarToken, verificarRol([3]));

// Ver perfil
router.get('/perfil', clientesController.obtenerPerfil);
router.put('/perfil', clientesController.actualizarPerfil);

// Historial de rentas
router.get('/historial', clientesController.historialRentas);

module.exports = router;