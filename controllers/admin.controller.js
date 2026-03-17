const db = require('../db/renta_manteleria_cristaleria_db');
const fs = require('fs');
const path = require('path');

function toCsv(rows) {
  if (!rows || rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  const escape = (value) => {
    if (value === null || value === undefined) return '';
    const s = String(value).replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  }
  return lines.join('\n');
}

// Obtener métricas para dashboard
exports.obtenerDashboard = async (req, res) => {
  try {
    const [[{ total_usuarios }]] = await db.query(`SELECT COUNT(*) AS total_usuarios FROM usuarios`);
    const [[{ total_clientes }]] = await db.query(`SELECT COUNT(*) AS total_clientes FROM usuarios WHERE id_rol=3`);
    const [[{ total_empleados }]] = await db.query(`SELECT COUNT(*) AS total_empleados FROM usuarios WHERE id_rol=2`);
    const [[{ total_productos }]] = await db.query(`SELECT (SELECT COUNT(*) FROM cristaleria) + (SELECT COUNT(*) FROM manteleria) AS total_productos`);
    const [[{ productos_disponibles }]] = await db.query(`SELECT (SELECT COUNT(*) FROM cristaleria WHERE estado='disponible') + (SELECT COUNT(*) FROM manteleria WHERE estado='disponible') AS productos_disponibles`);
    const [[{ total_pedidos }]] = await db.query(`SELECT COUNT(*) AS total_pedidos FROM pedidos`);

    res.json({
      total_usuarios,
      total_clientes,
      total_empleados,
      total_productos,
      productos_disponibles,
      total_pedidos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error al obtener métricas' });
  }
};

// Listar usuarios (clientes + empleados)
exports.listarUsuarios = async (req, res) => {
  try {
    const [usuarios] = await db.query(`
      SELECT id_usuario, nombre, email, telefono, estado, id_rol
      FROM usuarios
      WHERE id_rol IN (2,3)
    `);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

// Cambiar estado de usuario (activo, moroso, bloqueado, inactivo)
exports.cambiarEstadoUsuario = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const estadosValidos = ['activo', 'inactivo', 'moroso', 'bloqueado'];

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ mensaje: 'Estado inválido' });
  }

  try {
    await db.query(`UPDATE usuarios SET estado = ? WHERE id_usuario = ?`, [estado, id]);
    res.json({ mensaje: 'Estado de usuario actualizado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar estado de usuario' });
  }
};

// Exportar clientes a CSV
exports.exportarClientesCSV = async (req, res) => {
  try {
    const [clientes] = await db.query(`
      SELECT id_usuario, nombre, email, telefono, direccion, estado, created_at
      FROM usuarios
      WHERE id_rol = 3
    `);

    const csv = toCsv(clientes);

    res.header('Content-Type', 'text/csv');
    res.attachment('clientes_export.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al exportar clientes' });
  }
};

// Generar respaldo básico (JSON) de tablas clave
exports.respaldoJSON = async (req, res) => {
  try {
    const [usuarios] = await db.query(`SELECT * FROM usuarios`);
    const [cristaleria] = await db.query(`SELECT * FROM cristaleria`);
    const [manteleria] = await db.query(`SELECT * FROM manteleria`);
    const [pedidos] = await db.query(`SELECT * FROM pedidos`);
    const [detalles] = await db.query(`SELECT * FROM pedido_detalles`);

    const respaldo = {
      fecha: new Date().toISOString(),
      usuarios,
      cristaleria,
      manteleria,
      pedidos,
      pedido_detalles: detalles,
    };

    const fileName = `respaldo_${Date.now()}.json`;
    const filePath = path.join(__dirname, '..', 'backups');

    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath);
    }

    fs.writeFileSync(path.join(filePath, fileName), JSON.stringify(respaldo, null, 2));

    res.json({ mensaje: 'Respaldo generado', archivo: `/backups/${fileName}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ mensaje: 'Error al generar respaldo' });
  }
};
