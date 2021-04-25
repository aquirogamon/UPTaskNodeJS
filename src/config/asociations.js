const Proyectos = require('../model/Proyectos');
const Tareas = require('../model/Tareas');
const SubTareas = require('../model/SubTareas');
const Usuarios = require('../model/Usuarios');
const TipoProyectos = require('../model/TipoProyectos');
const TipoEstados = require('../model/TipoEstados');

// Añade una clave proyectoId a la tabla Tareas
Tareas.belongsTo(Proyectos);
Proyectos.hasMany(Tareas);

// Añade una clave tareaId a la tabla SubTareas
SubTareas.belongsTo(Tareas);
Tareas.hasMany(SubTareas);

// Añade una clave tipoId a la tabla Proyectos
Proyectos.belongsTo(TipoProyectos);
TipoProyectos.hasMany(Proyectos);

// Añade una clave estadoId a la tabla Proyectos
Proyectos.belongsTo(TipoEstados);
TipoEstados.hasMany(Proyectos);

Proyectos.belongsToMany(Usuarios, {
  through: 'usuarios_proyectos',
  as: "usuariosProyectos",
  foreignKey: 'proyecto_id',
  otherKey: 'usuario_id'
})
Usuarios.belongsToMany(Proyectos, {
  through: 'usuarios_proyectos',
  as: "usuariosProyectos",
  foreignKey: 'usuario_id',
  otherKey: 'proyecto_id'
})
Tareas.belongsToMany(Usuarios, {
  through: 'usuarios_tareas',
  as: "usuariosTareas",
  foreignKey: 'tarea_id',
  otherKey: 'usuario_id'
})
Usuarios.belongsToMany(Tareas, {
  through: 'usuarios_tareas',
  as: "usuariosTareas",
  foreignKey: 'usuario_id',
  otherKey: 'tarea_id'
})