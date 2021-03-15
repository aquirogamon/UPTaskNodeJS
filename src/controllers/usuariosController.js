const Usuarios = require("../model/Usuarios");
const enviarEmail = require("../handlers/email")

exports.formCrearCuenta = (req, res) => {
  res.render('crearCuenta', {
    nombrePagina: 'Crear una Cuenta en UPTask',
  })
}

exports.formIniciarSesion = (req, res) => {
  res.render('iniciarSesion', {
    nombrePagina: 'Iniciar Sesión en UPTask con Clave Única',
  })
}

exports.crearCuenta = async (req, res) => {

  // Leer los datos
  const {
    nombre,
    email,
    password
  } = req.body;

  try {
    await Usuarios.create({
      email,
      password,
      nombre
    });

    // Crear una URL para confirmar cuenta
    const confirmarUrl = `${req.headers.origin}/confirmar/${email}`;

    // Crear el objeto de usuario
    const usuario = {
      email
    }
    // Enviar email
    await enviarEmail.enviar({
      usuario,
      subject: 'Confirmar Cuenta',
      confirmarUrl,
      archivo: 'confirmarCuenta'
    })

    // Redireccionar a iniciar sesion.
    req.flash('correcto', 'Enviamos un correo, confirmar tu cuenta');
    res.redirect('/cuenta-local')
  } catch (error) {
    req.flash('error', error.errors.map(error => error.message))
    res.render('crearCuenta', {
      nombrePagina: 'Crear una Cuenta en UPTask',
      email,
      password
    })
  }
}

exports.formIniciarSesionLocal = (req, res) => {
  res.render('cuentaLocal', {
    nombrePagina: 'Iniciar Sesión en UPTask con cuenta Local',
  })
}

exports.formRestablecerPassword = (req, res) => {
  res.render('reestablecer', {
    nombrePagina: 'Reestablecer Contraseña'
  })
}

exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.email
    }
  })
  if (!usuario) {
    req.flash('error', 'Usuario no Valido')
    res.redirect('/crear-cuenta')
  }

  usuario.estado = 1;
  await usuario.save();

  req.flash('correcto', 'Cuenta activada Correctamente');
  res.redirect('/cuenta-local');
}