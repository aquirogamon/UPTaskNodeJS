const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');
const {
  quitarAcentos,
  removeAccents
} = require('../libs/funciones')
const slug = require('slug');
const shortid = require('shortid');

const Tareas = db.define('tareas', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: Sequelize.STRING(100),
  estado: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  avance: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 0
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
  url_tarea: Sequelize.STRING(100),
  prioridad: {
    type: Sequelize.STRING(1),
    allowNull: false,
    defaultValue: 3
  },
}, {
  hooks: {
    beforeCreate(tarea) {
      console.log(tarea.nombre);
      const cadena = removeAccents(tarea.nombre);
      console.log(cadena);
      const url = slug(cadena).toLowerCase();
      tarea.url_tarea = `${url}-${shortid.generate()}`;
    }
  }
});

module.exports = Tareas;