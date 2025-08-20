const mysql = require("mysql2/promise");
require("dotenv").config();

async function connectDB() {
  if (process.env.DB_ENV === "remote") {
    // Railway DB
    return mysql.createConnection({
      host: process.env.REMOTE_HOST,
      port: process.env.REMOTE_PORT,
      user: process.env.REMOTE_USER,
      password: process.env.REMOTE_PASSWORD,
      database: process.env.REMOTE_DATABASE,
      ssl: { rejectUnauthorized: true } // Railway requires SSL
    });
  } else {
    // Local DB
    return mysql.createConnection({
      host: process.env.LOCAL_HOST,
      user: process.env.LOCAL_USER,
      password: process.env.LOCAL_PASSWORD,
      database: process.env.LOCAL_DATABASE
    });
  }
}

module.exports = connectDB;
