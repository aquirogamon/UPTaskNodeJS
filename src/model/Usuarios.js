const Sequelize = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario: {
    type: Sequelize.STRING,
    // allowNull: false,
    validate: {
      // notNull: {
      //   msg: "El campo no puede ser nulo"
      // },
      len: {
        args: [3, 255],
        msg: "El usuario tiene que ser entre 3 y 255 caracteres"
      }
    },
  },
  nombre: {
    type: Sequelize.STRING
  },
  titulo: {
    type: Sequelize.STRING,
  },
  role: {
    type: Sequelize.INTEGER(1),
    defaultValue: 0
  },
  email: {
    type: Sequelize.STRING(60),
    allowNull: false,
    unique: {
      args: true,
      msg: 'Correo ya está en uso'
    },
    validate: {
      isEmail: {
        msg: 'Agrega un correo válido'
      },
      notEmpty: {
        msg: 'Favor ingrese un correo electronico'
      }
    }
  },
  password: {
    type: Sequelize.STRING(60),
    // allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El password no puede ir vacio'
      }
    }
  },
  token: Sequelize.STRING,
  expiracion: Sequelize.DATE,
  estado: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
}, {
  hooks: {
    beforeCreate(usuario) {
      usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
    }
  }
});

// Métodos personalizados
Usuarios.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = Usuarios;