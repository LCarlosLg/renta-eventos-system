require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// =======================
// MIDDLEWARES
// =======================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/backups', express.static(path.join(__dirname, 'backups')));

// =======================
// RUTAS
// =======================

const authRoutes = require('./routes/auth.routes');
const clienteRoutes = require('./routes/clientes.routes');
const empleadoRoutes = require('./routes/empleado.routes');
const adminRoutes = require('./routes/admin.routes');

const productosRoutes = require('./routes/productos.routes');
const carritoRoutes = require('./routes/carrito.routes');
const pedidosRoutes = require('./routes/pedidos.routes');

//SOPORTE (AGREGADO)
const soporteRoutes = require('./routes/soporte.routes');

// =======================
// USO DE RUTAS
// =======================

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/empleado', empleadoRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api/productos', productosRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/pedidos', pedidosRoutes);

// SOPORTE ACTIVO
app.use('/api/soporte', soporteRoutes);

// =======================
// RUTA PRINCIPAL
// =======================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'auth', 'login.html'));
});

// =======================
// 404
// =======================

app.use((req, res) => {
    res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// =======================
// SERVIDOR
// =======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});