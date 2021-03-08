const db = require('../config/db');
const Proyectos = require('../model/Proyectos');
const Tareas = require('../model/Tareas');
const SubTareas = require('../model/SubTareas');
const Usuarios = require('../model/Usuarios');
const Tipos = require('../model/Tipos')
require('../config/asociations');

// Usuarios
const {
  usuarios
} = require('./usuariosSeed');
const {
  proyectos
} = require('./proyectosSeed');
const {
  ingprincipal_proyecto
} = require('./ingprincipalproyectoSeed');
const {
  ingsecundario_proyecto
} = require('./ingsecundarioproyectoSeed');
const {
  tareas
} = require('./tareasSeed');
const {
  subtareas
} = require('./subtareasSeed');

const {
  tipos
} = require('./tiposSeed');

db.sync({
    force: false
  }).then(() => {
    // Conexión establecida
    console.log("Conexión establecida...");
  })
  .then(() => {
    // Rellenar Tipos de Proyectos
    usuarios.forEach(usuario => Usuarios.create(usuario));
  })
// .then(() => {
//   // Rellenar proyectos
//   proyectos.forEach(proyecto => Proyectos.create(proyecto));
// })
// .then(() => {
//   // Rellenar proyectos
//   usuarios.forEach(usuario => Usuarios.create(usuario));
// })
// .then(() => {
//   // Rellenar proyectos
//   tareas.forEach(tarea => Tareas.create(tarea));
// })