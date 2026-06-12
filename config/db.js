const mysql = require('mysql2');

const sslConfig = process.env.DB_SSL === 'true'
  ? {
      ca: process.env.DB_SSL_CA
        ? process.env.DB_SSL_CA.replace(/\\n/g, '\n')
        : undefined
    }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();