const db = require("../config/db");
const Proyectos = require("../model/Proyectos");
const Tareas = require("../model/Tareas");
const SubTareas = require("../model/SubTareas");
const Usuarios = require("../model/Usuarios");
const TipoProyectos = require("../model/TipoProyectos");
require("../config/asociations");

// Usuarios
const { usuarios } = require("./usuariosSeed");
const { proyectos } = require("./proyectosSeed");
const { tareas } = require("./tareasSeed");
const { subtareas } = require("./subtareasSeed");
const { tipos } = require("./tiposSeed");

db.sync({
  force: false,
})
  .then(() => {
    // Conexión establecida
    console.log("Conexión establecida...");
  })
  // .then(async () => {
  //   // Rellenar Tipos de Proyectos
  //   await usuarios.forEach((usuario) => Usuarios.create(usuario));
  // })
  // .then(async () => {
  //   // Rellenar Proyectos
  //   await proyectos.forEach((proyecto) => Proyectos.create(proyecto));
  // })
  // .then(async () => {
  //   // Rellenar Tipos de Proyectos
  //   await tipos.forEach((tipo) => TipoProyectos.create(tipo));
  // })
  // .then(async () => {
  //   // Rellenar Tareas
  //   await tareas.forEach((tarea) => Tareas.create(tarea));
  // })
  .then(async () => {
    // Rellenar SubTareas
    await subtareas.forEach((subtarea) => SubTareas.create(subtarea));
  });
// .then(() => {
//   // Rellenar proyectos
//   tareas.forEach(tarea => Tareas.create(tarea));
// })
