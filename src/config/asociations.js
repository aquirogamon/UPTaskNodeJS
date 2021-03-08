const Proyectos = require('../model/Proyectos');
const Tareas = require('../model/Tareas');
const SubTareas = require('../model/SubTareas');
const Usuarios = require('../model/Usuarios');
const Tipos = require('../model/Tipos');
const Estados = require('../model/EstadosProyecto');

// Añade una clave proyectoId a la tabla Tareas
Tareas.belongsTo(Proyectos);

// Añade una clave tareaId a la tabla SubTareas
SubTareas.belongsTo(Tareas);

// Añade una clave tipoId a la tabla Proyectos
Proyectos.belongsTo(Tipos);

// Añade una clave estadoId a la tabla Proyectos
Proyectos.belongsTo(Estados);

Proyectos.belongsToMany(Usuarios, {
  through: 'usuarios_proyectos',
  as: "usuarios",
  foreignKey: 'proyecto_id',
  otherKey: 'usuario_id'
})
Usuarios.belongsToMany(Proyectos, {
  through: 'usuarios_proyectos',
  as: "proyectos",
  foreignKey: 'usuario_id',
  otherKey: 'proyecto_id'
})
Tareas.belongsToMany(Usuarios, {
  through: 'usuarios_tareas',
  as: "usuarios",
  foreignKey: 'tarea_id',
  otherKey: 'usuario_id'
})
Usuarios.belongsToMany(Tareas, {
  through: 'usuarios_tareas',
  as: "tareas",
  foreignKey: 'usuario_id',
  otherKey: 'tarea_id'
})


// El usuario pertenece a varios Proyectos
// Crear una nueva tabla llamada 'usuario_proyecto'
// Usuarios.belongsToMany(Proyectos, {
//   through: 'ingprincipal_proyecto',
//   foreignKey: 'ingprincipalId'
// });
// Proyectos.belongsToMany(Usuarios, {
//   through: 'ingprincipal_proyecto',
//   foreignKey: 'ingprincipalId'
// });
// Usuarios.belongsToMany(Proyectos, {
//   through: 'ingsecundario_proyecto',
//   foreignKey: 'ingsecundarioId'
// });
// // El usuario pertenece a varias Tareas
// // Crear una nueva tabla llamada 'usuario_tarea'
// Usuarios.belongsToMany(Tareas, {
//   through: 'ingprincipal_tarea',
//   foreignKey: 'ingprincipalId'
// });
// Usuarios.belongsToMany(Tareas, {
//   through: 'ingsecundario_tarea',
//   foreignKey: 'ingsecundarioId'
// });
// // El usuario pertenece a varias SubTareas
// // Crear una nueva tabla llamada 'usuario_subtarea'
// Usuarios.belongsToMany(SubTareas, {
//   through: 'ingprincipal_subtarea',
//   foreignKey: 'ingprincipalId'
// });
// Usuarios.belongsToMany(SubTareas, {
//   through: 'ingsecundario_subtarea',
//   foreignKey: 'ingsecundarioId'
// });