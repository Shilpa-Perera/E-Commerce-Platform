const mysql = require("mysql2");
const config = require("config");

const pool = mysql.createPool({
  host: process.env.HOST,
  database: process.env.DATABASE,
  user: config.get("db_username"),
  password: config.get("db_password"),
});

module.exports = pool.promise();
