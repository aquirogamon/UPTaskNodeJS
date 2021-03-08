const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const LdapStrategy = require('passport-ldapauth');

// Referencia al Modelo donde vamos a autenticar
const Usuarios = require('../model/Usuarios');

let ldapConfig = {
  server: {
    url: 'ldap://172.19.3.130:389',
    bindDN: 'CN=USRLIMDC,OU=Usuarios de Sistema,DC=tim,DC=com,DC=pe',
    bindCredentials: 'Cl4r0peru51!',
    searchBase: 'DC=tim,DC=com,DC=pe',
    searchFilter: '(sAMAccountName={{username}})',
  },
  usernameField: "usuario",
  passwordField: 'password',
  authMode: 0,
  debug: false,
};

module.exports = function (passport) {

  passport.serializeUser(function (usuario, done) {
    done(null, usuario);
  });

  passport.deserializeUser(function (usuario, done) {
    done(null, usuario);
  });

  passport.use(
    new LdapStrategy(ldapConfig, async (user, done) => {
      const usuario = user.sAMAccountName;
      const nombre = user.displayName;
      const titulo = user.title;
      const email = user.mail;
      const usuarioDB = await Usuarios.findOne({
        where: {
          usuario
        }
      })
      if (!usuarioDB) {
        const newUsuario = await Usuarios.create({
          usuario,
          nombre,
          titulo,
          email,
        })
        return done(null, user);
      } else {
        await Usuarios.update({
          usuario,
          nombre,
          titulo,
          email,
        }, {
          where: {
            usuario
          }
        });
        return done(null, user);
      }
    })
  );
  passport.use(
    new LocalStrategy(
      // por default passport espera un usuario y password
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const usuario = await Usuarios.findOne({
            where: {
              email,
              estado: 1
            }
          });
          // El usuario existe, password incorrecto
          if (!usuario.verificarPassword(password)) {
            return done(null, false, {
              message: 'Password Incorrecto'
            })
          }
          // El email existe, y el password correcto
          return done(null, usuario);
        } catch (error) {
          // Ese usuario no existe
          return done(null, false, {
            message: 'Esa cuenta no existe'
          })
        }
      }
    )
  );
}