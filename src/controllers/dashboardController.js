const Proyectos = require("../model/Proyectos");
const Tareas = require("../model/Tareas");
const SubTareas = require("../model/SubTareas");
const Usuarios = require("../model/Usuarios");
var _ = require("lodash");
const { nest } = require("../libs/funciones");
require("../config/asociations");
require("date-format-lite");

function groupByEstado(proyectos) {
  // Lista de Proyectos por Año
  const groupByEstadoYear = nest(proyectos, ["estado", "year"]);

  const proyectosByTrue = groupByEstadoYear[true];
  const proyectosByFalse = groupByEstadoYear[false];

  if (proyectosByTrue) {
    var yearsTrue = Object.keys(proyectosByTrue).sort((a, b) => b - a);
  }
  if (proyectosByFalse) {
    var yearsFalse = Object.keys(proyectosByFalse).sort((a, b) => b - a);
  }
  return [yearsFalse, yearsTrue, proyectosByFalse, proyectosByTrue];
}

exports.listaTareas = async (req, res) => {
  const usuarioAd = res.locals.usuario.sAMAccountName;
  const usuarioLocal = res.locals.usuario.email;
  if (!usuarioAd) {
    var usuario = await Usuarios.findOne({
      where: {
        email: usuarioLocal,
      },
    });
  } else {
    var usuario = await Usuarios.findOne({
      where: {
        usuario: usuarioAd,
      },
    });
  }
  const proyectos = await Proyectos.findAll();
  const tareasUsuario = await Usuarios.findByPk(usuario.id, {
    include: [
      {
        model: Tareas,
        as: "tareas",
        attributes: ["id", "nombre", "estado", "url_tarea", "prioridad"],
        through: {
          attributes: [],
        },
        include: {
          model: Proyectos,
          attributes: ["id", "nombre", "estado", "url"],
        },
      },
    ],
  });
  const { tareas } = tareasUsuario;

  for (let index = 0; index < tareas.length; index++) {
    tareas[index].nombreProyecto = tareas[index].proyecto.nombre;
    tareas[index].idProyecto = tareas[index].proyecto.id;
    const totalSubTareas = await SubTareas.findAndCountAll({
      where: {
        tareaId: tareas[index].id,
      },
    });
    tareas[index].cantidadSubTareas = totalSubTareas.count;
  }

  const groupByEstadoTarea = nest(tareas, ["estado", "prioridad"]);
  const tareasByTrue = groupByEstadoTarea[true];
  const tareasByFalse = groupByEstadoTarea[false];
  if (tareasByTrue) {
    var prioridadTrue = Object.keys(tareasByTrue).sort((a, b) => a - b);
  }
  if (tareasByFalse) {
    var prioridadFalse = Object.keys(tareasByFalse).sort((a, b) => a - b);
  }

  res.render("listaTareas", {
    nombrePagina: "Lista de Tareas",
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
    tareasByTrue,
  });
};

exports.diagramaGanttData = async (req, res) => {
  const usuarioAd = res.locals.usuario.sAMAccountName;
  const usuarioLocal = res.locals.usuario.email;
  if (!usuarioAd) {
    var usuario = await Usuarios.findOne({
      where: {
        email: usuarioLocal,
      },
    });
  } else {
    var usuario = await Usuarios.findOne({
      where: {
        usuario: usuarioAd,
      },
    });
  }
  const proyectosUsuario = await Usuarios.findByPk(usuario.id, {
    include: [
      {
        model: Proyectos,
        as: "proyectos",
        attributes: [
          "id",
          "nombre",
          "estado",
          "avance",
          "time_begin",
          "time_end",
        ],
        through: {
          attributes: [],
        },
        include: {
          model: Tareas,
          include: {
            model: SubTareas,
          },
        },
      },
    ],
  });

  let listaProyectos = [];
  const proyectosALL = proyectosUsuario.proyectos;
  proyectosALL.forEach((proyecto) => {
    console.log('Proyecto: ', proyecto.nombre)
    console.log('Fecha Inicio: ', proyecto.time_begin)
    console.log('Fecha Fin: ', proyecto.time_end)
    console.log('Duración: ', Math.abs(proyecto.time_end - proyecto.time_begin) / (1000 * 60 * 60 * 24))
    let items = {
      id: `p_${proyecto.id}`,
      text: proyecto.nombre,
      start_date: proyecto.time_begin.format("DD-MM-YYYY"),
      duration: Math.abs(proyecto.time_end - proyecto.time_begin) / (1000 * 60 * 60 * 24),
      progress: proyecto.avance / 100,
    };
    listaProyectos.push(items);
    const tareasALL = proyecto.tareas;
    tareasALL.forEach((tarea) => {
      let items = {
        id: `t_${tarea.id}`,
        text: tarea.nombre,
        start_date: tarea.time_begin.format("DD-MM-YYYY"),
        duration: Math.abs(tarea.time_end - tarea.time_begin) / (1000 * 60 * 60 * 24),
        progress: tarea.avance / 100,
        parent: `p_${tarea.proyectoId}`,
      };
      listaProyectos.push(items);
      const subtareasALL = tarea.subtareas;
      subtareasALL.forEach((subtarea) => {
        let items = {
          id: `st_${subtarea.id}`,
          text: subtarea.nombre,
          start_date: subtarea.time_begin.format("DD-MM-YYYY"),
          duration: Math.abs(subtarea.time_end - subtarea.time_begin) / (1000 * 60 * 60 * 24),
          progress: subtarea.estado,
          parent: `t_${subtarea.tareaId}`,
        };
        listaProyectos.push(items);
      });
    });
  });

  res.send({
    data: listaProyectos,
  });
};

exports.diagramaGantt = async (req, res) => {
  res.render("diagramaGantt", {
    nombrePagina: "Diagrama de Gantt",
  });
};
