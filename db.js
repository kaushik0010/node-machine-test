const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool instance using the connection string from Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    // Neon requires SSL to connect. 
    // rejectUnauthorized: false is common for development environments
    rejectUnauthorized: false 
  }
});

// Export the pool so we can use it in our routes
module.exports = pool;