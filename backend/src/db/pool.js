//The file that accesses the db
require('dotenv').config();
const { Pool } = require('pg');

//connecting to the Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;   //exports the pool so that other files can use it
