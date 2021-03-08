const timezone = 'America/Lima'
require('dotenv').config();

const {
  Sequelize
} = require('sequelize');

const db = new Sequelize(process.env.DB_NOMBRE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT,
  timezone,
  dialectOptions: {
    timezone: "local",
  },
  /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
});

module.exports = db;