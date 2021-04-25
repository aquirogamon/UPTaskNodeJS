const Proyectos = require("../model/Proyectos");
const Tareas = require("../model/Tareas");
const SubTareas = require("../model/SubTareas");
const Usuarios = require("../model/Usuarios");
const TipoProyectos = require('../model/TipoProyectos')
const sequelize = require('sequelize');
const Op = sequelize.Op;
var _ = require("lodash");
const {
  nest
} = require("../libs/funciones");
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
  const proyectos = await Proyectos.findAll();
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
    var tipoProyectos = await TipoProyectos.findAll({
      where: {
        usuario: usuarioAd,
      },
      attributes: ["id"]
    });
  }
  if (usuario.role === 3 && tipoProyectos) {
    arrayTipoProyectos = [];

    tipoProyectos.forEach((tipoproyecto) => {
      arrayTipoProyectos.push(tipoproyecto.id)
    })
    var tareasJefe = await Proyectos.findAll({
      where: {
        tipoproyectoId: {
          [Op.or]: arrayTipoProyectos
        }
      },
      include: {
        model: Tareas,
        as: "usuariosTareas",
        attributes: ["id", "nombre", "estado", "url_tarea", "prioridad"],
        include: {
          model: Proyectos,
          attributes: ["id", "nombre", "estado", "url"],
        },
      },
    })
    tareasUsuario = [];
    for (let i = 0; i < tareasJefe.length; i++) {
      let tareasProyecto = tareasJefe[i].tareas;
      for (let e = 0; e < tareasProyecto.length; e++) {
        tareasUsuario.push(tareasProyecto[e])
      }
    }
    var listaTareas = tareasUsuario;
  } else {
    var tareasUsuario = await Usuarios.findByPk(usuario.id, {
      include: [{
        model: Tareas,
        as: "usuariosTareas",
        attributes: ["id", "nombre", "estado", "url_tarea", "prioridad"],
        through: {
          attributes: [],
        },
        include: {
          model: Proyectos,
          attributes: ["id", "nombre", "estado", "url"],
        },
      }, ],
    });
    var listaTareas = tareasUsuario.tareas;
  }
  const {
    tareas
  } = tareasUsuario;

  for (let index = 0; index < listaTareas.length; index++) {
    listaTareas[index].nombreProyecto = listaTareas[index].proyecto.nombre;
    listaTareas[index].idProyecto = listaTareas[index].proyecto.id;
    const totalSubTareas = await SubTareas.findAndCountAll({
      where: {
        tareaId: listaTareas[index].id,
      },
    });
    listaTareas[index].cantidadSubTareas = totalSubTareas.count;
  }

  const groupByEstadoTarea = nest(listaTareas, ["estado", "prioridad"]);
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
    var tipoProyectos = await TipoProyectos.findAll({
      where: {
        usuario: usuarioAd,
      },
      attributes: ["id"]
    });
  }
  if (usuario.role === 3 && tipoProyectos) {
    arrayTipoProyectos = [];
    tipoProyectos.forEach((tipoproyecto) => {
      arrayTipoProyectos.push(tipoproyecto.id)
    })
    var proyectosJefe = await Proyectos.findAll({
      where: {
        tipoproyectoId: {
          [Op.or]: arrayTipoProyectos
        }
      },
      include: {
        model: Tareas,
        include: [{
            model: SubTareas,
          },
          {
            model: Usuarios,
            as: "usuariosTareas"
          }
        ]
      },
    })
    proyectosUsuario = proyectosJefe;
  } else {
    var proyectosUsuarioDB = await Usuarios.findByPk(usuario.id, {
      include: [{
        model: Proyectos,
        as: "usuariosProyectos",
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
          include: [{
              model: SubTareas,
            },
            {
              model: Usuarios,
              as: "usuariosTareas"
            }
          ]
        },
      }, ],
    });
    proyectosUsuario = proyectosUsuarioDB.proyectos
    console.log(proyectosUsuarioDB)
  }


  let listaProyectos = [];
  const proyectosALL = proyectosUsuario;
  proyectosALL.forEach((proyecto) => {
    let items = {
      id: `p_${proyecto.id}`,
      text: proyecto.nombre,
      "type": "project",
      start_date: proyecto.time_begin.format("DD-MM-YYYY"),
      duration: Math.abs(proyecto.time_end - proyecto.time_begin) / (1000 * 60 * 60 * 24),
      progress: proyecto.avance / 100,
    };
    listaProyectos.push(items);
    const tareasALL = proyecto.tareas;
    tareasALL.forEach((tarea) => {
      if (tarea.usuariosTareas.length) {
        user = tarea.usuariosTareas[0].id
      } else {
        user = 0
      }

      // Validar si la Tarea tiene SubTareas para agregarle el type
      if (tarea.subtareas.length) {
        let items = {
          id: `t_${tarea.id}`,
          text: tarea.nombre,
          "type": "project",
          user,
          start_date: tarea.time_begin.format("DD-MM-YYYY"),
          duration: Math.abs(tarea.time_end - tarea.time_begin) / (1000 * 60 * 60 * 24),
          progress: tarea.avance / 100,
          parent: `p_${tarea.proyectoId}`,
        };
        listaProyectos.push(items);
      } else {
        let items = {
          id: `t_${tarea.id}`,
          text: tarea.nombre,
          user,
          start_date: tarea.time_begin.format("DD-MM-YYYY"),
          duration: Math.abs(tarea.time_end - tarea.time_begin) / (1000 * 60 * 60 * 24),
          progress: tarea.avance / 100,
          parent: `p_${tarea.proyectoId}`,
        };
        listaProyectos.push(items);
      }

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
    data: listaProyectos
  });
};

exports.diagramaGanttUser = async (req, res) => {
  let listaUsuarios = [{
    key: 0,
    label: "N/A"
  }];
  const usuariosALL = await Usuarios.findAll();
  usuariosALL.forEach((usuario) => {
    let items = {
      key: usuario.id,
      label: usuario.nombre
    };
    listaUsuarios.push(items);
  })
  res.send(listaUsuarios);
}

exports.diagramaGantt = async (req, res) => {
  const usuarioAd = res.locals.usuario.sAMAccountName;
  const usuarioLocal = res.locals.usuario.email;
  if (!usuarioAd) {
    var usuarioDB = await Usuarios.findOne({
      where: {
        email: usuarioLocal,
      },
    });
  } else {
    var usuarioDB = await Usuarios.findOne({
      where: {
        usuario: usuarioAd,
      },
    });
    var tipoProyectos = await TipoProyectos.findAll({
      where: {
        usuario: usuarioAd,
      },
      attributes: ["id"]
    });
  }
  res.render("diagramaGantt", {
    nombrePagina: "Diagrama de Gantt",
    usuarioDB
  });
};