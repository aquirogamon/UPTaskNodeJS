const express = require('express');
const routes = require('./routes/index.routes');
const path = require('path');
// const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const passport = require('passport');
require('./config/passport')(passport);
require('dotenv').config();

// Helpers con algunas funciones
const helpers = require('./helpers');

// Conexion a la BD
const db = require('./config/db');
require('./config/asociations');

db.sync()
  .then(() => console.log('Conectado a la BD MySQL'))
  .catch(error => console.log(error));

// Crear un app en express
const app = express();

// Cargar archivos estáticos
app.use(express.static(path.join(__dirname, './public')));

// Habilitar PUG
app.set('view engine', 'pug');

// Habilitar body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Agregamos express validator a toda la aplicación
// app.use(expressValidator());

// Añadir carpeta de vistas
app.set('views', path.join(__dirname, './views'));

app.use(cookieParser());

// Permite navegar entre paginas sin volver a auntenticar

app.use(session({
  secret: 'supersecreto',
  resave: false,
  saveUninitialized: false
}))

// Agregar flash messages
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Pasar Helpers a toda la apliación
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  res.locals.usuario = {
    ...req.user
  } || null;
  next();
})

// app.use(morgan('dev'));

app.use('/', routes());

// 404 Pagina no exixte
app.use((req, res, next) => {
  next(createError(404, 'No Encontrado'));
})

// Administrar errores
app.use((error, req, res, next) => {
  res.locals.mensaje = error.message
  res.render('error')
})

// Escucha el puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log(`El servidor está corriendo en el puerto ${port}`);
});
