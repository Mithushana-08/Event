const mysql = require('mysql');
const util = require('util');
require('dotenv').config();

const pool = mysql.createPool({
  connectionLimit: 10, // adjust as needed
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Promisify for Node.js async/await.
pool.query = util.promisify(pool.query);

module.exports = pool;