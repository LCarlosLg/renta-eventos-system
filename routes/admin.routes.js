const express = require('express');
const router = express.Router();

const verificarRol = require('../middlewares/verificarRol');
const verificarToken = require('../middlewares/verificarToken');
const adminController = require('../controllers/admin.controller');

// Solo ADMIN (rol 1)
router.use(verificarToken, verificarRol([1]));

// Dashboard métricas
router.get('/dashboard', adminController.obtenerDashboard);

// Usuarios
router.get('/usuarios', adminController.listarUsuarios);
router.put('/usuarios/:id/estado', adminController.cambiarEstadoUsuario);

// Exportaciones
router.get('/export/clientes', adminController.exportarClientesCSV);

// Respaldo de base de datos (JSON)
router.get('/respaldo', adminController.respaldoJSON);

module.exports = router;