const Sequelize = require('sequelize');
const db = require('../config/db');

const TipoProyectos = db.define('tipoproyectos', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "El campo no puede ser nulo"
      },
      len: {
        args: [3, 255],
        msg: "El nombre tiene que ser entre 3 y 255 caracteres"
      }
    },
  },
  responsable: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: "El campo no puede ser nulo"
      },
      len: {
        args: [3, 255],
        msg: "El nombre tiene que ser entre 3 y 255 caracteres"
      }
    },
  },
  usuario: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [3, 255],
        msg: "El nombre tiene que ser entre 3 y 255 caracteres"
      }
    },
  },
});

module.exports = TipoProyectos;