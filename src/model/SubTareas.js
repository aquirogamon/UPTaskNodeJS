const Sequelize = require('sequelize');
const db = require('../config/db');
const Tareas = require('./Tareas');

const SubTareas = db.define('subtareas', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: Sequelize.STRING(100),
  observaciones: Sequelize.STRING(100),
  estado: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  time_begin: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  time_end: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  peso: {
    type: Sequelize.STRING(1),
    allowNull: false,
    defaultValue: 1
  },
});

module.exports = SubTareas;