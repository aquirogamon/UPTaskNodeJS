const Proyectos = require('../model/Proyectos');
const Tareas = require('../model/Tareas');
const subTareas = require('../model/SubTareas');
const Usuarios = require('../model/Usuarios');
const Tipos = require('../model/Tipos');
var _ = require('lodash');
const {
  nest
} = require('../libs/funciones');
const SubTareas = require('../model/SubTareas');
require('../config/asociations');

function groupByEstado(proyectos) {
  // Lista de Proyectos por Año
  const groupByEstadoYear = nest(proyectos, ['estado', 'year']);

  const proyectosByTrue = groupByEstadoYear[true];
  const proyectosByFalse = groupByEstadoYear[false];

  if (proyectosByTrue) {
    var yearsTrue = Object.keys(proyectosByTrue).sort((a, b) => b - a);
  }
  if (proyectosByFalse) {
    var yearsFalse = Object.keys(proyectosByFalse).sort((a, b) => b - a);
  }
  return [yearsFalse, yearsTrue, proyectosByFalse, proyectosByTrue]
}

exports.listaTareas = async (req, res) => {
  const usuarioAd = res.locals.usuario.sAMAccountName;
  const usuarioLocal = res.locals.usuario.email;
  if (!usuarioAd) {
    var usuario = await Usuarios.findOne({
      where: {
        email: usuarioLocal
      }
    })
  } else {
    var usuario = await Usuarios.findOne({
      where: {
        usuario: usuarioAd
      }
    })
  }
  const proyectos = await Proyectos.findAll();
  const tareasUsuario = await Usuarios.findByPk(usuario.id, {
    include: [{
      model: Tareas,
      as: "tareas",
      attributes: ["id", "nombre", "estado", "url_tarea", "prioridad"],
      through: {
        attributes: [],
      },
      include: {
        model: Proyectos,
        attributes: ["id", "nombre", "estado", "url"],
      }
    }, ],
  });
  const {
    tareas
  } = tareasUsuario;

  for (let index = 0; index < tareas.length; index++) {
    tareas[index].nombreProyecto = tareas[index].proyecto.nombre;
    tareas[index].idProyecto = tareas[index].proyecto.id;
    const totalSubTareas = await SubTareas.findAndCountAll({
      where: {
        tareaId: tareas[index].id
      }
    });
    tareas[index].cantidadSubTareas = totalSubTareas.count;
  }

  const groupByEstadoTarea = nest(tareas, ['estado', 'prioridad']);
  const tareasByTrue = groupByEstadoTarea[true];
  const tareasByFalse = groupByEstadoTarea[false];
  if (tareasByTrue) {
    var prioridadTrue = Object.keys(tareasByTrue).sort((a, b) => a - b);
  }
  if (tareasByFalse) {
    var prioridadFalse = Object.keys(tareasByFalse).sort((a, b) => a - b);
  }

  res.render('listaTareas', {
    nombrePagina: 'Lista de Tareas',
    proyectos,
    usuario,
    tareas,
    yearsFalse: groupByEstado(proyectos)[0],
    yearsTrue: groupByEstado(proyectos)[1],
    proyectosByFalse: groupByEstado(proyectos)[2],
    proyectosByTrue: groupByEstado(proyectos)[3],
    prioridadFalse,
    prioridadTrue,
    tareasByFalse,
    tareasByTrue
  });
}