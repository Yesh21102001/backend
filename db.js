// db.js
const mysql = require('mysql2');
require('dotenv').config();  // Load environment variables

// Create a connection pool (recommended for performance)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,  // Limit the number of simultaneous connections
  queueLimit: 0
});

// Export the pool to use in other files
module.exports = pool.promise();  // We are using promise-based queries for easier async/await
