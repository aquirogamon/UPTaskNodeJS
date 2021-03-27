const passport = require('passport');
const sequelize = require('sequelize');
const Op = sequelize.Op;
const Usuarios = require('../model/Usuarios')
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.auntenticarUsuario = passport.authenticate('ldapauth', {
  successRedirect: '/',
  failureRedirect: '/iniciar-sesion',
  failureFlash: 'Usuario o Password Inválido',
  badRequestMessage: 'Ambos campos son obligatorios',
})

// autenticar el usuario de forma local
exports.autenticarUsuarioLocal = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/cuenta-local',
  failureFlash: true,
  badRequestMessage: 'Ambos Campos son Obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {
  // Si el usuario está autenticado adelante
  if (req.isAuthenticated()) {
    return next();
  }
  // Si no está autenticado
  return res.redirect('/iniciar-sesion');
}

exports.cerrarSession = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/iniciar-sesion');
  })
}

exports.enviarToken = async (req, res) => {
  const {
    email
  } = req.body;
  const usuario = await Usuarios.findOne({
    where: {
      email
    }
  });

  // Si no existe el usuario
  if (!usuario) {
    req.flash('error', 'No existe esa cuenta');
    return res.redirect('/reestablecer');
  }

  usuario.token = crypto.randomBytes(20).toString('hex');
  usuario.expiracion = Date.now() + 3600000;
  // Guarda en DB
  await usuario.save();
  const resetUrl = `${req.headers.origin}/reestablecer/${usuario.token}`

  // Enviar el correo con el Token
  await enviarEmail.enviar({
    usuario,
    subject: 'Password Reset',
    resetUrl,
    archivo: 'reestablecerPassword'
  })

  // Direccionar a ...
  req.flash('correcto', 'Se envió un mensaje a tu correo');
  res.redirect('/cuenta-local');
}

exports.validarToken = async (req, res) => {
  const token = req.params.token;
  const usuario = await Usuarios.findOne({
    where: {
      token
    }
  })
  if (!usuario) {
    req.flash('error', 'No Válido');
    res.redirect('/reestablecer');
  }

  // Formulario para generar el password
  res.render('resetPassword', {
    nombrePagina: 'Reestablecer Contraseña'
  })
}

exports.actualizarPassword = async (req, res) => {
  // Valida Token y Fecha de Expiración
  const token = req.params.token;
  const usuario = await Usuarios.findOne({
    where: {
      token,
      expiracion: {
        [Op.gte]: Date.now()
      }
    }
  })

  // Si no existe usuario
  if (!usuario) {
    req.flash('error', 'No Válido');
    res.redirect('/reestablecer');
  }

  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  usuario.token = null;
  usuario.expiracion = null;
  await usuario.save();

  req.flash('correcto', 'Tu password se modificó correctamente');
  res.redirect('/cuenta-local');
}