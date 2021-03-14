const Proyectos = require('../model/Proyectos');
const Tareas = require('../model/Tareas');
const SubTareas = require('../model/SubTareas');
const Usuarios = require('../model/Usuarios')
const {
  formatDate,
  nest
} = require('../libs/funciones')
var _ = require('lodash');

exports.tareaPorUrl = async (req, res) => {
  const {
    url,
    url_tarea
  } = req.params;
  const proyectosPromise = Proyectos.findAll();
  const proyectoPromise = Proyectos.findOne({
    where: {
      url
    }
  });
  const [proyecto, proyectos] = await Promise.all([proyectoPromise, proyectosPromise]);

  // Consultar tareas del Proyecto actual
  const tarea = await Tareas.findOne({
    where: {
      url_tarea
    }
  });
  const subtareas = await SubTareas.findAll({
    where: {
      tareaId: tarea.id
    }
  });
  const tareaIng = await Tareas.findByPk(tarea.id, {
    include: [{
      model: Usuarios,
      as: "usuarios",
      attributes: ["nombre", "role"],
      through: {
        attributes: [],
      }
    }, ],
  });
  const usuarioPrincipal = tareaIng.usuarios;
  const usuarioRespaldo = tareaIng.usuarios;

  const groupByEstadoYear = nest(proyectos, ['estado', 'year']);

  const proyectosByTrue = groupByEstadoYear[true];
  const proyectosByFalse = groupByEstadoYear[false];

  if (proyectosByFalse) {
    var yearsFalse = Object.keys(proyectosByFalse).sort((a, b) => b - a);
  }
  if (proyectosByTrue) {
    var yearsTrue = Object.keys(proyectosByTrue).sort((a, b) => b - a);
  }

  // Render a la vista
  res.render('subtareas', {
    nombrePagina: 'Proyecto',
    tareaPagina: 'Tarea',
    proyectos,
    proyecto,
    tarea,
    subtareas,
    yearsFalse,
    yearsTrue,
    proyectosByFalse,
    proyectosByTrue,
    usuarioPrincipal,
    usuarioRespaldo
  })
}

exports.agregarSubTarea = async (req, res) => {
  const {
    url,
    url_tarea
  } = req.params;
  // Buscar Proyecto Actual
  const proyectosPromise = Proyectos.findAll();
  const proyectoPromise = Proyectos.findOne({
    where: {
      url
    }
  });
  const [proyecto, proyectos] = await Promise.all([proyectoPromise, proyectosPromise]);
  const tarea = await Tareas.findOne({
    where: {
      url_tarea
    }
  });
  const {
    nombre,
    time_end
  } = req.body;
  tareaId = tarea.id;

  // Grabar tarea en DB
  let errores = [];

  if (!nombre) {
    errores.push({
      'texto': 'Agrega un nombre de la SubTarea'
    })
  }

  if (errores.length > 0) {
    res.render('nuevaSubTarea', {
      nombrePagina: 'Nuevo SubTarea',
      errores,
      proyectos
    })
  } else if (!time_end) {
    await SubTareas.create({
      nombre,
      tareaId
    });
    res.redirect(`/proyecto/${url}/${url_tarea}`);
  } else {
    await SubTareas.create({
      nombre,
      time_end,
      tareaId
    });
    res.redirect(`/proyecto/${url}/${url_tarea}`);
  }
}

exports.cambiarEstadoSubTarea = async (req, res, next) => {
  const {
    id
  } = req.params;
  const subtarea = await SubTareas.findOne({
    where: {
      id
    }
  })
  // Cambiar Estado
  let estado = false;
  if (subtarea.estado === estado) {
    estado = true;
  }
  subtarea.estado = estado;

  const resultado = await subtarea.save();
  if (!resultado) return next();

  res.status(200).send('Actualizado');
}

exports.eliminarSubTarea = async (req, res) => {
  // Eliminar puedes usar req params o query
  const {
    id
  } = req.params;
  const resultado = await SubTareas.destroy({
    where: {
      id
    }
  });

  if (!resultado) {
    return next();
  }
  res.status(200).send('SubTarea Eliminada Correctamente');
}

exports.formularioEditar = async (req, res) => {
  const proyectosPromise = Proyectos.findAll();
  const usuariosPromise = Usuarios.findAll();
  const subtareaPromise = SubTareas.findOne({
    where: {
      id: req.params.id
    }
  });

  const [subtarea, proyectos, usuarios] = await Promise.all([subtareaPromise, proyectosPromise, usuariosPromise]);
  const tarea = await Tareas.findByPk(subtarea.tareaId);
  const proyecto = await Proyectos.findByPk(tarea.proyectoId);

  const fecha_inicio = formatDate(tarea.time_begin);
  const fecha_fin = formatDate(tarea.time_end);

  const groupByEstadoYear = nest(proyectos, ['estado', 'year']);

  const proyectosByTrue = groupByEstadoYear[true];
  const proyectosByFalse = groupByEstadoYear[false];

  if (proyectosByFalse) {
    var yearsFalse = Object.keys(proyectosByFalse).sort((a, b) => b - a);
  }
  if (proyectosByTrue) {
    var yearsTrue = Object.keys(proyectosByTrue).sort((a, b) => b - a);
  }

  res.render('editarSubTarea', {
    nombrePagina: 'Editar SubTarea',
    proyectos,
    proyecto,
    tarea,
    subtarea,
    yearsFalse,
    yearsTrue,
    proyectosByFalse,
    proyectosByTrue,
    fecha_inicio,
    fecha_fin
  });
}

exports.actualizarSubTarea = async (req, res) => {
  const {
    nombre,
    observaciones,
    time_begin,
    time_end
  } = req.body;
  let errores = [];

  // Buscar la SubTarea asociada
  const idSubTarea = req.params.id
  const subtarea = await SubTareas.findByPk(idSubTarea);
  // Buscar la Tarea asociada
  const idTarea = subtarea.tareaId
  const tarea = await Tareas.findByPk(idTarea);
  // Buscar el Proyecto asociada
  const idProyecto = tarea.proyectoId
  const proyecto = await Proyectos.findByPk(idProyecto);

  if (!nombre) {
    errores.push({
      'texto': 'Agrega un nombre a la SubTarea'
    })
  }

  if (time_end) {
    let maximumDate = new Date(Math.max.apply(null, [new Date(time_end), new Date(tarea.time_end)]));
    if (new Date(time_end) > new Date(tarea.time_end)) {
      tarea.time_end = time_end
      await tarea.save();
    }
  }

  if (errores.length > 0) {
    res.render('nuevoProyecto', {
      nombrePagina: 'Nuevo Proyecto',
      errores,
      proyectos
    })
  } else {
    await SubTareas.update({
      nombre,
      observaciones,
      time_begin,
      time_end
    }, {
      where: {
        id: idSubTarea
      }
    });
    res.redirect(`/proyecto/${proyecto.url}/${tarea.url_tarea}`);
  }
}