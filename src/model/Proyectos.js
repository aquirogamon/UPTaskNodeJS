const Sequelize = require('sequelize');
const db = require('../config/db');

const slug = require('slug');
const shortid = require('shortid');

const Proyectos = db.define('proyectos', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  year: Sequelize.INTEGER,
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
  descripcion: Sequelize.STRING(200),
  time_begin: Sequelize.DATE,
  time_end: Sequelize.DATE,
  url: Sequelize.STRING(100)
}, {
  hooks: {
    beforeCreate(proyecto) {
      const url = slug(proyecto.nombre).toLowerCase();
      const year = proyecto.createdAt.getFullYear();
      proyecto.url = `${url}-${shortid.generate()}`;
      proyecto.year = year;
    }
  }
});

module.exports = Proyectos;