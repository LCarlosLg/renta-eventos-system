require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

(async () => {
  const newPassword = 'admin123';
  const hash = await bcrypt.hash(newPassword, 10);

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  });

  const [result] = await conn.execute(
    'UPDATE usuarios SET password = ? WHERE email = ?',
    [hash, 'admin@example.com']
  );

  console.log('Contraseña actualizada. Nueva contraseña (texto claro):', newPassword);
  console.log('Filas afectadas:', result.affectedRows);

  await conn.end();
})();
